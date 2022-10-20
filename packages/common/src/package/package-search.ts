import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Options } from 'pkg-dir';
import { packageDirectorySync } from 'pkg-dir';
import { pkgUpSync } from 'pkg-up';

/**
 * Find the root directory of a Node.js project or npm package
 * @return Returns the project root path or undefined if it could not be found.
 */
export const getPackageDir = (options?: Options) => {
  return packageDirectorySync(options);
};

/**
 * Find the closest package.json file
 * @returns Returns the file path, or undefined if it could not be found.
 */
export const getClosestPackageFile = (options?: Options) => {
  return pkgUpSync(options);
};

/**
 * Finds the first parent directory that contains a given file or directory.
 * @param currentFullPath Directory search start
 * @param clue Give file or directory we want to find.
 * @returns
 */
export const findParentDir = (currentFullPath: string, clue: string) => {
  function testDir(parts) {
    if (parts.length === 0) return null;
    const p = parts.join('');
    const itdoes = existsSync(join(p, clue));
    return itdoes ? p : testDir(parts.slice(0, -1));
  }
  return testDir(splitPath(currentFullPath));
};

function splitPath(path: string) {
  const parts = path.split(/(\/|\\)/);
  if (!parts.length) return parts;

  // when path starts with a slash, the first part is empty string
  return !parts[0].length ? parts.slice(1) : parts;
}
