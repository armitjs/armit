import type { Options } from 'pkg-dir';
import type { PackageJson } from 'type-fest';
import { readJsonFromFile } from '../file/file-write.js';
import { getClosestPackageFile } from './package-search.js';

/**
 * Read the closest package.json file data object.
 * @param options
 * @returns Returns the result object or undefined if no package.json was found.
 */
export const getPackageData = (options?: Options) => {
  const packageDir = getClosestPackageFile(options);
  if (packageDir) {
    return readJsonFromFile<PackageJson>(packageDir);
  }
};
