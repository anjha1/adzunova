import crypto from 'node:crypto';
import { getCreatorMongoDb } from './db';
import { AppProblemError } from '@adzunova/problem-details';

export interface CreatorPackage {
  id: string;
  creatorId: string;
  name: string;
  tagline: string;
  deliverables: string[];
  originalPricePaise: string;
  discountedPricePaise: string;
  turnaroundDays: number;
  revisions: number;
  isActive: boolean;
  version: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCreatorPackageInput {
  name: string;
  tagline?: string;
  deliverables?: string[];
  originalPricePaise?: string;
  discountedPricePaise: string;
  turnaroundDays?: number;
  revisions?: number;
  isActive?: boolean;
}

export interface UpdateCreatorPackageInput {
  name?: string;
  tagline?: string;
  deliverables?: string[];
  originalPricePaise?: string;
  discountedPricePaise?: string;
  turnaroundDays?: number;
  revisions?: number;
  isActive?: boolean;
}

function validatePaiseString(val: string, label: string): bigint {
  if (!/^\d+$/.test(val.trim())) {
    throw new AppProblemError({
      status: 400,
      code: 'INVALID_PACKAGE_PRICE',
      title: 'Invalid Price',
      detail: `${label} must be a non-negative integer paise string`,
    });
  }
  return BigInt(val.trim());
}

function toDto(doc: Record<string, unknown>): CreatorPackage {
  return {
    id: String(doc.id),
    creatorId: String(doc.creatorId),
    name: String(doc.name),
    tagline: String(doc.tagline ?? ''),
    deliverables: Array.isArray(doc.deliverables) ? doc.deliverables.map(String) : [],
    originalPricePaise: String(doc.originalPricePaise),
    discountedPricePaise: String(doc.discountedPricePaise),
    turnaroundDays: Number(doc.turnaroundDays ?? 7),
    revisions: Number(doc.revisions ?? 1),
    isActive: Boolean(doc.isActive),
    version: Number(doc.version ?? 1),
    deletedAt: doc.deletedAt ? String(doc.deletedAt) : null,
    createdAt: String(doc.createdAt),
    updatedAt: String(doc.updatedAt),
  };
}

export async function listCreatorPackages(
  creatorId: string,
  options: { activeOnly?: boolean } = {}
): Promise<CreatorPackage[]> {
  const db = await getCreatorMongoDb();
  const filter: Record<string, unknown> = { creatorId, deletedAt: null };
  if (options.activeOnly) {
    filter.isActive = true;
  }
  const docs = await db
    .collection('creator_packages')
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => toDto(d as Record<string, unknown>));
}

export async function getCreatorPackageById(
  creatorId: string,
  id: string
): Promise<CreatorPackage | null> {
  const db = await getCreatorMongoDb();
  const doc = await db
    .collection('creator_packages')
    .findOne({ id, creatorId, deletedAt: null });
  return doc ? toDto(doc as Record<string, unknown>) : null;
}

export async function getPublicActivePackageById(
  creatorId: string,
  id: string
): Promise<CreatorPackage | null> {
  const db = await getCreatorMongoDb();
  const doc = await db
    .collection('creator_packages')
    .findOne({ id, creatorId, isActive: true, deletedAt: null });
  return doc ? toDto(doc as Record<string, unknown>) : null;
}

