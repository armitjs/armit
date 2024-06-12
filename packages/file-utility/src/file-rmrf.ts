import type { Options } from 'globby';
import { globbySync } from 'globby';
import { rmSync } from 'node:fs';

/**
 * Synchronously removes files and directories (modeled on the standard POSIX `rm`utility).
 * @param path the path
 */
export const rmrfSync = (path: string): void => {
  rmSync(path, {
    force: true,
    recursive: true,
  });
};

/**
 * Similar to rimraf, but looking files and directories using glob patterns.
 * @param pattern
 * @param options
 */
export const rmrfSyncByPattern = (
  pattern: string | readonly string[],
  options: Options = {}
): string[] => {
  const files = globbySync(pattern, {
    dot: false,
    absolute: true,
    unique: true,
    ...options,
  });
  for (const filepath of files) {
    rmrfSync(filepath);
  }
  return files;
};
