import crypto from 'node:crypto';
import { Long } from 'mongodb';
import { getPaymentsMongoClient, getPaymentsMongoDb } from './client';
import { appendPaymentAuditEvent } from './audit';
import { AppProblemError } from '@adzunova/problem-details';

export const LEDGER_ACCOUNT_CODES = [
  'BRAND_PAYMENT_CLEARING',
  'ESCROW_HELD',
  'PLATFORM_REVENUE',
  'GST_PAYABLE',
  'TDS_PAYABLE',
  'CREATOR_PAYABLE',
  'CREATOR_WALLET',
  'REFUND_PAYABLE',
  'DISPUTE_FROZEN',
] as const;

export type LedgerAccountCode = (typeof LEDGER_ACCOUNT_CODES)[number];
export type LedgerDirection = 'DEBIT' | 'CREDIT';
export type LedgerOwnerType = 'PLATFORM' | 'CREATOR' | 'BRAND';

const NORMAL_SIDE: Record<LedgerAccountCode, LedgerDirection> = {
  BRAND_PAYMENT_CLEARING: 'DEBIT',
  ESCROW_HELD: 'CREDIT',
  PLATFORM_REVENUE: 'CREDIT',
  GST_PAYABLE: 'CREDIT',
  TDS_PAYABLE: 'CREDIT',
  CREATOR_PAYABLE: 'CREDIT',
  CREATOR_WALLET: 'CREDIT',
  REFUND_PAYABLE: 'CREDIT',
  DISPUTE_FROZEN: 'CREDIT',
};

export interface LedgerLineInput {
  accountCode: LedgerAccountCode;
  ownerType: LedgerOwnerType;
  ownerId: string;
  currency?: string;
  direction: LedgerDirection;
  amountPaise: bigint;
}

export interface PostLedgerEntryInput {
  idempotencyKey: string;
  bookingId?: string;
  eventType: string;
  actorId: string;
  actorRole: string;
  reason: string;
  lines: LedgerLineInput[];
}

export interface PostLedgerEntryResult {
  entryId: string;
  idempotentReplay: boolean;
  totalPaise: bigint;
}

function makeAccountKey(
  accountCode: LedgerAccountCode,
  ownerType: LedgerOwnerType,
  ownerId: string,
  currency = 'INR'
): string {
  return `${accountCode}:${ownerType}:${ownerId}:${currency}`;
}

function toBsonInt64(val: bigint): Long {
  return Long.fromBigInt(val);
}

function fromBsonInt64(val: unknown): bigint {
  if (typeof val === 'bigint') return val;
  if (typeof val === 'number') return BigInt(val);
  if (val && typeof val === 'object' && 'toBigInt' in val && typeof (val as Long).toBigInt === 'function') {
    return (val as Long).toBigInt();
  }
  return BigInt(String(val ?? 0));
}

