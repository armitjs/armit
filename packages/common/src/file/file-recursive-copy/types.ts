import type { Stats } from 'node:fs';
import type { Transform } from 'node:stream';
import type { CopyEventType } from './constants.js';

export type RecursiveCopyOptions = {
  /**
   * Whether to expand symbolic links
   * @default false
   */
  expand?: boolean;
  /**
   * Whether to overwrite destination files
   * @default false;
   */
  overwrite?: boolean;
  /**
   * Whether to copy files beginning with a .
   * @default false
   */
  dot?: boolean;
  /**
   * Whether to copy OS junk files (e.g. .DS_Store, Thumbs.db)
   * @default false
   */
  junk?: boolean;

  /**
   * Function that maps source paths to destination paths
   */
  filter?: string | string[] | RegExp | ((path: string) => boolean);
  /**
   * Function that maps source paths to destination paths
   */
  rename?: (path: string) => string;
  /**
   * Function that returns a transform stream used to modify file contents
   */
  transform?: (
    src: string,
    dest: string,
    stats: Stats
  ) => Transform | null | undefined;

  /**
   * Whether to return an array of copy results
   * @default true
   */
  results?: boolean;

  /**
   * Maximum number of simultaneous copy operations
   * @default 255
   */
  concurrency?: number;

  /**
   * Whether to log debug information
   * @default false
   */
  debug?: boolean;
};

interface CopyErrorInfo {
  src: string;
  dest: string;
}

export interface CopyOperation {
  src: string;
  dest: string;
  stats: Stats;
}

export type CopyTaskFn = (
  srcPath: string,
  destPath: string,
  stats: Stats,
  options: RecursiveCopyOptions
) => Promise<void>;

export type EmitEventFn = (eventName: string, ...args) => void;

export type WithCopyEvents<T> = T & {
  on(
    event: CopyEventType.ERROR,
    callback: (error: Error, info: CopyErrorInfo) => void
  ): WithCopyEvents<T>;
  on(
    event: CopyEventType.COMPLETE,
    callback: (info: Array<CopyOperation>) => void
  ): WithCopyEvents<T>;
  on(
    event: CopyEventType.CREATE_DIRECTORY_START,
    callback: (info: CopyOperation) => void
  ): WithCopyEvents<T>;
  on(
    event: CopyEventType.CREATE_DIRECTORY_ERROR,
    callback: (error: Error, info: CopyOperation) => void
  ): WithCopyEvents<T>;
  on(
    event: CopyEventType.CREATE_DIRECTORY_COMPLETE,
    callback: (info: CopyOperation) => void
  ): WithCopyEvents<T>;
  on(
    event: CopyEventType.CREATE_SYMLINK_START,
    callback: (info: CopyOperation) => void
  ): WithCopyEvents<T>;
  on(
    event: CopyEventType.CREATE_SYMLINK_ERROR,
    callback: (error: Error, info: CopyOperation) => void
  ): WithCopyEvents<T>;
  on(
    event: CopyEventType.CREATE_SYMLINK_COMPLETE,
    callback: (info: CopyOperation) => void
  ): WithCopyEvents<T>;
  on(
    event: CopyEventType.COPY_FILE_START,
    callback: (info: CopyOperation) => void
  ): WithCopyEvents<T>;
  on(
    event: CopyEventType.COPY_FILE_ERROR,
    callback: (error: Error, info: CopyOperation) => void
  ): WithCopyEvents<T>;
  on(
    event: CopyEventType.COPY_FILE_COMPLETE,
    callback: (info: CopyOperation) => void
  ): WithCopyEvents<T>;
};
