import crypto from 'node:crypto';
import {
  claimNextOutboxEvent,
  markOutboxPublished,
  markOutboxFailed,
  MongoQueueAdapter,
  checkPaymentsHealth,
  closePaymentsDb,
} from '@adzunova/payments-db';
import { scrubSecrets } from '@adzunova/problem-details';

export interface WorkerTickResult {
  outboxProcessed: number;
  queueJobsProcessed: number;
}

export class PaymentsWorker {
  readonly workerId: string;
  private readonly queue = new MongoQueueAdapter();
  private stopping = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(workerId = `pay-worker-${process.pid}-${crypto.randomUUID().slice(0, 8)}`) {
    this.workerId = workerId;
  }

  async runOnce(handlers?: {
    onOutboxEvent?: (eventType: string, payloadJson: string) => Promise<void>;
    onQueueJob?: (jobType: string, payloadJson: string) => Promise<void>;
  }): Promise<WorkerTickResult> {
    let outboxProcessed = 0;
    let queueJobsProcessed = 0;

    const event = await claimNextOutboxEvent(this.workerId);
    if (event) {
      try {
        if (handlers?.onOutboxEvent) {
          await handlers.onOutboxEvent(event.eventType, event.payloadJson);
        }
        await markOutboxPublished(event.eventId, this.workerId);
        outboxProcessed += 1;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Outbox handler failed';
        await markOutboxFailed(event, scrubSecrets(msg));
      }
    }

    const job = await this.queue.leaseNext('payments_default', this.workerId);
    if (job) {
      try {
        if (handlers?.onQueueJob) {
          await handlers.onQueueJob(job.jobType, job.payloadJson);
        }
        await this.queue.ack(job.dedupKey, this.workerId);
        queueJobsProcessed += 1;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Queue job failed';
        await this.queue.fail(job, scrubSecrets(msg));
      }
    }

    return { outboxProcessed, queueJobsProcessed };
  }

  start(pollIntervalMs = 2000): void {
    const loop = async () => {
      if (this.stopping) return;
      try {
        await this.runOnce();
      } catch {
        // Errors are scrubbed and logged minimally; worker stays alive
      }
      if (!this.stopping) {
        this.timer = setTimeout(loop, pollIntervalMs);
      }
    };
    this.timer = setTimeout(loop, pollIntervalMs);
  }

  async shutdown(): Promise<void> {
    this.stopping = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    await closePaymentsDb();
  }

  static async health() {
    return checkPaymentsHealth();
  }
}