export async function postLedgerEntry(
  input: PostLedgerEntryInput
): Promise<PostLedgerEntryResult> {
  if (!input.idempotencyKey || input.idempotencyKey.trim().length < 4) {
    throw new AppProblemError({
      status: 400,
      code: 'LEDGER_INVALID_IDEMPOTENCY_KEY',
      title: 'Invalid Ledger Idempotency Key',
      detail: 'Ledger entry requires a non-empty idempotencyKey',
    });
  }
  if (!input.lines || input.lines.length < 2) {
    throw new AppProblemError({
      status: 400,
      code: 'LEDGER_UNBALANCED_LINES',
      title: 'Invalid Ledger Entry',
      detail: 'Double-entry ledger requires at least 2 lines',
    });
  }

  let totalDebit = BigInt(0);
  let totalCredit = BigInt(0);
  for (const line of input.lines) {
    if (typeof line.amountPaise !== 'bigint' || line.amountPaise <= BigInt(0)) {
      throw new AppProblemError({
        status: 400,
        code: 'LEDGER_INVALID_AMOUNT',
        title: 'Invalid Ledger Line Amount',
        detail: 'Every ledger line amountPaise must be a positive bigint',
      });
    }
    if (line.direction === 'DEBIT') totalDebit += line.amountPaise;
    else totalCredit += line.amountPaise;
  }

  if (totalDebit !== totalCredit) {
    throw new AppProblemError({
      status: 422,
      code: 'LEDGER_IMBALANCE',
      title: 'Ledger Entry Unbalanced',
      detail: `Debit sum (${totalDebit.toString()}) does not equal Credit sum (${totalCredit.toString()})`,
    });
  }

  const client = await getPaymentsMongoClient();
  const db = await getPaymentsMongoDb();
  const existing = await db
    .collection('pay_ledger_entries')
    .findOne({ idempotencyKey: input.idempotencyKey });
  if (existing) {
    return {
      entryId: String(existing.entryId),
      idempotentReplay: true,
      totalPaise: fromBsonInt64(existing.totalPaise),
    };
  }

  const entryId = `le_${crypto.randomUUID()}`;
  const now = new Date();
  let replayResult: PostLedgerEntryResult | null = null;

  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const entriesCol = db.collection('pay_ledger_entries');
      const linesCol = db.collection('pay_ledger_lines');
      const accountsCol = db.collection('pay_ledger_accounts');

      const already = await entriesCol.findOne(
        { idempotencyKey: input.idempotencyKey },
        { session }
      );
      if (already) {
        replayResult = {
          entryId: String(already.entryId),
          idempotentReplay: true,
          totalPaise: fromBsonInt64(already.totalPaise),
        };
        return;
      }

      await entriesCol.insertOne(
        {
          entryId,
          idempotencyKey: input.idempotencyKey,
          bookingId: input.bookingId ?? null,
          eventType: input.eventType,
          actorId: input.actorId,
          actorRole: input.actorRole,
          reason: input.reason,
          totalPaise: toBsonInt64(totalDebit),
          createdAt: now,
        },
        { session }
      );

      for (let i = 0; i < input.lines.length; i++) {
        const line = input.lines[i];
        const currency = line.currency ?? 'INR';
        const accountKey = makeAccountKey(line.accountCode, line.ownerType, line.ownerId, currency);
        const normalSide = NORMAL_SIDE[line.accountCode];

        await linesCol.insertOne(
          {
            entryId,
            lineIndex: i,
            accountKey,
            accountCode: line.accountCode,
            ownerType: line.ownerType,
            ownerId: line.ownerId,
            direction: line.direction,
            amountPaise: toBsonInt64(line.amountPaise),
            bookingId: input.bookingId ?? null,
            createdAt: now,
          },
          { session }
        );

        const debitDelta = line.direction === 'DEBIT' ? line.amountPaise : BigInt(0);
        const creditDelta = line.direction === 'CREDIT' ? line.amountPaise : BigInt(0);
        const balanceDelta =
          line.direction === normalSide ? line.amountPaise : -line.amountPaise;

        await accountsCol.updateOne(
          { accountKey },
          {
            $setOnInsert: {
              accountKey,
              accountCode: line.accountCode,
              ownerType: line.ownerType,
              ownerId: line.ownerId,
              currency,
              normalSide,
              createdAt: now,
            },
            $inc: {
              debitTotalPaise: toBsonInt64(debitDelta),
              creditTotalPaise: toBsonInt64(creditDelta),
              balancePaise: toBsonInt64(balanceDelta),
              version: 1,
            },
            $set: { updatedAt: now },
          },
          { upsert: true, session }
        );
      }

      await appendPaymentAuditEvent(
        {
          actorId: input.actorId,
          actorRole: input.actorRole,
          action: `LEDGER_${input.eventType}`,
          resourceType: 'LEDGER_ENTRY',
          resourceId: entryId,
          reason: input.reason,
          payload: {
            bookingId: input.bookingId ?? null,
            totalPaise: totalDebit.toString(10),
            lineCount: input.lines.length,
          },
        },
        session
      );
    });
  } finally {
    await session.endSession();
  }

  if (replayResult) return replayResult;
  return { entryId, idempotentReplay: false, totalPaise: totalDebit };
}

