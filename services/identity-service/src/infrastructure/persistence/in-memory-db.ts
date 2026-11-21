import { Db } from 'mongodb';
import {
  UserEntity,
  CreatorProfileEntity,
  BrandProfileEntity,
  IdentityEntity,
  SessionEntity,
  VerificationTokenEntity,
} from '../../domain/entities/models';

export interface IDatabaseStore {
  collection(name: 'users'): ICollection<UserEntity>;
  collection(name: 'identities'): ICollection<IdentityEntity>;
  collection(name: 'creator_profiles'): ICollection<CreatorProfileEntity>;
  collection(name: 'brand_profiles'): ICollection<BrandProfileEntity>;
  collection(name: 'sessions'): ICollection<SessionEntity>;
  collection(name: 'verification_tokens'): ICollection<VerificationTokenEntity>;
  collection<T = any>(name: string): ICollection<T>;
}

export interface ICollection<T> {
  findOne(filter: any): Promise<T | null>;
  find(filter?: any): { toArray(): Promise<T[]> };
  insertOne(doc: any): Promise<{ insertedId: any }>;
  updateOne(filter: any, update: any): Promise<{ modifiedCount: number }>;
  updateMany(filter: any, update: any): Promise<{ modifiedCount: number }>;
  createIndex(spec: any, options?: any): Promise<string>;
}

/**
 * In-Memory Database store that precisely mimics MongoDB collections,
 * used seamlessly as fallback during local development or testing when remote DB is offline.
 */
class InMemoryCollection<T extends Record<string, any>> implements ICollection<T> {
  private docs: T[] = [];

  async findOne(filter: any): Promise<T | null> {
    const match = this.docs.find((doc) => {
      for (const key of Object.keys(filter)) {
        if (key === '$or') {
          return filter.$or.some((sub: any) => this.matchesSub(doc, sub));
        }
        if (filter[key] && typeof filter[key] === 'object') {
          if ('$gt' in filter[key]) {
            // Normalize both sides to Date for reliable comparison
            const docVal = doc[key] instanceof Date ? doc[key] : new Date(doc[key]);
            const filterVal = filter[key].$gt instanceof Date ? filter[key].$gt : new Date(filter[key].$gt);
            if (!(docVal > filterVal)) return false;
          }
          if ('$exists' in filter[key]) {
            const exists = doc[key] !== undefined;
            if (exists !== filter[key].$exists) return false;
          }
        } else if (doc[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });
    return match ? JSON.parse(JSON.stringify(match)) : null;
  }

  find(filter: any = {}): { toArray(): Promise<T[]> } {
    const matches = this.docs.filter((doc) => {
      for (const key of Object.keys(filter)) {
        if (key === '$or') {
          if (!filter.$or.some((sub: any) => this.matchesSub(doc, sub))) return false;
        } else if (doc[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });
    return {
      toArray: async () => JSON.parse(JSON.stringify(matches)),
    };
  }

  private matchesSub(doc: any, sub: any): boolean {
    for (const k of Object.keys(sub)) {
      if (doc[k] !== sub[k]) return false;
    }
    return true;
  }

  async insertOne(doc: any): Promise<{ insertedId: any }> {
    const copy = JSON.parse(JSON.stringify(doc));
    // Re-hydrate Date fields that JSON.stringify converts to ISO strings
    for (const key of Object.keys(copy)) {
      if (typeof copy[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(copy[key])) {
        copy[key] = new Date(copy[key]);
      }
    }
    this.docs.push(copy);
    return { insertedId: copy._id };
  }

  async updateOne(filter: any, update: any): Promise<{ modifiedCount: number }> {
    const doc = this.docs.find((d) => {
      for (const k of Object.keys(filter)) {
        if (d[k] !== filter[k]) return false;
      }
      return true;
    });

    if (!doc) return { modifiedCount: 0 };

    if (update.$set) {
      const patch = JSON.parse(JSON.stringify(update.$set));
      for (const key of Object.keys(patch)) {
        if (typeof patch[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(patch[key])) {
          patch[key] = new Date(patch[key]);
        }
      }
      Object.assign(doc, patch);
    }
    return { modifiedCount: 1 };
  }

  async updateMany(filter: any, update: any): Promise<{ modifiedCount: number }> {
    let count = 0;
    for (const d of this.docs) {
      let matches = true;
      for (const k of Object.keys(filter)) {
        if (filter[k] && typeof filter[k] === 'object' && '$exists' in filter[k]) {
          const exists = d[k] !== undefined;
          if (exists !== filter[k].$exists) {
            matches = false;
            break;
          }
        } else if (d[k] !== filter[k]) {
          matches = false;
          break;
        }
      }
      if (matches && update.$set) {
        Object.assign(d, JSON.parse(JSON.stringify(update.$set)));
        count++;
      }
    }
    return { modifiedCount: count };
  }

  async createIndex(): Promise<string> {
    return 'in_memory_index';
  }
}

export class InMemoryDatabaseStore implements IDatabaseStore {
  private collections: Map<string, InMemoryCollection<any>> = new Map();

  collection<T = any>(name: string): ICollection<T> {
    if (!this.collections.has(name)) {
      this.collections.set(name, new InMemoryCollection<any>());
    }
    return this.collections.get(name)! as ICollection<T>;
  }
}
