
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
 * Model MediaAsset
 * 
 */
export type MediaAsset = $Result.DefaultSelection<Prisma.$MediaAssetPayload>
/**
 * Model AssetVersion
 * 
 */
export type AssetVersion = $Result.DefaultSelection<Prisma.$AssetVersionPayload>
/**
 * Model AssetBlob
 * 
 */
export type AssetBlob = $Result.DefaultSelection<Prisma.$AssetBlobPayload>
/**
 * Model AssetLink
 * 
 */
export type AssetLink = $Result.DefaultSelection<Prisma.$AssetLinkPayload>
/**
 * Model AssetEvent
 * 
 */
export type AssetEvent = $Result.DefaultSelection<Prisma.$AssetEventPayload>
/**
 * Model UploadSession
 * 
 */
export type UploadSession = $Result.DefaultSelection<Prisma.$UploadSessionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more MediaAssets
 * const mediaAssets = await prisma.mediaAsset.findMany()
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
   * // Fetch zero or more MediaAssets
   * const mediaAssets = await prisma.mediaAsset.findMany()
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
   * `prisma.mediaAsset`: Exposes CRUD operations for the **MediaAsset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MediaAssets
    * const mediaAssets = await prisma.mediaAsset.findMany()
    * ```
    */
  get mediaAsset(): Prisma.MediaAssetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.assetVersion`: Exposes CRUD operations for the **AssetVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AssetVersions
    * const assetVersions = await prisma.assetVersion.findMany()
    * ```
    */
  get assetVersion(): Prisma.AssetVersionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.assetBlob`: Exposes CRUD operations for the **AssetBlob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AssetBlobs
    * const assetBlobs = await prisma.assetBlob.findMany()
    * ```
    */
  get assetBlob(): Prisma.AssetBlobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.assetLink`: Exposes CRUD operations for the **AssetLink** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AssetLinks
    * const assetLinks = await prisma.assetLink.findMany()
    * ```
    */
  get assetLink(): Prisma.AssetLinkDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.assetEvent`: Exposes CRUD operations for the **AssetEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AssetEvents
    * const assetEvents = await prisma.assetEvent.findMany()
    * ```
    */
  get assetEvent(): Prisma.AssetEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.uploadSession`: Exposes CRUD operations for the **UploadSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UploadSessions
    * const uploadSessions = await prisma.uploadSession.findMany()
    * ```
    */
  get uploadSession(): Prisma.UploadSessionDelegate<ExtArgs, ClientOptions>;
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
    MediaAsset: 'MediaAsset',
    AssetVersion: 'AssetVersion',
    AssetBlob: 'AssetBlob',
    AssetLink: 'AssetLink',
    AssetEvent: 'AssetEvent',
    UploadSession: 'UploadSession'
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
      modelProps: "mediaAsset" | "assetVersion" | "assetBlob" | "assetLink" | "assetEvent" | "uploadSession"
      txIsolationLevel: never
    }
    model: {
      MediaAsset: {
        payload: Prisma.$MediaAssetPayload<ExtArgs>
        fields: Prisma.MediaAssetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MediaAssetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MediaAssetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>
          }
          findFirst: {
            args: Prisma.MediaAssetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MediaAssetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>
          }
          findMany: {
            args: Prisma.MediaAssetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>[]
          }
          create: {
            args: Prisma.MediaAssetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>
          }
          createMany: {
            args: Prisma.MediaAssetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MediaAssetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>
          }
          update: {
            args: Prisma.MediaAssetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>
          }
          deleteMany: {
            args: Prisma.MediaAssetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MediaAssetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MediaAssetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>
          }
          aggregate: {
            args: Prisma.MediaAssetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMediaAsset>
          }
          groupBy: {
            args: Prisma.MediaAssetGroupByArgs<ExtArgs>
            result: $Utils.Optional<MediaAssetGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.MediaAssetFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.MediaAssetAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.MediaAssetCountArgs<ExtArgs>
            result: $Utils.Optional<MediaAssetCountAggregateOutputType> | number
          }
        }
      }
      AssetVersion: {
        payload: Prisma.$AssetVersionPayload<ExtArgs>
        fields: Prisma.AssetVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetVersionPayload>
          }
          findFirst: {
            args: Prisma.AssetVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetVersionPayload>
          }
          findMany: {
            args: Prisma.AssetVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetVersionPayload>[]
          }
          create: {
            args: Prisma.AssetVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetVersionPayload>
          }
          createMany: {
            args: Prisma.AssetVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AssetVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetVersionPayload>
          }
          update: {
            args: Prisma.AssetVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetVersionPayload>
          }
          deleteMany: {
            args: Prisma.AssetVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AssetVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetVersionPayload>
          }
          aggregate: {
            args: Prisma.AssetVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssetVersion>
          }
          groupBy: {
            args: Prisma.AssetVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetVersionGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AssetVersionFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AssetVersionAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AssetVersionCountArgs<ExtArgs>
            result: $Utils.Optional<AssetVersionCountAggregateOutputType> | number
          }
        }
      }
      AssetBlob: {
        payload: Prisma.$AssetBlobPayload<ExtArgs>
        fields: Prisma.AssetBlobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetBlobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetBlobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetBlobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetBlobPayload>
          }
          findFirst: {
            args: Prisma.AssetBlobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetBlobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetBlobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetBlobPayload>
          }
          findMany: {
            args: Prisma.AssetBlobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetBlobPayload>[]
          }
          create: {
            args: Prisma.AssetBlobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetBlobPayload>
          }
          createMany: {
            args: Prisma.AssetBlobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AssetBlobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetBlobPayload>
          }
          update: {
            args: Prisma.AssetBlobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetBlobPayload>
          }
          deleteMany: {
            args: Prisma.AssetBlobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetBlobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AssetBlobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetBlobPayload>
          }
          aggregate: {
            args: Prisma.AssetBlobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssetBlob>
          }
          groupBy: {
            args: Prisma.AssetBlobGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetBlobGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AssetBlobFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AssetBlobAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AssetBlobCountArgs<ExtArgs>
            result: $Utils.Optional<AssetBlobCountAggregateOutputType> | number
          }
        }
      }
      AssetLink: {
        payload: Prisma.$AssetLinkPayload<ExtArgs>
        fields: Prisma.AssetLinkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetLinkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetLinkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetLinkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetLinkPayload>
          }
          findFirst: {
            args: Prisma.AssetLinkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetLinkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetLinkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetLinkPayload>
          }
          findMany: {
            args: Prisma.AssetLinkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetLinkPayload>[]
          }
          create: {
            args: Prisma.AssetLinkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetLinkPayload>
          }
          createMany: {
            args: Prisma.AssetLinkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AssetLinkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetLinkPayload>
          }
          update: {
            args: Prisma.AssetLinkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetLinkPayload>
          }
          deleteMany: {
            args: Prisma.AssetLinkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetLinkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AssetLinkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetLinkPayload>
          }
          aggregate: {
            args: Prisma.AssetLinkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssetLink>
          }
          groupBy: {
            args: Prisma.AssetLinkGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetLinkGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AssetLinkFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AssetLinkAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AssetLinkCountArgs<ExtArgs>
            result: $Utils.Optional<AssetLinkCountAggregateOutputType> | number
          }
        }
      }
      AssetEvent: {
        payload: Prisma.$AssetEventPayload<ExtArgs>
        fields: Prisma.AssetEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetEventPayload>
          }
          findFirst: {
            args: Prisma.AssetEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetEventPayload>
          }
          findMany: {
            args: Prisma.AssetEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetEventPayload>[]
          }
          create: {
            args: Prisma.AssetEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetEventPayload>
          }
          createMany: {
            args: Prisma.AssetEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AssetEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetEventPayload>
          }
          update: {
            args: Prisma.AssetEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetEventPayload>
          }
          deleteMany: {
            args: Prisma.AssetEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AssetEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetEventPayload>
          }
          aggregate: {
            args: Prisma.AssetEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssetEvent>
          }
          groupBy: {
            args: Prisma.AssetEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetEventGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AssetEventFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AssetEventAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AssetEventCountArgs<ExtArgs>
            result: $Utils.Optional<AssetEventCountAggregateOutputType> | number
          }
        }
      }
      UploadSession: {
        payload: Prisma.$UploadSessionPayload<ExtArgs>
        fields: Prisma.UploadSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UploadSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UploadSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>
          }
          findFirst: {
            args: Prisma.UploadSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UploadSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>
          }
          findMany: {
            args: Prisma.UploadSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>[]
          }
          create: {
            args: Prisma.UploadSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>
          }
          createMany: {
            args: Prisma.UploadSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UploadSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>
          }
          update: {
            args: Prisma.UploadSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>
          }
          deleteMany: {
            args: Prisma.UploadSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UploadSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UploadSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>
          }
          aggregate: {
            args: Prisma.UploadSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUploadSession>
          }
          groupBy: {
            args: Prisma.UploadSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UploadSessionGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.UploadSessionFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.UploadSessionAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.UploadSessionCountArgs<ExtArgs>
            result: $Utils.Optional<UploadSessionCountAggregateOutputType> | number
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
    mediaAsset?: MediaAssetOmit
    assetVersion?: AssetVersionOmit
    assetBlob?: AssetBlobOmit
    assetLink?: AssetLinkOmit
    assetEvent?: AssetEventOmit
    uploadSession?: UploadSessionOmit
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
   * Model MediaAsset
   */

  export type AggregateMediaAsset = {
    _count: MediaAssetCountAggregateOutputType | null
    _min: MediaAssetMinAggregateOutputType | null
    _max: MediaAssetMaxAggregateOutputType | null
  }

  export type MediaAssetMinAggregateOutputType = {
    id: string | null
    assetUuid: string | null
    idempotencyKey: string | null
    ownerType: string | null
    ownerId: string | null
    tenantId: string | null
    visibility: string | null
    purpose: string | null
    dataClass: string | null
    currentVersionId: string | null
    status: string | null
    expiresAt: Date | null
    deletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MediaAssetMaxAggregateOutputType = {
    id: string | null
    assetUuid: string | null
    idempotencyKey: string | null
    ownerType: string | null
    ownerId: string | null
    tenantId: string | null
    visibility: string | null
    purpose: string | null
    dataClass: string | null
    currentVersionId: string | null
    status: string | null
    expiresAt: Date | null
    deletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MediaAssetCountAggregateOutputType = {
    id: number
    assetUuid: number
    idempotencyKey: number
    ownerType: number
    ownerId: number
    tenantId: number
    visibility: number
    purpose: number
    dataClass: number
    currentVersionId: number
    status: number
    expiresAt: number
    deletedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MediaAssetMinAggregateInputType = {
    id?: true
    assetUuid?: true
    idempotencyKey?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    purpose?: true
    dataClass?: true
    currentVersionId?: true
    status?: true
    expiresAt?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MediaAssetMaxAggregateInputType = {
    id?: true
    assetUuid?: true
    idempotencyKey?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    purpose?: true
    dataClass?: true
    currentVersionId?: true
    status?: true
    expiresAt?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MediaAssetCountAggregateInputType = {
    id?: true
    assetUuid?: true
    idempotencyKey?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    purpose?: true
    dataClass?: true
    currentVersionId?: true
    status?: true
    expiresAt?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MediaAssetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MediaAsset to aggregate.
     */
    where?: MediaAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaAssets to fetch.
     */
    orderBy?: MediaAssetOrderByWithRelationInput | MediaAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MediaAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MediaAssets
    **/
    _count?: true | MediaAssetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MediaAssetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MediaAssetMaxAggregateInputType
  }

  export type GetMediaAssetAggregateType<T extends MediaAssetAggregateArgs> = {
        [P in keyof T & keyof AggregateMediaAsset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMediaAsset[P]>
      : GetScalarType<T[P], AggregateMediaAsset[P]>
  }




  export type MediaAssetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaAssetWhereInput
    orderBy?: MediaAssetOrderByWithAggregationInput | MediaAssetOrderByWithAggregationInput[]
    by: MediaAssetScalarFieldEnum[] | MediaAssetScalarFieldEnum
    having?: MediaAssetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MediaAssetCountAggregateInputType | true
    _min?: MediaAssetMinAggregateInputType
    _max?: MediaAssetMaxAggregateInputType
  }

  export type MediaAssetGroupByOutputType = {
    id: string
    assetUuid: string
    idempotencyKey: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    purpose: string
    dataClass: string
    currentVersionId: string | null
    status: string
    expiresAt: Date | null
    deletedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: MediaAssetCountAggregateOutputType | null
    _min: MediaAssetMinAggregateOutputType | null
    _max: MediaAssetMaxAggregateOutputType | null
  }

  type GetMediaAssetGroupByPayload<T extends MediaAssetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MediaAssetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MediaAssetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MediaAssetGroupByOutputType[P]>
            : GetScalarType<T[P], MediaAssetGroupByOutputType[P]>
        }
      >
    >


  export type MediaAssetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetUuid?: boolean
    idempotencyKey?: boolean
    ownerType?: boolean
    ownerId?: boolean
    tenantId?: boolean
    visibility?: boolean
    purpose?: boolean
    dataClass?: boolean
    currentVersionId?: boolean
    status?: boolean
    expiresAt?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mediaAsset"]>



  export type MediaAssetSelectScalar = {
    id?: boolean
    assetUuid?: boolean
    idempotencyKey?: boolean
    ownerType?: boolean
    ownerId?: boolean
    tenantId?: boolean
    visibility?: boolean
    purpose?: boolean
    dataClass?: boolean
    currentVersionId?: boolean
    status?: boolean
    expiresAt?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MediaAssetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "assetUuid" | "idempotencyKey" | "ownerType" | "ownerId" | "tenantId" | "visibility" | "purpose" | "dataClass" | "currentVersionId" | "status" | "expiresAt" | "deletedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["mediaAsset"]>

  export type $MediaAssetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MediaAsset"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assetUuid: string
      idempotencyKey: string
      ownerType: string
      ownerId: string
      tenantId: string
      visibility: string
      purpose: string
      dataClass: string
      currentVersionId: string | null
      status: string
      expiresAt: Date | null
      deletedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["mediaAsset"]>
    composites: {}
  }

  type MediaAssetGetPayload<S extends boolean | null | undefined | MediaAssetDefaultArgs> = $Result.GetResult<Prisma.$MediaAssetPayload, S>

  type MediaAssetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MediaAssetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MediaAssetCountAggregateInputType | true
    }

  export interface MediaAssetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MediaAsset'], meta: { name: 'MediaAsset' } }
    /**
     * Find zero or one MediaAsset that matches the filter.
     * @param {MediaAssetFindUniqueArgs} args - Arguments to find a MediaAsset
     * @example
     * // Get one MediaAsset
     * const mediaAsset = await prisma.mediaAsset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MediaAssetFindUniqueArgs>(args: SelectSubset<T, MediaAssetFindUniqueArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MediaAsset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MediaAssetFindUniqueOrThrowArgs} args - Arguments to find a MediaAsset
     * @example
     * // Get one MediaAsset
     * const mediaAsset = await prisma.mediaAsset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MediaAssetFindUniqueOrThrowArgs>(args: SelectSubset<T, MediaAssetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MediaAsset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetFindFirstArgs} args - Arguments to find a MediaAsset
     * @example
     * // Get one MediaAsset
     * const mediaAsset = await prisma.mediaAsset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MediaAssetFindFirstArgs>(args?: SelectSubset<T, MediaAssetFindFirstArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MediaAsset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetFindFirstOrThrowArgs} args - Arguments to find a MediaAsset
     * @example
     * // Get one MediaAsset
     * const mediaAsset = await prisma.mediaAsset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MediaAssetFindFirstOrThrowArgs>(args?: SelectSubset<T, MediaAssetFindFirstOrThrowArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MediaAssets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MediaAssets
     * const mediaAssets = await prisma.mediaAsset.findMany()
     * 
     * // Get first 10 MediaAssets
     * const mediaAssets = await prisma.mediaAsset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mediaAssetWithIdOnly = await prisma.mediaAsset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MediaAssetFindManyArgs>(args?: SelectSubset<T, MediaAssetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MediaAsset.
     * @param {MediaAssetCreateArgs} args - Arguments to create a MediaAsset.
     * @example
     * // Create one MediaAsset
     * const MediaAsset = await prisma.mediaAsset.create({
     *   data: {
     *     // ... data to create a MediaAsset
     *   }
     * })
     * 
     */
    create<T extends MediaAssetCreateArgs>(args: SelectSubset<T, MediaAssetCreateArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MediaAssets.
     * @param {MediaAssetCreateManyArgs} args - Arguments to create many MediaAssets.
     * @example
     * // Create many MediaAssets
     * const mediaAsset = await prisma.mediaAsset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MediaAssetCreateManyArgs>(args?: SelectSubset<T, MediaAssetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a MediaAsset.
     * @param {MediaAssetDeleteArgs} args - Arguments to delete one MediaAsset.
     * @example
     * // Delete one MediaAsset
     * const MediaAsset = await prisma.mediaAsset.delete({
     *   where: {
     *     // ... filter to delete one MediaAsset
     *   }
     * })
     * 
     */
    delete<T extends MediaAssetDeleteArgs>(args: SelectSubset<T, MediaAssetDeleteArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MediaAsset.
     * @param {MediaAssetUpdateArgs} args - Arguments to update one MediaAsset.
     * @example
     * // Update one MediaAsset
     * const mediaAsset = await prisma.mediaAsset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MediaAssetUpdateArgs>(args: SelectSubset<T, MediaAssetUpdateArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MediaAssets.
     * @param {MediaAssetDeleteManyArgs} args - Arguments to filter MediaAssets to delete.
     * @example
     * // Delete a few MediaAssets
     * const { count } = await prisma.mediaAsset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MediaAssetDeleteManyArgs>(args?: SelectSubset<T, MediaAssetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MediaAssets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MediaAssets
     * const mediaAsset = await prisma.mediaAsset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MediaAssetUpdateManyArgs>(args: SelectSubset<T, MediaAssetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MediaAsset.
     * @param {MediaAssetUpsertArgs} args - Arguments to update or create a MediaAsset.
     * @example
     * // Update or create a MediaAsset
     * const mediaAsset = await prisma.mediaAsset.upsert({
     *   create: {
     *     // ... data to create a MediaAsset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MediaAsset we want to update
     *   }
     * })
     */
    upsert<T extends MediaAssetUpsertArgs>(args: SelectSubset<T, MediaAssetUpsertArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MediaAssets that matches the filter.
     * @param {MediaAssetFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const mediaAsset = await prisma.mediaAsset.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: MediaAssetFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a MediaAsset.
     * @param {MediaAssetAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const mediaAsset = await prisma.mediaAsset.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: MediaAssetAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of MediaAssets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetCountArgs} args - Arguments to filter MediaAssets to count.
     * @example
     * // Count the number of MediaAssets
     * const count = await prisma.mediaAsset.count({
     *   where: {
     *     // ... the filter for the MediaAssets we want to count
     *   }
     * })
    **/
    count<T extends MediaAssetCountArgs>(
      args?: Subset<T, MediaAssetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MediaAssetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MediaAsset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MediaAssetAggregateArgs>(args: Subset<T, MediaAssetAggregateArgs>): Prisma.PrismaPromise<GetMediaAssetAggregateType<T>>

    /**
     * Group by MediaAsset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetGroupByArgs} args - Group by arguments.
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
      T extends MediaAssetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MediaAssetGroupByArgs['orderBy'] }
        : { orderBy?: MediaAssetGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MediaAssetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMediaAssetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MediaAsset model
   */
  readonly fields: MediaAssetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MediaAsset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MediaAssetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the MediaAsset model
   */
  interface MediaAssetFieldRefs {
    readonly id: FieldRef<"MediaAsset", 'String'>
    readonly assetUuid: FieldRef<"MediaAsset", 'String'>
    readonly idempotencyKey: FieldRef<"MediaAsset", 'String'>
    readonly ownerType: FieldRef<"MediaAsset", 'String'>
    readonly ownerId: FieldRef<"MediaAsset", 'String'>
    readonly tenantId: FieldRef<"MediaAsset", 'String'>
    readonly visibility: FieldRef<"MediaAsset", 'String'>
    readonly purpose: FieldRef<"MediaAsset", 'String'>
    readonly dataClass: FieldRef<"MediaAsset", 'String'>
    readonly currentVersionId: FieldRef<"MediaAsset", 'String'>
    readonly status: FieldRef<"MediaAsset", 'String'>
    readonly expiresAt: FieldRef<"MediaAsset", 'DateTime'>
    readonly deletedAt: FieldRef<"MediaAsset", 'DateTime'>
    readonly createdAt: FieldRef<"MediaAsset", 'DateTime'>
    readonly updatedAt: FieldRef<"MediaAsset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MediaAsset findUnique
   */
  export type MediaAssetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Filter, which MediaAsset to fetch.
     */
    where: MediaAssetWhereUniqueInput
  }

  /**
   * MediaAsset findUniqueOrThrow
   */
  export type MediaAssetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Filter, which MediaAsset to fetch.
     */
    where: MediaAssetWhereUniqueInput
  }

  /**
   * MediaAsset findFirst
   */
  export type MediaAssetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Filter, which MediaAsset to fetch.
     */
    where?: MediaAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaAssets to fetch.
     */
    orderBy?: MediaAssetOrderByWithRelationInput | MediaAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MediaAssets.
     */
    cursor?: MediaAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MediaAssets.
     */
    distinct?: MediaAssetScalarFieldEnum | MediaAssetScalarFieldEnum[]
  }

  /**
   * MediaAsset findFirstOrThrow
   */
  export type MediaAssetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Filter, which MediaAsset to fetch.
     */
    where?: MediaAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaAssets to fetch.
     */
    orderBy?: MediaAssetOrderByWithRelationInput | MediaAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MediaAssets.
     */
    cursor?: MediaAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MediaAssets.
     */
    distinct?: MediaAssetScalarFieldEnum | MediaAssetScalarFieldEnum[]
  }

  /**
   * MediaAsset findMany
   */
  export type MediaAssetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Filter, which MediaAssets to fetch.
     */
    where?: MediaAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaAssets to fetch.
     */
    orderBy?: MediaAssetOrderByWithRelationInput | MediaAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MediaAssets.
     */
    cursor?: MediaAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaAssets.
     */
    skip?: number
    distinct?: MediaAssetScalarFieldEnum | MediaAssetScalarFieldEnum[]
  }

  /**
   * MediaAsset create
   */
  export type MediaAssetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * The data needed to create a MediaAsset.
     */
    data: XOR<MediaAssetCreateInput, MediaAssetUncheckedCreateInput>
  }

  /**
   * MediaAsset createMany
   */
  export type MediaAssetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MediaAssets.
     */
    data: MediaAssetCreateManyInput | MediaAssetCreateManyInput[]
  }

  /**
   * MediaAsset update
   */
  export type MediaAssetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * The data needed to update a MediaAsset.
     */
    data: XOR<MediaAssetUpdateInput, MediaAssetUncheckedUpdateInput>
    /**
     * Choose, which MediaAsset to update.
     */
    where: MediaAssetWhereUniqueInput
  }

  /**
   * MediaAsset updateMany
   */
  export type MediaAssetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MediaAssets.
     */
    data: XOR<MediaAssetUpdateManyMutationInput, MediaAssetUncheckedUpdateManyInput>
    /**
     * Filter which MediaAssets to update
     */
    where?: MediaAssetWhereInput
    /**
     * Limit how many MediaAssets to update.
     */
    limit?: number
  }

  /**
   * MediaAsset upsert
   */
  export type MediaAssetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * The filter to search for the MediaAsset to update in case it exists.
     */
    where: MediaAssetWhereUniqueInput
    /**
     * In case the MediaAsset found by the `where` argument doesn't exist, create a new MediaAsset with this data.
     */
    create: XOR<MediaAssetCreateInput, MediaAssetUncheckedCreateInput>
    /**
     * In case the MediaAsset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MediaAssetUpdateInput, MediaAssetUncheckedUpdateInput>
  }

  /**
   * MediaAsset delete
   */
  export type MediaAssetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Filter which MediaAsset to delete.
     */
    where: MediaAssetWhereUniqueInput
  }

  /**
   * MediaAsset deleteMany
   */
  export type MediaAssetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MediaAssets to delete
     */
    where?: MediaAssetWhereInput
    /**
     * Limit how many MediaAssets to delete.
     */
    limit?: number
  }

  /**
   * MediaAsset findRaw
   */
  export type MediaAssetFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * MediaAsset aggregateRaw
   */
  export type MediaAssetAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * MediaAsset without action
   */
  export type MediaAssetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
  }


  /**
   * Model AssetVersion
   */

  export type AggregateAssetVersion = {
    _count: AssetVersionCountAggregateOutputType | null
    _avg: AssetVersionAvgAggregateOutputType | null
    _sum: AssetVersionSumAggregateOutputType | null
    _min: AssetVersionMinAggregateOutputType | null
    _max: AssetVersionMaxAggregateOutputType | null
  }

  export type AssetVersionAvgAggregateOutputType = {
    versionNumber: number | null
  }

  export type AssetVersionSumAggregateOutputType = {
    versionNumber: number | null
  }

  export type AssetVersionMinAggregateOutputType = {
    id: string | null
    assetId: string | null
    versionNumber: number | null
    blobId: string | null
    ownerType: string | null
    ownerId: string | null
    tenantId: string | null
    visibility: string | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type AssetVersionMaxAggregateOutputType = {
    id: string | null
    assetId: string | null
    versionNumber: number | null
    blobId: string | null
    ownerType: string | null
    ownerId: string | null
    tenantId: string | null
    visibility: string | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type AssetVersionCountAggregateOutputType = {
    id: number
    assetId: number
    versionNumber: number
    blobId: number
    ownerType: number
    ownerId: number
    tenantId: number
    visibility: number
    createdBy: number
    createdAt: number
    _all: number
  }


  export type AssetVersionAvgAggregateInputType = {
    versionNumber?: true
  }

  export type AssetVersionSumAggregateInputType = {
    versionNumber?: true
  }

  export type AssetVersionMinAggregateInputType = {
    id?: true
    assetId?: true
    versionNumber?: true
    blobId?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    createdBy?: true
    createdAt?: true
  }

  export type AssetVersionMaxAggregateInputType = {
    id?: true
    assetId?: true
    versionNumber?: true
    blobId?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    createdBy?: true
    createdAt?: true
  }

  export type AssetVersionCountAggregateInputType = {
    id?: true
    assetId?: true
    versionNumber?: true
    blobId?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    createdBy?: true
    createdAt?: true
    _all?: true
  }

  export type AssetVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetVersion to aggregate.
     */
    where?: AssetVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetVersions to fetch.
     */
    orderBy?: AssetVersionOrderByWithRelationInput | AssetVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AssetVersions
    **/
    _count?: true | AssetVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AssetVersionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AssetVersionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetVersionMaxAggregateInputType
  }

  export type GetAssetVersionAggregateType<T extends AssetVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateAssetVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssetVersion[P]>
      : GetScalarType<T[P], AggregateAssetVersion[P]>
  }




  export type AssetVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetVersionWhereInput
    orderBy?: AssetVersionOrderByWithAggregationInput | AssetVersionOrderByWithAggregationInput[]
    by: AssetVersionScalarFieldEnum[] | AssetVersionScalarFieldEnum
    having?: AssetVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetVersionCountAggregateInputType | true
    _avg?: AssetVersionAvgAggregateInputType
    _sum?: AssetVersionSumAggregateInputType
    _min?: AssetVersionMinAggregateInputType
    _max?: AssetVersionMaxAggregateInputType
  }

  export type AssetVersionGroupByOutputType = {
    id: string
    assetId: string
    versionNumber: number
    blobId: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    createdBy: string
    createdAt: Date
    _count: AssetVersionCountAggregateOutputType | null
    _avg: AssetVersionAvgAggregateOutputType | null
    _sum: AssetVersionSumAggregateOutputType | null
    _min: AssetVersionMinAggregateOutputType | null
    _max: AssetVersionMaxAggregateOutputType | null
  }

  type GetAssetVersionGroupByPayload<T extends AssetVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetVersionGroupByOutputType[P]>
            : GetScalarType<T[P], AssetVersionGroupByOutputType[P]>
        }
      >
    >


  export type AssetVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    versionNumber?: boolean
    blobId?: boolean
    ownerType?: boolean
    ownerId?: boolean
    tenantId?: boolean
    visibility?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["assetVersion"]>



  export type AssetVersionSelectScalar = {
    id?: boolean
    assetId?: boolean
    versionNumber?: boolean
    blobId?: boolean
    ownerType?: boolean
    ownerId?: boolean
    tenantId?: boolean
    visibility?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }

  export type AssetVersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "assetId" | "versionNumber" | "blobId" | "ownerType" | "ownerId" | "tenantId" | "visibility" | "createdBy" | "createdAt", ExtArgs["result"]["assetVersion"]>

  export type $AssetVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AssetVersion"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assetId: string
      versionNumber: number
      blobId: string
      ownerType: string
      ownerId: string
      tenantId: string
      visibility: string
      createdBy: string
      createdAt: Date
    }, ExtArgs["result"]["assetVersion"]>
    composites: {}
  }

  type AssetVersionGetPayload<S extends boolean | null | undefined | AssetVersionDefaultArgs> = $Result.GetResult<Prisma.$AssetVersionPayload, S>

  type AssetVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssetVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssetVersionCountAggregateInputType | true
    }

  export interface AssetVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AssetVersion'], meta: { name: 'AssetVersion' } }
    /**
     * Find zero or one AssetVersion that matches the filter.
     * @param {AssetVersionFindUniqueArgs} args - Arguments to find a AssetVersion
     * @example
     * // Get one AssetVersion
     * const assetVersion = await prisma.assetVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetVersionFindUniqueArgs>(args: SelectSubset<T, AssetVersionFindUniqueArgs<ExtArgs>>): Prisma__AssetVersionClient<$Result.GetResult<Prisma.$AssetVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AssetVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssetVersionFindUniqueOrThrowArgs} args - Arguments to find a AssetVersion
     * @example
     * // Get one AssetVersion
     * const assetVersion = await prisma.assetVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetVersionClient<$Result.GetResult<Prisma.$AssetVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetVersionFindFirstArgs} args - Arguments to find a AssetVersion
     * @example
     * // Get one AssetVersion
     * const assetVersion = await prisma.assetVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetVersionFindFirstArgs>(args?: SelectSubset<T, AssetVersionFindFirstArgs<ExtArgs>>): Prisma__AssetVersionClient<$Result.GetResult<Prisma.$AssetVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetVersionFindFirstOrThrowArgs} args - Arguments to find a AssetVersion
     * @example
     * // Get one AssetVersion
     * const assetVersion = await prisma.assetVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetVersionClient<$Result.GetResult<Prisma.$AssetVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AssetVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AssetVersions
     * const assetVersions = await prisma.assetVersion.findMany()
     * 
     * // Get first 10 AssetVersions
     * const assetVersions = await prisma.assetVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetVersionWithIdOnly = await prisma.assetVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetVersionFindManyArgs>(args?: SelectSubset<T, AssetVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AssetVersion.
     * @param {AssetVersionCreateArgs} args - Arguments to create a AssetVersion.
     * @example
     * // Create one AssetVersion
     * const AssetVersion = await prisma.assetVersion.create({
     *   data: {
     *     // ... data to create a AssetVersion
     *   }
     * })
     * 
     */
    create<T extends AssetVersionCreateArgs>(args: SelectSubset<T, AssetVersionCreateArgs<ExtArgs>>): Prisma__AssetVersionClient<$Result.GetResult<Prisma.$AssetVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AssetVersions.
     * @param {AssetVersionCreateManyArgs} args - Arguments to create many AssetVersions.
     * @example
     * // Create many AssetVersions
     * const assetVersion = await prisma.assetVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetVersionCreateManyArgs>(args?: SelectSubset<T, AssetVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AssetVersion.
     * @param {AssetVersionDeleteArgs} args - Arguments to delete one AssetVersion.
     * @example
     * // Delete one AssetVersion
     * const AssetVersion = await prisma.assetVersion.delete({
     *   where: {
     *     // ... filter to delete one AssetVersion
     *   }
     * })
     * 
     */
    delete<T extends AssetVersionDeleteArgs>(args: SelectSubset<T, AssetVersionDeleteArgs<ExtArgs>>): Prisma__AssetVersionClient<$Result.GetResult<Prisma.$AssetVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AssetVersion.
     * @param {AssetVersionUpdateArgs} args - Arguments to update one AssetVersion.
     * @example
     * // Update one AssetVersion
     * const assetVersion = await prisma.assetVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetVersionUpdateArgs>(args: SelectSubset<T, AssetVersionUpdateArgs<ExtArgs>>): Prisma__AssetVersionClient<$Result.GetResult<Prisma.$AssetVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AssetVersions.
     * @param {AssetVersionDeleteManyArgs} args - Arguments to filter AssetVersions to delete.
     * @example
     * // Delete a few AssetVersions
     * const { count } = await prisma.assetVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetVersionDeleteManyArgs>(args?: SelectSubset<T, AssetVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssetVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AssetVersions
     * const assetVersion = await prisma.assetVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetVersionUpdateManyArgs>(args: SelectSubset<T, AssetVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AssetVersion.
     * @param {AssetVersionUpsertArgs} args - Arguments to update or create a AssetVersion.
     * @example
     * // Update or create a AssetVersion
     * const assetVersion = await prisma.assetVersion.upsert({
     *   create: {
     *     // ... data to create a AssetVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AssetVersion we want to update
     *   }
     * })
     */
    upsert<T extends AssetVersionUpsertArgs>(args: SelectSubset<T, AssetVersionUpsertArgs<ExtArgs>>): Prisma__AssetVersionClient<$Result.GetResult<Prisma.$AssetVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AssetVersions that matches the filter.
     * @param {AssetVersionFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const assetVersion = await prisma.assetVersion.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AssetVersionFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a AssetVersion.
     * @param {AssetVersionAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const assetVersion = await prisma.assetVersion.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: AssetVersionAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of AssetVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetVersionCountArgs} args - Arguments to filter AssetVersions to count.
     * @example
     * // Count the number of AssetVersions
     * const count = await prisma.assetVersion.count({
     *   where: {
     *     // ... the filter for the AssetVersions we want to count
     *   }
     * })
    **/
    count<T extends AssetVersionCountArgs>(
      args?: Subset<T, AssetVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AssetVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AssetVersionAggregateArgs>(args: Subset<T, AssetVersionAggregateArgs>): Prisma.PrismaPromise<GetAssetVersionAggregateType<T>>

    /**
     * Group by AssetVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetVersionGroupByArgs} args - Group by arguments.
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
      T extends AssetVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetVersionGroupByArgs['orderBy'] }
        : { orderBy?: AssetVersionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AssetVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AssetVersion model
   */
  readonly fields: AssetVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AssetVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the AssetVersion model
   */
  interface AssetVersionFieldRefs {
    readonly id: FieldRef<"AssetVersion", 'String'>
    readonly assetId: FieldRef<"AssetVersion", 'String'>
    readonly versionNumber: FieldRef<"AssetVersion", 'Int'>
    readonly blobId: FieldRef<"AssetVersion", 'String'>
    readonly ownerType: FieldRef<"AssetVersion", 'String'>
    readonly ownerId: FieldRef<"AssetVersion", 'String'>
    readonly tenantId: FieldRef<"AssetVersion", 'String'>
    readonly visibility: FieldRef<"AssetVersion", 'String'>
    readonly createdBy: FieldRef<"AssetVersion", 'String'>
    readonly createdAt: FieldRef<"AssetVersion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AssetVersion findUnique
   */
  export type AssetVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetVersion
     */
    select?: AssetVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetVersion
     */
    omit?: AssetVersionOmit<ExtArgs> | null
    /**
     * Filter, which AssetVersion to fetch.
     */
    where: AssetVersionWhereUniqueInput
  }

  /**
   * AssetVersion findUniqueOrThrow
   */
  export type AssetVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetVersion
     */
    select?: AssetVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetVersion
     */
    omit?: AssetVersionOmit<ExtArgs> | null
    /**
     * Filter, which AssetVersion to fetch.
     */
    where: AssetVersionWhereUniqueInput
  }

  /**
   * AssetVersion findFirst
   */
  export type AssetVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetVersion
     */
    select?: AssetVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetVersion
     */
    omit?: AssetVersionOmit<ExtArgs> | null
    /**
     * Filter, which AssetVersion to fetch.
     */
    where?: AssetVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetVersions to fetch.
     */
    orderBy?: AssetVersionOrderByWithRelationInput | AssetVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetVersions.
     */
    cursor?: AssetVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetVersions.
     */
    distinct?: AssetVersionScalarFieldEnum | AssetVersionScalarFieldEnum[]
  }

  /**
   * AssetVersion findFirstOrThrow
   */
  export type AssetVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetVersion
     */
    select?: AssetVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetVersion
     */
    omit?: AssetVersionOmit<ExtArgs> | null
    /**
     * Filter, which AssetVersion to fetch.
     */
    where?: AssetVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetVersions to fetch.
     */
    orderBy?: AssetVersionOrderByWithRelationInput | AssetVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetVersions.
     */
    cursor?: AssetVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetVersions.
     */
    distinct?: AssetVersionScalarFieldEnum | AssetVersionScalarFieldEnum[]
  }

  /**
   * AssetVersion findMany
   */
  export type AssetVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetVersion
     */
    select?: AssetVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetVersion
     */
    omit?: AssetVersionOmit<ExtArgs> | null
    /**
     * Filter, which AssetVersions to fetch.
     */
    where?: AssetVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetVersions to fetch.
     */
    orderBy?: AssetVersionOrderByWithRelationInput | AssetVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AssetVersions.
     */
    cursor?: AssetVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetVersions.
     */
    skip?: number
    distinct?: AssetVersionScalarFieldEnum | AssetVersionScalarFieldEnum[]
  }

  /**
   * AssetVersion create
   */
  export type AssetVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetVersion
     */
    select?: AssetVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetVersion
     */
    omit?: AssetVersionOmit<ExtArgs> | null
    /**
     * The data needed to create a AssetVersion.
     */
    data: XOR<AssetVersionCreateInput, AssetVersionUncheckedCreateInput>
  }

  /**
   * AssetVersion createMany
   */
  export type AssetVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AssetVersions.
     */
    data: AssetVersionCreateManyInput | AssetVersionCreateManyInput[]
  }

  /**
   * AssetVersion update
   */
  export type AssetVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetVersion
     */
    select?: AssetVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetVersion
     */
    omit?: AssetVersionOmit<ExtArgs> | null
    /**
     * The data needed to update a AssetVersion.
     */
    data: XOR<AssetVersionUpdateInput, AssetVersionUncheckedUpdateInput>
    /**
     * Choose, which AssetVersion to update.
     */
    where: AssetVersionWhereUniqueInput
  }

  /**
   * AssetVersion updateMany
   */
  export type AssetVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AssetVersions.
     */
    data: XOR<AssetVersionUpdateManyMutationInput, AssetVersionUncheckedUpdateManyInput>
    /**
     * Filter which AssetVersions to update
     */
    where?: AssetVersionWhereInput
    /**
     * Limit how many AssetVersions to update.
     */
    limit?: number
  }

  /**
   * AssetVersion upsert
   */
  export type AssetVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetVersion
     */
    select?: AssetVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetVersion
     */
    omit?: AssetVersionOmit<ExtArgs> | null
    /**
     * The filter to search for the AssetVersion to update in case it exists.
     */
    where: AssetVersionWhereUniqueInput
    /**
     * In case the AssetVersion found by the `where` argument doesn't exist, create a new AssetVersion with this data.
     */
    create: XOR<AssetVersionCreateInput, AssetVersionUncheckedCreateInput>
    /**
     * In case the AssetVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetVersionUpdateInput, AssetVersionUncheckedUpdateInput>
  }

  /**
   * AssetVersion delete
   */
  export type AssetVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetVersion
     */
    select?: AssetVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetVersion
     */
    omit?: AssetVersionOmit<ExtArgs> | null
    /**
     * Filter which AssetVersion to delete.
     */
    where: AssetVersionWhereUniqueInput
  }

  /**
   * AssetVersion deleteMany
   */
  export type AssetVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetVersions to delete
     */
    where?: AssetVersionWhereInput
    /**
     * Limit how many AssetVersions to delete.
     */
    limit?: number
  }

  /**
   * AssetVersion findRaw
   */
  export type AssetVersionFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * AssetVersion aggregateRaw
   */
  export type AssetVersionAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * AssetVersion without action
   */
  export type AssetVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetVersion
     */
    select?: AssetVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetVersion
     */
    omit?: AssetVersionOmit<ExtArgs> | null
  }


  /**
   * Model AssetBlob
   */

  export type AggregateAssetBlob = {
    _count: AssetBlobCountAggregateOutputType | null
    _avg: AssetBlobAvgAggregateOutputType | null
    _sum: AssetBlobSumAggregateOutputType | null
    _min: AssetBlobMinAggregateOutputType | null
    _max: AssetBlobMaxAggregateOutputType | null
  }

  export type AssetBlobAvgAggregateOutputType = {
    sizeBytes: number | null
    refCount: number | null
  }

  export type AssetBlobSumAggregateOutputType = {
    sizeBytes: bigint | null
    refCount: number | null
  }

  export type AssetBlobMinAggregateOutputType = {
    id: string | null
    sha256Hex: string | null
    sizeBytes: bigint | null
    contentType: string | null
    dataClass: string | null
    bucket: string | null
    objectKey: string | null
    storageClass: string | null
    state: string | null
    refCount: number | null
    ownerType: string | null
    ownerId: string | null
    tenantId: string | null
    visibility: string | null
    tombstonedAt: Date | null
    purgeAfter: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AssetBlobMaxAggregateOutputType = {
    id: string | null
    sha256Hex: string | null
    sizeBytes: bigint | null
    contentType: string | null
    dataClass: string | null
    bucket: string | null
    objectKey: string | null
    storageClass: string | null
    state: string | null
    refCount: number | null
    ownerType: string | null
    ownerId: string | null
    tenantId: string | null
    visibility: string | null
    tombstonedAt: Date | null
    purgeAfter: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AssetBlobCountAggregateOutputType = {
    id: number
    sha256Hex: number
    sizeBytes: number
    contentType: number
    dataClass: number
    bucket: number
    objectKey: number
    storageClass: number
    state: number
    refCount: number
    ownerType: number
    ownerId: number
    tenantId: number
    visibility: number
    tombstonedAt: number
    purgeAfter: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AssetBlobAvgAggregateInputType = {
    sizeBytes?: true
    refCount?: true
  }

  export type AssetBlobSumAggregateInputType = {
    sizeBytes?: true
    refCount?: true
  }

  export type AssetBlobMinAggregateInputType = {
    id?: true
    sha256Hex?: true
    sizeBytes?: true
    contentType?: true
    dataClass?: true
    bucket?: true
    objectKey?: true
    storageClass?: true
    state?: true
    refCount?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    tombstonedAt?: true
    purgeAfter?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AssetBlobMaxAggregateInputType = {
    id?: true
    sha256Hex?: true
    sizeBytes?: true
    contentType?: true
    dataClass?: true
    bucket?: true
    objectKey?: true
    storageClass?: true
    state?: true
    refCount?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    tombstonedAt?: true
    purgeAfter?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AssetBlobCountAggregateInputType = {
    id?: true
    sha256Hex?: true
    sizeBytes?: true
    contentType?: true
    dataClass?: true
    bucket?: true
    objectKey?: true
    storageClass?: true
    state?: true
    refCount?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    tombstonedAt?: true
    purgeAfter?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AssetBlobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetBlob to aggregate.
     */
    where?: AssetBlobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetBlobs to fetch.
     */
    orderBy?: AssetBlobOrderByWithRelationInput | AssetBlobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetBlobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetBlobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetBlobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AssetBlobs
    **/
    _count?: true | AssetBlobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AssetBlobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AssetBlobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetBlobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetBlobMaxAggregateInputType
  }

  export type GetAssetBlobAggregateType<T extends AssetBlobAggregateArgs> = {
        [P in keyof T & keyof AggregateAssetBlob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssetBlob[P]>
      : GetScalarType<T[P], AggregateAssetBlob[P]>
  }




  export type AssetBlobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetBlobWhereInput
    orderBy?: AssetBlobOrderByWithAggregationInput | AssetBlobOrderByWithAggregationInput[]
    by: AssetBlobScalarFieldEnum[] | AssetBlobScalarFieldEnum
    having?: AssetBlobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetBlobCountAggregateInputType | true
    _avg?: AssetBlobAvgAggregateInputType
    _sum?: AssetBlobSumAggregateInputType
    _min?: AssetBlobMinAggregateInputType
    _max?: AssetBlobMaxAggregateInputType
  }

  export type AssetBlobGroupByOutputType = {
    id: string
    sha256Hex: string
    sizeBytes: bigint
    contentType: string
    dataClass: string
    bucket: string
    objectKey: string
    storageClass: string
    state: string
    refCount: number
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    tombstonedAt: Date | null
    purgeAfter: Date | null
    createdAt: Date
    updatedAt: Date
    _count: AssetBlobCountAggregateOutputType | null
    _avg: AssetBlobAvgAggregateOutputType | null
    _sum: AssetBlobSumAggregateOutputType | null
    _min: AssetBlobMinAggregateOutputType | null
    _max: AssetBlobMaxAggregateOutputType | null
  }

  type GetAssetBlobGroupByPayload<T extends AssetBlobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetBlobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetBlobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetBlobGroupByOutputType[P]>
            : GetScalarType<T[P], AssetBlobGroupByOutputType[P]>
        }
      >
    >


  export type AssetBlobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sha256Hex?: boolean
    sizeBytes?: boolean
    contentType?: boolean
    dataClass?: boolean
    bucket?: boolean
    objectKey?: boolean
    storageClass?: boolean
    state?: boolean
    refCount?: boolean
    ownerType?: boolean
    ownerId?: boolean
    tenantId?: boolean
    visibility?: boolean
    tombstonedAt?: boolean
    purgeAfter?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["assetBlob"]>



  export type AssetBlobSelectScalar = {
    id?: boolean
    sha256Hex?: boolean
    sizeBytes?: boolean
    contentType?: boolean
    dataClass?: boolean
    bucket?: boolean
    objectKey?: boolean
    storageClass?: boolean
    state?: boolean
    refCount?: boolean
    ownerType?: boolean
    ownerId?: boolean
    tenantId?: boolean
    visibility?: boolean
    tombstonedAt?: boolean
    purgeAfter?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AssetBlobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sha256Hex" | "sizeBytes" | "contentType" | "dataClass" | "bucket" | "objectKey" | "storageClass" | "state" | "refCount" | "ownerType" | "ownerId" | "tenantId" | "visibility" | "tombstonedAt" | "purgeAfter" | "createdAt" | "updatedAt", ExtArgs["result"]["assetBlob"]>

  export type $AssetBlobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AssetBlob"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sha256Hex: string
      sizeBytes: bigint
      contentType: string
      dataClass: string
      bucket: string
      objectKey: string
      storageClass: string
      state: string
      refCount: number
      ownerType: string
      ownerId: string
      tenantId: string
      visibility: string
      tombstonedAt: Date | null
      purgeAfter: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["assetBlob"]>
    composites: {}
  }

  type AssetBlobGetPayload<S extends boolean | null | undefined | AssetBlobDefaultArgs> = $Result.GetResult<Prisma.$AssetBlobPayload, S>

  type AssetBlobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssetBlobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssetBlobCountAggregateInputType | true
    }

  export interface AssetBlobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AssetBlob'], meta: { name: 'AssetBlob' } }
    /**
     * Find zero or one AssetBlob that matches the filter.
     * @param {AssetBlobFindUniqueArgs} args - Arguments to find a AssetBlob
     * @example
     * // Get one AssetBlob
     * const assetBlob = await prisma.assetBlob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetBlobFindUniqueArgs>(args: SelectSubset<T, AssetBlobFindUniqueArgs<ExtArgs>>): Prisma__AssetBlobClient<$Result.GetResult<Prisma.$AssetBlobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AssetBlob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssetBlobFindUniqueOrThrowArgs} args - Arguments to find a AssetBlob
     * @example
     * // Get one AssetBlob
     * const assetBlob = await prisma.assetBlob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetBlobFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetBlobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetBlobClient<$Result.GetResult<Prisma.$AssetBlobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetBlob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetBlobFindFirstArgs} args - Arguments to find a AssetBlob
     * @example
     * // Get one AssetBlob
     * const assetBlob = await prisma.assetBlob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetBlobFindFirstArgs>(args?: SelectSubset<T, AssetBlobFindFirstArgs<ExtArgs>>): Prisma__AssetBlobClient<$Result.GetResult<Prisma.$AssetBlobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetBlob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetBlobFindFirstOrThrowArgs} args - Arguments to find a AssetBlob
     * @example
     * // Get one AssetBlob
     * const assetBlob = await prisma.assetBlob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetBlobFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetBlobFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetBlobClient<$Result.GetResult<Prisma.$AssetBlobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AssetBlobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetBlobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AssetBlobs
     * const assetBlobs = await prisma.assetBlob.findMany()
     * 
     * // Get first 10 AssetBlobs
     * const assetBlobs = await prisma.assetBlob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetBlobWithIdOnly = await prisma.assetBlob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetBlobFindManyArgs>(args?: SelectSubset<T, AssetBlobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetBlobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AssetBlob.
     * @param {AssetBlobCreateArgs} args - Arguments to create a AssetBlob.
     * @example
     * // Create one AssetBlob
     * const AssetBlob = await prisma.assetBlob.create({
     *   data: {
     *     // ... data to create a AssetBlob
     *   }
     * })
     * 
     */
    create<T extends AssetBlobCreateArgs>(args: SelectSubset<T, AssetBlobCreateArgs<ExtArgs>>): Prisma__AssetBlobClient<$Result.GetResult<Prisma.$AssetBlobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AssetBlobs.
     * @param {AssetBlobCreateManyArgs} args - Arguments to create many AssetBlobs.
     * @example
     * // Create many AssetBlobs
     * const assetBlob = await prisma.assetBlob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetBlobCreateManyArgs>(args?: SelectSubset<T, AssetBlobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AssetBlob.
     * @param {AssetBlobDeleteArgs} args - Arguments to delete one AssetBlob.
     * @example
     * // Delete one AssetBlob
     * const AssetBlob = await prisma.assetBlob.delete({
     *   where: {
     *     // ... filter to delete one AssetBlob
     *   }
     * })
     * 
     */
    delete<T extends AssetBlobDeleteArgs>(args: SelectSubset<T, AssetBlobDeleteArgs<ExtArgs>>): Prisma__AssetBlobClient<$Result.GetResult<Prisma.$AssetBlobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AssetBlob.
     * @param {AssetBlobUpdateArgs} args - Arguments to update one AssetBlob.
     * @example
     * // Update one AssetBlob
     * const assetBlob = await prisma.assetBlob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetBlobUpdateArgs>(args: SelectSubset<T, AssetBlobUpdateArgs<ExtArgs>>): Prisma__AssetBlobClient<$Result.GetResult<Prisma.$AssetBlobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AssetBlobs.
     * @param {AssetBlobDeleteManyArgs} args - Arguments to filter AssetBlobs to delete.
     * @example
     * // Delete a few AssetBlobs
     * const { count } = await prisma.assetBlob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetBlobDeleteManyArgs>(args?: SelectSubset<T, AssetBlobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssetBlobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetBlobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AssetBlobs
     * const assetBlob = await prisma.assetBlob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetBlobUpdateManyArgs>(args: SelectSubset<T, AssetBlobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AssetBlob.
     * @param {AssetBlobUpsertArgs} args - Arguments to update or create a AssetBlob.
     * @example
     * // Update or create a AssetBlob
     * const assetBlob = await prisma.assetBlob.upsert({
     *   create: {
     *     // ... data to create a AssetBlob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AssetBlob we want to update
     *   }
     * })
     */
    upsert<T extends AssetBlobUpsertArgs>(args: SelectSubset<T, AssetBlobUpsertArgs<ExtArgs>>): Prisma__AssetBlobClient<$Result.GetResult<Prisma.$AssetBlobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AssetBlobs that matches the filter.
     * @param {AssetBlobFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const assetBlob = await prisma.assetBlob.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AssetBlobFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a AssetBlob.
     * @param {AssetBlobAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const assetBlob = await prisma.assetBlob.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: AssetBlobAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of AssetBlobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetBlobCountArgs} args - Arguments to filter AssetBlobs to count.
     * @example
     * // Count the number of AssetBlobs
     * const count = await prisma.assetBlob.count({
     *   where: {
     *     // ... the filter for the AssetBlobs we want to count
     *   }
     * })
    **/
    count<T extends AssetBlobCountArgs>(
      args?: Subset<T, AssetBlobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetBlobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AssetBlob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetBlobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AssetBlobAggregateArgs>(args: Subset<T, AssetBlobAggregateArgs>): Prisma.PrismaPromise<GetAssetBlobAggregateType<T>>

    /**
     * Group by AssetBlob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetBlobGroupByArgs} args - Group by arguments.
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
      T extends AssetBlobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetBlobGroupByArgs['orderBy'] }
        : { orderBy?: AssetBlobGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AssetBlobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetBlobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AssetBlob model
   */
  readonly fields: AssetBlobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AssetBlob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetBlobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the AssetBlob model
   */
  interface AssetBlobFieldRefs {
    readonly id: FieldRef<"AssetBlob", 'String'>
    readonly sha256Hex: FieldRef<"AssetBlob", 'String'>
    readonly sizeBytes: FieldRef<"AssetBlob", 'BigInt'>
    readonly contentType: FieldRef<"AssetBlob", 'String'>
    readonly dataClass: FieldRef<"AssetBlob", 'String'>
    readonly bucket: FieldRef<"AssetBlob", 'String'>
    readonly objectKey: FieldRef<"AssetBlob", 'String'>
    readonly storageClass: FieldRef<"AssetBlob", 'String'>
    readonly state: FieldRef<"AssetBlob", 'String'>
    readonly refCount: FieldRef<"AssetBlob", 'Int'>
    readonly ownerType: FieldRef<"AssetBlob", 'String'>
    readonly ownerId: FieldRef<"AssetBlob", 'String'>
    readonly tenantId: FieldRef<"AssetBlob", 'String'>
    readonly visibility: FieldRef<"AssetBlob", 'String'>
    readonly tombstonedAt: FieldRef<"AssetBlob", 'DateTime'>
    readonly purgeAfter: FieldRef<"AssetBlob", 'DateTime'>
    readonly createdAt: FieldRef<"AssetBlob", 'DateTime'>
    readonly updatedAt: FieldRef<"AssetBlob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AssetBlob findUnique
   */
  export type AssetBlobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetBlob
     */
    select?: AssetBlobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetBlob
     */
    omit?: AssetBlobOmit<ExtArgs> | null
    /**
     * Filter, which AssetBlob to fetch.
     */
    where: AssetBlobWhereUniqueInput
  }

  /**
   * AssetBlob findUniqueOrThrow
   */
  export type AssetBlobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetBlob
     */
    select?: AssetBlobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetBlob
     */
    omit?: AssetBlobOmit<ExtArgs> | null
    /**
     * Filter, which AssetBlob to fetch.
     */
    where: AssetBlobWhereUniqueInput
  }

  /**
   * AssetBlob findFirst
   */
  export type AssetBlobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetBlob
     */
    select?: AssetBlobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetBlob
     */
    omit?: AssetBlobOmit<ExtArgs> | null
    /**
     * Filter, which AssetBlob to fetch.
     */
    where?: AssetBlobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetBlobs to fetch.
     */
    orderBy?: AssetBlobOrderByWithRelationInput | AssetBlobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetBlobs.
     */
    cursor?: AssetBlobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetBlobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetBlobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetBlobs.
     */
    distinct?: AssetBlobScalarFieldEnum | AssetBlobScalarFieldEnum[]
  }

  /**
   * AssetBlob findFirstOrThrow
   */
  export type AssetBlobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetBlob
     */
    select?: AssetBlobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetBlob
     */
    omit?: AssetBlobOmit<ExtArgs> | null
    /**
     * Filter, which AssetBlob to fetch.
     */
    where?: AssetBlobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetBlobs to fetch.
     */
    orderBy?: AssetBlobOrderByWithRelationInput | AssetBlobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetBlobs.
     */
    cursor?: AssetBlobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetBlobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetBlobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetBlobs.
     */
    distinct?: AssetBlobScalarFieldEnum | AssetBlobScalarFieldEnum[]
  }

  /**
   * AssetBlob findMany
   */
  export type AssetBlobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetBlob
     */
    select?: AssetBlobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetBlob
     */
    omit?: AssetBlobOmit<ExtArgs> | null
    /**
     * Filter, which AssetBlobs to fetch.
     */
    where?: AssetBlobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetBlobs to fetch.
     */
    orderBy?: AssetBlobOrderByWithRelationInput | AssetBlobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AssetBlobs.
     */
    cursor?: AssetBlobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetBlobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetBlobs.
     */
    skip?: number
    distinct?: AssetBlobScalarFieldEnum | AssetBlobScalarFieldEnum[]
  }

  /**
   * AssetBlob create
   */
  export type AssetBlobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetBlob
     */
    select?: AssetBlobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetBlob
     */
    omit?: AssetBlobOmit<ExtArgs> | null
    /**
     * The data needed to create a AssetBlob.
     */
    data: XOR<AssetBlobCreateInput, AssetBlobUncheckedCreateInput>
  }

  /**
   * AssetBlob createMany
   */
  export type AssetBlobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AssetBlobs.
     */
    data: AssetBlobCreateManyInput | AssetBlobCreateManyInput[]
  }

  /**
   * AssetBlob update
   */
  export type AssetBlobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetBlob
     */
    select?: AssetBlobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetBlob
     */
    omit?: AssetBlobOmit<ExtArgs> | null
    /**
     * The data needed to update a AssetBlob.
     */
    data: XOR<AssetBlobUpdateInput, AssetBlobUncheckedUpdateInput>
    /**
     * Choose, which AssetBlob to update.
     */
    where: AssetBlobWhereUniqueInput
  }

  /**
   * AssetBlob updateMany
   */
  export type AssetBlobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AssetBlobs.
     */
    data: XOR<AssetBlobUpdateManyMutationInput, AssetBlobUncheckedUpdateManyInput>
    /**
     * Filter which AssetBlobs to update
     */
    where?: AssetBlobWhereInput
    /**
     * Limit how many AssetBlobs to update.
     */
    limit?: number
  }

  /**
   * AssetBlob upsert
   */
  export type AssetBlobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetBlob
     */
    select?: AssetBlobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetBlob
     */
    omit?: AssetBlobOmit<ExtArgs> | null
    /**
     * The filter to search for the AssetBlob to update in case it exists.
     */
    where: AssetBlobWhereUniqueInput
    /**
     * In case the AssetBlob found by the `where` argument doesn't exist, create a new AssetBlob with this data.
     */
    create: XOR<AssetBlobCreateInput, AssetBlobUncheckedCreateInput>
    /**
     * In case the AssetBlob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetBlobUpdateInput, AssetBlobUncheckedUpdateInput>
  }

  /**
   * AssetBlob delete
   */
  export type AssetBlobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetBlob
     */
    select?: AssetBlobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetBlob
     */
    omit?: AssetBlobOmit<ExtArgs> | null
    /**
     * Filter which AssetBlob to delete.
     */
    where: AssetBlobWhereUniqueInput
  }

  /**
   * AssetBlob deleteMany
   */
  export type AssetBlobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetBlobs to delete
     */
    where?: AssetBlobWhereInput
    /**
     * Limit how many AssetBlobs to delete.
     */
    limit?: number
  }

  /**
   * AssetBlob findRaw
   */
  export type AssetBlobFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * AssetBlob aggregateRaw
   */
  export type AssetBlobAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * AssetBlob without action
   */
  export type AssetBlobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetBlob
     */
    select?: AssetBlobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetBlob
     */
    omit?: AssetBlobOmit<ExtArgs> | null
  }


  /**
   * Model AssetLink
   */

  export type AggregateAssetLink = {
    _count: AssetLinkCountAggregateOutputType | null
    _min: AssetLinkMinAggregateOutputType | null
    _max: AssetLinkMaxAggregateOutputType | null
  }

  export type AssetLinkMinAggregateOutputType = {
    id: string | null
    assetId: string | null
    blobId: string | null
    entityType: string | null
    entityId: string | null
    fieldRole: string | null
    ownerType: string | null
    ownerId: string | null
    tenantId: string | null
    visibility: string | null
    createdAt: Date | null
  }

  export type AssetLinkMaxAggregateOutputType = {
    id: string | null
    assetId: string | null
    blobId: string | null
    entityType: string | null
    entityId: string | null
    fieldRole: string | null
    ownerType: string | null
    ownerId: string | null
    tenantId: string | null
    visibility: string | null
    createdAt: Date | null
  }

  export type AssetLinkCountAggregateOutputType = {
    id: number
    assetId: number
    blobId: number
    entityType: number
    entityId: number
    fieldRole: number
    ownerType: number
    ownerId: number
    tenantId: number
    visibility: number
    createdAt: number
    _all: number
  }


  export type AssetLinkMinAggregateInputType = {
    id?: true
    assetId?: true
    blobId?: true
    entityType?: true
    entityId?: true
    fieldRole?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    createdAt?: true
  }

  export type AssetLinkMaxAggregateInputType = {
    id?: true
    assetId?: true
    blobId?: true
    entityType?: true
    entityId?: true
    fieldRole?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    createdAt?: true
  }

  export type AssetLinkCountAggregateInputType = {
    id?: true
    assetId?: true
    blobId?: true
    entityType?: true
    entityId?: true
    fieldRole?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    createdAt?: true
    _all?: true
  }

  export type AssetLinkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetLink to aggregate.
     */
    where?: AssetLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetLinks to fetch.
     */
    orderBy?: AssetLinkOrderByWithRelationInput | AssetLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AssetLinks
    **/
    _count?: true | AssetLinkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetLinkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetLinkMaxAggregateInputType
  }

  export type GetAssetLinkAggregateType<T extends AssetLinkAggregateArgs> = {
        [P in keyof T & keyof AggregateAssetLink]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssetLink[P]>
      : GetScalarType<T[P], AggregateAssetLink[P]>
  }




  export type AssetLinkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetLinkWhereInput
    orderBy?: AssetLinkOrderByWithAggregationInput | AssetLinkOrderByWithAggregationInput[]
    by: AssetLinkScalarFieldEnum[] | AssetLinkScalarFieldEnum
    having?: AssetLinkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetLinkCountAggregateInputType | true
    _min?: AssetLinkMinAggregateInputType
    _max?: AssetLinkMaxAggregateInputType
  }

  export type AssetLinkGroupByOutputType = {
    id: string
    assetId: string
    blobId: string
    entityType: string
    entityId: string
    fieldRole: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    createdAt: Date
    _count: AssetLinkCountAggregateOutputType | null
    _min: AssetLinkMinAggregateOutputType | null
    _max: AssetLinkMaxAggregateOutputType | null
  }

  type GetAssetLinkGroupByPayload<T extends AssetLinkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetLinkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetLinkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetLinkGroupByOutputType[P]>
            : GetScalarType<T[P], AssetLinkGroupByOutputType[P]>
        }
      >
    >


  export type AssetLinkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    blobId?: boolean
    entityType?: boolean
    entityId?: boolean
    fieldRole?: boolean
    ownerType?: boolean
    ownerId?: boolean
    tenantId?: boolean
    visibility?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["assetLink"]>



  export type AssetLinkSelectScalar = {
    id?: boolean
    assetId?: boolean
    blobId?: boolean
    entityType?: boolean
    entityId?: boolean
    fieldRole?: boolean
    ownerType?: boolean
    ownerId?: boolean
    tenantId?: boolean
    visibility?: boolean
    createdAt?: boolean
  }

  export type AssetLinkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "assetId" | "blobId" | "entityType" | "entityId" | "fieldRole" | "ownerType" | "ownerId" | "tenantId" | "visibility" | "createdAt", ExtArgs["result"]["assetLink"]>

  export type $AssetLinkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AssetLink"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assetId: string
      blobId: string
      entityType: string
      entityId: string
      fieldRole: string
      ownerType: string
      ownerId: string
      tenantId: string
      visibility: string
      createdAt: Date
    }, ExtArgs["result"]["assetLink"]>
    composites: {}
  }

  type AssetLinkGetPayload<S extends boolean | null | undefined | AssetLinkDefaultArgs> = $Result.GetResult<Prisma.$AssetLinkPayload, S>

  type AssetLinkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssetLinkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssetLinkCountAggregateInputType | true
    }

  export interface AssetLinkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AssetLink'], meta: { name: 'AssetLink' } }
    /**
     * Find zero or one AssetLink that matches the filter.
     * @param {AssetLinkFindUniqueArgs} args - Arguments to find a AssetLink
     * @example
     * // Get one AssetLink
     * const assetLink = await prisma.assetLink.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetLinkFindUniqueArgs>(args: SelectSubset<T, AssetLinkFindUniqueArgs<ExtArgs>>): Prisma__AssetLinkClient<$Result.GetResult<Prisma.$AssetLinkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AssetLink that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssetLinkFindUniqueOrThrowArgs} args - Arguments to find a AssetLink
     * @example
     * // Get one AssetLink
     * const assetLink = await prisma.assetLink.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetLinkFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetLinkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetLinkClient<$Result.GetResult<Prisma.$AssetLinkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetLink that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetLinkFindFirstArgs} args - Arguments to find a AssetLink
     * @example
     * // Get one AssetLink
     * const assetLink = await prisma.assetLink.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetLinkFindFirstArgs>(args?: SelectSubset<T, AssetLinkFindFirstArgs<ExtArgs>>): Prisma__AssetLinkClient<$Result.GetResult<Prisma.$AssetLinkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetLink that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetLinkFindFirstOrThrowArgs} args - Arguments to find a AssetLink
     * @example
     * // Get one AssetLink
     * const assetLink = await prisma.assetLink.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetLinkFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetLinkFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetLinkClient<$Result.GetResult<Prisma.$AssetLinkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AssetLinks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetLinkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AssetLinks
     * const assetLinks = await prisma.assetLink.findMany()
     * 
     * // Get first 10 AssetLinks
     * const assetLinks = await prisma.assetLink.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetLinkWithIdOnly = await prisma.assetLink.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetLinkFindManyArgs>(args?: SelectSubset<T, AssetLinkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AssetLink.
     * @param {AssetLinkCreateArgs} args - Arguments to create a AssetLink.
     * @example
     * // Create one AssetLink
     * const AssetLink = await prisma.assetLink.create({
     *   data: {
     *     // ... data to create a AssetLink
     *   }
     * })
     * 
     */
    create<T extends AssetLinkCreateArgs>(args: SelectSubset<T, AssetLinkCreateArgs<ExtArgs>>): Prisma__AssetLinkClient<$Result.GetResult<Prisma.$AssetLinkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AssetLinks.
     * @param {AssetLinkCreateManyArgs} args - Arguments to create many AssetLinks.
     * @example
     * // Create many AssetLinks
     * const assetLink = await prisma.assetLink.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetLinkCreateManyArgs>(args?: SelectSubset<T, AssetLinkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AssetLink.
     * @param {AssetLinkDeleteArgs} args - Arguments to delete one AssetLink.
     * @example
     * // Delete one AssetLink
     * const AssetLink = await prisma.assetLink.delete({
     *   where: {
     *     // ... filter to delete one AssetLink
     *   }
     * })
     * 
     */
    delete<T extends AssetLinkDeleteArgs>(args: SelectSubset<T, AssetLinkDeleteArgs<ExtArgs>>): Prisma__AssetLinkClient<$Result.GetResult<Prisma.$AssetLinkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AssetLink.
     * @param {AssetLinkUpdateArgs} args - Arguments to update one AssetLink.
     * @example
     * // Update one AssetLink
     * const assetLink = await prisma.assetLink.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetLinkUpdateArgs>(args: SelectSubset<T, AssetLinkUpdateArgs<ExtArgs>>): Prisma__AssetLinkClient<$Result.GetResult<Prisma.$AssetLinkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AssetLinks.
     * @param {AssetLinkDeleteManyArgs} args - Arguments to filter AssetLinks to delete.
     * @example
     * // Delete a few AssetLinks
     * const { count } = await prisma.assetLink.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetLinkDeleteManyArgs>(args?: SelectSubset<T, AssetLinkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssetLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetLinkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AssetLinks
     * const assetLink = await prisma.assetLink.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetLinkUpdateManyArgs>(args: SelectSubset<T, AssetLinkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AssetLink.
     * @param {AssetLinkUpsertArgs} args - Arguments to update or create a AssetLink.
     * @example
     * // Update or create a AssetLink
     * const assetLink = await prisma.assetLink.upsert({
     *   create: {
     *     // ... data to create a AssetLink
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AssetLink we want to update
     *   }
     * })
     */
    upsert<T extends AssetLinkUpsertArgs>(args: SelectSubset<T, AssetLinkUpsertArgs<ExtArgs>>): Prisma__AssetLinkClient<$Result.GetResult<Prisma.$AssetLinkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AssetLinks that matches the filter.
     * @param {AssetLinkFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const assetLink = await prisma.assetLink.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AssetLinkFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a AssetLink.
     * @param {AssetLinkAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const assetLink = await prisma.assetLink.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: AssetLinkAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of AssetLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetLinkCountArgs} args - Arguments to filter AssetLinks to count.
     * @example
     * // Count the number of AssetLinks
     * const count = await prisma.assetLink.count({
     *   where: {
     *     // ... the filter for the AssetLinks we want to count
     *   }
     * })
    **/
    count<T extends AssetLinkCountArgs>(
      args?: Subset<T, AssetLinkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetLinkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AssetLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetLinkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AssetLinkAggregateArgs>(args: Subset<T, AssetLinkAggregateArgs>): Prisma.PrismaPromise<GetAssetLinkAggregateType<T>>

    /**
     * Group by AssetLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetLinkGroupByArgs} args - Group by arguments.
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
      T extends AssetLinkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetLinkGroupByArgs['orderBy'] }
        : { orderBy?: AssetLinkGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AssetLinkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetLinkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AssetLink model
   */
  readonly fields: AssetLinkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AssetLink.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetLinkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the AssetLink model
   */
  interface AssetLinkFieldRefs {
    readonly id: FieldRef<"AssetLink", 'String'>
    readonly assetId: FieldRef<"AssetLink", 'String'>
    readonly blobId: FieldRef<"AssetLink", 'String'>
    readonly entityType: FieldRef<"AssetLink", 'String'>
    readonly entityId: FieldRef<"AssetLink", 'String'>
    readonly fieldRole: FieldRef<"AssetLink", 'String'>
    readonly ownerType: FieldRef<"AssetLink", 'String'>
    readonly ownerId: FieldRef<"AssetLink", 'String'>
    readonly tenantId: FieldRef<"AssetLink", 'String'>
    readonly visibility: FieldRef<"AssetLink", 'String'>
    readonly createdAt: FieldRef<"AssetLink", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AssetLink findUnique
   */
  export type AssetLinkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetLink
     */
    select?: AssetLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetLink
     */
    omit?: AssetLinkOmit<ExtArgs> | null
    /**
     * Filter, which AssetLink to fetch.
     */
    where: AssetLinkWhereUniqueInput
  }

  /**
   * AssetLink findUniqueOrThrow
   */
  export type AssetLinkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetLink
     */
    select?: AssetLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetLink
     */
    omit?: AssetLinkOmit<ExtArgs> | null
    /**
     * Filter, which AssetLink to fetch.
     */
    where: AssetLinkWhereUniqueInput
  }

  /**
   * AssetLink findFirst
   */
  export type AssetLinkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetLink
     */
    select?: AssetLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetLink
     */
    omit?: AssetLinkOmit<ExtArgs> | null
    /**
     * Filter, which AssetLink to fetch.
     */
    where?: AssetLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetLinks to fetch.
     */
    orderBy?: AssetLinkOrderByWithRelationInput | AssetLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetLinks.
     */
    cursor?: AssetLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetLinks.
     */
    distinct?: AssetLinkScalarFieldEnum | AssetLinkScalarFieldEnum[]
  }

  /**
   * AssetLink findFirstOrThrow
   */
  export type AssetLinkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetLink
     */
    select?: AssetLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetLink
     */
    omit?: AssetLinkOmit<ExtArgs> | null
    /**
     * Filter, which AssetLink to fetch.
     */
    where?: AssetLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetLinks to fetch.
     */
    orderBy?: AssetLinkOrderByWithRelationInput | AssetLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetLinks.
     */
    cursor?: AssetLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetLinks.
     */
    distinct?: AssetLinkScalarFieldEnum | AssetLinkScalarFieldEnum[]
  }

  /**
   * AssetLink findMany
   */
  export type AssetLinkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetLink
     */
    select?: AssetLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetLink
     */
    omit?: AssetLinkOmit<ExtArgs> | null
    /**
     * Filter, which AssetLinks to fetch.
     */
    where?: AssetLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetLinks to fetch.
     */
    orderBy?: AssetLinkOrderByWithRelationInput | AssetLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AssetLinks.
     */
    cursor?: AssetLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetLinks.
     */
    skip?: number
    distinct?: AssetLinkScalarFieldEnum | AssetLinkScalarFieldEnum[]
  }

  /**
   * AssetLink create
   */
  export type AssetLinkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetLink
     */
    select?: AssetLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetLink
     */
    omit?: AssetLinkOmit<ExtArgs> | null
    /**
     * The data needed to create a AssetLink.
     */
    data: XOR<AssetLinkCreateInput, AssetLinkUncheckedCreateInput>
  }

  /**
   * AssetLink createMany
   */
  export type AssetLinkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AssetLinks.
     */
    data: AssetLinkCreateManyInput | AssetLinkCreateManyInput[]
  }

  /**
   * AssetLink update
   */
  export type AssetLinkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetLink
     */
    select?: AssetLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetLink
     */
    omit?: AssetLinkOmit<ExtArgs> | null
    /**
     * The data needed to update a AssetLink.
     */
    data: XOR<AssetLinkUpdateInput, AssetLinkUncheckedUpdateInput>
    /**
     * Choose, which AssetLink to update.
     */
    where: AssetLinkWhereUniqueInput
  }

  /**
   * AssetLink updateMany
   */
  export type AssetLinkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AssetLinks.
     */
    data: XOR<AssetLinkUpdateManyMutationInput, AssetLinkUncheckedUpdateManyInput>
    /**
     * Filter which AssetLinks to update
     */
    where?: AssetLinkWhereInput
    /**
     * Limit how many AssetLinks to update.
     */
    limit?: number
  }

  /**
   * AssetLink upsert
   */
  export type AssetLinkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetLink
     */
    select?: AssetLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetLink
     */
    omit?: AssetLinkOmit<ExtArgs> | null
    /**
     * The filter to search for the AssetLink to update in case it exists.
     */
    where: AssetLinkWhereUniqueInput
    /**
     * In case the AssetLink found by the `where` argument doesn't exist, create a new AssetLink with this data.
     */
    create: XOR<AssetLinkCreateInput, AssetLinkUncheckedCreateInput>
    /**
     * In case the AssetLink was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetLinkUpdateInput, AssetLinkUncheckedUpdateInput>
  }

  /**
   * AssetLink delete
   */
  export type AssetLinkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetLink
     */
    select?: AssetLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetLink
     */
    omit?: AssetLinkOmit<ExtArgs> | null
    /**
     * Filter which AssetLink to delete.
     */
    where: AssetLinkWhereUniqueInput
  }

  /**
   * AssetLink deleteMany
   */
  export type AssetLinkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetLinks to delete
     */
    where?: AssetLinkWhereInput
    /**
     * Limit how many AssetLinks to delete.
     */
    limit?: number
  }

  /**
   * AssetLink findRaw
   */
  export type AssetLinkFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * AssetLink aggregateRaw
   */
  export type AssetLinkAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * AssetLink without action
   */
  export type AssetLinkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetLink
     */
    select?: AssetLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetLink
     */
    omit?: AssetLinkOmit<ExtArgs> | null
  }


  /**
   * Model AssetEvent
   */

  export type AggregateAssetEvent = {
    _count: AssetEventCountAggregateOutputType | null
    _min: AssetEventMinAggregateOutputType | null
    _max: AssetEventMaxAggregateOutputType | null
  }

  export type AssetEventMinAggregateOutputType = {
    id: string | null
    assetId: string | null
    eventType: string | null
    actorId: string | null
    ownerType: string | null
    ownerId: string | null
    tenantId: string | null
    visibility: string | null
    payloadJson: string | null
    previousHash: string | null
    eventHash: string | null
    createdAt: Date | null
  }

  export type AssetEventMaxAggregateOutputType = {
    id: string | null
    assetId: string | null
    eventType: string | null
    actorId: string | null
    ownerType: string | null
    ownerId: string | null
    tenantId: string | null
    visibility: string | null
    payloadJson: string | null
    previousHash: string | null
    eventHash: string | null
    createdAt: Date | null
  }

  export type AssetEventCountAggregateOutputType = {
    id: number
    assetId: number
    eventType: number
    actorId: number
    ownerType: number
    ownerId: number
    tenantId: number
    visibility: number
    payloadJson: number
    previousHash: number
    eventHash: number
    createdAt: number
    _all: number
  }


  export type AssetEventMinAggregateInputType = {
    id?: true
    assetId?: true
    eventType?: true
    actorId?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    payloadJson?: true
    previousHash?: true
    eventHash?: true
    createdAt?: true
  }

  export type AssetEventMaxAggregateInputType = {
    id?: true
    assetId?: true
    eventType?: true
    actorId?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    payloadJson?: true
    previousHash?: true
    eventHash?: true
    createdAt?: true
  }

  export type AssetEventCountAggregateInputType = {
    id?: true
    assetId?: true
    eventType?: true
    actorId?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    payloadJson?: true
    previousHash?: true
    eventHash?: true
    createdAt?: true
    _all?: true
  }

  export type AssetEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetEvent to aggregate.
     */
    where?: AssetEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetEvents to fetch.
     */
    orderBy?: AssetEventOrderByWithRelationInput | AssetEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AssetEvents
    **/
    _count?: true | AssetEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetEventMaxAggregateInputType
  }

  export type GetAssetEventAggregateType<T extends AssetEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAssetEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssetEvent[P]>
      : GetScalarType<T[P], AggregateAssetEvent[P]>
  }




  export type AssetEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetEventWhereInput
    orderBy?: AssetEventOrderByWithAggregationInput | AssetEventOrderByWithAggregationInput[]
    by: AssetEventScalarFieldEnum[] | AssetEventScalarFieldEnum
    having?: AssetEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetEventCountAggregateInputType | true
    _min?: AssetEventMinAggregateInputType
    _max?: AssetEventMaxAggregateInputType
  }

  export type AssetEventGroupByOutputType = {
    id: string
    assetId: string
    eventType: string
    actorId: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    payloadJson: string
    previousHash: string | null
    eventHash: string | null
    createdAt: Date
    _count: AssetEventCountAggregateOutputType | null
    _min: AssetEventMinAggregateOutputType | null
    _max: AssetEventMaxAggregateOutputType | null
  }

  type GetAssetEventGroupByPayload<T extends AssetEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetEventGroupByOutputType[P]>
            : GetScalarType<T[P], AssetEventGroupByOutputType[P]>
        }
      >
    >


  export type AssetEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    eventType?: boolean
    actorId?: boolean
    ownerType?: boolean
    ownerId?: boolean
    tenantId?: boolean
    visibility?: boolean
    payloadJson?: boolean
    previousHash?: boolean
    eventHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["assetEvent"]>



  export type AssetEventSelectScalar = {
    id?: boolean
    assetId?: boolean
    eventType?: boolean
    actorId?: boolean
    ownerType?: boolean
    ownerId?: boolean
    tenantId?: boolean
    visibility?: boolean
    payloadJson?: boolean
    previousHash?: boolean
    eventHash?: boolean
    createdAt?: boolean
  }

  export type AssetEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "assetId" | "eventType" | "actorId" | "ownerType" | "ownerId" | "tenantId" | "visibility" | "payloadJson" | "previousHash" | "eventHash" | "createdAt", ExtArgs["result"]["assetEvent"]>

  export type $AssetEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AssetEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assetId: string
      eventType: string
      actorId: string
      ownerType: string
      ownerId: string
      tenantId: string
      visibility: string
      payloadJson: string
      previousHash: string | null
      eventHash: string | null
      createdAt: Date
    }, ExtArgs["result"]["assetEvent"]>
    composites: {}
  }

  type AssetEventGetPayload<S extends boolean | null | undefined | AssetEventDefaultArgs> = $Result.GetResult<Prisma.$AssetEventPayload, S>

  type AssetEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssetEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssetEventCountAggregateInputType | true
    }

  export interface AssetEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AssetEvent'], meta: { name: 'AssetEvent' } }
    /**
     * Find zero or one AssetEvent that matches the filter.
     * @param {AssetEventFindUniqueArgs} args - Arguments to find a AssetEvent
     * @example
     * // Get one AssetEvent
     * const assetEvent = await prisma.assetEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetEventFindUniqueArgs>(args: SelectSubset<T, AssetEventFindUniqueArgs<ExtArgs>>): Prisma__AssetEventClient<$Result.GetResult<Prisma.$AssetEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AssetEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssetEventFindUniqueOrThrowArgs} args - Arguments to find a AssetEvent
     * @example
     * // Get one AssetEvent
     * const assetEvent = await prisma.assetEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetEventClient<$Result.GetResult<Prisma.$AssetEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetEventFindFirstArgs} args - Arguments to find a AssetEvent
     * @example
     * // Get one AssetEvent
     * const assetEvent = await prisma.assetEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetEventFindFirstArgs>(args?: SelectSubset<T, AssetEventFindFirstArgs<ExtArgs>>): Prisma__AssetEventClient<$Result.GetResult<Prisma.$AssetEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetEventFindFirstOrThrowArgs} args - Arguments to find a AssetEvent
     * @example
     * // Get one AssetEvent
     * const assetEvent = await prisma.assetEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetEventClient<$Result.GetResult<Prisma.$AssetEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AssetEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AssetEvents
     * const assetEvents = await prisma.assetEvent.findMany()
     * 
     * // Get first 10 AssetEvents
     * const assetEvents = await prisma.assetEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetEventWithIdOnly = await prisma.assetEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetEventFindManyArgs>(args?: SelectSubset<T, AssetEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AssetEvent.
     * @param {AssetEventCreateArgs} args - Arguments to create a AssetEvent.
     * @example
     * // Create one AssetEvent
     * const AssetEvent = await prisma.assetEvent.create({
     *   data: {
     *     // ... data to create a AssetEvent
     *   }
     * })
     * 
     */
    create<T extends AssetEventCreateArgs>(args: SelectSubset<T, AssetEventCreateArgs<ExtArgs>>): Prisma__AssetEventClient<$Result.GetResult<Prisma.$AssetEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AssetEvents.
     * @param {AssetEventCreateManyArgs} args - Arguments to create many AssetEvents.
     * @example
     * // Create many AssetEvents
     * const assetEvent = await prisma.assetEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetEventCreateManyArgs>(args?: SelectSubset<T, AssetEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AssetEvent.
     * @param {AssetEventDeleteArgs} args - Arguments to delete one AssetEvent.
     * @example
     * // Delete one AssetEvent
     * const AssetEvent = await prisma.assetEvent.delete({
     *   where: {
     *     // ... filter to delete one AssetEvent
     *   }
     * })
     * 
     */
    delete<T extends AssetEventDeleteArgs>(args: SelectSubset<T, AssetEventDeleteArgs<ExtArgs>>): Prisma__AssetEventClient<$Result.GetResult<Prisma.$AssetEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AssetEvent.
     * @param {AssetEventUpdateArgs} args - Arguments to update one AssetEvent.
     * @example
     * // Update one AssetEvent
     * const assetEvent = await prisma.assetEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetEventUpdateArgs>(args: SelectSubset<T, AssetEventUpdateArgs<ExtArgs>>): Prisma__AssetEventClient<$Result.GetResult<Prisma.$AssetEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AssetEvents.
     * @param {AssetEventDeleteManyArgs} args - Arguments to filter AssetEvents to delete.
     * @example
     * // Delete a few AssetEvents
     * const { count } = await prisma.assetEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetEventDeleteManyArgs>(args?: SelectSubset<T, AssetEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssetEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AssetEvents
     * const assetEvent = await prisma.assetEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetEventUpdateManyArgs>(args: SelectSubset<T, AssetEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AssetEvent.
     * @param {AssetEventUpsertArgs} args - Arguments to update or create a AssetEvent.
     * @example
     * // Update or create a AssetEvent
     * const assetEvent = await prisma.assetEvent.upsert({
     *   create: {
     *     // ... data to create a AssetEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AssetEvent we want to update
     *   }
     * })
     */
    upsert<T extends AssetEventUpsertArgs>(args: SelectSubset<T, AssetEventUpsertArgs<ExtArgs>>): Prisma__AssetEventClient<$Result.GetResult<Prisma.$AssetEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AssetEvents that matches the filter.
     * @param {AssetEventFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const assetEvent = await prisma.assetEvent.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AssetEventFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a AssetEvent.
     * @param {AssetEventAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const assetEvent = await prisma.assetEvent.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: AssetEventAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of AssetEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetEventCountArgs} args - Arguments to filter AssetEvents to count.
     * @example
     * // Count the number of AssetEvents
     * const count = await prisma.assetEvent.count({
     *   where: {
     *     // ... the filter for the AssetEvents we want to count
     *   }
     * })
    **/
    count<T extends AssetEventCountArgs>(
      args?: Subset<T, AssetEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AssetEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AssetEventAggregateArgs>(args: Subset<T, AssetEventAggregateArgs>): Prisma.PrismaPromise<GetAssetEventAggregateType<T>>

    /**
     * Group by AssetEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetEventGroupByArgs} args - Group by arguments.
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
      T extends AssetEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetEventGroupByArgs['orderBy'] }
        : { orderBy?: AssetEventGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AssetEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AssetEvent model
   */
  readonly fields: AssetEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AssetEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the AssetEvent model
   */
  interface AssetEventFieldRefs {
    readonly id: FieldRef<"AssetEvent", 'String'>
    readonly assetId: FieldRef<"AssetEvent", 'String'>
    readonly eventType: FieldRef<"AssetEvent", 'String'>
    readonly actorId: FieldRef<"AssetEvent", 'String'>
    readonly ownerType: FieldRef<"AssetEvent", 'String'>
    readonly ownerId: FieldRef<"AssetEvent", 'String'>
    readonly tenantId: FieldRef<"AssetEvent", 'String'>
    readonly visibility: FieldRef<"AssetEvent", 'String'>
    readonly payloadJson: FieldRef<"AssetEvent", 'String'>
    readonly previousHash: FieldRef<"AssetEvent", 'String'>
    readonly eventHash: FieldRef<"AssetEvent", 'String'>
    readonly createdAt: FieldRef<"AssetEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AssetEvent findUnique
   */
  export type AssetEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetEvent
     */
    select?: AssetEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetEvent
     */
    omit?: AssetEventOmit<ExtArgs> | null
    /**
     * Filter, which AssetEvent to fetch.
     */
    where: AssetEventWhereUniqueInput
  }

  /**
   * AssetEvent findUniqueOrThrow
   */
  export type AssetEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetEvent
     */
    select?: AssetEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetEvent
     */
    omit?: AssetEventOmit<ExtArgs> | null
    /**
     * Filter, which AssetEvent to fetch.
     */
    where: AssetEventWhereUniqueInput
  }

  /**
   * AssetEvent findFirst
   */
  export type AssetEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetEvent
     */
    select?: AssetEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetEvent
     */
    omit?: AssetEventOmit<ExtArgs> | null
    /**
     * Filter, which AssetEvent to fetch.
     */
    where?: AssetEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetEvents to fetch.
     */
    orderBy?: AssetEventOrderByWithRelationInput | AssetEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetEvents.
     */
    cursor?: AssetEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetEvents.
     */
    distinct?: AssetEventScalarFieldEnum | AssetEventScalarFieldEnum[]
  }

  /**
   * AssetEvent findFirstOrThrow
   */
  export type AssetEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetEvent
     */
    select?: AssetEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetEvent
     */
    omit?: AssetEventOmit<ExtArgs> | null
    /**
     * Filter, which AssetEvent to fetch.
     */
    where?: AssetEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetEvents to fetch.
     */
    orderBy?: AssetEventOrderByWithRelationInput | AssetEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetEvents.
     */
    cursor?: AssetEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetEvents.
     */
    distinct?: AssetEventScalarFieldEnum | AssetEventScalarFieldEnum[]
  }

  /**
   * AssetEvent findMany
   */
  export type AssetEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetEvent
     */
    select?: AssetEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetEvent
     */
    omit?: AssetEventOmit<ExtArgs> | null
    /**
     * Filter, which AssetEvents to fetch.
     */
    where?: AssetEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetEvents to fetch.
     */
    orderBy?: AssetEventOrderByWithRelationInput | AssetEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AssetEvents.
     */
    cursor?: AssetEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetEvents.
     */
    skip?: number
    distinct?: AssetEventScalarFieldEnum | AssetEventScalarFieldEnum[]
  }

  /**
   * AssetEvent create
   */
  export type AssetEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetEvent
     */
    select?: AssetEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetEvent
     */
    omit?: AssetEventOmit<ExtArgs> | null
    /**
     * The data needed to create a AssetEvent.
     */
    data: XOR<AssetEventCreateInput, AssetEventUncheckedCreateInput>
  }

  /**
   * AssetEvent createMany
   */
  export type AssetEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AssetEvents.
     */
    data: AssetEventCreateManyInput | AssetEventCreateManyInput[]
  }

  /**
   * AssetEvent update
   */
  export type AssetEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetEvent
     */
    select?: AssetEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetEvent
     */
    omit?: AssetEventOmit<ExtArgs> | null
    /**
     * The data needed to update a AssetEvent.
     */
    data: XOR<AssetEventUpdateInput, AssetEventUncheckedUpdateInput>
    /**
     * Choose, which AssetEvent to update.
     */
    where: AssetEventWhereUniqueInput
  }

  /**
   * AssetEvent updateMany
   */
  export type AssetEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AssetEvents.
     */
    data: XOR<AssetEventUpdateManyMutationInput, AssetEventUncheckedUpdateManyInput>
    /**
     * Filter which AssetEvents to update
     */
    where?: AssetEventWhereInput
    /**
     * Limit how many AssetEvents to update.
     */
    limit?: number
  }

  /**
   * AssetEvent upsert
   */
  export type AssetEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetEvent
     */
    select?: AssetEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetEvent
     */
    omit?: AssetEventOmit<ExtArgs> | null
    /**
     * The filter to search for the AssetEvent to update in case it exists.
     */
    where: AssetEventWhereUniqueInput
    /**
     * In case the AssetEvent found by the `where` argument doesn't exist, create a new AssetEvent with this data.
     */
    create: XOR<AssetEventCreateInput, AssetEventUncheckedCreateInput>
    /**
     * In case the AssetEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetEventUpdateInput, AssetEventUncheckedUpdateInput>
  }

  /**
   * AssetEvent delete
   */
  export type AssetEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetEvent
     */
    select?: AssetEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetEvent
     */
    omit?: AssetEventOmit<ExtArgs> | null
    /**
     * Filter which AssetEvent to delete.
     */
    where: AssetEventWhereUniqueInput
  }

  /**
   * AssetEvent deleteMany
   */
  export type AssetEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetEvents to delete
     */
    where?: AssetEventWhereInput
    /**
     * Limit how many AssetEvents to delete.
     */
    limit?: number
  }

  /**
   * AssetEvent findRaw
   */
  export type AssetEventFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * AssetEvent aggregateRaw
   */
  export type AssetEventAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * AssetEvent without action
   */
  export type AssetEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetEvent
     */
    select?: AssetEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetEvent
     */
    omit?: AssetEventOmit<ExtArgs> | null
  }


  /**
   * Model UploadSession
   */

  export type AggregateUploadSession = {
    _count: UploadSessionCountAggregateOutputType | null
    _avg: UploadSessionAvgAggregateOutputType | null
    _sum: UploadSessionSumAggregateOutputType | null
    _min: UploadSessionMinAggregateOutputType | null
    _max: UploadSessionMaxAggregateOutputType | null
  }

  export type UploadSessionAvgAggregateOutputType = {
    expectedBytes: number | null
  }

  export type UploadSessionSumAggregateOutputType = {
    expectedBytes: bigint | null
  }

  export type UploadSessionMinAggregateOutputType = {
    id: string | null
    sessionUuid: string | null
    idempotencyKey: string | null
    ownerType: string | null
    ownerId: string | null
    tenantId: string | null
    visibility: string | null
    purpose: string | null
    bucket: string | null
    objectKey: string | null
    expectedBytes: bigint | null
    contentType: string | null
    status: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UploadSessionMaxAggregateOutputType = {
    id: string | null
    sessionUuid: string | null
    idempotencyKey: string | null
    ownerType: string | null
    ownerId: string | null
    tenantId: string | null
    visibility: string | null
    purpose: string | null
    bucket: string | null
    objectKey: string | null
    expectedBytes: bigint | null
    contentType: string | null
    status: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UploadSessionCountAggregateOutputType = {
    id: number
    sessionUuid: number
    idempotencyKey: number
    ownerType: number
    ownerId: number
    tenantId: number
    visibility: number
    purpose: number
    bucket: number
    objectKey: number
    expectedBytes: number
    contentType: number
    status: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UploadSessionAvgAggregateInputType = {
    expectedBytes?: true
  }

  export type UploadSessionSumAggregateInputType = {
    expectedBytes?: true
  }

  export type UploadSessionMinAggregateInputType = {
    id?: true
    sessionUuid?: true
    idempotencyKey?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    purpose?: true
    bucket?: true
    objectKey?: true
    expectedBytes?: true
    contentType?: true
    status?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UploadSessionMaxAggregateInputType = {
    id?: true
    sessionUuid?: true
    idempotencyKey?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    purpose?: true
    bucket?: true
    objectKey?: true
    expectedBytes?: true
    contentType?: true
    status?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UploadSessionCountAggregateInputType = {
    id?: true
    sessionUuid?: true
    idempotencyKey?: true
    ownerType?: true
    ownerId?: true
    tenantId?: true
    visibility?: true
    purpose?: true
    bucket?: true
    objectKey?: true
    expectedBytes?: true
    contentType?: true
    status?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UploadSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UploadSession to aggregate.
     */
    where?: UploadSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadSessions to fetch.
     */
    orderBy?: UploadSessionOrderByWithRelationInput | UploadSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UploadSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UploadSessions
    **/
    _count?: true | UploadSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UploadSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UploadSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UploadSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UploadSessionMaxAggregateInputType
  }

  export type GetUploadSessionAggregateType<T extends UploadSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateUploadSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUploadSession[P]>
      : GetScalarType<T[P], AggregateUploadSession[P]>
  }




  export type UploadSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UploadSessionWhereInput
    orderBy?: UploadSessionOrderByWithAggregationInput | UploadSessionOrderByWithAggregationInput[]
    by: UploadSessionScalarFieldEnum[] | UploadSessionScalarFieldEnum
    having?: UploadSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UploadSessionCountAggregateInputType | true
    _avg?: UploadSessionAvgAggregateInputType
    _sum?: UploadSessionSumAggregateInputType
    _min?: UploadSessionMinAggregateInputType
    _max?: UploadSessionMaxAggregateInputType
  }

  export type UploadSessionGroupByOutputType = {
    id: string
    sessionUuid: string
    idempotencyKey: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    purpose: string
    bucket: string
    objectKey: string
    expectedBytes: bigint
    contentType: string
    status: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: UploadSessionCountAggregateOutputType | null
    _avg: UploadSessionAvgAggregateOutputType | null
    _sum: UploadSessionSumAggregateOutputType | null
    _min: UploadSessionMinAggregateOutputType | null
    _max: UploadSessionMaxAggregateOutputType | null
  }

  type GetUploadSessionGroupByPayload<T extends UploadSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UploadSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UploadSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UploadSessionGroupByOutputType[P]>
            : GetScalarType<T[P], UploadSessionGroupByOutputType[P]>
        }
      >
    >


  export type UploadSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionUuid?: boolean
    idempotencyKey?: boolean
    ownerType?: boolean
    ownerId?: boolean
    tenantId?: boolean
    visibility?: boolean
    purpose?: boolean
    bucket?: boolean
    objectKey?: boolean
    expectedBytes?: boolean
    contentType?: boolean
    status?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["uploadSession"]>



  export type UploadSessionSelectScalar = {
    id?: boolean
    sessionUuid?: boolean
    idempotencyKey?: boolean
    ownerType?: boolean
    ownerId?: boolean
    tenantId?: boolean
    visibility?: boolean
    purpose?: boolean
    bucket?: boolean
    objectKey?: boolean
    expectedBytes?: boolean
    contentType?: boolean
    status?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UploadSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionUuid" | "idempotencyKey" | "ownerType" | "ownerId" | "tenantId" | "visibility" | "purpose" | "bucket" | "objectKey" | "expectedBytes" | "contentType" | "status" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["uploadSession"]>

  export type $UploadSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UploadSession"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionUuid: string
      idempotencyKey: string
      ownerType: string
      ownerId: string
      tenantId: string
      visibility: string
      purpose: string
      bucket: string
      objectKey: string
      expectedBytes: bigint
      contentType: string
      status: string
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["uploadSession"]>
    composites: {}
  }

  type UploadSessionGetPayload<S extends boolean | null | undefined | UploadSessionDefaultArgs> = $Result.GetResult<Prisma.$UploadSessionPayload, S>

  type UploadSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UploadSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UploadSessionCountAggregateInputType | true
    }

  export interface UploadSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UploadSession'], meta: { name: 'UploadSession' } }
    /**
     * Find zero or one UploadSession that matches the filter.
     * @param {UploadSessionFindUniqueArgs} args - Arguments to find a UploadSession
     * @example
     * // Get one UploadSession
     * const uploadSession = await prisma.uploadSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UploadSessionFindUniqueArgs>(args: SelectSubset<T, UploadSessionFindUniqueArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UploadSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UploadSessionFindUniqueOrThrowArgs} args - Arguments to find a UploadSession
     * @example
     * // Get one UploadSession
     * const uploadSession = await prisma.uploadSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UploadSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, UploadSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UploadSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionFindFirstArgs} args - Arguments to find a UploadSession
     * @example
     * // Get one UploadSession
     * const uploadSession = await prisma.uploadSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UploadSessionFindFirstArgs>(args?: SelectSubset<T, UploadSessionFindFirstArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UploadSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionFindFirstOrThrowArgs} args - Arguments to find a UploadSession
     * @example
     * // Get one UploadSession
     * const uploadSession = await prisma.uploadSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UploadSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, UploadSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UploadSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UploadSessions
     * const uploadSessions = await prisma.uploadSession.findMany()
     * 
     * // Get first 10 UploadSessions
     * const uploadSessions = await prisma.uploadSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const uploadSessionWithIdOnly = await prisma.uploadSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UploadSessionFindManyArgs>(args?: SelectSubset<T, UploadSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UploadSession.
     * @param {UploadSessionCreateArgs} args - Arguments to create a UploadSession.
     * @example
     * // Create one UploadSession
     * const UploadSession = await prisma.uploadSession.create({
     *   data: {
     *     // ... data to create a UploadSession
     *   }
     * })
     * 
     */
    create<T extends UploadSessionCreateArgs>(args: SelectSubset<T, UploadSessionCreateArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UploadSessions.
     * @param {UploadSessionCreateManyArgs} args - Arguments to create many UploadSessions.
     * @example
     * // Create many UploadSessions
     * const uploadSession = await prisma.uploadSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UploadSessionCreateManyArgs>(args?: SelectSubset<T, UploadSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UploadSession.
     * @param {UploadSessionDeleteArgs} args - Arguments to delete one UploadSession.
     * @example
     * // Delete one UploadSession
     * const UploadSession = await prisma.uploadSession.delete({
     *   where: {
     *     // ... filter to delete one UploadSession
     *   }
     * })
     * 
     */
    delete<T extends UploadSessionDeleteArgs>(args: SelectSubset<T, UploadSessionDeleteArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UploadSession.
     * @param {UploadSessionUpdateArgs} args - Arguments to update one UploadSession.
     * @example
     * // Update one UploadSession
     * const uploadSession = await prisma.uploadSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UploadSessionUpdateArgs>(args: SelectSubset<T, UploadSessionUpdateArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UploadSessions.
     * @param {UploadSessionDeleteManyArgs} args - Arguments to filter UploadSessions to delete.
     * @example
     * // Delete a few UploadSessions
     * const { count } = await prisma.uploadSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UploadSessionDeleteManyArgs>(args?: SelectSubset<T, UploadSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UploadSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UploadSessions
     * const uploadSession = await prisma.uploadSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UploadSessionUpdateManyArgs>(args: SelectSubset<T, UploadSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UploadSession.
     * @param {UploadSessionUpsertArgs} args - Arguments to update or create a UploadSession.
     * @example
     * // Update or create a UploadSession
     * const uploadSession = await prisma.uploadSession.upsert({
     *   create: {
     *     // ... data to create a UploadSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UploadSession we want to update
     *   }
     * })
     */
    upsert<T extends UploadSessionUpsertArgs>(args: SelectSubset<T, UploadSessionUpsertArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UploadSessions that matches the filter.
     * @param {UploadSessionFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const uploadSession = await prisma.uploadSession.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: UploadSessionFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a UploadSession.
     * @param {UploadSessionAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const uploadSession = await prisma.uploadSession.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: UploadSessionAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of UploadSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionCountArgs} args - Arguments to filter UploadSessions to count.
     * @example
     * // Count the number of UploadSessions
     * const count = await prisma.uploadSession.count({
     *   where: {
     *     // ... the filter for the UploadSessions we want to count
     *   }
     * })
    **/
    count<T extends UploadSessionCountArgs>(
      args?: Subset<T, UploadSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UploadSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UploadSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UploadSessionAggregateArgs>(args: Subset<T, UploadSessionAggregateArgs>): Prisma.PrismaPromise<GetUploadSessionAggregateType<T>>

    /**
     * Group by UploadSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionGroupByArgs} args - Group by arguments.
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
      T extends UploadSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UploadSessionGroupByArgs['orderBy'] }
        : { orderBy?: UploadSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UploadSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUploadSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UploadSession model
   */
  readonly fields: UploadSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UploadSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UploadSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the UploadSession model
   */
  interface UploadSessionFieldRefs {
    readonly id: FieldRef<"UploadSession", 'String'>
    readonly sessionUuid: FieldRef<"UploadSession", 'String'>
    readonly idempotencyKey: FieldRef<"UploadSession", 'String'>
    readonly ownerType: FieldRef<"UploadSession", 'String'>
    readonly ownerId: FieldRef<"UploadSession", 'String'>
    readonly tenantId: FieldRef<"UploadSession", 'String'>
    readonly visibility: FieldRef<"UploadSession", 'String'>
    readonly purpose: FieldRef<"UploadSession", 'String'>
    readonly bucket: FieldRef<"UploadSession", 'String'>
    readonly objectKey: FieldRef<"UploadSession", 'String'>
    readonly expectedBytes: FieldRef<"UploadSession", 'BigInt'>
    readonly contentType: FieldRef<"UploadSession", 'String'>
    readonly status: FieldRef<"UploadSession", 'String'>
    readonly expiresAt: FieldRef<"UploadSession", 'DateTime'>
    readonly createdAt: FieldRef<"UploadSession", 'DateTime'>
    readonly updatedAt: FieldRef<"UploadSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UploadSession findUnique
   */
  export type UploadSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadSession
     */
    omit?: UploadSessionOmit<ExtArgs> | null
    /**
     * Filter, which UploadSession to fetch.
     */
    where: UploadSessionWhereUniqueInput
  }

  /**
   * UploadSession findUniqueOrThrow
   */
  export type UploadSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadSession
     */
    omit?: UploadSessionOmit<ExtArgs> | null
    /**
     * Filter, which UploadSession to fetch.
     */
    where: UploadSessionWhereUniqueInput
  }

  /**
   * UploadSession findFirst
   */
  export type UploadSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadSession
     */
    omit?: UploadSessionOmit<ExtArgs> | null
    /**
     * Filter, which UploadSession to fetch.
     */
    where?: UploadSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadSessions to fetch.
     */
    orderBy?: UploadSessionOrderByWithRelationInput | UploadSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UploadSessions.
     */
    cursor?: UploadSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UploadSessions.
     */
    distinct?: UploadSessionScalarFieldEnum | UploadSessionScalarFieldEnum[]
  }

  /**
   * UploadSession findFirstOrThrow
   */
  export type UploadSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadSession
     */
    omit?: UploadSessionOmit<ExtArgs> | null
    /**
     * Filter, which UploadSession to fetch.
     */
    where?: UploadSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadSessions to fetch.
     */
    orderBy?: UploadSessionOrderByWithRelationInput | UploadSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UploadSessions.
     */
    cursor?: UploadSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UploadSessions.
     */
    distinct?: UploadSessionScalarFieldEnum | UploadSessionScalarFieldEnum[]
  }

  /**
   * UploadSession findMany
   */
  export type UploadSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadSession
     */
    omit?: UploadSessionOmit<ExtArgs> | null
    /**
     * Filter, which UploadSessions to fetch.
     */
    where?: UploadSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadSessions to fetch.
     */
    orderBy?: UploadSessionOrderByWithRelationInput | UploadSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UploadSessions.
     */
    cursor?: UploadSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadSessions.
     */
    skip?: number
    distinct?: UploadSessionScalarFieldEnum | UploadSessionScalarFieldEnum[]
  }

  /**
   * UploadSession create
   */
  export type UploadSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadSession
     */
    omit?: UploadSessionOmit<ExtArgs> | null
    /**
     * The data needed to create a UploadSession.
     */
    data: XOR<UploadSessionCreateInput, UploadSessionUncheckedCreateInput>
  }

  /**
   * UploadSession createMany
   */
  export type UploadSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UploadSessions.
     */
    data: UploadSessionCreateManyInput | UploadSessionCreateManyInput[]
  }

  /**
   * UploadSession update
   */
  export type UploadSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadSession
     */
    omit?: UploadSessionOmit<ExtArgs> | null
    /**
     * The data needed to update a UploadSession.
     */
    data: XOR<UploadSessionUpdateInput, UploadSessionUncheckedUpdateInput>
    /**
     * Choose, which UploadSession to update.
     */
    where: UploadSessionWhereUniqueInput
  }

  /**
   * UploadSession updateMany
   */
  export type UploadSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UploadSessions.
     */
    data: XOR<UploadSessionUpdateManyMutationInput, UploadSessionUncheckedUpdateManyInput>
    /**
     * Filter which UploadSessions to update
     */
    where?: UploadSessionWhereInput
    /**
     * Limit how many UploadSessions to update.
     */
    limit?: number
  }

  /**
   * UploadSession upsert
   */
  export type UploadSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadSession
     */
    omit?: UploadSessionOmit<ExtArgs> | null
    /**
     * The filter to search for the UploadSession to update in case it exists.
     */
    where: UploadSessionWhereUniqueInput
    /**
     * In case the UploadSession found by the `where` argument doesn't exist, create a new UploadSession with this data.
     */
    create: XOR<UploadSessionCreateInput, UploadSessionUncheckedCreateInput>
    /**
     * In case the UploadSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UploadSessionUpdateInput, UploadSessionUncheckedUpdateInput>
  }

  /**
   * UploadSession delete
   */
  export type UploadSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadSession
     */
    omit?: UploadSessionOmit<ExtArgs> | null
    /**
     * Filter which UploadSession to delete.
     */
    where: UploadSessionWhereUniqueInput
  }

  /**
   * UploadSession deleteMany
   */
  export type UploadSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UploadSessions to delete
     */
    where?: UploadSessionWhereInput
    /**
     * Limit how many UploadSessions to delete.
     */
    limit?: number
  }

  /**
   * UploadSession findRaw
   */
  export type UploadSessionFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * UploadSession aggregateRaw
   */
  export type UploadSessionAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * UploadSession without action
   */
  export type UploadSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadSession
     */
    omit?: UploadSessionOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const MediaAssetScalarFieldEnum: {
    id: 'id',
    assetUuid: 'assetUuid',
    idempotencyKey: 'idempotencyKey',
    ownerType: 'ownerType',
    ownerId: 'ownerId',
    tenantId: 'tenantId',
    visibility: 'visibility',
    purpose: 'purpose',
    dataClass: 'dataClass',
    currentVersionId: 'currentVersionId',
    status: 'status',
    expiresAt: 'expiresAt',
    deletedAt: 'deletedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MediaAssetScalarFieldEnum = (typeof MediaAssetScalarFieldEnum)[keyof typeof MediaAssetScalarFieldEnum]


  export const AssetVersionScalarFieldEnum: {
    id: 'id',
    assetId: 'assetId',
    versionNumber: 'versionNumber',
    blobId: 'blobId',
    ownerType: 'ownerType',
    ownerId: 'ownerId',
    tenantId: 'tenantId',
    visibility: 'visibility',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
  };

  export type AssetVersionScalarFieldEnum = (typeof AssetVersionScalarFieldEnum)[keyof typeof AssetVersionScalarFieldEnum]


  export const AssetBlobScalarFieldEnum: {
    id: 'id',
    sha256Hex: 'sha256Hex',
    sizeBytes: 'sizeBytes',
    contentType: 'contentType',
    dataClass: 'dataClass',
    bucket: 'bucket',
    objectKey: 'objectKey',
    storageClass: 'storageClass',
    state: 'state',
    refCount: 'refCount',
    ownerType: 'ownerType',
    ownerId: 'ownerId',
    tenantId: 'tenantId',
    visibility: 'visibility',
    tombstonedAt: 'tombstonedAt',
    purgeAfter: 'purgeAfter',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AssetBlobScalarFieldEnum = (typeof AssetBlobScalarFieldEnum)[keyof typeof AssetBlobScalarFieldEnum]


  export const AssetLinkScalarFieldEnum: {
    id: 'id',
    assetId: 'assetId',
    blobId: 'blobId',
    entityType: 'entityType',
    entityId: 'entityId',
    fieldRole: 'fieldRole',
    ownerType: 'ownerType',
    ownerId: 'ownerId',
    tenantId: 'tenantId',
    visibility: 'visibility',
    createdAt: 'createdAt'
  };

  export type AssetLinkScalarFieldEnum = (typeof AssetLinkScalarFieldEnum)[keyof typeof AssetLinkScalarFieldEnum]


  export const AssetEventScalarFieldEnum: {
    id: 'id',
    assetId: 'assetId',
    eventType: 'eventType',
    actorId: 'actorId',
    ownerType: 'ownerType',
    ownerId: 'ownerId',
    tenantId: 'tenantId',
    visibility: 'visibility',
    payloadJson: 'payloadJson',
    previousHash: 'previousHash',
    eventHash: 'eventHash',
    createdAt: 'createdAt'
  };

  export type AssetEventScalarFieldEnum = (typeof AssetEventScalarFieldEnum)[keyof typeof AssetEventScalarFieldEnum]


  export const UploadSessionScalarFieldEnum: {
    id: 'id',
    sessionUuid: 'sessionUuid',
    idempotencyKey: 'idempotencyKey',
    ownerType: 'ownerType',
    ownerId: 'ownerId',
    tenantId: 'tenantId',
    visibility: 'visibility',
    purpose: 'purpose',
    bucket: 'bucket',
    objectKey: 'objectKey',
    expectedBytes: 'expectedBytes',
    contentType: 'contentType',
    status: 'status',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UploadSessionScalarFieldEnum = (typeof UploadSessionScalarFieldEnum)[keyof typeof UploadSessionScalarFieldEnum]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


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


  export type MediaAssetWhereInput = {
    AND?: MediaAssetWhereInput | MediaAssetWhereInput[]
    OR?: MediaAssetWhereInput[]
    NOT?: MediaAssetWhereInput | MediaAssetWhereInput[]
    id?: StringFilter<"MediaAsset"> | string
    assetUuid?: StringFilter<"MediaAsset"> | string
    idempotencyKey?: StringFilter<"MediaAsset"> | string
    ownerType?: StringFilter<"MediaAsset"> | string
    ownerId?: StringFilter<"MediaAsset"> | string
    tenantId?: StringFilter<"MediaAsset"> | string
    visibility?: StringFilter<"MediaAsset"> | string
    purpose?: StringFilter<"MediaAsset"> | string
    dataClass?: StringFilter<"MediaAsset"> | string
    currentVersionId?: StringNullableFilter<"MediaAsset"> | string | null
    status?: StringFilter<"MediaAsset"> | string
    expiresAt?: DateTimeNullableFilter<"MediaAsset"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"MediaAsset"> | Date | string | null
    createdAt?: DateTimeFilter<"MediaAsset"> | Date | string
    updatedAt?: DateTimeFilter<"MediaAsset"> | Date | string
  }

  export type MediaAssetOrderByWithRelationInput = {
    id?: SortOrder
    assetUuid?: SortOrder
    idempotencyKey?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    purpose?: SortOrder
    dataClass?: SortOrder
    currentVersionId?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaAssetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    assetUuid?: string
    idempotencyKey?: string
    AND?: MediaAssetWhereInput | MediaAssetWhereInput[]
    OR?: MediaAssetWhereInput[]
    NOT?: MediaAssetWhereInput | MediaAssetWhereInput[]
    ownerType?: StringFilter<"MediaAsset"> | string
    ownerId?: StringFilter<"MediaAsset"> | string
    tenantId?: StringFilter<"MediaAsset"> | string
    visibility?: StringFilter<"MediaAsset"> | string
    purpose?: StringFilter<"MediaAsset"> | string
    dataClass?: StringFilter<"MediaAsset"> | string
    currentVersionId?: StringNullableFilter<"MediaAsset"> | string | null
    status?: StringFilter<"MediaAsset"> | string
    expiresAt?: DateTimeNullableFilter<"MediaAsset"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"MediaAsset"> | Date | string | null
    createdAt?: DateTimeFilter<"MediaAsset"> | Date | string
    updatedAt?: DateTimeFilter<"MediaAsset"> | Date | string
  }, "id" | "assetUuid" | "idempotencyKey">

  export type MediaAssetOrderByWithAggregationInput = {
    id?: SortOrder
    assetUuid?: SortOrder
    idempotencyKey?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    purpose?: SortOrder
    dataClass?: SortOrder
    currentVersionId?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MediaAssetCountOrderByAggregateInput
    _max?: MediaAssetMaxOrderByAggregateInput
    _min?: MediaAssetMinOrderByAggregateInput
  }

  export type MediaAssetScalarWhereWithAggregatesInput = {
    AND?: MediaAssetScalarWhereWithAggregatesInput | MediaAssetScalarWhereWithAggregatesInput[]
    OR?: MediaAssetScalarWhereWithAggregatesInput[]
    NOT?: MediaAssetScalarWhereWithAggregatesInput | MediaAssetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MediaAsset"> | string
    assetUuid?: StringWithAggregatesFilter<"MediaAsset"> | string
    idempotencyKey?: StringWithAggregatesFilter<"MediaAsset"> | string
    ownerType?: StringWithAggregatesFilter<"MediaAsset"> | string
    ownerId?: StringWithAggregatesFilter<"MediaAsset"> | string
    tenantId?: StringWithAggregatesFilter<"MediaAsset"> | string
    visibility?: StringWithAggregatesFilter<"MediaAsset"> | string
    purpose?: StringWithAggregatesFilter<"MediaAsset"> | string
    dataClass?: StringWithAggregatesFilter<"MediaAsset"> | string
    currentVersionId?: StringNullableWithAggregatesFilter<"MediaAsset"> | string | null
    status?: StringWithAggregatesFilter<"MediaAsset"> | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"MediaAsset"> | Date | string | null
    deletedAt?: DateTimeNullableWithAggregatesFilter<"MediaAsset"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MediaAsset"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MediaAsset"> | Date | string
  }

  export type AssetVersionWhereInput = {
    AND?: AssetVersionWhereInput | AssetVersionWhereInput[]
    OR?: AssetVersionWhereInput[]
    NOT?: AssetVersionWhereInput | AssetVersionWhereInput[]
    id?: StringFilter<"AssetVersion"> | string
    assetId?: StringFilter<"AssetVersion"> | string
    versionNumber?: IntFilter<"AssetVersion"> | number
    blobId?: StringFilter<"AssetVersion"> | string
    ownerType?: StringFilter<"AssetVersion"> | string
    ownerId?: StringFilter<"AssetVersion"> | string
    tenantId?: StringFilter<"AssetVersion"> | string
    visibility?: StringFilter<"AssetVersion"> | string
    createdBy?: StringFilter<"AssetVersion"> | string
    createdAt?: DateTimeFilter<"AssetVersion"> | Date | string
  }

  export type AssetVersionOrderByWithRelationInput = {
    id?: SortOrder
    assetId?: SortOrder
    versionNumber?: SortOrder
    blobId?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    assetId_versionNumber?: AssetVersionAssetIdVersionNumberCompoundUniqueInput
    AND?: AssetVersionWhereInput | AssetVersionWhereInput[]
    OR?: AssetVersionWhereInput[]
    NOT?: AssetVersionWhereInput | AssetVersionWhereInput[]
    assetId?: StringFilter<"AssetVersion"> | string
    versionNumber?: IntFilter<"AssetVersion"> | number
    blobId?: StringFilter<"AssetVersion"> | string
    ownerType?: StringFilter<"AssetVersion"> | string
    ownerId?: StringFilter<"AssetVersion"> | string
    tenantId?: StringFilter<"AssetVersion"> | string
    visibility?: StringFilter<"AssetVersion"> | string
    createdBy?: StringFilter<"AssetVersion"> | string
    createdAt?: DateTimeFilter<"AssetVersion"> | Date | string
  }, "id" | "assetId_versionNumber">

  export type AssetVersionOrderByWithAggregationInput = {
    id?: SortOrder
    assetId?: SortOrder
    versionNumber?: SortOrder
    blobId?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    _count?: AssetVersionCountOrderByAggregateInput
    _avg?: AssetVersionAvgOrderByAggregateInput
    _max?: AssetVersionMaxOrderByAggregateInput
    _min?: AssetVersionMinOrderByAggregateInput
    _sum?: AssetVersionSumOrderByAggregateInput
  }

  export type AssetVersionScalarWhereWithAggregatesInput = {
    AND?: AssetVersionScalarWhereWithAggregatesInput | AssetVersionScalarWhereWithAggregatesInput[]
    OR?: AssetVersionScalarWhereWithAggregatesInput[]
    NOT?: AssetVersionScalarWhereWithAggregatesInput | AssetVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AssetVersion"> | string
    assetId?: StringWithAggregatesFilter<"AssetVersion"> | string
    versionNumber?: IntWithAggregatesFilter<"AssetVersion"> | number
    blobId?: StringWithAggregatesFilter<"AssetVersion"> | string
    ownerType?: StringWithAggregatesFilter<"AssetVersion"> | string
    ownerId?: StringWithAggregatesFilter<"AssetVersion"> | string
    tenantId?: StringWithAggregatesFilter<"AssetVersion"> | string
    visibility?: StringWithAggregatesFilter<"AssetVersion"> | string
    createdBy?: StringWithAggregatesFilter<"AssetVersion"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AssetVersion"> | Date | string
  }

  export type AssetBlobWhereInput = {
    AND?: AssetBlobWhereInput | AssetBlobWhereInput[]
    OR?: AssetBlobWhereInput[]
    NOT?: AssetBlobWhereInput | AssetBlobWhereInput[]
    id?: StringFilter<"AssetBlob"> | string
    sha256Hex?: StringFilter<"AssetBlob"> | string
    sizeBytes?: BigIntFilter<"AssetBlob"> | bigint | number
    contentType?: StringFilter<"AssetBlob"> | string
    dataClass?: StringFilter<"AssetBlob"> | string
    bucket?: StringFilter<"AssetBlob"> | string
    objectKey?: StringFilter<"AssetBlob"> | string
    storageClass?: StringFilter<"AssetBlob"> | string
    state?: StringFilter<"AssetBlob"> | string
    refCount?: IntFilter<"AssetBlob"> | number
    ownerType?: StringFilter<"AssetBlob"> | string
    ownerId?: StringFilter<"AssetBlob"> | string
    tenantId?: StringFilter<"AssetBlob"> | string
    visibility?: StringFilter<"AssetBlob"> | string
    tombstonedAt?: DateTimeNullableFilter<"AssetBlob"> | Date | string | null
    purgeAfter?: DateTimeNullableFilter<"AssetBlob"> | Date | string | null
    createdAt?: DateTimeFilter<"AssetBlob"> | Date | string
    updatedAt?: DateTimeFilter<"AssetBlob"> | Date | string
  }

  export type AssetBlobOrderByWithRelationInput = {
    id?: SortOrder
    sha256Hex?: SortOrder
    sizeBytes?: SortOrder
    contentType?: SortOrder
    dataClass?: SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    storageClass?: SortOrder
    state?: SortOrder
    refCount?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    tombstonedAt?: SortOrder
    purgeAfter?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AssetBlobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sha256Hex_bucket?: AssetBlobSha256HexBucketCompoundUniqueInput
    bucket_objectKey?: AssetBlobBucketObjectKeyCompoundUniqueInput
    AND?: AssetBlobWhereInput | AssetBlobWhereInput[]
    OR?: AssetBlobWhereInput[]
    NOT?: AssetBlobWhereInput | AssetBlobWhereInput[]
    sha256Hex?: StringFilter<"AssetBlob"> | string
    sizeBytes?: BigIntFilter<"AssetBlob"> | bigint | number
    contentType?: StringFilter<"AssetBlob"> | string
    dataClass?: StringFilter<"AssetBlob"> | string
    bucket?: StringFilter<"AssetBlob"> | string
    objectKey?: StringFilter<"AssetBlob"> | string
    storageClass?: StringFilter<"AssetBlob"> | string
    state?: StringFilter<"AssetBlob"> | string
    refCount?: IntFilter<"AssetBlob"> | number
    ownerType?: StringFilter<"AssetBlob"> | string
    ownerId?: StringFilter<"AssetBlob"> | string
    tenantId?: StringFilter<"AssetBlob"> | string
    visibility?: StringFilter<"AssetBlob"> | string
    tombstonedAt?: DateTimeNullableFilter<"AssetBlob"> | Date | string | null
    purgeAfter?: DateTimeNullableFilter<"AssetBlob"> | Date | string | null
    createdAt?: DateTimeFilter<"AssetBlob"> | Date | string
    updatedAt?: DateTimeFilter<"AssetBlob"> | Date | string
  }, "id" | "sha256Hex_bucket" | "bucket_objectKey">

  export type AssetBlobOrderByWithAggregationInput = {
    id?: SortOrder
    sha256Hex?: SortOrder
    sizeBytes?: SortOrder
    contentType?: SortOrder
    dataClass?: SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    storageClass?: SortOrder
    state?: SortOrder
    refCount?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    tombstonedAt?: SortOrder
    purgeAfter?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AssetBlobCountOrderByAggregateInput
    _avg?: AssetBlobAvgOrderByAggregateInput
    _max?: AssetBlobMaxOrderByAggregateInput
    _min?: AssetBlobMinOrderByAggregateInput
    _sum?: AssetBlobSumOrderByAggregateInput
  }

  export type AssetBlobScalarWhereWithAggregatesInput = {
    AND?: AssetBlobScalarWhereWithAggregatesInput | AssetBlobScalarWhereWithAggregatesInput[]
    OR?: AssetBlobScalarWhereWithAggregatesInput[]
    NOT?: AssetBlobScalarWhereWithAggregatesInput | AssetBlobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AssetBlob"> | string
    sha256Hex?: StringWithAggregatesFilter<"AssetBlob"> | string
    sizeBytes?: BigIntWithAggregatesFilter<"AssetBlob"> | bigint | number
    contentType?: StringWithAggregatesFilter<"AssetBlob"> | string
    dataClass?: StringWithAggregatesFilter<"AssetBlob"> | string
    bucket?: StringWithAggregatesFilter<"AssetBlob"> | string
    objectKey?: StringWithAggregatesFilter<"AssetBlob"> | string
    storageClass?: StringWithAggregatesFilter<"AssetBlob"> | string
    state?: StringWithAggregatesFilter<"AssetBlob"> | string
    refCount?: IntWithAggregatesFilter<"AssetBlob"> | number
    ownerType?: StringWithAggregatesFilter<"AssetBlob"> | string
    ownerId?: StringWithAggregatesFilter<"AssetBlob"> | string
    tenantId?: StringWithAggregatesFilter<"AssetBlob"> | string
    visibility?: StringWithAggregatesFilter<"AssetBlob"> | string
    tombstonedAt?: DateTimeNullableWithAggregatesFilter<"AssetBlob"> | Date | string | null
    purgeAfter?: DateTimeNullableWithAggregatesFilter<"AssetBlob"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AssetBlob"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AssetBlob"> | Date | string
  }

  export type AssetLinkWhereInput = {
    AND?: AssetLinkWhereInput | AssetLinkWhereInput[]
    OR?: AssetLinkWhereInput[]
    NOT?: AssetLinkWhereInput | AssetLinkWhereInput[]
    id?: StringFilter<"AssetLink"> | string
    assetId?: StringFilter<"AssetLink"> | string
    blobId?: StringFilter<"AssetLink"> | string
    entityType?: StringFilter<"AssetLink"> | string
    entityId?: StringFilter<"AssetLink"> | string
    fieldRole?: StringFilter<"AssetLink"> | string
    ownerType?: StringFilter<"AssetLink"> | string
    ownerId?: StringFilter<"AssetLink"> | string
    tenantId?: StringFilter<"AssetLink"> | string
    visibility?: StringFilter<"AssetLink"> | string
    createdAt?: DateTimeFilter<"AssetLink"> | Date | string
  }

  export type AssetLinkOrderByWithRelationInput = {
    id?: SortOrder
    assetId?: SortOrder
    blobId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    fieldRole?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetLinkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    entityType_entityId_fieldRole_assetId?: AssetLinkEntityTypeEntityIdFieldRoleAssetIdCompoundUniqueInput
    AND?: AssetLinkWhereInput | AssetLinkWhereInput[]
    OR?: AssetLinkWhereInput[]
    NOT?: AssetLinkWhereInput | AssetLinkWhereInput[]
    assetId?: StringFilter<"AssetLink"> | string
    blobId?: StringFilter<"AssetLink"> | string
    entityType?: StringFilter<"AssetLink"> | string
    entityId?: StringFilter<"AssetLink"> | string
    fieldRole?: StringFilter<"AssetLink"> | string
    ownerType?: StringFilter<"AssetLink"> | string
    ownerId?: StringFilter<"AssetLink"> | string
    tenantId?: StringFilter<"AssetLink"> | string
    visibility?: StringFilter<"AssetLink"> | string
    createdAt?: DateTimeFilter<"AssetLink"> | Date | string
  }, "id" | "entityType_entityId_fieldRole_assetId">

  export type AssetLinkOrderByWithAggregationInput = {
    id?: SortOrder
    assetId?: SortOrder
    blobId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    fieldRole?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    createdAt?: SortOrder
    _count?: AssetLinkCountOrderByAggregateInput
    _max?: AssetLinkMaxOrderByAggregateInput
    _min?: AssetLinkMinOrderByAggregateInput
  }

  export type AssetLinkScalarWhereWithAggregatesInput = {
    AND?: AssetLinkScalarWhereWithAggregatesInput | AssetLinkScalarWhereWithAggregatesInput[]
    OR?: AssetLinkScalarWhereWithAggregatesInput[]
    NOT?: AssetLinkScalarWhereWithAggregatesInput | AssetLinkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AssetLink"> | string
    assetId?: StringWithAggregatesFilter<"AssetLink"> | string
    blobId?: StringWithAggregatesFilter<"AssetLink"> | string
    entityType?: StringWithAggregatesFilter<"AssetLink"> | string
    entityId?: StringWithAggregatesFilter<"AssetLink"> | string
    fieldRole?: StringWithAggregatesFilter<"AssetLink"> | string
    ownerType?: StringWithAggregatesFilter<"AssetLink"> | string
    ownerId?: StringWithAggregatesFilter<"AssetLink"> | string
    tenantId?: StringWithAggregatesFilter<"AssetLink"> | string
    visibility?: StringWithAggregatesFilter<"AssetLink"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AssetLink"> | Date | string
  }

  export type AssetEventWhereInput = {
    AND?: AssetEventWhereInput | AssetEventWhereInput[]
    OR?: AssetEventWhereInput[]
    NOT?: AssetEventWhereInput | AssetEventWhereInput[]
    id?: StringFilter<"AssetEvent"> | string
    assetId?: StringFilter<"AssetEvent"> | string
    eventType?: StringFilter<"AssetEvent"> | string
    actorId?: StringFilter<"AssetEvent"> | string
    ownerType?: StringFilter<"AssetEvent"> | string
    ownerId?: StringFilter<"AssetEvent"> | string
    tenantId?: StringFilter<"AssetEvent"> | string
    visibility?: StringFilter<"AssetEvent"> | string
    payloadJson?: StringFilter<"AssetEvent"> | string
    previousHash?: StringNullableFilter<"AssetEvent"> | string | null
    eventHash?: StringNullableFilter<"AssetEvent"> | string | null
    createdAt?: DateTimeFilter<"AssetEvent"> | Date | string
  }

  export type AssetEventOrderByWithRelationInput = {
    id?: SortOrder
    assetId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    payloadJson?: SortOrder
    previousHash?: SortOrder
    eventHash?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AssetEventWhereInput | AssetEventWhereInput[]
    OR?: AssetEventWhereInput[]
    NOT?: AssetEventWhereInput | AssetEventWhereInput[]
    assetId?: StringFilter<"AssetEvent"> | string
    eventType?: StringFilter<"AssetEvent"> | string
    actorId?: StringFilter<"AssetEvent"> | string
    ownerType?: StringFilter<"AssetEvent"> | string
    ownerId?: StringFilter<"AssetEvent"> | string
    tenantId?: StringFilter<"AssetEvent"> | string
    visibility?: StringFilter<"AssetEvent"> | string
    payloadJson?: StringFilter<"AssetEvent"> | string
    previousHash?: StringNullableFilter<"AssetEvent"> | string | null
    eventHash?: StringNullableFilter<"AssetEvent"> | string | null
    createdAt?: DateTimeFilter<"AssetEvent"> | Date | string
  }, "id">

  export type AssetEventOrderByWithAggregationInput = {
    id?: SortOrder
    assetId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    payloadJson?: SortOrder
    previousHash?: SortOrder
    eventHash?: SortOrder
    createdAt?: SortOrder
    _count?: AssetEventCountOrderByAggregateInput
    _max?: AssetEventMaxOrderByAggregateInput
    _min?: AssetEventMinOrderByAggregateInput
  }

  export type AssetEventScalarWhereWithAggregatesInput = {
    AND?: AssetEventScalarWhereWithAggregatesInput | AssetEventScalarWhereWithAggregatesInput[]
    OR?: AssetEventScalarWhereWithAggregatesInput[]
    NOT?: AssetEventScalarWhereWithAggregatesInput | AssetEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AssetEvent"> | string
    assetId?: StringWithAggregatesFilter<"AssetEvent"> | string
    eventType?: StringWithAggregatesFilter<"AssetEvent"> | string
    actorId?: StringWithAggregatesFilter<"AssetEvent"> | string
    ownerType?: StringWithAggregatesFilter<"AssetEvent"> | string
    ownerId?: StringWithAggregatesFilter<"AssetEvent"> | string
    tenantId?: StringWithAggregatesFilter<"AssetEvent"> | string
    visibility?: StringWithAggregatesFilter<"AssetEvent"> | string
    payloadJson?: StringWithAggregatesFilter<"AssetEvent"> | string
    previousHash?: StringNullableWithAggregatesFilter<"AssetEvent"> | string | null
    eventHash?: StringNullableWithAggregatesFilter<"AssetEvent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AssetEvent"> | Date | string
  }

  export type UploadSessionWhereInput = {
    AND?: UploadSessionWhereInput | UploadSessionWhereInput[]
    OR?: UploadSessionWhereInput[]
    NOT?: UploadSessionWhereInput | UploadSessionWhereInput[]
    id?: StringFilter<"UploadSession"> | string
    sessionUuid?: StringFilter<"UploadSession"> | string
    idempotencyKey?: StringFilter<"UploadSession"> | string
    ownerType?: StringFilter<"UploadSession"> | string
    ownerId?: StringFilter<"UploadSession"> | string
    tenantId?: StringFilter<"UploadSession"> | string
    visibility?: StringFilter<"UploadSession"> | string
    purpose?: StringFilter<"UploadSession"> | string
    bucket?: StringFilter<"UploadSession"> | string
    objectKey?: StringFilter<"UploadSession"> | string
    expectedBytes?: BigIntFilter<"UploadSession"> | bigint | number
    contentType?: StringFilter<"UploadSession"> | string
    status?: StringFilter<"UploadSession"> | string
    expiresAt?: DateTimeFilter<"UploadSession"> | Date | string
    createdAt?: DateTimeFilter<"UploadSession"> | Date | string
    updatedAt?: DateTimeFilter<"UploadSession"> | Date | string
  }

  export type UploadSessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionUuid?: SortOrder
    idempotencyKey?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    purpose?: SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    expectedBytes?: SortOrder
    contentType?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UploadSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionUuid?: string
    idempotencyKey?: string
    AND?: UploadSessionWhereInput | UploadSessionWhereInput[]
    OR?: UploadSessionWhereInput[]
    NOT?: UploadSessionWhereInput | UploadSessionWhereInput[]
    ownerType?: StringFilter<"UploadSession"> | string
    ownerId?: StringFilter<"UploadSession"> | string
    tenantId?: StringFilter<"UploadSession"> | string
    visibility?: StringFilter<"UploadSession"> | string
    purpose?: StringFilter<"UploadSession"> | string
    bucket?: StringFilter<"UploadSession"> | string
    objectKey?: StringFilter<"UploadSession"> | string
    expectedBytes?: BigIntFilter<"UploadSession"> | bigint | number
    contentType?: StringFilter<"UploadSession"> | string
    status?: StringFilter<"UploadSession"> | string
    expiresAt?: DateTimeFilter<"UploadSession"> | Date | string
    createdAt?: DateTimeFilter<"UploadSession"> | Date | string
    updatedAt?: DateTimeFilter<"UploadSession"> | Date | string
  }, "id" | "sessionUuid" | "idempotencyKey">

  export type UploadSessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionUuid?: SortOrder
    idempotencyKey?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    purpose?: SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    expectedBytes?: SortOrder
    contentType?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UploadSessionCountOrderByAggregateInput
    _avg?: UploadSessionAvgOrderByAggregateInput
    _max?: UploadSessionMaxOrderByAggregateInput
    _min?: UploadSessionMinOrderByAggregateInput
    _sum?: UploadSessionSumOrderByAggregateInput
  }

  export type UploadSessionScalarWhereWithAggregatesInput = {
    AND?: UploadSessionScalarWhereWithAggregatesInput | UploadSessionScalarWhereWithAggregatesInput[]
    OR?: UploadSessionScalarWhereWithAggregatesInput[]
    NOT?: UploadSessionScalarWhereWithAggregatesInput | UploadSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UploadSession"> | string
    sessionUuid?: StringWithAggregatesFilter<"UploadSession"> | string
    idempotencyKey?: StringWithAggregatesFilter<"UploadSession"> | string
    ownerType?: StringWithAggregatesFilter<"UploadSession"> | string
    ownerId?: StringWithAggregatesFilter<"UploadSession"> | string
    tenantId?: StringWithAggregatesFilter<"UploadSession"> | string
    visibility?: StringWithAggregatesFilter<"UploadSession"> | string
    purpose?: StringWithAggregatesFilter<"UploadSession"> | string
    bucket?: StringWithAggregatesFilter<"UploadSession"> | string
    objectKey?: StringWithAggregatesFilter<"UploadSession"> | string
    expectedBytes?: BigIntWithAggregatesFilter<"UploadSession"> | bigint | number
    contentType?: StringWithAggregatesFilter<"UploadSession"> | string
    status?: StringWithAggregatesFilter<"UploadSession"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"UploadSession"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"UploadSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UploadSession"> | Date | string
  }

  export type MediaAssetCreateInput = {
    id?: string
    assetUuid: string
    idempotencyKey: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    purpose: string
    dataClass: string
    currentVersionId?: string | null
    status?: string
    expiresAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaAssetUncheckedCreateInput = {
    id?: string
    assetUuid: string
    idempotencyKey: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    purpose: string
    dataClass: string
    currentVersionId?: string | null
    status?: string
    expiresAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaAssetUpdateInput = {
    assetUuid?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    dataClass?: StringFieldUpdateOperationsInput | string
    currentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaAssetUncheckedUpdateInput = {
    assetUuid?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    dataClass?: StringFieldUpdateOperationsInput | string
    currentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaAssetCreateManyInput = {
    id?: string
    assetUuid: string
    idempotencyKey: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    purpose: string
    dataClass: string
    currentVersionId?: string | null
    status?: string
    expiresAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaAssetUpdateManyMutationInput = {
    assetUuid?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    dataClass?: StringFieldUpdateOperationsInput | string
    currentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaAssetUncheckedUpdateManyInput = {
    assetUuid?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    dataClass?: StringFieldUpdateOperationsInput | string
    currentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetVersionCreateInput = {
    id?: string
    assetId: string
    versionNumber: number
    blobId: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    createdBy: string
    createdAt?: Date | string
  }

  export type AssetVersionUncheckedCreateInput = {
    id?: string
    assetId: string
    versionNumber: number
    blobId: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    createdBy: string
    createdAt?: Date | string
  }

  export type AssetVersionUpdateInput = {
    assetId?: StringFieldUpdateOperationsInput | string
    versionNumber?: IntFieldUpdateOperationsInput | number
    blobId?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetVersionUncheckedUpdateInput = {
    assetId?: StringFieldUpdateOperationsInput | string
    versionNumber?: IntFieldUpdateOperationsInput | number
    blobId?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetVersionCreateManyInput = {
    id?: string
    assetId: string
    versionNumber: number
    blobId: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    createdBy: string
    createdAt?: Date | string
  }

  export type AssetVersionUpdateManyMutationInput = {
    assetId?: StringFieldUpdateOperationsInput | string
    versionNumber?: IntFieldUpdateOperationsInput | number
    blobId?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetVersionUncheckedUpdateManyInput = {
    assetId?: StringFieldUpdateOperationsInput | string
    versionNumber?: IntFieldUpdateOperationsInput | number
    blobId?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetBlobCreateInput = {
    id?: string
    sha256Hex: string
    sizeBytes: bigint | number
    contentType: string
    dataClass: string
    bucket: string
    objectKey: string
    storageClass?: string
    state?: string
    refCount?: number
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    tombstonedAt?: Date | string | null
    purgeAfter?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AssetBlobUncheckedCreateInput = {
    id?: string
    sha256Hex: string
    sizeBytes: bigint | number
    contentType: string
    dataClass: string
    bucket: string
    objectKey: string
    storageClass?: string
    state?: string
    refCount?: number
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    tombstonedAt?: Date | string | null
    purgeAfter?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AssetBlobUpdateInput = {
    sha256Hex?: StringFieldUpdateOperationsInput | string
    sizeBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: StringFieldUpdateOperationsInput | string
    dataClass?: StringFieldUpdateOperationsInput | string
    bucket?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    storageClass?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    refCount?: IntFieldUpdateOperationsInput | number
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    tombstonedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    purgeAfter?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetBlobUncheckedUpdateInput = {
    sha256Hex?: StringFieldUpdateOperationsInput | string
    sizeBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: StringFieldUpdateOperationsInput | string
    dataClass?: StringFieldUpdateOperationsInput | string
    bucket?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    storageClass?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    refCount?: IntFieldUpdateOperationsInput | number
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    tombstonedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    purgeAfter?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetBlobCreateManyInput = {
    id?: string
    sha256Hex: string
    sizeBytes: bigint | number
    contentType: string
    dataClass: string
    bucket: string
    objectKey: string
    storageClass?: string
    state?: string
    refCount?: number
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    tombstonedAt?: Date | string | null
    purgeAfter?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AssetBlobUpdateManyMutationInput = {
    sha256Hex?: StringFieldUpdateOperationsInput | string
    sizeBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: StringFieldUpdateOperationsInput | string
    dataClass?: StringFieldUpdateOperationsInput | string
    bucket?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    storageClass?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    refCount?: IntFieldUpdateOperationsInput | number
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    tombstonedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    purgeAfter?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetBlobUncheckedUpdateManyInput = {
    sha256Hex?: StringFieldUpdateOperationsInput | string
    sizeBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: StringFieldUpdateOperationsInput | string
    dataClass?: StringFieldUpdateOperationsInput | string
    bucket?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    storageClass?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    refCount?: IntFieldUpdateOperationsInput | number
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    tombstonedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    purgeAfter?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetLinkCreateInput = {
    id?: string
    assetId: string
    blobId: string
    entityType: string
    entityId: string
    fieldRole: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    createdAt?: Date | string
  }

  export type AssetLinkUncheckedCreateInput = {
    id?: string
    assetId: string
    blobId: string
    entityType: string
    entityId: string
    fieldRole: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    createdAt?: Date | string
  }

  export type AssetLinkUpdateInput = {
    assetId?: StringFieldUpdateOperationsInput | string
    blobId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    fieldRole?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetLinkUncheckedUpdateInput = {
    assetId?: StringFieldUpdateOperationsInput | string
    blobId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    fieldRole?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetLinkCreateManyInput = {
    id?: string
    assetId: string
    blobId: string
    entityType: string
    entityId: string
    fieldRole: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    createdAt?: Date | string
  }

  export type AssetLinkUpdateManyMutationInput = {
    assetId?: StringFieldUpdateOperationsInput | string
    blobId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    fieldRole?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetLinkUncheckedUpdateManyInput = {
    assetId?: StringFieldUpdateOperationsInput | string
    blobId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    fieldRole?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetEventCreateInput = {
    id?: string
    assetId: string
    eventType: string
    actorId: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    payloadJson: string
    previousHash?: string | null
    eventHash?: string | null
    createdAt?: Date | string
  }

  export type AssetEventUncheckedCreateInput = {
    id?: string
    assetId: string
    eventType: string
    actorId: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    payloadJson: string
    previousHash?: string | null
    eventHash?: string | null
    createdAt?: Date | string
  }

  export type AssetEventUpdateInput = {
    assetId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    previousHash?: NullableStringFieldUpdateOperationsInput | string | null
    eventHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetEventUncheckedUpdateInput = {
    assetId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    previousHash?: NullableStringFieldUpdateOperationsInput | string | null
    eventHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetEventCreateManyInput = {
    id?: string
    assetId: string
    eventType: string
    actorId: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    payloadJson: string
    previousHash?: string | null
    eventHash?: string | null
    createdAt?: Date | string
  }

  export type AssetEventUpdateManyMutationInput = {
    assetId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    previousHash?: NullableStringFieldUpdateOperationsInput | string | null
    eventHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetEventUncheckedUpdateManyInput = {
    assetId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    previousHash?: NullableStringFieldUpdateOperationsInput | string | null
    eventHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionCreateInput = {
    id?: string
    sessionUuid: string
    idempotencyKey: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    purpose: string
    bucket: string
    objectKey: string
    expectedBytes: bigint | number
    contentType: string
    status?: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UploadSessionUncheckedCreateInput = {
    id?: string
    sessionUuid: string
    idempotencyKey: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    purpose: string
    bucket: string
    objectKey: string
    expectedBytes: bigint | number
    contentType: string
    status?: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UploadSessionUpdateInput = {
    sessionUuid?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    bucket?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    expectedBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionUncheckedUpdateInput = {
    sessionUuid?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    bucket?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    expectedBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionCreateManyInput = {
    id?: string
    sessionUuid: string
    idempotencyKey: string
    ownerType: string
    ownerId: string
    tenantId: string
    visibility: string
    purpose: string
    bucket: string
    objectKey: string
    expectedBytes: bigint | number
    contentType: string
    status?: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UploadSessionUpdateManyMutationInput = {
    sessionUuid?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    bucket?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    expectedBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionUncheckedUpdateManyInput = {
    sessionUuid?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    ownerType?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    bucket?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    expectedBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type MediaAssetCountOrderByAggregateInput = {
    id?: SortOrder
    assetUuid?: SortOrder
    idempotencyKey?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    purpose?: SortOrder
    dataClass?: SortOrder
    currentVersionId?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaAssetMaxOrderByAggregateInput = {
    id?: SortOrder
    assetUuid?: SortOrder
    idempotencyKey?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    purpose?: SortOrder
    dataClass?: SortOrder
    currentVersionId?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaAssetMinOrderByAggregateInput = {
    id?: SortOrder
    assetUuid?: SortOrder
    idempotencyKey?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    purpose?: SortOrder
    dataClass?: SortOrder
    currentVersionId?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type AssetVersionAssetIdVersionNumberCompoundUniqueInput = {
    assetId: string
    versionNumber: number
  }

  export type AssetVersionCountOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    versionNumber?: SortOrder
    blobId?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetVersionAvgOrderByAggregateInput = {
    versionNumber?: SortOrder
  }

  export type AssetVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    versionNumber?: SortOrder
    blobId?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetVersionMinOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    versionNumber?: SortOrder
    blobId?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetVersionSumOrderByAggregateInput = {
    versionNumber?: SortOrder
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

  export type AssetBlobSha256HexBucketCompoundUniqueInput = {
    sha256Hex: string
    bucket: string
  }

  export type AssetBlobBucketObjectKeyCompoundUniqueInput = {
    bucket: string
    objectKey: string
  }

  export type AssetBlobCountOrderByAggregateInput = {
    id?: SortOrder
    sha256Hex?: SortOrder
    sizeBytes?: SortOrder
    contentType?: SortOrder
    dataClass?: SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    storageClass?: SortOrder
    state?: SortOrder
    refCount?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    tombstonedAt?: SortOrder
    purgeAfter?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AssetBlobAvgOrderByAggregateInput = {
    sizeBytes?: SortOrder
    refCount?: SortOrder
  }

  export type AssetBlobMaxOrderByAggregateInput = {
    id?: SortOrder
    sha256Hex?: SortOrder
    sizeBytes?: SortOrder
    contentType?: SortOrder
    dataClass?: SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    storageClass?: SortOrder
    state?: SortOrder
    refCount?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    tombstonedAt?: SortOrder
    purgeAfter?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AssetBlobMinOrderByAggregateInput = {
    id?: SortOrder
    sha256Hex?: SortOrder
    sizeBytes?: SortOrder
    contentType?: SortOrder
    dataClass?: SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    storageClass?: SortOrder
    state?: SortOrder
    refCount?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    tombstonedAt?: SortOrder
    purgeAfter?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AssetBlobSumOrderByAggregateInput = {
    sizeBytes?: SortOrder
    refCount?: SortOrder
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

  export type AssetLinkEntityTypeEntityIdFieldRoleAssetIdCompoundUniqueInput = {
    entityType: string
    entityId: string
    fieldRole: string
    assetId: string
  }

  export type AssetLinkCountOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    blobId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    fieldRole?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetLinkMaxOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    blobId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    fieldRole?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetLinkMinOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    blobId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    fieldRole?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetEventCountOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    payloadJson?: SortOrder
    previousHash?: SortOrder
    eventHash?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetEventMaxOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    payloadJson?: SortOrder
    previousHash?: SortOrder
    eventHash?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetEventMinOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    eventType?: SortOrder
    actorId?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    payloadJson?: SortOrder
    previousHash?: SortOrder
    eventHash?: SortOrder
    createdAt?: SortOrder
  }

  export type UploadSessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionUuid?: SortOrder
    idempotencyKey?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    purpose?: SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    expectedBytes?: SortOrder
    contentType?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UploadSessionAvgOrderByAggregateInput = {
    expectedBytes?: SortOrder
  }

  export type UploadSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionUuid?: SortOrder
    idempotencyKey?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    purpose?: SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    expectedBytes?: SortOrder
    contentType?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UploadSessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionUuid?: SortOrder
    idempotencyKey?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    tenantId?: SortOrder
    visibility?: SortOrder
    purpose?: SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    expectedBytes?: SortOrder
    contentType?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UploadSessionSumOrderByAggregateInput = {
    expectedBytes?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
    unset?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
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