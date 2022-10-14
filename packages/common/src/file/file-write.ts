import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import type { Options } from 'globby';
import { globbySync } from 'globby';

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

export function readJsonFromFile<T>(fileFrom: string) {
  const content = readFileSync(fileFrom, { encoding: 'utf-8' });
  return JSON.parse(content) as T;
}

export const writeJsonToFile = (saveTo: string, content): void => {
  writeFileSync(saveTo, JSON.stringify(content, null, 2), {
    encoding: 'utf-8',
  });
};

export const writeJsonToBuffer = (content): Buffer => {
  return Buffer.from(JSON.stringify(content, null, 2), 'utf-8');
};
