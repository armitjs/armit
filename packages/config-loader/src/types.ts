import { type PartialDeep, type RequiredDeep } from 'type-fest';

export interface ConfigBundler {
  bundle(fileName: string): Promise<{ code: string }>;
}

/**
 * A recursive implementation of the Partial<T> type.
 * Source: https://stackoverflow.com/a/49936686/772859
 */
export type DeepPartial<T> = PartialDeep<T>;

/**
 * A recursive implementation of Required<T>.
 * Source: https://github.com/microsoft/TypeScript/issues/15012#issuecomment-365453623
 */
export type DeepRequired<T> = RequiredDeep<T>;

/**
 * A type representing the type rather than instance of a class.
 */
export interface Type<T> extends Function {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
