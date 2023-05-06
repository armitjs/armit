/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

export interface ConfigBundler {
  bundle(fileName: string): Promise<{ code: string }>;
}

/**
 * A recursive implementation of the Partial<T> type.
 * Source: https://stackoverflow.com/a/49936686/772859
 */
export type DeepPartial<T> = {
  [P in keyof T]?:
    | null
    | (T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>);
};

/**
 * A recursive implementation of Required<T>.
 * Source: https://github.com/microsoft/TypeScript/issues/15012#issuecomment-365453623
 */
export type DeepRequired<
  T,
  U extends object | undefined = undefined
> = T extends object
  ? {
      [P in keyof T]-?: NonNullable<T[P]> extends NonNullable<
        U | Function | Type<any>
      >
        ? NonNullable<T[P]>
        : DeepRequired<NonNullable<T[P]>, U>;
    }
  : T;

/**
 * A type representing the type rather than instance of a class.
 */
export interface Type<T> extends Function {
  new (...args: any[]): T;
}

/**
 * A type representing the plain json object.
 */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | {
      [prop: string]: Json;
    };