export async function createCreatorPackage(
  creatorId: string,
  input: CreateCreatorPackageInput
): Promise<CreatorPackage> {
  const name = input.name.trim();
  if (name.length < 2 || name.length > 120) {
    throw new AppProblemError({
      status: 400,
      code: 'INVALID_PACKAGE_NAME',
      title: 'Invalid Package Name',
      detail: 'Package name must be between 2 and 120 characters.',
    });
  }

  const discounted = validatePaiseString(input.discountedPricePaise, 'discountedPricePaise');
  if (discounted <= BigInt(0)) {
    throw new AppProblemError({
      status: 400,
      code: 'INVALID_PACKAGE_PRICE',
      title: 'Invalid Price',
      detail: 'Package price must be greater than zero.',
    });
  }
  const original = input.originalPricePaise
    ? validatePaiseString(input.originalPricePaise, 'originalPricePaise')
    : discounted;

  const deliverables = (input.deliverables ?? ['Custom Package Deliverables'])
    .map((d) => d.trim())
    .filter(Boolean);
  if (deliverables.length === 0) {
    throw new AppProblemError({
      status: 400,
      code: 'INVALID_DELIVERABLES',
      title: 'Invalid Deliverables',
      detail: 'At least one deliverable is required.',
    });
  }

  const now = new Date().toISOString();
  const pkg: CreatorPackage = {
    id: `pkg_${crypto.randomUUID()}`,
    creatorId,
    name,
    tagline: (input.tagline ?? '').trim() || 'Custom promotional package bundle.',
    deliverables,
    originalPricePaise: (original >= discounted ? original : discounted).toString(10),
    discountedPricePaise: discounted.toString(10),
    turnaroundDays: Math.max(1, Math.min(365, Math.trunc(input.turnaroundDays ?? 7))),
    revisions: Math.max(0, Math.min(20, Math.trunc(input.revisions ?? 1))),
    isActive: input.isActive ?? true,
    version: 1,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  const db = await getCreatorMongoDb();
  try {
    await db.collection('creator_packages').insertOne(pkg);
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    if (code === 11000) {
      throw new AppProblemError({
        status: 409,
        code: 'PACKAGE_NAME_CONFLICT',
        title: 'Duplicate Package Name',
        detail: `A package named "${name}" already exists.`,
      });
    }
    throw err;
  }

  return pkg;
}

export async function updateCreatorPackage(
  creatorId: string,
  id: string,
  input: UpdateCreatorPackageInput
): Promise<CreatorPackage | null> {
  const db = await getCreatorMongoDb();
  const existing = await getCreatorPackageById(creatorId, id);
  if (!existing) return null;

  const updates: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (name.length < 2 || name.length > 120) {
      throw new AppProblemError({
        status: 400,
        code: 'INVALID_PACKAGE_NAME',
        title: 'Invalid Package Name',
        detail: 'Package name must be between 2 and 120 characters.',
      });
    }
    updates.name = name;
  }
  if (input.tagline !== undefined) updates.tagline = input.tagline.trim();
  if (input.deliverables !== undefined) {
    const deliverables = input.deliverables.map((d) => d.trim()).filter(Boolean);
    if (deliverables.length === 0) {
      throw new AppProblemError({
        status: 400,
        code: 'INVALID_DELIVERABLES',
        title: 'Invalid Deliverables',
        detail: 'At least one deliverable is required.',
      });
    }
    updates.deliverables = deliverables;
  }
  if (input.discountedPricePaise !== undefined) {
    const disc = validatePaiseString(input.discountedPricePaise, 'discountedPricePaise');
    if (disc <= BigInt(0)) {
      throw new AppProblemError({
        status: 400,
        code: 'INVALID_PACKAGE_PRICE',
        title: 'Invalid Price',
        detail: 'Package price must be greater than zero.',
      });
    }
    updates.discountedPricePaise = disc.toString(10);
  }
  if (input.originalPricePaise !== undefined) {
    updates.originalPricePaise = validatePaiseString(
      input.originalPricePaise,
      'originalPricePaise'
    ).toString(10);
  }
  if (input.turnaroundDays !== undefined) {
    updates.turnaroundDays = Math.max(1, Math.min(365, Math.trunc(input.turnaroundDays)));
  }
  if (input.revisions !== undefined) {
    updates.revisions = Math.max(0, Math.min(20, Math.trunc(input.revisions)));
  }
  if (input.isActive !== undefined) {
    updates.isActive = Boolean(input.isActive);
  }

  try {
    const updated = await db.collection('creator_packages').findOneAndUpdate(
      { id, creatorId, deletedAt: null },
      { $set: updates, $inc: { version: 1 } },
      { returnDocument: 'after' }
    );
    return updated ? toDto(updated as Record<string, unknown>) : null;
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    if (code === 11000) {
      throw new AppProblemError({
        status: 409,
        code: 'PACKAGE_NAME_CONFLICT',
        title: 'Duplicate Package Name',
        detail: 'Another package already uses that name.',
      });
    }
    throw err;
  }
}

export async function toggleCreatorPackageStatus(
  creatorId: string,
  id: string,
  isActive: boolean
): Promise<CreatorPackage | null> {
  return updateCreatorPackage(creatorId, id, { isActive });
}

export async function deleteCreatorPackage(
  creatorId: string,
  id: string
): Promise<boolean> {
  const db = await getCreatorMongoDb();
  const now = new Date().toISOString();
  const res = await db.collection('creator_packages').updateOne(
    { id, creatorId, deletedAt: null },
    { $set: { deletedAt: now, isActive: false, updatedAt: now }, $inc: { version: 1 } }
  );
  return res.modifiedCount > 0;
}
