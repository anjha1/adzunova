import './config';
import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { randomBytes } from 'crypto';
import { monitorEventLoopDelay } from 'perf_hooks';
import { IdentityService } from './application/services/identity-application-service';
import { createAuthRouter } from './presentation/http/routes/auth-routes';
import { getDatabase, getDatabaseStatus } from './infrastructure/persistence/database';

const app: Express = express();
const isDev = (process.env.NODE_ENV ?? 'development') !== 'production';

// ── Startup Instrumentation ───────────────────────────────────────────────────
const bootStart = Date.now();
console.log(`[startup +0ms] Initializing Express identity-service application`);

// Event-loop lag monitor in development (records lag every 5 seconds)
if (isDev) {
  const histogram = monitorEventLoopDelay({ resolution: 20 });
  histogram.enable();
  const lagInterval = setInterval(() => {
    const p50 = (histogram.percentile(50) / 1e6).toFixed(2);
    const p99 = (histogram.percentile(99) / 1e6).toFixed(2);
    const max = (histogram.max / 1e6).toFixed(2);
    if (histogram.max > 1e8) { // >100ms spike
      console.warn(`⚠️ [event-loop] Lag spike detected: p50=${p50}ms, p99=${p99}ms, max=${max}ms`);
    }
    histogram.reset();
  }, 5000);
  lagInterval.unref(); // Allow process to exit cleanly without waiting on interval
}

// ── Dependency-Free Liveness Endpoints (Registered FIRST) ─────────────────────
// Must respond in <5ms without awaiting any database, auth, or I/O
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'identity-service' });
});

app.get('/health/live', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'identity-service' });
});

// ── Global Middleware ─────────────────────────────────────────────────────────

// 1. Correlation Request ID
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (!req.headers['x-request-id']) {
    req.headers['x-request-id'] = randomBytes(12).toString('hex');
  }
  next();
});

// 2. Request Timing & Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const reqStart = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || '-';

  res.on('finish', () => {
    const elapsedMs = Date.now() - reqStart;
    const path = req.path;
    // Skip noisy polling in dev logs
    if (path !== '/health' && path !== '/health/live') {
      console.log(`[http] ${req.method} ${path} ${res.statusCode} ${elapsedMs}ms - req:${requestId}`);
    }
  });
  next();
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ── Readiness Endpoint (Checks DB Store State) ────────────────────────────────
app.get('/health/ready', (_req: Request, res: Response) => {
  const dbStatus = getDatabaseStatus();

  if (dbStatus.state === 'connected') {
    return res.status(200).json({
      status: 'ready',
      service: 'identity-service',
      db: dbStatus.type,
      elapsedMs: dbStatus.connectDurationMs,
    });
  }

  if (dbStatus.state === 'fallback') {
    if (!isDev) {
      return res.status(503).json({
        status: 'degraded',
        service: 'identity-service',
        db: 'in-memory-fallback',
        error: 'Production requires real MongoDB cluster connection.',
      });
    }
    return res.status(200).json({
      status: 'ready',
      service: 'identity-service',
      db: 'in-memory-fallback',
      warning: 'Operating on volatile in-memory store in development mode.',
    });
  }

  // Still connecting
  return res.status(503).json({
    status: 'connecting',
    service: 'identity-service',
    db: 'connecting',
  });
});

// ── Domain & API Routes ───────────────────────────────────────────────────────
const identityService = new IdentityService();

app.get('/api/v1', (_req: Request, res: Response) => {
  res.json({ service: 'identity-service', domain: 'Identity', version: 'v1' });
});

app.use('/api/v1/auth', createAuthRouter(identityService));

// ── Server Listen & Background DB Initialization ──────────────────────────────
const port = Number(process.env.IDENTITY_SERVICE_PORT || process.env.PORT || 4101);
const host = process.env.IDENTITY_SERVICE_HOST || '0.0.0.0';

console.log(`[startup +${Date.now() - bootStart}ms] Binding HTTP server to ${host}:${port}...`);

const server = app.listen(port, host, () => {
  const addr = server.address();
  const boundStr = typeof addr === 'object' && addr ? `${addr.address}:${addr.port}` : `${host}:${port}`;
  console.log(`[startup +${Date.now() - bootStart}ms] 🚀 Server listening on ${boundStr}`);
  console.log(`  • Liveness:  http://127.0.0.1:${port}/health`);
  console.log(`  • Readiness: http://127.0.0.1:${port}/health/ready\n`);

  // Eagerly connect to DB in the BACKGROUND after listening
  // Never blocks server.listen or the /health endpoint
  const dbStart = Date.now();
  console.log(`[startup +${Date.now() - bootStart}ms] Background database initialization started...`);

  getDatabase()
    .then((db) => {
      const isInMemory = db.constructor?.name === 'InMemoryDatabaseStore';
      const duration = Date.now() - dbStart;
      if (isInMemory) {
        console.warn(`[startup +${Date.now() - bootStart}ms] ⚠️ Using resilient in-memory database store (fallback after ${duration}ms).`);
      } else {
        console.log(`[startup +${Date.now() - bootStart}ms] ✅ Connected to MongoDB Atlas cluster in ${duration}ms.`);
      }
    })
    .catch((err) => {
      console.error(`[startup +${Date.now() - bootStart}ms] ❌ Database initialization failed:`, err.message);
    });
});

// Explicit error handler for port conflicts (EADDRINUSE)
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [FATAL] Port ${port} is already in use by another process.`);
    console.error(`   Run 'pnpm doctor' or kill the existing process occupying port ${port}.\n`);
  } else {
    console.error(`\n❌ [FATAL] Server listen error:`, err);
  }
  process.exit(1);
});

// ── Graceful Shutdown ─────────────────────────────────────────────────────────
function gracefulShutdown(signal: string) {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  server.close(() => {
    console.log('  ✓ HTTP server closed.');
    process.exit(0);
  });

  // Force exit if connections do not close in 3 seconds
  setTimeout(() => {
    console.warn('  ⚠️ Force exiting after shutdown timeout.');
    process.exit(1);
  }, 3000).unref();
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export { app, identityService };
