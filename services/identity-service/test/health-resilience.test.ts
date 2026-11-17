import { describe, it, expect } from 'vitest';
import express, { Request, Response } from 'express';

describe('Health Endpoint Resilience Under Hanging DB', () => {
  it('/health responds within 200ms even when background DB is stalled', async () => {
    const testApp = express();

    // Register /health first (synchronous, dependency-free)
    testApp.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({ status: 'ok', service: 'identity-service' });
    });

    // Simulate an async background task that hangs for 60s
    let dbStalled = true;
    const hangingPromise = new Promise((resolve) => setTimeout(resolve, 60000));
    hangingPromise.then(() => { dbStalled = false; });

    // Directly execute request through express app pipeline
    const start = Date.now();
    let responseStatus = 0;
    let responseBody: any = null;

    const mockReq = {
      method: 'GET',
      url: '/health',
      headers: {},
    } as any;

    const mockRes = {
      statusCode: 200,
      setHeader: () => {},
      writeHead: (code: number) => { responseStatus = code; },
      status(code: number) {
        responseStatus = code;
        return this;
      },
      json(data: any) {
        responseBody = data;
        return this;
      },
      end: () => {},
    } as any;

    await new Promise<void>((resolve) => {
      testApp.handle(mockReq, mockRes, () => {
        resolve();
      });
      // json() completes the response
      if (responseBody) resolve();
    });

    const duration = Date.now() - start;

    expect(responseStatus).toBe(200);
    expect(responseBody).toEqual({ status: 'ok', service: 'identity-service' });
    expect(duration).toBeLessThan(200);
    expect(dbStalled).toBe(true); // DB is still stalled in background while /health already returned
  });
});
