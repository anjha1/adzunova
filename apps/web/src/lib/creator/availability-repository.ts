import { getCreatorMongoDb } from './db';
import { AppProblemError } from '@adzunova/problem-details';

export const AVAILABILITY_STATUSES = [
  'available',
  'limited',
  'busy',
  'shoot',
  'blackout',
] as const;

export type DayAvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

export interface AvailabilityDayEntry {
  date: number;
  status: DayAvailabilityStatus;
  note?: string;
}

export interface CreatorAvailabilityMonth {
  creatorId: string;
  year: number;
  month: number; // 1..12
  timezone: string;
  days: AvailabilityDayEntry[];
  version: number;
  updatedAt: string;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function validateYearMonth(year: number, month: number): void {
  if (!Number.isInteger(year) || year < 2024 || year > 2100) {
    throw new AppProblemError({
      status: 400,
      code: 'INVALID_AVAILABILITY_YEAR',
      title: 'Invalid Year',
      detail: 'Year must be an integer between 2024 and 2100.',
    });
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new AppProblemError({
      status: 400,
      code: 'INVALID_AVAILABILITY_MONTH',
      title: 'Invalid Month',
      detail: 'Month must be an integer between 1 and 12.',
    });
  }
}

function validateTimezone(tz: string): string {
  const trimmed = tz.trim();
  if (!trimmed) return 'Asia/Kolkata';
  try {
    Intl.DateTimeFormat(undefined, { timeZone: trimmed });
    return trimmed;
  } catch {
    throw new AppProblemError({
      status: 400,
      code: 'INVALID_TIMEZONE',
      title: 'Invalid Timezone',
      detail: `Unsupported IANA timezone: ${trimmed}`,
    });
  }
}

export async function getCreatorAvailability(
  creatorId: string,
  year: number,
  month: number
): Promise<CreatorAvailabilityMonth> {
  validateYearMonth(year, month);
  const db = await getCreatorMongoDb();
  const doc = await db
    .collection('creator_availability')
    .findOne({ creatorId, year, month });

  const totalDays = daysInMonth(year, month);
  if (!doc) {
    return {
      creatorId,
      year,
      month,
      timezone: 'Asia/Kolkata',
      days: Array.from({ length: totalDays }, (_, i) => ({
        date: i + 1,
        status: 'available' as const,
      })),
      version: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    creatorId: String(doc.creatorId),
    year: Number(doc.year),
    month: Number(doc.month),
    timezone: String(doc.timezone || 'Asia/Kolkata'),
    days: Array.isArray(doc.days)
      ? doc.days.map((d: Record<string, unknown>) => ({
          date: Number(d.date),
          status: (d.status as DayAvailabilityStatus) ?? 'available',
          ...(d.note ? { note: String(d.note) } : {}),
        }))
      : [],
    version: Number(doc.version ?? 1),
    updatedAt: String(doc.updatedAt),
  };
}

export async function upsertCreatorAvailability(
  creatorId: string,
  input: {
    year: number;
    month: number;
    timezone?: string;
    days: AvailabilityDayEntry[];
  }
): Promise<CreatorAvailabilityMonth> {
  validateYearMonth(input.year, input.month);
  const timezone = validateTimezone(input.timezone ?? 'Asia/Kolkata');
  const maxDay = daysInMonth(input.year, input.month);

  if (!Array.isArray(input.days) || input.days.length === 0) {
    throw new AppProblemError({
      status: 400,
      code: 'INVALID_AVAILABILITY_DAYS',
      title: 'Invalid Days',
      detail: 'Availability days array must not be empty.',
    });
  }

  const normalizedMap = new Map<number, AvailabilityDayEntry>();
  for (const d of input.days) {
    if (!Number.isInteger(d.date) || d.date < 1 || d.date > maxDay) {
      throw new AppProblemError({
        status: 400,
        code: 'INVALID_AVAILABILITY_DAY',
        title: 'Invalid Day Number',
        detail: `Day ${d.date} is out of range for ${input.year}-${input.month}`,
      });
    }
    if (!AVAILABILITY_STATUSES.includes(d.status)) {
      throw new AppProblemError({
        status: 400,
        code: 'INVALID_AVAILABILITY_STATUS',
        title: 'Invalid Status',
        detail: `Invalid availability status: ${d.status}`,
      });
    }
    const note = d.note ? String(d.note).trim().slice(0, 200) : undefined;
    normalizedMap.set(d.date, {
      date: d.date,
      status: d.status,
      ...(note ? { note } : {}),
    });
  }

  const days = Array.from({ length: maxDay }, (_, i) => {
    const dayNum = i + 1;
    return normalizedMap.get(dayNum) ?? { date: dayNum, status: 'available' as const };
  });

  const now = new Date().toISOString();
  const db = await getCreatorMongoDb();
  const updated = await db.collection('creator_availability').findOneAndUpdate(
    { creatorId, year: input.year, month: input.month },
    {
      $set: {
        creatorId,
        year: input.year,
        month: input.month,
        timezone,
        days,
        updatedAt: now,
      },
      $inc: { version: 1 },
    },
    { upsert: true, returnDocument: 'after' }
  );

  return {
    creatorId: String(updated?.creatorId ?? creatorId),
    year: Number(updated?.year ?? input.year),
    month: Number(updated?.month ?? input.month),
    timezone: String(updated?.timezone ?? timezone),
    days,
    version: Number(updated?.version ?? 1),
    updatedAt: String(updated?.updatedAt ?? now),
  };
}

export async function isCreatorDateBlackout(
  creatorId: string,
  isoDate: string
): Promise<boolean> {
  const m = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return false;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const doc = await getCreatorAvailability(creatorId, year, month);
  const entry = doc.days.find((d) => d.date === day);
  return entry?.status === 'blackout' || entry?.status === 'busy';
}
