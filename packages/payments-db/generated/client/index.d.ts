
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model PayConfigVersion
 * 
 */
export type PayConfigVersion = $Result.DefaultSelection<Prisma.$PayConfigVersionPayload>
/**
 * Model PayFeatureFlag
 * 
 */
export type PayFeatureFlag = $Result.DefaultSelection<Prisma.$PayFeatureFlagPayload>
/**
 * Model PayConfigApproval
 * 
 */
export type PayConfigApproval = $Result.DefaultSelection<Prisma.$PayConfigApprovalPayload>
/**
 * Model PayIdempotencyRecord
 * 
 */
export type PayIdempotencyRecord = $Result.DefaultSelection<Prisma.$PayIdempotencyRecordPayload>
/**
 * Model PayOutboxEvent
 * 
 */
export type PayOutboxEvent = $Result.DefaultSelection<Prisma.$PayOutboxEventPayload>
/**
 * Model PayConsumedEvent
 * 
 */
export type PayConsumedEvent = $Result.DefaultSelection<Prisma.$PayConsumedEventPayload>
/**
 * Model PayDlqEvent
 * 
 */
export type PayDlqEvent = $Result.DefaultSelection<Prisma.$PayDlqEventPayload>
/**
 * Model PayAuditEvent
 * 
 */
export type PayAuditEvent = $Result.DefaultSelection<Prisma.$PayAuditEventPayload>
/**
 * Model PayQueueJob
 * 
 */
export type PayQueueJob = $Result.DefaultSelection<Prisma.$PayQueueJobPayload>
/**
 * Model PayRateLimitBucket
 * 
 */
export type PayRateLimitBucket = $Result.DefaultSelection<Prisma.$PayRateLimitBucketPayload>
/**
 * Model PayDailyProbeCounter
 * 
 */
export type PayDailyProbeCounter = $Result.DefaultSelection<Prisma.$PayDailyProbeCounterPayload>
/**
 * Model PayMigration
 * 
 */
export type PayMigration = $Result.DefaultSelection<Prisma.$PayMigrationPayload>
/**
 * Model PayLedgerAccount
 * 
 */
export type PayLedgerAccount = $Result.DefaultSelection<Prisma.$PayLedgerAccountPayload>
/**
 * Model PayLedgerEntry
 * 
 */
export type PayLedgerEntry = $Result.DefaultSelection<Prisma.$PayLedgerEntryPayload>
/**
 * Model PayLedgerLine
 * 
 */
export type PayLedgerLine = $Result.DefaultSelection<Prisma.$PayLedgerLinePayload>
/**
 * Model PayBooking
 * 
 */
export type PayBooking = $Result.DefaultSelection<Prisma.$PayBookingPayload>
/**
 * Model PayBookingEvent
 * 
 */
export type PayBookingEvent = $Result.DefaultSelection<Prisma.$PayBookingEventPayload>
/**
 * Model PayNotification
 * 
 */
export type PayNotification = $Result.DefaultSelection<Prisma.$PayNotificationPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more PayConfigVersions
 * const payConfigVersions = await prisma.payConfigVersion.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more PayConfigVersions
   * const payConfigVersions = await prisma.payConfigVersion.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number }): $Utils.JsPromise<R>

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.payConfigVersion`: Exposes CRUD operations for the **PayConfigVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayConfigVersions
    * const payConfigVersions = await prisma.payConfigVersion.findMany()
    * ```
    */
  get payConfigVersion(): Prisma.PayConfigVersionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payFeatureFlag`: Exposes CRUD operations for the **PayFeatureFlag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayFeatureFlags
    * const payFeatureFlags = await prisma.payFeatureFlag.findMany()
    * ```
    */
  get payFeatureFlag(): Prisma.PayFeatureFlagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payConfigApproval`: Exposes CRUD operations for the **PayConfigApproval** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayConfigApprovals
    * const payConfigApprovals = await prisma.payConfigApproval.findMany()
    * ```
    */
  get payConfigApproval(): Prisma.PayConfigApprovalDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payIdempotencyRecord`: Exposes CRUD operations for the **PayIdempotencyRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayIdempotencyRecords
    * const payIdempotencyRecords = await prisma.payIdempotencyRecord.findMany()
    * ```
    */
  get payIdempotencyRecord(): Prisma.PayIdempotencyRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payOutboxEvent`: Exposes CRUD operations for the **PayOutboxEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayOutboxEvents
    * const payOutboxEvents = await prisma.payOutboxEvent.findMany()
    * ```
    */
  get payOutboxEvent(): Prisma.PayOutboxEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payConsumedEvent`: Exposes CRUD operations for the **PayConsumedEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayConsumedEvents
    * const payConsumedEvents = await prisma.payConsumedEvent.findMany()
    * ```
    */
  get payConsumedEvent(): Prisma.PayConsumedEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payDlqEvent`: Exposes CRUD operations for the **PayDlqEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayDlqEvents
    * const payDlqEvents = await prisma.payDlqEvent.findMany()
    * ```
    */
  get payDlqEvent(): Prisma.PayDlqEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payAuditEvent`: Exposes CRUD operations for the **PayAuditEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayAuditEvents
    * const payAuditEvents = await prisma.payAuditEvent.findMany()
    * ```
    */
  get payAuditEvent(): Prisma.PayAuditEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payQueueJob`: Exposes CRUD operations for the **PayQueueJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayQueueJobs
    * const payQueueJobs = await prisma.payQueueJob.findMany()
    * ```
    */
  get payQueueJob(): Prisma.PayQueueJobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payRateLimitBucket`: Exposes CRUD operations for the **PayRateLimitBucket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayRateLimitBuckets
    * const payRateLimitBuckets = await prisma.payRateLimitBucket.findMany()
    * ```
    */
  get payRateLimitBucket(): Prisma.PayRateLimitBucketDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payDailyProbeCounter`: Exposes CRUD operations for the **PayDailyProbeCounter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayDailyProbeCounters
    * const payDailyProbeCounters = await prisma.payDailyProbeCounter.findMany()
    * ```
    */
  get payDailyProbeCounter(): Prisma.PayDailyProbeCounterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payMigration`: Exposes CRUD operations for the **PayMigration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayMigrations
    * const payMigrations = await prisma.payMigration.findMany()
    * ```
    */
  get payMigration(): Prisma.PayMigrationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payLedgerAccount`: Exposes CRUD operations for the **PayLedgerAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayLedgerAccounts
    * const payLedgerAccounts = await prisma.payLedgerAccount.findMany()
    * ```
    */
  get payLedgerAccount(): Prisma.PayLedgerAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payLedgerEntry`: Exposes CRUD operations for the **PayLedgerEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayLedgerEntries
    * const payLedgerEntries = await prisma.payLedgerEntry.findMany()
    * ```
    */
  get payLedgerEntry(): Prisma.PayLedgerEntryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payLedgerLine`: Exposes CRUD operations for the **PayLedgerLine** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayLedgerLines
    * const payLedgerLines = await prisma.payLedgerLine.findMany()
    * ```
    */
  get payLedgerLine(): Prisma.PayLedgerLineDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payBooking`: Exposes CRUD operations for the **PayBooking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayBookings
    * const payBookings = await prisma.payBooking.findMany()
    * ```
    */
  get payBooking(): Prisma.PayBookingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payBookingEvent`: Exposes CRUD operations for the **PayBookingEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayBookingEvents
    * const payBookingEvents = await prisma.payBookingEvent.findMany()
    * ```
    */
  get payBookingEvent(): Prisma.PayBookingEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payNotification`: Exposes CRUD operations for the **PayNotification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayNotifications
    * const payNotifications = await prisma.payNotification.findMany()
    * ```
    */
  get payNotification(): Prisma.PayNotificationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    PayConfigVersion: 'PayConfigVersion',
    PayFeatureFlag: 'PayFeatureFlag',
    PayConfigApproval: 'PayConfigApproval',
    PayIdempotencyRecord: 'PayIdempotencyRecord',
    PayOutboxEvent: 'PayOutboxEvent',
    PayConsumedEvent: 'PayConsumedEvent',
    PayDlqEvent: 'PayDlqEvent',
    PayAuditEvent: 'PayAuditEvent',
    PayQueueJob: 'PayQueueJob',
    PayRateLimitBucket: 'PayRateLimitBucket',
    PayDailyProbeCounter: 'PayDailyProbeCounter',
    PayMigration: 'PayMigration',
    PayLedgerAccount: 'PayLedgerAccount',
    PayLedgerEntry: 'PayLedgerEntry',
    PayLedgerLine: 'PayLedgerLine',
    PayBooking: 'PayBooking',
    PayBookingEvent: 'PayBookingEvent',
    PayNotification: 'PayNotification'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "payConfigVersion" | "payFeatureFlag" | "payConfigApproval" | "payIdempotencyRecord" | "payOutboxEvent" | "payConsumedEvent" | "payDlqEvent" | "payAuditEvent" | "payQueueJob" | "payRateLimitBucket" | "payDailyProbeCounter" | "payMigration" | "payLedgerAccount" | "payLedgerEntry" | "payLedgerLine" | "payBooking" | "payBookingEvent" | "payNotification"
      txIsolationLevel: never
    }
    model: {
      PayConfigVersion: {
        payload: Prisma.$PayConfigVersionPayload<ExtArgs>
        fields: Prisma.PayConfigVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayConfigVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayConfigVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigVersionPayload>
          }
          findFirst: {
            args: Prisma.PayConfigVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayConfigVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigVersionPayload>
          }
          findMany: {
            args: Prisma.PayConfigVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigVersionPayload>[]
          }
          create: {
            args: Prisma.PayConfigVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigVersionPayload>
          }
          createMany: {
            args: Prisma.PayConfigVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayConfigVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigVersionPayload>
          }
          update: {
            args: Prisma.PayConfigVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigVersionPayload>
          }
          deleteMany: {
            args: Prisma.PayConfigVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayConfigVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayConfigVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigVersionPayload>
          }
          aggregate: {
            args: Prisma.PayConfigVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayConfigVersion>
          }
          groupBy: {
            args: Prisma.PayConfigVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayConfigVersionGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayConfigVersionFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayConfigVersionAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayConfigVersionCountArgs<ExtArgs>
            result: $Utils.Optional<PayConfigVersionCountAggregateOutputType> | number
          }
        }
      }
      PayFeatureFlag: {
        payload: Prisma.$PayFeatureFlagPayload<ExtArgs>
        fields: Prisma.PayFeatureFlagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayFeatureFlagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayFeatureFlagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayFeatureFlagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayFeatureFlagPayload>
          }
          findFirst: {
            args: Prisma.PayFeatureFlagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayFeatureFlagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayFeatureFlagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayFeatureFlagPayload>
          }
          findMany: {
            args: Prisma.PayFeatureFlagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayFeatureFlagPayload>[]
          }
          create: {
            args: Prisma.PayFeatureFlagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayFeatureFlagPayload>
          }
          createMany: {
            args: Prisma.PayFeatureFlagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayFeatureFlagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayFeatureFlagPayload>
          }
          update: {
            args: Prisma.PayFeatureFlagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayFeatureFlagPayload>
          }
          deleteMany: {
            args: Prisma.PayFeatureFlagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayFeatureFlagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayFeatureFlagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayFeatureFlagPayload>
          }
          aggregate: {
            args: Prisma.PayFeatureFlagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayFeatureFlag>
          }
          groupBy: {
            args: Prisma.PayFeatureFlagGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayFeatureFlagGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayFeatureFlagFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayFeatureFlagAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayFeatureFlagCountArgs<ExtArgs>
            result: $Utils.Optional<PayFeatureFlagCountAggregateOutputType> | number
          }
        }
      }
      PayConfigApproval: {
        payload: Prisma.$PayConfigApprovalPayload<ExtArgs>
        fields: Prisma.PayConfigApprovalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayConfigApprovalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigApprovalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayConfigApprovalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigApprovalPayload>
          }
          findFirst: {
            args: Prisma.PayConfigApprovalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigApprovalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayConfigApprovalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigApprovalPayload>
          }
          findMany: {
            args: Prisma.PayConfigApprovalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigApprovalPayload>[]
          }
          create: {
            args: Prisma.PayConfigApprovalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigApprovalPayload>
          }
          createMany: {
            args: Prisma.PayConfigApprovalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayConfigApprovalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigApprovalPayload>
          }
          update: {
            args: Prisma.PayConfigApprovalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigApprovalPayload>
          }
          deleteMany: {
            args: Prisma.PayConfigApprovalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayConfigApprovalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayConfigApprovalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConfigApprovalPayload>
          }
          aggregate: {
            args: Prisma.PayConfigApprovalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayConfigApproval>
          }
          groupBy: {
            args: Prisma.PayConfigApprovalGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayConfigApprovalGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayConfigApprovalFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayConfigApprovalAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayConfigApprovalCountArgs<ExtArgs>
            result: $Utils.Optional<PayConfigApprovalCountAggregateOutputType> | number
          }
        }
      }
      PayIdempotencyRecord: {
        payload: Prisma.$PayIdempotencyRecordPayload<ExtArgs>
        fields: Prisma.PayIdempotencyRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayIdempotencyRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayIdempotencyRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayIdempotencyRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayIdempotencyRecordPayload>
          }
          findFirst: {
            args: Prisma.PayIdempotencyRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayIdempotencyRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayIdempotencyRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayIdempotencyRecordPayload>
          }
          findMany: {
            args: Prisma.PayIdempotencyRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayIdempotencyRecordPayload>[]
          }
          create: {
            args: Prisma.PayIdempotencyRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayIdempotencyRecordPayload>
          }
          createMany: {
            args: Prisma.PayIdempotencyRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayIdempotencyRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayIdempotencyRecordPayload>
          }
          update: {
            args: Prisma.PayIdempotencyRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayIdempotencyRecordPayload>
          }
          deleteMany: {
            args: Prisma.PayIdempotencyRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayIdempotencyRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayIdempotencyRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayIdempotencyRecordPayload>
          }
          aggregate: {
            args: Prisma.PayIdempotencyRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayIdempotencyRecord>
          }
          groupBy: {
            args: Prisma.PayIdempotencyRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayIdempotencyRecordGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayIdempotencyRecordFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayIdempotencyRecordAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayIdempotencyRecordCountArgs<ExtArgs>
            result: $Utils.Optional<PayIdempotencyRecordCountAggregateOutputType> | number
          }
        }
      }
      PayOutboxEvent: {
        payload: Prisma.$PayOutboxEventPayload<ExtArgs>
        fields: Prisma.PayOutboxEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayOutboxEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayOutboxEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayOutboxEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayOutboxEventPayload>
          }
          findFirst: {
            args: Prisma.PayOutboxEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayOutboxEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayOutboxEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayOutboxEventPayload>
          }
          findMany: {
            args: Prisma.PayOutboxEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayOutboxEventPayload>[]
          }
          create: {
            args: Prisma.PayOutboxEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayOutboxEventPayload>
          }
          createMany: {
            args: Prisma.PayOutboxEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayOutboxEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayOutboxEventPayload>
          }
          update: {
            args: Prisma.PayOutboxEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayOutboxEventPayload>
          }
          deleteMany: {
            args: Prisma.PayOutboxEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayOutboxEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayOutboxEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayOutboxEventPayload>
          }
          aggregate: {
            args: Prisma.PayOutboxEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayOutboxEvent>
          }
          groupBy: {
            args: Prisma.PayOutboxEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayOutboxEventGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayOutboxEventFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayOutboxEventAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayOutboxEventCountArgs<ExtArgs>
            result: $Utils.Optional<PayOutboxEventCountAggregateOutputType> | number
          }
        }
      }
      PayConsumedEvent: {
        payload: Prisma.$PayConsumedEventPayload<ExtArgs>
        fields: Prisma.PayConsumedEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayConsumedEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConsumedEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayConsumedEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConsumedEventPayload>
          }
          findFirst: {
            args: Prisma.PayConsumedEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConsumedEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayConsumedEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConsumedEventPayload>
          }
          findMany: {
            args: Prisma.PayConsumedEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConsumedEventPayload>[]
          }
          create: {
            args: Prisma.PayConsumedEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConsumedEventPayload>
          }
          createMany: {
            args: Prisma.PayConsumedEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayConsumedEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConsumedEventPayload>
          }
          update: {
            args: Prisma.PayConsumedEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConsumedEventPayload>
          }
          deleteMany: {
            args: Prisma.PayConsumedEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayConsumedEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayConsumedEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayConsumedEventPayload>
          }
          aggregate: {
            args: Prisma.PayConsumedEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayConsumedEvent>
          }
          groupBy: {
            args: Prisma.PayConsumedEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayConsumedEventGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayConsumedEventFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayConsumedEventAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayConsumedEventCountArgs<ExtArgs>
            result: $Utils.Optional<PayConsumedEventCountAggregateOutputType> | number
          }
        }
      }
      PayDlqEvent: {
        payload: Prisma.$PayDlqEventPayload<ExtArgs>
        fields: Prisma.PayDlqEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayDlqEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDlqEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayDlqEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDlqEventPayload>
          }
          findFirst: {
            args: Prisma.PayDlqEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDlqEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayDlqEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDlqEventPayload>
          }
          findMany: {
            args: Prisma.PayDlqEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDlqEventPayload>[]
          }
          create: {
            args: Prisma.PayDlqEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDlqEventPayload>
          }
          createMany: {
            args: Prisma.PayDlqEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayDlqEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDlqEventPayload>
          }
          update: {
            args: Prisma.PayDlqEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDlqEventPayload>
          }
          deleteMany: {
            args: Prisma.PayDlqEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayDlqEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayDlqEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDlqEventPayload>
          }
          aggregate: {
            args: Prisma.PayDlqEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayDlqEvent>
          }
          groupBy: {
            args: Prisma.PayDlqEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayDlqEventGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayDlqEventFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayDlqEventAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayDlqEventCountArgs<ExtArgs>
            result: $Utils.Optional<PayDlqEventCountAggregateOutputType> | number
          }
        }
      }
      PayAuditEvent: {
        payload: Prisma.$PayAuditEventPayload<ExtArgs>
        fields: Prisma.PayAuditEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayAuditEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayAuditEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayAuditEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayAuditEventPayload>
          }
          findFirst: {
            args: Prisma.PayAuditEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayAuditEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayAuditEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayAuditEventPayload>
          }
          findMany: {
            args: Prisma.PayAuditEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayAuditEventPayload>[]
          }
          create: {
            args: Prisma.PayAuditEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayAuditEventPayload>
          }
          createMany: {
            args: Prisma.PayAuditEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayAuditEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayAuditEventPayload>
          }
          update: {
            args: Prisma.PayAuditEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayAuditEventPayload>
          }
          deleteMany: {
            args: Prisma.PayAuditEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayAuditEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayAuditEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayAuditEventPayload>
          }
          aggregate: {
            args: Prisma.PayAuditEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayAuditEvent>
          }
          groupBy: {
            args: Prisma.PayAuditEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayAuditEventGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayAuditEventFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayAuditEventAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayAuditEventCountArgs<ExtArgs>
            result: $Utils.Optional<PayAuditEventCountAggregateOutputType> | number
          }
        }
      }
      PayQueueJob: {
        payload: Prisma.$PayQueueJobPayload<ExtArgs>
        fields: Prisma.PayQueueJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayQueueJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayQueueJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayQueueJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayQueueJobPayload>
          }
          findFirst: {
            args: Prisma.PayQueueJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayQueueJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayQueueJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayQueueJobPayload>
          }
          findMany: {
            args: Prisma.PayQueueJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayQueueJobPayload>[]
          }
          create: {
            args: Prisma.PayQueueJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayQueueJobPayload>
          }
          createMany: {
            args: Prisma.PayQueueJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayQueueJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayQueueJobPayload>
          }
          update: {
            args: Prisma.PayQueueJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayQueueJobPayload>
          }
          deleteMany: {
            args: Prisma.PayQueueJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayQueueJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayQueueJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayQueueJobPayload>
          }
          aggregate: {
            args: Prisma.PayQueueJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayQueueJob>
          }
          groupBy: {
            args: Prisma.PayQueueJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayQueueJobGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayQueueJobFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayQueueJobAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayQueueJobCountArgs<ExtArgs>
            result: $Utils.Optional<PayQueueJobCountAggregateOutputType> | number
          }
        }
      }
      PayRateLimitBucket: {
        payload: Prisma.$PayRateLimitBucketPayload<ExtArgs>
        fields: Prisma.PayRateLimitBucketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayRateLimitBucketFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayRateLimitBucketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayRateLimitBucketFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayRateLimitBucketPayload>
          }
          findFirst: {
            args: Prisma.PayRateLimitBucketFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayRateLimitBucketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayRateLimitBucketFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayRateLimitBucketPayload>
          }
          findMany: {
            args: Prisma.PayRateLimitBucketFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayRateLimitBucketPayload>[]
          }
          create: {
            args: Prisma.PayRateLimitBucketCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayRateLimitBucketPayload>
          }
          createMany: {
            args: Prisma.PayRateLimitBucketCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayRateLimitBucketDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayRateLimitBucketPayload>
          }
          update: {
            args: Prisma.PayRateLimitBucketUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayRateLimitBucketPayload>
          }
          deleteMany: {
            args: Prisma.PayRateLimitBucketDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayRateLimitBucketUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayRateLimitBucketUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayRateLimitBucketPayload>
          }
          aggregate: {
            args: Prisma.PayRateLimitBucketAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayRateLimitBucket>
          }
          groupBy: {
            args: Prisma.PayRateLimitBucketGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayRateLimitBucketGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayRateLimitBucketFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayRateLimitBucketAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayRateLimitBucketCountArgs<ExtArgs>
            result: $Utils.Optional<PayRateLimitBucketCountAggregateOutputType> | number
          }
        }
      }
      PayDailyProbeCounter: {
        payload: Prisma.$PayDailyProbeCounterPayload<ExtArgs>
        fields: Prisma.PayDailyProbeCounterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayDailyProbeCounterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDailyProbeCounterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayDailyProbeCounterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDailyProbeCounterPayload>
          }
          findFirst: {
            args: Prisma.PayDailyProbeCounterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDailyProbeCounterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayDailyProbeCounterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDailyProbeCounterPayload>
          }
          findMany: {
            args: Prisma.PayDailyProbeCounterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDailyProbeCounterPayload>[]
          }
          create: {
            args: Prisma.PayDailyProbeCounterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDailyProbeCounterPayload>
          }
          createMany: {
            args: Prisma.PayDailyProbeCounterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayDailyProbeCounterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDailyProbeCounterPayload>
          }
          update: {
            args: Prisma.PayDailyProbeCounterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDailyProbeCounterPayload>
          }
          deleteMany: {
            args: Prisma.PayDailyProbeCounterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayDailyProbeCounterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayDailyProbeCounterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayDailyProbeCounterPayload>
          }
          aggregate: {
            args: Prisma.PayDailyProbeCounterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayDailyProbeCounter>
          }
          groupBy: {
            args: Prisma.PayDailyProbeCounterGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayDailyProbeCounterGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayDailyProbeCounterFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayDailyProbeCounterAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayDailyProbeCounterCountArgs<ExtArgs>
            result: $Utils.Optional<PayDailyProbeCounterCountAggregateOutputType> | number
          }
        }
      }
      PayMigration: {
        payload: Prisma.$PayMigrationPayload<ExtArgs>
        fields: Prisma.PayMigrationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayMigrationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayMigrationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayMigrationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayMigrationPayload>
          }
          findFirst: {
            args: Prisma.PayMigrationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayMigrationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayMigrationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayMigrationPayload>
          }
          findMany: {
            args: Prisma.PayMigrationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayMigrationPayload>[]
          }
          create: {
            args: Prisma.PayMigrationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayMigrationPayload>
          }
          createMany: {
            args: Prisma.PayMigrationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayMigrationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayMigrationPayload>
          }
          update: {
            args: Prisma.PayMigrationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayMigrationPayload>
          }
          deleteMany: {
            args: Prisma.PayMigrationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayMigrationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayMigrationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayMigrationPayload>
          }
          aggregate: {
            args: Prisma.PayMigrationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayMigration>
          }
          groupBy: {
            args: Prisma.PayMigrationGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayMigrationGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayMigrationFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayMigrationAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayMigrationCountArgs<ExtArgs>
            result: $Utils.Optional<PayMigrationCountAggregateOutputType> | number
          }
        }
      }
      PayLedgerAccount: {
        payload: Prisma.$PayLedgerAccountPayload<ExtArgs>
        fields: Prisma.PayLedgerAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayLedgerAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayLedgerAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerAccountPayload>
          }
          findFirst: {
            args: Prisma.PayLedgerAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayLedgerAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerAccountPayload>
          }
          findMany: {
            args: Prisma.PayLedgerAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerAccountPayload>[]
          }
          create: {
            args: Prisma.PayLedgerAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerAccountPayload>
          }
          createMany: {
            args: Prisma.PayLedgerAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayLedgerAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerAccountPayload>
          }
          update: {
            args: Prisma.PayLedgerAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerAccountPayload>
          }
          deleteMany: {
            args: Prisma.PayLedgerAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayLedgerAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayLedgerAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerAccountPayload>
          }
          aggregate: {
            args: Prisma.PayLedgerAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayLedgerAccount>
          }
          groupBy: {
            args: Prisma.PayLedgerAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayLedgerAccountGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayLedgerAccountFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayLedgerAccountAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayLedgerAccountCountArgs<ExtArgs>
            result: $Utils.Optional<PayLedgerAccountCountAggregateOutputType> | number
          }
        }
      }
      PayLedgerEntry: {
        payload: Prisma.$PayLedgerEntryPayload<ExtArgs>
        fields: Prisma.PayLedgerEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayLedgerEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayLedgerEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerEntryPayload>
          }
          findFirst: {
            args: Prisma.PayLedgerEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayLedgerEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerEntryPayload>
          }
          findMany: {
            args: Prisma.PayLedgerEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerEntryPayload>[]
          }
          create: {
            args: Prisma.PayLedgerEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerEntryPayload>
          }
          createMany: {
            args: Prisma.PayLedgerEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayLedgerEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerEntryPayload>
          }
          update: {
            args: Prisma.PayLedgerEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerEntryPayload>
          }
          deleteMany: {
            args: Prisma.PayLedgerEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayLedgerEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayLedgerEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerEntryPayload>
          }
          aggregate: {
            args: Prisma.PayLedgerEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayLedgerEntry>
          }
          groupBy: {
            args: Prisma.PayLedgerEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayLedgerEntryGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayLedgerEntryFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayLedgerEntryAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayLedgerEntryCountArgs<ExtArgs>
            result: $Utils.Optional<PayLedgerEntryCountAggregateOutputType> | number
          }
        }
      }
      PayLedgerLine: {
        payload: Prisma.$PayLedgerLinePayload<ExtArgs>
        fields: Prisma.PayLedgerLineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayLedgerLineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerLinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayLedgerLineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerLinePayload>
          }
          findFirst: {
            args: Prisma.PayLedgerLineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerLinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayLedgerLineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerLinePayload>
          }
          findMany: {
            args: Prisma.PayLedgerLineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerLinePayload>[]
          }
          create: {
            args: Prisma.PayLedgerLineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerLinePayload>
          }
          createMany: {
            args: Prisma.PayLedgerLineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayLedgerLineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerLinePayload>
          }
          update: {
            args: Prisma.PayLedgerLineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerLinePayload>
          }
          deleteMany: {
            args: Prisma.PayLedgerLineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayLedgerLineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayLedgerLineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayLedgerLinePayload>
          }
          aggregate: {
            args: Prisma.PayLedgerLineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayLedgerLine>
          }
          groupBy: {
            args: Prisma.PayLedgerLineGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayLedgerLineGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayLedgerLineFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayLedgerLineAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayLedgerLineCountArgs<ExtArgs>
            result: $Utils.Optional<PayLedgerLineCountAggregateOutputType> | number
          }
        }
      }
      PayBooking: {
        payload: Prisma.$PayBookingPayload<ExtArgs>
        fields: Prisma.PayBookingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayBookingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayBookingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingPayload>
          }
          findFirst: {
            args: Prisma.PayBookingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayBookingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingPayload>
          }
          findMany: {
            args: Prisma.PayBookingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingPayload>[]
          }
          create: {
            args: Prisma.PayBookingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingPayload>
          }
          createMany: {
            args: Prisma.PayBookingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayBookingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingPayload>
          }
          update: {
            args: Prisma.PayBookingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingPayload>
          }
          deleteMany: {
            args: Prisma.PayBookingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayBookingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayBookingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingPayload>
          }
          aggregate: {
            args: Prisma.PayBookingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayBooking>
          }
          groupBy: {
            args: Prisma.PayBookingGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayBookingGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayBookingFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayBookingAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayBookingCountArgs<ExtArgs>
            result: $Utils.Optional<PayBookingCountAggregateOutputType> | number
          }
        }
      }
      PayBookingEvent: {
        payload: Prisma.$PayBookingEventPayload<ExtArgs>
        fields: Prisma.PayBookingEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayBookingEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayBookingEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingEventPayload>
          }
          findFirst: {
            args: Prisma.PayBookingEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayBookingEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingEventPayload>
          }
          findMany: {
            args: Prisma.PayBookingEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingEventPayload>[]
          }
          create: {
            args: Prisma.PayBookingEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingEventPayload>
          }
          createMany: {
            args: Prisma.PayBookingEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayBookingEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingEventPayload>
          }
          update: {
            args: Prisma.PayBookingEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingEventPayload>
          }
          deleteMany: {
            args: Prisma.PayBookingEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayBookingEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayBookingEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayBookingEventPayload>
          }
          aggregate: {
            args: Prisma.PayBookingEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayBookingEvent>
          }
          groupBy: {
            args: Prisma.PayBookingEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayBookingEventGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayBookingEventFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayBookingEventAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayBookingEventCountArgs<ExtArgs>
            result: $Utils.Optional<PayBookingEventCountAggregateOutputType> | number
          }
        }
      }
      PayNotification: {
        payload: Prisma.$PayNotificationPayload<ExtArgs>
        fields: Prisma.PayNotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayNotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayNotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayNotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayNotificationPayload>
          }
          findFirst: {
            args: Prisma.PayNotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayNotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayNotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayNotificationPayload>
          }
          findMany: {
            args: Prisma.PayNotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayNotificationPayload>[]
          }
          create: {
            args: Prisma.PayNotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayNotificationPayload>
          }
          createMany: {
            args: Prisma.PayNotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PayNotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayNotificationPayload>
          }
          update: {
            args: Prisma.PayNotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayNotificationPayload>
          }
          deleteMany: {
            args: Prisma.PayNotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayNotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayNotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayNotificationPayload>
          }
          aggregate: {
            args: Prisma.PayNotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayNotification>
          }
          groupBy: {
            args: Prisma.PayNotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayNotificationGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PayNotificationFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PayNotificationAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PayNotificationCountArgs<ExtArgs>
            result: $Utils.Optional<PayNotificationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject,
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    payConfigVersion?: PayConfigVersionOmit
    payFeatureFlag?: PayFeatureFlagOmit
    payConfigApproval?: PayConfigApprovalOmit
    payIdempotencyRecord?: PayIdempotencyRecordOmit
    payOutboxEvent?: PayOutboxEventOmit
    payConsumedEvent?: PayConsumedEventOmit
    payDlqEvent?: PayDlqEventOmit
    payAuditEvent?: PayAuditEventOmit
    payQueueJob?: PayQueueJobOmit
    payRateLimitBucket?: PayRateLimitBucketOmit
    payDailyProbeCounter?: PayDailyProbeCounterOmit
    payMigration?: PayMigrationOmit
    payLedgerAccount?: PayLedgerAccountOmit
    payLedgerEntry?: PayLedgerEntryOmit
    payLedgerLine?: PayLedgerLineOmit
    payBooking?: PayBookingOmit
    payBookingEvent?: PayBookingEventOmit
    payNotification?: PayNotificationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model PayConfigVersion
   */

  export type AggregatePayConfigVersion = {
    _count: PayConfigVersionCountAggregateOutputType | null
    _avg: PayConfigVersionAvgAggregateOutputType | null
    _sum: PayConfigVersionSumAggregateOutputType | null
    _min: PayConfigVersionMinAggregateOutputType | null
    _max: PayConfigVersionMaxAggregateOutputType | null
  }

  export type PayConfigVersionAvgAggregateOutputType = {
    brandFeeBps: number | null
    creatorFeeBps: number | null
    gstBps: number | null
    defaultTdsBps: number | null
    offerExpiryHours: number | null
    signWindowHours: number | null
    paymentWindowHours: number | null
    reviewSlaHours: number | null
    holdPeriodHours: number | null
    disputeWindowHours: number | null
    minWithdrawalPaise: number | null
  }

  export type PayConfigVersionSumAggregateOutputType = {
    brandFeeBps: number | null
    creatorFeeBps: number | null
    gstBps: number | null
    defaultTdsBps: number | null
    offerExpiryHours: number | null
    signWindowHours: number | null
    paymentWindowHours: number | null
    reviewSlaHours: number | null
    holdPeriodHours: number | null
    disputeWindowHours: number | null
    minWithdrawalPaise: bigint | null
  }

  export type PayConfigVersionMinAggregateOutputType = {
    id: string | null
    version: string | null
    brandFeeBps: number | null
    creatorFeeBps: number | null
    gstBps: number | null
    defaultTdsBps: number | null
    offerExpiryHours: number | null
    signWindowHours: number | null
    paymentWindowHours: number | null
    reviewSlaHours: number | null
    holdPeriodHours: number | null
    disputeWindowHours: number | null
    minWithdrawalPaise: bigint | null
    isActive: boolean | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type PayConfigVersionMaxAggregateOutputType = {
    id: string | null
    version: string | null
    brandFeeBps: number | null
    creatorFeeBps: number | null
    gstBps: number | null
    defaultTdsBps: number | null
    offerExpiryHours: number | null
    signWindowHours: number | null
    paymentWindowHours: number | null
    reviewSlaHours: number | null
    holdPeriodHours: number | null
    disputeWindowHours: number | null
    minWithdrawalPaise: bigint | null
    isActive: boolean | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type PayConfigVersionCountAggregateOutputType = {
    id: number
    version: number
    brandFeeBps: number
    creatorFeeBps: number
    gstBps: number
    defaultTdsBps: number
    offerExpiryHours: number
    signWindowHours: number
    paymentWindowHours: number
    reviewSlaHours: number
    holdPeriodHours: number
    disputeWindowHours: number
    minWithdrawalPaise: number
    isActive: number
    createdBy: number
    createdAt: number
    _all: number
  }


  export type PayConfigVersionAvgAggregateInputType = {
    brandFeeBps?: true
    creatorFeeBps?: true
    gstBps?: true
    defaultTdsBps?: true
    offerExpiryHours?: true
    signWindowHours?: true
    paymentWindowHours?: true
    reviewSlaHours?: true
    holdPeriodHours?: true
    disputeWindowHours?: true
    minWithdrawalPaise?: true
  }

  export type PayConfigVersionSumAggregateInputType = {
    brandFeeBps?: true
    creatorFeeBps?: true
    gstBps?: true
    defaultTdsBps?: true
    offerExpiryHours?: true
    signWindowHours?: true
    paymentWindowHours?: true
    reviewSlaHours?: true
    holdPeriodHours?: true
    disputeWindowHours?: true
    minWithdrawalPaise?: true
  }

  export type PayConfigVersionMinAggregateInputType = {
    id?: true
    version?: true
    brandFeeBps?: true
    creatorFeeBps?: true
    gstBps?: true
    defaultTdsBps?: true
    offerExpiryHours?: true
    signWindowHours?: true
    paymentWindowHours?: true
    reviewSlaHours?: true
    holdPeriodHours?: true
    disputeWindowHours?: true
    minWithdrawalPaise?: true
    isActive?: true
    createdBy?: true
    createdAt?: true
  }

  export type PayConfigVersionMaxAggregateInputType = {
    id?: true
    version?: true
    brandFeeBps?: true
    creatorFeeBps?: true
    gstBps?: true
    defaultTdsBps?: true
    offerExpiryHours?: true
    signWindowHours?: true
    paymentWindowHours?: true
    reviewSlaHours?: true
    holdPeriodHours?: true
    disputeWindowHours?: true
    minWithdrawalPaise?: true
    isActive?: true
    createdBy?: true
    createdAt?: true
  }

  export type PayConfigVersionCountAggregateInputType = {
    id?: true
    version?: true
    brandFeeBps?: true
    creatorFeeBps?: true
    gstBps?: true
    defaultTdsBps?: true
    offerExpiryHours?: true
    signWindowHours?: true
    paymentWindowHours?: true
    reviewSlaHours?: true
    holdPeriodHours?: true
    disputeWindowHours?: true
    minWithdrawalPaise?: true
    isActive?: true
    createdBy?: true
    createdAt?: true
    _all?: true
  }

  export type PayConfigVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayConfigVersion to aggregate.
     */
    where?: PayConfigVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayConfigVersions to fetch.
     */
    orderBy?: PayConfigVersionOrderByWithRelationInput | PayConfigVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayConfigVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayConfigVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayConfigVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayConfigVersions
    **/
    _count?: true | PayConfigVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayConfigVersionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayConfigVersionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayConfigVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayConfigVersionMaxAggregateInputType
  }

  export type GetPayConfigVersionAggregateType<T extends PayConfigVersionAggregateArgs> = {
        [P in keyof T & keyof AggregatePayConfigVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayConfigVersion[P]>
      : GetScalarType<T[P], AggregatePayConfigVersion[P]>
  }




  export type PayConfigVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayConfigVersionWhereInput
    orderBy?: PayConfigVersionOrderByWithAggregationInput | PayConfigVersionOrderByWithAggregationInput[]
    by: PayConfigVersionScalarFieldEnum[] | PayConfigVersionScalarFieldEnum
    having?: PayConfigVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayConfigVersionCountAggregateInputType | true
    _avg?: PayConfigVersionAvgAggregateInputType
    _sum?: PayConfigVersionSumAggregateInputType
    _min?: PayConfigVersionMinAggregateInputType
    _max?: PayConfigVersionMaxAggregateInputType
  }

  export type PayConfigVersionGroupByOutputType = {
    id: string
    version: string
    brandFeeBps: number
    creatorFeeBps: number
    gstBps: number
    defaultTdsBps: number
    offerExpiryHours: number
    signWindowHours: number
    paymentWindowHours: number
    reviewSlaHours: number
    holdPeriodHours: number
    disputeWindowHours: number
    minWithdrawalPaise: bigint
    isActive: boolean
    createdBy: string
    createdAt: Date
    _count: PayConfigVersionCountAggregateOutputType | null
    _avg: PayConfigVersionAvgAggregateOutputType | null
    _sum: PayConfigVersionSumAggregateOutputType | null
    _min: PayConfigVersionMinAggregateOutputType | null
    _max: PayConfigVersionMaxAggregateOutputType | null
  }

  type GetPayConfigVersionGroupByPayload<T extends PayConfigVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayConfigVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayConfigVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayConfigVersionGroupByOutputType[P]>
            : GetScalarType<T[P], PayConfigVersionGroupByOutputType[P]>
        }
      >
    >


  export type PayConfigVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    version?: boolean
    brandFeeBps?: boolean
    creatorFeeBps?: boolean
    gstBps?: boolean
    defaultTdsBps?: boolean
    offerExpiryHours?: boolean
    signWindowHours?: boolean
    paymentWindowHours?: boolean
    reviewSlaHours?: boolean
    holdPeriodHours?: boolean
    disputeWindowHours?: boolean
    minWithdrawalPaise?: boolean
    isActive?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["payConfigVersion"]>



  export type PayConfigVersionSelectScalar = {
    id?: boolean
    version?: boolean
    brandFeeBps?: boolean
    creatorFeeBps?: boolean
    gstBps?: boolean
    defaultTdsBps?: boolean
    offerExpiryHours?: boolean
    signWindowHours?: boolean
    paymentWindowHours?: boolean
    reviewSlaHours?: boolean
    holdPeriodHours?: boolean
    disputeWindowHours?: boolean
    minWithdrawalPaise?: boolean
    isActive?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }

  export type PayConfigVersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "version" | "brandFeeBps" | "creatorFeeBps" | "gstBps" | "defaultTdsBps" | "offerExpiryHours" | "signWindowHours" | "paymentWindowHours" | "reviewSlaHours" | "holdPeriodHours" | "disputeWindowHours" | "minWithdrawalPaise" | "isActive" | "createdBy" | "createdAt", ExtArgs["result"]["payConfigVersion"]>

  export type $PayConfigVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayConfigVersion"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      version: string
      brandFeeBps: number
      creatorFeeBps: number
      gstBps: number
      defaultTdsBps: number
      offerExpiryHours: number
      signWindowHours: number
      paymentWindowHours: number
      reviewSlaHours: number
      holdPeriodHours: number
      disputeWindowHours: number
      minWithdrawalPaise: bigint
      isActive: boolean
      createdBy: string
      createdAt: Date
    }, ExtArgs["result"]["payConfigVersion"]>
    composites: {}
  }

  type PayConfigVersionGetPayload<S extends boolean | null | undefined | PayConfigVersionDefaultArgs> = $Result.GetResult<Prisma.$PayConfigVersionPayload, S>

  type PayConfigVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayConfigVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayConfigVersionCountAggregateInputType | true
    }

  export interface PayConfigVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayConfigVersion'], meta: { name: 'PayConfigVersion' } }
    /**
     * Find zero or one PayConfigVersion that matches the filter.
     * @param {PayConfigVersionFindUniqueArgs} args - Arguments to find a PayConfigVersion
     * @example
     * // Get one PayConfigVersion
     * const payConfigVersion = await prisma.payConfigVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayConfigVersionFindUniqueArgs>(args: SelectSubset<T, PayConfigVersionFindUniqueArgs<ExtArgs>>): Prisma__PayConfigVersionClient<$Result.GetResult<Prisma.$PayConfigVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayConfigVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayConfigVersionFindUniqueOrThrowArgs} args - Arguments to find a PayConfigVersion
     * @example
     * // Get one PayConfigVersion
     * const payConfigVersion = await prisma.payConfigVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayConfigVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, PayConfigVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayConfigVersionClient<$Result.GetResult<Prisma.$PayConfigVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayConfigVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigVersionFindFirstArgs} args - Arguments to find a PayConfigVersion
     * @example
     * // Get one PayConfigVersion
     * const payConfigVersion = await prisma.payConfigVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayConfigVersionFindFirstArgs>(args?: SelectSubset<T, PayConfigVersionFindFirstArgs<ExtArgs>>): Prisma__PayConfigVersionClient<$Result.GetResult<Prisma.$PayConfigVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayConfigVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigVersionFindFirstOrThrowArgs} args - Arguments to find a PayConfigVersion
     * @example
     * // Get one PayConfigVersion
     * const payConfigVersion = await prisma.payConfigVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayConfigVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, PayConfigVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayConfigVersionClient<$Result.GetResult<Prisma.$PayConfigVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayConfigVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayConfigVersions
     * const payConfigVersions = await prisma.payConfigVersion.findMany()
     * 
     * // Get first 10 PayConfigVersions
     * const payConfigVersions = await prisma.payConfigVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payConfigVersionWithIdOnly = await prisma.payConfigVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayConfigVersionFindManyArgs>(args?: SelectSubset<T, PayConfigVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayConfigVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayConfigVersion.
     * @param {PayConfigVersionCreateArgs} args - Arguments to create a PayConfigVersion.
     * @example
     * // Create one PayConfigVersion
     * const PayConfigVersion = await prisma.payConfigVersion.create({
     *   data: {
     *     // ... data to create a PayConfigVersion
     *   }
     * })
     * 
     */
    create<T extends PayConfigVersionCreateArgs>(args: SelectSubset<T, PayConfigVersionCreateArgs<ExtArgs>>): Prisma__PayConfigVersionClient<$Result.GetResult<Prisma.$PayConfigVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayConfigVersions.
     * @param {PayConfigVersionCreateManyArgs} args - Arguments to create many PayConfigVersions.
     * @example
     * // Create many PayConfigVersions
     * const payConfigVersion = await prisma.payConfigVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayConfigVersionCreateManyArgs>(args?: SelectSubset<T, PayConfigVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayConfigVersion.
     * @param {PayConfigVersionDeleteArgs} args - Arguments to delete one PayConfigVersion.
     * @example
     * // Delete one PayConfigVersion
     * const PayConfigVersion = await prisma.payConfigVersion.delete({
     *   where: {
     *     // ... filter to delete one PayConfigVersion
     *   }
     * })
     * 
     */
    delete<T extends PayConfigVersionDeleteArgs>(args: SelectSubset<T, PayConfigVersionDeleteArgs<ExtArgs>>): Prisma__PayConfigVersionClient<$Result.GetResult<Prisma.$PayConfigVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayConfigVersion.
     * @param {PayConfigVersionUpdateArgs} args - Arguments to update one PayConfigVersion.
     * @example
     * // Update one PayConfigVersion
     * const payConfigVersion = await prisma.payConfigVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayConfigVersionUpdateArgs>(args: SelectSubset<T, PayConfigVersionUpdateArgs<ExtArgs>>): Prisma__PayConfigVersionClient<$Result.GetResult<Prisma.$PayConfigVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayConfigVersions.
     * @param {PayConfigVersionDeleteManyArgs} args - Arguments to filter PayConfigVersions to delete.
     * @example
     * // Delete a few PayConfigVersions
     * const { count } = await prisma.payConfigVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayConfigVersionDeleteManyArgs>(args?: SelectSubset<T, PayConfigVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayConfigVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayConfigVersions
     * const payConfigVersion = await prisma.payConfigVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayConfigVersionUpdateManyArgs>(args: SelectSubset<T, PayConfigVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayConfigVersion.
     * @param {PayConfigVersionUpsertArgs} args - Arguments to update or create a PayConfigVersion.
     * @example
     * // Update or create a PayConfigVersion
     * const payConfigVersion = await prisma.payConfigVersion.upsert({
     *   create: {
     *     // ... data to create a PayConfigVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayConfigVersion we want to update
     *   }
     * })
     */
    upsert<T extends PayConfigVersionUpsertArgs>(args: SelectSubset<T, PayConfigVersionUpsertArgs<ExtArgs>>): Prisma__PayConfigVersionClient<$Result.GetResult<Prisma.$PayConfigVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayConfigVersions that matches the filter.
     * @param {PayConfigVersionFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payConfigVersion = await prisma.payConfigVersion.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayConfigVersionFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayConfigVersion.
     * @param {PayConfigVersionAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payConfigVersion = await prisma.payConfigVersion.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayConfigVersionAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayConfigVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigVersionCountArgs} args - Arguments to filter PayConfigVersions to count.
     * @example
     * // Count the number of PayConfigVersions
     * const count = await prisma.payConfigVersion.count({
     *   where: {
     *     // ... the filter for the PayConfigVersions we want to count
     *   }
     * })
    **/
    count<T extends PayConfigVersionCountArgs>(
      args?: Subset<T, PayConfigVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayConfigVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayConfigVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayConfigVersionAggregateArgs>(args: Subset<T, PayConfigVersionAggregateArgs>): Prisma.PrismaPromise<GetPayConfigVersionAggregateType<T>>

    /**
     * Group by PayConfigVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayConfigVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayConfigVersionGroupByArgs['orderBy'] }
        : { orderBy?: PayConfigVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayConfigVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayConfigVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayConfigVersion model
   */
  readonly fields: PayConfigVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayConfigVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayConfigVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayConfigVersion model
   */
  interface PayConfigVersionFieldRefs {
    readonly id: FieldRef<"PayConfigVersion", 'String'>
    readonly version: FieldRef<"PayConfigVersion", 'String'>
    readonly brandFeeBps: FieldRef<"PayConfigVersion", 'Int'>
    readonly creatorFeeBps: FieldRef<"PayConfigVersion", 'Int'>
    readonly gstBps: FieldRef<"PayConfigVersion", 'Int'>
    readonly defaultTdsBps: FieldRef<"PayConfigVersion", 'Int'>
    readonly offerExpiryHours: FieldRef<"PayConfigVersion", 'Int'>
    readonly signWindowHours: FieldRef<"PayConfigVersion", 'Int'>
    readonly paymentWindowHours: FieldRef<"PayConfigVersion", 'Int'>
    readonly reviewSlaHours: FieldRef<"PayConfigVersion", 'Int'>
    readonly holdPeriodHours: FieldRef<"PayConfigVersion", 'Int'>
    readonly disputeWindowHours: FieldRef<"PayConfigVersion", 'Int'>
    readonly minWithdrawalPaise: FieldRef<"PayConfigVersion", 'BigInt'>
    readonly isActive: FieldRef<"PayConfigVersion", 'Boolean'>
    readonly createdBy: FieldRef<"PayConfigVersion", 'String'>
    readonly createdAt: FieldRef<"PayConfigVersion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayConfigVersion findUnique
   */
  export type PayConfigVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigVersion
     */
    select?: PayConfigVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigVersion
     */
    omit?: PayConfigVersionOmit<ExtArgs> | null
    /**
     * Filter, which PayConfigVersion to fetch.
     */
    where: PayConfigVersionWhereUniqueInput
  }

  /**
   * PayConfigVersion findUniqueOrThrow
   */
  export type PayConfigVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigVersion
     */
    select?: PayConfigVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigVersion
     */
    omit?: PayConfigVersionOmit<ExtArgs> | null
    /**
     * Filter, which PayConfigVersion to fetch.
     */
    where: PayConfigVersionWhereUniqueInput
  }

  /**
   * PayConfigVersion findFirst
   */
  export type PayConfigVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigVersion
     */
    select?: PayConfigVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigVersion
     */
    omit?: PayConfigVersionOmit<ExtArgs> | null
    /**
     * Filter, which PayConfigVersion to fetch.
     */
    where?: PayConfigVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayConfigVersions to fetch.
     */
    orderBy?: PayConfigVersionOrderByWithRelationInput | PayConfigVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayConfigVersions.
     */
    cursor?: PayConfigVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayConfigVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayConfigVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayConfigVersions.
     */
    distinct?: PayConfigVersionScalarFieldEnum | PayConfigVersionScalarFieldEnum[]
  }

  /**
   * PayConfigVersion findFirstOrThrow
   */
  export type PayConfigVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigVersion
     */
    select?: PayConfigVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigVersion
     */
    omit?: PayConfigVersionOmit<ExtArgs> | null
    /**
     * Filter, which PayConfigVersion to fetch.
     */
    where?: PayConfigVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayConfigVersions to fetch.
     */
    orderBy?: PayConfigVersionOrderByWithRelationInput | PayConfigVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayConfigVersions.
     */
    cursor?: PayConfigVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayConfigVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayConfigVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayConfigVersions.
     */
    distinct?: PayConfigVersionScalarFieldEnum | PayConfigVersionScalarFieldEnum[]
  }

  /**
   * PayConfigVersion findMany
   */
  export type PayConfigVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigVersion
     */
    select?: PayConfigVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigVersion
     */
    omit?: PayConfigVersionOmit<ExtArgs> | null
    /**
     * Filter, which PayConfigVersions to fetch.
     */
    where?: PayConfigVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayConfigVersions to fetch.
     */
    orderBy?: PayConfigVersionOrderByWithRelationInput | PayConfigVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayConfigVersions.
     */
    cursor?: PayConfigVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayConfigVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayConfigVersions.
     */
    skip?: number
    distinct?: PayConfigVersionScalarFieldEnum | PayConfigVersionScalarFieldEnum[]
  }

  /**
   * PayConfigVersion create
   */
  export type PayConfigVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigVersion
     */
    select?: PayConfigVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigVersion
     */
    omit?: PayConfigVersionOmit<ExtArgs> | null
    /**
     * The data needed to create a PayConfigVersion.
     */
    data: XOR<PayConfigVersionCreateInput, PayConfigVersionUncheckedCreateInput>
  }

  /**
   * PayConfigVersion createMany
   */
  export type PayConfigVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayConfigVersions.
     */
    data: PayConfigVersionCreateManyInput | PayConfigVersionCreateManyInput[]
  }

  /**
   * PayConfigVersion update
   */
  export type PayConfigVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigVersion
     */
    select?: PayConfigVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigVersion
     */
    omit?: PayConfigVersionOmit<ExtArgs> | null
    /**
     * The data needed to update a PayConfigVersion.
     */
    data: XOR<PayConfigVersionUpdateInput, PayConfigVersionUncheckedUpdateInput>
    /**
     * Choose, which PayConfigVersion to update.
     */
    where: PayConfigVersionWhereUniqueInput
  }

  /**
   * PayConfigVersion updateMany
   */
  export type PayConfigVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayConfigVersions.
     */
    data: XOR<PayConfigVersionUpdateManyMutationInput, PayConfigVersionUncheckedUpdateManyInput>
    /**
     * Filter which PayConfigVersions to update
     */
    where?: PayConfigVersionWhereInput
    /**
     * Limit how many PayConfigVersions to update.
     */
    limit?: number
  }

  /**
   * PayConfigVersion upsert
   */
  export type PayConfigVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigVersion
     */
    select?: PayConfigVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigVersion
     */
    omit?: PayConfigVersionOmit<ExtArgs> | null
    /**
     * The filter to search for the PayConfigVersion to update in case it exists.
     */
    where: PayConfigVersionWhereUniqueInput
    /**
     * In case the PayConfigVersion found by the `where` argument doesn't exist, create a new PayConfigVersion with this data.
     */
    create: XOR<PayConfigVersionCreateInput, PayConfigVersionUncheckedCreateInput>
    /**
     * In case the PayConfigVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayConfigVersionUpdateInput, PayConfigVersionUncheckedUpdateInput>
  }

  /**
   * PayConfigVersion delete
   */
  export type PayConfigVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigVersion
     */
    select?: PayConfigVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigVersion
     */
    omit?: PayConfigVersionOmit<ExtArgs> | null
    /**
     * Filter which PayConfigVersion to delete.
     */
    where: PayConfigVersionWhereUniqueInput
  }

  /**
   * PayConfigVersion deleteMany
   */
  export type PayConfigVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayConfigVersions to delete
     */
    where?: PayConfigVersionWhereInput
    /**
     * Limit how many PayConfigVersions to delete.
     */
    limit?: number
  }

  /**
   * PayConfigVersion findRaw
   */
  export type PayConfigVersionFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayConfigVersion aggregateRaw
   */
  export type PayConfigVersionAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayConfigVersion without action
   */
  export type PayConfigVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigVersion
     */
    select?: PayConfigVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigVersion
     */
    omit?: PayConfigVersionOmit<ExtArgs> | null
  }


  /**
   * Model PayFeatureFlag
   */

  export type AggregatePayFeatureFlag = {
    _count: PayFeatureFlagCountAggregateOutputType | null
    _min: PayFeatureFlagMinAggregateOutputType | null
    _max: PayFeatureFlagMaxAggregateOutputType | null
  }

  export type PayFeatureFlagMinAggregateOutputType = {
    id: string | null
    key: string | null
    enabled: boolean | null
    updatedBy: string | null
    reason: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type PayFeatureFlagMaxAggregateOutputType = {
    id: string | null
    key: string | null
    enabled: boolean | null
    updatedBy: string | null
    reason: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type PayFeatureFlagCountAggregateOutputType = {
    id: number
    key: number
    enabled: number
    updatedBy: number
    reason: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type PayFeatureFlagMinAggregateInputType = {
    id?: true
    key?: true
    enabled?: true
    updatedBy?: true
    reason?: true
    updatedAt?: true
    createdAt?: true
  }

  export type PayFeatureFlagMaxAggregateInputType = {
    id?: true
    key?: true
    enabled?: true
    updatedBy?: true
    reason?: true
    updatedAt?: true
    createdAt?: true
  }

  export type PayFeatureFlagCountAggregateInputType = {
    id?: true
    key?: true
    enabled?: true
    updatedBy?: true
    reason?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PayFeatureFlagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayFeatureFlag to aggregate.
     */
    where?: PayFeatureFlagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayFeatureFlags to fetch.
     */
    orderBy?: PayFeatureFlagOrderByWithRelationInput | PayFeatureFlagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayFeatureFlagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayFeatureFlags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayFeatureFlags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayFeatureFlags
    **/
    _count?: true | PayFeatureFlagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayFeatureFlagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayFeatureFlagMaxAggregateInputType
  }

  export type GetPayFeatureFlagAggregateType<T extends PayFeatureFlagAggregateArgs> = {
        [P in keyof T & keyof AggregatePayFeatureFlag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayFeatureFlag[P]>
      : GetScalarType<T[P], AggregatePayFeatureFlag[P]>
  }




  export type PayFeatureFlagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayFeatureFlagWhereInput
    orderBy?: PayFeatureFlagOrderByWithAggregationInput | PayFeatureFlagOrderByWithAggregationInput[]
    by: PayFeatureFlagScalarFieldEnum[] | PayFeatureFlagScalarFieldEnum
    having?: PayFeatureFlagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayFeatureFlagCountAggregateInputType | true
    _min?: PayFeatureFlagMinAggregateInputType
    _max?: PayFeatureFlagMaxAggregateInputType
  }

  export type PayFeatureFlagGroupByOutputType = {
    id: string
    key: string
    enabled: boolean
    updatedBy: string
    reason: string | null
    updatedAt: Date
    createdAt: Date
    _count: PayFeatureFlagCountAggregateOutputType | null
    _min: PayFeatureFlagMinAggregateOutputType | null
    _max: PayFeatureFlagMaxAggregateOutputType | null
  }

  type GetPayFeatureFlagGroupByPayload<T extends PayFeatureFlagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayFeatureFlagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayFeatureFlagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayFeatureFlagGroupByOutputType[P]>
            : GetScalarType<T[P], PayFeatureFlagGroupByOutputType[P]>
        }
      >
    >


  export type PayFeatureFlagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    enabled?: boolean
    updatedBy?: boolean
    reason?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["payFeatureFlag"]>



  export type PayFeatureFlagSelectScalar = {
    id?: boolean
    key?: boolean
    enabled?: boolean
    updatedBy?: boolean
    reason?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }

  export type PayFeatureFlagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "enabled" | "updatedBy" | "reason" | "updatedAt" | "createdAt", ExtArgs["result"]["payFeatureFlag"]>

  export type $PayFeatureFlagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayFeatureFlag"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      enabled: boolean
      updatedBy: string
      reason: string | null
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["payFeatureFlag"]>
    composites: {}
  }

  type PayFeatureFlagGetPayload<S extends boolean | null | undefined | PayFeatureFlagDefaultArgs> = $Result.GetResult<Prisma.$PayFeatureFlagPayload, S>

  type PayFeatureFlagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayFeatureFlagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayFeatureFlagCountAggregateInputType | true
    }

  export interface PayFeatureFlagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayFeatureFlag'], meta: { name: 'PayFeatureFlag' } }
    /**
     * Find zero or one PayFeatureFlag that matches the filter.
     * @param {PayFeatureFlagFindUniqueArgs} args - Arguments to find a PayFeatureFlag
     * @example
     * // Get one PayFeatureFlag
     * const payFeatureFlag = await prisma.payFeatureFlag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayFeatureFlagFindUniqueArgs>(args: SelectSubset<T, PayFeatureFlagFindUniqueArgs<ExtArgs>>): Prisma__PayFeatureFlagClient<$Result.GetResult<Prisma.$PayFeatureFlagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayFeatureFlag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayFeatureFlagFindUniqueOrThrowArgs} args - Arguments to find a PayFeatureFlag
     * @example
     * // Get one PayFeatureFlag
     * const payFeatureFlag = await prisma.payFeatureFlag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayFeatureFlagFindUniqueOrThrowArgs>(args: SelectSubset<T, PayFeatureFlagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayFeatureFlagClient<$Result.GetResult<Prisma.$PayFeatureFlagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayFeatureFlag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayFeatureFlagFindFirstArgs} args - Arguments to find a PayFeatureFlag
     * @example
     * // Get one PayFeatureFlag
     * const payFeatureFlag = await prisma.payFeatureFlag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayFeatureFlagFindFirstArgs>(args?: SelectSubset<T, PayFeatureFlagFindFirstArgs<ExtArgs>>): Prisma__PayFeatureFlagClient<$Result.GetResult<Prisma.$PayFeatureFlagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayFeatureFlag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayFeatureFlagFindFirstOrThrowArgs} args - Arguments to find a PayFeatureFlag
     * @example
     * // Get one PayFeatureFlag
     * const payFeatureFlag = await prisma.payFeatureFlag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayFeatureFlagFindFirstOrThrowArgs>(args?: SelectSubset<T, PayFeatureFlagFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayFeatureFlagClient<$Result.GetResult<Prisma.$PayFeatureFlagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayFeatureFlags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayFeatureFlagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayFeatureFlags
     * const payFeatureFlags = await prisma.payFeatureFlag.findMany()
     * 
     * // Get first 10 PayFeatureFlags
     * const payFeatureFlags = await prisma.payFeatureFlag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payFeatureFlagWithIdOnly = await prisma.payFeatureFlag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayFeatureFlagFindManyArgs>(args?: SelectSubset<T, PayFeatureFlagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayFeatureFlagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayFeatureFlag.
     * @param {PayFeatureFlagCreateArgs} args - Arguments to create a PayFeatureFlag.
     * @example
     * // Create one PayFeatureFlag
     * const PayFeatureFlag = await prisma.payFeatureFlag.create({
     *   data: {
     *     // ... data to create a PayFeatureFlag
     *   }
     * })
     * 
     */
    create<T extends PayFeatureFlagCreateArgs>(args: SelectSubset<T, PayFeatureFlagCreateArgs<ExtArgs>>): Prisma__PayFeatureFlagClient<$Result.GetResult<Prisma.$PayFeatureFlagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayFeatureFlags.
     * @param {PayFeatureFlagCreateManyArgs} args - Arguments to create many PayFeatureFlags.
     * @example
     * // Create many PayFeatureFlags
     * const payFeatureFlag = await prisma.payFeatureFlag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayFeatureFlagCreateManyArgs>(args?: SelectSubset<T, PayFeatureFlagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayFeatureFlag.
     * @param {PayFeatureFlagDeleteArgs} args - Arguments to delete one PayFeatureFlag.
     * @example
     * // Delete one PayFeatureFlag
     * const PayFeatureFlag = await prisma.payFeatureFlag.delete({
     *   where: {
     *     // ... filter to delete one PayFeatureFlag
     *   }
     * })
     * 
     */
    delete<T extends PayFeatureFlagDeleteArgs>(args: SelectSubset<T, PayFeatureFlagDeleteArgs<ExtArgs>>): Prisma__PayFeatureFlagClient<$Result.GetResult<Prisma.$PayFeatureFlagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayFeatureFlag.
     * @param {PayFeatureFlagUpdateArgs} args - Arguments to update one PayFeatureFlag.
     * @example
     * // Update one PayFeatureFlag
     * const payFeatureFlag = await prisma.payFeatureFlag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayFeatureFlagUpdateArgs>(args: SelectSubset<T, PayFeatureFlagUpdateArgs<ExtArgs>>): Prisma__PayFeatureFlagClient<$Result.GetResult<Prisma.$PayFeatureFlagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayFeatureFlags.
     * @param {PayFeatureFlagDeleteManyArgs} args - Arguments to filter PayFeatureFlags to delete.
     * @example
     * // Delete a few PayFeatureFlags
     * const { count } = await prisma.payFeatureFlag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayFeatureFlagDeleteManyArgs>(args?: SelectSubset<T, PayFeatureFlagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayFeatureFlags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayFeatureFlagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayFeatureFlags
     * const payFeatureFlag = await prisma.payFeatureFlag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayFeatureFlagUpdateManyArgs>(args: SelectSubset<T, PayFeatureFlagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayFeatureFlag.
     * @param {PayFeatureFlagUpsertArgs} args - Arguments to update or create a PayFeatureFlag.
     * @example
     * // Update or create a PayFeatureFlag
     * const payFeatureFlag = await prisma.payFeatureFlag.upsert({
     *   create: {
     *     // ... data to create a PayFeatureFlag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayFeatureFlag we want to update
     *   }
     * })
     */
    upsert<T extends PayFeatureFlagUpsertArgs>(args: SelectSubset<T, PayFeatureFlagUpsertArgs<ExtArgs>>): Prisma__PayFeatureFlagClient<$Result.GetResult<Prisma.$PayFeatureFlagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayFeatureFlags that matches the filter.
     * @param {PayFeatureFlagFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payFeatureFlag = await prisma.payFeatureFlag.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayFeatureFlagFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayFeatureFlag.
     * @param {PayFeatureFlagAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payFeatureFlag = await prisma.payFeatureFlag.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayFeatureFlagAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayFeatureFlags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayFeatureFlagCountArgs} args - Arguments to filter PayFeatureFlags to count.
     * @example
     * // Count the number of PayFeatureFlags
     * const count = await prisma.payFeatureFlag.count({
     *   where: {
     *     // ... the filter for the PayFeatureFlags we want to count
     *   }
     * })
    **/
    count<T extends PayFeatureFlagCountArgs>(
      args?: Subset<T, PayFeatureFlagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayFeatureFlagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayFeatureFlag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayFeatureFlagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayFeatureFlagAggregateArgs>(args: Subset<T, PayFeatureFlagAggregateArgs>): Prisma.PrismaPromise<GetPayFeatureFlagAggregateType<T>>

    /**
     * Group by PayFeatureFlag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayFeatureFlagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayFeatureFlagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayFeatureFlagGroupByArgs['orderBy'] }
        : { orderBy?: PayFeatureFlagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayFeatureFlagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayFeatureFlagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayFeatureFlag model
   */
  readonly fields: PayFeatureFlagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayFeatureFlag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayFeatureFlagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayFeatureFlag model
   */
  interface PayFeatureFlagFieldRefs {
    readonly id: FieldRef<"PayFeatureFlag", 'String'>
    readonly key: FieldRef<"PayFeatureFlag", 'String'>
    readonly enabled: FieldRef<"PayFeatureFlag", 'Boolean'>
    readonly updatedBy: FieldRef<"PayFeatureFlag", 'String'>
    readonly reason: FieldRef<"PayFeatureFlag", 'String'>
    readonly updatedAt: FieldRef<"PayFeatureFlag", 'DateTime'>
    readonly createdAt: FieldRef<"PayFeatureFlag", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayFeatureFlag findUnique
   */
  export type PayFeatureFlagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayFeatureFlag
     */
    select?: PayFeatureFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayFeatureFlag
     */
    omit?: PayFeatureFlagOmit<ExtArgs> | null
    /**
     * Filter, which PayFeatureFlag to fetch.
     */
    where: PayFeatureFlagWhereUniqueInput
  }

  /**
   * PayFeatureFlag findUniqueOrThrow
   */
  export type PayFeatureFlagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayFeatureFlag
     */
    select?: PayFeatureFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayFeatureFlag
     */
    omit?: PayFeatureFlagOmit<ExtArgs> | null
    /**
     * Filter, which PayFeatureFlag to fetch.
     */
    where: PayFeatureFlagWhereUniqueInput
  }

  /**
   * PayFeatureFlag findFirst
   */
  export type PayFeatureFlagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayFeatureFlag
     */
    select?: PayFeatureFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayFeatureFlag
     */
    omit?: PayFeatureFlagOmit<ExtArgs> | null
    /**
     * Filter, which PayFeatureFlag to fetch.
     */
    where?: PayFeatureFlagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayFeatureFlags to fetch.
     */
    orderBy?: PayFeatureFlagOrderByWithRelationInput | PayFeatureFlagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayFeatureFlags.
     */
    cursor?: PayFeatureFlagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayFeatureFlags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayFeatureFlags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayFeatureFlags.
     */
    distinct?: PayFeatureFlagScalarFieldEnum | PayFeatureFlagScalarFieldEnum[]
  }

  /**
   * PayFeatureFlag findFirstOrThrow
   */
  export type PayFeatureFlagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayFeatureFlag
     */
    select?: PayFeatureFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayFeatureFlag
     */
    omit?: PayFeatureFlagOmit<ExtArgs> | null
    /**
     * Filter, which PayFeatureFlag to fetch.
     */
    where?: PayFeatureFlagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayFeatureFlags to fetch.
     */
    orderBy?: PayFeatureFlagOrderByWithRelationInput | PayFeatureFlagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayFeatureFlags.
     */
    cursor?: PayFeatureFlagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayFeatureFlags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayFeatureFlags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayFeatureFlags.
     */
    distinct?: PayFeatureFlagScalarFieldEnum | PayFeatureFlagScalarFieldEnum[]
  }

  /**
   * PayFeatureFlag findMany
   */
  export type PayFeatureFlagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayFeatureFlag
     */
    select?: PayFeatureFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayFeatureFlag
     */
    omit?: PayFeatureFlagOmit<ExtArgs> | null
    /**
     * Filter, which PayFeatureFlags to fetch.
     */
    where?: PayFeatureFlagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayFeatureFlags to fetch.
     */
    orderBy?: PayFeatureFlagOrderByWithRelationInput | PayFeatureFlagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayFeatureFlags.
     */
    cursor?: PayFeatureFlagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayFeatureFlags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayFeatureFlags.
     */
    skip?: number
    distinct?: PayFeatureFlagScalarFieldEnum | PayFeatureFlagScalarFieldEnum[]
  }

  /**
   * PayFeatureFlag create
   */
  export type PayFeatureFlagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayFeatureFlag
     */
    select?: PayFeatureFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayFeatureFlag
     */
    omit?: PayFeatureFlagOmit<ExtArgs> | null
    /**
     * The data needed to create a PayFeatureFlag.
     */
    data: XOR<PayFeatureFlagCreateInput, PayFeatureFlagUncheckedCreateInput>
  }

  /**
   * PayFeatureFlag createMany
   */
  export type PayFeatureFlagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayFeatureFlags.
     */
    data: PayFeatureFlagCreateManyInput | PayFeatureFlagCreateManyInput[]
  }

  /**
   * PayFeatureFlag update
   */
  export type PayFeatureFlagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayFeatureFlag
     */
    select?: PayFeatureFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayFeatureFlag
     */
    omit?: PayFeatureFlagOmit<ExtArgs> | null
    /**
     * The data needed to update a PayFeatureFlag.
     */
    data: XOR<PayFeatureFlagUpdateInput, PayFeatureFlagUncheckedUpdateInput>
    /**
     * Choose, which PayFeatureFlag to update.
     */
    where: PayFeatureFlagWhereUniqueInput
  }

  /**
   * PayFeatureFlag updateMany
   */
  export type PayFeatureFlagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayFeatureFlags.
     */
    data: XOR<PayFeatureFlagUpdateManyMutationInput, PayFeatureFlagUncheckedUpdateManyInput>
    /**
     * Filter which PayFeatureFlags to update
     */
    where?: PayFeatureFlagWhereInput
    /**
     * Limit how many PayFeatureFlags to update.
     */
    limit?: number
  }

  /**
   * PayFeatureFlag upsert
   */
  export type PayFeatureFlagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayFeatureFlag
     */
    select?: PayFeatureFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayFeatureFlag
     */
    omit?: PayFeatureFlagOmit<ExtArgs> | null
    /**
     * The filter to search for the PayFeatureFlag to update in case it exists.
     */
    where: PayFeatureFlagWhereUniqueInput
    /**
     * In case the PayFeatureFlag found by the `where` argument doesn't exist, create a new PayFeatureFlag with this data.
     */
    create: XOR<PayFeatureFlagCreateInput, PayFeatureFlagUncheckedCreateInput>
    /**
     * In case the PayFeatureFlag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayFeatureFlagUpdateInput, PayFeatureFlagUncheckedUpdateInput>
  }

  /**
   * PayFeatureFlag delete
   */
  export type PayFeatureFlagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayFeatureFlag
     */
    select?: PayFeatureFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayFeatureFlag
     */
    omit?: PayFeatureFlagOmit<ExtArgs> | null
    /**
     * Filter which PayFeatureFlag to delete.
     */
    where: PayFeatureFlagWhereUniqueInput
  }

  /**
   * PayFeatureFlag deleteMany
   */
  export type PayFeatureFlagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayFeatureFlags to delete
     */
    where?: PayFeatureFlagWhereInput
    /**
     * Limit how many PayFeatureFlags to delete.
     */
    limit?: number
  }

  /**
   * PayFeatureFlag findRaw
   */
  export type PayFeatureFlagFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayFeatureFlag aggregateRaw
   */
  export type PayFeatureFlagAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayFeatureFlag without action
   */
  export type PayFeatureFlagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayFeatureFlag
     */
    select?: PayFeatureFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayFeatureFlag
     */
    omit?: PayFeatureFlagOmit<ExtArgs> | null
  }


  /**
   * Model PayConfigApproval
   */

  export type AggregatePayConfigApproval = {
    _count: PayConfigApprovalCountAggregateOutputType | null
    _min: PayConfigApprovalMinAggregateOutputType | null
    _max: PayConfigApprovalMaxAggregateOutputType | null
  }

  export type PayConfigApprovalMinAggregateOutputType = {
    id: string | null
    approvalType: string | null
    approvedBy: string | null
    scope: string | null
    reason: string | null
    isActive: boolean | null
    approvedAt: Date | null
    revokedAt: Date | null
  }

  export type PayConfigApprovalMaxAggregateOutputType = {
    id: string | null
    approvalType: string | null
    approvedBy: string | null
    scope: string | null
    reason: string | null
    isActive: boolean | null
    approvedAt: Date | null
    revokedAt: Date | null
  }

  export type PayConfigApprovalCountAggregateOutputType = {
    id: number
    approvalType: number
    approvedBy: number
    scope: number
    reason: number
    isActive: number
    approvedAt: number
    revokedAt: number
    _all: number
  }


  export type PayConfigApprovalMinAggregateInputType = {
    id?: true
    approvalType?: true
    approvedBy?: true
    scope?: true
    reason?: true
    isActive?: true
    approvedAt?: true
    revokedAt?: true
  }

  export type PayConfigApprovalMaxAggregateInputType = {
    id?: true
    approvalType?: true
    approvedBy?: true
    scope?: true
    reason?: true
    isActive?: true
    approvedAt?: true
    revokedAt?: true
  }

  export type PayConfigApprovalCountAggregateInputType = {
    id?: true
    approvalType?: true
    approvedBy?: true
    scope?: true
    reason?: true
    isActive?: true
    approvedAt?: true
    revokedAt?: true
    _all?: true
  }

  export type PayConfigApprovalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayConfigApproval to aggregate.
     */
    where?: PayConfigApprovalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayConfigApprovals to fetch.
     */
    orderBy?: PayConfigApprovalOrderByWithRelationInput | PayConfigApprovalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayConfigApprovalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayConfigApprovals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayConfigApprovals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayConfigApprovals
    **/
    _count?: true | PayConfigApprovalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayConfigApprovalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayConfigApprovalMaxAggregateInputType
  }

  export type GetPayConfigApprovalAggregateType<T extends PayConfigApprovalAggregateArgs> = {
        [P in keyof T & keyof AggregatePayConfigApproval]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayConfigApproval[P]>
      : GetScalarType<T[P], AggregatePayConfigApproval[P]>
  }




  export type PayConfigApprovalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayConfigApprovalWhereInput
    orderBy?: PayConfigApprovalOrderByWithAggregationInput | PayConfigApprovalOrderByWithAggregationInput[]
    by: PayConfigApprovalScalarFieldEnum[] | PayConfigApprovalScalarFieldEnum
    having?: PayConfigApprovalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayConfigApprovalCountAggregateInputType | true
    _min?: PayConfigApprovalMinAggregateInputType
    _max?: PayConfigApprovalMaxAggregateInputType
  }

  export type PayConfigApprovalGroupByOutputType = {
    id: string
    approvalType: string
    approvedBy: string
    scope: string
    reason: string
    isActive: boolean
    approvedAt: Date
    revokedAt: Date | null
    _count: PayConfigApprovalCountAggregateOutputType | null
    _min: PayConfigApprovalMinAggregateOutputType | null
    _max: PayConfigApprovalMaxAggregateOutputType | null
  }

  type GetPayConfigApprovalGroupByPayload<T extends PayConfigApprovalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayConfigApprovalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayConfigApprovalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayConfigApprovalGroupByOutputType[P]>
            : GetScalarType<T[P], PayConfigApprovalGroupByOutputType[P]>
        }
      >
    >


  export type PayConfigApprovalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    approvalType?: boolean
    approvedBy?: boolean
    scope?: boolean
    reason?: boolean
    isActive?: boolean
    approvedAt?: boolean
    revokedAt?: boolean
  }, ExtArgs["result"]["payConfigApproval"]>



  export type PayConfigApprovalSelectScalar = {
    id?: boolean
    approvalType?: boolean
    approvedBy?: boolean
    scope?: boolean
    reason?: boolean
    isActive?: boolean
    approvedAt?: boolean
    revokedAt?: boolean
  }

  export type PayConfigApprovalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "approvalType" | "approvedBy" | "scope" | "reason" | "isActive" | "approvedAt" | "revokedAt", ExtArgs["result"]["payConfigApproval"]>

  export type $PayConfigApprovalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayConfigApproval"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      approvalType: string
      approvedBy: string
      scope: string
      reason: string
      isActive: boolean
      approvedAt: Date
      revokedAt: Date | null
    }, ExtArgs["result"]["payConfigApproval"]>
    composites: {}
  }

  type PayConfigApprovalGetPayload<S extends boolean | null | undefined | PayConfigApprovalDefaultArgs> = $Result.GetResult<Prisma.$PayConfigApprovalPayload, S>

  type PayConfigApprovalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayConfigApprovalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayConfigApprovalCountAggregateInputType | true
    }

  export interface PayConfigApprovalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayConfigApproval'], meta: { name: 'PayConfigApproval' } }
    /**
     * Find zero or one PayConfigApproval that matches the filter.
     * @param {PayConfigApprovalFindUniqueArgs} args - Arguments to find a PayConfigApproval
     * @example
     * // Get one PayConfigApproval
     * const payConfigApproval = await prisma.payConfigApproval.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayConfigApprovalFindUniqueArgs>(args: SelectSubset<T, PayConfigApprovalFindUniqueArgs<ExtArgs>>): Prisma__PayConfigApprovalClient<$Result.GetResult<Prisma.$PayConfigApprovalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayConfigApproval that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayConfigApprovalFindUniqueOrThrowArgs} args - Arguments to find a PayConfigApproval
     * @example
     * // Get one PayConfigApproval
     * const payConfigApproval = await prisma.payConfigApproval.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayConfigApprovalFindUniqueOrThrowArgs>(args: SelectSubset<T, PayConfigApprovalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayConfigApprovalClient<$Result.GetResult<Prisma.$PayConfigApprovalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayConfigApproval that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigApprovalFindFirstArgs} args - Arguments to find a PayConfigApproval
     * @example
     * // Get one PayConfigApproval
     * const payConfigApproval = await prisma.payConfigApproval.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayConfigApprovalFindFirstArgs>(args?: SelectSubset<T, PayConfigApprovalFindFirstArgs<ExtArgs>>): Prisma__PayConfigApprovalClient<$Result.GetResult<Prisma.$PayConfigApprovalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayConfigApproval that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigApprovalFindFirstOrThrowArgs} args - Arguments to find a PayConfigApproval
     * @example
     * // Get one PayConfigApproval
     * const payConfigApproval = await prisma.payConfigApproval.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayConfigApprovalFindFirstOrThrowArgs>(args?: SelectSubset<T, PayConfigApprovalFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayConfigApprovalClient<$Result.GetResult<Prisma.$PayConfigApprovalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayConfigApprovals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigApprovalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayConfigApprovals
     * const payConfigApprovals = await prisma.payConfigApproval.findMany()
     * 
     * // Get first 10 PayConfigApprovals
     * const payConfigApprovals = await prisma.payConfigApproval.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payConfigApprovalWithIdOnly = await prisma.payConfigApproval.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayConfigApprovalFindManyArgs>(args?: SelectSubset<T, PayConfigApprovalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayConfigApprovalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayConfigApproval.
     * @param {PayConfigApprovalCreateArgs} args - Arguments to create a PayConfigApproval.
     * @example
     * // Create one PayConfigApproval
     * const PayConfigApproval = await prisma.payConfigApproval.create({
     *   data: {
     *     // ... data to create a PayConfigApproval
     *   }
     * })
     * 
     */
    create<T extends PayConfigApprovalCreateArgs>(args: SelectSubset<T, PayConfigApprovalCreateArgs<ExtArgs>>): Prisma__PayConfigApprovalClient<$Result.GetResult<Prisma.$PayConfigApprovalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayConfigApprovals.
     * @param {PayConfigApprovalCreateManyArgs} args - Arguments to create many PayConfigApprovals.
     * @example
     * // Create many PayConfigApprovals
     * const payConfigApproval = await prisma.payConfigApproval.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayConfigApprovalCreateManyArgs>(args?: SelectSubset<T, PayConfigApprovalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayConfigApproval.
     * @param {PayConfigApprovalDeleteArgs} args - Arguments to delete one PayConfigApproval.
     * @example
     * // Delete one PayConfigApproval
     * const PayConfigApproval = await prisma.payConfigApproval.delete({
     *   where: {
     *     // ... filter to delete one PayConfigApproval
     *   }
     * })
     * 
     */
    delete<T extends PayConfigApprovalDeleteArgs>(args: SelectSubset<T, PayConfigApprovalDeleteArgs<ExtArgs>>): Prisma__PayConfigApprovalClient<$Result.GetResult<Prisma.$PayConfigApprovalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayConfigApproval.
     * @param {PayConfigApprovalUpdateArgs} args - Arguments to update one PayConfigApproval.
     * @example
     * // Update one PayConfigApproval
     * const payConfigApproval = await prisma.payConfigApproval.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayConfigApprovalUpdateArgs>(args: SelectSubset<T, PayConfigApprovalUpdateArgs<ExtArgs>>): Prisma__PayConfigApprovalClient<$Result.GetResult<Prisma.$PayConfigApprovalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayConfigApprovals.
     * @param {PayConfigApprovalDeleteManyArgs} args - Arguments to filter PayConfigApprovals to delete.
     * @example
     * // Delete a few PayConfigApprovals
     * const { count } = await prisma.payConfigApproval.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayConfigApprovalDeleteManyArgs>(args?: SelectSubset<T, PayConfigApprovalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayConfigApprovals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigApprovalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayConfigApprovals
     * const payConfigApproval = await prisma.payConfigApproval.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayConfigApprovalUpdateManyArgs>(args: SelectSubset<T, PayConfigApprovalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayConfigApproval.
     * @param {PayConfigApprovalUpsertArgs} args - Arguments to update or create a PayConfigApproval.
     * @example
     * // Update or create a PayConfigApproval
     * const payConfigApproval = await prisma.payConfigApproval.upsert({
     *   create: {
     *     // ... data to create a PayConfigApproval
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayConfigApproval we want to update
     *   }
     * })
     */
    upsert<T extends PayConfigApprovalUpsertArgs>(args: SelectSubset<T, PayConfigApprovalUpsertArgs<ExtArgs>>): Prisma__PayConfigApprovalClient<$Result.GetResult<Prisma.$PayConfigApprovalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayConfigApprovals that matches the filter.
     * @param {PayConfigApprovalFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payConfigApproval = await prisma.payConfigApproval.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayConfigApprovalFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayConfigApproval.
     * @param {PayConfigApprovalAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payConfigApproval = await prisma.payConfigApproval.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayConfigApprovalAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayConfigApprovals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigApprovalCountArgs} args - Arguments to filter PayConfigApprovals to count.
     * @example
     * // Count the number of PayConfigApprovals
     * const count = await prisma.payConfigApproval.count({
     *   where: {
     *     // ... the filter for the PayConfigApprovals we want to count
     *   }
     * })
    **/
    count<T extends PayConfigApprovalCountArgs>(
      args?: Subset<T, PayConfigApprovalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayConfigApprovalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayConfigApproval.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigApprovalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayConfigApprovalAggregateArgs>(args: Subset<T, PayConfigApprovalAggregateArgs>): Prisma.PrismaPromise<GetPayConfigApprovalAggregateType<T>>

    /**
     * Group by PayConfigApproval.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConfigApprovalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayConfigApprovalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayConfigApprovalGroupByArgs['orderBy'] }
        : { orderBy?: PayConfigApprovalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayConfigApprovalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayConfigApprovalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayConfigApproval model
   */
  readonly fields: PayConfigApprovalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayConfigApproval.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayConfigApprovalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayConfigApproval model
   */
  interface PayConfigApprovalFieldRefs {
    readonly id: FieldRef<"PayConfigApproval", 'String'>
    readonly approvalType: FieldRef<"PayConfigApproval", 'String'>
    readonly approvedBy: FieldRef<"PayConfigApproval", 'String'>
    readonly scope: FieldRef<"PayConfigApproval", 'String'>
    readonly reason: FieldRef<"PayConfigApproval", 'String'>
    readonly isActive: FieldRef<"PayConfigApproval", 'Boolean'>
    readonly approvedAt: FieldRef<"PayConfigApproval", 'DateTime'>
    readonly revokedAt: FieldRef<"PayConfigApproval", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayConfigApproval findUnique
   */
  export type PayConfigApprovalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigApproval
     */
    select?: PayConfigApprovalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigApproval
     */
    omit?: PayConfigApprovalOmit<ExtArgs> | null
    /**
     * Filter, which PayConfigApproval to fetch.
     */
    where: PayConfigApprovalWhereUniqueInput
  }

  /**
   * PayConfigApproval findUniqueOrThrow
   */
  export type PayConfigApprovalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigApproval
     */
    select?: PayConfigApprovalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigApproval
     */
    omit?: PayConfigApprovalOmit<ExtArgs> | null
    /**
     * Filter, which PayConfigApproval to fetch.
     */
    where: PayConfigApprovalWhereUniqueInput
  }

  /**
   * PayConfigApproval findFirst
   */
  export type PayConfigApprovalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigApproval
     */
    select?: PayConfigApprovalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigApproval
     */
    omit?: PayConfigApprovalOmit<ExtArgs> | null
    /**
     * Filter, which PayConfigApproval to fetch.
     */
    where?: PayConfigApprovalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayConfigApprovals to fetch.
     */
    orderBy?: PayConfigApprovalOrderByWithRelationInput | PayConfigApprovalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayConfigApprovals.
     */
    cursor?: PayConfigApprovalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayConfigApprovals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayConfigApprovals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayConfigApprovals.
     */
    distinct?: PayConfigApprovalScalarFieldEnum | PayConfigApprovalScalarFieldEnum[]
  }

  /**
   * PayConfigApproval findFirstOrThrow
   */
  export type PayConfigApprovalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigApproval
     */
    select?: PayConfigApprovalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigApproval
     */
    omit?: PayConfigApprovalOmit<ExtArgs> | null
    /**
     * Filter, which PayConfigApproval to fetch.
     */
    where?: PayConfigApprovalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayConfigApprovals to fetch.
     */
    orderBy?: PayConfigApprovalOrderByWithRelationInput | PayConfigApprovalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayConfigApprovals.
     */
    cursor?: PayConfigApprovalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayConfigApprovals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayConfigApprovals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayConfigApprovals.
     */
    distinct?: PayConfigApprovalScalarFieldEnum | PayConfigApprovalScalarFieldEnum[]
  }

  /**
   * PayConfigApproval findMany
   */
  export type PayConfigApprovalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigApproval
     */
    select?: PayConfigApprovalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigApproval
     */
    omit?: PayConfigApprovalOmit<ExtArgs> | null
    /**
     * Filter, which PayConfigApprovals to fetch.
     */
    where?: PayConfigApprovalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayConfigApprovals to fetch.
     */
    orderBy?: PayConfigApprovalOrderByWithRelationInput | PayConfigApprovalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayConfigApprovals.
     */
    cursor?: PayConfigApprovalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayConfigApprovals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayConfigApprovals.
     */
    skip?: number
    distinct?: PayConfigApprovalScalarFieldEnum | PayConfigApprovalScalarFieldEnum[]
  }

  /**
   * PayConfigApproval create
   */
  export type PayConfigApprovalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigApproval
     */
    select?: PayConfigApprovalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigApproval
     */
    omit?: PayConfigApprovalOmit<ExtArgs> | null
    /**
     * The data needed to create a PayConfigApproval.
     */
    data: XOR<PayConfigApprovalCreateInput, PayConfigApprovalUncheckedCreateInput>
  }

  /**
   * PayConfigApproval createMany
   */
  export type PayConfigApprovalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayConfigApprovals.
     */
    data: PayConfigApprovalCreateManyInput | PayConfigApprovalCreateManyInput[]
  }

  /**
   * PayConfigApproval update
   */
  export type PayConfigApprovalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigApproval
     */
    select?: PayConfigApprovalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigApproval
     */
    omit?: PayConfigApprovalOmit<ExtArgs> | null
    /**
     * The data needed to update a PayConfigApproval.
     */
    data: XOR<PayConfigApprovalUpdateInput, PayConfigApprovalUncheckedUpdateInput>
    /**
     * Choose, which PayConfigApproval to update.
     */
    where: PayConfigApprovalWhereUniqueInput
  }

  /**
   * PayConfigApproval updateMany
   */
  export type PayConfigApprovalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayConfigApprovals.
     */
    data: XOR<PayConfigApprovalUpdateManyMutationInput, PayConfigApprovalUncheckedUpdateManyInput>
    /**
     * Filter which PayConfigApprovals to update
     */
    where?: PayConfigApprovalWhereInput
    /**
     * Limit how many PayConfigApprovals to update.
     */
    limit?: number
  }

  /**
   * PayConfigApproval upsert
   */
  export type PayConfigApprovalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigApproval
     */
    select?: PayConfigApprovalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigApproval
     */
    omit?: PayConfigApprovalOmit<ExtArgs> | null
    /**
     * The filter to search for the PayConfigApproval to update in case it exists.
     */
    where: PayConfigApprovalWhereUniqueInput
    /**
     * In case the PayConfigApproval found by the `where` argument doesn't exist, create a new PayConfigApproval with this data.
     */
    create: XOR<PayConfigApprovalCreateInput, PayConfigApprovalUncheckedCreateInput>
    /**
     * In case the PayConfigApproval was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayConfigApprovalUpdateInput, PayConfigApprovalUncheckedUpdateInput>
  }

  /**
   * PayConfigApproval delete
   */
  export type PayConfigApprovalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigApproval
     */
    select?: PayConfigApprovalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigApproval
     */
    omit?: PayConfigApprovalOmit<ExtArgs> | null
    /**
     * Filter which PayConfigApproval to delete.
     */
    where: PayConfigApprovalWhereUniqueInput
  }

  /**
   * PayConfigApproval deleteMany
   */
  export type PayConfigApprovalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayConfigApprovals to delete
     */
    where?: PayConfigApprovalWhereInput
    /**
     * Limit how many PayConfigApprovals to delete.
     */
    limit?: number
  }

  /**
   * PayConfigApproval findRaw
   */
  export type PayConfigApprovalFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayConfigApproval aggregateRaw
   */
  export type PayConfigApprovalAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayConfigApproval without action
   */
  export type PayConfigApprovalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConfigApproval
     */
    select?: PayConfigApprovalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConfigApproval
     */
    omit?: PayConfigApprovalOmit<ExtArgs> | null
  }


  /**
   * Model PayIdempotencyRecord
   */

  export type AggregatePayIdempotencyRecord = {
    _count: PayIdempotencyRecordCountAggregateOutputType | null
    _avg: PayIdempotencyRecordAvgAggregateOutputType | null
    _sum: PayIdempotencyRecordSumAggregateOutputType | null
    _min: PayIdempotencyRecordMinAggregateOutputType | null
    _max: PayIdempotencyRecordMaxAggregateOutputType | null
  }

  export type PayIdempotencyRecordAvgAggregateOutputType = {
    statusCode: number | null
  }

  export type PayIdempotencyRecordSumAggregateOutputType = {
    statusCode: number | null
  }

  export type PayIdempotencyRecordMinAggregateOutputType = {
    id: string | null
    scope: string | null
    key: string | null
    requestHash: string | null
    status: string | null
    statusCode: number | null
    responseJson: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayIdempotencyRecordMaxAggregateOutputType = {
    id: string | null
    scope: string | null
    key: string | null
    requestHash: string | null
    status: string | null
    statusCode: number | null
    responseJson: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayIdempotencyRecordCountAggregateOutputType = {
    id: number
    scope: number
    key: number
    requestHash: number
    status: number
    statusCode: number
    responseJson: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PayIdempotencyRecordAvgAggregateInputType = {
    statusCode?: true
  }

  export type PayIdempotencyRecordSumAggregateInputType = {
    statusCode?: true
  }

  export type PayIdempotencyRecordMinAggregateInputType = {
    id?: true
    scope?: true
    key?: true
    requestHash?: true
    status?: true
    statusCode?: true
    responseJson?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayIdempotencyRecordMaxAggregateInputType = {
    id?: true
    scope?: true
    key?: true
    requestHash?: true
    status?: true
    statusCode?: true
    responseJson?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayIdempotencyRecordCountAggregateInputType = {
    id?: true
    scope?: true
    key?: true
    requestHash?: true
    status?: true
    statusCode?: true
    responseJson?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PayIdempotencyRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayIdempotencyRecord to aggregate.
     */
    where?: PayIdempotencyRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayIdempotencyRecords to fetch.
     */
    orderBy?: PayIdempotencyRecordOrderByWithRelationInput | PayIdempotencyRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayIdempotencyRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayIdempotencyRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayIdempotencyRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayIdempotencyRecords
    **/
    _count?: true | PayIdempotencyRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayIdempotencyRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayIdempotencyRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayIdempotencyRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayIdempotencyRecordMaxAggregateInputType
  }

  export type GetPayIdempotencyRecordAggregateType<T extends PayIdempotencyRecordAggregateArgs> = {
        [P in keyof T & keyof AggregatePayIdempotencyRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayIdempotencyRecord[P]>
      : GetScalarType<T[P], AggregatePayIdempotencyRecord[P]>
  }




  export type PayIdempotencyRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayIdempotencyRecordWhereInput
    orderBy?: PayIdempotencyRecordOrderByWithAggregationInput | PayIdempotencyRecordOrderByWithAggregationInput[]
    by: PayIdempotencyRecordScalarFieldEnum[] | PayIdempotencyRecordScalarFieldEnum
    having?: PayIdempotencyRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayIdempotencyRecordCountAggregateInputType | true
    _avg?: PayIdempotencyRecordAvgAggregateInputType
    _sum?: PayIdempotencyRecordSumAggregateInputType
    _min?: PayIdempotencyRecordMinAggregateInputType
    _max?: PayIdempotencyRecordMaxAggregateInputType
  }

  export type PayIdempotencyRecordGroupByOutputType = {
    id: string
    scope: string
    key: string
    requestHash: string
    status: string
    statusCode: number | null
    responseJson: string | null
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: PayIdempotencyRecordCountAggregateOutputType | null
    _avg: PayIdempotencyRecordAvgAggregateOutputType | null
    _sum: PayIdempotencyRecordSumAggregateOutputType | null
    _min: PayIdempotencyRecordMinAggregateOutputType | null
    _max: PayIdempotencyRecordMaxAggregateOutputType | null
  }

  type GetPayIdempotencyRecordGroupByPayload<T extends PayIdempotencyRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayIdempotencyRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayIdempotencyRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayIdempotencyRecordGroupByOutputType[P]>
            : GetScalarType<T[P], PayIdempotencyRecordGroupByOutputType[P]>
        }
      >
    >


  export type PayIdempotencyRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scope?: boolean
    key?: boolean
    requestHash?: boolean
    status?: boolean
    statusCode?: boolean
    responseJson?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["payIdempotencyRecord"]>



  export type PayIdempotencyRecordSelectScalar = {
    id?: boolean
    scope?: boolean
    key?: boolean
    requestHash?: boolean
    status?: boolean
    statusCode?: boolean
    responseJson?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PayIdempotencyRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scope" | "key" | "requestHash" | "status" | "statusCode" | "responseJson" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["payIdempotencyRecord"]>

  export type $PayIdempotencyRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayIdempotencyRecord"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      scope: string
      key: string
      requestHash: string
      status: string
      statusCode: number | null
      responseJson: string | null
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["payIdempotencyRecord"]>
    composites: {}
  }

  type PayIdempotencyRecordGetPayload<S extends boolean | null | undefined | PayIdempotencyRecordDefaultArgs> = $Result.GetResult<Prisma.$PayIdempotencyRecordPayload, S>

  type PayIdempotencyRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayIdempotencyRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayIdempotencyRecordCountAggregateInputType | true
    }

  export interface PayIdempotencyRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayIdempotencyRecord'], meta: { name: 'PayIdempotencyRecord' } }
    /**
     * Find zero or one PayIdempotencyRecord that matches the filter.
     * @param {PayIdempotencyRecordFindUniqueArgs} args - Arguments to find a PayIdempotencyRecord
     * @example
     * // Get one PayIdempotencyRecord
     * const payIdempotencyRecord = await prisma.payIdempotencyRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayIdempotencyRecordFindUniqueArgs>(args: SelectSubset<T, PayIdempotencyRecordFindUniqueArgs<ExtArgs>>): Prisma__PayIdempotencyRecordClient<$Result.GetResult<Prisma.$PayIdempotencyRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayIdempotencyRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayIdempotencyRecordFindUniqueOrThrowArgs} args - Arguments to find a PayIdempotencyRecord
     * @example
     * // Get one PayIdempotencyRecord
     * const payIdempotencyRecord = await prisma.payIdempotencyRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayIdempotencyRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, PayIdempotencyRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayIdempotencyRecordClient<$Result.GetResult<Prisma.$PayIdempotencyRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayIdempotencyRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayIdempotencyRecordFindFirstArgs} args - Arguments to find a PayIdempotencyRecord
     * @example
     * // Get one PayIdempotencyRecord
     * const payIdempotencyRecord = await prisma.payIdempotencyRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayIdempotencyRecordFindFirstArgs>(args?: SelectSubset<T, PayIdempotencyRecordFindFirstArgs<ExtArgs>>): Prisma__PayIdempotencyRecordClient<$Result.GetResult<Prisma.$PayIdempotencyRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayIdempotencyRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayIdempotencyRecordFindFirstOrThrowArgs} args - Arguments to find a PayIdempotencyRecord
     * @example
     * // Get one PayIdempotencyRecord
     * const payIdempotencyRecord = await prisma.payIdempotencyRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayIdempotencyRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, PayIdempotencyRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayIdempotencyRecordClient<$Result.GetResult<Prisma.$PayIdempotencyRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayIdempotencyRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayIdempotencyRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayIdempotencyRecords
     * const payIdempotencyRecords = await prisma.payIdempotencyRecord.findMany()
     * 
     * // Get first 10 PayIdempotencyRecords
     * const payIdempotencyRecords = await prisma.payIdempotencyRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payIdempotencyRecordWithIdOnly = await prisma.payIdempotencyRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayIdempotencyRecordFindManyArgs>(args?: SelectSubset<T, PayIdempotencyRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayIdempotencyRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayIdempotencyRecord.
     * @param {PayIdempotencyRecordCreateArgs} args - Arguments to create a PayIdempotencyRecord.
     * @example
     * // Create one PayIdempotencyRecord
     * const PayIdempotencyRecord = await prisma.payIdempotencyRecord.create({
     *   data: {
     *     // ... data to create a PayIdempotencyRecord
     *   }
     * })
     * 
     */
    create<T extends PayIdempotencyRecordCreateArgs>(args: SelectSubset<T, PayIdempotencyRecordCreateArgs<ExtArgs>>): Prisma__PayIdempotencyRecordClient<$Result.GetResult<Prisma.$PayIdempotencyRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayIdempotencyRecords.
     * @param {PayIdempotencyRecordCreateManyArgs} args - Arguments to create many PayIdempotencyRecords.
     * @example
     * // Create many PayIdempotencyRecords
     * const payIdempotencyRecord = await prisma.payIdempotencyRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayIdempotencyRecordCreateManyArgs>(args?: SelectSubset<T, PayIdempotencyRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayIdempotencyRecord.
     * @param {PayIdempotencyRecordDeleteArgs} args - Arguments to delete one PayIdempotencyRecord.
     * @example
     * // Delete one PayIdempotencyRecord
     * const PayIdempotencyRecord = await prisma.payIdempotencyRecord.delete({
     *   where: {
     *     // ... filter to delete one PayIdempotencyRecord
     *   }
     * })
     * 
     */
    delete<T extends PayIdempotencyRecordDeleteArgs>(args: SelectSubset<T, PayIdempotencyRecordDeleteArgs<ExtArgs>>): Prisma__PayIdempotencyRecordClient<$Result.GetResult<Prisma.$PayIdempotencyRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayIdempotencyRecord.
     * @param {PayIdempotencyRecordUpdateArgs} args - Arguments to update one PayIdempotencyRecord.
     * @example
     * // Update one PayIdempotencyRecord
     * const payIdempotencyRecord = await prisma.payIdempotencyRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayIdempotencyRecordUpdateArgs>(args: SelectSubset<T, PayIdempotencyRecordUpdateArgs<ExtArgs>>): Prisma__PayIdempotencyRecordClient<$Result.GetResult<Prisma.$PayIdempotencyRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayIdempotencyRecords.
     * @param {PayIdempotencyRecordDeleteManyArgs} args - Arguments to filter PayIdempotencyRecords to delete.
     * @example
     * // Delete a few PayIdempotencyRecords
     * const { count } = await prisma.payIdempotencyRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayIdempotencyRecordDeleteManyArgs>(args?: SelectSubset<T, PayIdempotencyRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayIdempotencyRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayIdempotencyRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayIdempotencyRecords
     * const payIdempotencyRecord = await prisma.payIdempotencyRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayIdempotencyRecordUpdateManyArgs>(args: SelectSubset<T, PayIdempotencyRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayIdempotencyRecord.
     * @param {PayIdempotencyRecordUpsertArgs} args - Arguments to update or create a PayIdempotencyRecord.
     * @example
     * // Update or create a PayIdempotencyRecord
     * const payIdempotencyRecord = await prisma.payIdempotencyRecord.upsert({
     *   create: {
     *     // ... data to create a PayIdempotencyRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayIdempotencyRecord we want to update
     *   }
     * })
     */
    upsert<T extends PayIdempotencyRecordUpsertArgs>(args: SelectSubset<T, PayIdempotencyRecordUpsertArgs<ExtArgs>>): Prisma__PayIdempotencyRecordClient<$Result.GetResult<Prisma.$PayIdempotencyRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayIdempotencyRecords that matches the filter.
     * @param {PayIdempotencyRecordFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payIdempotencyRecord = await prisma.payIdempotencyRecord.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayIdempotencyRecordFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayIdempotencyRecord.
     * @param {PayIdempotencyRecordAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payIdempotencyRecord = await prisma.payIdempotencyRecord.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayIdempotencyRecordAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayIdempotencyRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayIdempotencyRecordCountArgs} args - Arguments to filter PayIdempotencyRecords to count.
     * @example
     * // Count the number of PayIdempotencyRecords
     * const count = await prisma.payIdempotencyRecord.count({
     *   where: {
     *     // ... the filter for the PayIdempotencyRecords we want to count
     *   }
     * })
    **/
    count<T extends PayIdempotencyRecordCountArgs>(
      args?: Subset<T, PayIdempotencyRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayIdempotencyRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayIdempotencyRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayIdempotencyRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayIdempotencyRecordAggregateArgs>(args: Subset<T, PayIdempotencyRecordAggregateArgs>): Prisma.PrismaPromise<GetPayIdempotencyRecordAggregateType<T>>

    /**
     * Group by PayIdempotencyRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayIdempotencyRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayIdempotencyRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayIdempotencyRecordGroupByArgs['orderBy'] }
        : { orderBy?: PayIdempotencyRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayIdempotencyRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayIdempotencyRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayIdempotencyRecord model
   */
  readonly fields: PayIdempotencyRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayIdempotencyRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayIdempotencyRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayIdempotencyRecord model
   */
  interface PayIdempotencyRecordFieldRefs {
    readonly id: FieldRef<"PayIdempotencyRecord", 'String'>
    readonly scope: FieldRef<"PayIdempotencyRecord", 'String'>
    readonly key: FieldRef<"PayIdempotencyRecord", 'String'>
    readonly requestHash: FieldRef<"PayIdempotencyRecord", 'String'>
    readonly status: FieldRef<"PayIdempotencyRecord", 'String'>
    readonly statusCode: FieldRef<"PayIdempotencyRecord", 'Int'>
    readonly responseJson: FieldRef<"PayIdempotencyRecord", 'String'>
    readonly expiresAt: FieldRef<"PayIdempotencyRecord", 'DateTime'>
    readonly createdAt: FieldRef<"PayIdempotencyRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"PayIdempotencyRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayIdempotencyRecord findUnique
   */
  export type PayIdempotencyRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayIdempotencyRecord
     */
    select?: PayIdempotencyRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayIdempotencyRecord
     */
    omit?: PayIdempotencyRecordOmit<ExtArgs> | null
    /**
     * Filter, which PayIdempotencyRecord to fetch.
     */
    where: PayIdempotencyRecordWhereUniqueInput
  }

  /**
   * PayIdempotencyRecord findUniqueOrThrow
   */
  export type PayIdempotencyRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayIdempotencyRecord
     */
    select?: PayIdempotencyRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayIdempotencyRecord
     */
    omit?: PayIdempotencyRecordOmit<ExtArgs> | null
    /**
     * Filter, which PayIdempotencyRecord to fetch.
     */
    where: PayIdempotencyRecordWhereUniqueInput
  }

  /**
   * PayIdempotencyRecord findFirst
   */
  export type PayIdempotencyRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayIdempotencyRecord
     */
    select?: PayIdempotencyRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayIdempotencyRecord
     */
    omit?: PayIdempotencyRecordOmit<ExtArgs> | null
    /**
     * Filter, which PayIdempotencyRecord to fetch.
     */
    where?: PayIdempotencyRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayIdempotencyRecords to fetch.
     */
    orderBy?: PayIdempotencyRecordOrderByWithRelationInput | PayIdempotencyRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayIdempotencyRecords.
     */
    cursor?: PayIdempotencyRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayIdempotencyRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayIdempotencyRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayIdempotencyRecords.
     */
    distinct?: PayIdempotencyRecordScalarFieldEnum | PayIdempotencyRecordScalarFieldEnum[]
  }

  /**
   * PayIdempotencyRecord findFirstOrThrow
   */
  export type PayIdempotencyRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayIdempotencyRecord
     */
    select?: PayIdempotencyRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayIdempotencyRecord
     */
    omit?: PayIdempotencyRecordOmit<ExtArgs> | null
    /**
     * Filter, which PayIdempotencyRecord to fetch.
     */
    where?: PayIdempotencyRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayIdempotencyRecords to fetch.
     */
    orderBy?: PayIdempotencyRecordOrderByWithRelationInput | PayIdempotencyRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayIdempotencyRecords.
     */
    cursor?: PayIdempotencyRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayIdempotencyRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayIdempotencyRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayIdempotencyRecords.
     */
    distinct?: PayIdempotencyRecordScalarFieldEnum | PayIdempotencyRecordScalarFieldEnum[]
  }

  /**
   * PayIdempotencyRecord findMany
   */
  export type PayIdempotencyRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayIdempotencyRecord
     */
    select?: PayIdempotencyRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayIdempotencyRecord
     */
    omit?: PayIdempotencyRecordOmit<ExtArgs> | null
    /**
     * Filter, which PayIdempotencyRecords to fetch.
     */
    where?: PayIdempotencyRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayIdempotencyRecords to fetch.
     */
    orderBy?: PayIdempotencyRecordOrderByWithRelationInput | PayIdempotencyRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayIdempotencyRecords.
     */
    cursor?: PayIdempotencyRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayIdempotencyRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayIdempotencyRecords.
     */
    skip?: number
    distinct?: PayIdempotencyRecordScalarFieldEnum | PayIdempotencyRecordScalarFieldEnum[]
  }

  /**
   * PayIdempotencyRecord create
   */
  export type PayIdempotencyRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayIdempotencyRecord
     */
    select?: PayIdempotencyRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayIdempotencyRecord
     */
    omit?: PayIdempotencyRecordOmit<ExtArgs> | null
    /**
     * The data needed to create a PayIdempotencyRecord.
     */
    data: XOR<PayIdempotencyRecordCreateInput, PayIdempotencyRecordUncheckedCreateInput>
  }

  /**
   * PayIdempotencyRecord createMany
   */
  export type PayIdempotencyRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayIdempotencyRecords.
     */
    data: PayIdempotencyRecordCreateManyInput | PayIdempotencyRecordCreateManyInput[]
  }

  /**
   * PayIdempotencyRecord update
   */
  export type PayIdempotencyRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayIdempotencyRecord
     */
    select?: PayIdempotencyRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayIdempotencyRecord
     */
    omit?: PayIdempotencyRecordOmit<ExtArgs> | null
    /**
     * The data needed to update a PayIdempotencyRecord.
     */
    data: XOR<PayIdempotencyRecordUpdateInput, PayIdempotencyRecordUncheckedUpdateInput>
    /**
     * Choose, which PayIdempotencyRecord to update.
     */
    where: PayIdempotencyRecordWhereUniqueInput
  }

  /**
   * PayIdempotencyRecord updateMany
   */
  export type PayIdempotencyRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayIdempotencyRecords.
     */
    data: XOR<PayIdempotencyRecordUpdateManyMutationInput, PayIdempotencyRecordUncheckedUpdateManyInput>
    /**
     * Filter which PayIdempotencyRecords to update
     */
    where?: PayIdempotencyRecordWhereInput
    /**
     * Limit how many PayIdempotencyRecords to update.
     */
    limit?: number
  }

  /**
   * PayIdempotencyRecord upsert
   */
  export type PayIdempotencyRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayIdempotencyRecord
     */
    select?: PayIdempotencyRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayIdempotencyRecord
     */
    omit?: PayIdempotencyRecordOmit<ExtArgs> | null
    /**
     * The filter to search for the PayIdempotencyRecord to update in case it exists.
     */
    where: PayIdempotencyRecordWhereUniqueInput
    /**
     * In case the PayIdempotencyRecord found by the `where` argument doesn't exist, create a new PayIdempotencyRecord with this data.
     */
    create: XOR<PayIdempotencyRecordCreateInput, PayIdempotencyRecordUncheckedCreateInput>
    /**
     * In case the PayIdempotencyRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayIdempotencyRecordUpdateInput, PayIdempotencyRecordUncheckedUpdateInput>
  }

  /**
   * PayIdempotencyRecord delete
   */
  export type PayIdempotencyRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayIdempotencyRecord
     */
    select?: PayIdempotencyRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayIdempotencyRecord
     */
    omit?: PayIdempotencyRecordOmit<ExtArgs> | null
    /**
     * Filter which PayIdempotencyRecord to delete.
     */
    where: PayIdempotencyRecordWhereUniqueInput
  }

  /**
   * PayIdempotencyRecord deleteMany
   */
  export type PayIdempotencyRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayIdempotencyRecords to delete
     */
    where?: PayIdempotencyRecordWhereInput
    /**
     * Limit how many PayIdempotencyRecords to delete.
     */
    limit?: number
  }

  /**
   * PayIdempotencyRecord findRaw
   */
  export type PayIdempotencyRecordFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayIdempotencyRecord aggregateRaw
   */
  export type PayIdempotencyRecordAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayIdempotencyRecord without action
   */
  export type PayIdempotencyRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayIdempotencyRecord
     */
    select?: PayIdempotencyRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayIdempotencyRecord
     */
    omit?: PayIdempotencyRecordOmit<ExtArgs> | null
  }


  /**
   * Model PayOutboxEvent
   */

  export type AggregatePayOutboxEvent = {
    _count: PayOutboxEventCountAggregateOutputType | null
    _avg: PayOutboxEventAvgAggregateOutputType | null
    _sum: PayOutboxEventSumAggregateOutputType | null
    _min: PayOutboxEventMinAggregateOutputType | null
    _max: PayOutboxEventMaxAggregateOutputType | null
  }

  export type PayOutboxEventAvgAggregateOutputType = {
    attempts: number | null
    maxAttempts: number | null
  }

  export type PayOutboxEventSumAggregateOutputType = {
    attempts: number | null
    maxAttempts: number | null
  }

  export type PayOutboxEventMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    eventType: string | null
    aggregateType: string | null
    aggregateId: string | null
    payloadJson: string | null
    status: string | null
    attempts: number | null
    maxAttempts: number | null
    nextAttemptAt: Date | null
    lockedBy: string | null
    lockedUntil: Date | null
    lastError: string | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayOutboxEventMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    eventType: string | null
    aggregateType: string | null
    aggregateId: string | null
    payloadJson: string | null
    status: string | null
    attempts: number | null
    maxAttempts: number | null
    nextAttemptAt: Date | null
    lockedBy: string | null
    lockedUntil: Date | null
    lastError: string | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayOutboxEventCountAggregateOutputType = {
    id: number
    eventId: number
    eventType: number
    aggregateType: number
    aggregateId: number
    payloadJson: number
    status: number
    attempts: number
    maxAttempts: number
    nextAttemptAt: number
    lockedBy: number
    lockedUntil: number
    lastError: number
    publishedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PayOutboxEventAvgAggregateInputType = {
    attempts?: true
    maxAttempts?: true
  }

  export type PayOutboxEventSumAggregateInputType = {
    attempts?: true
    maxAttempts?: true
  }

  export type PayOutboxEventMinAggregateInputType = {
    id?: true
    eventId?: true
    eventType?: true
    aggregateType?: true
    aggregateId?: true
    payloadJson?: true
    status?: true
    attempts?: true
    maxAttempts?: true
    nextAttemptAt?: true
    lockedBy?: true
    lockedUntil?: true
    lastError?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayOutboxEventMaxAggregateInputType = {
    id?: true
    eventId?: true
    eventType?: true
    aggregateType?: true
    aggregateId?: true
    payloadJson?: true
    status?: true
    attempts?: true
    maxAttempts?: true
    nextAttemptAt?: true
    lockedBy?: true
    lockedUntil?: true
    lastError?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayOutboxEventCountAggregateInputType = {
    id?: true
    eventId?: true
    eventType?: true
    aggregateType?: true
    aggregateId?: true
    payloadJson?: true
    status?: true
    attempts?: true
    maxAttempts?: true
    nextAttemptAt?: true
    lockedBy?: true
    lockedUntil?: true
    lastError?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PayOutboxEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayOutboxEvent to aggregate.
     */
    where?: PayOutboxEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayOutboxEvents to fetch.
     */
    orderBy?: PayOutboxEventOrderByWithRelationInput | PayOutboxEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayOutboxEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayOutboxEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayOutboxEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayOutboxEvents
    **/
    _count?: true | PayOutboxEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayOutboxEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayOutboxEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayOutboxEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayOutboxEventMaxAggregateInputType
  }

  export type GetPayOutboxEventAggregateType<T extends PayOutboxEventAggregateArgs> = {
        [P in keyof T & keyof AggregatePayOutboxEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayOutboxEvent[P]>
      : GetScalarType<T[P], AggregatePayOutboxEvent[P]>
  }




  export type PayOutboxEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayOutboxEventWhereInput
    orderBy?: PayOutboxEventOrderByWithAggregationInput | PayOutboxEventOrderByWithAggregationInput[]
    by: PayOutboxEventScalarFieldEnum[] | PayOutboxEventScalarFieldEnum
    having?: PayOutboxEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayOutboxEventCountAggregateInputType | true
    _avg?: PayOutboxEventAvgAggregateInputType
    _sum?: PayOutboxEventSumAggregateInputType
    _min?: PayOutboxEventMinAggregateInputType
    _max?: PayOutboxEventMaxAggregateInputType
  }

  export type PayOutboxEventGroupByOutputType = {
    id: string
    eventId: string
    eventType: string
    aggregateType: string
    aggregateId: string
    payloadJson: string
    status: string
    attempts: number
    maxAttempts: number
    nextAttemptAt: Date
    lockedBy: string | null
    lockedUntil: Date | null
    lastError: string | null
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: PayOutboxEventCountAggregateOutputType | null
    _avg: PayOutboxEventAvgAggregateOutputType | null
    _sum: PayOutboxEventSumAggregateOutputType | null
    _min: PayOutboxEventMinAggregateOutputType | null
    _max: PayOutboxEventMaxAggregateOutputType | null
  }

  type GetPayOutboxEventGroupByPayload<T extends PayOutboxEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayOutboxEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayOutboxEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayOutboxEventGroupByOutputType[P]>
            : GetScalarType<T[P], PayOutboxEventGroupByOutputType[P]>
        }
      >
    >


  export type PayOutboxEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    eventType?: boolean
    aggregateType?: boolean
    aggregateId?: boolean
    payloadJson?: boolean
    status?: boolean
    attempts?: boolean
    maxAttempts?: boolean
    nextAttemptAt?: boolean
    lockedBy?: boolean
    lockedUntil?: boolean
    lastError?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["payOutboxEvent"]>



  export type PayOutboxEventSelectScalar = {
    id?: boolean
    eventId?: boolean
    eventType?: boolean
    aggregateType?: boolean
    aggregateId?: boolean
    payloadJson?: boolean
    status?: boolean
    attempts?: boolean
    maxAttempts?: boolean
    nextAttemptAt?: boolean
    lockedBy?: boolean
    lockedUntil?: boolean
    lastError?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PayOutboxEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eventId" | "eventType" | "aggregateType" | "aggregateId" | "payloadJson" | "status" | "attempts" | "maxAttempts" | "nextAttemptAt" | "lockedBy" | "lockedUntil" | "lastError" | "publishedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["payOutboxEvent"]>

  export type $PayOutboxEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayOutboxEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      eventType: string
      aggregateType: string
      aggregateId: string
      payloadJson: string
      status: string
      attempts: number
      maxAttempts: number
      nextAttemptAt: Date
      lockedBy: string | null
      lockedUntil: Date | null
      lastError: string | null
      publishedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["payOutboxEvent"]>
    composites: {}
  }

  type PayOutboxEventGetPayload<S extends boolean | null | undefined | PayOutboxEventDefaultArgs> = $Result.GetResult<Prisma.$PayOutboxEventPayload, S>

  type PayOutboxEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayOutboxEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayOutboxEventCountAggregateInputType | true
    }

  export interface PayOutboxEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayOutboxEvent'], meta: { name: 'PayOutboxEvent' } }
    /**
     * Find zero or one PayOutboxEvent that matches the filter.
     * @param {PayOutboxEventFindUniqueArgs} args - Arguments to find a PayOutboxEvent
     * @example
     * // Get one PayOutboxEvent
     * const payOutboxEvent = await prisma.payOutboxEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayOutboxEventFindUniqueArgs>(args: SelectSubset<T, PayOutboxEventFindUniqueArgs<ExtArgs>>): Prisma__PayOutboxEventClient<$Result.GetResult<Prisma.$PayOutboxEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayOutboxEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayOutboxEventFindUniqueOrThrowArgs} args - Arguments to find a PayOutboxEvent
     * @example
     * // Get one PayOutboxEvent
     * const payOutboxEvent = await prisma.payOutboxEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayOutboxEventFindUniqueOrThrowArgs>(args: SelectSubset<T, PayOutboxEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayOutboxEventClient<$Result.GetResult<Prisma.$PayOutboxEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayOutboxEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayOutboxEventFindFirstArgs} args - Arguments to find a PayOutboxEvent
     * @example
     * // Get one PayOutboxEvent
     * const payOutboxEvent = await prisma.payOutboxEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayOutboxEventFindFirstArgs>(args?: SelectSubset<T, PayOutboxEventFindFirstArgs<ExtArgs>>): Prisma__PayOutboxEventClient<$Result.GetResult<Prisma.$PayOutboxEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayOutboxEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayOutboxEventFindFirstOrThrowArgs} args - Arguments to find a PayOutboxEvent
     * @example
     * // Get one PayOutboxEvent
     * const payOutboxEvent = await prisma.payOutboxEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayOutboxEventFindFirstOrThrowArgs>(args?: SelectSubset<T, PayOutboxEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayOutboxEventClient<$Result.GetResult<Prisma.$PayOutboxEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayOutboxEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayOutboxEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayOutboxEvents
     * const payOutboxEvents = await prisma.payOutboxEvent.findMany()
     * 
     * // Get first 10 PayOutboxEvents
     * const payOutboxEvents = await prisma.payOutboxEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payOutboxEventWithIdOnly = await prisma.payOutboxEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayOutboxEventFindManyArgs>(args?: SelectSubset<T, PayOutboxEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayOutboxEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayOutboxEvent.
     * @param {PayOutboxEventCreateArgs} args - Arguments to create a PayOutboxEvent.
     * @example
     * // Create one PayOutboxEvent
     * const PayOutboxEvent = await prisma.payOutboxEvent.create({
     *   data: {
     *     // ... data to create a PayOutboxEvent
     *   }
     * })
     * 
     */
    create<T extends PayOutboxEventCreateArgs>(args: SelectSubset<T, PayOutboxEventCreateArgs<ExtArgs>>): Prisma__PayOutboxEventClient<$Result.GetResult<Prisma.$PayOutboxEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayOutboxEvents.
     * @param {PayOutboxEventCreateManyArgs} args - Arguments to create many PayOutboxEvents.
     * @example
     * // Create many PayOutboxEvents
     * const payOutboxEvent = await prisma.payOutboxEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayOutboxEventCreateManyArgs>(args?: SelectSubset<T, PayOutboxEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayOutboxEvent.
     * @param {PayOutboxEventDeleteArgs} args - Arguments to delete one PayOutboxEvent.
     * @example
     * // Delete one PayOutboxEvent
     * const PayOutboxEvent = await prisma.payOutboxEvent.delete({
     *   where: {
     *     // ... filter to delete one PayOutboxEvent
     *   }
     * })
     * 
     */
    delete<T extends PayOutboxEventDeleteArgs>(args: SelectSubset<T, PayOutboxEventDeleteArgs<ExtArgs>>): Prisma__PayOutboxEventClient<$Result.GetResult<Prisma.$PayOutboxEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayOutboxEvent.
     * @param {PayOutboxEventUpdateArgs} args - Arguments to update one PayOutboxEvent.
     * @example
     * // Update one PayOutboxEvent
     * const payOutboxEvent = await prisma.payOutboxEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayOutboxEventUpdateArgs>(args: SelectSubset<T, PayOutboxEventUpdateArgs<ExtArgs>>): Prisma__PayOutboxEventClient<$Result.GetResult<Prisma.$PayOutboxEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayOutboxEvents.
     * @param {PayOutboxEventDeleteManyArgs} args - Arguments to filter PayOutboxEvents to delete.
     * @example
     * // Delete a few PayOutboxEvents
     * const { count } = await prisma.payOutboxEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayOutboxEventDeleteManyArgs>(args?: SelectSubset<T, PayOutboxEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayOutboxEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayOutboxEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayOutboxEvents
     * const payOutboxEvent = await prisma.payOutboxEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayOutboxEventUpdateManyArgs>(args: SelectSubset<T, PayOutboxEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayOutboxEvent.
     * @param {PayOutboxEventUpsertArgs} args - Arguments to update or create a PayOutboxEvent.
     * @example
     * // Update or create a PayOutboxEvent
     * const payOutboxEvent = await prisma.payOutboxEvent.upsert({
     *   create: {
     *     // ... data to create a PayOutboxEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayOutboxEvent we want to update
     *   }
     * })
     */
    upsert<T extends PayOutboxEventUpsertArgs>(args: SelectSubset<T, PayOutboxEventUpsertArgs<ExtArgs>>): Prisma__PayOutboxEventClient<$Result.GetResult<Prisma.$PayOutboxEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayOutboxEvents that matches the filter.
     * @param {PayOutboxEventFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payOutboxEvent = await prisma.payOutboxEvent.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayOutboxEventFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayOutboxEvent.
     * @param {PayOutboxEventAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payOutboxEvent = await prisma.payOutboxEvent.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayOutboxEventAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayOutboxEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayOutboxEventCountArgs} args - Arguments to filter PayOutboxEvents to count.
     * @example
     * // Count the number of PayOutboxEvents
     * const count = await prisma.payOutboxEvent.count({
     *   where: {
     *     // ... the filter for the PayOutboxEvents we want to count
     *   }
     * })
    **/
    count<T extends PayOutboxEventCountArgs>(
      args?: Subset<T, PayOutboxEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayOutboxEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayOutboxEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayOutboxEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayOutboxEventAggregateArgs>(args: Subset<T, PayOutboxEventAggregateArgs>): Prisma.PrismaPromise<GetPayOutboxEventAggregateType<T>>

    /**
     * Group by PayOutboxEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayOutboxEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayOutboxEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayOutboxEventGroupByArgs['orderBy'] }
        : { orderBy?: PayOutboxEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayOutboxEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayOutboxEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayOutboxEvent model
   */
  readonly fields: PayOutboxEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayOutboxEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayOutboxEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayOutboxEvent model
   */
  interface PayOutboxEventFieldRefs {
    readonly id: FieldRef<"PayOutboxEvent", 'String'>
    readonly eventId: FieldRef<"PayOutboxEvent", 'String'>
    readonly eventType: FieldRef<"PayOutboxEvent", 'String'>
    readonly aggregateType: FieldRef<"PayOutboxEvent", 'String'>
    readonly aggregateId: FieldRef<"PayOutboxEvent", 'String'>
    readonly payloadJson: FieldRef<"PayOutboxEvent", 'String'>
    readonly status: FieldRef<"PayOutboxEvent", 'String'>
    readonly attempts: FieldRef<"PayOutboxEvent", 'Int'>
    readonly maxAttempts: FieldRef<"PayOutboxEvent", 'Int'>
    readonly nextAttemptAt: FieldRef<"PayOutboxEvent", 'DateTime'>
    readonly lockedBy: FieldRef<"PayOutboxEvent", 'String'>
    readonly lockedUntil: FieldRef<"PayOutboxEvent", 'DateTime'>
    readonly lastError: FieldRef<"PayOutboxEvent", 'String'>
    readonly publishedAt: FieldRef<"PayOutboxEvent", 'DateTime'>
    readonly createdAt: FieldRef<"PayOutboxEvent", 'DateTime'>
    readonly updatedAt: FieldRef<"PayOutboxEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayOutboxEvent findUnique
   */
  export type PayOutboxEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayOutboxEvent
     */
    select?: PayOutboxEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayOutboxEvent
     */
    omit?: PayOutboxEventOmit<ExtArgs> | null
    /**
     * Filter, which PayOutboxEvent to fetch.
     */
    where: PayOutboxEventWhereUniqueInput
  }

  /**
   * PayOutboxEvent findUniqueOrThrow
   */
  export type PayOutboxEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayOutboxEvent
     */
    select?: PayOutboxEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayOutboxEvent
     */
    omit?: PayOutboxEventOmit<ExtArgs> | null
    /**
     * Filter, which PayOutboxEvent to fetch.
     */
    where: PayOutboxEventWhereUniqueInput
  }

  /**
   * PayOutboxEvent findFirst
   */
  export type PayOutboxEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayOutboxEvent
     */
    select?: PayOutboxEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayOutboxEvent
     */
    omit?: PayOutboxEventOmit<ExtArgs> | null
    /**
     * Filter, which PayOutboxEvent to fetch.
     */
    where?: PayOutboxEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayOutboxEvents to fetch.
     */
    orderBy?: PayOutboxEventOrderByWithRelationInput | PayOutboxEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayOutboxEvents.
     */
    cursor?: PayOutboxEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayOutboxEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayOutboxEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayOutboxEvents.
     */
    distinct?: PayOutboxEventScalarFieldEnum | PayOutboxEventScalarFieldEnum[]
  }

  /**
   * PayOutboxEvent findFirstOrThrow
   */
  export type PayOutboxEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayOutboxEvent
     */
    select?: PayOutboxEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayOutboxEvent
     */
    omit?: PayOutboxEventOmit<ExtArgs> | null
    /**
     * Filter, which PayOutboxEvent to fetch.
     */
    where?: PayOutboxEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayOutboxEvents to fetch.
     */
    orderBy?: PayOutboxEventOrderByWithRelationInput | PayOutboxEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayOutboxEvents.
     */
    cursor?: PayOutboxEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayOutboxEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayOutboxEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayOutboxEvents.
     */
    distinct?: PayOutboxEventScalarFieldEnum | PayOutboxEventScalarFieldEnum[]
  }

  /**
   * PayOutboxEvent findMany
   */
  export type PayOutboxEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayOutboxEvent
     */
    select?: PayOutboxEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayOutboxEvent
     */
    omit?: PayOutboxEventOmit<ExtArgs> | null
    /**
     * Filter, which PayOutboxEvents to fetch.
     */
    where?: PayOutboxEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayOutboxEvents to fetch.
     */
    orderBy?: PayOutboxEventOrderByWithRelationInput | PayOutboxEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayOutboxEvents.
     */
    cursor?: PayOutboxEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayOutboxEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayOutboxEvents.
     */
    skip?: number
    distinct?: PayOutboxEventScalarFieldEnum | PayOutboxEventScalarFieldEnum[]
  }

  /**
   * PayOutboxEvent create
   */
  export type PayOutboxEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayOutboxEvent
     */
    select?: PayOutboxEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayOutboxEvent
     */
    omit?: PayOutboxEventOmit<ExtArgs> | null
    /**
     * The data needed to create a PayOutboxEvent.
     */
    data: XOR<PayOutboxEventCreateInput, PayOutboxEventUncheckedCreateInput>
  }

  /**
   * PayOutboxEvent createMany
   */
  export type PayOutboxEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayOutboxEvents.
     */
    data: PayOutboxEventCreateManyInput | PayOutboxEventCreateManyInput[]
  }

  /**
   * PayOutboxEvent update
   */
  export type PayOutboxEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayOutboxEvent
     */
    select?: PayOutboxEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayOutboxEvent
     */
    omit?: PayOutboxEventOmit<ExtArgs> | null
    /**
     * The data needed to update a PayOutboxEvent.
     */
    data: XOR<PayOutboxEventUpdateInput, PayOutboxEventUncheckedUpdateInput>
    /**
     * Choose, which PayOutboxEvent to update.
     */
    where: PayOutboxEventWhereUniqueInput
  }

  /**
   * PayOutboxEvent updateMany
   */
  export type PayOutboxEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayOutboxEvents.
     */
    data: XOR<PayOutboxEventUpdateManyMutationInput, PayOutboxEventUncheckedUpdateManyInput>
    /**
     * Filter which PayOutboxEvents to update
     */
    where?: PayOutboxEventWhereInput
    /**
     * Limit how many PayOutboxEvents to update.
     */
    limit?: number
  }

  /**
   * PayOutboxEvent upsert
   */
  export type PayOutboxEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayOutboxEvent
     */
    select?: PayOutboxEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayOutboxEvent
     */
    omit?: PayOutboxEventOmit<ExtArgs> | null
    /**
     * The filter to search for the PayOutboxEvent to update in case it exists.
     */
    where: PayOutboxEventWhereUniqueInput
    /**
     * In case the PayOutboxEvent found by the `where` argument doesn't exist, create a new PayOutboxEvent with this data.
     */
    create: XOR<PayOutboxEventCreateInput, PayOutboxEventUncheckedCreateInput>
    /**
     * In case the PayOutboxEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayOutboxEventUpdateInput, PayOutboxEventUncheckedUpdateInput>
  }

  /**
   * PayOutboxEvent delete
   */
  export type PayOutboxEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayOutboxEvent
     */
    select?: PayOutboxEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayOutboxEvent
     */
    omit?: PayOutboxEventOmit<ExtArgs> | null
    /**
     * Filter which PayOutboxEvent to delete.
     */
    where: PayOutboxEventWhereUniqueInput
  }

  /**
   * PayOutboxEvent deleteMany
   */
  export type PayOutboxEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayOutboxEvents to delete
     */
    where?: PayOutboxEventWhereInput
    /**
     * Limit how many PayOutboxEvents to delete.
     */
    limit?: number
  }

  /**
   * PayOutboxEvent findRaw
   */
  export type PayOutboxEventFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayOutboxEvent aggregateRaw
   */
  export type PayOutboxEventAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayOutboxEvent without action
   */
  export type PayOutboxEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayOutboxEvent
     */
    select?: PayOutboxEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayOutboxEvent
     */
    omit?: PayOutboxEventOmit<ExtArgs> | null
  }


  /**
   * Model PayConsumedEvent
   */

  export type AggregatePayConsumedEvent = {
    _count: PayConsumedEventCountAggregateOutputType | null
    _min: PayConsumedEventMinAggregateOutputType | null
    _max: PayConsumedEventMaxAggregateOutputType | null
  }

  export type PayConsumedEventMinAggregateOutputType = {
    id: string | null
    consumerName: string | null
    eventId: string | null
    processedAt: Date | null
  }

  export type PayConsumedEventMaxAggregateOutputType = {
    id: string | null
    consumerName: string | null
    eventId: string | null
    processedAt: Date | null
  }

  export type PayConsumedEventCountAggregateOutputType = {
    id: number
    consumerName: number
    eventId: number
    processedAt: number
    _all: number
  }


  export type PayConsumedEventMinAggregateInputType = {
    id?: true
    consumerName?: true
    eventId?: true
    processedAt?: true
  }

  export type PayConsumedEventMaxAggregateInputType = {
    id?: true
    consumerName?: true
    eventId?: true
    processedAt?: true
  }

  export type PayConsumedEventCountAggregateInputType = {
    id?: true
    consumerName?: true
    eventId?: true
    processedAt?: true
    _all?: true
  }

  export type PayConsumedEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayConsumedEvent to aggregate.
     */
    where?: PayConsumedEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayConsumedEvents to fetch.
     */
    orderBy?: PayConsumedEventOrderByWithRelationInput | PayConsumedEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayConsumedEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayConsumedEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayConsumedEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayConsumedEvents
    **/
    _count?: true | PayConsumedEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayConsumedEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayConsumedEventMaxAggregateInputType
  }

  export type GetPayConsumedEventAggregateType<T extends PayConsumedEventAggregateArgs> = {
        [P in keyof T & keyof AggregatePayConsumedEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayConsumedEvent[P]>
      : GetScalarType<T[P], AggregatePayConsumedEvent[P]>
  }




  export type PayConsumedEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayConsumedEventWhereInput
    orderBy?: PayConsumedEventOrderByWithAggregationInput | PayConsumedEventOrderByWithAggregationInput[]
    by: PayConsumedEventScalarFieldEnum[] | PayConsumedEventScalarFieldEnum
    having?: PayConsumedEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayConsumedEventCountAggregateInputType | true
    _min?: PayConsumedEventMinAggregateInputType
    _max?: PayConsumedEventMaxAggregateInputType
  }

  export type PayConsumedEventGroupByOutputType = {
    id: string
    consumerName: string
    eventId: string
    processedAt: Date
    _count: PayConsumedEventCountAggregateOutputType | null
    _min: PayConsumedEventMinAggregateOutputType | null
    _max: PayConsumedEventMaxAggregateOutputType | null
  }

  type GetPayConsumedEventGroupByPayload<T extends PayConsumedEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayConsumedEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayConsumedEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayConsumedEventGroupByOutputType[P]>
            : GetScalarType<T[P], PayConsumedEventGroupByOutputType[P]>
        }
      >
    >


  export type PayConsumedEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    consumerName?: boolean
    eventId?: boolean
    processedAt?: boolean
  }, ExtArgs["result"]["payConsumedEvent"]>



  export type PayConsumedEventSelectScalar = {
    id?: boolean
    consumerName?: boolean
    eventId?: boolean
    processedAt?: boolean
  }

  export type PayConsumedEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "consumerName" | "eventId" | "processedAt", ExtArgs["result"]["payConsumedEvent"]>

  export type $PayConsumedEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayConsumedEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      consumerName: string
      eventId: string
      processedAt: Date
    }, ExtArgs["result"]["payConsumedEvent"]>
    composites: {}
  }

  type PayConsumedEventGetPayload<S extends boolean | null | undefined | PayConsumedEventDefaultArgs> = $Result.GetResult<Prisma.$PayConsumedEventPayload, S>

  type PayConsumedEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayConsumedEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayConsumedEventCountAggregateInputType | true
    }

  export interface PayConsumedEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayConsumedEvent'], meta: { name: 'PayConsumedEvent' } }
    /**
     * Find zero or one PayConsumedEvent that matches the filter.
     * @param {PayConsumedEventFindUniqueArgs} args - Arguments to find a PayConsumedEvent
     * @example
     * // Get one PayConsumedEvent
     * const payConsumedEvent = await prisma.payConsumedEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayConsumedEventFindUniqueArgs>(args: SelectSubset<T, PayConsumedEventFindUniqueArgs<ExtArgs>>): Prisma__PayConsumedEventClient<$Result.GetResult<Prisma.$PayConsumedEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayConsumedEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayConsumedEventFindUniqueOrThrowArgs} args - Arguments to find a PayConsumedEvent
     * @example
     * // Get one PayConsumedEvent
     * const payConsumedEvent = await prisma.payConsumedEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayConsumedEventFindUniqueOrThrowArgs>(args: SelectSubset<T, PayConsumedEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayConsumedEventClient<$Result.GetResult<Prisma.$PayConsumedEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayConsumedEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConsumedEventFindFirstArgs} args - Arguments to find a PayConsumedEvent
     * @example
     * // Get one PayConsumedEvent
     * const payConsumedEvent = await prisma.payConsumedEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayConsumedEventFindFirstArgs>(args?: SelectSubset<T, PayConsumedEventFindFirstArgs<ExtArgs>>): Prisma__PayConsumedEventClient<$Result.GetResult<Prisma.$PayConsumedEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayConsumedEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConsumedEventFindFirstOrThrowArgs} args - Arguments to find a PayConsumedEvent
     * @example
     * // Get one PayConsumedEvent
     * const payConsumedEvent = await prisma.payConsumedEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayConsumedEventFindFirstOrThrowArgs>(args?: SelectSubset<T, PayConsumedEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayConsumedEventClient<$Result.GetResult<Prisma.$PayConsumedEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayConsumedEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConsumedEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayConsumedEvents
     * const payConsumedEvents = await prisma.payConsumedEvent.findMany()
     * 
     * // Get first 10 PayConsumedEvents
     * const payConsumedEvents = await prisma.payConsumedEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payConsumedEventWithIdOnly = await prisma.payConsumedEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayConsumedEventFindManyArgs>(args?: SelectSubset<T, PayConsumedEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayConsumedEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayConsumedEvent.
     * @param {PayConsumedEventCreateArgs} args - Arguments to create a PayConsumedEvent.
     * @example
     * // Create one PayConsumedEvent
     * const PayConsumedEvent = await prisma.payConsumedEvent.create({
     *   data: {
     *     // ... data to create a PayConsumedEvent
     *   }
     * })
     * 
     */
    create<T extends PayConsumedEventCreateArgs>(args: SelectSubset<T, PayConsumedEventCreateArgs<ExtArgs>>): Prisma__PayConsumedEventClient<$Result.GetResult<Prisma.$PayConsumedEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayConsumedEvents.
     * @param {PayConsumedEventCreateManyArgs} args - Arguments to create many PayConsumedEvents.
     * @example
     * // Create many PayConsumedEvents
     * const payConsumedEvent = await prisma.payConsumedEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayConsumedEventCreateManyArgs>(args?: SelectSubset<T, PayConsumedEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayConsumedEvent.
     * @param {PayConsumedEventDeleteArgs} args - Arguments to delete one PayConsumedEvent.
     * @example
     * // Delete one PayConsumedEvent
     * const PayConsumedEvent = await prisma.payConsumedEvent.delete({
     *   where: {
     *     // ... filter to delete one PayConsumedEvent
     *   }
     * })
     * 
     */
    delete<T extends PayConsumedEventDeleteArgs>(args: SelectSubset<T, PayConsumedEventDeleteArgs<ExtArgs>>): Prisma__PayConsumedEventClient<$Result.GetResult<Prisma.$PayConsumedEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayConsumedEvent.
     * @param {PayConsumedEventUpdateArgs} args - Arguments to update one PayConsumedEvent.
     * @example
     * // Update one PayConsumedEvent
     * const payConsumedEvent = await prisma.payConsumedEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayConsumedEventUpdateArgs>(args: SelectSubset<T, PayConsumedEventUpdateArgs<ExtArgs>>): Prisma__PayConsumedEventClient<$Result.GetResult<Prisma.$PayConsumedEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayConsumedEvents.
     * @param {PayConsumedEventDeleteManyArgs} args - Arguments to filter PayConsumedEvents to delete.
     * @example
     * // Delete a few PayConsumedEvents
     * const { count } = await prisma.payConsumedEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayConsumedEventDeleteManyArgs>(args?: SelectSubset<T, PayConsumedEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayConsumedEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConsumedEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayConsumedEvents
     * const payConsumedEvent = await prisma.payConsumedEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayConsumedEventUpdateManyArgs>(args: SelectSubset<T, PayConsumedEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayConsumedEvent.
     * @param {PayConsumedEventUpsertArgs} args - Arguments to update or create a PayConsumedEvent.
     * @example
     * // Update or create a PayConsumedEvent
     * const payConsumedEvent = await prisma.payConsumedEvent.upsert({
     *   create: {
     *     // ... data to create a PayConsumedEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayConsumedEvent we want to update
     *   }
     * })
     */
    upsert<T extends PayConsumedEventUpsertArgs>(args: SelectSubset<T, PayConsumedEventUpsertArgs<ExtArgs>>): Prisma__PayConsumedEventClient<$Result.GetResult<Prisma.$PayConsumedEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayConsumedEvents that matches the filter.
     * @param {PayConsumedEventFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payConsumedEvent = await prisma.payConsumedEvent.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayConsumedEventFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayConsumedEvent.
     * @param {PayConsumedEventAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payConsumedEvent = await prisma.payConsumedEvent.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayConsumedEventAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayConsumedEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConsumedEventCountArgs} args - Arguments to filter PayConsumedEvents to count.
     * @example
     * // Count the number of PayConsumedEvents
     * const count = await prisma.payConsumedEvent.count({
     *   where: {
     *     // ... the filter for the PayConsumedEvents we want to count
     *   }
     * })
    **/
    count<T extends PayConsumedEventCountArgs>(
      args?: Subset<T, PayConsumedEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayConsumedEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayConsumedEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConsumedEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayConsumedEventAggregateArgs>(args: Subset<T, PayConsumedEventAggregateArgs>): Prisma.PrismaPromise<GetPayConsumedEventAggregateType<T>>

    /**
     * Group by PayConsumedEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayConsumedEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayConsumedEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayConsumedEventGroupByArgs['orderBy'] }
        : { orderBy?: PayConsumedEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayConsumedEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayConsumedEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayConsumedEvent model
   */
  readonly fields: PayConsumedEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayConsumedEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayConsumedEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayConsumedEvent model
   */
  interface PayConsumedEventFieldRefs {
    readonly id: FieldRef<"PayConsumedEvent", 'String'>
    readonly consumerName: FieldRef<"PayConsumedEvent", 'String'>
    readonly eventId: FieldRef<"PayConsumedEvent", 'String'>
    readonly processedAt: FieldRef<"PayConsumedEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayConsumedEvent findUnique
   */
  export type PayConsumedEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConsumedEvent
     */
    select?: PayConsumedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConsumedEvent
     */
    omit?: PayConsumedEventOmit<ExtArgs> | null
    /**
     * Filter, which PayConsumedEvent to fetch.
     */
    where: PayConsumedEventWhereUniqueInput
  }

  /**
   * PayConsumedEvent findUniqueOrThrow
   */
  export type PayConsumedEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConsumedEvent
     */
    select?: PayConsumedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConsumedEvent
     */
    omit?: PayConsumedEventOmit<ExtArgs> | null
    /**
     * Filter, which PayConsumedEvent to fetch.
     */
    where: PayConsumedEventWhereUniqueInput
  }

  /**
   * PayConsumedEvent findFirst
   */
  export type PayConsumedEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConsumedEvent
     */
    select?: PayConsumedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConsumedEvent
     */
    omit?: PayConsumedEventOmit<ExtArgs> | null
    /**
     * Filter, which PayConsumedEvent to fetch.
     */
    where?: PayConsumedEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayConsumedEvents to fetch.
     */
    orderBy?: PayConsumedEventOrderByWithRelationInput | PayConsumedEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayConsumedEvents.
     */
    cursor?: PayConsumedEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayConsumedEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayConsumedEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayConsumedEvents.
     */
    distinct?: PayConsumedEventScalarFieldEnum | PayConsumedEventScalarFieldEnum[]
  }

  /**
   * PayConsumedEvent findFirstOrThrow
   */
  export type PayConsumedEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConsumedEvent
     */
    select?: PayConsumedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConsumedEvent
     */
    omit?: PayConsumedEventOmit<ExtArgs> | null
    /**
     * Filter, which PayConsumedEvent to fetch.
     */
    where?: PayConsumedEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayConsumedEvents to fetch.
     */
    orderBy?: PayConsumedEventOrderByWithRelationInput | PayConsumedEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayConsumedEvents.
     */
    cursor?: PayConsumedEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayConsumedEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayConsumedEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayConsumedEvents.
     */
    distinct?: PayConsumedEventScalarFieldEnum | PayConsumedEventScalarFieldEnum[]
  }

  /**
   * PayConsumedEvent findMany
   */
  export type PayConsumedEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConsumedEvent
     */
    select?: PayConsumedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConsumedEvent
     */
    omit?: PayConsumedEventOmit<ExtArgs> | null
    /**
     * Filter, which PayConsumedEvents to fetch.
     */
    where?: PayConsumedEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayConsumedEvents to fetch.
     */
    orderBy?: PayConsumedEventOrderByWithRelationInput | PayConsumedEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayConsumedEvents.
     */
    cursor?: PayConsumedEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayConsumedEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayConsumedEvents.
     */
    skip?: number
    distinct?: PayConsumedEventScalarFieldEnum | PayConsumedEventScalarFieldEnum[]
  }

  /**
   * PayConsumedEvent create
   */
  export type PayConsumedEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConsumedEvent
     */
    select?: PayConsumedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConsumedEvent
     */
    omit?: PayConsumedEventOmit<ExtArgs> | null
    /**
     * The data needed to create a PayConsumedEvent.
     */
    data: XOR<PayConsumedEventCreateInput, PayConsumedEventUncheckedCreateInput>
  }

  /**
   * PayConsumedEvent createMany
   */
  export type PayConsumedEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayConsumedEvents.
     */
    data: PayConsumedEventCreateManyInput | PayConsumedEventCreateManyInput[]
  }

  /**
   * PayConsumedEvent update
   */
  export type PayConsumedEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConsumedEvent
     */
    select?: PayConsumedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConsumedEvent
     */
    omit?: PayConsumedEventOmit<ExtArgs> | null
    /**
     * The data needed to update a PayConsumedEvent.
     */
    data: XOR<PayConsumedEventUpdateInput, PayConsumedEventUncheckedUpdateInput>
    /**
     * Choose, which PayConsumedEvent to update.
     */
    where: PayConsumedEventWhereUniqueInput
  }

  /**
   * PayConsumedEvent updateMany
   */
  export type PayConsumedEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayConsumedEvents.
     */
    data: XOR<PayConsumedEventUpdateManyMutationInput, PayConsumedEventUncheckedUpdateManyInput>
    /**
     * Filter which PayConsumedEvents to update
     */
    where?: PayConsumedEventWhereInput
    /**
     * Limit how many PayConsumedEvents to update.
     */
    limit?: number
  }

  /**
   * PayConsumedEvent upsert
   */
  export type PayConsumedEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConsumedEvent
     */
    select?: PayConsumedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConsumedEvent
     */
    omit?: PayConsumedEventOmit<ExtArgs> | null
    /**
     * The filter to search for the PayConsumedEvent to update in case it exists.
     */
    where: PayConsumedEventWhereUniqueInput
    /**
     * In case the PayConsumedEvent found by the `where` argument doesn't exist, create a new PayConsumedEvent with this data.
     */
    create: XOR<PayConsumedEventCreateInput, PayConsumedEventUncheckedCreateInput>
    /**
     * In case the PayConsumedEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayConsumedEventUpdateInput, PayConsumedEventUncheckedUpdateInput>
  }

  /**
   * PayConsumedEvent delete
   */
  export type PayConsumedEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConsumedEvent
     */
    select?: PayConsumedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConsumedEvent
     */
    omit?: PayConsumedEventOmit<ExtArgs> | null
    /**
     * Filter which PayConsumedEvent to delete.
     */
    where: PayConsumedEventWhereUniqueInput
  }

  /**
   * PayConsumedEvent deleteMany
   */
  export type PayConsumedEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayConsumedEvents to delete
     */
    where?: PayConsumedEventWhereInput
    /**
     * Limit how many PayConsumedEvents to delete.
     */
    limit?: number
  }

  /**
   * PayConsumedEvent findRaw
   */
  export type PayConsumedEventFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayConsumedEvent aggregateRaw
   */
  export type PayConsumedEventAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayConsumedEvent without action
   */
  export type PayConsumedEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayConsumedEvent
     */
    select?: PayConsumedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayConsumedEvent
     */
    omit?: PayConsumedEventOmit<ExtArgs> | null
  }


  /**
   * Model PayDlqEvent
   */

  export type AggregatePayDlqEvent = {
    _count: PayDlqEventCountAggregateOutputType | null
    _avg: PayDlqEventAvgAggregateOutputType | null
    _sum: PayDlqEventSumAggregateOutputType | null
    _min: PayDlqEventMinAggregateOutputType | null
    _max: PayDlqEventMaxAggregateOutputType | null
  }

  export type PayDlqEventAvgAggregateOutputType = {
    attempts: number | null
  }

  export type PayDlqEventSumAggregateOutputType = {
    attempts: number | null
  }

  export type PayDlqEventMinAggregateOutputType = {
    id: string | null
    sourceType: string | null
    sourceId: string | null
    eventType: string | null
    payloadJson: string | null
    errorMessage: string | null
    attempts: number | null
    replayedAt: Date | null
    replayedBy: string | null
    createdAt: Date | null
  }

  export type PayDlqEventMaxAggregateOutputType = {
    id: string | null
    sourceType: string | null
    sourceId: string | null
    eventType: string | null
    payloadJson: string | null
    errorMessage: string | null
    attempts: number | null
    replayedAt: Date | null
    replayedBy: string | null
    createdAt: Date | null
  }

  export type PayDlqEventCountAggregateOutputType = {
    id: number
    sourceType: number
    sourceId: number
    eventType: number
    payloadJson: number
    errorMessage: number
    attempts: number
    replayedAt: number
    replayedBy: number
    createdAt: number
    _all: number
  }


  export type PayDlqEventAvgAggregateInputType = {
    attempts?: true
  }

  export type PayDlqEventSumAggregateInputType = {
    attempts?: true
  }

  export type PayDlqEventMinAggregateInputType = {
    id?: true
    sourceType?: true
    sourceId?: true
    eventType?: true
    payloadJson?: true
    errorMessage?: true
    attempts?: true
    replayedAt?: true
    replayedBy?: true
    createdAt?: true
  }

  export type PayDlqEventMaxAggregateInputType = {
    id?: true
    sourceType?: true
    sourceId?: true
    eventType?: true
    payloadJson?: true
    errorMessage?: true
    attempts?: true
    replayedAt?: true
    replayedBy?: true
    createdAt?: true
  }

  export type PayDlqEventCountAggregateInputType = {
    id?: true
    sourceType?: true
    sourceId?: true
    eventType?: true
    payloadJson?: true
    errorMessage?: true
    attempts?: true
    replayedAt?: true
    replayedBy?: true
    createdAt?: true
    _all?: true
  }

  export type PayDlqEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayDlqEvent to aggregate.
     */
    where?: PayDlqEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayDlqEvents to fetch.
     */
    orderBy?: PayDlqEventOrderByWithRelationInput | PayDlqEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayDlqEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayDlqEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayDlqEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayDlqEvents
    **/
    _count?: true | PayDlqEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayDlqEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayDlqEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayDlqEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayDlqEventMaxAggregateInputType
  }

  export type GetPayDlqEventAggregateType<T extends PayDlqEventAggregateArgs> = {
        [P in keyof T & keyof AggregatePayDlqEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayDlqEvent[P]>
      : GetScalarType<T[P], AggregatePayDlqEvent[P]>
  }




  export type PayDlqEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayDlqEventWhereInput
    orderBy?: PayDlqEventOrderByWithAggregationInput | PayDlqEventOrderByWithAggregationInput[]
    by: PayDlqEventScalarFieldEnum[] | PayDlqEventScalarFieldEnum
    having?: PayDlqEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayDlqEventCountAggregateInputType | true
    _avg?: PayDlqEventAvgAggregateInputType
    _sum?: PayDlqEventSumAggregateInputType
    _min?: PayDlqEventMinAggregateInputType
    _max?: PayDlqEventMaxAggregateInputType
  }

  export type PayDlqEventGroupByOutputType = {
    id: string
    sourceType: string
    sourceId: string
    eventType: string
    payloadJson: string
    errorMessage: string
    attempts: number
    replayedAt: Date | null
    replayedBy: string | null
    createdAt: Date
    _count: PayDlqEventCountAggregateOutputType | null
    _avg: PayDlqEventAvgAggregateOutputType | null
    _sum: PayDlqEventSumAggregateOutputType | null
    _min: PayDlqEventMinAggregateOutputType | null
    _max: PayDlqEventMaxAggregateOutputType | null
  }

  type GetPayDlqEventGroupByPayload<T extends PayDlqEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayDlqEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayDlqEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayDlqEventGroupByOutputType[P]>
            : GetScalarType<T[P], PayDlqEventGroupByOutputType[P]>
        }
      >
    >


  export type PayDlqEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceType?: boolean
    sourceId?: boolean
    eventType?: boolean
    payloadJson?: boolean
    errorMessage?: boolean
    attempts?: boolean
    replayedAt?: boolean
    replayedBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["payDlqEvent"]>



  export type PayDlqEventSelectScalar = {
    id?: boolean
    sourceType?: boolean
    sourceId?: boolean
    eventType?: boolean
    payloadJson?: boolean
    errorMessage?: boolean
    attempts?: boolean
    replayedAt?: boolean
    replayedBy?: boolean
    createdAt?: boolean
  }

  export type PayDlqEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sourceType" | "sourceId" | "eventType" | "payloadJson" | "errorMessage" | "attempts" | "replayedAt" | "replayedBy" | "createdAt", ExtArgs["result"]["payDlqEvent"]>

  export type $PayDlqEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayDlqEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sourceType: string
      sourceId: string
      eventType: string
      payloadJson: string
      errorMessage: string
      attempts: number
      replayedAt: Date | null
      replayedBy: string | null
      createdAt: Date
    }, ExtArgs["result"]["payDlqEvent"]>
    composites: {}
  }

  type PayDlqEventGetPayload<S extends boolean | null | undefined | PayDlqEventDefaultArgs> = $Result.GetResult<Prisma.$PayDlqEventPayload, S>

  type PayDlqEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayDlqEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayDlqEventCountAggregateInputType | true
    }

  export interface PayDlqEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayDlqEvent'], meta: { name: 'PayDlqEvent' } }
    /**
     * Find zero or one PayDlqEvent that matches the filter.
     * @param {PayDlqEventFindUniqueArgs} args - Arguments to find a PayDlqEvent
     * @example
     * // Get one PayDlqEvent
     * const payDlqEvent = await prisma.payDlqEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayDlqEventFindUniqueArgs>(args: SelectSubset<T, PayDlqEventFindUniqueArgs<ExtArgs>>): Prisma__PayDlqEventClient<$Result.GetResult<Prisma.$PayDlqEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayDlqEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayDlqEventFindUniqueOrThrowArgs} args - Arguments to find a PayDlqEvent
     * @example
     * // Get one PayDlqEvent
     * const payDlqEvent = await prisma.payDlqEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayDlqEventFindUniqueOrThrowArgs>(args: SelectSubset<T, PayDlqEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayDlqEventClient<$Result.GetResult<Prisma.$PayDlqEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayDlqEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDlqEventFindFirstArgs} args - Arguments to find a PayDlqEvent
     * @example
     * // Get one PayDlqEvent
     * const payDlqEvent = await prisma.payDlqEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayDlqEventFindFirstArgs>(args?: SelectSubset<T, PayDlqEventFindFirstArgs<ExtArgs>>): Prisma__PayDlqEventClient<$Result.GetResult<Prisma.$PayDlqEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayDlqEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDlqEventFindFirstOrThrowArgs} args - Arguments to find a PayDlqEvent
     * @example
     * // Get one PayDlqEvent
     * const payDlqEvent = await prisma.payDlqEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayDlqEventFindFirstOrThrowArgs>(args?: SelectSubset<T, PayDlqEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayDlqEventClient<$Result.GetResult<Prisma.$PayDlqEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayDlqEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDlqEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayDlqEvents
     * const payDlqEvents = await prisma.payDlqEvent.findMany()
     * 
     * // Get first 10 PayDlqEvents
     * const payDlqEvents = await prisma.payDlqEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payDlqEventWithIdOnly = await prisma.payDlqEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayDlqEventFindManyArgs>(args?: SelectSubset<T, PayDlqEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayDlqEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayDlqEvent.
     * @param {PayDlqEventCreateArgs} args - Arguments to create a PayDlqEvent.
     * @example
     * // Create one PayDlqEvent
     * const PayDlqEvent = await prisma.payDlqEvent.create({
     *   data: {
     *     // ... data to create a PayDlqEvent
     *   }
     * })
     * 
     */
    create<T extends PayDlqEventCreateArgs>(args: SelectSubset<T, PayDlqEventCreateArgs<ExtArgs>>): Prisma__PayDlqEventClient<$Result.GetResult<Prisma.$PayDlqEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayDlqEvents.
     * @param {PayDlqEventCreateManyArgs} args - Arguments to create many PayDlqEvents.
     * @example
     * // Create many PayDlqEvents
     * const payDlqEvent = await prisma.payDlqEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayDlqEventCreateManyArgs>(args?: SelectSubset<T, PayDlqEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayDlqEvent.
     * @param {PayDlqEventDeleteArgs} args - Arguments to delete one PayDlqEvent.
     * @example
     * // Delete one PayDlqEvent
     * const PayDlqEvent = await prisma.payDlqEvent.delete({
     *   where: {
     *     // ... filter to delete one PayDlqEvent
     *   }
     * })
     * 
     */
    delete<T extends PayDlqEventDeleteArgs>(args: SelectSubset<T, PayDlqEventDeleteArgs<ExtArgs>>): Prisma__PayDlqEventClient<$Result.GetResult<Prisma.$PayDlqEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayDlqEvent.
     * @param {PayDlqEventUpdateArgs} args - Arguments to update one PayDlqEvent.
     * @example
     * // Update one PayDlqEvent
     * const payDlqEvent = await prisma.payDlqEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayDlqEventUpdateArgs>(args: SelectSubset<T, PayDlqEventUpdateArgs<ExtArgs>>): Prisma__PayDlqEventClient<$Result.GetResult<Prisma.$PayDlqEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayDlqEvents.
     * @param {PayDlqEventDeleteManyArgs} args - Arguments to filter PayDlqEvents to delete.
     * @example
     * // Delete a few PayDlqEvents
     * const { count } = await prisma.payDlqEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayDlqEventDeleteManyArgs>(args?: SelectSubset<T, PayDlqEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayDlqEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDlqEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayDlqEvents
     * const payDlqEvent = await prisma.payDlqEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayDlqEventUpdateManyArgs>(args: SelectSubset<T, PayDlqEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayDlqEvent.
     * @param {PayDlqEventUpsertArgs} args - Arguments to update or create a PayDlqEvent.
     * @example
     * // Update or create a PayDlqEvent
     * const payDlqEvent = await prisma.payDlqEvent.upsert({
     *   create: {
     *     // ... data to create a PayDlqEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayDlqEvent we want to update
     *   }
     * })
     */
    upsert<T extends PayDlqEventUpsertArgs>(args: SelectSubset<T, PayDlqEventUpsertArgs<ExtArgs>>): Prisma__PayDlqEventClient<$Result.GetResult<Prisma.$PayDlqEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayDlqEvents that matches the filter.
     * @param {PayDlqEventFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payDlqEvent = await prisma.payDlqEvent.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayDlqEventFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayDlqEvent.
     * @param {PayDlqEventAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payDlqEvent = await prisma.payDlqEvent.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayDlqEventAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayDlqEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDlqEventCountArgs} args - Arguments to filter PayDlqEvents to count.
     * @example
     * // Count the number of PayDlqEvents
     * const count = await prisma.payDlqEvent.count({
     *   where: {
     *     // ... the filter for the PayDlqEvents we want to count
     *   }
     * })
    **/
    count<T extends PayDlqEventCountArgs>(
      args?: Subset<T, PayDlqEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayDlqEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayDlqEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDlqEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayDlqEventAggregateArgs>(args: Subset<T, PayDlqEventAggregateArgs>): Prisma.PrismaPromise<GetPayDlqEventAggregateType<T>>

    /**
     * Group by PayDlqEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDlqEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayDlqEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayDlqEventGroupByArgs['orderBy'] }
        : { orderBy?: PayDlqEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayDlqEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayDlqEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayDlqEvent model
   */
  readonly fields: PayDlqEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayDlqEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayDlqEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayDlqEvent model
   */
  interface PayDlqEventFieldRefs {
    readonly id: FieldRef<"PayDlqEvent", 'String'>
    readonly sourceType: FieldRef<"PayDlqEvent", 'String'>
    readonly sourceId: FieldRef<"PayDlqEvent", 'String'>
    readonly eventType: FieldRef<"PayDlqEvent", 'String'>
    readonly payloadJson: FieldRef<"PayDlqEvent", 'String'>
    readonly errorMessage: FieldRef<"PayDlqEvent", 'String'>
    readonly attempts: FieldRef<"PayDlqEvent", 'Int'>
    readonly replayedAt: FieldRef<"PayDlqEvent", 'DateTime'>
    readonly replayedBy: FieldRef<"PayDlqEvent", 'String'>
    readonly createdAt: FieldRef<"PayDlqEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayDlqEvent findUnique
   */
  export type PayDlqEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDlqEvent
     */
    select?: PayDlqEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDlqEvent
     */
    omit?: PayDlqEventOmit<ExtArgs> | null
    /**
     * Filter, which PayDlqEvent to fetch.
     */
    where: PayDlqEventWhereUniqueInput
  }

  /**
   * PayDlqEvent findUniqueOrThrow
   */
  export type PayDlqEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDlqEvent
     */
    select?: PayDlqEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDlqEvent
     */
    omit?: PayDlqEventOmit<ExtArgs> | null
    /**
     * Filter, which PayDlqEvent to fetch.
     */
    where: PayDlqEventWhereUniqueInput
  }

  /**
   * PayDlqEvent findFirst
   */
  export type PayDlqEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDlqEvent
     */
    select?: PayDlqEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDlqEvent
     */
    omit?: PayDlqEventOmit<ExtArgs> | null
    /**
     * Filter, which PayDlqEvent to fetch.
     */
    where?: PayDlqEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayDlqEvents to fetch.
     */
    orderBy?: PayDlqEventOrderByWithRelationInput | PayDlqEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayDlqEvents.
     */
    cursor?: PayDlqEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayDlqEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayDlqEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayDlqEvents.
     */
    distinct?: PayDlqEventScalarFieldEnum | PayDlqEventScalarFieldEnum[]
  }

  /**
   * PayDlqEvent findFirstOrThrow
   */
  export type PayDlqEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDlqEvent
     */
    select?: PayDlqEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDlqEvent
     */
    omit?: PayDlqEventOmit<ExtArgs> | null
    /**
     * Filter, which PayDlqEvent to fetch.
     */
    where?: PayDlqEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayDlqEvents to fetch.
     */
    orderBy?: PayDlqEventOrderByWithRelationInput | PayDlqEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayDlqEvents.
     */
    cursor?: PayDlqEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayDlqEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayDlqEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayDlqEvents.
     */
    distinct?: PayDlqEventScalarFieldEnum | PayDlqEventScalarFieldEnum[]
  }

  /**
   * PayDlqEvent findMany
   */
  export type PayDlqEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDlqEvent
     */
    select?: PayDlqEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDlqEvent
     */
    omit?: PayDlqEventOmit<ExtArgs> | null
    /**
     * Filter, which PayDlqEvents to fetch.
     */
    where?: PayDlqEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayDlqEvents to fetch.
     */
    orderBy?: PayDlqEventOrderByWithRelationInput | PayDlqEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayDlqEvents.
     */
    cursor?: PayDlqEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayDlqEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayDlqEvents.
     */
    skip?: number
    distinct?: PayDlqEventScalarFieldEnum | PayDlqEventScalarFieldEnum[]
  }

  /**
   * PayDlqEvent create
   */
  export type PayDlqEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDlqEvent
     */
    select?: PayDlqEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDlqEvent
     */
    omit?: PayDlqEventOmit<ExtArgs> | null
    /**
     * The data needed to create a PayDlqEvent.
     */
    data: XOR<PayDlqEventCreateInput, PayDlqEventUncheckedCreateInput>
  }

  /**
   * PayDlqEvent createMany
   */
  export type PayDlqEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayDlqEvents.
     */
    data: PayDlqEventCreateManyInput | PayDlqEventCreateManyInput[]
  }

  /**
   * PayDlqEvent update
   */
  export type PayDlqEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDlqEvent
     */
    select?: PayDlqEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDlqEvent
     */
    omit?: PayDlqEventOmit<ExtArgs> | null
    /**
     * The data needed to update a PayDlqEvent.
     */
    data: XOR<PayDlqEventUpdateInput, PayDlqEventUncheckedUpdateInput>
    /**
     * Choose, which PayDlqEvent to update.
     */
    where: PayDlqEventWhereUniqueInput
  }

  /**
   * PayDlqEvent updateMany
   */
  export type PayDlqEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayDlqEvents.
     */
    data: XOR<PayDlqEventUpdateManyMutationInput, PayDlqEventUncheckedUpdateManyInput>
    /**
     * Filter which PayDlqEvents to update
     */
    where?: PayDlqEventWhereInput
    /**
     * Limit how many PayDlqEvents to update.
     */
    limit?: number
  }

  /**
   * PayDlqEvent upsert
   */
  export type PayDlqEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDlqEvent
     */
    select?: PayDlqEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDlqEvent
     */
    omit?: PayDlqEventOmit<ExtArgs> | null
    /**
     * The filter to search for the PayDlqEvent to update in case it exists.
     */
    where: PayDlqEventWhereUniqueInput
    /**
     * In case the PayDlqEvent found by the `where` argument doesn't exist, create a new PayDlqEvent with this data.
     */
    create: XOR<PayDlqEventCreateInput, PayDlqEventUncheckedCreateInput>
    /**
     * In case the PayDlqEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayDlqEventUpdateInput, PayDlqEventUncheckedUpdateInput>
  }

  /**
   * PayDlqEvent delete
   */
  export type PayDlqEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDlqEvent
     */
    select?: PayDlqEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDlqEvent
     */
    omit?: PayDlqEventOmit<ExtArgs> | null
    /**
     * Filter which PayDlqEvent to delete.
     */
    where: PayDlqEventWhereUniqueInput
  }

  /**
   * PayDlqEvent deleteMany
   */
  export type PayDlqEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayDlqEvents to delete
     */
    where?: PayDlqEventWhereInput
    /**
     * Limit how many PayDlqEvents to delete.
     */
    limit?: number
  }

  /**
   * PayDlqEvent findRaw
   */
  export type PayDlqEventFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayDlqEvent aggregateRaw
   */
  export type PayDlqEventAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayDlqEvent without action
   */
  export type PayDlqEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDlqEvent
     */
    select?: PayDlqEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDlqEvent
     */
    omit?: PayDlqEventOmit<ExtArgs> | null
  }


  /**
   * Model PayAuditEvent
   */

  export type AggregatePayAuditEvent = {
    _count: PayAuditEventCountAggregateOutputType | null
    _avg: PayAuditEventAvgAggregateOutputType | null
    _sum: PayAuditEventSumAggregateOutputType | null
    _min: PayAuditEventMinAggregateOutputType | null
    _max: PayAuditEventMaxAggregateOutputType | null
  }

  export type PayAuditEventAvgAggregateOutputType = {
    seq: number | null
  }

  export type PayAuditEventSumAggregateOutputType = {
    seq: number | null
  }

  export type PayAuditEventMinAggregateOutputType = {
    id: string | null
    seq: number | null
    actorId: string | null
    actorRole: string | null
    action: string | null
    resourceType: string | null
    resourceId: string | null
    reason: string | null
    payloadJson: string | null
    prevHash: string | null
    hash: string | null
    createdAt: Date | null
  }

  export type PayAuditEventMaxAggregateOutputType = {
    id: string | null
    seq: number | null
    actorId: string | null
    actorRole: string | null
    action: string | null
    resourceType: string | null
    resourceId: string | null
    reason: string | null
    payloadJson: string | null
    prevHash: string | null
    hash: string | null
    createdAt: Date | null
  }

  export type PayAuditEventCountAggregateOutputType = {
    id: number
    seq: number
    actorId: number
    actorRole: number
    action: number
    resourceType: number
    resourceId: number
    reason: number
    payloadJson: number
    prevHash: number
    hash: number
    createdAt: number
    _all: number
  }


  export type PayAuditEventAvgAggregateInputType = {
    seq?: true
  }

  export type PayAuditEventSumAggregateInputType = {
    seq?: true
  }

  export type PayAuditEventMinAggregateInputType = {
    id?: true
    seq?: true
    actorId?: true
    actorRole?: true
    action?: true
    resourceType?: true
    resourceId?: true
    reason?: true
    payloadJson?: true
    prevHash?: true
    hash?: true
    createdAt?: true
  }

  export type PayAuditEventMaxAggregateInputType = {
    id?: true
    seq?: true
    actorId?: true
    actorRole?: true
    action?: true
    resourceType?: true
    resourceId?: true
    reason?: true
    payloadJson?: true
    prevHash?: true
    hash?: true
    createdAt?: true
  }

  export type PayAuditEventCountAggregateInputType = {
    id?: true
    seq?: true
    actorId?: true
    actorRole?: true
    action?: true
    resourceType?: true
    resourceId?: true
    reason?: true
    payloadJson?: true
    prevHash?: true
    hash?: true
    createdAt?: true
    _all?: true
  }

  export type PayAuditEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayAuditEvent to aggregate.
     */
    where?: PayAuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayAuditEvents to fetch.
     */
    orderBy?: PayAuditEventOrderByWithRelationInput | PayAuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayAuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayAuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayAuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayAuditEvents
    **/
    _count?: true | PayAuditEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayAuditEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayAuditEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayAuditEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayAuditEventMaxAggregateInputType
  }

  export type GetPayAuditEventAggregateType<T extends PayAuditEventAggregateArgs> = {
        [P in keyof T & keyof AggregatePayAuditEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayAuditEvent[P]>
      : GetScalarType<T[P], AggregatePayAuditEvent[P]>
  }




  export type PayAuditEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayAuditEventWhereInput
    orderBy?: PayAuditEventOrderByWithAggregationInput | PayAuditEventOrderByWithAggregationInput[]
    by: PayAuditEventScalarFieldEnum[] | PayAuditEventScalarFieldEnum
    having?: PayAuditEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayAuditEventCountAggregateInputType | true
    _avg?: PayAuditEventAvgAggregateInputType
    _sum?: PayAuditEventSumAggregateInputType
    _min?: PayAuditEventMinAggregateInputType
    _max?: PayAuditEventMaxAggregateInputType
  }

  export type PayAuditEventGroupByOutputType = {
    id: string
    seq: number
    actorId: string
    actorRole: string
    action: string
    resourceType: string
    resourceId: string
    reason: string | null
    payloadJson: string
    prevHash: string
    hash: string
    createdAt: Date
    _count: PayAuditEventCountAggregateOutputType | null
    _avg: PayAuditEventAvgAggregateOutputType | null
    _sum: PayAuditEventSumAggregateOutputType | null
    _min: PayAuditEventMinAggregateOutputType | null
    _max: PayAuditEventMaxAggregateOutputType | null
  }

  type GetPayAuditEventGroupByPayload<T extends PayAuditEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayAuditEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayAuditEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayAuditEventGroupByOutputType[P]>
            : GetScalarType<T[P], PayAuditEventGroupByOutputType[P]>
        }
      >
    >


  export type PayAuditEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    seq?: boolean
    actorId?: boolean
    actorRole?: boolean
    action?: boolean
    resourceType?: boolean
    resourceId?: boolean
    reason?: boolean
    payloadJson?: boolean
    prevHash?: boolean
    hash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["payAuditEvent"]>



  export type PayAuditEventSelectScalar = {
    id?: boolean
    seq?: boolean
    actorId?: boolean
    actorRole?: boolean
    action?: boolean
    resourceType?: boolean
    resourceId?: boolean
    reason?: boolean
    payloadJson?: boolean
    prevHash?: boolean
    hash?: boolean
    createdAt?: boolean
  }

  export type PayAuditEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "seq" | "actorId" | "actorRole" | "action" | "resourceType" | "resourceId" | "reason" | "payloadJson" | "prevHash" | "hash" | "createdAt", ExtArgs["result"]["payAuditEvent"]>

  export type $PayAuditEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayAuditEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      seq: number
      actorId: string
      actorRole: string
      action: string
      resourceType: string
      resourceId: string
      reason: string | null
      payloadJson: string
      prevHash: string
      hash: string
      createdAt: Date
    }, ExtArgs["result"]["payAuditEvent"]>
    composites: {}
  }

  type PayAuditEventGetPayload<S extends boolean | null | undefined | PayAuditEventDefaultArgs> = $Result.GetResult<Prisma.$PayAuditEventPayload, S>

  type PayAuditEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayAuditEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayAuditEventCountAggregateInputType | true
    }

  export interface PayAuditEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayAuditEvent'], meta: { name: 'PayAuditEvent' } }
    /**
     * Find zero or one PayAuditEvent that matches the filter.
     * @param {PayAuditEventFindUniqueArgs} args - Arguments to find a PayAuditEvent
     * @example
     * // Get one PayAuditEvent
     * const payAuditEvent = await prisma.payAuditEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayAuditEventFindUniqueArgs>(args: SelectSubset<T, PayAuditEventFindUniqueArgs<ExtArgs>>): Prisma__PayAuditEventClient<$Result.GetResult<Prisma.$PayAuditEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayAuditEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayAuditEventFindUniqueOrThrowArgs} args - Arguments to find a PayAuditEvent
     * @example
     * // Get one PayAuditEvent
     * const payAuditEvent = await prisma.payAuditEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayAuditEventFindUniqueOrThrowArgs>(args: SelectSubset<T, PayAuditEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayAuditEventClient<$Result.GetResult<Prisma.$PayAuditEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayAuditEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayAuditEventFindFirstArgs} args - Arguments to find a PayAuditEvent
     * @example
     * // Get one PayAuditEvent
     * const payAuditEvent = await prisma.payAuditEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayAuditEventFindFirstArgs>(args?: SelectSubset<T, PayAuditEventFindFirstArgs<ExtArgs>>): Prisma__PayAuditEventClient<$Result.GetResult<Prisma.$PayAuditEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayAuditEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayAuditEventFindFirstOrThrowArgs} args - Arguments to find a PayAuditEvent
     * @example
     * // Get one PayAuditEvent
     * const payAuditEvent = await prisma.payAuditEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayAuditEventFindFirstOrThrowArgs>(args?: SelectSubset<T, PayAuditEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayAuditEventClient<$Result.GetResult<Prisma.$PayAuditEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayAuditEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayAuditEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayAuditEvents
     * const payAuditEvents = await prisma.payAuditEvent.findMany()
     * 
     * // Get first 10 PayAuditEvents
     * const payAuditEvents = await prisma.payAuditEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payAuditEventWithIdOnly = await prisma.payAuditEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayAuditEventFindManyArgs>(args?: SelectSubset<T, PayAuditEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayAuditEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayAuditEvent.
     * @param {PayAuditEventCreateArgs} args - Arguments to create a PayAuditEvent.
     * @example
     * // Create one PayAuditEvent
     * const PayAuditEvent = await prisma.payAuditEvent.create({
     *   data: {
     *     // ... data to create a PayAuditEvent
     *   }
     * })
     * 
     */
    create<T extends PayAuditEventCreateArgs>(args: SelectSubset<T, PayAuditEventCreateArgs<ExtArgs>>): Prisma__PayAuditEventClient<$Result.GetResult<Prisma.$PayAuditEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayAuditEvents.
     * @param {PayAuditEventCreateManyArgs} args - Arguments to create many PayAuditEvents.
     * @example
     * // Create many PayAuditEvents
     * const payAuditEvent = await prisma.payAuditEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayAuditEventCreateManyArgs>(args?: SelectSubset<T, PayAuditEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayAuditEvent.
     * @param {PayAuditEventDeleteArgs} args - Arguments to delete one PayAuditEvent.
     * @example
     * // Delete one PayAuditEvent
     * const PayAuditEvent = await prisma.payAuditEvent.delete({
     *   where: {
     *     // ... filter to delete one PayAuditEvent
     *   }
     * })
     * 
     */
    delete<T extends PayAuditEventDeleteArgs>(args: SelectSubset<T, PayAuditEventDeleteArgs<ExtArgs>>): Prisma__PayAuditEventClient<$Result.GetResult<Prisma.$PayAuditEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayAuditEvent.
     * @param {PayAuditEventUpdateArgs} args - Arguments to update one PayAuditEvent.
     * @example
     * // Update one PayAuditEvent
     * const payAuditEvent = await prisma.payAuditEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayAuditEventUpdateArgs>(args: SelectSubset<T, PayAuditEventUpdateArgs<ExtArgs>>): Prisma__PayAuditEventClient<$Result.GetResult<Prisma.$PayAuditEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayAuditEvents.
     * @param {PayAuditEventDeleteManyArgs} args - Arguments to filter PayAuditEvents to delete.
     * @example
     * // Delete a few PayAuditEvents
     * const { count } = await prisma.payAuditEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayAuditEventDeleteManyArgs>(args?: SelectSubset<T, PayAuditEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayAuditEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayAuditEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayAuditEvents
     * const payAuditEvent = await prisma.payAuditEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayAuditEventUpdateManyArgs>(args: SelectSubset<T, PayAuditEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayAuditEvent.
     * @param {PayAuditEventUpsertArgs} args - Arguments to update or create a PayAuditEvent.
     * @example
     * // Update or create a PayAuditEvent
     * const payAuditEvent = await prisma.payAuditEvent.upsert({
     *   create: {
     *     // ... data to create a PayAuditEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayAuditEvent we want to update
     *   }
     * })
     */
    upsert<T extends PayAuditEventUpsertArgs>(args: SelectSubset<T, PayAuditEventUpsertArgs<ExtArgs>>): Prisma__PayAuditEventClient<$Result.GetResult<Prisma.$PayAuditEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayAuditEvents that matches the filter.
     * @param {PayAuditEventFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payAuditEvent = await prisma.payAuditEvent.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayAuditEventFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayAuditEvent.
     * @param {PayAuditEventAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payAuditEvent = await prisma.payAuditEvent.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayAuditEventAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayAuditEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayAuditEventCountArgs} args - Arguments to filter PayAuditEvents to count.
     * @example
     * // Count the number of PayAuditEvents
     * const count = await prisma.payAuditEvent.count({
     *   where: {
     *     // ... the filter for the PayAuditEvents we want to count
     *   }
     * })
    **/
    count<T extends PayAuditEventCountArgs>(
      args?: Subset<T, PayAuditEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayAuditEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayAuditEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayAuditEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayAuditEventAggregateArgs>(args: Subset<T, PayAuditEventAggregateArgs>): Prisma.PrismaPromise<GetPayAuditEventAggregateType<T>>

    /**
     * Group by PayAuditEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayAuditEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayAuditEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayAuditEventGroupByArgs['orderBy'] }
        : { orderBy?: PayAuditEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayAuditEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayAuditEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayAuditEvent model
   */
  readonly fields: PayAuditEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayAuditEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayAuditEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayAuditEvent model
   */
  interface PayAuditEventFieldRefs {
    readonly id: FieldRef<"PayAuditEvent", 'String'>
    readonly seq: FieldRef<"PayAuditEvent", 'Int'>
    readonly actorId: FieldRef<"PayAuditEvent", 'String'>
    readonly actorRole: FieldRef<"PayAuditEvent", 'String'>
    readonly action: FieldRef<"PayAuditEvent", 'String'>
    readonly resourceType: FieldRef<"PayAuditEvent", 'String'>
    readonly resourceId: FieldRef<"PayAuditEvent", 'String'>
    readonly reason: FieldRef<"PayAuditEvent", 'String'>
    readonly payloadJson: FieldRef<"PayAuditEvent", 'String'>
    readonly prevHash: FieldRef<"PayAuditEvent", 'String'>
    readonly hash: FieldRef<"PayAuditEvent", 'String'>
    readonly createdAt: FieldRef<"PayAuditEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayAuditEvent findUnique
   */
  export type PayAuditEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayAuditEvent
     */
    select?: PayAuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayAuditEvent
     */
    omit?: PayAuditEventOmit<ExtArgs> | null
    /**
     * Filter, which PayAuditEvent to fetch.
     */
    where: PayAuditEventWhereUniqueInput
  }

  /**
   * PayAuditEvent findUniqueOrThrow
   */
  export type PayAuditEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayAuditEvent
     */
    select?: PayAuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayAuditEvent
     */
    omit?: PayAuditEventOmit<ExtArgs> | null
    /**
     * Filter, which PayAuditEvent to fetch.
     */
    where: PayAuditEventWhereUniqueInput
  }

  /**
   * PayAuditEvent findFirst
   */
  export type PayAuditEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayAuditEvent
     */
    select?: PayAuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayAuditEvent
     */
    omit?: PayAuditEventOmit<ExtArgs> | null
    /**
     * Filter, which PayAuditEvent to fetch.
     */
    where?: PayAuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayAuditEvents to fetch.
     */
    orderBy?: PayAuditEventOrderByWithRelationInput | PayAuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayAuditEvents.
     */
    cursor?: PayAuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayAuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayAuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayAuditEvents.
     */
    distinct?: PayAuditEventScalarFieldEnum | PayAuditEventScalarFieldEnum[]
  }

  /**
   * PayAuditEvent findFirstOrThrow
   */
  export type PayAuditEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayAuditEvent
     */
    select?: PayAuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayAuditEvent
     */
    omit?: PayAuditEventOmit<ExtArgs> | null
    /**
     * Filter, which PayAuditEvent to fetch.
     */
    where?: PayAuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayAuditEvents to fetch.
     */
    orderBy?: PayAuditEventOrderByWithRelationInput | PayAuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayAuditEvents.
     */
    cursor?: PayAuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayAuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayAuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayAuditEvents.
     */
    distinct?: PayAuditEventScalarFieldEnum | PayAuditEventScalarFieldEnum[]
  }

  /**
   * PayAuditEvent findMany
   */
  export type PayAuditEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayAuditEvent
     */
    select?: PayAuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayAuditEvent
     */
    omit?: PayAuditEventOmit<ExtArgs> | null
    /**
     * Filter, which PayAuditEvents to fetch.
     */
    where?: PayAuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayAuditEvents to fetch.
     */
    orderBy?: PayAuditEventOrderByWithRelationInput | PayAuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayAuditEvents.
     */
    cursor?: PayAuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayAuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayAuditEvents.
     */
    skip?: number
    distinct?: PayAuditEventScalarFieldEnum | PayAuditEventScalarFieldEnum[]
  }

  /**
   * PayAuditEvent create
   */
  export type PayAuditEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayAuditEvent
     */
    select?: PayAuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayAuditEvent
     */
    omit?: PayAuditEventOmit<ExtArgs> | null
    /**
     * The data needed to create a PayAuditEvent.
     */
    data: XOR<PayAuditEventCreateInput, PayAuditEventUncheckedCreateInput>
  }

  /**
   * PayAuditEvent createMany
   */
  export type PayAuditEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayAuditEvents.
     */
    data: PayAuditEventCreateManyInput | PayAuditEventCreateManyInput[]
  }

  /**
   * PayAuditEvent update
   */
  export type PayAuditEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayAuditEvent
     */
    select?: PayAuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayAuditEvent
     */
    omit?: PayAuditEventOmit<ExtArgs> | null
    /**
     * The data needed to update a PayAuditEvent.
     */
    data: XOR<PayAuditEventUpdateInput, PayAuditEventUncheckedUpdateInput>
    /**
     * Choose, which PayAuditEvent to update.
     */
    where: PayAuditEventWhereUniqueInput
  }

  /**
   * PayAuditEvent updateMany
   */
  export type PayAuditEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayAuditEvents.
     */
    data: XOR<PayAuditEventUpdateManyMutationInput, PayAuditEventUncheckedUpdateManyInput>
    /**
     * Filter which PayAuditEvents to update
     */
    where?: PayAuditEventWhereInput
    /**
     * Limit how many PayAuditEvents to update.
     */
    limit?: number
  }

  /**
   * PayAuditEvent upsert
   */
  export type PayAuditEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayAuditEvent
     */
    select?: PayAuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayAuditEvent
     */
    omit?: PayAuditEventOmit<ExtArgs> | null
    /**
     * The filter to search for the PayAuditEvent to update in case it exists.
     */
    where: PayAuditEventWhereUniqueInput
    /**
     * In case the PayAuditEvent found by the `where` argument doesn't exist, create a new PayAuditEvent with this data.
     */
    create: XOR<PayAuditEventCreateInput, PayAuditEventUncheckedCreateInput>
    /**
     * In case the PayAuditEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayAuditEventUpdateInput, PayAuditEventUncheckedUpdateInput>
  }

  /**
   * PayAuditEvent delete
   */
  export type PayAuditEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayAuditEvent
     */
    select?: PayAuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayAuditEvent
     */
    omit?: PayAuditEventOmit<ExtArgs> | null
    /**
     * Filter which PayAuditEvent to delete.
     */
    where: PayAuditEventWhereUniqueInput
  }

  /**
   * PayAuditEvent deleteMany
   */
  export type PayAuditEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayAuditEvents to delete
     */
    where?: PayAuditEventWhereInput
    /**
     * Limit how many PayAuditEvents to delete.
     */
    limit?: number
  }

  /**
   * PayAuditEvent findRaw
   */
  export type PayAuditEventFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayAuditEvent aggregateRaw
   */
  export type PayAuditEventAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayAuditEvent without action
   */
  export type PayAuditEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayAuditEvent
     */
    select?: PayAuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayAuditEvent
     */
    omit?: PayAuditEventOmit<ExtArgs> | null
  }


  /**
   * Model PayQueueJob
   */

  export type AggregatePayQueueJob = {
    _count: PayQueueJobCountAggregateOutputType | null
    _avg: PayQueueJobAvgAggregateOutputType | null
    _sum: PayQueueJobSumAggregateOutputType | null
    _min: PayQueueJobMinAggregateOutputType | null
    _max: PayQueueJobMaxAggregateOutputType | null
  }

  export type PayQueueJobAvgAggregateOutputType = {
    attempts: number | null
    maxAttempts: number | null
  }

  export type PayQueueJobSumAggregateOutputType = {
    attempts: number | null
    maxAttempts: number | null
  }

  export type PayQueueJobMinAggregateOutputType = {
    id: string | null
    queueName: string | null
    jobType: string | null
    dedupKey: string | null
    payloadJson: string | null
    status: string | null
    attempts: number | null
    maxAttempts: number | null
    runAt: Date | null
    lockedBy: string | null
    lockedUntil: Date | null
    lastError: string | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayQueueJobMaxAggregateOutputType = {
    id: string | null
    queueName: string | null
    jobType: string | null
    dedupKey: string | null
    payloadJson: string | null
    status: string | null
    attempts: number | null
    maxAttempts: number | null
    runAt: Date | null
    lockedBy: string | null
    lockedUntil: Date | null
    lastError: string | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayQueueJobCountAggregateOutputType = {
    id: number
    queueName: number
    jobType: number
    dedupKey: number
    payloadJson: number
    status: number
    attempts: number
    maxAttempts: number
    runAt: number
    lockedBy: number
    lockedUntil: number
    lastError: number
    completedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PayQueueJobAvgAggregateInputType = {
    attempts?: true
    maxAttempts?: true
  }

  export type PayQueueJobSumAggregateInputType = {
    attempts?: true
    maxAttempts?: true
  }

  export type PayQueueJobMinAggregateInputType = {
    id?: true
    queueName?: true
    jobType?: true
    dedupKey?: true
    payloadJson?: true
    status?: true
    attempts?: true
    maxAttempts?: true
    runAt?: true
    lockedBy?: true
    lockedUntil?: true
    lastError?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayQueueJobMaxAggregateInputType = {
    id?: true
    queueName?: true
    jobType?: true
    dedupKey?: true
    payloadJson?: true
    status?: true
    attempts?: true
    maxAttempts?: true
    runAt?: true
    lockedBy?: true
    lockedUntil?: true
    lastError?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayQueueJobCountAggregateInputType = {
    id?: true
    queueName?: true
    jobType?: true
    dedupKey?: true
    payloadJson?: true
    status?: true
    attempts?: true
    maxAttempts?: true
    runAt?: true
    lockedBy?: true
    lockedUntil?: true
    lastError?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PayQueueJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayQueueJob to aggregate.
     */
    where?: PayQueueJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayQueueJobs to fetch.
     */
    orderBy?: PayQueueJobOrderByWithRelationInput | PayQueueJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayQueueJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayQueueJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayQueueJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayQueueJobs
    **/
    _count?: true | PayQueueJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayQueueJobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayQueueJobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayQueueJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayQueueJobMaxAggregateInputType
  }

  export type GetPayQueueJobAggregateType<T extends PayQueueJobAggregateArgs> = {
        [P in keyof T & keyof AggregatePayQueueJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayQueueJob[P]>
      : GetScalarType<T[P], AggregatePayQueueJob[P]>
  }




  export type PayQueueJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayQueueJobWhereInput
    orderBy?: PayQueueJobOrderByWithAggregationInput | PayQueueJobOrderByWithAggregationInput[]
    by: PayQueueJobScalarFieldEnum[] | PayQueueJobScalarFieldEnum
    having?: PayQueueJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayQueueJobCountAggregateInputType | true
    _avg?: PayQueueJobAvgAggregateInputType
    _sum?: PayQueueJobSumAggregateInputType
    _min?: PayQueueJobMinAggregateInputType
    _max?: PayQueueJobMaxAggregateInputType
  }

  export type PayQueueJobGroupByOutputType = {
    id: string
    queueName: string
    jobType: string
    dedupKey: string
    payloadJson: string
    status: string
    attempts: number
    maxAttempts: number
    runAt: Date
    lockedBy: string | null
    lockedUntil: Date | null
    lastError: string | null
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: PayQueueJobCountAggregateOutputType | null
    _avg: PayQueueJobAvgAggregateOutputType | null
    _sum: PayQueueJobSumAggregateOutputType | null
    _min: PayQueueJobMinAggregateOutputType | null
    _max: PayQueueJobMaxAggregateOutputType | null
  }

  type GetPayQueueJobGroupByPayload<T extends PayQueueJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayQueueJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayQueueJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayQueueJobGroupByOutputType[P]>
            : GetScalarType<T[P], PayQueueJobGroupByOutputType[P]>
        }
      >
    >


  export type PayQueueJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    queueName?: boolean
    jobType?: boolean
    dedupKey?: boolean
    payloadJson?: boolean
    status?: boolean
    attempts?: boolean
    maxAttempts?: boolean
    runAt?: boolean
    lockedBy?: boolean
    lockedUntil?: boolean
    lastError?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["payQueueJob"]>



  export type PayQueueJobSelectScalar = {
    id?: boolean
    queueName?: boolean
    jobType?: boolean
    dedupKey?: boolean
    payloadJson?: boolean
    status?: boolean
    attempts?: boolean
    maxAttempts?: boolean
    runAt?: boolean
    lockedBy?: boolean
    lockedUntil?: boolean
    lastError?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PayQueueJobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "queueName" | "jobType" | "dedupKey" | "payloadJson" | "status" | "attempts" | "maxAttempts" | "runAt" | "lockedBy" | "lockedUntil" | "lastError" | "completedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["payQueueJob"]>

  export type $PayQueueJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayQueueJob"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      queueName: string
      jobType: string
      dedupKey: string
      payloadJson: string
      status: string
      attempts: number
      maxAttempts: number
      runAt: Date
      lockedBy: string | null
      lockedUntil: Date | null
      lastError: string | null
      completedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["payQueueJob"]>
    composites: {}
  }

  type PayQueueJobGetPayload<S extends boolean | null | undefined | PayQueueJobDefaultArgs> = $Result.GetResult<Prisma.$PayQueueJobPayload, S>

  type PayQueueJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayQueueJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayQueueJobCountAggregateInputType | true
    }

  export interface PayQueueJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayQueueJob'], meta: { name: 'PayQueueJob' } }
    /**
     * Find zero or one PayQueueJob that matches the filter.
     * @param {PayQueueJobFindUniqueArgs} args - Arguments to find a PayQueueJob
     * @example
     * // Get one PayQueueJob
     * const payQueueJob = await prisma.payQueueJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayQueueJobFindUniqueArgs>(args: SelectSubset<T, PayQueueJobFindUniqueArgs<ExtArgs>>): Prisma__PayQueueJobClient<$Result.GetResult<Prisma.$PayQueueJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayQueueJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayQueueJobFindUniqueOrThrowArgs} args - Arguments to find a PayQueueJob
     * @example
     * // Get one PayQueueJob
     * const payQueueJob = await prisma.payQueueJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayQueueJobFindUniqueOrThrowArgs>(args: SelectSubset<T, PayQueueJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayQueueJobClient<$Result.GetResult<Prisma.$PayQueueJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayQueueJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayQueueJobFindFirstArgs} args - Arguments to find a PayQueueJob
     * @example
     * // Get one PayQueueJob
     * const payQueueJob = await prisma.payQueueJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayQueueJobFindFirstArgs>(args?: SelectSubset<T, PayQueueJobFindFirstArgs<ExtArgs>>): Prisma__PayQueueJobClient<$Result.GetResult<Prisma.$PayQueueJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayQueueJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayQueueJobFindFirstOrThrowArgs} args - Arguments to find a PayQueueJob
     * @example
     * // Get one PayQueueJob
     * const payQueueJob = await prisma.payQueueJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayQueueJobFindFirstOrThrowArgs>(args?: SelectSubset<T, PayQueueJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayQueueJobClient<$Result.GetResult<Prisma.$PayQueueJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayQueueJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayQueueJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayQueueJobs
     * const payQueueJobs = await prisma.payQueueJob.findMany()
     * 
     * // Get first 10 PayQueueJobs
     * const payQueueJobs = await prisma.payQueueJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payQueueJobWithIdOnly = await prisma.payQueueJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayQueueJobFindManyArgs>(args?: SelectSubset<T, PayQueueJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayQueueJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayQueueJob.
     * @param {PayQueueJobCreateArgs} args - Arguments to create a PayQueueJob.
     * @example
     * // Create one PayQueueJob
     * const PayQueueJob = await prisma.payQueueJob.create({
     *   data: {
     *     // ... data to create a PayQueueJob
     *   }
     * })
     * 
     */
    create<T extends PayQueueJobCreateArgs>(args: SelectSubset<T, PayQueueJobCreateArgs<ExtArgs>>): Prisma__PayQueueJobClient<$Result.GetResult<Prisma.$PayQueueJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayQueueJobs.
     * @param {PayQueueJobCreateManyArgs} args - Arguments to create many PayQueueJobs.
     * @example
     * // Create many PayQueueJobs
     * const payQueueJob = await prisma.payQueueJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayQueueJobCreateManyArgs>(args?: SelectSubset<T, PayQueueJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayQueueJob.
     * @param {PayQueueJobDeleteArgs} args - Arguments to delete one PayQueueJob.
     * @example
     * // Delete one PayQueueJob
     * const PayQueueJob = await prisma.payQueueJob.delete({
     *   where: {
     *     // ... filter to delete one PayQueueJob
     *   }
     * })
     * 
     */
    delete<T extends PayQueueJobDeleteArgs>(args: SelectSubset<T, PayQueueJobDeleteArgs<ExtArgs>>): Prisma__PayQueueJobClient<$Result.GetResult<Prisma.$PayQueueJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayQueueJob.
     * @param {PayQueueJobUpdateArgs} args - Arguments to update one PayQueueJob.
     * @example
     * // Update one PayQueueJob
     * const payQueueJob = await prisma.payQueueJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayQueueJobUpdateArgs>(args: SelectSubset<T, PayQueueJobUpdateArgs<ExtArgs>>): Prisma__PayQueueJobClient<$Result.GetResult<Prisma.$PayQueueJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayQueueJobs.
     * @param {PayQueueJobDeleteManyArgs} args - Arguments to filter PayQueueJobs to delete.
     * @example
     * // Delete a few PayQueueJobs
     * const { count } = await prisma.payQueueJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayQueueJobDeleteManyArgs>(args?: SelectSubset<T, PayQueueJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayQueueJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayQueueJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayQueueJobs
     * const payQueueJob = await prisma.payQueueJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayQueueJobUpdateManyArgs>(args: SelectSubset<T, PayQueueJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayQueueJob.
     * @param {PayQueueJobUpsertArgs} args - Arguments to update or create a PayQueueJob.
     * @example
     * // Update or create a PayQueueJob
     * const payQueueJob = await prisma.payQueueJob.upsert({
     *   create: {
     *     // ... data to create a PayQueueJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayQueueJob we want to update
     *   }
     * })
     */
    upsert<T extends PayQueueJobUpsertArgs>(args: SelectSubset<T, PayQueueJobUpsertArgs<ExtArgs>>): Prisma__PayQueueJobClient<$Result.GetResult<Prisma.$PayQueueJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayQueueJobs that matches the filter.
     * @param {PayQueueJobFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payQueueJob = await prisma.payQueueJob.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayQueueJobFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayQueueJob.
     * @param {PayQueueJobAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payQueueJob = await prisma.payQueueJob.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayQueueJobAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayQueueJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayQueueJobCountArgs} args - Arguments to filter PayQueueJobs to count.
     * @example
     * // Count the number of PayQueueJobs
     * const count = await prisma.payQueueJob.count({
     *   where: {
     *     // ... the filter for the PayQueueJobs we want to count
     *   }
     * })
    **/
    count<T extends PayQueueJobCountArgs>(
      args?: Subset<T, PayQueueJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayQueueJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayQueueJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayQueueJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayQueueJobAggregateArgs>(args: Subset<T, PayQueueJobAggregateArgs>): Prisma.PrismaPromise<GetPayQueueJobAggregateType<T>>

    /**
     * Group by PayQueueJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayQueueJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayQueueJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayQueueJobGroupByArgs['orderBy'] }
        : { orderBy?: PayQueueJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayQueueJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayQueueJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayQueueJob model
   */
  readonly fields: PayQueueJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayQueueJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayQueueJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayQueueJob model
   */
  interface PayQueueJobFieldRefs {
    readonly id: FieldRef<"PayQueueJob", 'String'>
    readonly queueName: FieldRef<"PayQueueJob", 'String'>
    readonly jobType: FieldRef<"PayQueueJob", 'String'>
    readonly dedupKey: FieldRef<"PayQueueJob", 'String'>
    readonly payloadJson: FieldRef<"PayQueueJob", 'String'>
    readonly status: FieldRef<"PayQueueJob", 'String'>
    readonly attempts: FieldRef<"PayQueueJob", 'Int'>
    readonly maxAttempts: FieldRef<"PayQueueJob", 'Int'>
    readonly runAt: FieldRef<"PayQueueJob", 'DateTime'>
    readonly lockedBy: FieldRef<"PayQueueJob", 'String'>
    readonly lockedUntil: FieldRef<"PayQueueJob", 'DateTime'>
    readonly lastError: FieldRef<"PayQueueJob", 'String'>
    readonly completedAt: FieldRef<"PayQueueJob", 'DateTime'>
    readonly createdAt: FieldRef<"PayQueueJob", 'DateTime'>
    readonly updatedAt: FieldRef<"PayQueueJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayQueueJob findUnique
   */
  export type PayQueueJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayQueueJob
     */
    select?: PayQueueJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayQueueJob
     */
    omit?: PayQueueJobOmit<ExtArgs> | null
    /**
     * Filter, which PayQueueJob to fetch.
     */
    where: PayQueueJobWhereUniqueInput
  }

  /**
   * PayQueueJob findUniqueOrThrow
   */
  export type PayQueueJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayQueueJob
     */
    select?: PayQueueJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayQueueJob
     */
    omit?: PayQueueJobOmit<ExtArgs> | null
    /**
     * Filter, which PayQueueJob to fetch.
     */
    where: PayQueueJobWhereUniqueInput
  }

  /**
   * PayQueueJob findFirst
   */
  export type PayQueueJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayQueueJob
     */
    select?: PayQueueJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayQueueJob
     */
    omit?: PayQueueJobOmit<ExtArgs> | null
    /**
     * Filter, which PayQueueJob to fetch.
     */
    where?: PayQueueJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayQueueJobs to fetch.
     */
    orderBy?: PayQueueJobOrderByWithRelationInput | PayQueueJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayQueueJobs.
     */
    cursor?: PayQueueJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayQueueJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayQueueJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayQueueJobs.
     */
    distinct?: PayQueueJobScalarFieldEnum | PayQueueJobScalarFieldEnum[]
  }

  /**
   * PayQueueJob findFirstOrThrow
   */
  export type PayQueueJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayQueueJob
     */
    select?: PayQueueJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayQueueJob
     */
    omit?: PayQueueJobOmit<ExtArgs> | null
    /**
     * Filter, which PayQueueJob to fetch.
     */
    where?: PayQueueJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayQueueJobs to fetch.
     */
    orderBy?: PayQueueJobOrderByWithRelationInput | PayQueueJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayQueueJobs.
     */
    cursor?: PayQueueJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayQueueJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayQueueJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayQueueJobs.
     */
    distinct?: PayQueueJobScalarFieldEnum | PayQueueJobScalarFieldEnum[]
  }

  /**
   * PayQueueJob findMany
   */
  export type PayQueueJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayQueueJob
     */
    select?: PayQueueJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayQueueJob
     */
    omit?: PayQueueJobOmit<ExtArgs> | null
    /**
     * Filter, which PayQueueJobs to fetch.
     */
    where?: PayQueueJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayQueueJobs to fetch.
     */
    orderBy?: PayQueueJobOrderByWithRelationInput | PayQueueJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayQueueJobs.
     */
    cursor?: PayQueueJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayQueueJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayQueueJobs.
     */
    skip?: number
    distinct?: PayQueueJobScalarFieldEnum | PayQueueJobScalarFieldEnum[]
  }

  /**
   * PayQueueJob create
   */
  export type PayQueueJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayQueueJob
     */
    select?: PayQueueJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayQueueJob
     */
    omit?: PayQueueJobOmit<ExtArgs> | null
    /**
     * The data needed to create a PayQueueJob.
     */
    data: XOR<PayQueueJobCreateInput, PayQueueJobUncheckedCreateInput>
  }

  /**
   * PayQueueJob createMany
   */
  export type PayQueueJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayQueueJobs.
     */
    data: PayQueueJobCreateManyInput | PayQueueJobCreateManyInput[]
  }

  /**
   * PayQueueJob update
   */
  export type PayQueueJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayQueueJob
     */
    select?: PayQueueJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayQueueJob
     */
    omit?: PayQueueJobOmit<ExtArgs> | null
    /**
     * The data needed to update a PayQueueJob.
     */
    data: XOR<PayQueueJobUpdateInput, PayQueueJobUncheckedUpdateInput>
    /**
     * Choose, which PayQueueJob to update.
     */
    where: PayQueueJobWhereUniqueInput
  }

  /**
   * PayQueueJob updateMany
   */
  export type PayQueueJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayQueueJobs.
     */
    data: XOR<PayQueueJobUpdateManyMutationInput, PayQueueJobUncheckedUpdateManyInput>
    /**
     * Filter which PayQueueJobs to update
     */
    where?: PayQueueJobWhereInput
    /**
     * Limit how many PayQueueJobs to update.
     */
    limit?: number
  }

  /**
   * PayQueueJob upsert
   */
  export type PayQueueJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayQueueJob
     */
    select?: PayQueueJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayQueueJob
     */
    omit?: PayQueueJobOmit<ExtArgs> | null
    /**
     * The filter to search for the PayQueueJob to update in case it exists.
     */
    where: PayQueueJobWhereUniqueInput
    /**
     * In case the PayQueueJob found by the `where` argument doesn't exist, create a new PayQueueJob with this data.
     */
    create: XOR<PayQueueJobCreateInput, PayQueueJobUncheckedCreateInput>
    /**
     * In case the PayQueueJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayQueueJobUpdateInput, PayQueueJobUncheckedUpdateInput>
  }

  /**
   * PayQueueJob delete
   */
  export type PayQueueJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayQueueJob
     */
    select?: PayQueueJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayQueueJob
     */
    omit?: PayQueueJobOmit<ExtArgs> | null
    /**
     * Filter which PayQueueJob to delete.
     */
    where: PayQueueJobWhereUniqueInput
  }

  /**
   * PayQueueJob deleteMany
   */
  export type PayQueueJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayQueueJobs to delete
     */
    where?: PayQueueJobWhereInput
    /**
     * Limit how many PayQueueJobs to delete.
     */
    limit?: number
  }

  /**
   * PayQueueJob findRaw
   */
  export type PayQueueJobFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayQueueJob aggregateRaw
   */
  export type PayQueueJobAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayQueueJob without action
   */
  export type PayQueueJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayQueueJob
     */
    select?: PayQueueJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayQueueJob
     */
    omit?: PayQueueJobOmit<ExtArgs> | null
  }


  /**
   * Model PayRateLimitBucket
   */

  export type AggregatePayRateLimitBucket = {
    _count: PayRateLimitBucketCountAggregateOutputType | null
    _avg: PayRateLimitBucketAvgAggregateOutputType | null
    _sum: PayRateLimitBucketSumAggregateOutputType | null
    _min: PayRateLimitBucketMinAggregateOutputType | null
    _max: PayRateLimitBucketMaxAggregateOutputType | null
  }

  export type PayRateLimitBucketAvgAggregateOutputType = {
    count: number | null
  }

  export type PayRateLimitBucketSumAggregateOutputType = {
    count: number | null
  }

  export type PayRateLimitBucketMinAggregateOutputType = {
    id: string | null
    bucketKey: string | null
    count: number | null
    expiresAt: Date | null
  }

  export type PayRateLimitBucketMaxAggregateOutputType = {
    id: string | null
    bucketKey: string | null
    count: number | null
    expiresAt: Date | null
  }

  export type PayRateLimitBucketCountAggregateOutputType = {
    id: number
    bucketKey: number
    count: number
    expiresAt: number
    _all: number
  }


  export type PayRateLimitBucketAvgAggregateInputType = {
    count?: true
  }

  export type PayRateLimitBucketSumAggregateInputType = {
    count?: true
  }

  export type PayRateLimitBucketMinAggregateInputType = {
    id?: true
    bucketKey?: true
    count?: true
    expiresAt?: true
  }

  export type PayRateLimitBucketMaxAggregateInputType = {
    id?: true
    bucketKey?: true
    count?: true
    expiresAt?: true
  }

  export type PayRateLimitBucketCountAggregateInputType = {
    id?: true
    bucketKey?: true
    count?: true
    expiresAt?: true
    _all?: true
  }

  export type PayRateLimitBucketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayRateLimitBucket to aggregate.
     */
    where?: PayRateLimitBucketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayRateLimitBuckets to fetch.
     */
    orderBy?: PayRateLimitBucketOrderByWithRelationInput | PayRateLimitBucketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayRateLimitBucketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayRateLimitBuckets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayRateLimitBuckets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayRateLimitBuckets
    **/
    _count?: true | PayRateLimitBucketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayRateLimitBucketAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayRateLimitBucketSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayRateLimitBucketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayRateLimitBucketMaxAggregateInputType
  }

  export type GetPayRateLimitBucketAggregateType<T extends PayRateLimitBucketAggregateArgs> = {
        [P in keyof T & keyof AggregatePayRateLimitBucket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayRateLimitBucket[P]>
      : GetScalarType<T[P], AggregatePayRateLimitBucket[P]>
  }




  export type PayRateLimitBucketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayRateLimitBucketWhereInput
    orderBy?: PayRateLimitBucketOrderByWithAggregationInput | PayRateLimitBucketOrderByWithAggregationInput[]
    by: PayRateLimitBucketScalarFieldEnum[] | PayRateLimitBucketScalarFieldEnum
    having?: PayRateLimitBucketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayRateLimitBucketCountAggregateInputType | true
    _avg?: PayRateLimitBucketAvgAggregateInputType
    _sum?: PayRateLimitBucketSumAggregateInputType
    _min?: PayRateLimitBucketMinAggregateInputType
    _max?: PayRateLimitBucketMaxAggregateInputType
  }

  export type PayRateLimitBucketGroupByOutputType = {
    id: string
    bucketKey: string
    count: number
    expiresAt: Date
    _count: PayRateLimitBucketCountAggregateOutputType | null
    _avg: PayRateLimitBucketAvgAggregateOutputType | null
    _sum: PayRateLimitBucketSumAggregateOutputType | null
    _min: PayRateLimitBucketMinAggregateOutputType | null
    _max: PayRateLimitBucketMaxAggregateOutputType | null
  }

  type GetPayRateLimitBucketGroupByPayload<T extends PayRateLimitBucketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayRateLimitBucketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayRateLimitBucketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayRateLimitBucketGroupByOutputType[P]>
            : GetScalarType<T[P], PayRateLimitBucketGroupByOutputType[P]>
        }
      >
    >


  export type PayRateLimitBucketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bucketKey?: boolean
    count?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["payRateLimitBucket"]>



  export type PayRateLimitBucketSelectScalar = {
    id?: boolean
    bucketKey?: boolean
    count?: boolean
    expiresAt?: boolean
  }

  export type PayRateLimitBucketOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bucketKey" | "count" | "expiresAt", ExtArgs["result"]["payRateLimitBucket"]>

  export type $PayRateLimitBucketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayRateLimitBucket"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bucketKey: string
      count: number
      expiresAt: Date
    }, ExtArgs["result"]["payRateLimitBucket"]>
    composites: {}
  }

  type PayRateLimitBucketGetPayload<S extends boolean | null | undefined | PayRateLimitBucketDefaultArgs> = $Result.GetResult<Prisma.$PayRateLimitBucketPayload, S>

  type PayRateLimitBucketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayRateLimitBucketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayRateLimitBucketCountAggregateInputType | true
    }

  export interface PayRateLimitBucketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayRateLimitBucket'], meta: { name: 'PayRateLimitBucket' } }
    /**
     * Find zero or one PayRateLimitBucket that matches the filter.
     * @param {PayRateLimitBucketFindUniqueArgs} args - Arguments to find a PayRateLimitBucket
     * @example
     * // Get one PayRateLimitBucket
     * const payRateLimitBucket = await prisma.payRateLimitBucket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayRateLimitBucketFindUniqueArgs>(args: SelectSubset<T, PayRateLimitBucketFindUniqueArgs<ExtArgs>>): Prisma__PayRateLimitBucketClient<$Result.GetResult<Prisma.$PayRateLimitBucketPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayRateLimitBucket that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayRateLimitBucketFindUniqueOrThrowArgs} args - Arguments to find a PayRateLimitBucket
     * @example
     * // Get one PayRateLimitBucket
     * const payRateLimitBucket = await prisma.payRateLimitBucket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayRateLimitBucketFindUniqueOrThrowArgs>(args: SelectSubset<T, PayRateLimitBucketFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayRateLimitBucketClient<$Result.GetResult<Prisma.$PayRateLimitBucketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayRateLimitBucket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayRateLimitBucketFindFirstArgs} args - Arguments to find a PayRateLimitBucket
     * @example
     * // Get one PayRateLimitBucket
     * const payRateLimitBucket = await prisma.payRateLimitBucket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayRateLimitBucketFindFirstArgs>(args?: SelectSubset<T, PayRateLimitBucketFindFirstArgs<ExtArgs>>): Prisma__PayRateLimitBucketClient<$Result.GetResult<Prisma.$PayRateLimitBucketPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayRateLimitBucket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayRateLimitBucketFindFirstOrThrowArgs} args - Arguments to find a PayRateLimitBucket
     * @example
     * // Get one PayRateLimitBucket
     * const payRateLimitBucket = await prisma.payRateLimitBucket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayRateLimitBucketFindFirstOrThrowArgs>(args?: SelectSubset<T, PayRateLimitBucketFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayRateLimitBucketClient<$Result.GetResult<Prisma.$PayRateLimitBucketPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayRateLimitBuckets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayRateLimitBucketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayRateLimitBuckets
     * const payRateLimitBuckets = await prisma.payRateLimitBucket.findMany()
     * 
     * // Get first 10 PayRateLimitBuckets
     * const payRateLimitBuckets = await prisma.payRateLimitBucket.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payRateLimitBucketWithIdOnly = await prisma.payRateLimitBucket.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayRateLimitBucketFindManyArgs>(args?: SelectSubset<T, PayRateLimitBucketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayRateLimitBucketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayRateLimitBucket.
     * @param {PayRateLimitBucketCreateArgs} args - Arguments to create a PayRateLimitBucket.
     * @example
     * // Create one PayRateLimitBucket
     * const PayRateLimitBucket = await prisma.payRateLimitBucket.create({
     *   data: {
     *     // ... data to create a PayRateLimitBucket
     *   }
     * })
     * 
     */
    create<T extends PayRateLimitBucketCreateArgs>(args: SelectSubset<T, PayRateLimitBucketCreateArgs<ExtArgs>>): Prisma__PayRateLimitBucketClient<$Result.GetResult<Prisma.$PayRateLimitBucketPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayRateLimitBuckets.
     * @param {PayRateLimitBucketCreateManyArgs} args - Arguments to create many PayRateLimitBuckets.
     * @example
     * // Create many PayRateLimitBuckets
     * const payRateLimitBucket = await prisma.payRateLimitBucket.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayRateLimitBucketCreateManyArgs>(args?: SelectSubset<T, PayRateLimitBucketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayRateLimitBucket.
     * @param {PayRateLimitBucketDeleteArgs} args - Arguments to delete one PayRateLimitBucket.
     * @example
     * // Delete one PayRateLimitBucket
     * const PayRateLimitBucket = await prisma.payRateLimitBucket.delete({
     *   where: {
     *     // ... filter to delete one PayRateLimitBucket
     *   }
     * })
     * 
     */
    delete<T extends PayRateLimitBucketDeleteArgs>(args: SelectSubset<T, PayRateLimitBucketDeleteArgs<ExtArgs>>): Prisma__PayRateLimitBucketClient<$Result.GetResult<Prisma.$PayRateLimitBucketPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayRateLimitBucket.
     * @param {PayRateLimitBucketUpdateArgs} args - Arguments to update one PayRateLimitBucket.
     * @example
     * // Update one PayRateLimitBucket
     * const payRateLimitBucket = await prisma.payRateLimitBucket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayRateLimitBucketUpdateArgs>(args: SelectSubset<T, PayRateLimitBucketUpdateArgs<ExtArgs>>): Prisma__PayRateLimitBucketClient<$Result.GetResult<Prisma.$PayRateLimitBucketPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayRateLimitBuckets.
     * @param {PayRateLimitBucketDeleteManyArgs} args - Arguments to filter PayRateLimitBuckets to delete.
     * @example
     * // Delete a few PayRateLimitBuckets
     * const { count } = await prisma.payRateLimitBucket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayRateLimitBucketDeleteManyArgs>(args?: SelectSubset<T, PayRateLimitBucketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayRateLimitBuckets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayRateLimitBucketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayRateLimitBuckets
     * const payRateLimitBucket = await prisma.payRateLimitBucket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayRateLimitBucketUpdateManyArgs>(args: SelectSubset<T, PayRateLimitBucketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayRateLimitBucket.
     * @param {PayRateLimitBucketUpsertArgs} args - Arguments to update or create a PayRateLimitBucket.
     * @example
     * // Update or create a PayRateLimitBucket
     * const payRateLimitBucket = await prisma.payRateLimitBucket.upsert({
     *   create: {
     *     // ... data to create a PayRateLimitBucket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayRateLimitBucket we want to update
     *   }
     * })
     */
    upsert<T extends PayRateLimitBucketUpsertArgs>(args: SelectSubset<T, PayRateLimitBucketUpsertArgs<ExtArgs>>): Prisma__PayRateLimitBucketClient<$Result.GetResult<Prisma.$PayRateLimitBucketPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayRateLimitBuckets that matches the filter.
     * @param {PayRateLimitBucketFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payRateLimitBucket = await prisma.payRateLimitBucket.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayRateLimitBucketFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayRateLimitBucket.
     * @param {PayRateLimitBucketAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payRateLimitBucket = await prisma.payRateLimitBucket.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayRateLimitBucketAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayRateLimitBuckets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayRateLimitBucketCountArgs} args - Arguments to filter PayRateLimitBuckets to count.
     * @example
     * // Count the number of PayRateLimitBuckets
     * const count = await prisma.payRateLimitBucket.count({
     *   where: {
     *     // ... the filter for the PayRateLimitBuckets we want to count
     *   }
     * })
    **/
    count<T extends PayRateLimitBucketCountArgs>(
      args?: Subset<T, PayRateLimitBucketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayRateLimitBucketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayRateLimitBucket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayRateLimitBucketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayRateLimitBucketAggregateArgs>(args: Subset<T, PayRateLimitBucketAggregateArgs>): Prisma.PrismaPromise<GetPayRateLimitBucketAggregateType<T>>

    /**
     * Group by PayRateLimitBucket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayRateLimitBucketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayRateLimitBucketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayRateLimitBucketGroupByArgs['orderBy'] }
        : { orderBy?: PayRateLimitBucketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayRateLimitBucketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayRateLimitBucketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayRateLimitBucket model
   */
  readonly fields: PayRateLimitBucketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayRateLimitBucket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayRateLimitBucketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayRateLimitBucket model
   */
  interface PayRateLimitBucketFieldRefs {
    readonly id: FieldRef<"PayRateLimitBucket", 'String'>
    readonly bucketKey: FieldRef<"PayRateLimitBucket", 'String'>
    readonly count: FieldRef<"PayRateLimitBucket", 'Int'>
    readonly expiresAt: FieldRef<"PayRateLimitBucket", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayRateLimitBucket findUnique
   */
  export type PayRateLimitBucketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayRateLimitBucket
     */
    select?: PayRateLimitBucketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayRateLimitBucket
     */
    omit?: PayRateLimitBucketOmit<ExtArgs> | null
    /**
     * Filter, which PayRateLimitBucket to fetch.
     */
    where: PayRateLimitBucketWhereUniqueInput
  }

  /**
   * PayRateLimitBucket findUniqueOrThrow
   */
  export type PayRateLimitBucketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayRateLimitBucket
     */
    select?: PayRateLimitBucketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayRateLimitBucket
     */
    omit?: PayRateLimitBucketOmit<ExtArgs> | null
    /**
     * Filter, which PayRateLimitBucket to fetch.
     */
    where: PayRateLimitBucketWhereUniqueInput
  }

  /**
   * PayRateLimitBucket findFirst
   */
  export type PayRateLimitBucketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayRateLimitBucket
     */
    select?: PayRateLimitBucketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayRateLimitBucket
     */
    omit?: PayRateLimitBucketOmit<ExtArgs> | null
    /**
     * Filter, which PayRateLimitBucket to fetch.
     */
    where?: PayRateLimitBucketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayRateLimitBuckets to fetch.
     */
    orderBy?: PayRateLimitBucketOrderByWithRelationInput | PayRateLimitBucketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayRateLimitBuckets.
     */
    cursor?: PayRateLimitBucketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayRateLimitBuckets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayRateLimitBuckets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayRateLimitBuckets.
     */
    distinct?: PayRateLimitBucketScalarFieldEnum | PayRateLimitBucketScalarFieldEnum[]
  }

  /**
   * PayRateLimitBucket findFirstOrThrow
   */
  export type PayRateLimitBucketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayRateLimitBucket
     */
    select?: PayRateLimitBucketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayRateLimitBucket
     */
    omit?: PayRateLimitBucketOmit<ExtArgs> | null
    /**
     * Filter, which PayRateLimitBucket to fetch.
     */
    where?: PayRateLimitBucketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayRateLimitBuckets to fetch.
     */
    orderBy?: PayRateLimitBucketOrderByWithRelationInput | PayRateLimitBucketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayRateLimitBuckets.
     */
    cursor?: PayRateLimitBucketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayRateLimitBuckets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayRateLimitBuckets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayRateLimitBuckets.
     */
    distinct?: PayRateLimitBucketScalarFieldEnum | PayRateLimitBucketScalarFieldEnum[]
  }

  /**
   * PayRateLimitBucket findMany
   */
  export type PayRateLimitBucketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayRateLimitBucket
     */
    select?: PayRateLimitBucketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayRateLimitBucket
     */
    omit?: PayRateLimitBucketOmit<ExtArgs> | null
    /**
     * Filter, which PayRateLimitBuckets to fetch.
     */
    where?: PayRateLimitBucketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayRateLimitBuckets to fetch.
     */
    orderBy?: PayRateLimitBucketOrderByWithRelationInput | PayRateLimitBucketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayRateLimitBuckets.
     */
    cursor?: PayRateLimitBucketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayRateLimitBuckets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayRateLimitBuckets.
     */
    skip?: number
    distinct?: PayRateLimitBucketScalarFieldEnum | PayRateLimitBucketScalarFieldEnum[]
  }

  /**
   * PayRateLimitBucket create
   */
  export type PayRateLimitBucketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayRateLimitBucket
     */
    select?: PayRateLimitBucketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayRateLimitBucket
     */
    omit?: PayRateLimitBucketOmit<ExtArgs> | null
    /**
     * The data needed to create a PayRateLimitBucket.
     */
    data: XOR<PayRateLimitBucketCreateInput, PayRateLimitBucketUncheckedCreateInput>
  }

  /**
   * PayRateLimitBucket createMany
   */
  export type PayRateLimitBucketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayRateLimitBuckets.
     */
    data: PayRateLimitBucketCreateManyInput | PayRateLimitBucketCreateManyInput[]
  }

  /**
   * PayRateLimitBucket update
   */
  export type PayRateLimitBucketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayRateLimitBucket
     */
    select?: PayRateLimitBucketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayRateLimitBucket
     */
    omit?: PayRateLimitBucketOmit<ExtArgs> | null
    /**
     * The data needed to update a PayRateLimitBucket.
     */
    data: XOR<PayRateLimitBucketUpdateInput, PayRateLimitBucketUncheckedUpdateInput>
    /**
     * Choose, which PayRateLimitBucket to update.
     */
    where: PayRateLimitBucketWhereUniqueInput
  }

  /**
   * PayRateLimitBucket updateMany
   */
  export type PayRateLimitBucketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayRateLimitBuckets.
     */
    data: XOR<PayRateLimitBucketUpdateManyMutationInput, PayRateLimitBucketUncheckedUpdateManyInput>
    /**
     * Filter which PayRateLimitBuckets to update
     */
    where?: PayRateLimitBucketWhereInput
    /**
     * Limit how many PayRateLimitBuckets to update.
     */
    limit?: number
  }

  /**
   * PayRateLimitBucket upsert
   */
  export type PayRateLimitBucketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayRateLimitBucket
     */
    select?: PayRateLimitBucketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayRateLimitBucket
     */
    omit?: PayRateLimitBucketOmit<ExtArgs> | null
    /**
     * The filter to search for the PayRateLimitBucket to update in case it exists.
     */
    where: PayRateLimitBucketWhereUniqueInput
    /**
     * In case the PayRateLimitBucket found by the `where` argument doesn't exist, create a new PayRateLimitBucket with this data.
     */
    create: XOR<PayRateLimitBucketCreateInput, PayRateLimitBucketUncheckedCreateInput>
    /**
     * In case the PayRateLimitBucket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayRateLimitBucketUpdateInput, PayRateLimitBucketUncheckedUpdateInput>
  }

  /**
   * PayRateLimitBucket delete
   */
  export type PayRateLimitBucketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayRateLimitBucket
     */
    select?: PayRateLimitBucketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayRateLimitBucket
     */
    omit?: PayRateLimitBucketOmit<ExtArgs> | null
    /**
     * Filter which PayRateLimitBucket to delete.
     */
    where: PayRateLimitBucketWhereUniqueInput
  }

  /**
   * PayRateLimitBucket deleteMany
   */
  export type PayRateLimitBucketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayRateLimitBuckets to delete
     */
    where?: PayRateLimitBucketWhereInput
    /**
     * Limit how many PayRateLimitBuckets to delete.
     */
    limit?: number
  }

  /**
   * PayRateLimitBucket findRaw
   */
  export type PayRateLimitBucketFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayRateLimitBucket aggregateRaw
   */
  export type PayRateLimitBucketAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayRateLimitBucket without action
   */
  export type PayRateLimitBucketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayRateLimitBucket
     */
    select?: PayRateLimitBucketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayRateLimitBucket
     */
    omit?: PayRateLimitBucketOmit<ExtArgs> | null
  }


  /**
   * Model PayDailyProbeCounter
   */

  export type AggregatePayDailyProbeCounter = {
    _count: PayDailyProbeCounterCountAggregateOutputType | null
    _avg: PayDailyProbeCounterAvgAggregateOutputType | null
    _sum: PayDailyProbeCounterSumAggregateOutputType | null
    _min: PayDailyProbeCounterMinAggregateOutputType | null
    _max: PayDailyProbeCounterMaxAggregateOutputType | null
  }

  export type PayDailyProbeCounterAvgAggregateOutputType = {
    count: number | null
  }

  export type PayDailyProbeCounterSumAggregateOutputType = {
    count: number | null
  }

  export type PayDailyProbeCounterMinAggregateOutputType = {
    id: string | null
    dayKey: string | null
    count: number | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type PayDailyProbeCounterMaxAggregateOutputType = {
    id: string | null
    dayKey: string | null
    count: number | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type PayDailyProbeCounterCountAggregateOutputType = {
    id: number
    dayKey: number
    count: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type PayDailyProbeCounterAvgAggregateInputType = {
    count?: true
  }

  export type PayDailyProbeCounterSumAggregateInputType = {
    count?: true
  }

  export type PayDailyProbeCounterMinAggregateInputType = {
    id?: true
    dayKey?: true
    count?: true
    updatedAt?: true
    createdAt?: true
  }

  export type PayDailyProbeCounterMaxAggregateInputType = {
    id?: true
    dayKey?: true
    count?: true
    updatedAt?: true
    createdAt?: true
  }

  export type PayDailyProbeCounterCountAggregateInputType = {
    id?: true
    dayKey?: true
    count?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PayDailyProbeCounterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayDailyProbeCounter to aggregate.
     */
    where?: PayDailyProbeCounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayDailyProbeCounters to fetch.
     */
    orderBy?: PayDailyProbeCounterOrderByWithRelationInput | PayDailyProbeCounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayDailyProbeCounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayDailyProbeCounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayDailyProbeCounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayDailyProbeCounters
    **/
    _count?: true | PayDailyProbeCounterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayDailyProbeCounterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayDailyProbeCounterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayDailyProbeCounterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayDailyProbeCounterMaxAggregateInputType
  }

  export type GetPayDailyProbeCounterAggregateType<T extends PayDailyProbeCounterAggregateArgs> = {
        [P in keyof T & keyof AggregatePayDailyProbeCounter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayDailyProbeCounter[P]>
      : GetScalarType<T[P], AggregatePayDailyProbeCounter[P]>
  }




  export type PayDailyProbeCounterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayDailyProbeCounterWhereInput
    orderBy?: PayDailyProbeCounterOrderByWithAggregationInput | PayDailyProbeCounterOrderByWithAggregationInput[]
    by: PayDailyProbeCounterScalarFieldEnum[] | PayDailyProbeCounterScalarFieldEnum
    having?: PayDailyProbeCounterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayDailyProbeCounterCountAggregateInputType | true
    _avg?: PayDailyProbeCounterAvgAggregateInputType
    _sum?: PayDailyProbeCounterSumAggregateInputType
    _min?: PayDailyProbeCounterMinAggregateInputType
    _max?: PayDailyProbeCounterMaxAggregateInputType
  }

  export type PayDailyProbeCounterGroupByOutputType = {
    id: string
    dayKey: string
    count: number
    updatedAt: Date
    createdAt: Date
    _count: PayDailyProbeCounterCountAggregateOutputType | null
    _avg: PayDailyProbeCounterAvgAggregateOutputType | null
    _sum: PayDailyProbeCounterSumAggregateOutputType | null
    _min: PayDailyProbeCounterMinAggregateOutputType | null
    _max: PayDailyProbeCounterMaxAggregateOutputType | null
  }

  type GetPayDailyProbeCounterGroupByPayload<T extends PayDailyProbeCounterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayDailyProbeCounterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayDailyProbeCounterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayDailyProbeCounterGroupByOutputType[P]>
            : GetScalarType<T[P], PayDailyProbeCounterGroupByOutputType[P]>
        }
      >
    >


  export type PayDailyProbeCounterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dayKey?: boolean
    count?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["payDailyProbeCounter"]>



  export type PayDailyProbeCounterSelectScalar = {
    id?: boolean
    dayKey?: boolean
    count?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }

  export type PayDailyProbeCounterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dayKey" | "count" | "updatedAt" | "createdAt", ExtArgs["result"]["payDailyProbeCounter"]>

  export type $PayDailyProbeCounterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayDailyProbeCounter"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dayKey: string
      count: number
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["payDailyProbeCounter"]>
    composites: {}
  }

  type PayDailyProbeCounterGetPayload<S extends boolean | null | undefined | PayDailyProbeCounterDefaultArgs> = $Result.GetResult<Prisma.$PayDailyProbeCounterPayload, S>

  type PayDailyProbeCounterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayDailyProbeCounterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayDailyProbeCounterCountAggregateInputType | true
    }

  export interface PayDailyProbeCounterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayDailyProbeCounter'], meta: { name: 'PayDailyProbeCounter' } }
    /**
     * Find zero or one PayDailyProbeCounter that matches the filter.
     * @param {PayDailyProbeCounterFindUniqueArgs} args - Arguments to find a PayDailyProbeCounter
     * @example
     * // Get one PayDailyProbeCounter
     * const payDailyProbeCounter = await prisma.payDailyProbeCounter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayDailyProbeCounterFindUniqueArgs>(args: SelectSubset<T, PayDailyProbeCounterFindUniqueArgs<ExtArgs>>): Prisma__PayDailyProbeCounterClient<$Result.GetResult<Prisma.$PayDailyProbeCounterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayDailyProbeCounter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayDailyProbeCounterFindUniqueOrThrowArgs} args - Arguments to find a PayDailyProbeCounter
     * @example
     * // Get one PayDailyProbeCounter
     * const payDailyProbeCounter = await prisma.payDailyProbeCounter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayDailyProbeCounterFindUniqueOrThrowArgs>(args: SelectSubset<T, PayDailyProbeCounterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayDailyProbeCounterClient<$Result.GetResult<Prisma.$PayDailyProbeCounterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayDailyProbeCounter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDailyProbeCounterFindFirstArgs} args - Arguments to find a PayDailyProbeCounter
     * @example
     * // Get one PayDailyProbeCounter
     * const payDailyProbeCounter = await prisma.payDailyProbeCounter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayDailyProbeCounterFindFirstArgs>(args?: SelectSubset<T, PayDailyProbeCounterFindFirstArgs<ExtArgs>>): Prisma__PayDailyProbeCounterClient<$Result.GetResult<Prisma.$PayDailyProbeCounterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayDailyProbeCounter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDailyProbeCounterFindFirstOrThrowArgs} args - Arguments to find a PayDailyProbeCounter
     * @example
     * // Get one PayDailyProbeCounter
     * const payDailyProbeCounter = await prisma.payDailyProbeCounter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayDailyProbeCounterFindFirstOrThrowArgs>(args?: SelectSubset<T, PayDailyProbeCounterFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayDailyProbeCounterClient<$Result.GetResult<Prisma.$PayDailyProbeCounterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayDailyProbeCounters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDailyProbeCounterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayDailyProbeCounters
     * const payDailyProbeCounters = await prisma.payDailyProbeCounter.findMany()
     * 
     * // Get first 10 PayDailyProbeCounters
     * const payDailyProbeCounters = await prisma.payDailyProbeCounter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payDailyProbeCounterWithIdOnly = await prisma.payDailyProbeCounter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayDailyProbeCounterFindManyArgs>(args?: SelectSubset<T, PayDailyProbeCounterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayDailyProbeCounterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayDailyProbeCounter.
     * @param {PayDailyProbeCounterCreateArgs} args - Arguments to create a PayDailyProbeCounter.
     * @example
     * // Create one PayDailyProbeCounter
     * const PayDailyProbeCounter = await prisma.payDailyProbeCounter.create({
     *   data: {
     *     // ... data to create a PayDailyProbeCounter
     *   }
     * })
     * 
     */
    create<T extends PayDailyProbeCounterCreateArgs>(args: SelectSubset<T, PayDailyProbeCounterCreateArgs<ExtArgs>>): Prisma__PayDailyProbeCounterClient<$Result.GetResult<Prisma.$PayDailyProbeCounterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayDailyProbeCounters.
     * @param {PayDailyProbeCounterCreateManyArgs} args - Arguments to create many PayDailyProbeCounters.
     * @example
     * // Create many PayDailyProbeCounters
     * const payDailyProbeCounter = await prisma.payDailyProbeCounter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayDailyProbeCounterCreateManyArgs>(args?: SelectSubset<T, PayDailyProbeCounterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayDailyProbeCounter.
     * @param {PayDailyProbeCounterDeleteArgs} args - Arguments to delete one PayDailyProbeCounter.
     * @example
     * // Delete one PayDailyProbeCounter
     * const PayDailyProbeCounter = await prisma.payDailyProbeCounter.delete({
     *   where: {
     *     // ... filter to delete one PayDailyProbeCounter
     *   }
     * })
     * 
     */
    delete<T extends PayDailyProbeCounterDeleteArgs>(args: SelectSubset<T, PayDailyProbeCounterDeleteArgs<ExtArgs>>): Prisma__PayDailyProbeCounterClient<$Result.GetResult<Prisma.$PayDailyProbeCounterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayDailyProbeCounter.
     * @param {PayDailyProbeCounterUpdateArgs} args - Arguments to update one PayDailyProbeCounter.
     * @example
     * // Update one PayDailyProbeCounter
     * const payDailyProbeCounter = await prisma.payDailyProbeCounter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayDailyProbeCounterUpdateArgs>(args: SelectSubset<T, PayDailyProbeCounterUpdateArgs<ExtArgs>>): Prisma__PayDailyProbeCounterClient<$Result.GetResult<Prisma.$PayDailyProbeCounterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayDailyProbeCounters.
     * @param {PayDailyProbeCounterDeleteManyArgs} args - Arguments to filter PayDailyProbeCounters to delete.
     * @example
     * // Delete a few PayDailyProbeCounters
     * const { count } = await prisma.payDailyProbeCounter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayDailyProbeCounterDeleteManyArgs>(args?: SelectSubset<T, PayDailyProbeCounterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayDailyProbeCounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDailyProbeCounterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayDailyProbeCounters
     * const payDailyProbeCounter = await prisma.payDailyProbeCounter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayDailyProbeCounterUpdateManyArgs>(args: SelectSubset<T, PayDailyProbeCounterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayDailyProbeCounter.
     * @param {PayDailyProbeCounterUpsertArgs} args - Arguments to update or create a PayDailyProbeCounter.
     * @example
     * // Update or create a PayDailyProbeCounter
     * const payDailyProbeCounter = await prisma.payDailyProbeCounter.upsert({
     *   create: {
     *     // ... data to create a PayDailyProbeCounter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayDailyProbeCounter we want to update
     *   }
     * })
     */
    upsert<T extends PayDailyProbeCounterUpsertArgs>(args: SelectSubset<T, PayDailyProbeCounterUpsertArgs<ExtArgs>>): Prisma__PayDailyProbeCounterClient<$Result.GetResult<Prisma.$PayDailyProbeCounterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayDailyProbeCounters that matches the filter.
     * @param {PayDailyProbeCounterFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payDailyProbeCounter = await prisma.payDailyProbeCounter.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayDailyProbeCounterFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayDailyProbeCounter.
     * @param {PayDailyProbeCounterAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payDailyProbeCounter = await prisma.payDailyProbeCounter.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayDailyProbeCounterAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayDailyProbeCounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDailyProbeCounterCountArgs} args - Arguments to filter PayDailyProbeCounters to count.
     * @example
     * // Count the number of PayDailyProbeCounters
     * const count = await prisma.payDailyProbeCounter.count({
     *   where: {
     *     // ... the filter for the PayDailyProbeCounters we want to count
     *   }
     * })
    **/
    count<T extends PayDailyProbeCounterCountArgs>(
      args?: Subset<T, PayDailyProbeCounterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayDailyProbeCounterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayDailyProbeCounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDailyProbeCounterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayDailyProbeCounterAggregateArgs>(args: Subset<T, PayDailyProbeCounterAggregateArgs>): Prisma.PrismaPromise<GetPayDailyProbeCounterAggregateType<T>>

    /**
     * Group by PayDailyProbeCounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayDailyProbeCounterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayDailyProbeCounterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayDailyProbeCounterGroupByArgs['orderBy'] }
        : { orderBy?: PayDailyProbeCounterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayDailyProbeCounterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayDailyProbeCounterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayDailyProbeCounter model
   */
  readonly fields: PayDailyProbeCounterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayDailyProbeCounter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayDailyProbeCounterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayDailyProbeCounter model
   */
  interface PayDailyProbeCounterFieldRefs {
    readonly id: FieldRef<"PayDailyProbeCounter", 'String'>
    readonly dayKey: FieldRef<"PayDailyProbeCounter", 'String'>
    readonly count: FieldRef<"PayDailyProbeCounter", 'Int'>
    readonly updatedAt: FieldRef<"PayDailyProbeCounter", 'DateTime'>
    readonly createdAt: FieldRef<"PayDailyProbeCounter", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayDailyProbeCounter findUnique
   */
  export type PayDailyProbeCounterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDailyProbeCounter
     */
    select?: PayDailyProbeCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDailyProbeCounter
     */
    omit?: PayDailyProbeCounterOmit<ExtArgs> | null
    /**
     * Filter, which PayDailyProbeCounter to fetch.
     */
    where: PayDailyProbeCounterWhereUniqueInput
  }

  /**
   * PayDailyProbeCounter findUniqueOrThrow
   */
  export type PayDailyProbeCounterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDailyProbeCounter
     */
    select?: PayDailyProbeCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDailyProbeCounter
     */
    omit?: PayDailyProbeCounterOmit<ExtArgs> | null
    /**
     * Filter, which PayDailyProbeCounter to fetch.
     */
    where: PayDailyProbeCounterWhereUniqueInput
  }

  /**
   * PayDailyProbeCounter findFirst
   */
  export type PayDailyProbeCounterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDailyProbeCounter
     */
    select?: PayDailyProbeCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDailyProbeCounter
     */
    omit?: PayDailyProbeCounterOmit<ExtArgs> | null
    /**
     * Filter, which PayDailyProbeCounter to fetch.
     */
    where?: PayDailyProbeCounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayDailyProbeCounters to fetch.
     */
    orderBy?: PayDailyProbeCounterOrderByWithRelationInput | PayDailyProbeCounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayDailyProbeCounters.
     */
    cursor?: PayDailyProbeCounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayDailyProbeCounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayDailyProbeCounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayDailyProbeCounters.
     */
    distinct?: PayDailyProbeCounterScalarFieldEnum | PayDailyProbeCounterScalarFieldEnum[]
  }

  /**
   * PayDailyProbeCounter findFirstOrThrow
   */
  export type PayDailyProbeCounterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDailyProbeCounter
     */
    select?: PayDailyProbeCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDailyProbeCounter
     */
    omit?: PayDailyProbeCounterOmit<ExtArgs> | null
    /**
     * Filter, which PayDailyProbeCounter to fetch.
     */
    where?: PayDailyProbeCounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayDailyProbeCounters to fetch.
     */
    orderBy?: PayDailyProbeCounterOrderByWithRelationInput | PayDailyProbeCounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayDailyProbeCounters.
     */
    cursor?: PayDailyProbeCounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayDailyProbeCounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayDailyProbeCounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayDailyProbeCounters.
     */
    distinct?: PayDailyProbeCounterScalarFieldEnum | PayDailyProbeCounterScalarFieldEnum[]
  }

  /**
   * PayDailyProbeCounter findMany
   */
  export type PayDailyProbeCounterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDailyProbeCounter
     */
    select?: PayDailyProbeCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDailyProbeCounter
     */
    omit?: PayDailyProbeCounterOmit<ExtArgs> | null
    /**
     * Filter, which PayDailyProbeCounters to fetch.
     */
    where?: PayDailyProbeCounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayDailyProbeCounters to fetch.
     */
    orderBy?: PayDailyProbeCounterOrderByWithRelationInput | PayDailyProbeCounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayDailyProbeCounters.
     */
    cursor?: PayDailyProbeCounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayDailyProbeCounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayDailyProbeCounters.
     */
    skip?: number
    distinct?: PayDailyProbeCounterScalarFieldEnum | PayDailyProbeCounterScalarFieldEnum[]
  }

  /**
   * PayDailyProbeCounter create
   */
  export type PayDailyProbeCounterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDailyProbeCounter
     */
    select?: PayDailyProbeCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDailyProbeCounter
     */
    omit?: PayDailyProbeCounterOmit<ExtArgs> | null
    /**
     * The data needed to create a PayDailyProbeCounter.
     */
    data: XOR<PayDailyProbeCounterCreateInput, PayDailyProbeCounterUncheckedCreateInput>
  }

  /**
   * PayDailyProbeCounter createMany
   */
  export type PayDailyProbeCounterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayDailyProbeCounters.
     */
    data: PayDailyProbeCounterCreateManyInput | PayDailyProbeCounterCreateManyInput[]
  }

  /**
   * PayDailyProbeCounter update
   */
  export type PayDailyProbeCounterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDailyProbeCounter
     */
    select?: PayDailyProbeCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDailyProbeCounter
     */
    omit?: PayDailyProbeCounterOmit<ExtArgs> | null
    /**
     * The data needed to update a PayDailyProbeCounter.
     */
    data: XOR<PayDailyProbeCounterUpdateInput, PayDailyProbeCounterUncheckedUpdateInput>
    /**
     * Choose, which PayDailyProbeCounter to update.
     */
    where: PayDailyProbeCounterWhereUniqueInput
  }

  /**
   * PayDailyProbeCounter updateMany
   */
  export type PayDailyProbeCounterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayDailyProbeCounters.
     */
    data: XOR<PayDailyProbeCounterUpdateManyMutationInput, PayDailyProbeCounterUncheckedUpdateManyInput>
    /**
     * Filter which PayDailyProbeCounters to update
     */
    where?: PayDailyProbeCounterWhereInput
    /**
     * Limit how many PayDailyProbeCounters to update.
     */
    limit?: number
  }

  /**
   * PayDailyProbeCounter upsert
   */
  export type PayDailyProbeCounterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDailyProbeCounter
     */
    select?: PayDailyProbeCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDailyProbeCounter
     */
    omit?: PayDailyProbeCounterOmit<ExtArgs> | null
    /**
     * The filter to search for the PayDailyProbeCounter to update in case it exists.
     */
    where: PayDailyProbeCounterWhereUniqueInput
    /**
     * In case the PayDailyProbeCounter found by the `where` argument doesn't exist, create a new PayDailyProbeCounter with this data.
     */
    create: XOR<PayDailyProbeCounterCreateInput, PayDailyProbeCounterUncheckedCreateInput>
    /**
     * In case the PayDailyProbeCounter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayDailyProbeCounterUpdateInput, PayDailyProbeCounterUncheckedUpdateInput>
  }

  /**
   * PayDailyProbeCounter delete
   */
  export type PayDailyProbeCounterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDailyProbeCounter
     */
    select?: PayDailyProbeCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDailyProbeCounter
     */
    omit?: PayDailyProbeCounterOmit<ExtArgs> | null
    /**
     * Filter which PayDailyProbeCounter to delete.
     */
    where: PayDailyProbeCounterWhereUniqueInput
  }

  /**
   * PayDailyProbeCounter deleteMany
   */
  export type PayDailyProbeCounterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayDailyProbeCounters to delete
     */
    where?: PayDailyProbeCounterWhereInput
    /**
     * Limit how many PayDailyProbeCounters to delete.
     */
    limit?: number
  }

  /**
   * PayDailyProbeCounter findRaw
   */
  export type PayDailyProbeCounterFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayDailyProbeCounter aggregateRaw
   */
  export type PayDailyProbeCounterAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayDailyProbeCounter without action
   */
  export type PayDailyProbeCounterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayDailyProbeCounter
     */
    select?: PayDailyProbeCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayDailyProbeCounter
     */
    omit?: PayDailyProbeCounterOmit<ExtArgs> | null
  }


  /**
   * Model PayMigration
   */

  export type AggregatePayMigration = {
    _count: PayMigrationCountAggregateOutputType | null
    _min: PayMigrationMinAggregateOutputType | null
    _max: PayMigrationMaxAggregateOutputType | null
  }

  export type PayMigrationMinAggregateOutputType = {
    id: string | null
    version: string | null
    name: string | null
    appliedAt: Date | null
  }

  export type PayMigrationMaxAggregateOutputType = {
    id: string | null
    version: string | null
    name: string | null
    appliedAt: Date | null
  }

  export type PayMigrationCountAggregateOutputType = {
    id: number
    version: number
    name: number
    appliedAt: number
    _all: number
  }


  export type PayMigrationMinAggregateInputType = {
    id?: true
    version?: true
    name?: true
    appliedAt?: true
  }

  export type PayMigrationMaxAggregateInputType = {
    id?: true
    version?: true
    name?: true
    appliedAt?: true
  }

  export type PayMigrationCountAggregateInputType = {
    id?: true
    version?: true
    name?: true
    appliedAt?: true
    _all?: true
  }

  export type PayMigrationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayMigration to aggregate.
     */
    where?: PayMigrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayMigrations to fetch.
     */
    orderBy?: PayMigrationOrderByWithRelationInput | PayMigrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayMigrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayMigrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayMigrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayMigrations
    **/
    _count?: true | PayMigrationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayMigrationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayMigrationMaxAggregateInputType
  }

  export type GetPayMigrationAggregateType<T extends PayMigrationAggregateArgs> = {
        [P in keyof T & keyof AggregatePayMigration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayMigration[P]>
      : GetScalarType<T[P], AggregatePayMigration[P]>
  }




  export type PayMigrationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayMigrationWhereInput
    orderBy?: PayMigrationOrderByWithAggregationInput | PayMigrationOrderByWithAggregationInput[]
    by: PayMigrationScalarFieldEnum[] | PayMigrationScalarFieldEnum
    having?: PayMigrationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayMigrationCountAggregateInputType | true
    _min?: PayMigrationMinAggregateInputType
    _max?: PayMigrationMaxAggregateInputType
  }

  export type PayMigrationGroupByOutputType = {
    id: string
    version: string
    name: string
    appliedAt: Date
    _count: PayMigrationCountAggregateOutputType | null
    _min: PayMigrationMinAggregateOutputType | null
    _max: PayMigrationMaxAggregateOutputType | null
  }

  type GetPayMigrationGroupByPayload<T extends PayMigrationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayMigrationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayMigrationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayMigrationGroupByOutputType[P]>
            : GetScalarType<T[P], PayMigrationGroupByOutputType[P]>
        }
      >
    >


  export type PayMigrationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    version?: boolean
    name?: boolean
    appliedAt?: boolean
  }, ExtArgs["result"]["payMigration"]>



  export type PayMigrationSelectScalar = {
    id?: boolean
    version?: boolean
    name?: boolean
    appliedAt?: boolean
  }

  export type PayMigrationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "version" | "name" | "appliedAt", ExtArgs["result"]["payMigration"]>

  export type $PayMigrationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayMigration"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      version: string
      name: string
      appliedAt: Date
    }, ExtArgs["result"]["payMigration"]>
    composites: {}
  }

  type PayMigrationGetPayload<S extends boolean | null | undefined | PayMigrationDefaultArgs> = $Result.GetResult<Prisma.$PayMigrationPayload, S>

  type PayMigrationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayMigrationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayMigrationCountAggregateInputType | true
    }

  export interface PayMigrationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayMigration'], meta: { name: 'PayMigration' } }
    /**
     * Find zero or one PayMigration that matches the filter.
     * @param {PayMigrationFindUniqueArgs} args - Arguments to find a PayMigration
     * @example
     * // Get one PayMigration
     * const payMigration = await prisma.payMigration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayMigrationFindUniqueArgs>(args: SelectSubset<T, PayMigrationFindUniqueArgs<ExtArgs>>): Prisma__PayMigrationClient<$Result.GetResult<Prisma.$PayMigrationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayMigration that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayMigrationFindUniqueOrThrowArgs} args - Arguments to find a PayMigration
     * @example
     * // Get one PayMigration
     * const payMigration = await prisma.payMigration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayMigrationFindUniqueOrThrowArgs>(args: SelectSubset<T, PayMigrationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayMigrationClient<$Result.GetResult<Prisma.$PayMigrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayMigration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayMigrationFindFirstArgs} args - Arguments to find a PayMigration
     * @example
     * // Get one PayMigration
     * const payMigration = await prisma.payMigration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayMigrationFindFirstArgs>(args?: SelectSubset<T, PayMigrationFindFirstArgs<ExtArgs>>): Prisma__PayMigrationClient<$Result.GetResult<Prisma.$PayMigrationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayMigration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayMigrationFindFirstOrThrowArgs} args - Arguments to find a PayMigration
     * @example
     * // Get one PayMigration
     * const payMigration = await prisma.payMigration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayMigrationFindFirstOrThrowArgs>(args?: SelectSubset<T, PayMigrationFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayMigrationClient<$Result.GetResult<Prisma.$PayMigrationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayMigrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayMigrationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayMigrations
     * const payMigrations = await prisma.payMigration.findMany()
     * 
     * // Get first 10 PayMigrations
     * const payMigrations = await prisma.payMigration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payMigrationWithIdOnly = await prisma.payMigration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayMigrationFindManyArgs>(args?: SelectSubset<T, PayMigrationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayMigrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayMigration.
     * @param {PayMigrationCreateArgs} args - Arguments to create a PayMigration.
     * @example
     * // Create one PayMigration
     * const PayMigration = await prisma.payMigration.create({
     *   data: {
     *     // ... data to create a PayMigration
     *   }
     * })
     * 
     */
    create<T extends PayMigrationCreateArgs>(args: SelectSubset<T, PayMigrationCreateArgs<ExtArgs>>): Prisma__PayMigrationClient<$Result.GetResult<Prisma.$PayMigrationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayMigrations.
     * @param {PayMigrationCreateManyArgs} args - Arguments to create many PayMigrations.
     * @example
     * // Create many PayMigrations
     * const payMigration = await prisma.payMigration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayMigrationCreateManyArgs>(args?: SelectSubset<T, PayMigrationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayMigration.
     * @param {PayMigrationDeleteArgs} args - Arguments to delete one PayMigration.
     * @example
     * // Delete one PayMigration
     * const PayMigration = await prisma.payMigration.delete({
     *   where: {
     *     // ... filter to delete one PayMigration
     *   }
     * })
     * 
     */
    delete<T extends PayMigrationDeleteArgs>(args: SelectSubset<T, PayMigrationDeleteArgs<ExtArgs>>): Prisma__PayMigrationClient<$Result.GetResult<Prisma.$PayMigrationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayMigration.
     * @param {PayMigrationUpdateArgs} args - Arguments to update one PayMigration.
     * @example
     * // Update one PayMigration
     * const payMigration = await prisma.payMigration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayMigrationUpdateArgs>(args: SelectSubset<T, PayMigrationUpdateArgs<ExtArgs>>): Prisma__PayMigrationClient<$Result.GetResult<Prisma.$PayMigrationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayMigrations.
     * @param {PayMigrationDeleteManyArgs} args - Arguments to filter PayMigrations to delete.
     * @example
     * // Delete a few PayMigrations
     * const { count } = await prisma.payMigration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayMigrationDeleteManyArgs>(args?: SelectSubset<T, PayMigrationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayMigrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayMigrationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayMigrations
     * const payMigration = await prisma.payMigration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayMigrationUpdateManyArgs>(args: SelectSubset<T, PayMigrationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayMigration.
     * @param {PayMigrationUpsertArgs} args - Arguments to update or create a PayMigration.
     * @example
     * // Update or create a PayMigration
     * const payMigration = await prisma.payMigration.upsert({
     *   create: {
     *     // ... data to create a PayMigration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayMigration we want to update
     *   }
     * })
     */
    upsert<T extends PayMigrationUpsertArgs>(args: SelectSubset<T, PayMigrationUpsertArgs<ExtArgs>>): Prisma__PayMigrationClient<$Result.GetResult<Prisma.$PayMigrationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayMigrations that matches the filter.
     * @param {PayMigrationFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payMigration = await prisma.payMigration.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayMigrationFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayMigration.
     * @param {PayMigrationAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payMigration = await prisma.payMigration.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayMigrationAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayMigrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayMigrationCountArgs} args - Arguments to filter PayMigrations to count.
     * @example
     * // Count the number of PayMigrations
     * const count = await prisma.payMigration.count({
     *   where: {
     *     // ... the filter for the PayMigrations we want to count
     *   }
     * })
    **/
    count<T extends PayMigrationCountArgs>(
      args?: Subset<T, PayMigrationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayMigrationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayMigration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayMigrationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayMigrationAggregateArgs>(args: Subset<T, PayMigrationAggregateArgs>): Prisma.PrismaPromise<GetPayMigrationAggregateType<T>>

    /**
     * Group by PayMigration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayMigrationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayMigrationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayMigrationGroupByArgs['orderBy'] }
        : { orderBy?: PayMigrationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayMigrationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayMigrationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayMigration model
   */
  readonly fields: PayMigrationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayMigration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayMigrationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayMigration model
   */
  interface PayMigrationFieldRefs {
    readonly id: FieldRef<"PayMigration", 'String'>
    readonly version: FieldRef<"PayMigration", 'String'>
    readonly name: FieldRef<"PayMigration", 'String'>
    readonly appliedAt: FieldRef<"PayMigration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayMigration findUnique
   */
  export type PayMigrationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayMigration
     */
    select?: PayMigrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayMigration
     */
    omit?: PayMigrationOmit<ExtArgs> | null
    /**
     * Filter, which PayMigration to fetch.
     */
    where: PayMigrationWhereUniqueInput
  }

  /**
   * PayMigration findUniqueOrThrow
   */
  export type PayMigrationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayMigration
     */
    select?: PayMigrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayMigration
     */
    omit?: PayMigrationOmit<ExtArgs> | null
    /**
     * Filter, which PayMigration to fetch.
     */
    where: PayMigrationWhereUniqueInput
  }

  /**
   * PayMigration findFirst
   */
  export type PayMigrationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayMigration
     */
    select?: PayMigrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayMigration
     */
    omit?: PayMigrationOmit<ExtArgs> | null
    /**
     * Filter, which PayMigration to fetch.
     */
    where?: PayMigrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayMigrations to fetch.
     */
    orderBy?: PayMigrationOrderByWithRelationInput | PayMigrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayMigrations.
     */
    cursor?: PayMigrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayMigrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayMigrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayMigrations.
     */
    distinct?: PayMigrationScalarFieldEnum | PayMigrationScalarFieldEnum[]
  }

  /**
   * PayMigration findFirstOrThrow
   */
  export type PayMigrationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayMigration
     */
    select?: PayMigrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayMigration
     */
    omit?: PayMigrationOmit<ExtArgs> | null
    /**
     * Filter, which PayMigration to fetch.
     */
    where?: PayMigrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayMigrations to fetch.
     */
    orderBy?: PayMigrationOrderByWithRelationInput | PayMigrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayMigrations.
     */
    cursor?: PayMigrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayMigrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayMigrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayMigrations.
     */
    distinct?: PayMigrationScalarFieldEnum | PayMigrationScalarFieldEnum[]
  }

  /**
   * PayMigration findMany
   */
  export type PayMigrationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayMigration
     */
    select?: PayMigrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayMigration
     */
    omit?: PayMigrationOmit<ExtArgs> | null
    /**
     * Filter, which PayMigrations to fetch.
     */
    where?: PayMigrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayMigrations to fetch.
     */
    orderBy?: PayMigrationOrderByWithRelationInput | PayMigrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayMigrations.
     */
    cursor?: PayMigrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayMigrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayMigrations.
     */
    skip?: number
    distinct?: PayMigrationScalarFieldEnum | PayMigrationScalarFieldEnum[]
  }

  /**
   * PayMigration create
   */
  export type PayMigrationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayMigration
     */
    select?: PayMigrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayMigration
     */
    omit?: PayMigrationOmit<ExtArgs> | null
    /**
     * The data needed to create a PayMigration.
     */
    data: XOR<PayMigrationCreateInput, PayMigrationUncheckedCreateInput>
  }

  /**
   * PayMigration createMany
   */
  export type PayMigrationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayMigrations.
     */
    data: PayMigrationCreateManyInput | PayMigrationCreateManyInput[]
  }

  /**
   * PayMigration update
   */
  export type PayMigrationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayMigration
     */
    select?: PayMigrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayMigration
     */
    omit?: PayMigrationOmit<ExtArgs> | null
    /**
     * The data needed to update a PayMigration.
     */
    data: XOR<PayMigrationUpdateInput, PayMigrationUncheckedUpdateInput>
    /**
     * Choose, which PayMigration to update.
     */
    where: PayMigrationWhereUniqueInput
  }

  /**
   * PayMigration updateMany
   */
  export type PayMigrationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayMigrations.
     */
    data: XOR<PayMigrationUpdateManyMutationInput, PayMigrationUncheckedUpdateManyInput>
    /**
     * Filter which PayMigrations to update
     */
    where?: PayMigrationWhereInput
    /**
     * Limit how many PayMigrations to update.
     */
    limit?: number
  }

  /**
   * PayMigration upsert
   */
  export type PayMigrationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayMigration
     */
    select?: PayMigrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayMigration
     */
    omit?: PayMigrationOmit<ExtArgs> | null
    /**
     * The filter to search for the PayMigration to update in case it exists.
     */
    where: PayMigrationWhereUniqueInput
    /**
     * In case the PayMigration found by the `where` argument doesn't exist, create a new PayMigration with this data.
     */
    create: XOR<PayMigrationCreateInput, PayMigrationUncheckedCreateInput>
    /**
     * In case the PayMigration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayMigrationUpdateInput, PayMigrationUncheckedUpdateInput>
  }

  /**
   * PayMigration delete
   */
  export type PayMigrationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayMigration
     */
    select?: PayMigrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayMigration
     */
    omit?: PayMigrationOmit<ExtArgs> | null
    /**
     * Filter which PayMigration to delete.
     */
    where: PayMigrationWhereUniqueInput
  }

  /**
   * PayMigration deleteMany
   */
  export type PayMigrationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayMigrations to delete
     */
    where?: PayMigrationWhereInput
    /**
     * Limit how many PayMigrations to delete.
     */
    limit?: number
  }

  /**
   * PayMigration findRaw
   */
  export type PayMigrationFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayMigration aggregateRaw
   */
  export type PayMigrationAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayMigration without action
   */
  export type PayMigrationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayMigration
     */
    select?: PayMigrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayMigration
     */
    omit?: PayMigrationOmit<ExtArgs> | null
  }


  /**
   * Model PayLedgerAccount
   */

  export type AggregatePayLedgerAccount = {
    _count: PayLedgerAccountCountAggregateOutputType | null
    _avg: PayLedgerAccountAvgAggregateOutputType | null
    _sum: PayLedgerAccountSumAggregateOutputType | null
    _min: PayLedgerAccountMinAggregateOutputType | null
    _max: PayLedgerAccountMaxAggregateOutputType | null
  }

  export type PayLedgerAccountAvgAggregateOutputType = {
    debitTotalPaise: number | null
    creditTotalPaise: number | null
    balancePaise: number | null
    version: number | null
  }

  export type PayLedgerAccountSumAggregateOutputType = {
    debitTotalPaise: bigint | null
    creditTotalPaise: bigint | null
    balancePaise: bigint | null
    version: number | null
  }

  export type PayLedgerAccountMinAggregateOutputType = {
    id: string | null
    accountKey: string | null
    accountCode: string | null
    ownerType: string | null
    ownerId: string | null
    currency: string | null
    normalSide: string | null
    debitTotalPaise: bigint | null
    creditTotalPaise: bigint | null
    balancePaise: bigint | null
    version: number | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type PayLedgerAccountMaxAggregateOutputType = {
    id: string | null
    accountKey: string | null
    accountCode: string | null
    ownerType: string | null
    ownerId: string | null
    currency: string | null
    normalSide: string | null
    debitTotalPaise: bigint | null
    creditTotalPaise: bigint | null
    balancePaise: bigint | null
    version: number | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type PayLedgerAccountCountAggregateOutputType = {
    id: number
    accountKey: number
    accountCode: number
    ownerType: number
    ownerId: number
    currency: number
    normalSide: number
    debitTotalPaise: number
    creditTotalPaise: number
    balancePaise: number
    version: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type PayLedgerAccountAvgAggregateInputType = {
    debitTotalPaise?: true
    creditTotalPaise?: true
    balancePaise?: true
    version?: true
  }

  export type PayLedgerAccountSumAggregateInputType = {
    debitTotalPaise?: true
    creditTotalPaise?: true
    balancePaise?: true
    version?: true
  }

  export type PayLedgerAccountMinAggregateInputType = {
    id?: true
    accountKey?: true
    accountCode?: true
    ownerType?: true
    ownerId?: true
    currency?: true
    normalSide?: true
    debitTotalPaise?: true
    creditTotalPaise?: true
    balancePaise?: true
    version?: true
    updatedAt?: true
    createdAt?: true
  }

  export type PayLedgerAccountMaxAggregateInputType = {
    id?: true
    accountKey?: true
    accountCode?: true
    ownerType?: true
    ownerId?: true
    currency?: true
    normalSide?: true
    debitTotalPaise?: true
    creditTotalPaise?: true
    balancePaise?: true
    version?: true
    updatedAt?: true
    createdAt?: true
  }

  export type PayLedgerAccountCountAggregateInputType = {
    id?: true
    accountKey?: true
    accountCode?: true
    ownerType?: true
    ownerId?: true
    currency?: true
    normalSide?: true
    debitTotalPaise?: true
    creditTotalPaise?: true
    balancePaise?: true
    version?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PayLedgerAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayLedgerAccount to aggregate.
     */
    where?: PayLedgerAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayLedgerAccounts to fetch.
     */
    orderBy?: PayLedgerAccountOrderByWithRelationInput | PayLedgerAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayLedgerAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayLedgerAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayLedgerAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayLedgerAccounts
    **/
    _count?: true | PayLedgerAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayLedgerAccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayLedgerAccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayLedgerAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayLedgerAccountMaxAggregateInputType
  }

  export type GetPayLedgerAccountAggregateType<T extends PayLedgerAccountAggregateArgs> = {
        [P in keyof T & keyof AggregatePayLedgerAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayLedgerAccount[P]>
      : GetScalarType<T[P], AggregatePayLedgerAccount[P]>
  }




  export type PayLedgerAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayLedgerAccountWhereInput
    orderBy?: PayLedgerAccountOrderByWithAggregationInput | PayLedgerAccountOrderByWithAggregationInput[]
    by: PayLedgerAccountScalarFieldEnum[] | PayLedgerAccountScalarFieldEnum
    having?: PayLedgerAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayLedgerAccountCountAggregateInputType | true
    _avg?: PayLedgerAccountAvgAggregateInputType
    _sum?: PayLedgerAccountSumAggregateInputType
    _min?: PayLedgerAccountMinAggregateInputType
    _max?: PayLedgerAccountMaxAggregateInputType
  }

  export type PayLedgerAccountGroupByOutputType = {
    id: string
    accountKey: string
    accountCode: string
    ownerType: string
    ownerId: string
    currency: string
    normalSide: string
    debitTotalPaise: bigint
    creditTotalPaise: bigint
    balancePaise: bigint
    version: number
    updatedAt: Date
    createdAt: Date
    _count: PayLedgerAccountCountAggregateOutputType | null
    _avg: PayLedgerAccountAvgAggregateOutputType | null
    _sum: PayLedgerAccountSumAggregateOutputType | null
    _min: PayLedgerAccountMinAggregateOutputType | null
    _max: PayLedgerAccountMaxAggregateOutputType | null
  }

  type GetPayLedgerAccountGroupByPayload<T extends PayLedgerAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayLedgerAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayLedgerAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayLedgerAccountGroupByOutputType[P]>
            : GetScalarType<T[P], PayLedgerAccountGroupByOutputType[P]>
        }
      >
    >


  export type PayLedgerAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountKey?: boolean
    accountCode?: boolean
    ownerType?: boolean
    ownerId?: boolean
    currency?: boolean
    normalSide?: boolean
    debitTotalPaise?: boolean
    creditTotalPaise?: boolean
    balancePaise?: boolean
    version?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["payLedgerAccount"]>



  export type PayLedgerAccountSelectScalar = {
    id?: boolean
    accountKey?: boolean
    accountCode?: boolean
    ownerType?: boolean
    ownerId?: boolean
    currency?: boolean
    normalSide?: boolean
    debitTotalPaise?: boolean
    creditTotalPaise?: boolean
    balancePaise?: boolean
    version?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }

  export type PayLedgerAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountKey" | "accountCode" | "ownerType" | "ownerId" | "currency" | "normalSide" | "debitTotalPaise" | "creditTotalPaise" | "balancePaise" | "version" | "updatedAt" | "createdAt", ExtArgs["result"]["payLedgerAccount"]>

  export type $PayLedgerAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayLedgerAccount"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountKey: string
      accountCode: string
      ownerType: string
      ownerId: string
      currency: string
      normalSide: string
      debitTotalPaise: bigint
      creditTotalPaise: bigint
      balancePaise: bigint
      version: number
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["payLedgerAccount"]>
    composites: {}
  }

  type PayLedgerAccountGetPayload<S extends boolean | null | undefined | PayLedgerAccountDefaultArgs> = $Result.GetResult<Prisma.$PayLedgerAccountPayload, S>

  type PayLedgerAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayLedgerAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayLedgerAccountCountAggregateInputType | true
    }

  export interface PayLedgerAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayLedgerAccount'], meta: { name: 'PayLedgerAccount' } }
    /**
     * Find zero or one PayLedgerAccount that matches the filter.
     * @param {PayLedgerAccountFindUniqueArgs} args - Arguments to find a PayLedgerAccount
     * @example
     * // Get one PayLedgerAccount
     * const payLedgerAccount = await prisma.payLedgerAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayLedgerAccountFindUniqueArgs>(args: SelectSubset<T, PayLedgerAccountFindUniqueArgs<ExtArgs>>): Prisma__PayLedgerAccountClient<$Result.GetResult<Prisma.$PayLedgerAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayLedgerAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayLedgerAccountFindUniqueOrThrowArgs} args - Arguments to find a PayLedgerAccount
     * @example
     * // Get one PayLedgerAccount
     * const payLedgerAccount = await prisma.payLedgerAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayLedgerAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, PayLedgerAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayLedgerAccountClient<$Result.GetResult<Prisma.$PayLedgerAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayLedgerAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerAccountFindFirstArgs} args - Arguments to find a PayLedgerAccount
     * @example
     * // Get one PayLedgerAccount
     * const payLedgerAccount = await prisma.payLedgerAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayLedgerAccountFindFirstArgs>(args?: SelectSubset<T, PayLedgerAccountFindFirstArgs<ExtArgs>>): Prisma__PayLedgerAccountClient<$Result.GetResult<Prisma.$PayLedgerAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayLedgerAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerAccountFindFirstOrThrowArgs} args - Arguments to find a PayLedgerAccount
     * @example
     * // Get one PayLedgerAccount
     * const payLedgerAccount = await prisma.payLedgerAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayLedgerAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, PayLedgerAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayLedgerAccountClient<$Result.GetResult<Prisma.$PayLedgerAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayLedgerAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayLedgerAccounts
     * const payLedgerAccounts = await prisma.payLedgerAccount.findMany()
     * 
     * // Get first 10 PayLedgerAccounts
     * const payLedgerAccounts = await prisma.payLedgerAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payLedgerAccountWithIdOnly = await prisma.payLedgerAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayLedgerAccountFindManyArgs>(args?: SelectSubset<T, PayLedgerAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayLedgerAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayLedgerAccount.
     * @param {PayLedgerAccountCreateArgs} args - Arguments to create a PayLedgerAccount.
     * @example
     * // Create one PayLedgerAccount
     * const PayLedgerAccount = await prisma.payLedgerAccount.create({
     *   data: {
     *     // ... data to create a PayLedgerAccount
     *   }
     * })
     * 
     */
    create<T extends PayLedgerAccountCreateArgs>(args: SelectSubset<T, PayLedgerAccountCreateArgs<ExtArgs>>): Prisma__PayLedgerAccountClient<$Result.GetResult<Prisma.$PayLedgerAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayLedgerAccounts.
     * @param {PayLedgerAccountCreateManyArgs} args - Arguments to create many PayLedgerAccounts.
     * @example
     * // Create many PayLedgerAccounts
     * const payLedgerAccount = await prisma.payLedgerAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayLedgerAccountCreateManyArgs>(args?: SelectSubset<T, PayLedgerAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayLedgerAccount.
     * @param {PayLedgerAccountDeleteArgs} args - Arguments to delete one PayLedgerAccount.
     * @example
     * // Delete one PayLedgerAccount
     * const PayLedgerAccount = await prisma.payLedgerAccount.delete({
     *   where: {
     *     // ... filter to delete one PayLedgerAccount
     *   }
     * })
     * 
     */
    delete<T extends PayLedgerAccountDeleteArgs>(args: SelectSubset<T, PayLedgerAccountDeleteArgs<ExtArgs>>): Prisma__PayLedgerAccountClient<$Result.GetResult<Prisma.$PayLedgerAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayLedgerAccount.
     * @param {PayLedgerAccountUpdateArgs} args - Arguments to update one PayLedgerAccount.
     * @example
     * // Update one PayLedgerAccount
     * const payLedgerAccount = await prisma.payLedgerAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayLedgerAccountUpdateArgs>(args: SelectSubset<T, PayLedgerAccountUpdateArgs<ExtArgs>>): Prisma__PayLedgerAccountClient<$Result.GetResult<Prisma.$PayLedgerAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayLedgerAccounts.
     * @param {PayLedgerAccountDeleteManyArgs} args - Arguments to filter PayLedgerAccounts to delete.
     * @example
     * // Delete a few PayLedgerAccounts
     * const { count } = await prisma.payLedgerAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayLedgerAccountDeleteManyArgs>(args?: SelectSubset<T, PayLedgerAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayLedgerAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayLedgerAccounts
     * const payLedgerAccount = await prisma.payLedgerAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayLedgerAccountUpdateManyArgs>(args: SelectSubset<T, PayLedgerAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayLedgerAccount.
     * @param {PayLedgerAccountUpsertArgs} args - Arguments to update or create a PayLedgerAccount.
     * @example
     * // Update or create a PayLedgerAccount
     * const payLedgerAccount = await prisma.payLedgerAccount.upsert({
     *   create: {
     *     // ... data to create a PayLedgerAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayLedgerAccount we want to update
     *   }
     * })
     */
    upsert<T extends PayLedgerAccountUpsertArgs>(args: SelectSubset<T, PayLedgerAccountUpsertArgs<ExtArgs>>): Prisma__PayLedgerAccountClient<$Result.GetResult<Prisma.$PayLedgerAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayLedgerAccounts that matches the filter.
     * @param {PayLedgerAccountFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payLedgerAccount = await prisma.payLedgerAccount.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayLedgerAccountFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayLedgerAccount.
     * @param {PayLedgerAccountAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payLedgerAccount = await prisma.payLedgerAccount.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayLedgerAccountAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayLedgerAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerAccountCountArgs} args - Arguments to filter PayLedgerAccounts to count.
     * @example
     * // Count the number of PayLedgerAccounts
     * const count = await prisma.payLedgerAccount.count({
     *   where: {
     *     // ... the filter for the PayLedgerAccounts we want to count
     *   }
     * })
    **/
    count<T extends PayLedgerAccountCountArgs>(
      args?: Subset<T, PayLedgerAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayLedgerAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayLedgerAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayLedgerAccountAggregateArgs>(args: Subset<T, PayLedgerAccountAggregateArgs>): Prisma.PrismaPromise<GetPayLedgerAccountAggregateType<T>>

    /**
     * Group by PayLedgerAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayLedgerAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayLedgerAccountGroupByArgs['orderBy'] }
        : { orderBy?: PayLedgerAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayLedgerAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayLedgerAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayLedgerAccount model
   */
  readonly fields: PayLedgerAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayLedgerAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayLedgerAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayLedgerAccount model
   */
  interface PayLedgerAccountFieldRefs {
    readonly id: FieldRef<"PayLedgerAccount", 'String'>
    readonly accountKey: FieldRef<"PayLedgerAccount", 'String'>
    readonly accountCode: FieldRef<"PayLedgerAccount", 'String'>
    readonly ownerType: FieldRef<"PayLedgerAccount", 'String'>
    readonly ownerId: FieldRef<"PayLedgerAccount", 'String'>
    readonly currency: FieldRef<"PayLedgerAccount", 'String'>
    readonly normalSide: FieldRef<"PayLedgerAccount", 'String'>
    readonly debitTotalPaise: FieldRef<"PayLedgerAccount", 'BigInt'>
    readonly creditTotalPaise: FieldRef<"PayLedgerAccount", 'BigInt'>
    readonly balancePaise: FieldRef<"PayLedgerAccount", 'BigInt'>
    readonly version: FieldRef<"PayLedgerAccount", 'Int'>
    readonly updatedAt: FieldRef<"PayLedgerAccount", 'DateTime'>
    readonly createdAt: FieldRef<"PayLedgerAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayLedgerAccount findUnique
   */
  export type PayLedgerAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerAccount
     */
    select?: PayLedgerAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerAccount
     */
    omit?: PayLedgerAccountOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerAccount to fetch.
     */
    where: PayLedgerAccountWhereUniqueInput
  }

  /**
   * PayLedgerAccount findUniqueOrThrow
   */
  export type PayLedgerAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerAccount
     */
    select?: PayLedgerAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerAccount
     */
    omit?: PayLedgerAccountOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerAccount to fetch.
     */
    where: PayLedgerAccountWhereUniqueInput
  }

  /**
   * PayLedgerAccount findFirst
   */
  export type PayLedgerAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerAccount
     */
    select?: PayLedgerAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerAccount
     */
    omit?: PayLedgerAccountOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerAccount to fetch.
     */
    where?: PayLedgerAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayLedgerAccounts to fetch.
     */
    orderBy?: PayLedgerAccountOrderByWithRelationInput | PayLedgerAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayLedgerAccounts.
     */
    cursor?: PayLedgerAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayLedgerAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayLedgerAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayLedgerAccounts.
     */
    distinct?: PayLedgerAccountScalarFieldEnum | PayLedgerAccountScalarFieldEnum[]
  }

  /**
   * PayLedgerAccount findFirstOrThrow
   */
  export type PayLedgerAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerAccount
     */
    select?: PayLedgerAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerAccount
     */
    omit?: PayLedgerAccountOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerAccount to fetch.
     */
    where?: PayLedgerAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayLedgerAccounts to fetch.
     */
    orderBy?: PayLedgerAccountOrderByWithRelationInput | PayLedgerAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayLedgerAccounts.
     */
    cursor?: PayLedgerAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayLedgerAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayLedgerAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayLedgerAccounts.
     */
    distinct?: PayLedgerAccountScalarFieldEnum | PayLedgerAccountScalarFieldEnum[]
  }

  /**
   * PayLedgerAccount findMany
   */
  export type PayLedgerAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerAccount
     */
    select?: PayLedgerAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerAccount
     */
    omit?: PayLedgerAccountOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerAccounts to fetch.
     */
    where?: PayLedgerAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayLedgerAccounts to fetch.
     */
    orderBy?: PayLedgerAccountOrderByWithRelationInput | PayLedgerAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayLedgerAccounts.
     */
    cursor?: PayLedgerAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayLedgerAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayLedgerAccounts.
     */
    skip?: number
    distinct?: PayLedgerAccountScalarFieldEnum | PayLedgerAccountScalarFieldEnum[]
  }

  /**
   * PayLedgerAccount create
   */
  export type PayLedgerAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerAccount
     */
    select?: PayLedgerAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerAccount
     */
    omit?: PayLedgerAccountOmit<ExtArgs> | null
    /**
     * The data needed to create a PayLedgerAccount.
     */
    data: XOR<PayLedgerAccountCreateInput, PayLedgerAccountUncheckedCreateInput>
  }

  /**
   * PayLedgerAccount createMany
   */
  export type PayLedgerAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayLedgerAccounts.
     */
    data: PayLedgerAccountCreateManyInput | PayLedgerAccountCreateManyInput[]
  }

  /**
   * PayLedgerAccount update
   */
  export type PayLedgerAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerAccount
     */
    select?: PayLedgerAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerAccount
     */
    omit?: PayLedgerAccountOmit<ExtArgs> | null
    /**
     * The data needed to update a PayLedgerAccount.
     */
    data: XOR<PayLedgerAccountUpdateInput, PayLedgerAccountUncheckedUpdateInput>
    /**
     * Choose, which PayLedgerAccount to update.
     */
    where: PayLedgerAccountWhereUniqueInput
  }

  /**
   * PayLedgerAccount updateMany
   */
  export type PayLedgerAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayLedgerAccounts.
     */
    data: XOR<PayLedgerAccountUpdateManyMutationInput, PayLedgerAccountUncheckedUpdateManyInput>
    /**
     * Filter which PayLedgerAccounts to update
     */
    where?: PayLedgerAccountWhereInput
    /**
     * Limit how many PayLedgerAccounts to update.
     */
    limit?: number
  }

  /**
   * PayLedgerAccount upsert
   */
  export type PayLedgerAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerAccount
     */
    select?: PayLedgerAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerAccount
     */
    omit?: PayLedgerAccountOmit<ExtArgs> | null
    /**
     * The filter to search for the PayLedgerAccount to update in case it exists.
     */
    where: PayLedgerAccountWhereUniqueInput
    /**
     * In case the PayLedgerAccount found by the `where` argument doesn't exist, create a new PayLedgerAccount with this data.
     */
    create: XOR<PayLedgerAccountCreateInput, PayLedgerAccountUncheckedCreateInput>
    /**
     * In case the PayLedgerAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayLedgerAccountUpdateInput, PayLedgerAccountUncheckedUpdateInput>
  }

  /**
   * PayLedgerAccount delete
   */
  export type PayLedgerAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerAccount
     */
    select?: PayLedgerAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerAccount
     */
    omit?: PayLedgerAccountOmit<ExtArgs> | null
    /**
     * Filter which PayLedgerAccount to delete.
     */
    where: PayLedgerAccountWhereUniqueInput
  }

  /**
   * PayLedgerAccount deleteMany
   */
  export type PayLedgerAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayLedgerAccounts to delete
     */
    where?: PayLedgerAccountWhereInput
    /**
     * Limit how many PayLedgerAccounts to delete.
     */
    limit?: number
  }

  /**
   * PayLedgerAccount findRaw
   */
  export type PayLedgerAccountFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayLedgerAccount aggregateRaw
   */
  export type PayLedgerAccountAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayLedgerAccount without action
   */
  export type PayLedgerAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerAccount
     */
    select?: PayLedgerAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerAccount
     */
    omit?: PayLedgerAccountOmit<ExtArgs> | null
  }


  /**
   * Model PayLedgerEntry
   */

  export type AggregatePayLedgerEntry = {
    _count: PayLedgerEntryCountAggregateOutputType | null
    _avg: PayLedgerEntryAvgAggregateOutputType | null
    _sum: PayLedgerEntrySumAggregateOutputType | null
    _min: PayLedgerEntryMinAggregateOutputType | null
    _max: PayLedgerEntryMaxAggregateOutputType | null
  }

  export type PayLedgerEntryAvgAggregateOutputType = {
    totalPaise: number | null
  }

  export type PayLedgerEntrySumAggregateOutputType = {
    totalPaise: bigint | null
  }

  export type PayLedgerEntryMinAggregateOutputType = {
    id: string | null
    entryId: string | null
    idempotencyKey: string | null
    bookingId: string | null
    eventType: string | null
    actorId: string | null
    actorRole: string | null
    reason: string | null
    totalPaise: bigint | null
    createdAt: Date | null
  }

  export type PayLedgerEntryMaxAggregateOutputType = {
    id: string | null
    entryId: string | null
    idempotencyKey: string | null
    bookingId: string | null
    eventType: string | null
    actorId: string | null
    actorRole: string | null
    reason: string | null
    totalPaise: bigint | null
    createdAt: Date | null
  }

  export type PayLedgerEntryCountAggregateOutputType = {
    id: number
    entryId: number
    idempotencyKey: number
    bookingId: number
    eventType: number
    actorId: number
    actorRole: number
    reason: number
    totalPaise: number
    createdAt: number
    _all: number
  }


  export type PayLedgerEntryAvgAggregateInputType = {
    totalPaise?: true
  }

  export type PayLedgerEntrySumAggregateInputType = {
    totalPaise?: true
  }

  export type PayLedgerEntryMinAggregateInputType = {
    id?: true
    entryId?: true
    idempotencyKey?: true
    bookingId?: true
    eventType?: true
    actorId?: true
    actorRole?: true
    reason?: true
    totalPaise?: true
    createdAt?: true
  }

  export type PayLedgerEntryMaxAggregateInputType = {
    id?: true
    entryId?: true
    idempotencyKey?: true
    bookingId?: true
    eventType?: true
    actorId?: true
    actorRole?: true
    reason?: true
    totalPaise?: true
    createdAt?: true
  }

  export type PayLedgerEntryCountAggregateInputType = {
    id?: true
    entryId?: true
    idempotencyKey?: true
    bookingId?: true
    eventType?: true
    actorId?: true
    actorRole?: true
    reason?: true
    totalPaise?: true
    createdAt?: true
    _all?: true
  }

  export type PayLedgerEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayLedgerEntry to aggregate.
     */
    where?: PayLedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayLedgerEntries to fetch.
     */
    orderBy?: PayLedgerEntryOrderByWithRelationInput | PayLedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayLedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayLedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayLedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayLedgerEntries
    **/
    _count?: true | PayLedgerEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayLedgerEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayLedgerEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayLedgerEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayLedgerEntryMaxAggregateInputType
  }

  export type GetPayLedgerEntryAggregateType<T extends PayLedgerEntryAggregateArgs> = {
        [P in keyof T & keyof AggregatePayLedgerEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayLedgerEntry[P]>
      : GetScalarType<T[P], AggregatePayLedgerEntry[P]>
  }




  export type PayLedgerEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayLedgerEntryWhereInput
    orderBy?: PayLedgerEntryOrderByWithAggregationInput | PayLedgerEntryOrderByWithAggregationInput[]
    by: PayLedgerEntryScalarFieldEnum[] | PayLedgerEntryScalarFieldEnum
    having?: PayLedgerEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayLedgerEntryCountAggregateInputType | true
    _avg?: PayLedgerEntryAvgAggregateInputType
    _sum?: PayLedgerEntrySumAggregateInputType
    _min?: PayLedgerEntryMinAggregateInputType
    _max?: PayLedgerEntryMaxAggregateInputType
  }

  export type PayLedgerEntryGroupByOutputType = {
    id: string
    entryId: string
    idempotencyKey: string
    bookingId: string | null
    eventType: string
    actorId: string
    actorRole: string
    reason: string
    totalPaise: bigint
    createdAt: Date
    _count: PayLedgerEntryCountAggregateOutputType | null
    _avg: PayLedgerEntryAvgAggregateOutputType | null
    _sum: PayLedgerEntrySumAggregateOutputType | null
    _min: PayLedgerEntryMinAggregateOutputType | null
    _max: PayLedgerEntryMaxAggregateOutputType | null
  }

  type GetPayLedgerEntryGroupByPayload<T extends PayLedgerEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayLedgerEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayLedgerEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayLedgerEntryGroupByOutputType[P]>
            : GetScalarType<T[P], PayLedgerEntryGroupByOutputType[P]>
        }
      >
    >


  export type PayLedgerEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entryId?: boolean
    idempotencyKey?: boolean
    bookingId?: boolean
    eventType?: boolean
    actorId?: boolean
    actorRole?: boolean
    reason?: boolean
    totalPaise?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["payLedgerEntry"]>



  export type PayLedgerEntrySelectScalar = {
    id?: boolean
    entryId?: boolean
    idempotencyKey?: boolean
    bookingId?: boolean
    eventType?: boolean
    actorId?: boolean
    actorRole?: boolean
    reason?: boolean
    totalPaise?: boolean
    createdAt?: boolean
  }

  export type PayLedgerEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "entryId" | "idempotencyKey" | "bookingId" | "eventType" | "actorId" | "actorRole" | "reason" | "totalPaise" | "createdAt", ExtArgs["result"]["payLedgerEntry"]>

  export type $PayLedgerEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayLedgerEntry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      entryId: string
      idempotencyKey: string
      bookingId: string | null
      eventType: string
      actorId: string
      actorRole: string
      reason: string
      totalPaise: bigint
      createdAt: Date
    }, ExtArgs["result"]["payLedgerEntry"]>
    composites: {}
  }

  type PayLedgerEntryGetPayload<S extends boolean | null | undefined | PayLedgerEntryDefaultArgs> = $Result.GetResult<Prisma.$PayLedgerEntryPayload, S>

  type PayLedgerEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayLedgerEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayLedgerEntryCountAggregateInputType | true
    }

  export interface PayLedgerEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayLedgerEntry'], meta: { name: 'PayLedgerEntry' } }
    /**
     * Find zero or one PayLedgerEntry that matches the filter.
     * @param {PayLedgerEntryFindUniqueArgs} args - Arguments to find a PayLedgerEntry
     * @example
     * // Get one PayLedgerEntry
     * const payLedgerEntry = await prisma.payLedgerEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayLedgerEntryFindUniqueArgs>(args: SelectSubset<T, PayLedgerEntryFindUniqueArgs<ExtArgs>>): Prisma__PayLedgerEntryClient<$Result.GetResult<Prisma.$PayLedgerEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayLedgerEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayLedgerEntryFindUniqueOrThrowArgs} args - Arguments to find a PayLedgerEntry
     * @example
     * // Get one PayLedgerEntry
     * const payLedgerEntry = await prisma.payLedgerEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayLedgerEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, PayLedgerEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayLedgerEntryClient<$Result.GetResult<Prisma.$PayLedgerEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayLedgerEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerEntryFindFirstArgs} args - Arguments to find a PayLedgerEntry
     * @example
     * // Get one PayLedgerEntry
     * const payLedgerEntry = await prisma.payLedgerEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayLedgerEntryFindFirstArgs>(args?: SelectSubset<T, PayLedgerEntryFindFirstArgs<ExtArgs>>): Prisma__PayLedgerEntryClient<$Result.GetResult<Prisma.$PayLedgerEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayLedgerEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerEntryFindFirstOrThrowArgs} args - Arguments to find a PayLedgerEntry
     * @example
     * // Get one PayLedgerEntry
     * const payLedgerEntry = await prisma.payLedgerEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayLedgerEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, PayLedgerEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayLedgerEntryClient<$Result.GetResult<Prisma.$PayLedgerEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayLedgerEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayLedgerEntries
     * const payLedgerEntries = await prisma.payLedgerEntry.findMany()
     * 
     * // Get first 10 PayLedgerEntries
     * const payLedgerEntries = await prisma.payLedgerEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payLedgerEntryWithIdOnly = await prisma.payLedgerEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayLedgerEntryFindManyArgs>(args?: SelectSubset<T, PayLedgerEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayLedgerEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayLedgerEntry.
     * @param {PayLedgerEntryCreateArgs} args - Arguments to create a PayLedgerEntry.
     * @example
     * // Create one PayLedgerEntry
     * const PayLedgerEntry = await prisma.payLedgerEntry.create({
     *   data: {
     *     // ... data to create a PayLedgerEntry
     *   }
     * })
     * 
     */
    create<T extends PayLedgerEntryCreateArgs>(args: SelectSubset<T, PayLedgerEntryCreateArgs<ExtArgs>>): Prisma__PayLedgerEntryClient<$Result.GetResult<Prisma.$PayLedgerEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayLedgerEntries.
     * @param {PayLedgerEntryCreateManyArgs} args - Arguments to create many PayLedgerEntries.
     * @example
     * // Create many PayLedgerEntries
     * const payLedgerEntry = await prisma.payLedgerEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayLedgerEntryCreateManyArgs>(args?: SelectSubset<T, PayLedgerEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayLedgerEntry.
     * @param {PayLedgerEntryDeleteArgs} args - Arguments to delete one PayLedgerEntry.
     * @example
     * // Delete one PayLedgerEntry
     * const PayLedgerEntry = await prisma.payLedgerEntry.delete({
     *   where: {
     *     // ... filter to delete one PayLedgerEntry
     *   }
     * })
     * 
     */
    delete<T extends PayLedgerEntryDeleteArgs>(args: SelectSubset<T, PayLedgerEntryDeleteArgs<ExtArgs>>): Prisma__PayLedgerEntryClient<$Result.GetResult<Prisma.$PayLedgerEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayLedgerEntry.
     * @param {PayLedgerEntryUpdateArgs} args - Arguments to update one PayLedgerEntry.
     * @example
     * // Update one PayLedgerEntry
     * const payLedgerEntry = await prisma.payLedgerEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayLedgerEntryUpdateArgs>(args: SelectSubset<T, PayLedgerEntryUpdateArgs<ExtArgs>>): Prisma__PayLedgerEntryClient<$Result.GetResult<Prisma.$PayLedgerEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayLedgerEntries.
     * @param {PayLedgerEntryDeleteManyArgs} args - Arguments to filter PayLedgerEntries to delete.
     * @example
     * // Delete a few PayLedgerEntries
     * const { count } = await prisma.payLedgerEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayLedgerEntryDeleteManyArgs>(args?: SelectSubset<T, PayLedgerEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayLedgerEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayLedgerEntries
     * const payLedgerEntry = await prisma.payLedgerEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayLedgerEntryUpdateManyArgs>(args: SelectSubset<T, PayLedgerEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayLedgerEntry.
     * @param {PayLedgerEntryUpsertArgs} args - Arguments to update or create a PayLedgerEntry.
     * @example
     * // Update or create a PayLedgerEntry
     * const payLedgerEntry = await prisma.payLedgerEntry.upsert({
     *   create: {
     *     // ... data to create a PayLedgerEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayLedgerEntry we want to update
     *   }
     * })
     */
    upsert<T extends PayLedgerEntryUpsertArgs>(args: SelectSubset<T, PayLedgerEntryUpsertArgs<ExtArgs>>): Prisma__PayLedgerEntryClient<$Result.GetResult<Prisma.$PayLedgerEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayLedgerEntries that matches the filter.
     * @param {PayLedgerEntryFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payLedgerEntry = await prisma.payLedgerEntry.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayLedgerEntryFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayLedgerEntry.
     * @param {PayLedgerEntryAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payLedgerEntry = await prisma.payLedgerEntry.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayLedgerEntryAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayLedgerEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerEntryCountArgs} args - Arguments to filter PayLedgerEntries to count.
     * @example
     * // Count the number of PayLedgerEntries
     * const count = await prisma.payLedgerEntry.count({
     *   where: {
     *     // ... the filter for the PayLedgerEntries we want to count
     *   }
     * })
    **/
    count<T extends PayLedgerEntryCountArgs>(
      args?: Subset<T, PayLedgerEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayLedgerEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayLedgerEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayLedgerEntryAggregateArgs>(args: Subset<T, PayLedgerEntryAggregateArgs>): Prisma.PrismaPromise<GetPayLedgerEntryAggregateType<T>>

    /**
     * Group by PayLedgerEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayLedgerEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayLedgerEntryGroupByArgs['orderBy'] }
        : { orderBy?: PayLedgerEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayLedgerEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayLedgerEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayLedgerEntry model
   */
  readonly fields: PayLedgerEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayLedgerEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayLedgerEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayLedgerEntry model
   */
  interface PayLedgerEntryFieldRefs {
    readonly id: FieldRef<"PayLedgerEntry", 'String'>
    readonly entryId: FieldRef<"PayLedgerEntry", 'String'>
    readonly idempotencyKey: FieldRef<"PayLedgerEntry", 'String'>
    readonly bookingId: FieldRef<"PayLedgerEntry", 'String'>
    readonly eventType: FieldRef<"PayLedgerEntry", 'String'>
    readonly actorId: FieldRef<"PayLedgerEntry", 'String'>
    readonly actorRole: FieldRef<"PayLedgerEntry", 'String'>
    readonly reason: FieldRef<"PayLedgerEntry", 'String'>
    readonly totalPaise: FieldRef<"PayLedgerEntry", 'BigInt'>
    readonly createdAt: FieldRef<"PayLedgerEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayLedgerEntry findUnique
   */
  export type PayLedgerEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerEntry
     */
    select?: PayLedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerEntry
     */
    omit?: PayLedgerEntryOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerEntry to fetch.
     */
    where: PayLedgerEntryWhereUniqueInput
  }

  /**
   * PayLedgerEntry findUniqueOrThrow
   */
  export type PayLedgerEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerEntry
     */
    select?: PayLedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerEntry
     */
    omit?: PayLedgerEntryOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerEntry to fetch.
     */
    where: PayLedgerEntryWhereUniqueInput
  }

  /**
   * PayLedgerEntry findFirst
   */
  export type PayLedgerEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerEntry
     */
    select?: PayLedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerEntry
     */
    omit?: PayLedgerEntryOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerEntry to fetch.
     */
    where?: PayLedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayLedgerEntries to fetch.
     */
    orderBy?: PayLedgerEntryOrderByWithRelationInput | PayLedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayLedgerEntries.
     */
    cursor?: PayLedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayLedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayLedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayLedgerEntries.
     */
    distinct?: PayLedgerEntryScalarFieldEnum | PayLedgerEntryScalarFieldEnum[]
  }

  /**
   * PayLedgerEntry findFirstOrThrow
   */
  export type PayLedgerEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerEntry
     */
    select?: PayLedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerEntry
     */
    omit?: PayLedgerEntryOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerEntry to fetch.
     */
    where?: PayLedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayLedgerEntries to fetch.
     */
    orderBy?: PayLedgerEntryOrderByWithRelationInput | PayLedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayLedgerEntries.
     */
    cursor?: PayLedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayLedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayLedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayLedgerEntries.
     */
    distinct?: PayLedgerEntryScalarFieldEnum | PayLedgerEntryScalarFieldEnum[]
  }

  /**
   * PayLedgerEntry findMany
   */
  export type PayLedgerEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerEntry
     */
    select?: PayLedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerEntry
     */
    omit?: PayLedgerEntryOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerEntries to fetch.
     */
    where?: PayLedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayLedgerEntries to fetch.
     */
    orderBy?: PayLedgerEntryOrderByWithRelationInput | PayLedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayLedgerEntries.
     */
    cursor?: PayLedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayLedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayLedgerEntries.
     */
    skip?: number
    distinct?: PayLedgerEntryScalarFieldEnum | PayLedgerEntryScalarFieldEnum[]
  }

  /**
   * PayLedgerEntry create
   */
  export type PayLedgerEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerEntry
     */
    select?: PayLedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerEntry
     */
    omit?: PayLedgerEntryOmit<ExtArgs> | null
    /**
     * The data needed to create a PayLedgerEntry.
     */
    data: XOR<PayLedgerEntryCreateInput, PayLedgerEntryUncheckedCreateInput>
  }

  /**
   * PayLedgerEntry createMany
   */
  export type PayLedgerEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayLedgerEntries.
     */
    data: PayLedgerEntryCreateManyInput | PayLedgerEntryCreateManyInput[]
  }

  /**
   * PayLedgerEntry update
   */
  export type PayLedgerEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerEntry
     */
    select?: PayLedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerEntry
     */
    omit?: PayLedgerEntryOmit<ExtArgs> | null
    /**
     * The data needed to update a PayLedgerEntry.
     */
    data: XOR<PayLedgerEntryUpdateInput, PayLedgerEntryUncheckedUpdateInput>
    /**
     * Choose, which PayLedgerEntry to update.
     */
    where: PayLedgerEntryWhereUniqueInput
  }

  /**
   * PayLedgerEntry updateMany
   */
  export type PayLedgerEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayLedgerEntries.
     */
    data: XOR<PayLedgerEntryUpdateManyMutationInput, PayLedgerEntryUncheckedUpdateManyInput>
    /**
     * Filter which PayLedgerEntries to update
     */
    where?: PayLedgerEntryWhereInput
    /**
     * Limit how many PayLedgerEntries to update.
     */
    limit?: number
  }

  /**
   * PayLedgerEntry upsert
   */
  export type PayLedgerEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerEntry
     */
    select?: PayLedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerEntry
     */
    omit?: PayLedgerEntryOmit<ExtArgs> | null
    /**
     * The filter to search for the PayLedgerEntry to update in case it exists.
     */
    where: PayLedgerEntryWhereUniqueInput
    /**
     * In case the PayLedgerEntry found by the `where` argument doesn't exist, create a new PayLedgerEntry with this data.
     */
    create: XOR<PayLedgerEntryCreateInput, PayLedgerEntryUncheckedCreateInput>
    /**
     * In case the PayLedgerEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayLedgerEntryUpdateInput, PayLedgerEntryUncheckedUpdateInput>
  }

  /**
   * PayLedgerEntry delete
   */
  export type PayLedgerEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerEntry
     */
    select?: PayLedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerEntry
     */
    omit?: PayLedgerEntryOmit<ExtArgs> | null
    /**
     * Filter which PayLedgerEntry to delete.
     */
    where: PayLedgerEntryWhereUniqueInput
  }

  /**
   * PayLedgerEntry deleteMany
   */
  export type PayLedgerEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayLedgerEntries to delete
     */
    where?: PayLedgerEntryWhereInput
    /**
     * Limit how many PayLedgerEntries to delete.
     */
    limit?: number
  }

  /**
   * PayLedgerEntry findRaw
   */
  export type PayLedgerEntryFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayLedgerEntry aggregateRaw
   */
  export type PayLedgerEntryAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayLedgerEntry without action
   */
  export type PayLedgerEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerEntry
     */
    select?: PayLedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerEntry
     */
    omit?: PayLedgerEntryOmit<ExtArgs> | null
  }


  /**
   * Model PayLedgerLine
   */

  export type AggregatePayLedgerLine = {
    _count: PayLedgerLineCountAggregateOutputType | null
    _avg: PayLedgerLineAvgAggregateOutputType | null
    _sum: PayLedgerLineSumAggregateOutputType | null
    _min: PayLedgerLineMinAggregateOutputType | null
    _max: PayLedgerLineMaxAggregateOutputType | null
  }

  export type PayLedgerLineAvgAggregateOutputType = {
    lineIndex: number | null
    amountPaise: number | null
  }

  export type PayLedgerLineSumAggregateOutputType = {
    lineIndex: number | null
    amountPaise: bigint | null
  }

  export type PayLedgerLineMinAggregateOutputType = {
    id: string | null
    entryId: string | null
    lineIndex: number | null
    accountKey: string | null
    accountCode: string | null
    ownerType: string | null
    ownerId: string | null
    direction: string | null
    amountPaise: bigint | null
    bookingId: string | null
    createdAt: Date | null
  }

  export type PayLedgerLineMaxAggregateOutputType = {
    id: string | null
    entryId: string | null
    lineIndex: number | null
    accountKey: string | null
    accountCode: string | null
    ownerType: string | null
    ownerId: string | null
    direction: string | null
    amountPaise: bigint | null
    bookingId: string | null
    createdAt: Date | null
  }

  export type PayLedgerLineCountAggregateOutputType = {
    id: number
    entryId: number
    lineIndex: number
    accountKey: number
    accountCode: number
    ownerType: number
    ownerId: number
    direction: number
    amountPaise: number
    bookingId: number
    createdAt: number
    _all: number
  }


  export type PayLedgerLineAvgAggregateInputType = {
    lineIndex?: true
    amountPaise?: true
  }

  export type PayLedgerLineSumAggregateInputType = {
    lineIndex?: true
    amountPaise?: true
  }

  export type PayLedgerLineMinAggregateInputType = {
    id?: true
    entryId?: true
    lineIndex?: true
    accountKey?: true
    accountCode?: true
    ownerType?: true
    ownerId?: true
    direction?: true
    amountPaise?: true
    bookingId?: true
    createdAt?: true
  }

  export type PayLedgerLineMaxAggregateInputType = {
    id?: true
    entryId?: true
    lineIndex?: true
    accountKey?: true
    accountCode?: true
    ownerType?: true
    ownerId?: true
    direction?: true
    amountPaise?: true
    bookingId?: true
    createdAt?: true
  }

  export type PayLedgerLineCountAggregateInputType = {
    id?: true
    entryId?: true
    lineIndex?: true
    accountKey?: true
    accountCode?: true
    ownerType?: true
    ownerId?: true
    direction?: true
    amountPaise?: true
    bookingId?: true
    createdAt?: true
    _all?: true
  }

  export type PayLedgerLineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayLedgerLine to aggregate.
     */
    where?: PayLedgerLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayLedgerLines to fetch.
     */
    orderBy?: PayLedgerLineOrderByWithRelationInput | PayLedgerLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayLedgerLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayLedgerLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayLedgerLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayLedgerLines
    **/
    _count?: true | PayLedgerLineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayLedgerLineAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayLedgerLineSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayLedgerLineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayLedgerLineMaxAggregateInputType
  }

  export type GetPayLedgerLineAggregateType<T extends PayLedgerLineAggregateArgs> = {
        [P in keyof T & keyof AggregatePayLedgerLine]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayLedgerLine[P]>
      : GetScalarType<T[P], AggregatePayLedgerLine[P]>
  }




  export type PayLedgerLineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayLedgerLineWhereInput
    orderBy?: PayLedgerLineOrderByWithAggregationInput | PayLedgerLineOrderByWithAggregationInput[]
    by: PayLedgerLineScalarFieldEnum[] | PayLedgerLineScalarFieldEnum
    having?: PayLedgerLineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayLedgerLineCountAggregateInputType | true
    _avg?: PayLedgerLineAvgAggregateInputType
    _sum?: PayLedgerLineSumAggregateInputType
    _min?: PayLedgerLineMinAggregateInputType
    _max?: PayLedgerLineMaxAggregateInputType
  }

  export type PayLedgerLineGroupByOutputType = {
    id: string
    entryId: string
    lineIndex: number
    accountKey: string
    accountCode: string
    ownerType: string
    ownerId: string
    direction: string
    amountPaise: bigint
    bookingId: string | null
    createdAt: Date
    _count: PayLedgerLineCountAggregateOutputType | null
    _avg: PayLedgerLineAvgAggregateOutputType | null
    _sum: PayLedgerLineSumAggregateOutputType | null
    _min: PayLedgerLineMinAggregateOutputType | null
    _max: PayLedgerLineMaxAggregateOutputType | null
  }

  type GetPayLedgerLineGroupByPayload<T extends PayLedgerLineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayLedgerLineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayLedgerLineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayLedgerLineGroupByOutputType[P]>
            : GetScalarType<T[P], PayLedgerLineGroupByOutputType[P]>
        }
      >
    >


  export type PayLedgerLineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entryId?: boolean
    lineIndex?: boolean
    accountKey?: boolean
    accountCode?: boolean
    ownerType?: boolean
    ownerId?: boolean
    direction?: boolean
    amountPaise?: boolean
    bookingId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["payLedgerLine"]>



  export type PayLedgerLineSelectScalar = {
    id?: boolean
    entryId?: boolean
    lineIndex?: boolean
    accountKey?: boolean
    accountCode?: boolean
    ownerType?: boolean
    ownerId?: boolean
    direction?: boolean
    amountPaise?: boolean
    bookingId?: boolean
    createdAt?: boolean
  }

  export type PayLedgerLineOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "entryId" | "lineIndex" | "accountKey" | "accountCode" | "ownerType" | "ownerId" | "direction" | "amountPaise" | "bookingId" | "createdAt", ExtArgs["result"]["payLedgerLine"]>

  export type $PayLedgerLinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayLedgerLine"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      entryId: string
      lineIndex: number
      accountKey: string
      accountCode: string
      ownerType: string
      ownerId: string
      direction: string
      amountPaise: bigint
      bookingId: string | null
      createdAt: Date
    }, ExtArgs["result"]["payLedgerLine"]>
    composites: {}
  }

  type PayLedgerLineGetPayload<S extends boolean | null | undefined | PayLedgerLineDefaultArgs> = $Result.GetResult<Prisma.$PayLedgerLinePayload, S>

  type PayLedgerLineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayLedgerLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayLedgerLineCountAggregateInputType | true
    }

  export interface PayLedgerLineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayLedgerLine'], meta: { name: 'PayLedgerLine' } }
    /**
     * Find zero or one PayLedgerLine that matches the filter.
     * @param {PayLedgerLineFindUniqueArgs} args - Arguments to find a PayLedgerLine
     * @example
     * // Get one PayLedgerLine
     * const payLedgerLine = await prisma.payLedgerLine.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayLedgerLineFindUniqueArgs>(args: SelectSubset<T, PayLedgerLineFindUniqueArgs<ExtArgs>>): Prisma__PayLedgerLineClient<$Result.GetResult<Prisma.$PayLedgerLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayLedgerLine that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayLedgerLineFindUniqueOrThrowArgs} args - Arguments to find a PayLedgerLine
     * @example
     * // Get one PayLedgerLine
     * const payLedgerLine = await prisma.payLedgerLine.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayLedgerLineFindUniqueOrThrowArgs>(args: SelectSubset<T, PayLedgerLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayLedgerLineClient<$Result.GetResult<Prisma.$PayLedgerLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayLedgerLine that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerLineFindFirstArgs} args - Arguments to find a PayLedgerLine
     * @example
     * // Get one PayLedgerLine
     * const payLedgerLine = await prisma.payLedgerLine.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayLedgerLineFindFirstArgs>(args?: SelectSubset<T, PayLedgerLineFindFirstArgs<ExtArgs>>): Prisma__PayLedgerLineClient<$Result.GetResult<Prisma.$PayLedgerLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayLedgerLine that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerLineFindFirstOrThrowArgs} args - Arguments to find a PayLedgerLine
     * @example
     * // Get one PayLedgerLine
     * const payLedgerLine = await prisma.payLedgerLine.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayLedgerLineFindFirstOrThrowArgs>(args?: SelectSubset<T, PayLedgerLineFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayLedgerLineClient<$Result.GetResult<Prisma.$PayLedgerLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayLedgerLines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerLineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayLedgerLines
     * const payLedgerLines = await prisma.payLedgerLine.findMany()
     * 
     * // Get first 10 PayLedgerLines
     * const payLedgerLines = await prisma.payLedgerLine.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payLedgerLineWithIdOnly = await prisma.payLedgerLine.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayLedgerLineFindManyArgs>(args?: SelectSubset<T, PayLedgerLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayLedgerLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayLedgerLine.
     * @param {PayLedgerLineCreateArgs} args - Arguments to create a PayLedgerLine.
     * @example
     * // Create one PayLedgerLine
     * const PayLedgerLine = await prisma.payLedgerLine.create({
     *   data: {
     *     // ... data to create a PayLedgerLine
     *   }
     * })
     * 
     */
    create<T extends PayLedgerLineCreateArgs>(args: SelectSubset<T, PayLedgerLineCreateArgs<ExtArgs>>): Prisma__PayLedgerLineClient<$Result.GetResult<Prisma.$PayLedgerLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayLedgerLines.
     * @param {PayLedgerLineCreateManyArgs} args - Arguments to create many PayLedgerLines.
     * @example
     * // Create many PayLedgerLines
     * const payLedgerLine = await prisma.payLedgerLine.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayLedgerLineCreateManyArgs>(args?: SelectSubset<T, PayLedgerLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayLedgerLine.
     * @param {PayLedgerLineDeleteArgs} args - Arguments to delete one PayLedgerLine.
     * @example
     * // Delete one PayLedgerLine
     * const PayLedgerLine = await prisma.payLedgerLine.delete({
     *   where: {
     *     // ... filter to delete one PayLedgerLine
     *   }
     * })
     * 
     */
    delete<T extends PayLedgerLineDeleteArgs>(args: SelectSubset<T, PayLedgerLineDeleteArgs<ExtArgs>>): Prisma__PayLedgerLineClient<$Result.GetResult<Prisma.$PayLedgerLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayLedgerLine.
     * @param {PayLedgerLineUpdateArgs} args - Arguments to update one PayLedgerLine.
     * @example
     * // Update one PayLedgerLine
     * const payLedgerLine = await prisma.payLedgerLine.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayLedgerLineUpdateArgs>(args: SelectSubset<T, PayLedgerLineUpdateArgs<ExtArgs>>): Prisma__PayLedgerLineClient<$Result.GetResult<Prisma.$PayLedgerLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayLedgerLines.
     * @param {PayLedgerLineDeleteManyArgs} args - Arguments to filter PayLedgerLines to delete.
     * @example
     * // Delete a few PayLedgerLines
     * const { count } = await prisma.payLedgerLine.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayLedgerLineDeleteManyArgs>(args?: SelectSubset<T, PayLedgerLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayLedgerLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerLineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayLedgerLines
     * const payLedgerLine = await prisma.payLedgerLine.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayLedgerLineUpdateManyArgs>(args: SelectSubset<T, PayLedgerLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayLedgerLine.
     * @param {PayLedgerLineUpsertArgs} args - Arguments to update or create a PayLedgerLine.
     * @example
     * // Update or create a PayLedgerLine
     * const payLedgerLine = await prisma.payLedgerLine.upsert({
     *   create: {
     *     // ... data to create a PayLedgerLine
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayLedgerLine we want to update
     *   }
     * })
     */
    upsert<T extends PayLedgerLineUpsertArgs>(args: SelectSubset<T, PayLedgerLineUpsertArgs<ExtArgs>>): Prisma__PayLedgerLineClient<$Result.GetResult<Prisma.$PayLedgerLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayLedgerLines that matches the filter.
     * @param {PayLedgerLineFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payLedgerLine = await prisma.payLedgerLine.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayLedgerLineFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayLedgerLine.
     * @param {PayLedgerLineAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payLedgerLine = await prisma.payLedgerLine.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayLedgerLineAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayLedgerLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerLineCountArgs} args - Arguments to filter PayLedgerLines to count.
     * @example
     * // Count the number of PayLedgerLines
     * const count = await prisma.payLedgerLine.count({
     *   where: {
     *     // ... the filter for the PayLedgerLines we want to count
     *   }
     * })
    **/
    count<T extends PayLedgerLineCountArgs>(
      args?: Subset<T, PayLedgerLineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayLedgerLineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayLedgerLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerLineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayLedgerLineAggregateArgs>(args: Subset<T, PayLedgerLineAggregateArgs>): Prisma.PrismaPromise<GetPayLedgerLineAggregateType<T>>

    /**
     * Group by PayLedgerLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayLedgerLineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayLedgerLineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayLedgerLineGroupByArgs['orderBy'] }
        : { orderBy?: PayLedgerLineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayLedgerLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayLedgerLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayLedgerLine model
   */
  readonly fields: PayLedgerLineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayLedgerLine.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayLedgerLineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayLedgerLine model
   */
  interface PayLedgerLineFieldRefs {
    readonly id: FieldRef<"PayLedgerLine", 'String'>
    readonly entryId: FieldRef<"PayLedgerLine", 'String'>
    readonly lineIndex: FieldRef<"PayLedgerLine", 'Int'>
    readonly accountKey: FieldRef<"PayLedgerLine", 'String'>
    readonly accountCode: FieldRef<"PayLedgerLine", 'String'>
    readonly ownerType: FieldRef<"PayLedgerLine", 'String'>
    readonly ownerId: FieldRef<"PayLedgerLine", 'String'>
    readonly direction: FieldRef<"PayLedgerLine", 'String'>
    readonly amountPaise: FieldRef<"PayLedgerLine", 'BigInt'>
    readonly bookingId: FieldRef<"PayLedgerLine", 'String'>
    readonly createdAt: FieldRef<"PayLedgerLine", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayLedgerLine findUnique
   */
  export type PayLedgerLineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerLine
     */
    select?: PayLedgerLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerLine
     */
    omit?: PayLedgerLineOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerLine to fetch.
     */
    where: PayLedgerLineWhereUniqueInput
  }

  /**
   * PayLedgerLine findUniqueOrThrow
   */
  export type PayLedgerLineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerLine
     */
    select?: PayLedgerLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerLine
     */
    omit?: PayLedgerLineOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerLine to fetch.
     */
    where: PayLedgerLineWhereUniqueInput
  }

  /**
   * PayLedgerLine findFirst
   */
  export type PayLedgerLineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerLine
     */
    select?: PayLedgerLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerLine
     */
    omit?: PayLedgerLineOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerLine to fetch.
     */
    where?: PayLedgerLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayLedgerLines to fetch.
     */
    orderBy?: PayLedgerLineOrderByWithRelationInput | PayLedgerLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayLedgerLines.
     */
    cursor?: PayLedgerLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayLedgerLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayLedgerLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayLedgerLines.
     */
    distinct?: PayLedgerLineScalarFieldEnum | PayLedgerLineScalarFieldEnum[]
  }

  /**
   * PayLedgerLine findFirstOrThrow
   */
  export type PayLedgerLineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerLine
     */
    select?: PayLedgerLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerLine
     */
    omit?: PayLedgerLineOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerLine to fetch.
     */
    where?: PayLedgerLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayLedgerLines to fetch.
     */
    orderBy?: PayLedgerLineOrderByWithRelationInput | PayLedgerLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayLedgerLines.
     */
    cursor?: PayLedgerLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayLedgerLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayLedgerLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayLedgerLines.
     */
    distinct?: PayLedgerLineScalarFieldEnum | PayLedgerLineScalarFieldEnum[]
  }

  /**
   * PayLedgerLine findMany
   */
  export type PayLedgerLineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerLine
     */
    select?: PayLedgerLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerLine
     */
    omit?: PayLedgerLineOmit<ExtArgs> | null
    /**
     * Filter, which PayLedgerLines to fetch.
     */
    where?: PayLedgerLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayLedgerLines to fetch.
     */
    orderBy?: PayLedgerLineOrderByWithRelationInput | PayLedgerLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayLedgerLines.
     */
    cursor?: PayLedgerLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayLedgerLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayLedgerLines.
     */
    skip?: number
    distinct?: PayLedgerLineScalarFieldEnum | PayLedgerLineScalarFieldEnum[]
  }

  /**
   * PayLedgerLine create
   */
  export type PayLedgerLineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerLine
     */
    select?: PayLedgerLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerLine
     */
    omit?: PayLedgerLineOmit<ExtArgs> | null
    /**
     * The data needed to create a PayLedgerLine.
     */
    data: XOR<PayLedgerLineCreateInput, PayLedgerLineUncheckedCreateInput>
  }

  /**
   * PayLedgerLine createMany
   */
  export type PayLedgerLineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayLedgerLines.
     */
    data: PayLedgerLineCreateManyInput | PayLedgerLineCreateManyInput[]
  }

  /**
   * PayLedgerLine update
   */
  export type PayLedgerLineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerLine
     */
    select?: PayLedgerLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerLine
     */
    omit?: PayLedgerLineOmit<ExtArgs> | null
    /**
     * The data needed to update a PayLedgerLine.
     */
    data: XOR<PayLedgerLineUpdateInput, PayLedgerLineUncheckedUpdateInput>
    /**
     * Choose, which PayLedgerLine to update.
     */
    where: PayLedgerLineWhereUniqueInput
  }

  /**
   * PayLedgerLine updateMany
   */
  export type PayLedgerLineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayLedgerLines.
     */
    data: XOR<PayLedgerLineUpdateManyMutationInput, PayLedgerLineUncheckedUpdateManyInput>
    /**
     * Filter which PayLedgerLines to update
     */
    where?: PayLedgerLineWhereInput
    /**
     * Limit how many PayLedgerLines to update.
     */
    limit?: number
  }

  /**
   * PayLedgerLine upsert
   */
  export type PayLedgerLineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerLine
     */
    select?: PayLedgerLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerLine
     */
    omit?: PayLedgerLineOmit<ExtArgs> | null
    /**
     * The filter to search for the PayLedgerLine to update in case it exists.
     */
    where: PayLedgerLineWhereUniqueInput
    /**
     * In case the PayLedgerLine found by the `where` argument doesn't exist, create a new PayLedgerLine with this data.
     */
    create: XOR<PayLedgerLineCreateInput, PayLedgerLineUncheckedCreateInput>
    /**
     * In case the PayLedgerLine was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayLedgerLineUpdateInput, PayLedgerLineUncheckedUpdateInput>
  }

  /**
   * PayLedgerLine delete
   */
  export type PayLedgerLineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerLine
     */
    select?: PayLedgerLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerLine
     */
    omit?: PayLedgerLineOmit<ExtArgs> | null
    /**
     * Filter which PayLedgerLine to delete.
     */
    where: PayLedgerLineWhereUniqueInput
  }

  /**
   * PayLedgerLine deleteMany
   */
  export type PayLedgerLineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayLedgerLines to delete
     */
    where?: PayLedgerLineWhereInput
    /**
     * Limit how many PayLedgerLines to delete.
     */
    limit?: number
  }

  /**
   * PayLedgerLine findRaw
   */
  export type PayLedgerLineFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayLedgerLine aggregateRaw
   */
  export type PayLedgerLineAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayLedgerLine without action
   */
  export type PayLedgerLineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayLedgerLine
     */
    select?: PayLedgerLineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayLedgerLine
     */
    omit?: PayLedgerLineOmit<ExtArgs> | null
  }


  /**
   * Model PayBooking
   */

  export type AggregatePayBooking = {
    _count: PayBookingCountAggregateOutputType | null
    _avg: PayBookingAvgAggregateOutputType | null
    _sum: PayBookingSumAggregateOutputType | null
    _min: PayBookingMinAggregateOutputType | null
    _max: PayBookingMaxAggregateOutputType | null
  }

  export type PayBookingAvgAggregateOutputType = {
    quantity: number | null
    rateCardItemVersion: number | null
    counterRound: number | null
    contactMaskedCount: number | null
    version: number | null
  }

  export type PayBookingSumAggregateOutputType = {
    quantity: number | null
    rateCardItemVersion: number | null
    counterRound: number | null
    contactMaskedCount: number | null
    version: number | null
  }

  export type PayBookingMinAggregateOutputType = {
    id: string | null
    bookingId: string | null
    brandId: string | null
    brandName: string | null
    creatorId: string | null
    creatorName: string | null
    creatorSlug: string | null
    status: string | null
    isOpen: boolean | null
    itemKind: string | null
    itemKey: string | null
    rateCardItemId: string | null
    packageId: string | null
    itemTitle: string | null
    pricingType: string | null
    selectedAddonsJson: string | null
    quantity: number | null
    deliveryDate: string | null
    brief: string | null
    referenceLinksJson: string | null
    assetIdsJson: string | null
    budgetNote: string | null
    quoteSnapshotJson: string | null
    feeConfigVersion: string | null
    rateCardItemVersion: number | null
    counterRound: number | null
    contactMaskedCount: number | null
    rejectionReason: string | null
    expiresAt: Date | null
    version: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayBookingMaxAggregateOutputType = {
    id: string | null
    bookingId: string | null
    brandId: string | null
    brandName: string | null
    creatorId: string | null
    creatorName: string | null
    creatorSlug: string | null
    status: string | null
    isOpen: boolean | null
    itemKind: string | null
    itemKey: string | null
    rateCardItemId: string | null
    packageId: string | null
    itemTitle: string | null
    pricingType: string | null
    selectedAddonsJson: string | null
    quantity: number | null
    deliveryDate: string | null
    brief: string | null
    referenceLinksJson: string | null
    assetIdsJson: string | null
    budgetNote: string | null
    quoteSnapshotJson: string | null
    feeConfigVersion: string | null
    rateCardItemVersion: number | null
    counterRound: number | null
    contactMaskedCount: number | null
    rejectionReason: string | null
    expiresAt: Date | null
    version: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayBookingCountAggregateOutputType = {
    id: number
    bookingId: number
    brandId: number
    brandName: number
    creatorId: number
    creatorName: number
    creatorSlug: number
    status: number
    isOpen: number
    itemKind: number
    itemKey: number
    rateCardItemId: number
    packageId: number
    itemTitle: number
    pricingType: number
    selectedAddonsJson: number
    quantity: number
    deliveryDate: number
    brief: number
    referenceLinksJson: number
    assetIdsJson: number
    budgetNote: number
    quoteSnapshotJson: number
    feeConfigVersion: number
    rateCardItemVersion: number
    counterRound: number
    contactMaskedCount: number
    rejectionReason: number
    expiresAt: number
    version: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PayBookingAvgAggregateInputType = {
    quantity?: true
    rateCardItemVersion?: true
    counterRound?: true
    contactMaskedCount?: true
    version?: true
  }

  export type PayBookingSumAggregateInputType = {
    quantity?: true
    rateCardItemVersion?: true
    counterRound?: true
    contactMaskedCount?: true
    version?: true
  }

  export type PayBookingMinAggregateInputType = {
    id?: true
    bookingId?: true
    brandId?: true
    brandName?: true
    creatorId?: true
    creatorName?: true
    creatorSlug?: true
    status?: true
    isOpen?: true
    itemKind?: true
    itemKey?: true
    rateCardItemId?: true
    packageId?: true
    itemTitle?: true
    pricingType?: true
    selectedAddonsJson?: true
    quantity?: true
    deliveryDate?: true
    brief?: true
    referenceLinksJson?: true
    assetIdsJson?: true
    budgetNote?: true
    quoteSnapshotJson?: true
    feeConfigVersion?: true
    rateCardItemVersion?: true
    counterRound?: true
    contactMaskedCount?: true
    rejectionReason?: true
    expiresAt?: true
    version?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayBookingMaxAggregateInputType = {
    id?: true
    bookingId?: true
    brandId?: true
    brandName?: true
    creatorId?: true
    creatorName?: true
    creatorSlug?: true
    status?: true
    isOpen?: true
    itemKind?: true
    itemKey?: true
    rateCardItemId?: true
    packageId?: true
    itemTitle?: true
    pricingType?: true
    selectedAddonsJson?: true
    quantity?: true
    deliveryDate?: true
    brief?: true
    referenceLinksJson?: true
    assetIdsJson?: true
    budgetNote?: true
    quoteSnapshotJson?: true
    feeConfigVersion?: true
    rateCardItemVersion?: true
    counterRound?: true
    contactMaskedCount?: true
    rejectionReason?: true
    expiresAt?: true
    version?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayBookingCountAggregateInputType = {
    id?: true
    bookingId?: true
    brandId?: true
    brandName?: true
    creatorId?: true
    creatorName?: true
    creatorSlug?: true
    status?: true
    isOpen?: true
    itemKind?: true
    itemKey?: true
    rateCardItemId?: true
    packageId?: true
    itemTitle?: true
    pricingType?: true
    selectedAddonsJson?: true
    quantity?: true
    deliveryDate?: true
    brief?: true
    referenceLinksJson?: true
    assetIdsJson?: true
    budgetNote?: true
    quoteSnapshotJson?: true
    feeConfigVersion?: true
    rateCardItemVersion?: true
    counterRound?: true
    contactMaskedCount?: true
    rejectionReason?: true
    expiresAt?: true
    version?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PayBookingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayBooking to aggregate.
     */
    where?: PayBookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayBookings to fetch.
     */
    orderBy?: PayBookingOrderByWithRelationInput | PayBookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayBookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayBookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayBookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayBookings
    **/
    _count?: true | PayBookingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayBookingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayBookingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayBookingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayBookingMaxAggregateInputType
  }

  export type GetPayBookingAggregateType<T extends PayBookingAggregateArgs> = {
        [P in keyof T & keyof AggregatePayBooking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayBooking[P]>
      : GetScalarType<T[P], AggregatePayBooking[P]>
  }




  export type PayBookingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayBookingWhereInput
    orderBy?: PayBookingOrderByWithAggregationInput | PayBookingOrderByWithAggregationInput[]
    by: PayBookingScalarFieldEnum[] | PayBookingScalarFieldEnum
    having?: PayBookingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayBookingCountAggregateInputType | true
    _avg?: PayBookingAvgAggregateInputType
    _sum?: PayBookingSumAggregateInputType
    _min?: PayBookingMinAggregateInputType
    _max?: PayBookingMaxAggregateInputType
  }

  export type PayBookingGroupByOutputType = {
    id: string
    bookingId: string
    brandId: string
    brandName: string
    creatorId: string
    creatorName: string
    creatorSlug: string | null
    status: string
    isOpen: boolean
    itemKind: string
    itemKey: string
    rateCardItemId: string | null
    packageId: string | null
    itemTitle: string
    pricingType: string
    selectedAddonsJson: string
    quantity: number
    deliveryDate: string
    brief: string
    referenceLinksJson: string
    assetIdsJson: string
    budgetNote: string | null
    quoteSnapshotJson: string
    feeConfigVersion: string
    rateCardItemVersion: number
    counterRound: number
    contactMaskedCount: number
    rejectionReason: string | null
    expiresAt: Date
    version: number
    createdAt: Date
    updatedAt: Date
    _count: PayBookingCountAggregateOutputType | null
    _avg: PayBookingAvgAggregateOutputType | null
    _sum: PayBookingSumAggregateOutputType | null
    _min: PayBookingMinAggregateOutputType | null
    _max: PayBookingMaxAggregateOutputType | null
  }

  type GetPayBookingGroupByPayload<T extends PayBookingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayBookingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayBookingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayBookingGroupByOutputType[P]>
            : GetScalarType<T[P], PayBookingGroupByOutputType[P]>
        }
      >
    >


  export type PayBookingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    brandId?: boolean
    brandName?: boolean
    creatorId?: boolean
    creatorName?: boolean
    creatorSlug?: boolean
    status?: boolean
    isOpen?: boolean
    itemKind?: boolean
    itemKey?: boolean
    rateCardItemId?: boolean
    packageId?: boolean
    itemTitle?: boolean
    pricingType?: boolean
    selectedAddonsJson?: boolean
    quantity?: boolean
    deliveryDate?: boolean
    brief?: boolean
    referenceLinksJson?: boolean
    assetIdsJson?: boolean
    budgetNote?: boolean
    quoteSnapshotJson?: boolean
    feeConfigVersion?: boolean
    rateCardItemVersion?: boolean
    counterRound?: boolean
    contactMaskedCount?: boolean
    rejectionReason?: boolean
    expiresAt?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["payBooking"]>



  export type PayBookingSelectScalar = {
    id?: boolean
    bookingId?: boolean
    brandId?: boolean
    brandName?: boolean
    creatorId?: boolean
    creatorName?: boolean
    creatorSlug?: boolean
    status?: boolean
    isOpen?: boolean
    itemKind?: boolean
    itemKey?: boolean
    rateCardItemId?: boolean
    packageId?: boolean
    itemTitle?: boolean
    pricingType?: boolean
    selectedAddonsJson?: boolean
    quantity?: boolean
    deliveryDate?: boolean
    brief?: boolean
    referenceLinksJson?: boolean
    assetIdsJson?: boolean
    budgetNote?: boolean
    quoteSnapshotJson?: boolean
    feeConfigVersion?: boolean
    rateCardItemVersion?: boolean
    counterRound?: boolean
    contactMaskedCount?: boolean
    rejectionReason?: boolean
    expiresAt?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PayBookingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bookingId" | "brandId" | "brandName" | "creatorId" | "creatorName" | "creatorSlug" | "status" | "isOpen" | "itemKind" | "itemKey" | "rateCardItemId" | "packageId" | "itemTitle" | "pricingType" | "selectedAddonsJson" | "quantity" | "deliveryDate" | "brief" | "referenceLinksJson" | "assetIdsJson" | "budgetNote" | "quoteSnapshotJson" | "feeConfigVersion" | "rateCardItemVersion" | "counterRound" | "contactMaskedCount" | "rejectionReason" | "expiresAt" | "version" | "createdAt" | "updatedAt", ExtArgs["result"]["payBooking"]>

  export type $PayBookingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayBooking"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bookingId: string
      brandId: string
      brandName: string
      creatorId: string
      creatorName: string
      creatorSlug: string | null
      status: string
      isOpen: boolean
      itemKind: string
      itemKey: string
      rateCardItemId: string | null
      packageId: string | null
      itemTitle: string
      pricingType: string
      selectedAddonsJson: string
      quantity: number
      deliveryDate: string
      brief: string
      referenceLinksJson: string
      assetIdsJson: string
      budgetNote: string | null
      quoteSnapshotJson: string
      feeConfigVersion: string
      rateCardItemVersion: number
      counterRound: number
      contactMaskedCount: number
      rejectionReason: string | null
      expiresAt: Date
      version: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["payBooking"]>
    composites: {}
  }

  type PayBookingGetPayload<S extends boolean | null | undefined | PayBookingDefaultArgs> = $Result.GetResult<Prisma.$PayBookingPayload, S>

  type PayBookingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayBookingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayBookingCountAggregateInputType | true
    }

  export interface PayBookingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayBooking'], meta: { name: 'PayBooking' } }
    /**
     * Find zero or one PayBooking that matches the filter.
     * @param {PayBookingFindUniqueArgs} args - Arguments to find a PayBooking
     * @example
     * // Get one PayBooking
     * const payBooking = await prisma.payBooking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayBookingFindUniqueArgs>(args: SelectSubset<T, PayBookingFindUniqueArgs<ExtArgs>>): Prisma__PayBookingClient<$Result.GetResult<Prisma.$PayBookingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayBooking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayBookingFindUniqueOrThrowArgs} args - Arguments to find a PayBooking
     * @example
     * // Get one PayBooking
     * const payBooking = await prisma.payBooking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayBookingFindUniqueOrThrowArgs>(args: SelectSubset<T, PayBookingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayBookingClient<$Result.GetResult<Prisma.$PayBookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayBooking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingFindFirstArgs} args - Arguments to find a PayBooking
     * @example
     * // Get one PayBooking
     * const payBooking = await prisma.payBooking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayBookingFindFirstArgs>(args?: SelectSubset<T, PayBookingFindFirstArgs<ExtArgs>>): Prisma__PayBookingClient<$Result.GetResult<Prisma.$PayBookingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayBooking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingFindFirstOrThrowArgs} args - Arguments to find a PayBooking
     * @example
     * // Get one PayBooking
     * const payBooking = await prisma.payBooking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayBookingFindFirstOrThrowArgs>(args?: SelectSubset<T, PayBookingFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayBookingClient<$Result.GetResult<Prisma.$PayBookingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayBookings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayBookings
     * const payBookings = await prisma.payBooking.findMany()
     * 
     * // Get first 10 PayBookings
     * const payBookings = await prisma.payBooking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payBookingWithIdOnly = await prisma.payBooking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayBookingFindManyArgs>(args?: SelectSubset<T, PayBookingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayBookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayBooking.
     * @param {PayBookingCreateArgs} args - Arguments to create a PayBooking.
     * @example
     * // Create one PayBooking
     * const PayBooking = await prisma.payBooking.create({
     *   data: {
     *     // ... data to create a PayBooking
     *   }
     * })
     * 
     */
    create<T extends PayBookingCreateArgs>(args: SelectSubset<T, PayBookingCreateArgs<ExtArgs>>): Prisma__PayBookingClient<$Result.GetResult<Prisma.$PayBookingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayBookings.
     * @param {PayBookingCreateManyArgs} args - Arguments to create many PayBookings.
     * @example
     * // Create many PayBookings
     * const payBooking = await prisma.payBooking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayBookingCreateManyArgs>(args?: SelectSubset<T, PayBookingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayBooking.
     * @param {PayBookingDeleteArgs} args - Arguments to delete one PayBooking.
     * @example
     * // Delete one PayBooking
     * const PayBooking = await prisma.payBooking.delete({
     *   where: {
     *     // ... filter to delete one PayBooking
     *   }
     * })
     * 
     */
    delete<T extends PayBookingDeleteArgs>(args: SelectSubset<T, PayBookingDeleteArgs<ExtArgs>>): Prisma__PayBookingClient<$Result.GetResult<Prisma.$PayBookingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayBooking.
     * @param {PayBookingUpdateArgs} args - Arguments to update one PayBooking.
     * @example
     * // Update one PayBooking
     * const payBooking = await prisma.payBooking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayBookingUpdateArgs>(args: SelectSubset<T, PayBookingUpdateArgs<ExtArgs>>): Prisma__PayBookingClient<$Result.GetResult<Prisma.$PayBookingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayBookings.
     * @param {PayBookingDeleteManyArgs} args - Arguments to filter PayBookings to delete.
     * @example
     * // Delete a few PayBookings
     * const { count } = await prisma.payBooking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayBookingDeleteManyArgs>(args?: SelectSubset<T, PayBookingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayBookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayBookings
     * const payBooking = await prisma.payBooking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayBookingUpdateManyArgs>(args: SelectSubset<T, PayBookingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayBooking.
     * @param {PayBookingUpsertArgs} args - Arguments to update or create a PayBooking.
     * @example
     * // Update or create a PayBooking
     * const payBooking = await prisma.payBooking.upsert({
     *   create: {
     *     // ... data to create a PayBooking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayBooking we want to update
     *   }
     * })
     */
    upsert<T extends PayBookingUpsertArgs>(args: SelectSubset<T, PayBookingUpsertArgs<ExtArgs>>): Prisma__PayBookingClient<$Result.GetResult<Prisma.$PayBookingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayBookings that matches the filter.
     * @param {PayBookingFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payBooking = await prisma.payBooking.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayBookingFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayBooking.
     * @param {PayBookingAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payBooking = await prisma.payBooking.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayBookingAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayBookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingCountArgs} args - Arguments to filter PayBookings to count.
     * @example
     * // Count the number of PayBookings
     * const count = await prisma.payBooking.count({
     *   where: {
     *     // ... the filter for the PayBookings we want to count
     *   }
     * })
    **/
    count<T extends PayBookingCountArgs>(
      args?: Subset<T, PayBookingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayBookingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayBooking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayBookingAggregateArgs>(args: Subset<T, PayBookingAggregateArgs>): Prisma.PrismaPromise<GetPayBookingAggregateType<T>>

    /**
     * Group by PayBooking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayBookingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayBookingGroupByArgs['orderBy'] }
        : { orderBy?: PayBookingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayBookingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayBookingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayBooking model
   */
  readonly fields: PayBookingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayBooking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayBookingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayBooking model
   */
  interface PayBookingFieldRefs {
    readonly id: FieldRef<"PayBooking", 'String'>
    readonly bookingId: FieldRef<"PayBooking", 'String'>
    readonly brandId: FieldRef<"PayBooking", 'String'>
    readonly brandName: FieldRef<"PayBooking", 'String'>
    readonly creatorId: FieldRef<"PayBooking", 'String'>
    readonly creatorName: FieldRef<"PayBooking", 'String'>
    readonly creatorSlug: FieldRef<"PayBooking", 'String'>
    readonly status: FieldRef<"PayBooking", 'String'>
    readonly isOpen: FieldRef<"PayBooking", 'Boolean'>
    readonly itemKind: FieldRef<"PayBooking", 'String'>
    readonly itemKey: FieldRef<"PayBooking", 'String'>
    readonly rateCardItemId: FieldRef<"PayBooking", 'String'>
    readonly packageId: FieldRef<"PayBooking", 'String'>
    readonly itemTitle: FieldRef<"PayBooking", 'String'>
    readonly pricingType: FieldRef<"PayBooking", 'String'>
    readonly selectedAddonsJson: FieldRef<"PayBooking", 'String'>
    readonly quantity: FieldRef<"PayBooking", 'Int'>
    readonly deliveryDate: FieldRef<"PayBooking", 'String'>
    readonly brief: FieldRef<"PayBooking", 'String'>
    readonly referenceLinksJson: FieldRef<"PayBooking", 'String'>
    readonly assetIdsJson: FieldRef<"PayBooking", 'String'>
    readonly budgetNote: FieldRef<"PayBooking", 'String'>
    readonly quoteSnapshotJson: FieldRef<"PayBooking", 'String'>
    readonly feeConfigVersion: FieldRef<"PayBooking", 'String'>
    readonly rateCardItemVersion: FieldRef<"PayBooking", 'Int'>
    readonly counterRound: FieldRef<"PayBooking", 'Int'>
    readonly contactMaskedCount: FieldRef<"PayBooking", 'Int'>
    readonly rejectionReason: FieldRef<"PayBooking", 'String'>
    readonly expiresAt: FieldRef<"PayBooking", 'DateTime'>
    readonly version: FieldRef<"PayBooking", 'Int'>
    readonly createdAt: FieldRef<"PayBooking", 'DateTime'>
    readonly updatedAt: FieldRef<"PayBooking", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayBooking findUnique
   */
  export type PayBookingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBooking
     */
    select?: PayBookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBooking
     */
    omit?: PayBookingOmit<ExtArgs> | null
    /**
     * Filter, which PayBooking to fetch.
     */
    where: PayBookingWhereUniqueInput
  }

  /**
   * PayBooking findUniqueOrThrow
   */
  export type PayBookingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBooking
     */
    select?: PayBookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBooking
     */
    omit?: PayBookingOmit<ExtArgs> | null
    /**
     * Filter, which PayBooking to fetch.
     */
    where: PayBookingWhereUniqueInput
  }

  /**
   * PayBooking findFirst
   */
  export type PayBookingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBooking
     */
    select?: PayBookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBooking
     */
    omit?: PayBookingOmit<ExtArgs> | null
    /**
     * Filter, which PayBooking to fetch.
     */
    where?: PayBookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayBookings to fetch.
     */
    orderBy?: PayBookingOrderByWithRelationInput | PayBookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayBookings.
     */
    cursor?: PayBookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayBookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayBookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayBookings.
     */
    distinct?: PayBookingScalarFieldEnum | PayBookingScalarFieldEnum[]
  }

  /**
   * PayBooking findFirstOrThrow
   */
  export type PayBookingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBooking
     */
    select?: PayBookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBooking
     */
    omit?: PayBookingOmit<ExtArgs> | null
    /**
     * Filter, which PayBooking to fetch.
     */
    where?: PayBookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayBookings to fetch.
     */
    orderBy?: PayBookingOrderByWithRelationInput | PayBookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayBookings.
     */
    cursor?: PayBookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayBookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayBookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayBookings.
     */
    distinct?: PayBookingScalarFieldEnum | PayBookingScalarFieldEnum[]
  }

  /**
   * PayBooking findMany
   */
  export type PayBookingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBooking
     */
    select?: PayBookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBooking
     */
    omit?: PayBookingOmit<ExtArgs> | null
    /**
     * Filter, which PayBookings to fetch.
     */
    where?: PayBookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayBookings to fetch.
     */
    orderBy?: PayBookingOrderByWithRelationInput | PayBookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayBookings.
     */
    cursor?: PayBookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayBookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayBookings.
     */
    skip?: number
    distinct?: PayBookingScalarFieldEnum | PayBookingScalarFieldEnum[]
  }

  /**
   * PayBooking create
   */
  export type PayBookingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBooking
     */
    select?: PayBookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBooking
     */
    omit?: PayBookingOmit<ExtArgs> | null
    /**
     * The data needed to create a PayBooking.
     */
    data: XOR<PayBookingCreateInput, PayBookingUncheckedCreateInput>
  }

  /**
   * PayBooking createMany
   */
  export type PayBookingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayBookings.
     */
    data: PayBookingCreateManyInput | PayBookingCreateManyInput[]
  }

  /**
   * PayBooking update
   */
  export type PayBookingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBooking
     */
    select?: PayBookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBooking
     */
    omit?: PayBookingOmit<ExtArgs> | null
    /**
     * The data needed to update a PayBooking.
     */
    data: XOR<PayBookingUpdateInput, PayBookingUncheckedUpdateInput>
    /**
     * Choose, which PayBooking to update.
     */
    where: PayBookingWhereUniqueInput
  }

  /**
   * PayBooking updateMany
   */
  export type PayBookingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayBookings.
     */
    data: XOR<PayBookingUpdateManyMutationInput, PayBookingUncheckedUpdateManyInput>
    /**
     * Filter which PayBookings to update
     */
    where?: PayBookingWhereInput
    /**
     * Limit how many PayBookings to update.
     */
    limit?: number
  }

  /**
   * PayBooking upsert
   */
  export type PayBookingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBooking
     */
    select?: PayBookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBooking
     */
    omit?: PayBookingOmit<ExtArgs> | null
    /**
     * The filter to search for the PayBooking to update in case it exists.
     */
    where: PayBookingWhereUniqueInput
    /**
     * In case the PayBooking found by the `where` argument doesn't exist, create a new PayBooking with this data.
     */
    create: XOR<PayBookingCreateInput, PayBookingUncheckedCreateInput>
    /**
     * In case the PayBooking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayBookingUpdateInput, PayBookingUncheckedUpdateInput>
  }

  /**
   * PayBooking delete
   */
  export type PayBookingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBooking
     */
    select?: PayBookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBooking
     */
    omit?: PayBookingOmit<ExtArgs> | null
    /**
     * Filter which PayBooking to delete.
     */
    where: PayBookingWhereUniqueInput
  }

  /**
   * PayBooking deleteMany
   */
  export type PayBookingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayBookings to delete
     */
    where?: PayBookingWhereInput
    /**
     * Limit how many PayBookings to delete.
     */
    limit?: number
  }

  /**
   * PayBooking findRaw
   */
  export type PayBookingFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayBooking aggregateRaw
   */
  export type PayBookingAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayBooking without action
   */
  export type PayBookingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBooking
     */
    select?: PayBookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBooking
     */
    omit?: PayBookingOmit<ExtArgs> | null
  }


  /**
   * Model PayBookingEvent
   */

  export type AggregatePayBookingEvent = {
    _count: PayBookingEventCountAggregateOutputType | null
    _min: PayBookingEventMinAggregateOutputType | null
    _max: PayBookingEventMaxAggregateOutputType | null
  }

  export type PayBookingEventMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    bookingId: string | null
    eventType: string | null
    actorId: string | null
    actorRole: string | null
    fromStatus: string | null
    toStatus: string | null
    reason: string | null
    counterDeltaJson: string | null
    createdAt: Date | null
  }

  export type PayBookingEventMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    bookingId: string | null
    eventType: string | null
    actorId: string | null
    actorRole: string | null
    fromStatus: string | null
    toStatus: string | null
    reason: string | null
    counterDeltaJson: string | null
    createdAt: Date | null
  }

  export type PayBookingEventCountAggregateOutputType = {
    id: number
    eventId: number
    bookingId: number
    eventType: number
    actorId: number
    actorRole: number
    fromStatus: number
    toStatus: number
    reason: number
    counterDeltaJson: number
    createdAt: number
    _all: number
  }


  export type PayBookingEventMinAggregateInputType = {
    id?: true
    eventId?: true
    bookingId?: true
    eventType?: true
    actorId?: true
    actorRole?: true
    fromStatus?: true
    toStatus?: true
    reason?: true
    counterDeltaJson?: true
    createdAt?: true
  }

  export type PayBookingEventMaxAggregateInputType = {
    id?: true
    eventId?: true
    bookingId?: true
    eventType?: true
    actorId?: true
    actorRole?: true
    fromStatus?: true
    toStatus?: true
    reason?: true
    counterDeltaJson?: true
    createdAt?: true
  }

  export type PayBookingEventCountAggregateInputType = {
    id?: true
    eventId?: true
    bookingId?: true
    eventType?: true
    actorId?: true
    actorRole?: true
    fromStatus?: true
    toStatus?: true
    reason?: true
    counterDeltaJson?: true
    createdAt?: true
    _all?: true
  }

  export type PayBookingEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayBookingEvent to aggregate.
     */
    where?: PayBookingEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayBookingEvents to fetch.
     */
    orderBy?: PayBookingEventOrderByWithRelationInput | PayBookingEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayBookingEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayBookingEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayBookingEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayBookingEvents
    **/
    _count?: true | PayBookingEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayBookingEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayBookingEventMaxAggregateInputType
  }

  export type GetPayBookingEventAggregateType<T extends PayBookingEventAggregateArgs> = {
        [P in keyof T & keyof AggregatePayBookingEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayBookingEvent[P]>
      : GetScalarType<T[P], AggregatePayBookingEvent[P]>
  }




  export type PayBookingEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayBookingEventWhereInput
    orderBy?: PayBookingEventOrderByWithAggregationInput | PayBookingEventOrderByWithAggregationInput[]
    by: PayBookingEventScalarFieldEnum[] | PayBookingEventScalarFieldEnum
    having?: PayBookingEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayBookingEventCountAggregateInputType | true
    _min?: PayBookingEventMinAggregateInputType
    _max?: PayBookingEventMaxAggregateInputType
  }

  export type PayBookingEventGroupByOutputType = {
    id: string
    eventId: string
    bookingId: string
    eventType: string
    actorId: string
    actorRole: string
    fromStatus: string | null
    toStatus: string
    reason: string | null
    counterDeltaJson: string | null
    createdAt: Date
    _count: PayBookingEventCountAggregateOutputType | null
    _min: PayBookingEventMinAggregateOutputType | null
    _max: PayBookingEventMaxAggregateOutputType | null
  }

  type GetPayBookingEventGroupByPayload<T extends PayBookingEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayBookingEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayBookingEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayBookingEventGroupByOutputType[P]>
            : GetScalarType<T[P], PayBookingEventGroupByOutputType[P]>
        }
      >
    >


  export type PayBookingEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    bookingId?: boolean
    eventType?: boolean
    actorId?: boolean
    actorRole?: boolean
    fromStatus?: boolean
    toStatus?: boolean
    reason?: boolean
    counterDeltaJson?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["payBookingEvent"]>



  export type PayBookingEventSelectScalar = {
    id?: boolean
    eventId?: boolean
    bookingId?: boolean
    eventType?: boolean
    actorId?: boolean
    actorRole?: boolean
    fromStatus?: boolean
    toStatus?: boolean
    reason?: boolean
    counterDeltaJson?: boolean
    createdAt?: boolean
  }

  export type PayBookingEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eventId" | "bookingId" | "eventType" | "actorId" | "actorRole" | "fromStatus" | "toStatus" | "reason" | "counterDeltaJson" | "createdAt", ExtArgs["result"]["payBookingEvent"]>

  export type $PayBookingEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayBookingEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      bookingId: string
      eventType: string
      actorId: string
      actorRole: string
      fromStatus: string | null
      toStatus: string
      reason: string | null
      counterDeltaJson: string | null
      createdAt: Date
    }, ExtArgs["result"]["payBookingEvent"]>
    composites: {}
  }

  type PayBookingEventGetPayload<S extends boolean | null | undefined | PayBookingEventDefaultArgs> = $Result.GetResult<Prisma.$PayBookingEventPayload, S>

  type PayBookingEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayBookingEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayBookingEventCountAggregateInputType | true
    }

  export interface PayBookingEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayBookingEvent'], meta: { name: 'PayBookingEvent' } }
    /**
     * Find zero or one PayBookingEvent that matches the filter.
     * @param {PayBookingEventFindUniqueArgs} args - Arguments to find a PayBookingEvent
     * @example
     * // Get one PayBookingEvent
     * const payBookingEvent = await prisma.payBookingEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayBookingEventFindUniqueArgs>(args: SelectSubset<T, PayBookingEventFindUniqueArgs<ExtArgs>>): Prisma__PayBookingEventClient<$Result.GetResult<Prisma.$PayBookingEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayBookingEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayBookingEventFindUniqueOrThrowArgs} args - Arguments to find a PayBookingEvent
     * @example
     * // Get one PayBookingEvent
     * const payBookingEvent = await prisma.payBookingEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayBookingEventFindUniqueOrThrowArgs>(args: SelectSubset<T, PayBookingEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayBookingEventClient<$Result.GetResult<Prisma.$PayBookingEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayBookingEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingEventFindFirstArgs} args - Arguments to find a PayBookingEvent
     * @example
     * // Get one PayBookingEvent
     * const payBookingEvent = await prisma.payBookingEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayBookingEventFindFirstArgs>(args?: SelectSubset<T, PayBookingEventFindFirstArgs<ExtArgs>>): Prisma__PayBookingEventClient<$Result.GetResult<Prisma.$PayBookingEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayBookingEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingEventFindFirstOrThrowArgs} args - Arguments to find a PayBookingEvent
     * @example
     * // Get one PayBookingEvent
     * const payBookingEvent = await prisma.payBookingEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayBookingEventFindFirstOrThrowArgs>(args?: SelectSubset<T, PayBookingEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayBookingEventClient<$Result.GetResult<Prisma.$PayBookingEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayBookingEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayBookingEvents
     * const payBookingEvents = await prisma.payBookingEvent.findMany()
     * 
     * // Get first 10 PayBookingEvents
     * const payBookingEvents = await prisma.payBookingEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payBookingEventWithIdOnly = await prisma.payBookingEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayBookingEventFindManyArgs>(args?: SelectSubset<T, PayBookingEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayBookingEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayBookingEvent.
     * @param {PayBookingEventCreateArgs} args - Arguments to create a PayBookingEvent.
     * @example
     * // Create one PayBookingEvent
     * const PayBookingEvent = await prisma.payBookingEvent.create({
     *   data: {
     *     // ... data to create a PayBookingEvent
     *   }
     * })
     * 
     */
    create<T extends PayBookingEventCreateArgs>(args: SelectSubset<T, PayBookingEventCreateArgs<ExtArgs>>): Prisma__PayBookingEventClient<$Result.GetResult<Prisma.$PayBookingEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayBookingEvents.
     * @param {PayBookingEventCreateManyArgs} args - Arguments to create many PayBookingEvents.
     * @example
     * // Create many PayBookingEvents
     * const payBookingEvent = await prisma.payBookingEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayBookingEventCreateManyArgs>(args?: SelectSubset<T, PayBookingEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayBookingEvent.
     * @param {PayBookingEventDeleteArgs} args - Arguments to delete one PayBookingEvent.
     * @example
     * // Delete one PayBookingEvent
     * const PayBookingEvent = await prisma.payBookingEvent.delete({
     *   where: {
     *     // ... filter to delete one PayBookingEvent
     *   }
     * })
     * 
     */
    delete<T extends PayBookingEventDeleteArgs>(args: SelectSubset<T, PayBookingEventDeleteArgs<ExtArgs>>): Prisma__PayBookingEventClient<$Result.GetResult<Prisma.$PayBookingEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayBookingEvent.
     * @param {PayBookingEventUpdateArgs} args - Arguments to update one PayBookingEvent.
     * @example
     * // Update one PayBookingEvent
     * const payBookingEvent = await prisma.payBookingEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayBookingEventUpdateArgs>(args: SelectSubset<T, PayBookingEventUpdateArgs<ExtArgs>>): Prisma__PayBookingEventClient<$Result.GetResult<Prisma.$PayBookingEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayBookingEvents.
     * @param {PayBookingEventDeleteManyArgs} args - Arguments to filter PayBookingEvents to delete.
     * @example
     * // Delete a few PayBookingEvents
     * const { count } = await prisma.payBookingEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayBookingEventDeleteManyArgs>(args?: SelectSubset<T, PayBookingEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayBookingEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayBookingEvents
     * const payBookingEvent = await prisma.payBookingEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayBookingEventUpdateManyArgs>(args: SelectSubset<T, PayBookingEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayBookingEvent.
     * @param {PayBookingEventUpsertArgs} args - Arguments to update or create a PayBookingEvent.
     * @example
     * // Update or create a PayBookingEvent
     * const payBookingEvent = await prisma.payBookingEvent.upsert({
     *   create: {
     *     // ... data to create a PayBookingEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayBookingEvent we want to update
     *   }
     * })
     */
    upsert<T extends PayBookingEventUpsertArgs>(args: SelectSubset<T, PayBookingEventUpsertArgs<ExtArgs>>): Prisma__PayBookingEventClient<$Result.GetResult<Prisma.$PayBookingEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayBookingEvents that matches the filter.
     * @param {PayBookingEventFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payBookingEvent = await prisma.payBookingEvent.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayBookingEventFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayBookingEvent.
     * @param {PayBookingEventAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payBookingEvent = await prisma.payBookingEvent.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayBookingEventAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayBookingEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingEventCountArgs} args - Arguments to filter PayBookingEvents to count.
     * @example
     * // Count the number of PayBookingEvents
     * const count = await prisma.payBookingEvent.count({
     *   where: {
     *     // ... the filter for the PayBookingEvents we want to count
     *   }
     * })
    **/
    count<T extends PayBookingEventCountArgs>(
      args?: Subset<T, PayBookingEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayBookingEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayBookingEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayBookingEventAggregateArgs>(args: Subset<T, PayBookingEventAggregateArgs>): Prisma.PrismaPromise<GetPayBookingEventAggregateType<T>>

    /**
     * Group by PayBookingEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayBookingEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayBookingEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayBookingEventGroupByArgs['orderBy'] }
        : { orderBy?: PayBookingEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayBookingEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayBookingEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayBookingEvent model
   */
  readonly fields: PayBookingEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayBookingEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayBookingEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayBookingEvent model
   */
  interface PayBookingEventFieldRefs {
    readonly id: FieldRef<"PayBookingEvent", 'String'>
    readonly eventId: FieldRef<"PayBookingEvent", 'String'>
    readonly bookingId: FieldRef<"PayBookingEvent", 'String'>
    readonly eventType: FieldRef<"PayBookingEvent", 'String'>
    readonly actorId: FieldRef<"PayBookingEvent", 'String'>
    readonly actorRole: FieldRef<"PayBookingEvent", 'String'>
    readonly fromStatus: FieldRef<"PayBookingEvent", 'String'>
    readonly toStatus: FieldRef<"PayBookingEvent", 'String'>
    readonly reason: FieldRef<"PayBookingEvent", 'String'>
    readonly counterDeltaJson: FieldRef<"PayBookingEvent", 'String'>
    readonly createdAt: FieldRef<"PayBookingEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayBookingEvent findUnique
   */
  export type PayBookingEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBookingEvent
     */
    select?: PayBookingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBookingEvent
     */
    omit?: PayBookingEventOmit<ExtArgs> | null
    /**
     * Filter, which PayBookingEvent to fetch.
     */
    where: PayBookingEventWhereUniqueInput
  }

  /**
   * PayBookingEvent findUniqueOrThrow
   */
  export type PayBookingEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBookingEvent
     */
    select?: PayBookingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBookingEvent
     */
    omit?: PayBookingEventOmit<ExtArgs> | null
    /**
     * Filter, which PayBookingEvent to fetch.
     */
    where: PayBookingEventWhereUniqueInput
  }

  /**
   * PayBookingEvent findFirst
   */
  export type PayBookingEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBookingEvent
     */
    select?: PayBookingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBookingEvent
     */
    omit?: PayBookingEventOmit<ExtArgs> | null
    /**
     * Filter, which PayBookingEvent to fetch.
     */
    where?: PayBookingEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayBookingEvents to fetch.
     */
    orderBy?: PayBookingEventOrderByWithRelationInput | PayBookingEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayBookingEvents.
     */
    cursor?: PayBookingEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayBookingEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayBookingEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayBookingEvents.
     */
    distinct?: PayBookingEventScalarFieldEnum | PayBookingEventScalarFieldEnum[]
  }

  /**
   * PayBookingEvent findFirstOrThrow
   */
  export type PayBookingEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBookingEvent
     */
    select?: PayBookingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBookingEvent
     */
    omit?: PayBookingEventOmit<ExtArgs> | null
    /**
     * Filter, which PayBookingEvent to fetch.
     */
    where?: PayBookingEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayBookingEvents to fetch.
     */
    orderBy?: PayBookingEventOrderByWithRelationInput | PayBookingEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayBookingEvents.
     */
    cursor?: PayBookingEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayBookingEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayBookingEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayBookingEvents.
     */
    distinct?: PayBookingEventScalarFieldEnum | PayBookingEventScalarFieldEnum[]
  }

  /**
   * PayBookingEvent findMany
   */
  export type PayBookingEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBookingEvent
     */
    select?: PayBookingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBookingEvent
     */
    omit?: PayBookingEventOmit<ExtArgs> | null
    /**
     * Filter, which PayBookingEvents to fetch.
     */
    where?: PayBookingEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayBookingEvents to fetch.
     */
    orderBy?: PayBookingEventOrderByWithRelationInput | PayBookingEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayBookingEvents.
     */
    cursor?: PayBookingEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayBookingEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayBookingEvents.
     */
    skip?: number
    distinct?: PayBookingEventScalarFieldEnum | PayBookingEventScalarFieldEnum[]
  }

  /**
   * PayBookingEvent create
   */
  export type PayBookingEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBookingEvent
     */
    select?: PayBookingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBookingEvent
     */
    omit?: PayBookingEventOmit<ExtArgs> | null
    /**
     * The data needed to create a PayBookingEvent.
     */
    data: XOR<PayBookingEventCreateInput, PayBookingEventUncheckedCreateInput>
  }

  /**
   * PayBookingEvent createMany
   */
  export type PayBookingEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayBookingEvents.
     */
    data: PayBookingEventCreateManyInput | PayBookingEventCreateManyInput[]
  }

  /**
   * PayBookingEvent update
   */
  export type PayBookingEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBookingEvent
     */
    select?: PayBookingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBookingEvent
     */
    omit?: PayBookingEventOmit<ExtArgs> | null
    /**
     * The data needed to update a PayBookingEvent.
     */
    data: XOR<PayBookingEventUpdateInput, PayBookingEventUncheckedUpdateInput>
    /**
     * Choose, which PayBookingEvent to update.
     */
    where: PayBookingEventWhereUniqueInput
  }

  /**
   * PayBookingEvent updateMany
   */
  export type PayBookingEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayBookingEvents.
     */
    data: XOR<PayBookingEventUpdateManyMutationInput, PayBookingEventUncheckedUpdateManyInput>
    /**
     * Filter which PayBookingEvents to update
     */
    where?: PayBookingEventWhereInput
    /**
     * Limit how many PayBookingEvents to update.
     */
    limit?: number
  }

  /**
   * PayBookingEvent upsert
   */
  export type PayBookingEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBookingEvent
     */
    select?: PayBookingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBookingEvent
     */
    omit?: PayBookingEventOmit<ExtArgs> | null
    /**
     * The filter to search for the PayBookingEvent to update in case it exists.
     */
    where: PayBookingEventWhereUniqueInput
    /**
     * In case the PayBookingEvent found by the `where` argument doesn't exist, create a new PayBookingEvent with this data.
     */
    create: XOR<PayBookingEventCreateInput, PayBookingEventUncheckedCreateInput>
    /**
     * In case the PayBookingEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayBookingEventUpdateInput, PayBookingEventUncheckedUpdateInput>
  }

  /**
   * PayBookingEvent delete
   */
  export type PayBookingEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBookingEvent
     */
    select?: PayBookingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBookingEvent
     */
    omit?: PayBookingEventOmit<ExtArgs> | null
    /**
     * Filter which PayBookingEvent to delete.
     */
    where: PayBookingEventWhereUniqueInput
  }

  /**
   * PayBookingEvent deleteMany
   */
  export type PayBookingEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayBookingEvents to delete
     */
    where?: PayBookingEventWhereInput
    /**
     * Limit how many PayBookingEvents to delete.
     */
    limit?: number
  }

  /**
   * PayBookingEvent findRaw
   */
  export type PayBookingEventFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayBookingEvent aggregateRaw
   */
  export type PayBookingEventAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayBookingEvent without action
   */
  export type PayBookingEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayBookingEvent
     */
    select?: PayBookingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayBookingEvent
     */
    omit?: PayBookingEventOmit<ExtArgs> | null
  }


  /**
   * Model PayNotification
   */

  export type AggregatePayNotification = {
    _count: PayNotificationCountAggregateOutputType | null
    _min: PayNotificationMinAggregateOutputType | null
    _max: PayNotificationMaxAggregateOutputType | null
  }

  export type PayNotificationMinAggregateOutputType = {
    id: string | null
    notifId: string | null
    userId: string | null
    role: string | null
    type: string | null
    title: string | null
    message: string | null
    bookingId: string | null
    readAt: Date | null
    createdAt: Date | null
  }

  export type PayNotificationMaxAggregateOutputType = {
    id: string | null
    notifId: string | null
    userId: string | null
    role: string | null
    type: string | null
    title: string | null
    message: string | null
    bookingId: string | null
    readAt: Date | null
    createdAt: Date | null
  }

  export type PayNotificationCountAggregateOutputType = {
    id: number
    notifId: number
    userId: number
    role: number
    type: number
    title: number
    message: number
    bookingId: number
    readAt: number
    createdAt: number
    _all: number
  }


  export type PayNotificationMinAggregateInputType = {
    id?: true
    notifId?: true
    userId?: true
    role?: true
    type?: true
    title?: true
    message?: true
    bookingId?: true
    readAt?: true
    createdAt?: true
  }

  export type PayNotificationMaxAggregateInputType = {
    id?: true
    notifId?: true
    userId?: true
    role?: true
    type?: true
    title?: true
    message?: true
    bookingId?: true
    readAt?: true
    createdAt?: true
  }

  export type PayNotificationCountAggregateInputType = {
    id?: true
    notifId?: true
    userId?: true
    role?: true
    type?: true
    title?: true
    message?: true
    bookingId?: true
    readAt?: true
    createdAt?: true
    _all?: true
  }

  export type PayNotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayNotification to aggregate.
     */
    where?: PayNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayNotifications to fetch.
     */
    orderBy?: PayNotificationOrderByWithRelationInput | PayNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayNotifications
    **/
    _count?: true | PayNotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayNotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayNotificationMaxAggregateInputType
  }

  export type GetPayNotificationAggregateType<T extends PayNotificationAggregateArgs> = {
        [P in keyof T & keyof AggregatePayNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayNotification[P]>
      : GetScalarType<T[P], AggregatePayNotification[P]>
  }




  export type PayNotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayNotificationWhereInput
    orderBy?: PayNotificationOrderByWithAggregationInput | PayNotificationOrderByWithAggregationInput[]
    by: PayNotificationScalarFieldEnum[] | PayNotificationScalarFieldEnum
    having?: PayNotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayNotificationCountAggregateInputType | true
    _min?: PayNotificationMinAggregateInputType
    _max?: PayNotificationMaxAggregateInputType
  }

  export type PayNotificationGroupByOutputType = {
    id: string
    notifId: string
    userId: string
    role: string
    type: string
    title: string
    message: string
    bookingId: string | null
    readAt: Date | null
    createdAt: Date
    _count: PayNotificationCountAggregateOutputType | null
    _min: PayNotificationMinAggregateOutputType | null
    _max: PayNotificationMaxAggregateOutputType | null
  }

  type GetPayNotificationGroupByPayload<T extends PayNotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayNotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayNotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayNotificationGroupByOutputType[P]>
            : GetScalarType<T[P], PayNotificationGroupByOutputType[P]>
        }
      >
    >


  export type PayNotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    notifId?: boolean
    userId?: boolean
    role?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    bookingId?: boolean
    readAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["payNotification"]>



  export type PayNotificationSelectScalar = {
    id?: boolean
    notifId?: boolean
    userId?: boolean
    role?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    bookingId?: boolean
    readAt?: boolean
    createdAt?: boolean
  }

  export type PayNotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "notifId" | "userId" | "role" | "type" | "title" | "message" | "bookingId" | "readAt" | "createdAt", ExtArgs["result"]["payNotification"]>

  export type $PayNotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayNotification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      notifId: string
      userId: string
      role: string
      type: string
      title: string
      message: string
      bookingId: string | null
      readAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["payNotification"]>
    composites: {}
  }

  type PayNotificationGetPayload<S extends boolean | null | undefined | PayNotificationDefaultArgs> = $Result.GetResult<Prisma.$PayNotificationPayload, S>

  type PayNotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PayNotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PayNotificationCountAggregateInputType | true
    }

  export interface PayNotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayNotification'], meta: { name: 'PayNotification' } }
    /**
     * Find zero or one PayNotification that matches the filter.
     * @param {PayNotificationFindUniqueArgs} args - Arguments to find a PayNotification
     * @example
     * // Get one PayNotification
     * const payNotification = await prisma.payNotification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayNotificationFindUniqueArgs>(args: SelectSubset<T, PayNotificationFindUniqueArgs<ExtArgs>>): Prisma__PayNotificationClient<$Result.GetResult<Prisma.$PayNotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PayNotification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PayNotificationFindUniqueOrThrowArgs} args - Arguments to find a PayNotification
     * @example
     * // Get one PayNotification
     * const payNotification = await prisma.payNotification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayNotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, PayNotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayNotificationClient<$Result.GetResult<Prisma.$PayNotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayNotification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayNotificationFindFirstArgs} args - Arguments to find a PayNotification
     * @example
     * // Get one PayNotification
     * const payNotification = await prisma.payNotification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayNotificationFindFirstArgs>(args?: SelectSubset<T, PayNotificationFindFirstArgs<ExtArgs>>): Prisma__PayNotificationClient<$Result.GetResult<Prisma.$PayNotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PayNotification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayNotificationFindFirstOrThrowArgs} args - Arguments to find a PayNotification
     * @example
     * // Get one PayNotification
     * const payNotification = await prisma.payNotification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayNotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, PayNotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayNotificationClient<$Result.GetResult<Prisma.$PayNotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayNotifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayNotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayNotifications
     * const payNotifications = await prisma.payNotification.findMany()
     * 
     * // Get first 10 PayNotifications
     * const payNotifications = await prisma.payNotification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payNotificationWithIdOnly = await prisma.payNotification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayNotificationFindManyArgs>(args?: SelectSubset<T, PayNotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayNotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PayNotification.
     * @param {PayNotificationCreateArgs} args - Arguments to create a PayNotification.
     * @example
     * // Create one PayNotification
     * const PayNotification = await prisma.payNotification.create({
     *   data: {
     *     // ... data to create a PayNotification
     *   }
     * })
     * 
     */
    create<T extends PayNotificationCreateArgs>(args: SelectSubset<T, PayNotificationCreateArgs<ExtArgs>>): Prisma__PayNotificationClient<$Result.GetResult<Prisma.$PayNotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PayNotifications.
     * @param {PayNotificationCreateManyArgs} args - Arguments to create many PayNotifications.
     * @example
     * // Create many PayNotifications
     * const payNotification = await prisma.payNotification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayNotificationCreateManyArgs>(args?: SelectSubset<T, PayNotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PayNotification.
     * @param {PayNotificationDeleteArgs} args - Arguments to delete one PayNotification.
     * @example
     * // Delete one PayNotification
     * const PayNotification = await prisma.payNotification.delete({
     *   where: {
     *     // ... filter to delete one PayNotification
     *   }
     * })
     * 
     */
    delete<T extends PayNotificationDeleteArgs>(args: SelectSubset<T, PayNotificationDeleteArgs<ExtArgs>>): Prisma__PayNotificationClient<$Result.GetResult<Prisma.$PayNotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PayNotification.
     * @param {PayNotificationUpdateArgs} args - Arguments to update one PayNotification.
     * @example
     * // Update one PayNotification
     * const payNotification = await prisma.payNotification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayNotificationUpdateArgs>(args: SelectSubset<T, PayNotificationUpdateArgs<ExtArgs>>): Prisma__PayNotificationClient<$Result.GetResult<Prisma.$PayNotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PayNotifications.
     * @param {PayNotificationDeleteManyArgs} args - Arguments to filter PayNotifications to delete.
     * @example
     * // Delete a few PayNotifications
     * const { count } = await prisma.payNotification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayNotificationDeleteManyArgs>(args?: SelectSubset<T, PayNotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayNotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayNotifications
     * const payNotification = await prisma.payNotification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayNotificationUpdateManyArgs>(args: SelectSubset<T, PayNotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayNotification.
     * @param {PayNotificationUpsertArgs} args - Arguments to update or create a PayNotification.
     * @example
     * // Update or create a PayNotification
     * const payNotification = await prisma.payNotification.upsert({
     *   create: {
     *     // ... data to create a PayNotification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayNotification we want to update
     *   }
     * })
     */
    upsert<T extends PayNotificationUpsertArgs>(args: SelectSubset<T, PayNotificationUpsertArgs<ExtArgs>>): Prisma__PayNotificationClient<$Result.GetResult<Prisma.$PayNotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PayNotifications that matches the filter.
     * @param {PayNotificationFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const payNotification = await prisma.payNotification.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PayNotificationFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PayNotification.
     * @param {PayNotificationAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const payNotification = await prisma.payNotification.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PayNotificationAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PayNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayNotificationCountArgs} args - Arguments to filter PayNotifications to count.
     * @example
     * // Count the number of PayNotifications
     * const count = await prisma.payNotification.count({
     *   where: {
     *     // ... the filter for the PayNotifications we want to count
     *   }
     * })
    **/
    count<T extends PayNotificationCountArgs>(
      args?: Subset<T, PayNotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayNotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayNotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayNotificationAggregateArgs>(args: Subset<T, PayNotificationAggregateArgs>): Prisma.PrismaPromise<GetPayNotificationAggregateType<T>>

    /**
     * Group by PayNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayNotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayNotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayNotificationGroupByArgs['orderBy'] }
        : { orderBy?: PayNotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayNotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayNotification model
   */
  readonly fields: PayNotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayNotification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayNotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayNotification model
   */
  interface PayNotificationFieldRefs {
    readonly id: FieldRef<"PayNotification", 'String'>
    readonly notifId: FieldRef<"PayNotification", 'String'>
    readonly userId: FieldRef<"PayNotification", 'String'>
    readonly role: FieldRef<"PayNotification", 'String'>
    readonly type: FieldRef<"PayNotification", 'String'>
    readonly title: FieldRef<"PayNotification", 'String'>
    readonly message: FieldRef<"PayNotification", 'String'>
    readonly bookingId: FieldRef<"PayNotification", 'String'>
    readonly readAt: FieldRef<"PayNotification", 'DateTime'>
    readonly createdAt: FieldRef<"PayNotification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayNotification findUnique
   */
  export type PayNotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayNotification
     */
    select?: PayNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayNotification
     */
    omit?: PayNotificationOmit<ExtArgs> | null
    /**
     * Filter, which PayNotification to fetch.
     */
    where: PayNotificationWhereUniqueInput
  }

  /**
   * PayNotification findUniqueOrThrow
   */
  export type PayNotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayNotification
     */
    select?: PayNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayNotification
     */
    omit?: PayNotificationOmit<ExtArgs> | null
    /**
     * Filter, which PayNotification to fetch.
     */
    where: PayNotificationWhereUniqueInput
  }

  /**
   * PayNotification findFirst
   */
  export type PayNotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayNotification
     */
    select?: PayNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayNotification
     */
    omit?: PayNotificationOmit<ExtArgs> | null
    /**
     * Filter, which PayNotification to fetch.
     */
    where?: PayNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayNotifications to fetch.
     */
    orderBy?: PayNotificationOrderByWithRelationInput | PayNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayNotifications.
     */
    cursor?: PayNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayNotifications.
     */
    distinct?: PayNotificationScalarFieldEnum | PayNotificationScalarFieldEnum[]
  }

  /**
   * PayNotification findFirstOrThrow
   */
  export type PayNotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayNotification
     */
    select?: PayNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayNotification
     */
    omit?: PayNotificationOmit<ExtArgs> | null
    /**
     * Filter, which PayNotification to fetch.
     */
    where?: PayNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayNotifications to fetch.
     */
    orderBy?: PayNotificationOrderByWithRelationInput | PayNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayNotifications.
     */
    cursor?: PayNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayNotifications.
     */
    distinct?: PayNotificationScalarFieldEnum | PayNotificationScalarFieldEnum[]
  }

  /**
   * PayNotification findMany
   */
  export type PayNotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayNotification
     */
    select?: PayNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayNotification
     */
    omit?: PayNotificationOmit<ExtArgs> | null
    /**
     * Filter, which PayNotifications to fetch.
     */
    where?: PayNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayNotifications to fetch.
     */
    orderBy?: PayNotificationOrderByWithRelationInput | PayNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayNotifications.
     */
    cursor?: PayNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayNotifications.
     */
    skip?: number
    distinct?: PayNotificationScalarFieldEnum | PayNotificationScalarFieldEnum[]
  }

  /**
   * PayNotification create
   */
  export type PayNotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayNotification
     */
    select?: PayNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayNotification
     */
    omit?: PayNotificationOmit<ExtArgs> | null
    /**
     * The data needed to create a PayNotification.
     */
    data: XOR<PayNotificationCreateInput, PayNotificationUncheckedCreateInput>
  }

  /**
   * PayNotification createMany
   */
  export type PayNotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayNotifications.
     */
    data: PayNotificationCreateManyInput | PayNotificationCreateManyInput[]
  }

  /**
   * PayNotification update
   */
  export type PayNotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayNotification
     */
    select?: PayNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayNotification
     */
    omit?: PayNotificationOmit<ExtArgs> | null
    /**
     * The data needed to update a PayNotification.
     */
    data: XOR<PayNotificationUpdateInput, PayNotificationUncheckedUpdateInput>
    /**
     * Choose, which PayNotification to update.
     */
    where: PayNotificationWhereUniqueInput
  }

  /**
   * PayNotification updateMany
   */
  export type PayNotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayNotifications.
     */
    data: XOR<PayNotificationUpdateManyMutationInput, PayNotificationUncheckedUpdateManyInput>
    /**
     * Filter which PayNotifications to update
     */
    where?: PayNotificationWhereInput
    /**
     * Limit how many PayNotifications to update.
     */
    limit?: number
  }

  /**
   * PayNotification upsert
   */
  export type PayNotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayNotification
     */
    select?: PayNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayNotification
     */
    omit?: PayNotificationOmit<ExtArgs> | null
    /**
     * The filter to search for the PayNotification to update in case it exists.
     */
    where: PayNotificationWhereUniqueInput
    /**
     * In case the PayNotification found by the `where` argument doesn't exist, create a new PayNotification with this data.
     */
    create: XOR<PayNotificationCreateInput, PayNotificationUncheckedCreateInput>
    /**
     * In case the PayNotification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayNotificationUpdateInput, PayNotificationUncheckedUpdateInput>
  }

  /**
   * PayNotification delete
   */
  export type PayNotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayNotification
     */
    select?: PayNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayNotification
     */
    omit?: PayNotificationOmit<ExtArgs> | null
    /**
     * Filter which PayNotification to delete.
     */
    where: PayNotificationWhereUniqueInput
  }

  /**
   * PayNotification deleteMany
   */
  export type PayNotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayNotifications to delete
     */
    where?: PayNotificationWhereInput
    /**
     * Limit how many PayNotifications to delete.
     */
    limit?: number
  }

  /**
   * PayNotification findRaw
   */
  export type PayNotificationFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayNotification aggregateRaw
   */
  export type PayNotificationAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PayNotification without action
   */
  export type PayNotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayNotification
     */
    select?: PayNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PayNotification
     */
    omit?: PayNotificationOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const PayConfigVersionScalarFieldEnum: {
    id: 'id',
    version: 'version',
    brandFeeBps: 'brandFeeBps',
    creatorFeeBps: 'creatorFeeBps',
    gstBps: 'gstBps',
    defaultTdsBps: 'defaultTdsBps',
    offerExpiryHours: 'offerExpiryHours',
    signWindowHours: 'signWindowHours',
    paymentWindowHours: 'paymentWindowHours',
    reviewSlaHours: 'reviewSlaHours',
    holdPeriodHours: 'holdPeriodHours',
    disputeWindowHours: 'disputeWindowHours',
    minWithdrawalPaise: 'minWithdrawalPaise',
    isActive: 'isActive',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
  };

  export type PayConfigVersionScalarFieldEnum = (typeof PayConfigVersionScalarFieldEnum)[keyof typeof PayConfigVersionScalarFieldEnum]


  export const PayFeatureFlagScalarFieldEnum: {
    id: 'id',
    key: 'key',
    enabled: 'enabled',
    updatedBy: 'updatedBy',
    reason: 'reason',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  };

  export type PayFeatureFlagScalarFieldEnum = (typeof PayFeatureFlagScalarFieldEnum)[keyof typeof PayFeatureFlagScalarFieldEnum]


  export const PayConfigApprovalScalarFieldEnum: {
    id: 'id',
    approvalType: 'approvalType',
    approvedBy: 'approvedBy',
    scope: 'scope',
    reason: 'reason',
    isActive: 'isActive',
    approvedAt: 'approvedAt',
    revokedAt: 'revokedAt'
  };

  export type PayConfigApprovalScalarFieldEnum = (typeof PayConfigApprovalScalarFieldEnum)[keyof typeof PayConfigApprovalScalarFieldEnum]


  export const PayIdempotencyRecordScalarFieldEnum: {
    id: 'id',
    scope: 'scope',
    key: 'key',
    requestHash: 'requestHash',
    status: 'status',
    statusCode: 'statusCode',
    responseJson: 'responseJson',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PayIdempotencyRecordScalarFieldEnum = (typeof PayIdempotencyRecordScalarFieldEnum)[keyof typeof PayIdempotencyRecordScalarFieldEnum]


  export const PayOutboxEventScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    eventType: 'eventType',
    aggregateType: 'aggregateType',
    aggregateId: 'aggregateId',
    payloadJson: 'payloadJson',
    status: 'status',
    attempts: 'attempts',
    maxAttempts: 'maxAttempts',
    nextAttemptAt: 'nextAttemptAt',
    lockedBy: 'lockedBy',
    lockedUntil: 'lockedUntil',
    lastError: 'lastError',
    publishedAt: 'publishedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PayOutboxEventScalarFieldEnum = (typeof PayOutboxEventScalarFieldEnum)[keyof typeof PayOutboxEventScalarFieldEnum]


  export const PayConsumedEventScalarFieldEnum: {
    id: 'id',
    consumerName: 'consumerName',
    eventId: 'eventId',
    processedAt: 'processedAt'
  };

  export type PayConsumedEventScalarFieldEnum = (typeof PayConsumedEventScalarFieldEnum)[keyof typeof PayConsumedEventScalarFieldEnum]


  export const PayDlqEventScalarFieldEnum: {
    id: 'id',
    sourceType: 'sourceType',
    sourceId: 'sourceId',
    eventType: 'eventType',
    payloadJson: 'payloadJson',
    errorMessage: 'errorMessage',
    attempts: 'attempts',
    replayedAt: 'replayedAt',
    replayedBy: 'replayedBy',
    createdAt: 'createdAt'
  };

  export type PayDlqEventScalarFieldEnum = (typeof PayDlqEventScalarFieldEnum)[keyof typeof PayDlqEventScalarFieldEnum]


  export const PayAuditEventScalarFieldEnum: {
    id: 'id',
    seq: 'seq',
    actorId: 'actorId',
    actorRole: 'actorRole',
    action: 'action',
    resourceType: 'resourceType',
    resourceId: 'resourceId',
    reason: 'reason',
    payloadJson: 'payloadJson',
    prevHash: 'prevHash',
    hash: 'hash',
    createdAt: 'createdAt'
  };

  export type PayAuditEventScalarFieldEnum = (typeof PayAuditEventScalarFieldEnum)[keyof typeof PayAuditEventScalarFieldEnum]


  export const PayQueueJobScalarFieldEnum: {
    id: 'id',
    queueName: 'queueName',
    jobType: 'jobType',
    dedupKey: 'dedupKey',
    payloadJson: 'payloadJson',
    status: 'status',
    attempts: 'attempts',
    maxAttempts: 'maxAttempts',
    runAt: 'runAt',
    lockedBy: 'lockedBy',
    lockedUntil: 'lockedUntil',
    lastError: 'lastError',
    completedAt: 'completedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PayQueueJobScalarFieldEnum = (typeof PayQueueJobScalarFieldEnum)[keyof typeof PayQueueJobScalarFieldEnum]


  export const PayRateLimitBucketScalarFieldEnum: {
    id: 'id',
    bucketKey: 'bucketKey',
    count: 'count',
    expiresAt: 'expiresAt'
  };

  export type PayRateLimitBucketScalarFieldEnum = (typeof PayRateLimitBucketScalarFieldEnum)[keyof typeof PayRateLimitBucketScalarFieldEnum]


  export const PayDailyProbeCounterScalarFieldEnum: {
    id: 'id',
    dayKey: 'dayKey',
    count: 'count',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  };

  export type PayDailyProbeCounterScalarFieldEnum = (typeof PayDailyProbeCounterScalarFieldEnum)[keyof typeof PayDailyProbeCounterScalarFieldEnum]


  export const PayMigrationScalarFieldEnum: {
    id: 'id',
    version: 'version',
    name: 'name',
    appliedAt: 'appliedAt'
  };

  export type PayMigrationScalarFieldEnum = (typeof PayMigrationScalarFieldEnum)[keyof typeof PayMigrationScalarFieldEnum]


  export const PayLedgerAccountScalarFieldEnum: {
    id: 'id',
    accountKey: 'accountKey',
    accountCode: 'accountCode',
    ownerType: 'ownerType',
    ownerId: 'ownerId',
    currency: 'currency',
    normalSide: 'normalSide',
    debitTotalPaise: 'debitTotalPaise',
    creditTotalPaise: 'creditTotalPaise',
    balancePaise: 'balancePaise',
    version: 'version',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  };

  export type PayLedgerAccountScalarFieldEnum = (typeof PayLedgerAccountScalarFieldEnum)[keyof typeof PayLedgerAccountScalarFieldEnum]


  export const PayLedgerEntryScalarFieldEnum: {
    id: 'id',
    entryId: 'entryId',
    idempotencyKey: 'idempotencyKey',
    bookingId: 'bookingId',
    eventType: 'eventType',
    actorId: 'actorId',
    actorRole: 'actorRole',
    reason: 'reason',
    totalPaise: 'totalPaise',
    createdAt: 'createdAt'
  };

  export type PayLedgerEntryScalarFieldEnum = (typeof PayLedgerEntryScalarFieldEnum)[keyof typeof PayLedgerEntryScalarFieldEnum]


  export const PayLedgerLineScalarFieldEnum: {
    id: 'id',
    entryId: 'entryId',
    lineIndex: 'lineIndex',
    accountKey: 'accountKey',
    accountCode: 'accountCode',
    ownerType: 'ownerType',
    ownerId: 'ownerId',
    direction: 'direction',
    amountPaise: 'amountPaise',
    bookingId: 'bookingId',
    createdAt: 'createdAt'
  };

  export type PayLedgerLineScalarFieldEnum = (typeof PayLedgerLineScalarFieldEnum)[keyof typeof PayLedgerLineScalarFieldEnum]


  export const PayBookingScalarFieldEnum: {
    id: 'id',
    bookingId: 'bookingId',
    brandId: 'brandId',
    brandName: 'brandName',
    creatorId: 'creatorId',
    creatorName: 'creatorName',
    creatorSlug: 'creatorSlug',
    status: 'status',
    isOpen: 'isOpen',
    itemKind: 'itemKind',
    itemKey: 'itemKey',
    rateCardItemId: 'rateCardItemId',
    packageId: 'packageId',
    itemTitle: 'itemTitle',
    pricingType: 'pricingType',
    selectedAddonsJson: 'selectedAddonsJson',
    quantity: 'quantity',
    deliveryDate: 'deliveryDate',
    brief: 'brief',
    referenceLinksJson: 'referenceLinksJson',
    assetIdsJson: 'assetIdsJson',
    budgetNote: 'budgetNote',
    quoteSnapshotJson: 'quoteSnapshotJson',
    feeConfigVersion: 'feeConfigVersion',
    rateCardItemVersion: 'rateCardItemVersion',
    counterRound: 'counterRound',
    contactMaskedCount: 'contactMaskedCount',
    rejectionReason: 'rejectionReason',
    expiresAt: 'expiresAt',
    version: 'version',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PayBookingScalarFieldEnum = (typeof PayBookingScalarFieldEnum)[keyof typeof PayBookingScalarFieldEnum]


  export const PayBookingEventScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    bookingId: 'bookingId',
    eventType: 'eventType',
    actorId: 'actorId',
    actorRole: 'actorRole',
    fromStatus: 'fromStatus',
    toStatus: 'toStatus',
    reason: 'reason',
    counterDeltaJson: 'counterDeltaJson',
    createdAt: 'createdAt'
  };

  export type PayBookingEventScalarFieldEnum = (typeof PayBookingEventScalarFieldEnum)[keyof typeof PayBookingEventScalarFieldEnum]


  export const PayNotificationScalarFieldEnum: {
    id: 'id',
    notifId: 'notifId',
    userId: 'userId',
    role: 'role',
    type: 'type',
    title: 'title',
    message: 'message',
    bookingId: 'bookingId',
    readAt: 'readAt',
    createdAt: 'createdAt'
  };

  export type PayNotificationScalarFieldEnum = (typeof PayNotificationScalarFieldEnum)[keyof typeof PayNotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type PayConfigVersionWhereInput = {
    AND?: PayConfigVersionWhereInput | PayConfigVersionWhereInput[]
    OR?: PayConfigVersionWhereInput[]
    NOT?: PayConfigVersionWhereInput | PayConfigVersionWhereInput[]
    id?: StringFilter<"PayConfigVersion"> | string
    version?: StringFilter<"PayConfigVersion"> | string
    brandFeeBps?: IntFilter<"PayConfigVersion"> | number
    creatorFeeBps?: IntFilter<"PayConfigVersion"> | number
    gstBps?: IntFilter<"PayConfigVersion"> | number
    defaultTdsBps?: IntFilter<"PayConfigVersion"> | number
    offerExpiryHours?: IntFilter<"PayConfigVersion"> | number
    signWindowHours?: IntFilter<"PayConfigVersion"> | number
    paymentWindowHours?: IntFilter<"PayConfigVersion"> | number
    reviewSlaHours?: IntFilter<"PayConfigVersion"> | number
    holdPeriodHours?: IntFilter<"PayConfigVersion"> | number
    disputeWindowHours?: IntFilter<"PayConfigVersion"> | number
    minWithdrawalPaise?: BigIntFilter<"PayConfigVersion"> | bigint | number
    isActive?: BoolFilter<"PayConfigVersion"> | boolean
    createdBy?: StringFilter<"PayConfigVersion"> | string
    createdAt?: DateTimeFilter<"PayConfigVersion"> | Date | string
  }

  export type PayConfigVersionOrderByWithRelationInput = {
    id?: SortOrder
    version?: SortOrder
    brandFeeBps?: SortOrder
    creatorFeeBps?: SortOrder
    gstBps?: SortOrder
    defaultTdsBps?: SortOrder
    offerExpiryHours?: SortOrder
    signWindowHours?: SortOrder
    paymentWindowHours?: SortOrder
    reviewSlaHours?: SortOrder
    holdPeriodHours?: SortOrder
    disputeWindowHours?: SortOrder
    minWithdrawalPaise?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PayConfigVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    version?: string
    AND?: PayConfigVersionWhereInput | PayConfigVersionWhereInput[]
    OR?: PayConfigVersionWhereInput[]
    NOT?: PayConfigVersionWhereInput | PayConfigVersionWhereInput[]
    brandFeeBps?: IntFilter<"PayConfigVersion"> | number
    creatorFeeBps?: IntFilter<"PayConfigVersion"> | number
    gstBps?: IntFilter<"PayConfigVersion"> | number
    defaultTdsBps?: IntFilter<"PayConfigVersion"> | number
    offerExpiryHours?: IntFilter<"PayConfigVersion"> | number
    signWindowHours?: IntFilter<"PayConfigVersion"> | number
    paymentWindowHours?: IntFilter<"PayConfigVersion"> | number
    reviewSlaHours?: IntFilter<"PayConfigVersion"> | number
    holdPeriodHours?: IntFilter<"PayConfigVersion"> | number
    disputeWindowHours?: IntFilter<"PayConfigVersion"> | number
    minWithdrawalPaise?: BigIntFilter<"PayConfigVersion"> | bigint | number
    isActive?: BoolFilter<"PayConfigVersion"> | boolean
    createdBy?: StringFilter<"PayConfigVersion"> | string
    createdAt?: DateTimeFilter<"PayConfigVersion"> | Date | string
  }, "id" | "version">

  export type PayConfigVersionOrderByWithAggregationInput = {
    id?: SortOrder
    version?: SortOrder
    brandFeeBps?: SortOrder
    creatorFeeBps?: SortOrder
    gstBps?: SortOrder
    defaultTdsBps?: SortOrder
    offerExpiryHours?: SortOrder
    signWindowHours?: SortOrder
    paymentWindowHours?: SortOrder
    reviewSlaHours?: SortOrder
    holdPeriodHours?: SortOrder
    disputeWindowHours?: SortOrder
    minWithdrawalPaise?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    _count?: PayConfigVersionCountOrderByAggregateInput
    _avg?: PayConfigVersionAvgOrderByAggregateInput
    _max?: PayConfigVersionMaxOrderByAggregateInput
    _min?: PayConfigVersionMinOrderByAggregateInput
    _sum?: PayConfigVersionSumOrderByAggregateInput
  }

  export type PayConfigVersionScalarWhereWithAggregatesInput = {
    AND?: PayConfigVersionScalarWhereWithAggregatesInput | PayConfigVersionScalarWhereWithAggregatesInput[]
    OR?: PayConfigVersionScalarWhereWithAggregatesInput[]
    NOT?: PayConfigVersionScalarWhereWithAggregatesInput | PayConfigVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayConfigVersion"> | string
    version?: StringWithAggregatesFilter<"PayConfigVersion"> | string
    brandFeeBps?: IntWithAggregatesFilter<"PayConfigVersion"> | number
    creatorFeeBps?: IntWithAggregatesFilter<"PayConfigVersion"> | number
    gstBps?: IntWithAggregatesFilter<"PayConfigVersion"> | number
    defaultTdsBps?: IntWithAggregatesFilter<"PayConfigVersion"> | number
    offerExpiryHours?: IntWithAggregatesFilter<"PayConfigVersion"> | number
    signWindowHours?: IntWithAggregatesFilter<"PayConfigVersion"> | number
    paymentWindowHours?: IntWithAggregatesFilter<"PayConfigVersion"> | number
    reviewSlaHours?: IntWithAggregatesFilter<"PayConfigVersion"> | number
    holdPeriodHours?: IntWithAggregatesFilter<"PayConfigVersion"> | number
    disputeWindowHours?: IntWithAggregatesFilter<"PayConfigVersion"> | number
    minWithdrawalPaise?: BigIntWithAggregatesFilter<"PayConfigVersion"> | bigint | number
    isActive?: BoolWithAggregatesFilter<"PayConfigVersion"> | boolean
    createdBy?: StringWithAggregatesFilter<"PayConfigVersion"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PayConfigVersion"> | Date | string
  }

  export type PayFeatureFlagWhereInput = {
    AND?: PayFeatureFlagWhereInput | PayFeatureFlagWhereInput[]
    OR?: PayFeatureFlagWhereInput[]
    NOT?: PayFeatureFlagWhereInput | PayFeatureFlagWhereInput[]
    id?: StringFilter<"PayFeatureFlag"> | string
    key?: StringFilter<"PayFeatureFlag"> | string
    enabled?: BoolFilter<"PayFeatureFlag"> | boolean
    updatedBy?: StringFilter<"PayFeatureFlag"> | string
    reason?: StringNullableFilter<"PayFeatureFlag"> | string | null
    updatedAt?: DateTimeFilter<"PayFeatureFlag"> | Date | string
    createdAt?: DateTimeFilter<"PayFeatureFlag"> | Date | string
  }

  export type PayFeatureFlagOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    enabled?: SortOrder
    updatedBy?: SortOrder
    reason?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayFeatureFlagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: PayFeatureFlagWhereInput | PayFeatureFlagWhereInput[]
    OR?: PayFeatureFlagWhereInput[]
    NOT?: PayFeatureFlagWhereInput | PayFeatureFlagWhereInput[]
    enabled?: BoolFilter<"PayFeatureFlag"> | boolean
    updatedBy?: StringFilter<"PayFeatureFlag"> | string
    reason?: StringNullableFilter<"PayFeatureFlag"> | string | null
    updatedAt?: DateTimeFilter<"PayFeatureFlag"> | Date | string
    createdAt?: DateTimeFilter<"PayFeatureFlag"> | Date | string
  }, "id" | "key">

  export type PayFeatureFlagOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    enabled?: SortOrder
    updatedBy?: SortOrder
    reason?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: PayFeatureFlagCountOrderByAggregateInput
    _max?: PayFeatureFlagMaxOrderByAggregateInput
    _min?: PayFeatureFlagMinOrderByAggregateInput
  }

  export type PayFeatureFlagScalarWhereWithAggregatesInput = {
    AND?: PayFeatureFlagScalarWhereWithAggregatesInput | PayFeatureFlagScalarWhereWithAggregatesInput[]
    OR?: PayFeatureFlagScalarWhereWithAggregatesInput[]
    NOT?: PayFeatureFlagScalarWhereWithAggregatesInput | PayFeatureFlagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayFeatureFlag"> | string
    key?: StringWithAggregatesFilter<"PayFeatureFlag"> | string
    enabled?: BoolWithAggregatesFilter<"PayFeatureFlag"> | boolean
    updatedBy?: StringWithAggregatesFilter<"PayFeatureFlag"> | string
    reason?: StringNullableWithAggregatesFilter<"PayFeatureFlag"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"PayFeatureFlag"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"PayFeatureFlag"> | Date | string
  }

  export type PayConfigApprovalWhereInput = {
    AND?: PayConfigApprovalWhereInput | PayConfigApprovalWhereInput[]
    OR?: PayConfigApprovalWhereInput[]
    NOT?: PayConfigApprovalWhereInput | PayConfigApprovalWhereInput[]
    id?: StringFilter<"PayConfigApproval"> | string
    approvalType?: StringFilter<"PayConfigApproval"> | string
    approvedBy?: StringFilter<"PayConfigApproval"> | string
    scope?: StringFilter<"PayConfigApproval"> | string
    reason?: StringFilter<"PayConfigApproval"> | string
    isActive?: BoolFilter<"PayConfigApproval"> | boolean
    approvedAt?: DateTimeFilter<"PayConfigApproval"> | Date | string
    revokedAt?: DateTimeNullableFilter<"PayConfigApproval"> | Date | string | null
  }

  export type PayConfigApprovalOrderByWithRelationInput = {
    id?: SortOrder
    approvalType?: SortOrder
    approvedBy?: SortOrder
    scope?: SortOrder
    reason?: SortOrder
    isActive?: SortOrder
    approvedAt?: SortOrder
    revokedAt?: SortOrder
  }

  export type PayConfigApprovalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PayConfigApprovalWhereInput | PayConfigApprovalWhereInput[]
    OR?: PayConfigApprovalWhereInput[]
    NOT?: PayConfigApprovalWhereInput | PayConfigApprovalWhereInput[]
    approvalType?: StringFilter<"PayConfigApproval"> | string
    approvedBy?: StringFilter<"PayConfigApproval"> | string
    scope?: StringFilter<"PayConfigApproval"> | string
    reason?: StringFilter<"PayConfigApproval"> | string
    isActive?: BoolFilter<"PayConfigApproval"> | boolean
    approvedAt?: DateTimeFilter<"PayConfigApproval"> | Date | string
    revokedAt?: DateTimeNullableFilter<"PayConfigApproval"> | Date | string | null
  }, "id">

  export type PayConfigApprovalOrderByWithAggregationInput = {
    id?: SortOrder
    approvalType?: SortOrder
    approvedBy?: SortOrder
    scope?: SortOrder
    reason?: SortOrder
    isActive?: SortOrder
    approvedAt?: SortOrder
    revokedAt?: SortOrder
    _count?: PayConfigApprovalCountOrderByAggregateInput
    _max?: PayConfigApprovalMaxOrderByAggregateInput
    _min?: PayConfigApprovalMinOrderByAggregateInput
  }

  export type PayConfigApprovalScalarWhereWithAggregatesInput = {
    AND?: PayConfigApprovalScalarWhereWithAggregatesInput | PayConfigApprovalScalarWhereWithAggregatesInput[]
    OR?: PayConfigApprovalScalarWhereWithAggregatesInput[]
    NOT?: PayConfigApprovalScalarWhereWithAggregatesInput | PayConfigApprovalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayConfigApproval"> | string
    approvalType?: StringWithAggregatesFilter<"PayConfigApproval"> | string
    approvedBy?: StringWithAggregatesFilter<"PayConfigApproval"> | string
    scope?: StringWithAggregatesFilter<"PayConfigApproval"> | string
    reason?: StringWithAggregatesFilter<"PayConfigApproval"> | string
    isActive?: BoolWithAggregatesFilter<"PayConfigApproval"> | boolean
    approvedAt?: DateTimeWithAggregatesFilter<"PayConfigApproval"> | Date | string
    revokedAt?: DateTimeNullableWithAggregatesFilter<"PayConfigApproval"> | Date | string | null
  }

  export type PayIdempotencyRecordWhereInput = {
    AND?: PayIdempotencyRecordWhereInput | PayIdempotencyRecordWhereInput[]
    OR?: PayIdempotencyRecordWhereInput[]
    NOT?: PayIdempotencyRecordWhereInput | PayIdempotencyRecordWhereInput[]
    id?: StringFilter<"PayIdempotencyRecord"> | string
    scope?: StringFilter<"PayIdempotencyRecord"> | string
    key?: StringFilter<"PayIdempotencyRecord"> | string
    requestHash?: StringFilter<"PayIdempotencyRecord"> | string
    status?: StringFilter<"PayIdempotencyRecord"> | string
    statusCode?: IntNullableFilter<"PayIdempotencyRecord"> | number | null
    responseJson?: StringNullableFilter<"PayIdempotencyRecord"> | string | null
    expiresAt?: DateTimeFilter<"PayIdempotencyRecord"> | Date | string
    createdAt?: DateTimeFilter<"PayIdempotencyRecord"> | Date | string
    updatedAt?: DateTimeFilter<"PayIdempotencyRecord"> | Date | string
  }

  export type PayIdempotencyRecordOrderByWithRelationInput = {
    id?: SortOrder
    scope?: SortOrder
    key?: SortOrder
    requestHash?: SortOrder
    status?: SortOrder
    statusCode?: SortOrder
    responseJson?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayIdempotencyRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    scope_key?: PayIdempotencyRecordScopeKeyCompoundUniqueInput
    AND?: PayIdempotencyRecordWhereInput | PayIdempotencyRecordWhereInput[]
    OR?: PayIdempotencyRecordWhereInput[]
    NOT?: PayIdempotencyRecordWhereInput | PayIdempotencyRecordWhereInput[]
    scope?: StringFilter<"PayIdempotencyRecord"> | string
    key?: StringFilter<"PayIdempotencyRecord"> | string
    requestHash?: StringFilter<"PayIdempotencyRecord"> | string
    status?: StringFilter<"PayIdempotencyRecord"> | string
    statusCode?: IntNullableFilter<"PayIdempotencyRecord"> | number | null
    responseJson?: StringNullableFilter<"PayIdempotencyRecord"> | string | null
    expiresAt?: DateTimeFilter<"PayIdempotencyRecord"> | Date | string
    createdAt?: DateTimeFilter<"PayIdempotencyRecord"> | Date | string
    updatedAt?: DateTimeFilter<"PayIdempotencyRecord"> | Date | string
  }, "id" | "scope_key">

  export type PayIdempotencyRecordOrderByWithAggregationInput = {
    id?: SortOrder
    scope?: SortOrder
    key?: SortOrder
    requestHash?: SortOrder
    status?: SortOrder
    statusCode?: SortOrder
    responseJson?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PayIdempotencyRecordCountOrderByAggregateInput
    _avg?: PayIdempotencyRecordAvgOrderByAggregateInput
    _max?: PayIdempotencyRecordMaxOrderByAggregateInput
    _min?: PayIdempotencyRecordMinOrderByAggregateInput
    _sum?: PayIdempotencyRecordSumOrderByAggregateInput
  }

  export type PayIdempotencyRecordScalarWhereWithAggregatesInput = {
    AND?: PayIdempotencyRecordScalarWhereWithAggregatesInput | PayIdempotencyRecordScalarWhereWithAggregatesInput[]
    OR?: PayIdempotencyRecordScalarWhereWithAggregatesInput[]
    NOT?: PayIdempotencyRecordScalarWhereWithAggregatesInput | PayIdempotencyRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayIdempotencyRecord"> | string
    scope?: StringWithAggregatesFilter<"PayIdempotencyRecord"> | string
    key?: StringWithAggregatesFilter<"PayIdempotencyRecord"> | string
    requestHash?: StringWithAggregatesFilter<"PayIdempotencyRecord"> | string
    status?: StringWithAggregatesFilter<"PayIdempotencyRecord"> | string
    statusCode?: IntNullableWithAggregatesFilter<"PayIdempotencyRecord"> | number | null
    responseJson?: StringNullableWithAggregatesFilter<"PayIdempotencyRecord"> | string | null
    expiresAt?: DateTimeWithAggregatesFilter<"PayIdempotencyRecord"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"PayIdempotencyRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PayIdempotencyRecord"> | Date | string
  }

  export type PayOutboxEventWhereInput = {
    AND?: PayOutboxEventWhereInput | PayOutboxEventWhereInput[]
    OR?: PayOutboxEventWhereInput[]
    NOT?: PayOutboxEventWhereInput | PayOutboxEventWhereInput[]
    id?: StringFilter<"PayOutboxEvent"> | string
    eventId?: StringFilter<"PayOutboxEvent"> | string
    eventType?: StringFilter<"PayOutboxEvent"> | string
    aggregateType?: StringFilter<"PayOutboxEvent"> | string
    aggregateId?: StringFilter<"PayOutboxEvent"> | string
    payloadJson?: StringFilter<"PayOutboxEvent"> | string
    status?: StringFilter<"PayOutboxEvent"> | string
    attempts?: IntFilter<"PayOutboxEvent"> | number
    maxAttempts?: IntFilter<"PayOutboxEvent"> | number
    nextAttemptAt?: DateTimeFilter<"PayOutboxEvent"> | Date | string
    lockedBy?: StringNullableFilter<"PayOutboxEvent"> | string | null
    lockedUntil?: DateTimeNullableFilter<"PayOutboxEvent"> | Date | string | null
    lastError?: StringNullableFilter<"PayOutboxEvent"> | string | null
    publishedAt?: DateTimeNullableFilter<"PayOutboxEvent"> | Date | string | null
    createdAt?: DateTimeFilter<"PayOutboxEvent"> | Date | string
    updatedAt?: DateTimeFilter<"PayOutboxEvent"> | Date | string
  }

  export type PayOutboxEventOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    eventType?: SortOrder
    aggregateType?: SortOrder
    aggregateId?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    nextAttemptAt?: SortOrder
    lockedBy?: SortOrder
    lockedUntil?: SortOrder
    lastError?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayOutboxEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    eventId?: string
    AND?: PayOutboxEventWhereInput | PayOutboxEventWhereInput[]
    OR?: PayOutboxEventWhereInput[]
    NOT?: PayOutboxEventWhereInput | PayOutboxEventWhereInput[]
    eventType?: StringFilter<"PayOutboxEvent"> | string
    aggregateType?: StringFilter<"PayOutboxEvent"> | string
    aggregateId?: StringFilter<"PayOutboxEvent"> | string
    payloadJson?: StringFilter<"PayOutboxEvent"> | string
    status?: StringFilter<"PayOutboxEvent"> | string
    attempts?: IntFilter<"PayOutboxEvent"> | number
    maxAttempts?: IntFilter<"PayOutboxEvent"> | number
    nextAttemptAt?: DateTimeFilter<"PayOutboxEvent"> | Date | string
    lockedBy?: StringNullableFilter<"PayOutboxEvent"> | string | null
    lockedUntil?: DateTimeNullableFilter<"PayOutboxEvent"> | Date | string | null
    lastError?: StringNullableFilter<"PayOutboxEvent"> | string | null
    publishedAt?: DateTimeNullableFilter<"PayOutboxEvent"> | Date | string | null
    createdAt?: DateTimeFilter<"PayOutboxEvent"> | Date | string
    updatedAt?: DateTimeFilter<"PayOutboxEvent"> | Date | string
  }, "id" | "eventId">

  export type PayOutboxEventOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    eventType?: SortOrder
    aggregateType?: SortOrder
    aggregateId?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    nextAttemptAt?: SortOrder
    lockedBy?: SortOrder
    lockedUntil?: SortOrder
    lastError?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PayOutboxEventCountOrderByAggregateInput
    _avg?: PayOutboxEventAvgOrderByAggregateInput
    _max?: PayOutboxEventMaxOrderByAggregateInput
    _min?: PayOutboxEventMinOrderByAggregateInput
    _sum?: PayOutboxEventSumOrderByAggregateInput
  }

  export type PayOutboxEventScalarWhereWithAggregatesInput = {
    AND?: PayOutboxEventScalarWhereWithAggregatesInput | PayOutboxEventScalarWhereWithAggregatesInput[]
    OR?: PayOutboxEventScalarWhereWithAggregatesInput[]
    NOT?: PayOutboxEventScalarWhereWithAggregatesInput | PayOutboxEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayOutboxEvent"> | string
    eventId?: StringWithAggregatesFilter<"PayOutboxEvent"> | string
    eventType?: StringWithAggregatesFilter<"PayOutboxEvent"> | string
    aggregateType?: StringWithAggregatesFilter<"PayOutboxEvent"> | string
    aggregateId?: StringWithAggregatesFilter<"PayOutboxEvent"> | string
    payloadJson?: StringWithAggregatesFilter<"PayOutboxEvent"> | string
    status?: StringWithAggregatesFilter<"PayOutboxEvent"> | string
    attempts?: IntWithAggregatesFilter<"PayOutboxEvent"> | number
    maxAttempts?: IntWithAggregatesFilter<"PayOutboxEvent"> | number
    nextAttemptAt?: DateTimeWithAggregatesFilter<"PayOutboxEvent"> | Date | string
    lockedBy?: StringNullableWithAggregatesFilter<"PayOutboxEvent"> | string | null
    lockedUntil?: DateTimeNullableWithAggregatesFilter<"PayOutboxEvent"> | Date | string | null
    lastError?: StringNullableWithAggregatesFilter<"PayOutboxEvent"> | string | null
    publishedAt?: DateTimeNullableWithAggregatesFilter<"PayOutboxEvent"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PayOutboxEvent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PayOutboxEvent"> | Date | string
  }

  export type PayConsumedEventWhereInput = {
    AND?: PayConsumedEventWhereInput | PayConsumedEventWhereInput[]
    OR?: PayConsumedEventWhereInput[]
    NOT?: PayConsumedEventWhereInput | PayConsumedEventWhereInput[]
    id?: StringFilter<"PayConsumedEvent"> | string
    consumerName?: StringFilter<"PayConsumedEvent"> | string
    eventId?: StringFilter<"PayConsumedEvent"> | string
    processedAt?: DateTimeFilter<"PayConsumedEvent"> | Date | string
  }

  export type PayConsumedEventOrderByWithRelationInput = {
    id?: SortOrder
    consumerName?: SortOrder
    eventId?: SortOrder
    processedAt?: SortOrder
  }

  export type PayConsumedEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    consumerName_eventId?: PayConsumedEventConsumerNameEventIdCompoundUniqueInput
    AND?: PayConsumedEventWhereInput | PayConsumedEventWhereInput[]
    OR?: PayConsumedEventWhereInput[]
    NOT?: PayConsumedEventWhereInput | PayConsumedEventWhereInput[]
    consumerName?: StringFilter<"PayConsumedEvent"> | string
    eventId?: StringFilter<"PayConsumedEvent"> | string
    processedAt?: DateTimeFilter<"PayConsumedEvent"> | Date | string
  }, "id" | "consumerName_eventId">

  export type PayConsumedEventOrderByWithAggregationInput = {
    id?: SortOrder
    consumerName?: SortOrder
    eventId?: SortOrder
    processedAt?: SortOrder
    _count?: PayConsumedEventCountOrderByAggregateInput
    _max?: PayConsumedEventMaxOrderByAggregateInput
    _min?: PayConsumedEventMinOrderByAggregateInput
  }

  export type PayConsumedEventScalarWhereWithAggregatesInput = {
    AND?: PayConsumedEventScalarWhereWithAggregatesInput | PayConsumedEventScalarWhereWithAggregatesInput[]
    OR?: PayConsumedEventScalarWhereWithAggregatesInput[]
    NOT?: PayConsumedEventScalarWhereWithAggregatesInput | PayConsumedEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayConsumedEvent"> | string
    consumerName?: StringWithAggregatesFilter<"PayConsumedEvent"> | string
    eventId?: StringWithAggregatesFilter<"PayConsumedEvent"> | string
    processedAt?: DateTimeWithAggregatesFilter<"PayConsumedEvent"> | Date | string
  }

  export type PayDlqEventWhereInput = {
    AND?: PayDlqEventWhereInput | PayDlqEventWhereInput[]
    OR?: PayDlqEventWhereInput[]
    NOT?: PayDlqEventWhereInput | PayDlqEventWhereInput[]
    id?: StringFilter<"PayDlqEvent"> | string
    sourceType?: StringFilter<"PayDlqEvent"> | string
    sourceId?: StringFilter<"PayDlqEvent"> | string
    eventType?: StringFilter<"PayDlqEvent"> | string
    payloadJson?: StringFilter<"PayDlqEvent"> | string
    errorMessage?: StringFilter<"PayDlqEvent"> | string
    attempts?: IntFilter<"PayDlqEvent"> | number
    replayedAt?: DateTimeNullableFilter<"PayDlqEvent"> | Date | string | null
    replayedBy?: StringNullableFilter<"PayDlqEvent"> | string | null
    createdAt?: DateTimeFilter<"PayDlqEvent"> | Date | string
  }

  export type PayDlqEventOrderByWithRelationInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    eventType?: SortOrder
    payloadJson?: SortOrder
    errorMessage?: SortOrder
    attempts?: SortOrder
    replayedAt?: SortOrder
    replayedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PayDlqEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PayDlqEventWhereInput | PayDlqEventWhereInput[]
    OR?: PayDlqEventWhereInput[]
    NOT?: PayDlqEventWhereInput | PayDlqEventWhereInput[]
    sourceType?: StringFilter<"PayDlqEvent"> | string
    sourceId?: StringFilter<"PayDlqEvent"> | string
    eventType?: StringFilter<"PayDlqEvent"> | string
    payloadJson?: StringFilter<"PayDlqEvent"> | string
    errorMessage?: StringFilter<"PayDlqEvent"> | string
    attempts?: IntFilter<"PayDlqEvent"> | number
    replayedAt?: DateTimeNullableFilter<"PayDlqEvent"> | Date | string | null
    replayedBy?: StringNullableFilter<"PayDlqEvent"> | string | null
    createdAt?: DateTimeFilter<"PayDlqEvent"> | Date | string
  }, "id">

  export type PayDlqEventOrderByWithAggregationInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    eventType?: SortOrder
    payloadJson?: SortOrder
    errorMessage?: SortOrder
    attempts?: SortOrder
    replayedAt?: SortOrder
    replayedBy?: SortOrder
    createdAt?: SortOrder
    _count?: PayDlqEventCountOrderByAggregateInput
    _avg?: PayDlqEventAvgOrderByAggregateInput
    _max?: PayDlqEventMaxOrderByAggregateInput
    _min?: PayDlqEventMinOrderByAggregateInput
    _sum?: PayDlqEventSumOrderByAggregateInput
  }

  export type PayDlqEventScalarWhereWithAggregatesInput = {
    AND?: PayDlqEventScalarWhereWithAggregatesInput | PayDlqEventScalarWhereWithAggregatesInput[]
    OR?: PayDlqEventScalarWhereWithAggregatesInput[]
    NOT?: PayDlqEventScalarWhereWithAggregatesInput | PayDlqEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayDlqEvent"> | string
    sourceType?: StringWithAggregatesFilter<"PayDlqEvent"> | string
    sourceId?: StringWithAggregatesFilter<"PayDlqEvent"> | string
    eventType?: StringWithAggregatesFilter<"PayDlqEvent"> | string
    payloadJson?: StringWithAggregatesFilter<"PayDlqEvent"> | string
    errorMessage?: StringWithAggregatesFilter<"PayDlqEvent"> | string
    attempts?: IntWithAggregatesFilter<"PayDlqEvent"> | number
    replayedAt?: DateTimeNullableWithAggregatesFilter<"PayDlqEvent"> | Date | string | null
    replayedBy?: StringNullableWithAggregatesFilter<"PayDlqEvent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PayDlqEvent"> | Date | string
  }

  export type PayAuditEventWhereInput = {
    AND?: PayAuditEventWhereInput | PayAuditEventWhereInput[]
    OR?: PayAuditEventWhereInput[]
    NOT?: PayAuditEventWhereInput | PayAuditEventWhereInput[]
    id?: StringFilter<"PayAuditEvent"> | string
    seq?: IntFilter<"PayAuditEvent"> | number
    actorId?: StringFilter<"PayAuditEvent"> | string
    actorRole?: StringFilter<"PayAuditEvent"> | string
    action?: StringFilter<"PayAuditEvent"> | string
    resourceType?: StringFilter<"PayAuditEvent"> | string
    resourceId?: StringFilter<"PayAuditEvent"> | string
    reason?: StringNullableFilter<"PayAuditEvent"> | string | null
    payloadJson?: StringFilter<"PayAuditEvent"> | string
    prevHash?: StringFilter<"PayAuditEvent"> | string
    hash?: StringFilter<"PayAuditEvent"> | string
    createdAt?: DateTimeFilter<"PayAuditEvent"> | Date | string
  }

  export type PayAuditEventOrderByWithRelationInput = {
    id?: SortOrder
    seq?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    reason?: SortOrder
    payloadJson?: SortOrder
    prevHash?: SortOrder
    hash?: SortOrder
    createdAt?: SortOrder
  }

  export type PayAuditEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    seq?: number
    hash?: string
    AND?: PayAuditEventWhereInput | PayAuditEventWhereInput[]
    OR?: PayAuditEventWhereInput[]
    NOT?: PayAuditEventWhereInput | PayAuditEventWhereInput[]
    actorId?: StringFilter<"PayAuditEvent"> | string
    actorRole?: StringFilter<"PayAuditEvent"> | string
    action?: StringFilter<"PayAuditEvent"> | string
    resourceType?: StringFilter<"PayAuditEvent"> | string
    resourceId?: StringFilter<"PayAuditEvent"> | string
    reason?: StringNullableFilter<"PayAuditEvent"> | string | null
    payloadJson?: StringFilter<"PayAuditEvent"> | string
    prevHash?: StringFilter<"PayAuditEvent"> | string
    createdAt?: DateTimeFilter<"PayAuditEvent"> | Date | string
  }, "id" | "seq" | "hash">

  export type PayAuditEventOrderByWithAggregationInput = {
    id?: SortOrder
    seq?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    reason?: SortOrder
    payloadJson?: SortOrder
    prevHash?: SortOrder
    hash?: SortOrder
    createdAt?: SortOrder
    _count?: PayAuditEventCountOrderByAggregateInput
    _avg?: PayAuditEventAvgOrderByAggregateInput
    _max?: PayAuditEventMaxOrderByAggregateInput
    _min?: PayAuditEventMinOrderByAggregateInput
    _sum?: PayAuditEventSumOrderByAggregateInput
  }

  export type PayAuditEventScalarWhereWithAggregatesInput = {
    AND?: PayAuditEventScalarWhereWithAggregatesInput | PayAuditEventScalarWhereWithAggregatesInput[]
    OR?: PayAuditEventScalarWhereWithAggregatesInput[]
    NOT?: PayAuditEventScalarWhereWithAggregatesInput | PayAuditEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayAuditEvent"> | string
    seq?: IntWithAggregatesFilter<"PayAuditEvent"> | number
    actorId?: StringWithAggregatesFilter<"PayAuditEvent"> | string
    actorRole?: StringWithAggregatesFilter<"PayAuditEvent"> | string
    action?: StringWithAggregatesFilter<"PayAuditEvent"> | string
    resourceType?: StringWithAggregatesFilter<"PayAuditEvent"> | string
    resourceId?: StringWithAggregatesFilter<"PayAuditEvent"> | string
    reason?: StringNullableWithAggregatesFilter<"PayAuditEvent"> | string | null
    payloadJson?: StringWithAggregatesFilter<"PayAuditEvent"> | string
    prevHash?: StringWithAggregatesFilter<"PayAuditEvent"> | string
    hash?: StringWithAggregatesFilter<"PayAuditEvent"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PayAuditEvent"> | Date | string
  }

  export type PayQueueJobWhereInput = {
    AND?: PayQueueJobWhereInput | PayQueueJobWhereInput[]
    OR?: PayQueueJobWhereInput[]
    NOT?: PayQueueJobWhereInput | PayQueueJobWhereInput[]
    id?: StringFilter<"PayQueueJob"> | string
    queueName?: StringFilter<"PayQueueJob"> | string
    jobType?: StringFilter<"PayQueueJob"> | string
    dedupKey?: StringFilter<"PayQueueJob"> | string
    payloadJson?: StringFilter<"PayQueueJob"> | string
    status?: StringFilter<"PayQueueJob"> | string
    attempts?: IntFilter<"PayQueueJob"> | number
    maxAttempts?: IntFilter<"PayQueueJob"> | number
    runAt?: DateTimeFilter<"PayQueueJob"> | Date | string
    lockedBy?: StringNullableFilter<"PayQueueJob"> | string | null
    lockedUntil?: DateTimeNullableFilter<"PayQueueJob"> | Date | string | null
    lastError?: StringNullableFilter<"PayQueueJob"> | string | null
    completedAt?: DateTimeNullableFilter<"PayQueueJob"> | Date | string | null
    createdAt?: DateTimeFilter<"PayQueueJob"> | Date | string
    updatedAt?: DateTimeFilter<"PayQueueJob"> | Date | string
  }

  export type PayQueueJobOrderByWithRelationInput = {
    id?: SortOrder
    queueName?: SortOrder
    jobType?: SortOrder
    dedupKey?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    runAt?: SortOrder
    lockedBy?: SortOrder
    lockedUntil?: SortOrder
    lastError?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayQueueJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    dedupKey?: string
    AND?: PayQueueJobWhereInput | PayQueueJobWhereInput[]
    OR?: PayQueueJobWhereInput[]
    NOT?: PayQueueJobWhereInput | PayQueueJobWhereInput[]
    queueName?: StringFilter<"PayQueueJob"> | string
    jobType?: StringFilter<"PayQueueJob"> | string
    payloadJson?: StringFilter<"PayQueueJob"> | string
    status?: StringFilter<"PayQueueJob"> | string
    attempts?: IntFilter<"PayQueueJob"> | number
    maxAttempts?: IntFilter<"PayQueueJob"> | number
    runAt?: DateTimeFilter<"PayQueueJob"> | Date | string
    lockedBy?: StringNullableFilter<"PayQueueJob"> | string | null
    lockedUntil?: DateTimeNullableFilter<"PayQueueJob"> | Date | string | null
    lastError?: StringNullableFilter<"PayQueueJob"> | string | null
    completedAt?: DateTimeNullableFilter<"PayQueueJob"> | Date | string | null
    createdAt?: DateTimeFilter<"PayQueueJob"> | Date | string
    updatedAt?: DateTimeFilter<"PayQueueJob"> | Date | string
  }, "id" | "dedupKey">

  export type PayQueueJobOrderByWithAggregationInput = {
    id?: SortOrder
    queueName?: SortOrder
    jobType?: SortOrder
    dedupKey?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    runAt?: SortOrder
    lockedBy?: SortOrder
    lockedUntil?: SortOrder
    lastError?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PayQueueJobCountOrderByAggregateInput
    _avg?: PayQueueJobAvgOrderByAggregateInput
    _max?: PayQueueJobMaxOrderByAggregateInput
    _min?: PayQueueJobMinOrderByAggregateInput
    _sum?: PayQueueJobSumOrderByAggregateInput
  }

  export type PayQueueJobScalarWhereWithAggregatesInput = {
    AND?: PayQueueJobScalarWhereWithAggregatesInput | PayQueueJobScalarWhereWithAggregatesInput[]
    OR?: PayQueueJobScalarWhereWithAggregatesInput[]
    NOT?: PayQueueJobScalarWhereWithAggregatesInput | PayQueueJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayQueueJob"> | string
    queueName?: StringWithAggregatesFilter<"PayQueueJob"> | string
    jobType?: StringWithAggregatesFilter<"PayQueueJob"> | string
    dedupKey?: StringWithAggregatesFilter<"PayQueueJob"> | string
    payloadJson?: StringWithAggregatesFilter<"PayQueueJob"> | string
    status?: StringWithAggregatesFilter<"PayQueueJob"> | string
    attempts?: IntWithAggregatesFilter<"PayQueueJob"> | number
    maxAttempts?: IntWithAggregatesFilter<"PayQueueJob"> | number
    runAt?: DateTimeWithAggregatesFilter<"PayQueueJob"> | Date | string
    lockedBy?: StringNullableWithAggregatesFilter<"PayQueueJob"> | string | null
    lockedUntil?: DateTimeNullableWithAggregatesFilter<"PayQueueJob"> | Date | string | null
    lastError?: StringNullableWithAggregatesFilter<"PayQueueJob"> | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"PayQueueJob"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PayQueueJob"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PayQueueJob"> | Date | string
  }

  export type PayRateLimitBucketWhereInput = {
    AND?: PayRateLimitBucketWhereInput | PayRateLimitBucketWhereInput[]
    OR?: PayRateLimitBucketWhereInput[]
    NOT?: PayRateLimitBucketWhereInput | PayRateLimitBucketWhereInput[]
    id?: StringFilter<"PayRateLimitBucket"> | string
    bucketKey?: StringFilter<"PayRateLimitBucket"> | string
    count?: IntFilter<"PayRateLimitBucket"> | number
    expiresAt?: DateTimeFilter<"PayRateLimitBucket"> | Date | string
  }

  export type PayRateLimitBucketOrderByWithRelationInput = {
    id?: SortOrder
    bucketKey?: SortOrder
    count?: SortOrder
    expiresAt?: SortOrder
  }

  export type PayRateLimitBucketWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    bucketKey?: string
    AND?: PayRateLimitBucketWhereInput | PayRateLimitBucketWhereInput[]
    OR?: PayRateLimitBucketWhereInput[]
    NOT?: PayRateLimitBucketWhereInput | PayRateLimitBucketWhereInput[]
    count?: IntFilter<"PayRateLimitBucket"> | number
    expiresAt?: DateTimeFilter<"PayRateLimitBucket"> | Date | string
  }, "id" | "bucketKey">

  export type PayRateLimitBucketOrderByWithAggregationInput = {
    id?: SortOrder
    bucketKey?: SortOrder
    count?: SortOrder
    expiresAt?: SortOrder
    _count?: PayRateLimitBucketCountOrderByAggregateInput
    _avg?: PayRateLimitBucketAvgOrderByAggregateInput
    _max?: PayRateLimitBucketMaxOrderByAggregateInput
    _min?: PayRateLimitBucketMinOrderByAggregateInput
    _sum?: PayRateLimitBucketSumOrderByAggregateInput
  }

  export type PayRateLimitBucketScalarWhereWithAggregatesInput = {
    AND?: PayRateLimitBucketScalarWhereWithAggregatesInput | PayRateLimitBucketScalarWhereWithAggregatesInput[]
    OR?: PayRateLimitBucketScalarWhereWithAggregatesInput[]
    NOT?: PayRateLimitBucketScalarWhereWithAggregatesInput | PayRateLimitBucketScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayRateLimitBucket"> | string
    bucketKey?: StringWithAggregatesFilter<"PayRateLimitBucket"> | string
    count?: IntWithAggregatesFilter<"PayRateLimitBucket"> | number
    expiresAt?: DateTimeWithAggregatesFilter<"PayRateLimitBucket"> | Date | string
  }

  export type PayDailyProbeCounterWhereInput = {
    AND?: PayDailyProbeCounterWhereInput | PayDailyProbeCounterWhereInput[]
    OR?: PayDailyProbeCounterWhereInput[]
    NOT?: PayDailyProbeCounterWhereInput | PayDailyProbeCounterWhereInput[]
    id?: StringFilter<"PayDailyProbeCounter"> | string
    dayKey?: StringFilter<"PayDailyProbeCounter"> | string
    count?: IntFilter<"PayDailyProbeCounter"> | number
    updatedAt?: DateTimeFilter<"PayDailyProbeCounter"> | Date | string
    createdAt?: DateTimeFilter<"PayDailyProbeCounter"> | Date | string
  }

  export type PayDailyProbeCounterOrderByWithRelationInput = {
    id?: SortOrder
    dayKey?: SortOrder
    count?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayDailyProbeCounterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    dayKey?: string
    AND?: PayDailyProbeCounterWhereInput | PayDailyProbeCounterWhereInput[]
    OR?: PayDailyProbeCounterWhereInput[]
    NOT?: PayDailyProbeCounterWhereInput | PayDailyProbeCounterWhereInput[]
    count?: IntFilter<"PayDailyProbeCounter"> | number
    updatedAt?: DateTimeFilter<"PayDailyProbeCounter"> | Date | string
    createdAt?: DateTimeFilter<"PayDailyProbeCounter"> | Date | string
  }, "id" | "dayKey">

  export type PayDailyProbeCounterOrderByWithAggregationInput = {
    id?: SortOrder
    dayKey?: SortOrder
    count?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: PayDailyProbeCounterCountOrderByAggregateInput
    _avg?: PayDailyProbeCounterAvgOrderByAggregateInput
    _max?: PayDailyProbeCounterMaxOrderByAggregateInput
    _min?: PayDailyProbeCounterMinOrderByAggregateInput
    _sum?: PayDailyProbeCounterSumOrderByAggregateInput
  }

  export type PayDailyProbeCounterScalarWhereWithAggregatesInput = {
    AND?: PayDailyProbeCounterScalarWhereWithAggregatesInput | PayDailyProbeCounterScalarWhereWithAggregatesInput[]
    OR?: PayDailyProbeCounterScalarWhereWithAggregatesInput[]
    NOT?: PayDailyProbeCounterScalarWhereWithAggregatesInput | PayDailyProbeCounterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayDailyProbeCounter"> | string
    dayKey?: StringWithAggregatesFilter<"PayDailyProbeCounter"> | string
    count?: IntWithAggregatesFilter<"PayDailyProbeCounter"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"PayDailyProbeCounter"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"PayDailyProbeCounter"> | Date | string
  }

  export type PayMigrationWhereInput = {
    AND?: PayMigrationWhereInput | PayMigrationWhereInput[]
    OR?: PayMigrationWhereInput[]
    NOT?: PayMigrationWhereInput | PayMigrationWhereInput[]
    id?: StringFilter<"PayMigration"> | string
    version?: StringFilter<"PayMigration"> | string
    name?: StringFilter<"PayMigration"> | string
    appliedAt?: DateTimeFilter<"PayMigration"> | Date | string
  }

  export type PayMigrationOrderByWithRelationInput = {
    id?: SortOrder
    version?: SortOrder
    name?: SortOrder
    appliedAt?: SortOrder
  }

  export type PayMigrationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    version?: string
    AND?: PayMigrationWhereInput | PayMigrationWhereInput[]
    OR?: PayMigrationWhereInput[]
    NOT?: PayMigrationWhereInput | PayMigrationWhereInput[]
    name?: StringFilter<"PayMigration"> | string
    appliedAt?: DateTimeFilter<"PayMigration"> | Date | string
  }, "id" | "version">

  export type PayMigrationOrderByWithAggregationInput = {
    id?: SortOrder
    version?: SortOrder
    name?: SortOrder
    appliedAt?: SortOrder
    _count?: PayMigrationCountOrderByAggregateInput
    _max?: PayMigrationMaxOrderByAggregateInput
    _min?: PayMigrationMinOrderByAggregateInput
  }

  export type PayMigrationScalarWhereWithAggregatesInput = {
    AND?: PayMigrationScalarWhereWithAggregatesInput | PayMigrationScalarWhereWithAggregatesInput[]
    OR?: PayMigrationScalarWhereWithAggregatesInput[]
    NOT?: PayMigrationScalarWhereWithAggregatesInput | PayMigrationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayMigration"> | string
    version?: StringWithAggregatesFilter<"PayMigration"> | string
    name?: StringWithAggregatesFilter<"PayMigration"> | string
    appliedAt?: DateTimeWithAggregatesFilter<"PayMigration"> | Date | string
  }

  export type PayLedgerAccountWhereInput = {
    AND?: PayLedgerAccountWhereInput | PayLedgerAccountWhereInput[]
    OR?: PayLedgerAccountWhereInput[]
    NOT?: PayLedgerAccountWhereInput | PayLedgerAccountWhereInput[]
    id?: StringFilter<"PayLedgerAccount"> | string
    accountKey?: StringFilter<"PayLedgerAccount"> | string
    accountCode?: StringFilter<"PayLedgerAccount"> | string
    ownerType?: StringFilter<"PayLedgerAccount"> | string
    ownerId?: StringFilter<"PayLedgerAccount"> | string
    currency?: StringFilter<"PayLedgerAccount"> | string
    normalSide?: StringFilter<"PayLedgerAccount"> | string
    debitTotalPaise?: BigIntFilter<"PayLedgerAccount"> | bigint | number
    creditTotalPaise?: BigIntFilter<"PayLedgerAccount"> | bigint | number
    balancePaise?: BigIntFilter<"PayLedgerAccount"> | bigint | number
    version?: IntFilter<"PayLedgerAccount"> | number
    updatedAt?: DateTimeFilter<"PayLedgerAccount"> | Date | string
    createdAt?: DateTimeFilter<"PayLedgerAccount"> | Date | string
  }

  export type PayLedgerAccountOrderByWithRelationInput = {
    id?: SortOrder
    accountKey?: SortOrder
    accountCode?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    currency?: SortOrder
    normalSide?: SortOrder
    debitTotalPaise?: SortOrder
    creditTotalPaise?: SortOrder
    balancePaise?: SortOrder
    version?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayLedgerAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    accountKey?: string
    AND?: PayLedgerAccountWhereInput | PayLedgerAccountWhereInput[]
    OR?: PayLedgerAccountWhereInput[]
    NOT?: PayLedgerAccountWhereInput | PayLedgerAccountWhereInput[]
    accountCode?: StringFilter<"PayLedgerAccount"> | string
    ownerType?: StringFilter<"PayLedgerAccount"> | string
    ownerId?: StringFilter<"PayLedgerAccount"> | string
    currency?: StringFilter<"PayLedgerAccount"> | string
    normalSide?: StringFilter<"PayLedgerAccount"> | string
    debitTotalPaise?: BigIntFilter<"PayLedgerAccount"> | bigint | number
    creditTotalPaise?: BigIntFilter<"PayLedgerAccount"> | bigint | number
    balancePaise?: BigIntFilter<"PayLedgerAccount"> | bigint | number
    version?: IntFilter<"PayLedgerAccount"> | number
    updatedAt?: DateTimeFilter<"PayLedgerAccount"> | Date | string
    createdAt?: DateTimeFilter<"PayLedgerAccount"> | Date | string
  }, "id" | "accountKey">

  export type PayLedgerAccountOrderByWithAggregationInput = {
    id?: SortOrder
    accountKey?: SortOrder
    accountCode?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    currency?: SortOrder
    normalSide?: SortOrder
    debitTotalPaise?: SortOrder
    creditTotalPaise?: SortOrder
    balancePaise?: SortOrder
    version?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: PayLedgerAccountCountOrderByAggregateInput
    _avg?: PayLedgerAccountAvgOrderByAggregateInput
    _max?: PayLedgerAccountMaxOrderByAggregateInput
    _min?: PayLedgerAccountMinOrderByAggregateInput
    _sum?: PayLedgerAccountSumOrderByAggregateInput
  }

  export type PayLedgerAccountScalarWhereWithAggregatesInput = {
    AND?: PayLedgerAccountScalarWhereWithAggregatesInput | PayLedgerAccountScalarWhereWithAggregatesInput[]
    OR?: PayLedgerAccountScalarWhereWithAggregatesInput[]
    NOT?: PayLedgerAccountScalarWhereWithAggregatesInput | PayLedgerAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayLedgerAccount"> | string
    accountKey?: StringWithAggregatesFilter<"PayLedgerAccount"> | string
    accountCode?: StringWithAggregatesFilter<"PayLedgerAccount"> | string
    ownerType?: StringWithAggregatesFilter<"PayLedgerAccount"> | string
    ownerId?: StringWithAggregatesFilter<"PayLedgerAccount"> | string
    currency?: StringWithAggregatesFilter<"PayLedgerAccount"> | string
    normalSide?: StringWithAggregatesFilter<"PayLedgerAccount"> | string
    debitTotalPaise?: BigIntWithAggregatesFilter<"PayLedgerAccount"> | bigint | number
    creditTotalPaise?: BigIntWithAggregatesFilter<"PayLedgerAccount"> | bigint | number
    balancePaise?: BigIntWithAggregatesFilter<"PayLedgerAccount"> | bigint | number
    version?: IntWithAggregatesFilter<"PayLedgerAccount"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"PayLedgerAccount"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"PayLedgerAccount"> | Date | string
  }

  export type PayLedgerEntryWhereInput = {
    AND?: PayLedgerEntryWhereInput | PayLedgerEntryWhereInput[]
    OR?: PayLedgerEntryWhereInput[]
    NOT?: PayLedgerEntryWhereInput | PayLedgerEntryWhereInput[]
    id?: StringFilter<"PayLedgerEntry"> | string
    entryId?: StringFilter<"PayLedgerEntry"> | string
    idempotencyKey?: StringFilter<"PayLedgerEntry"> | string
    bookingId?: StringNullableFilter<"PayLedgerEntry"> | string | null
    eventType?: StringFilter<"PayLedgerEntry"> | string
    actorId?: StringFilter<"PayLedgerEntry"> | string
    actorRole?: StringFilter<"PayLedgerEntry"> | string
    reason?: StringFilter<"PayLedgerEntry"> | string
    totalPaise?: BigIntFilter<"PayLedgerEntry"> | bigint | number
    createdAt?: DateTimeFilter<"PayLedgerEntry"> | Date | string
  }

  export type PayLedgerEntryOrderByWithRelationInput = {
    id?: SortOrder
    entryId?: SortOrder
    idempotencyKey?: SortOrder
    bookingId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    reason?: SortOrder
    totalPaise?: SortOrder
    createdAt?: SortOrder
  }

  export type PayLedgerEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    entryId?: string
    idempotencyKey?: string
    AND?: PayLedgerEntryWhereInput | PayLedgerEntryWhereInput[]
    OR?: PayLedgerEntryWhereInput[]
    NOT?: PayLedgerEntryWhereInput | PayLedgerEntryWhereInput[]
    bookingId?: StringNullableFilter<"PayLedgerEntry"> | string | null
    eventType?: StringFilter<"PayLedgerEntry"> | string
    actorId?: StringFilter<"PayLedgerEntry"> | string
    actorRole?: StringFilter<"PayLedgerEntry"> | string
    reason?: StringFilter<"PayLedgerEntry"> | string
    totalPaise?: BigIntFilter<"PayLedgerEntry"> | bigint | number
    createdAt?: DateTimeFilter<"PayLedgerEntry"> | Date | string
  }, "id" | "entryId" | "idempotencyKey">

  export type PayLedgerEntryOrderByWithAggregationInput = {
    id?: SortOrder
    entryId?: SortOrder
    idempotencyKey?: SortOrder
    bookingId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    reason?: SortOrder
    totalPaise?: SortOrder
    createdAt?: SortOrder
    _count?: PayLedgerEntryCountOrderByAggregateInput
    _avg?: PayLedgerEntryAvgOrderByAggregateInput
    _max?: PayLedgerEntryMaxOrderByAggregateInput
    _min?: PayLedgerEntryMinOrderByAggregateInput
    _sum?: PayLedgerEntrySumOrderByAggregateInput
  }

  export type PayLedgerEntryScalarWhereWithAggregatesInput = {
    AND?: PayLedgerEntryScalarWhereWithAggregatesInput | PayLedgerEntryScalarWhereWithAggregatesInput[]
    OR?: PayLedgerEntryScalarWhereWithAggregatesInput[]
    NOT?: PayLedgerEntryScalarWhereWithAggregatesInput | PayLedgerEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayLedgerEntry"> | string
    entryId?: StringWithAggregatesFilter<"PayLedgerEntry"> | string
    idempotencyKey?: StringWithAggregatesFilter<"PayLedgerEntry"> | string
    bookingId?: StringNullableWithAggregatesFilter<"PayLedgerEntry"> | string | null
    eventType?: StringWithAggregatesFilter<"PayLedgerEntry"> | string
    actorId?: StringWithAggregatesFilter<"PayLedgerEntry"> | string
    actorRole?: StringWithAggregatesFilter<"PayLedgerEntry"> | string
    reason?: StringWithAggregatesFilter<"PayLedgerEntry"> | string
    totalPaise?: BigIntWithAggregatesFilter<"PayLedgerEntry"> | bigint | number
    createdAt?: DateTimeWithAggregatesFilter<"PayLedgerEntry"> | Date | string
  }

  export type PayLedgerLineWhereInput = {
    AND?: PayLedgerLineWhereInput | PayLedgerLineWhereInput[]
    OR?: PayLedgerLineWhereInput[]
    NOT?: PayLedgerLineWhereInput | PayLedgerLineWhereInput[]
    id?: StringFilter<"PayLedgerLine"> | string
    entryId?: StringFilter<"PayLedgerLine"> | string
    lineIndex?: IntFilter<"PayLedgerLine"> | number
    accountKey?: StringFilter<"PayLedgerLine"> | string
    accountCode?: StringFilter<"PayLedgerLine"> | string
    ownerType?: StringFilter<"PayLedgerLine"> | string
    ownerId?: StringFilter<"PayLedgerLine"> | string
    direction?: StringFilter<"PayLedgerLine"> | string
    amountPaise?: BigIntFilter<"PayLedgerLine"> | bigint | number
    bookingId?: StringNullableFilter<"PayLedgerLine"> | string | null
    createdAt?: DateTimeFilter<"PayLedgerLine"> | Date | string
  }

  export type PayLedgerLineOrderByWithRelationInput = {
    id?: SortOrder
    entryId?: SortOrder
    lineIndex?: SortOrder
    accountKey?: SortOrder
    accountCode?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    direction?: SortOrder
    amountPaise?: SortOrder
    bookingId?: SortOrder
    createdAt?: SortOrder
  }

  export type PayLedgerLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    entryId_lineIndex?: PayLedgerLineEntryIdLineIndexCompoundUniqueInput
    AND?: PayLedgerLineWhereInput | PayLedgerLineWhereInput[]
    OR?: PayLedgerLineWhereInput[]
    NOT?: PayLedgerLineWhereInput | PayLedgerLineWhereInput[]
    entryId?: StringFilter<"PayLedgerLine"> | string
    lineIndex?: IntFilter<"PayLedgerLine"> | number
    accountKey?: StringFilter<"PayLedgerLine"> | string
    accountCode?: StringFilter<"PayLedgerLine"> | string
    ownerType?: StringFilter<"PayLedgerLine"> | string
    ownerId?: StringFilter<"PayLedgerLine"> | string
    direction?: StringFilter<"PayLedgerLine"> | string
    amountPaise?: BigIntFilter<"PayLedgerLine"> | bigint | number
    bookingId?: StringNullableFilter<"PayLedgerLine"> | string | null
    createdAt?: DateTimeFilter<"PayLedgerLine"> | Date | string
  }, "id" | "entryId_lineIndex">

  export type PayLedgerLineOrderByWithAggregationInput = {
    id?: SortOrder
    entryId?: SortOrder
    lineIndex?: SortOrder
    accountKey?: SortOrder
    accountCode?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    direction?: SortOrder
    amountPaise?: SortOrder
    bookingId?: SortOrder
    createdAt?: SortOrder
    _count?: PayLedgerLineCountOrderByAggregateInput
    _avg?: PayLedgerLineAvgOrderByAggregateInput
    _max?: PayLedgerLineMaxOrderByAggregateInput
    _min?: PayLedgerLineMinOrderByAggregateInput
    _sum?: PayLedgerLineSumOrderByAggregateInput
  }

  export type PayLedgerLineScalarWhereWithAggregatesInput = {
    AND?: PayLedgerLineScalarWhereWithAggregatesInput | PayLedgerLineScalarWhereWithAggregatesInput[]
    OR?: PayLedgerLineScalarWhereWithAggregatesInput[]
    NOT?: PayLedgerLineScalarWhereWithAggregatesInput | PayLedgerLineScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayLedgerLine"> | string
    entryId?: StringWithAggregatesFilter<"PayLedgerLine"> | string
    lineIndex?: IntWithAggregatesFilter<"PayLedgerLine"> | number
    accountKey?: StringWithAggregatesFilter<"PayLedgerLine"> | string
    accountCode?: StringWithAggregatesFilter<"PayLedgerLine"> | string
    ownerType?: StringWithAggregatesFilter<"PayLedgerLine"> | string
    ownerId?: StringWithAggregatesFilter<"PayLedgerLine"> | string
    direction?: StringWithAggregatesFilter<"PayLedgerLine"> | string
    amountPaise?: BigIntWithAggregatesFilter<"PayLedgerLine"> | bigint | number
    bookingId?: StringNullableWithAggregatesFilter<"PayLedgerLine"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PayLedgerLine"> | Date | string
  }

  export type PayBookingWhereInput = {
    AND?: PayBookingWhereInput | PayBookingWhereInput[]
    OR?: PayBookingWhereInput[]
    NOT?: PayBookingWhereInput | PayBookingWhereInput[]
    id?: StringFilter<"PayBooking"> | string
    bookingId?: StringFilter<"PayBooking"> | string
    brandId?: StringFilter<"PayBooking"> | string
    brandName?: StringFilter<"PayBooking"> | string
    creatorId?: StringFilter<"PayBooking"> | string
    creatorName?: StringFilter<"PayBooking"> | string
    creatorSlug?: StringNullableFilter<"PayBooking"> | string | null
    status?: StringFilter<"PayBooking"> | string
    isOpen?: BoolFilter<"PayBooking"> | boolean
    itemKind?: StringFilter<"PayBooking"> | string
    itemKey?: StringFilter<"PayBooking"> | string
    rateCardItemId?: StringNullableFilter<"PayBooking"> | string | null
    packageId?: StringNullableFilter<"PayBooking"> | string | null
    itemTitle?: StringFilter<"PayBooking"> | string
    pricingType?: StringFilter<"PayBooking"> | string
    selectedAddonsJson?: StringFilter<"PayBooking"> | string
    quantity?: IntFilter<"PayBooking"> | number
    deliveryDate?: StringFilter<"PayBooking"> | string
    brief?: StringFilter<"PayBooking"> | string
    referenceLinksJson?: StringFilter<"PayBooking"> | string
    assetIdsJson?: StringFilter<"PayBooking"> | string
    budgetNote?: StringNullableFilter<"PayBooking"> | string | null
    quoteSnapshotJson?: StringFilter<"PayBooking"> | string
    feeConfigVersion?: StringFilter<"PayBooking"> | string
    rateCardItemVersion?: IntFilter<"PayBooking"> | number
    counterRound?: IntFilter<"PayBooking"> | number
    contactMaskedCount?: IntFilter<"PayBooking"> | number
    rejectionReason?: StringNullableFilter<"PayBooking"> | string | null
    expiresAt?: DateTimeFilter<"PayBooking"> | Date | string
    version?: IntFilter<"PayBooking"> | number
    createdAt?: DateTimeFilter<"PayBooking"> | Date | string
    updatedAt?: DateTimeFilter<"PayBooking"> | Date | string
  }

  export type PayBookingOrderByWithRelationInput = {
    id?: SortOrder
    bookingId?: SortOrder
    brandId?: SortOrder
    brandName?: SortOrder
    creatorId?: SortOrder
    creatorName?: SortOrder
    creatorSlug?: SortOrder
    status?: SortOrder
    isOpen?: SortOrder
    itemKind?: SortOrder
    itemKey?: SortOrder
    rateCardItemId?: SortOrder
    packageId?: SortOrder
    itemTitle?: SortOrder
    pricingType?: SortOrder
    selectedAddonsJson?: SortOrder
    quantity?: SortOrder
    deliveryDate?: SortOrder
    brief?: SortOrder
    referenceLinksJson?: SortOrder
    assetIdsJson?: SortOrder
    budgetNote?: SortOrder
    quoteSnapshotJson?: SortOrder
    feeConfigVersion?: SortOrder
    rateCardItemVersion?: SortOrder
    counterRound?: SortOrder
    contactMaskedCount?: SortOrder
    rejectionReason?: SortOrder
    expiresAt?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayBookingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    bookingId?: string
    AND?: PayBookingWhereInput | PayBookingWhereInput[]
    OR?: PayBookingWhereInput[]
    NOT?: PayBookingWhereInput | PayBookingWhereInput[]
    brandId?: StringFilter<"PayBooking"> | string
    brandName?: StringFilter<"PayBooking"> | string
    creatorId?: StringFilter<"PayBooking"> | string
    creatorName?: StringFilter<"PayBooking"> | string
    creatorSlug?: StringNullableFilter<"PayBooking"> | string | null
    status?: StringFilter<"PayBooking"> | string
    isOpen?: BoolFilter<"PayBooking"> | boolean
    itemKind?: StringFilter<"PayBooking"> | string
    itemKey?: StringFilter<"PayBooking"> | string
    rateCardItemId?: StringNullableFilter<"PayBooking"> | string | null
    packageId?: StringNullableFilter<"PayBooking"> | string | null
    itemTitle?: StringFilter<"PayBooking"> | string
    pricingType?: StringFilter<"PayBooking"> | string
    selectedAddonsJson?: StringFilter<"PayBooking"> | string
    quantity?: IntFilter<"PayBooking"> | number
    deliveryDate?: StringFilter<"PayBooking"> | string
    brief?: StringFilter<"PayBooking"> | string
    referenceLinksJson?: StringFilter<"PayBooking"> | string
    assetIdsJson?: StringFilter<"PayBooking"> | string
    budgetNote?: StringNullableFilter<"PayBooking"> | string | null
    quoteSnapshotJson?: StringFilter<"PayBooking"> | string
    feeConfigVersion?: StringFilter<"PayBooking"> | string
    rateCardItemVersion?: IntFilter<"PayBooking"> | number
    counterRound?: IntFilter<"PayBooking"> | number
    contactMaskedCount?: IntFilter<"PayBooking"> | number
    rejectionReason?: StringNullableFilter<"PayBooking"> | string | null
    expiresAt?: DateTimeFilter<"PayBooking"> | Date | string
    version?: IntFilter<"PayBooking"> | number
    createdAt?: DateTimeFilter<"PayBooking"> | Date | string
    updatedAt?: DateTimeFilter<"PayBooking"> | Date | string
  }, "id" | "bookingId">

  export type PayBookingOrderByWithAggregationInput = {
    id?: SortOrder
    bookingId?: SortOrder
    brandId?: SortOrder
    brandName?: SortOrder
    creatorId?: SortOrder
    creatorName?: SortOrder
    creatorSlug?: SortOrder
    status?: SortOrder
    isOpen?: SortOrder
    itemKind?: SortOrder
    itemKey?: SortOrder
    rateCardItemId?: SortOrder
    packageId?: SortOrder
    itemTitle?: SortOrder
    pricingType?: SortOrder
    selectedAddonsJson?: SortOrder
    quantity?: SortOrder
    deliveryDate?: SortOrder
    brief?: SortOrder
    referenceLinksJson?: SortOrder
    assetIdsJson?: SortOrder
    budgetNote?: SortOrder
    quoteSnapshotJson?: SortOrder
    feeConfigVersion?: SortOrder
    rateCardItemVersion?: SortOrder
    counterRound?: SortOrder
    contactMaskedCount?: SortOrder
    rejectionReason?: SortOrder
    expiresAt?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PayBookingCountOrderByAggregateInput
    _avg?: PayBookingAvgOrderByAggregateInput
    _max?: PayBookingMaxOrderByAggregateInput
    _min?: PayBookingMinOrderByAggregateInput
    _sum?: PayBookingSumOrderByAggregateInput
  }

  export type PayBookingScalarWhereWithAggregatesInput = {
    AND?: PayBookingScalarWhereWithAggregatesInput | PayBookingScalarWhereWithAggregatesInput[]
    OR?: PayBookingScalarWhereWithAggregatesInput[]
    NOT?: PayBookingScalarWhereWithAggregatesInput | PayBookingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayBooking"> | string
    bookingId?: StringWithAggregatesFilter<"PayBooking"> | string
    brandId?: StringWithAggregatesFilter<"PayBooking"> | string
    brandName?: StringWithAggregatesFilter<"PayBooking"> | string
    creatorId?: StringWithAggregatesFilter<"PayBooking"> | string
    creatorName?: StringWithAggregatesFilter<"PayBooking"> | string
    creatorSlug?: StringNullableWithAggregatesFilter<"PayBooking"> | string | null
    status?: StringWithAggregatesFilter<"PayBooking"> | string
    isOpen?: BoolWithAggregatesFilter<"PayBooking"> | boolean
    itemKind?: StringWithAggregatesFilter<"PayBooking"> | string
    itemKey?: StringWithAggregatesFilter<"PayBooking"> | string
    rateCardItemId?: StringNullableWithAggregatesFilter<"PayBooking"> | string | null
    packageId?: StringNullableWithAggregatesFilter<"PayBooking"> | string | null
    itemTitle?: StringWithAggregatesFilter<"PayBooking"> | string
    pricingType?: StringWithAggregatesFilter<"PayBooking"> | string
    selectedAddonsJson?: StringWithAggregatesFilter<"PayBooking"> | string
    quantity?: IntWithAggregatesFilter<"PayBooking"> | number
    deliveryDate?: StringWithAggregatesFilter<"PayBooking"> | string
    brief?: StringWithAggregatesFilter<"PayBooking"> | string
    referenceLinksJson?: StringWithAggregatesFilter<"PayBooking"> | string
    assetIdsJson?: StringWithAggregatesFilter<"PayBooking"> | string
    budgetNote?: StringNullableWithAggregatesFilter<"PayBooking"> | string | null
    quoteSnapshotJson?: StringWithAggregatesFilter<"PayBooking"> | string
    feeConfigVersion?: StringWithAggregatesFilter<"PayBooking"> | string
    rateCardItemVersion?: IntWithAggregatesFilter<"PayBooking"> | number
    counterRound?: IntWithAggregatesFilter<"PayBooking"> | number
    contactMaskedCount?: IntWithAggregatesFilter<"PayBooking"> | number
    rejectionReason?: StringNullableWithAggregatesFilter<"PayBooking"> | string | null
    expiresAt?: DateTimeWithAggregatesFilter<"PayBooking"> | Date | string
    version?: IntWithAggregatesFilter<"PayBooking"> | number
    createdAt?: DateTimeWithAggregatesFilter<"PayBooking"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PayBooking"> | Date | string
  }

  export type PayBookingEventWhereInput = {
    AND?: PayBookingEventWhereInput | PayBookingEventWhereInput[]
    OR?: PayBookingEventWhereInput[]
    NOT?: PayBookingEventWhereInput | PayBookingEventWhereInput[]
    id?: StringFilter<"PayBookingEvent"> | string
    eventId?: StringFilter<"PayBookingEvent"> | string
    bookingId?: StringFilter<"PayBookingEvent"> | string
    eventType?: StringFilter<"PayBookingEvent"> | string
    actorId?: StringFilter<"PayBookingEvent"> | string
    actorRole?: StringFilter<"PayBookingEvent"> | string
    fromStatus?: StringNullableFilter<"PayBookingEvent"> | string | null
    toStatus?: StringFilter<"PayBookingEvent"> | string
    reason?: StringNullableFilter<"PayBookingEvent"> | string | null
    counterDeltaJson?: StringNullableFilter<"PayBookingEvent"> | string | null
    createdAt?: DateTimeFilter<"PayBookingEvent"> | Date | string
  }

  export type PayBookingEventOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    bookingId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    reason?: SortOrder
    counterDeltaJson?: SortOrder
    createdAt?: SortOrder
  }

  export type PayBookingEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    eventId?: string
    AND?: PayBookingEventWhereInput | PayBookingEventWhereInput[]
    OR?: PayBookingEventWhereInput[]
    NOT?: PayBookingEventWhereInput | PayBookingEventWhereInput[]
    bookingId?: StringFilter<"PayBookingEvent"> | string
    eventType?: StringFilter<"PayBookingEvent"> | string
    actorId?: StringFilter<"PayBookingEvent"> | string
    actorRole?: StringFilter<"PayBookingEvent"> | string
    fromStatus?: StringNullableFilter<"PayBookingEvent"> | string | null
    toStatus?: StringFilter<"PayBookingEvent"> | string
    reason?: StringNullableFilter<"PayBookingEvent"> | string | null
    counterDeltaJson?: StringNullableFilter<"PayBookingEvent"> | string | null
    createdAt?: DateTimeFilter<"PayBookingEvent"> | Date | string
  }, "id" | "eventId">

  export type PayBookingEventOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    bookingId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    reason?: SortOrder
    counterDeltaJson?: SortOrder
    createdAt?: SortOrder
    _count?: PayBookingEventCountOrderByAggregateInput
    _max?: PayBookingEventMaxOrderByAggregateInput
    _min?: PayBookingEventMinOrderByAggregateInput
  }

  export type PayBookingEventScalarWhereWithAggregatesInput = {
    AND?: PayBookingEventScalarWhereWithAggregatesInput | PayBookingEventScalarWhereWithAggregatesInput[]
    OR?: PayBookingEventScalarWhereWithAggregatesInput[]
    NOT?: PayBookingEventScalarWhereWithAggregatesInput | PayBookingEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayBookingEvent"> | string
    eventId?: StringWithAggregatesFilter<"PayBookingEvent"> | string
    bookingId?: StringWithAggregatesFilter<"PayBookingEvent"> | string
    eventType?: StringWithAggregatesFilter<"PayBookingEvent"> | string
    actorId?: StringWithAggregatesFilter<"PayBookingEvent"> | string
    actorRole?: StringWithAggregatesFilter<"PayBookingEvent"> | string
    fromStatus?: StringNullableWithAggregatesFilter<"PayBookingEvent"> | string | null
    toStatus?: StringWithAggregatesFilter<"PayBookingEvent"> | string
    reason?: StringNullableWithAggregatesFilter<"PayBookingEvent"> | string | null
    counterDeltaJson?: StringNullableWithAggregatesFilter<"PayBookingEvent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PayBookingEvent"> | Date | string
  }

  export type PayNotificationWhereInput = {
    AND?: PayNotificationWhereInput | PayNotificationWhereInput[]
    OR?: PayNotificationWhereInput[]
    NOT?: PayNotificationWhereInput | PayNotificationWhereInput[]
    id?: StringFilter<"PayNotification"> | string
    notifId?: StringFilter<"PayNotification"> | string
    userId?: StringFilter<"PayNotification"> | string
    role?: StringFilter<"PayNotification"> | string
    type?: StringFilter<"PayNotification"> | string
    title?: StringFilter<"PayNotification"> | string
    message?: StringFilter<"PayNotification"> | string
    bookingId?: StringNullableFilter<"PayNotification"> | string | null
    readAt?: DateTimeNullableFilter<"PayNotification"> | Date | string | null
    createdAt?: DateTimeFilter<"PayNotification"> | Date | string
  }

  export type PayNotificationOrderByWithRelationInput = {
    id?: SortOrder
    notifId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    bookingId?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayNotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    notifId?: string
    AND?: PayNotificationWhereInput | PayNotificationWhereInput[]
    OR?: PayNotificationWhereInput[]
    NOT?: PayNotificationWhereInput | PayNotificationWhereInput[]
    userId?: StringFilter<"PayNotification"> | string
    role?: StringFilter<"PayNotification"> | string
    type?: StringFilter<"PayNotification"> | string
    title?: StringFilter<"PayNotification"> | string
    message?: StringFilter<"PayNotification"> | string
    bookingId?: StringNullableFilter<"PayNotification"> | string | null
    readAt?: DateTimeNullableFilter<"PayNotification"> | Date | string | null
    createdAt?: DateTimeFilter<"PayNotification"> | Date | string
  }, "id" | "notifId">

  export type PayNotificationOrderByWithAggregationInput = {
    id?: SortOrder
    notifId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    bookingId?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
    _count?: PayNotificationCountOrderByAggregateInput
    _max?: PayNotificationMaxOrderByAggregateInput
    _min?: PayNotificationMinOrderByAggregateInput
  }

  export type PayNotificationScalarWhereWithAggregatesInput = {
    AND?: PayNotificationScalarWhereWithAggregatesInput | PayNotificationScalarWhereWithAggregatesInput[]
    OR?: PayNotificationScalarWhereWithAggregatesInput[]
    NOT?: PayNotificationScalarWhereWithAggregatesInput | PayNotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayNotification"> | string
    notifId?: StringWithAggregatesFilter<"PayNotification"> | string
    userId?: StringWithAggregatesFilter<"PayNotification"> | string
    role?: StringWithAggregatesFilter<"PayNotification"> | string
    type?: StringWithAggregatesFilter<"PayNotification"> | string
    title?: StringWithAggregatesFilter<"PayNotification"> | string
    message?: StringWithAggregatesFilter<"PayNotification"> | string
    bookingId?: StringNullableWithAggregatesFilter<"PayNotification"> | string | null
    readAt?: DateTimeNullableWithAggregatesFilter<"PayNotification"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PayNotification"> | Date | string
  }

  export type PayConfigVersionCreateInput = {
    id?: string
    version: string
    brandFeeBps: number
    creatorFeeBps: number
    gstBps: number
    defaultTdsBps: number
    offerExpiryHours?: number
    signWindowHours?: number
    paymentWindowHours?: number
    reviewSlaHours?: number
    holdPeriodHours?: number
    disputeWindowHours?: number
    minWithdrawalPaise?: bigint | number
    isActive?: boolean
    createdBy: string
    createdAt?: Date | string
  }

  export type PayConfigVersionUncheckedCreateInput = {
    id?: string
    version: string
    brandFeeBps: number
    creatorFeeBps: number
    gstBps: number
    defaultTdsBps: number
    offerExpiryHours?: number
    signWindowHours?: number
    paymentWindowHours?: number
    reviewSlaHours?: number
    holdPeriodHours?: number
    disputeWindowHours?: number
    minWithdrawalPaise?: bigint | number
    isActive?: boolean
    createdBy: string
    createdAt?: Date | string
  }

  export type PayConfigVersionUpdateInput = {
    version?: StringFieldUpdateOperationsInput | string
    brandFeeBps?: IntFieldUpdateOperationsInput | number
    creatorFeeBps?: IntFieldUpdateOperationsInput | number
    gstBps?: IntFieldUpdateOperationsInput | number
    defaultTdsBps?: IntFieldUpdateOperationsInput | number
    offerExpiryHours?: IntFieldUpdateOperationsInput | number
    signWindowHours?: IntFieldUpdateOperationsInput | number
    paymentWindowHours?: IntFieldUpdateOperationsInput | number
    reviewSlaHours?: IntFieldUpdateOperationsInput | number
    holdPeriodHours?: IntFieldUpdateOperationsInput | number
    disputeWindowHours?: IntFieldUpdateOperationsInput | number
    minWithdrawalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayConfigVersionUncheckedUpdateInput = {
    version?: StringFieldUpdateOperationsInput | string
    brandFeeBps?: IntFieldUpdateOperationsInput | number
    creatorFeeBps?: IntFieldUpdateOperationsInput | number
    gstBps?: IntFieldUpdateOperationsInput | number
    defaultTdsBps?: IntFieldUpdateOperationsInput | number
    offerExpiryHours?: IntFieldUpdateOperationsInput | number
    signWindowHours?: IntFieldUpdateOperationsInput | number
    paymentWindowHours?: IntFieldUpdateOperationsInput | number
    reviewSlaHours?: IntFieldUpdateOperationsInput | number
    holdPeriodHours?: IntFieldUpdateOperationsInput | number
    disputeWindowHours?: IntFieldUpdateOperationsInput | number
    minWithdrawalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayConfigVersionCreateManyInput = {
    id?: string
    version: string
    brandFeeBps: number
    creatorFeeBps: number
    gstBps: number
    defaultTdsBps: number
    offerExpiryHours?: number
    signWindowHours?: number
    paymentWindowHours?: number
    reviewSlaHours?: number
    holdPeriodHours?: number
    disputeWindowHours?: number
    minWithdrawalPaise?: bigint | number
    isActive?: boolean
    createdBy: string
    createdAt?: Date | string
  }

  export type PayConfigVersionUpdateManyMutationInput = {
    version?: StringFieldUpdateOperationsInput | string
    brandFeeBps?: IntFieldUpdateOperationsInput | number
    creatorFeeBps?: IntFieldUpdateOperationsInput | number
    gstBps?: IntFieldUpdateOperationsInput | number
    defaultTdsBps?: IntFieldUpdateOperationsInput | number
    offerExpiryHours?: IntFieldUpdateOperationsInput | number
    signWindowHours?: IntFieldUpdateOperationsInput | number
    paymentWindowHours?: IntFieldUpdateOperationsInput | number
    reviewSlaHours?: IntFieldUpdateOperationsInput | number
    holdPeriodHours?: IntFieldUpdateOperationsInput | number
    disputeWindowHours?: IntFieldUpdateOperationsInput | number
    minWithdrawalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayConfigVersionUncheckedUpdateManyInput = {
    version?: StringFieldUpdateOperationsInput | string
    brandFeeBps?: IntFieldUpdateOperationsInput | number
    creatorFeeBps?: IntFieldUpdateOperationsInput | number
    gstBps?: IntFieldUpdateOperationsInput | number
    defaultTdsBps?: IntFieldUpdateOperationsInput | number
    offerExpiryHours?: IntFieldUpdateOperationsInput | number
    signWindowHours?: IntFieldUpdateOperationsInput | number
    paymentWindowHours?: IntFieldUpdateOperationsInput | number
    reviewSlaHours?: IntFieldUpdateOperationsInput | number
    holdPeriodHours?: IntFieldUpdateOperationsInput | number
    disputeWindowHours?: IntFieldUpdateOperationsInput | number
    minWithdrawalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayFeatureFlagCreateInput = {
    id?: string
    key: string
    enabled?: boolean
    updatedBy: string
    reason?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type PayFeatureFlagUncheckedCreateInput = {
    id?: string
    key: string
    enabled?: boolean
    updatedBy: string
    reason?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type PayFeatureFlagUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    updatedBy?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayFeatureFlagUncheckedUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    updatedBy?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayFeatureFlagCreateManyInput = {
    id?: string
    key: string
    enabled?: boolean
    updatedBy: string
    reason?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type PayFeatureFlagUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    updatedBy?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayFeatureFlagUncheckedUpdateManyInput = {
    key?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    updatedBy?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayConfigApprovalCreateInput = {
    id?: string
    approvalType: string
    approvedBy: string
    scope: string
    reason: string
    isActive?: boolean
    approvedAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type PayConfigApprovalUncheckedCreateInput = {
    id?: string
    approvalType: string
    approvedBy: string
    scope: string
    reason: string
    isActive?: boolean
    approvedAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type PayConfigApprovalUpdateInput = {
    approvalType?: StringFieldUpdateOperationsInput | string
    approvedBy?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PayConfigApprovalUncheckedUpdateInput = {
    approvalType?: StringFieldUpdateOperationsInput | string
    approvedBy?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PayConfigApprovalCreateManyInput = {
    id?: string
    approvalType: string
    approvedBy: string
    scope: string
    reason: string
    isActive?: boolean
    approvedAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type PayConfigApprovalUpdateManyMutationInput = {
    approvalType?: StringFieldUpdateOperationsInput | string
    approvedBy?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PayConfigApprovalUncheckedUpdateManyInput = {
    approvalType?: StringFieldUpdateOperationsInput | string
    approvedBy?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PayIdempotencyRecordCreateInput = {
    id?: string
    scope: string
    key: string
    requestHash: string
    status: string
    statusCode?: number | null
    responseJson?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayIdempotencyRecordUncheckedCreateInput = {
    id?: string
    scope: string
    key: string
    requestHash: string
    status: string
    statusCode?: number | null
    responseJson?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayIdempotencyRecordUpdateInput = {
    scope?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    requestHash?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseJson?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayIdempotencyRecordUncheckedUpdateInput = {
    scope?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    requestHash?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseJson?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayIdempotencyRecordCreateManyInput = {
    id?: string
    scope: string
    key: string
    requestHash: string
    status: string
    statusCode?: number | null
    responseJson?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayIdempotencyRecordUpdateManyMutationInput = {
    scope?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    requestHash?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseJson?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayIdempotencyRecordUncheckedUpdateManyInput = {
    scope?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    requestHash?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseJson?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayOutboxEventCreateInput = {
    id?: string
    eventId: string
    eventType: string
    aggregateType: string
    aggregateId: string
    payloadJson: string
    status?: string
    attempts?: number
    maxAttempts?: number
    nextAttemptAt?: Date | string
    lockedBy?: string | null
    lockedUntil?: Date | string | null
    lastError?: string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayOutboxEventUncheckedCreateInput = {
    id?: string
    eventId: string
    eventType: string
    aggregateType: string
    aggregateId: string
    payloadJson: string
    status?: string
    attempts?: number
    maxAttempts?: number
    nextAttemptAt?: Date | string
    lockedBy?: string | null
    lockedUntil?: Date | string | null
    lastError?: string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayOutboxEventUpdateInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    aggregateType?: StringFieldUpdateOperationsInput | string
    aggregateId?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    nextAttemptAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedBy?: NullableStringFieldUpdateOperationsInput | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayOutboxEventUncheckedUpdateInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    aggregateType?: StringFieldUpdateOperationsInput | string
    aggregateId?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    nextAttemptAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedBy?: NullableStringFieldUpdateOperationsInput | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayOutboxEventCreateManyInput = {
    id?: string
    eventId: string
    eventType: string
    aggregateType: string
    aggregateId: string
    payloadJson: string
    status?: string
    attempts?: number
    maxAttempts?: number
    nextAttemptAt?: Date | string
    lockedBy?: string | null
    lockedUntil?: Date | string | null
    lastError?: string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayOutboxEventUpdateManyMutationInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    aggregateType?: StringFieldUpdateOperationsInput | string
    aggregateId?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    nextAttemptAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedBy?: NullableStringFieldUpdateOperationsInput | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayOutboxEventUncheckedUpdateManyInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    aggregateType?: StringFieldUpdateOperationsInput | string
    aggregateId?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    nextAttemptAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedBy?: NullableStringFieldUpdateOperationsInput | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayConsumedEventCreateInput = {
    id?: string
    consumerName: string
    eventId: string
    processedAt?: Date | string
  }

  export type PayConsumedEventUncheckedCreateInput = {
    id?: string
    consumerName: string
    eventId: string
    processedAt?: Date | string
  }

  export type PayConsumedEventUpdateInput = {
    consumerName?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayConsumedEventUncheckedUpdateInput = {
    consumerName?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayConsumedEventCreateManyInput = {
    id?: string
    consumerName: string
    eventId: string
    processedAt?: Date | string
  }

  export type PayConsumedEventUpdateManyMutationInput = {
    consumerName?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayConsumedEventUncheckedUpdateManyInput = {
    consumerName?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayDlqEventCreateInput = {
    id?: string
    sourceType: string
    sourceId: string
    eventType: string
    payloadJson: string
    errorMessage: string
    attempts: number
    replayedAt?: Date | string | null
    replayedBy?: string | null
    createdAt?: Date | string
  }

  export type PayDlqEventUncheckedCreateInput = {
    id?: string
    sourceType: string
    sourceId: string
    eventType: string
    payloadJson: string
    errorMessage: string
    attempts: number
    replayedAt?: Date | string | null
    replayedBy?: string | null
    createdAt?: Date | string
  }

  export type PayDlqEventUpdateInput = {
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    replayedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replayedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayDlqEventUncheckedUpdateInput = {
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    replayedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replayedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayDlqEventCreateManyInput = {
    id?: string
    sourceType: string
    sourceId: string
    eventType: string
    payloadJson: string
    errorMessage: string
    attempts: number
    replayedAt?: Date | string | null
    replayedBy?: string | null
    createdAt?: Date | string
  }

  export type PayDlqEventUpdateManyMutationInput = {
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    replayedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replayedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayDlqEventUncheckedUpdateManyInput = {
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    replayedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replayedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayAuditEventCreateInput = {
    id?: string
    seq: number
    actorId: string
    actorRole: string
    action: string
    resourceType: string
    resourceId: string
    reason?: string | null
    payloadJson: string
    prevHash: string
    hash: string
    createdAt?: Date | string
  }

  export type PayAuditEventUncheckedCreateInput = {
    id?: string
    seq: number
    actorId: string
    actorRole: string
    action: string
    resourceType: string
    resourceId: string
    reason?: string | null
    payloadJson: string
    prevHash: string
    hash: string
    createdAt?: Date | string
  }

  export type PayAuditEventUpdateInput = {
    seq?: IntFieldUpdateOperationsInput | number
    actorId?: StringFieldUpdateOperationsInput | string
    actorRole?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    prevHash?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayAuditEventUncheckedUpdateInput = {
    seq?: IntFieldUpdateOperationsInput | number
    actorId?: StringFieldUpdateOperationsInput | string
    actorRole?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    prevHash?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayAuditEventCreateManyInput = {
    id?: string
    seq: number
    actorId: string
    actorRole: string
    action: string
    resourceType: string
    resourceId: string
    reason?: string | null
    payloadJson: string
    prevHash: string
    hash: string
    createdAt?: Date | string
  }

  export type PayAuditEventUpdateManyMutationInput = {
    seq?: IntFieldUpdateOperationsInput | number
    actorId?: StringFieldUpdateOperationsInput | string
    actorRole?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    prevHash?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayAuditEventUncheckedUpdateManyInput = {
    seq?: IntFieldUpdateOperationsInput | number
    actorId?: StringFieldUpdateOperationsInput | string
    actorRole?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    prevHash?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayQueueJobCreateInput = {
    id?: string
    queueName: string
    jobType: string
    dedupKey: string
    payloadJson: string
    status?: string
    attempts?: number
    maxAttempts?: number
    runAt?: Date | string
    lockedBy?: string | null
    lockedUntil?: Date | string | null
    lastError?: string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayQueueJobUncheckedCreateInput = {
    id?: string
    queueName: string
    jobType: string
    dedupKey: string
    payloadJson: string
    status?: string
    attempts?: number
    maxAttempts?: number
    runAt?: Date | string
    lockedBy?: string | null
    lockedUntil?: Date | string | null
    lastError?: string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayQueueJobUpdateInput = {
    queueName?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    dedupKey?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    runAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedBy?: NullableStringFieldUpdateOperationsInput | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayQueueJobUncheckedUpdateInput = {
    queueName?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    dedupKey?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    runAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedBy?: NullableStringFieldUpdateOperationsInput | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayQueueJobCreateManyInput = {
    id?: string
    queueName: string
    jobType: string
    dedupKey: string
    payloadJson: string
    status?: string
    attempts?: number
    maxAttempts?: number
    runAt?: Date | string
    lockedBy?: string | null
    lockedUntil?: Date | string | null
    lastError?: string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayQueueJobUpdateManyMutationInput = {
    queueName?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    dedupKey?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    runAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedBy?: NullableStringFieldUpdateOperationsInput | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayQueueJobUncheckedUpdateManyInput = {
    queueName?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    dedupKey?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    runAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedBy?: NullableStringFieldUpdateOperationsInput | string | null
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayRateLimitBucketCreateInput = {
    id?: string
    bucketKey: string
    count?: number
    expiresAt: Date | string
  }

  export type PayRateLimitBucketUncheckedCreateInput = {
    id?: string
    bucketKey: string
    count?: number
    expiresAt: Date | string
  }

  export type PayRateLimitBucketUpdateInput = {
    bucketKey?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayRateLimitBucketUncheckedUpdateInput = {
    bucketKey?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayRateLimitBucketCreateManyInput = {
    id?: string
    bucketKey: string
    count?: number
    expiresAt: Date | string
  }

  export type PayRateLimitBucketUpdateManyMutationInput = {
    bucketKey?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayRateLimitBucketUncheckedUpdateManyInput = {
    bucketKey?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayDailyProbeCounterCreateInput = {
    id?: string
    dayKey: string
    count?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type PayDailyProbeCounterUncheckedCreateInput = {
    id?: string
    dayKey: string
    count?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type PayDailyProbeCounterUpdateInput = {
    dayKey?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayDailyProbeCounterUncheckedUpdateInput = {
    dayKey?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayDailyProbeCounterCreateManyInput = {
    id?: string
    dayKey: string
    count?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type PayDailyProbeCounterUpdateManyMutationInput = {
    dayKey?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayDailyProbeCounterUncheckedUpdateManyInput = {
    dayKey?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayMigrationCreateInput = {
    id?: string
    version: string
    name: string
    appliedAt?: Date | string
  }

  export type PayMigrationUncheckedCreateInput = {
    id?: string
    version: string
    name: string
    appliedAt?: Date | string
  }

  export type PayMigrationUpdateInput = {
    version?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayMigrationUncheckedUpdateInput = {
    version?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayMigrationCreateManyInput = {
    id?: string
    version: string
    name: string
    appliedAt?: Date | string
  }

  export type PayMigrationUpdateManyMutationInput = {
    version?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayMigrationUncheckedUpdateManyInput = {
    version?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayLedgerAccountCreateInput = {
    id?: string
    accountKey: string
    accountCode: string
    ownerType: string
    ownerId: string
    currency?: string
    normalSide: string
    debitTotalPaise?: bigint | number
    creditTotalPaise?: bigint | number
    balancePaise?: bigint | number
    version?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type PayLedgerAccountUncheckedCreateInput = {
    id?: string
    accountKey: string
    accountCode: string
    ownerType: string
    ownerId: string
    currency?: string
    normalSide: string
    debitTotalPaise?: bigint | number
    creditTotalPaise?: bigint | number
    balancePaise?: bigint | number
    version?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type PayLedgerAccountUpdateInput = {
    accountKey?: StringFieldUpdateOperationsInput | string
    accountCode?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    normalSide?: StringFieldUpdateOperationsInput | string
    debitTotalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    creditTotalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    balancePaise?: BigIntFieldUpdateOperationsInput | bigint | number
    version?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayLedgerAccountUncheckedUpdateInput = {
    accountKey?: StringFieldUpdateOperationsInput | string
    accountCode?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    normalSide?: StringFieldUpdateOperationsInput | string
    debitTotalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    creditTotalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    balancePaise?: BigIntFieldUpdateOperationsInput | bigint | number
    version?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayLedgerAccountCreateManyInput = {
    id?: string
    accountKey: string
    accountCode: string
    ownerType: string
    ownerId: string
    currency?: string
    normalSide: string
    debitTotalPaise?: bigint | number
    creditTotalPaise?: bigint | number
    balancePaise?: bigint | number
    version?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type PayLedgerAccountUpdateManyMutationInput = {
    accountKey?: StringFieldUpdateOperationsInput | string
    accountCode?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    normalSide?: StringFieldUpdateOperationsInput | string
    debitTotalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    creditTotalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    balancePaise?: BigIntFieldUpdateOperationsInput | bigint | number
    version?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayLedgerAccountUncheckedUpdateManyInput = {
    accountKey?: StringFieldUpdateOperationsInput | string
    accountCode?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    normalSide?: StringFieldUpdateOperationsInput | string
    debitTotalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    creditTotalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    balancePaise?: BigIntFieldUpdateOperationsInput | bigint | number
    version?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayLedgerEntryCreateInput = {
    id?: string
    entryId: string
    idempotencyKey: string
    bookingId?: string | null
    eventType: string
    actorId: string
    actorRole: string
    reason: string
    totalPaise: bigint | number
    createdAt?: Date | string
  }

  export type PayLedgerEntryUncheckedCreateInput = {
    id?: string
    entryId: string
    idempotencyKey: string
    bookingId?: string | null
    eventType: string
    actorId: string
    actorRole: string
    reason: string
    totalPaise: bigint | number
    createdAt?: Date | string
  }

  export type PayLedgerEntryUpdateInput = {
    entryId?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    actorRole?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    totalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayLedgerEntryUncheckedUpdateInput = {
    entryId?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    actorRole?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    totalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayLedgerEntryCreateManyInput = {
    id?: string
    entryId: string
    idempotencyKey: string
    bookingId?: string | null
    eventType: string
    actorId: string
    actorRole: string
    reason: string
    totalPaise: bigint | number
    createdAt?: Date | string
  }

  export type PayLedgerEntryUpdateManyMutationInput = {
    entryId?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    actorRole?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    totalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayLedgerEntryUncheckedUpdateManyInput = {
    entryId?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    actorRole?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    totalPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayLedgerLineCreateInput = {
    id?: string
    entryId: string
    lineIndex: number
    accountKey: string
    accountCode: string
    ownerType: string
    ownerId: string
    direction: string
    amountPaise: bigint | number
    bookingId?: string | null
    createdAt?: Date | string
  }

  export type PayLedgerLineUncheckedCreateInput = {
    id?: string
    entryId: string
    lineIndex: number
    accountKey: string
    accountCode: string
    ownerType: string
    ownerId: string
    direction: string
    amountPaise: bigint | number
    bookingId?: string | null
    createdAt?: Date | string
  }

  export type PayLedgerLineUpdateInput = {
    entryId?: StringFieldUpdateOperationsInput | string
    lineIndex?: IntFieldUpdateOperationsInput | number
    accountKey?: StringFieldUpdateOperationsInput | string
    accountCode?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    amountPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayLedgerLineUncheckedUpdateInput = {
    entryId?: StringFieldUpdateOperationsInput | string
    lineIndex?: IntFieldUpdateOperationsInput | number
    accountKey?: StringFieldUpdateOperationsInput | string
    accountCode?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    amountPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayLedgerLineCreateManyInput = {
    id?: string
    entryId: string
    lineIndex: number
    accountKey: string
    accountCode: string
    ownerType: string
    ownerId: string
    direction: string
    amountPaise: bigint | number
    bookingId?: string | null
    createdAt?: Date | string
  }

  export type PayLedgerLineUpdateManyMutationInput = {
    entryId?: StringFieldUpdateOperationsInput | string
    lineIndex?: IntFieldUpdateOperationsInput | number
    accountKey?: StringFieldUpdateOperationsInput | string
    accountCode?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    amountPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayLedgerLineUncheckedUpdateManyInput = {
    entryId?: StringFieldUpdateOperationsInput | string
    lineIndex?: IntFieldUpdateOperationsInput | number
    accountKey?: StringFieldUpdateOperationsInput | string
    accountCode?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    amountPaise?: BigIntFieldUpdateOperationsInput | bigint | number
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayBookingCreateInput = {
    id?: string
    bookingId: string
    brandId: string
    brandName: string
    creatorId: string
    creatorName: string
    creatorSlug?: string | null
    status: string
    isOpen?: boolean
    itemKind: string
    itemKey: string
    rateCardItemId?: string | null
    packageId?: string | null
    itemTitle: string
    pricingType: string
    selectedAddonsJson: string
    quantity?: number
    deliveryDate: string
    brief: string
    referenceLinksJson: string
    assetIdsJson: string
    budgetNote?: string | null
    quoteSnapshotJson: string
    feeConfigVersion: string
    rateCardItemVersion?: number
    counterRound?: number
    contactMaskedCount?: number
    rejectionReason?: string | null
    expiresAt: Date | string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayBookingUncheckedCreateInput = {
    id?: string
    bookingId: string
    brandId: string
    brandName: string
    creatorId: string
    creatorName: string
    creatorSlug?: string | null
    status: string
    isOpen?: boolean
    itemKind: string
    itemKey: string
    rateCardItemId?: string | null
    packageId?: string | null
    itemTitle: string
    pricingType: string
    selectedAddonsJson: string
    quantity?: number
    deliveryDate: string
    brief: string
    referenceLinksJson: string
    assetIdsJson: string
    budgetNote?: string | null
    quoteSnapshotJson: string
    feeConfigVersion: string
    rateCardItemVersion?: number
    counterRound?: number
    contactMaskedCount?: number
    rejectionReason?: string | null
    expiresAt: Date | string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayBookingUpdateInput = {
    bookingId?: StringFieldUpdateOperationsInput | string
    brandId?: StringFieldUpdateOperationsInput | string
    brandName?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    creatorName?: StringFieldUpdateOperationsInput | string
    creatorSlug?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isOpen?: BoolFieldUpdateOperationsInput | boolean
    itemKind?: StringFieldUpdateOperationsInput | string
    itemKey?: StringFieldUpdateOperationsInput | string
    rateCardItemId?: NullableStringFieldUpdateOperationsInput | string | null
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    itemTitle?: StringFieldUpdateOperationsInput | string
    pricingType?: StringFieldUpdateOperationsInput | string
    selectedAddonsJson?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    deliveryDate?: StringFieldUpdateOperationsInput | string
    brief?: StringFieldUpdateOperationsInput | string
    referenceLinksJson?: StringFieldUpdateOperationsInput | string
    assetIdsJson?: StringFieldUpdateOperationsInput | string
    budgetNote?: NullableStringFieldUpdateOperationsInput | string | null
    quoteSnapshotJson?: StringFieldUpdateOperationsInput | string
    feeConfigVersion?: StringFieldUpdateOperationsInput | string
    rateCardItemVersion?: IntFieldUpdateOperationsInput | number
    counterRound?: IntFieldUpdateOperationsInput | number
    contactMaskedCount?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayBookingUncheckedUpdateInput = {
    bookingId?: StringFieldUpdateOperationsInput | string
    brandId?: StringFieldUpdateOperationsInput | string
    brandName?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    creatorName?: StringFieldUpdateOperationsInput | string
    creatorSlug?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isOpen?: BoolFieldUpdateOperationsInput | boolean
    itemKind?: StringFieldUpdateOperationsInput | string
    itemKey?: StringFieldUpdateOperationsInput | string
    rateCardItemId?: NullableStringFieldUpdateOperationsInput | string | null
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    itemTitle?: StringFieldUpdateOperationsInput | string
    pricingType?: StringFieldUpdateOperationsInput | string
    selectedAddonsJson?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    deliveryDate?: StringFieldUpdateOperationsInput | string
    brief?: StringFieldUpdateOperationsInput | string
    referenceLinksJson?: StringFieldUpdateOperationsInput | string
    assetIdsJson?: StringFieldUpdateOperationsInput | string
    budgetNote?: NullableStringFieldUpdateOperationsInput | string | null
    quoteSnapshotJson?: StringFieldUpdateOperationsInput | string
    feeConfigVersion?: StringFieldUpdateOperationsInput | string
    rateCardItemVersion?: IntFieldUpdateOperationsInput | number
    counterRound?: IntFieldUpdateOperationsInput | number
    contactMaskedCount?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayBookingCreateManyInput = {
    id?: string
    bookingId: string
    brandId: string
    brandName: string
    creatorId: string
    creatorName: string
    creatorSlug?: string | null
    status: string
    isOpen?: boolean
    itemKind: string
    itemKey: string
    rateCardItemId?: string | null
    packageId?: string | null
    itemTitle: string
    pricingType: string
    selectedAddonsJson: string
    quantity?: number
    deliveryDate: string
    brief: string
    referenceLinksJson: string
    assetIdsJson: string
    budgetNote?: string | null
    quoteSnapshotJson: string
    feeConfigVersion: string
    rateCardItemVersion?: number
    counterRound?: number
    contactMaskedCount?: number
    rejectionReason?: string | null
    expiresAt: Date | string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayBookingUpdateManyMutationInput = {
    bookingId?: StringFieldUpdateOperationsInput | string
    brandId?: StringFieldUpdateOperationsInput | string
    brandName?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    creatorName?: StringFieldUpdateOperationsInput | string
    creatorSlug?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isOpen?: BoolFieldUpdateOperationsInput | boolean
    itemKind?: StringFieldUpdateOperationsInput | string
    itemKey?: StringFieldUpdateOperationsInput | string
    rateCardItemId?: NullableStringFieldUpdateOperationsInput | string | null
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    itemTitle?: StringFieldUpdateOperationsInput | string
    pricingType?: StringFieldUpdateOperationsInput | string
    selectedAddonsJson?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    deliveryDate?: StringFieldUpdateOperationsInput | string
    brief?: StringFieldUpdateOperationsInput | string
    referenceLinksJson?: StringFieldUpdateOperationsInput | string
    assetIdsJson?: StringFieldUpdateOperationsInput | string
    budgetNote?: NullableStringFieldUpdateOperationsInput | string | null
    quoteSnapshotJson?: StringFieldUpdateOperationsInput | string
    feeConfigVersion?: StringFieldUpdateOperationsInput | string
    rateCardItemVersion?: IntFieldUpdateOperationsInput | number
    counterRound?: IntFieldUpdateOperationsInput | number
    contactMaskedCount?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayBookingUncheckedUpdateManyInput = {
    bookingId?: StringFieldUpdateOperationsInput | string
    brandId?: StringFieldUpdateOperationsInput | string
    brandName?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    creatorName?: StringFieldUpdateOperationsInput | string
    creatorSlug?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isOpen?: BoolFieldUpdateOperationsInput | boolean
    itemKind?: StringFieldUpdateOperationsInput | string
    itemKey?: StringFieldUpdateOperationsInput | string
    rateCardItemId?: NullableStringFieldUpdateOperationsInput | string | null
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    itemTitle?: StringFieldUpdateOperationsInput | string
    pricingType?: StringFieldUpdateOperationsInput | string
    selectedAddonsJson?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    deliveryDate?: StringFieldUpdateOperationsInput | string
    brief?: StringFieldUpdateOperationsInput | string
    referenceLinksJson?: StringFieldUpdateOperationsInput | string
    assetIdsJson?: StringFieldUpdateOperationsInput | string
    budgetNote?: NullableStringFieldUpdateOperationsInput | string | null
    quoteSnapshotJson?: StringFieldUpdateOperationsInput | string
    feeConfigVersion?: StringFieldUpdateOperationsInput | string
    rateCardItemVersion?: IntFieldUpdateOperationsInput | number
    counterRound?: IntFieldUpdateOperationsInput | number
    contactMaskedCount?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayBookingEventCreateInput = {
    id?: string
    eventId: string
    bookingId: string
    eventType: string
    actorId: string
    actorRole: string
    fromStatus?: string | null
    toStatus: string
    reason?: string | null
    counterDeltaJson?: string | null
    createdAt?: Date | string
  }

  export type PayBookingEventUncheckedCreateInput = {
    id?: string
    eventId: string
    bookingId: string
    eventType: string
    actorId: string
    actorRole: string
    fromStatus?: string | null
    toStatus: string
    reason?: string | null
    counterDeltaJson?: string | null
    createdAt?: Date | string
  }

  export type PayBookingEventUpdateInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    actorRole?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableStringFieldUpdateOperationsInput | string | null
    toStatus?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    counterDeltaJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayBookingEventUncheckedUpdateInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    actorRole?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableStringFieldUpdateOperationsInput | string | null
    toStatus?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    counterDeltaJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayBookingEventCreateManyInput = {
    id?: string
    eventId: string
    bookingId: string
    eventType: string
    actorId: string
    actorRole: string
    fromStatus?: string | null
    toStatus: string
    reason?: string | null
    counterDeltaJson?: string | null
    createdAt?: Date | string
  }

  export type PayBookingEventUpdateManyMutationInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    actorRole?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableStringFieldUpdateOperationsInput | string | null
    toStatus?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    counterDeltaJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayBookingEventUncheckedUpdateManyInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    actorRole?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableStringFieldUpdateOperationsInput | string | null
    toStatus?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    counterDeltaJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayNotificationCreateInput = {
    id?: string
    notifId: string
    userId: string
    role: string
    type: string
    title: string
    message: string
    bookingId?: string | null
    readAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PayNotificationUncheckedCreateInput = {
    id?: string
    notifId: string
    userId: string
    role: string
    type: string
    title: string
    message: string
    bookingId?: string | null
    readAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PayNotificationUpdateInput = {
    notifId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayNotificationUncheckedUpdateInput = {
    notifId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayNotificationCreateManyInput = {
    id?: string
    notifId: string
    userId: string
    role: string
    type: string
    title: string
    message: string
    bookingId?: string | null
    readAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PayNotificationUpdateManyMutationInput = {
    notifId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayNotificationUncheckedUpdateManyInput = {
    notifId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PayConfigVersionCountOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    brandFeeBps?: SortOrder
    creatorFeeBps?: SortOrder
    gstBps?: SortOrder
    defaultTdsBps?: SortOrder
    offerExpiryHours?: SortOrder
    signWindowHours?: SortOrder
    paymentWindowHours?: SortOrder
    reviewSlaHours?: SortOrder
    holdPeriodHours?: SortOrder
    disputeWindowHours?: SortOrder
    minWithdrawalPaise?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PayConfigVersionAvgOrderByAggregateInput = {
    brandFeeBps?: SortOrder
    creatorFeeBps?: SortOrder
    gstBps?: SortOrder
    defaultTdsBps?: SortOrder
    offerExpiryHours?: SortOrder
    signWindowHours?: SortOrder
    paymentWindowHours?: SortOrder
    reviewSlaHours?: SortOrder
    holdPeriodHours?: SortOrder
    disputeWindowHours?: SortOrder
    minWithdrawalPaise?: SortOrder
  }

  export type PayConfigVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    brandFeeBps?: SortOrder
    creatorFeeBps?: SortOrder
    gstBps?: SortOrder
    defaultTdsBps?: SortOrder
    offerExpiryHours?: SortOrder
    signWindowHours?: SortOrder
    paymentWindowHours?: SortOrder
    reviewSlaHours?: SortOrder
    holdPeriodHours?: SortOrder
    disputeWindowHours?: SortOrder
    minWithdrawalPaise?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PayConfigVersionMinOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    brandFeeBps?: SortOrder
    creatorFeeBps?: SortOrder
    gstBps?: SortOrder
    defaultTdsBps?: SortOrder
    offerExpiryHours?: SortOrder
    signWindowHours?: SortOrder
    paymentWindowHours?: SortOrder
    reviewSlaHours?: SortOrder
    holdPeriodHours?: SortOrder
    disputeWindowHours?: SortOrder
    minWithdrawalPaise?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PayConfigVersionSumOrderByAggregateInput = {
    brandFeeBps?: SortOrder
    creatorFeeBps?: SortOrder
    gstBps?: SortOrder
    defaultTdsBps?: SortOrder
    offerExpiryHours?: SortOrder
    signWindowHours?: SortOrder
    paymentWindowHours?: SortOrder
    reviewSlaHours?: SortOrder
    holdPeriodHours?: SortOrder
    disputeWindowHours?: SortOrder
    minWithdrawalPaise?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type PayFeatureFlagCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    enabled?: SortOrder
    updatedBy?: SortOrder
    reason?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayFeatureFlagMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    enabled?: SortOrder
    updatedBy?: SortOrder
    reason?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayFeatureFlagMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    enabled?: SortOrder
    updatedBy?: SortOrder
    reason?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }

  export type PayConfigApprovalCountOrderByAggregateInput = {
    id?: SortOrder
    approvalType?: SortOrder
    approvedBy?: SortOrder
    scope?: SortOrder
    reason?: SortOrder
    isActive?: SortOrder
    approvedAt?: SortOrder
    revokedAt?: SortOrder
  }

  export type PayConfigApprovalMaxOrderByAggregateInput = {
    id?: SortOrder
    approvalType?: SortOrder
    approvedBy?: SortOrder
    scope?: SortOrder
    reason?: SortOrder
    isActive?: SortOrder
    approvedAt?: SortOrder
    revokedAt?: SortOrder
  }

  export type PayConfigApprovalMinOrderByAggregateInput = {
    id?: SortOrder
    approvalType?: SortOrder
    approvedBy?: SortOrder
    scope?: SortOrder
    reason?: SortOrder
    isActive?: SortOrder
    approvedAt?: SortOrder
    revokedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type PayIdempotencyRecordScopeKeyCompoundUniqueInput = {
    scope: string
    key: string
  }

  export type PayIdempotencyRecordCountOrderByAggregateInput = {
    id?: SortOrder
    scope?: SortOrder
    key?: SortOrder
    requestHash?: SortOrder
    status?: SortOrder
    statusCode?: SortOrder
    responseJson?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayIdempotencyRecordAvgOrderByAggregateInput = {
    statusCode?: SortOrder
  }

  export type PayIdempotencyRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    scope?: SortOrder
    key?: SortOrder
    requestHash?: SortOrder
    status?: SortOrder
    statusCode?: SortOrder
    responseJson?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayIdempotencyRecordMinOrderByAggregateInput = {
    id?: SortOrder
    scope?: SortOrder
    key?: SortOrder
    requestHash?: SortOrder
    status?: SortOrder
    statusCode?: SortOrder
    responseJson?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayIdempotencyRecordSumOrderByAggregateInput = {
    statusCode?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type PayOutboxEventCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    eventType?: SortOrder
    aggregateType?: SortOrder
    aggregateId?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    nextAttemptAt?: SortOrder
    lockedBy?: SortOrder
    lockedUntil?: SortOrder
    lastError?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayOutboxEventAvgOrderByAggregateInput = {
    attempts?: SortOrder
    maxAttempts?: SortOrder
  }

  export type PayOutboxEventMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    eventType?: SortOrder
    aggregateType?: SortOrder
    aggregateId?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    nextAttemptAt?: SortOrder
    lockedBy?: SortOrder
    lockedUntil?: SortOrder
    lastError?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayOutboxEventMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    eventType?: SortOrder
    aggregateType?: SortOrder
    aggregateId?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    nextAttemptAt?: SortOrder
    lockedBy?: SortOrder
    lockedUntil?: SortOrder
    lastError?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayOutboxEventSumOrderByAggregateInput = {
    attempts?: SortOrder
    maxAttempts?: SortOrder
  }

  export type PayConsumedEventConsumerNameEventIdCompoundUniqueInput = {
    consumerName: string
    eventId: string
  }

  export type PayConsumedEventCountOrderByAggregateInput = {
    id?: SortOrder
    consumerName?: SortOrder
    eventId?: SortOrder
    processedAt?: SortOrder
  }

  export type PayConsumedEventMaxOrderByAggregateInput = {
    id?: SortOrder
    consumerName?: SortOrder
    eventId?: SortOrder
    processedAt?: SortOrder
  }

  export type PayConsumedEventMinOrderByAggregateInput = {
    id?: SortOrder
    consumerName?: SortOrder
    eventId?: SortOrder
    processedAt?: SortOrder
  }

  export type PayDlqEventCountOrderByAggregateInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    eventType?: SortOrder
    payloadJson?: SortOrder
    errorMessage?: SortOrder
    attempts?: SortOrder
    replayedAt?: SortOrder
    replayedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PayDlqEventAvgOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type PayDlqEventMaxOrderByAggregateInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    eventType?: SortOrder
    payloadJson?: SortOrder
    errorMessage?: SortOrder
    attempts?: SortOrder
    replayedAt?: SortOrder
    replayedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PayDlqEventMinOrderByAggregateInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    eventType?: SortOrder
    payloadJson?: SortOrder
    errorMessage?: SortOrder
    attempts?: SortOrder
    replayedAt?: SortOrder
    replayedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PayDlqEventSumOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type PayAuditEventCountOrderByAggregateInput = {
    id?: SortOrder
    seq?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    reason?: SortOrder
    payloadJson?: SortOrder
    prevHash?: SortOrder
    hash?: SortOrder
    createdAt?: SortOrder
  }

  export type PayAuditEventAvgOrderByAggregateInput = {
    seq?: SortOrder
  }

  export type PayAuditEventMaxOrderByAggregateInput = {
    id?: SortOrder
    seq?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    reason?: SortOrder
    payloadJson?: SortOrder
    prevHash?: SortOrder
    hash?: SortOrder
    createdAt?: SortOrder
  }

  export type PayAuditEventMinOrderByAggregateInput = {
    id?: SortOrder
    seq?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    reason?: SortOrder
    payloadJson?: SortOrder
    prevHash?: SortOrder
    hash?: SortOrder
    createdAt?: SortOrder
  }

  export type PayAuditEventSumOrderByAggregateInput = {
    seq?: SortOrder
  }

  export type PayQueueJobCountOrderByAggregateInput = {
    id?: SortOrder
    queueName?: SortOrder
    jobType?: SortOrder
    dedupKey?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    runAt?: SortOrder
    lockedBy?: SortOrder
    lockedUntil?: SortOrder
    lastError?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayQueueJobAvgOrderByAggregateInput = {
    attempts?: SortOrder
    maxAttempts?: SortOrder
  }

  export type PayQueueJobMaxOrderByAggregateInput = {
    id?: SortOrder
    queueName?: SortOrder
    jobType?: SortOrder
    dedupKey?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    runAt?: SortOrder
    lockedBy?: SortOrder
    lockedUntil?: SortOrder
    lastError?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayQueueJobMinOrderByAggregateInput = {
    id?: SortOrder
    queueName?: SortOrder
    jobType?: SortOrder
    dedupKey?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    runAt?: SortOrder
    lockedBy?: SortOrder
    lockedUntil?: SortOrder
    lastError?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayQueueJobSumOrderByAggregateInput = {
    attempts?: SortOrder
    maxAttempts?: SortOrder
  }

  export type PayRateLimitBucketCountOrderByAggregateInput = {
    id?: SortOrder
    bucketKey?: SortOrder
    count?: SortOrder
    expiresAt?: SortOrder
  }

  export type PayRateLimitBucketAvgOrderByAggregateInput = {
    count?: SortOrder
  }

  export type PayRateLimitBucketMaxOrderByAggregateInput = {
    id?: SortOrder
    bucketKey?: SortOrder
    count?: SortOrder
    expiresAt?: SortOrder
  }

  export type PayRateLimitBucketMinOrderByAggregateInput = {
    id?: SortOrder
    bucketKey?: SortOrder
    count?: SortOrder
    expiresAt?: SortOrder
  }

  export type PayRateLimitBucketSumOrderByAggregateInput = {
    count?: SortOrder
  }

  export type PayDailyProbeCounterCountOrderByAggregateInput = {
    id?: SortOrder
    dayKey?: SortOrder
    count?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayDailyProbeCounterAvgOrderByAggregateInput = {
    count?: SortOrder
  }

  export type PayDailyProbeCounterMaxOrderByAggregateInput = {
    id?: SortOrder
    dayKey?: SortOrder
    count?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayDailyProbeCounterMinOrderByAggregateInput = {
    id?: SortOrder
    dayKey?: SortOrder
    count?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayDailyProbeCounterSumOrderByAggregateInput = {
    count?: SortOrder
  }

  export type PayMigrationCountOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    name?: SortOrder
    appliedAt?: SortOrder
  }

  export type PayMigrationMaxOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    name?: SortOrder
    appliedAt?: SortOrder
  }

  export type PayMigrationMinOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    name?: SortOrder
    appliedAt?: SortOrder
  }

  export type PayLedgerAccountCountOrderByAggregateInput = {
    id?: SortOrder
    accountKey?: SortOrder
    accountCode?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    currency?: SortOrder
    normalSide?: SortOrder
    debitTotalPaise?: SortOrder
    creditTotalPaise?: SortOrder
    balancePaise?: SortOrder
    version?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayLedgerAccountAvgOrderByAggregateInput = {
    debitTotalPaise?: SortOrder
    creditTotalPaise?: SortOrder
    balancePaise?: SortOrder
    version?: SortOrder
  }

  export type PayLedgerAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    accountKey?: SortOrder
    accountCode?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    currency?: SortOrder
    normalSide?: SortOrder
    debitTotalPaise?: SortOrder
    creditTotalPaise?: SortOrder
    balancePaise?: SortOrder
    version?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayLedgerAccountMinOrderByAggregateInput = {
    id?: SortOrder
    accountKey?: SortOrder
    accountCode?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    currency?: SortOrder
    normalSide?: SortOrder
    debitTotalPaise?: SortOrder
    creditTotalPaise?: SortOrder
    balancePaise?: SortOrder
    version?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayLedgerAccountSumOrderByAggregateInput = {
    debitTotalPaise?: SortOrder
    creditTotalPaise?: SortOrder
    balancePaise?: SortOrder
    version?: SortOrder
  }

  export type PayLedgerEntryCountOrderByAggregateInput = {
    id?: SortOrder
    entryId?: SortOrder
    idempotencyKey?: SortOrder
    bookingId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    reason?: SortOrder
    totalPaise?: SortOrder
    createdAt?: SortOrder
  }

  export type PayLedgerEntryAvgOrderByAggregateInput = {
    totalPaise?: SortOrder
  }

  export type PayLedgerEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    entryId?: SortOrder
    idempotencyKey?: SortOrder
    bookingId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    reason?: SortOrder
    totalPaise?: SortOrder
    createdAt?: SortOrder
  }

  export type PayLedgerEntryMinOrderByAggregateInput = {
    id?: SortOrder
    entryId?: SortOrder
    idempotencyKey?: SortOrder
    bookingId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    reason?: SortOrder
    totalPaise?: SortOrder
    createdAt?: SortOrder
  }

  export type PayLedgerEntrySumOrderByAggregateInput = {
    totalPaise?: SortOrder
  }

  export type PayLedgerLineEntryIdLineIndexCompoundUniqueInput = {
    entryId: string
    lineIndex: number
  }

  export type PayLedgerLineCountOrderByAggregateInput = {
    id?: SortOrder
    entryId?: SortOrder
    lineIndex?: SortOrder
    accountKey?: SortOrder
    accountCode?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    direction?: SortOrder
    amountPaise?: SortOrder
    bookingId?: SortOrder
    createdAt?: SortOrder
  }

  export type PayLedgerLineAvgOrderByAggregateInput = {
    lineIndex?: SortOrder
    amountPaise?: SortOrder
  }

  export type PayLedgerLineMaxOrderByAggregateInput = {
    id?: SortOrder
    entryId?: SortOrder
    lineIndex?: SortOrder
    accountKey?: SortOrder
    accountCode?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    direction?: SortOrder
    amountPaise?: SortOrder
    bookingId?: SortOrder
    createdAt?: SortOrder
  }

  export type PayLedgerLineMinOrderByAggregateInput = {
    id?: SortOrder
    entryId?: SortOrder
    lineIndex?: SortOrder
    accountKey?: SortOrder
    accountCode?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    direction?: SortOrder
    amountPaise?: SortOrder
    bookingId?: SortOrder
    createdAt?: SortOrder
  }

  export type PayLedgerLineSumOrderByAggregateInput = {
    lineIndex?: SortOrder
    amountPaise?: SortOrder
  }

  export type PayBookingCountOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    brandId?: SortOrder
    brandName?: SortOrder
    creatorId?: SortOrder
    creatorName?: SortOrder
    creatorSlug?: SortOrder
    status?: SortOrder
    isOpen?: SortOrder
    itemKind?: SortOrder
    itemKey?: SortOrder
    rateCardItemId?: SortOrder
    packageId?: SortOrder
    itemTitle?: SortOrder
    pricingType?: SortOrder
    selectedAddonsJson?: SortOrder
    quantity?: SortOrder
    deliveryDate?: SortOrder
    brief?: SortOrder
    referenceLinksJson?: SortOrder
    assetIdsJson?: SortOrder
    budgetNote?: SortOrder
    quoteSnapshotJson?: SortOrder
    feeConfigVersion?: SortOrder
    rateCardItemVersion?: SortOrder
    counterRound?: SortOrder
    contactMaskedCount?: SortOrder
    rejectionReason?: SortOrder
    expiresAt?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayBookingAvgOrderByAggregateInput = {
    quantity?: SortOrder
    rateCardItemVersion?: SortOrder
    counterRound?: SortOrder
    contactMaskedCount?: SortOrder
    version?: SortOrder
  }

  export type PayBookingMaxOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    brandId?: SortOrder
    brandName?: SortOrder
    creatorId?: SortOrder
    creatorName?: SortOrder
    creatorSlug?: SortOrder
    status?: SortOrder
    isOpen?: SortOrder
    itemKind?: SortOrder
    itemKey?: SortOrder
    rateCardItemId?: SortOrder
    packageId?: SortOrder
    itemTitle?: SortOrder
    pricingType?: SortOrder
    selectedAddonsJson?: SortOrder
    quantity?: SortOrder
    deliveryDate?: SortOrder
    brief?: SortOrder
    referenceLinksJson?: SortOrder
    assetIdsJson?: SortOrder
    budgetNote?: SortOrder
    quoteSnapshotJson?: SortOrder
    feeConfigVersion?: SortOrder
    rateCardItemVersion?: SortOrder
    counterRound?: SortOrder
    contactMaskedCount?: SortOrder
    rejectionReason?: SortOrder
    expiresAt?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayBookingMinOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    brandId?: SortOrder
    brandName?: SortOrder
    creatorId?: SortOrder
    creatorName?: SortOrder
    creatorSlug?: SortOrder
    status?: SortOrder
    isOpen?: SortOrder
    itemKind?: SortOrder
    itemKey?: SortOrder
    rateCardItemId?: SortOrder
    packageId?: SortOrder
    itemTitle?: SortOrder
    pricingType?: SortOrder
    selectedAddonsJson?: SortOrder
    quantity?: SortOrder
    deliveryDate?: SortOrder
    brief?: SortOrder
    referenceLinksJson?: SortOrder
    assetIdsJson?: SortOrder
    budgetNote?: SortOrder
    quoteSnapshotJson?: SortOrder
    feeConfigVersion?: SortOrder
    rateCardItemVersion?: SortOrder
    counterRound?: SortOrder
    contactMaskedCount?: SortOrder
    rejectionReason?: SortOrder
    expiresAt?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayBookingSumOrderByAggregateInput = {
    quantity?: SortOrder
    rateCardItemVersion?: SortOrder
    counterRound?: SortOrder
    contactMaskedCount?: SortOrder
    version?: SortOrder
  }

  export type PayBookingEventCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    bookingId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    reason?: SortOrder
    counterDeltaJson?: SortOrder
    createdAt?: SortOrder
  }

  export type PayBookingEventMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    bookingId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    reason?: SortOrder
    counterDeltaJson?: SortOrder
    createdAt?: SortOrder
  }

  export type PayBookingEventMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    bookingId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    reason?: SortOrder
    counterDeltaJson?: SortOrder
    createdAt?: SortOrder
  }

  export type PayNotificationCountOrderByAggregateInput = {
    id?: SortOrder
    notifId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    bookingId?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayNotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    notifId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    bookingId?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PayNotificationMinOrderByAggregateInput = {
    id?: SortOrder
    notifId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    bookingId?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
    unset?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
    unset?: boolean
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}