import { readFileSync } from 'node:fs';
import type { Options } from 'pkg-dir';
import type { PackageJson, SetRequired } from 'type-fest';
import { searchClosestPackageFile } from './package-search.js';

function readJsonFromFile<T>(fileFrom: string) {
  const content = readFileSync(fileFrom, { encoding: 'utf-8' });
  return JSON.parse(content) as T;
}

/**
 * Read the closest package.json file data object.
 * @param options
 * @returns Returns the result object or undefined if no package.json was found.
 */
export const readPackageData = (options: SetRequired<Options, 'cwd'>) => {
  const packageDir = searchClosestPackageFile(options);
  if (packageDir) {
    return readJsonFromFile<PackageJson>(packageDir);
  }
};
