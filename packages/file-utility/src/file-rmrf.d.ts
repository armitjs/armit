import type { Options } from 'globby';
/**
 * Synchronously removes files and directories (modeled on the standard POSIX `rm`utility).
 * @param path the path
 */
export declare const rmrfSync: (path: string) => void;
/**
 * Similar to rimraf, but looking files and directories using glob patterns.
 * @param pattern
 * @param options
 */
export declare const rmrfSyncByPattern: (pattern: string | readonly string[], options?: Options) => string[];