export async function getLedgerAccountBalance(params: {
  accountCode: LedgerAccountCode;
  ownerType: LedgerOwnerType;
  ownerId: string;
  currency?: string;
}): Promise<{
  debitTotalPaise: bigint;
  creditTotalPaise: bigint;
  balancePaise: bigint;
  version: number;
}> {
  const db = await getPaymentsMongoDb();
  const accountKey = makeAccountKey(
    params.accountCode,
    params.ownerType,
    params.ownerId,
    params.currency ?? 'INR'
  );
  const doc = await db.collection('pay_ledger_accounts').findOne({ accountKey });
  if (!doc) {
    return {
      debitTotalPaise: BigInt(0),
      creditTotalPaise: BigInt(0),
      balancePaise: BigInt(0),
      version: 0,
    };
  }
  return {
    debitTotalPaise: fromBsonInt64(doc.debitTotalPaise),
    creditTotalPaise: fromBsonInt64(doc.creditTotalPaise),
    balancePaise: fromBsonInt64(doc.balancePaise),
    version: Number(doc.version ?? 1),
  };
}

export async function verifyLedgerInvariants(): Promise<{
  ok: boolean;
  entriesChecked: number;
  accountsChecked: number;
  globalDebitPaise: string;
  globalCreditPaise: string;
  errors: string[];
}> {
  const db = await getPaymentsMongoDb();
  const errors: string[] = [];

  const entries = await db.collection('pay_ledger_entries').find({}).toArray();
  const lines = await db.collection('pay_ledger_lines').find({}).toArray();
  const accounts = await db.collection('pay_ledger_accounts').find({}).toArray();

  const linesByEntry = new Map<string, typeof lines>();
  const totalsByAccount = new Map<string, { debit: bigint; credit: bigint }>();
  let globalDebit = BigInt(0);
  let globalCredit = BigInt(0);

  for (const line of lines) {
    const entryId = String(line.entryId);
    const list = linesByEntry.get(entryId) ?? [];
    list.push(line);
    linesByEntry.set(entryId, list);

    const amt = fromBsonInt64(line.amountPaise);
    const key = String(line.accountKey);
    const accTotals = totalsByAccount.get(key) ?? { debit: BigInt(0), credit: BigInt(0) };
    if (line.direction === 'DEBIT') {
      accTotals.debit += amt;
      globalDebit += amt;
    } else {
      accTotals.credit += amt;
      globalCredit += amt;
    }
    totalsByAccount.set(key, accTotals);
  }

  if (globalDebit !== globalCredit) {
    errors.push(
      `Global debit/credit mismatch: debit=${globalDebit.toString()} credit=${globalCredit.toString()}`
    );
  }

  for (const entry of entries) {
    const entryId = String(entry.entryId);
    const entryLines = linesByEntry.get(entryId) ?? [];
    let d = BigInt(0);
    let c = BigInt(0);
    for (const l of entryLines) {
      const amt = fromBsonInt64(l.amountPaise);
      if (l.direction === 'DEBIT') d += amt;
      else c += amt;
    }
    const expectedTotal = fromBsonInt64(entry.totalPaise);
    if (d !== c || d !== expectedTotal) {
      errors.push(`Entry ${entryId} unbalanced: debit=${d} credit=${c} total=${expectedTotal}`);
    }
  }

  for (const acc of accounts) {
    const key = String(acc.accountKey);
    const computed = totalsByAccount.get(key) ?? { debit: BigInt(0), credit: BigInt(0) };
    const storedDebit = fromBsonInt64(acc.debitTotalPaise);
    const storedCredit = fromBsonInt64(acc.creditTotalPaise);
    const storedBal = fromBsonInt64(acc.balancePaise);
    const expectedBal =
      acc.normalSide === 'DEBIT'
        ? computed.debit - computed.credit
        : computed.credit - computed.debit;

    if (storedDebit !== computed.debit || storedCredit !== computed.credit || storedBal !== expectedBal) {
      errors.push(
        `Account projection mismatch for ${key}: stored=(${storedDebit},${storedCredit},${storedBal}) computed=(${computed.debit},${computed.credit},${expectedBal})`
      );
    }
  }

  return {
    ok: errors.length === 0,
    entriesChecked: entries.length,
    accountsChecked: accounts.length,
    globalDebitPaise: globalDebit.toString(10),
    globalCreditPaise: globalCredit.toString(10),
    errors,
  };
}
