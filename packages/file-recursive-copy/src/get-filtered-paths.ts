import { basename } from 'node:path';
import { isNotJunkFile, normalizeSlash } from '@armit/file-utility';
import mm from 'micromatch';
import type { RecursiveCopyOptions } from './types.js';

export function getFilteredPaths(
  paths: string[],
  filter: RecursiveCopyOptions['filter'],
  options: Pick<RecursiveCopyOptions, 'dot' | 'junk'>
) {
  const useDotFilter = !options.dot;
  const useJunkFilter = !options.junk;
  if (!filter && !useDotFilter && !useJunkFilter) {
    return paths;
  }
  return paths.filter((path) => {
    const basicFilter =
      (!useDotFilter || dotFilter(path)) &&
      (!useJunkFilter || junkFilter(path));
    const slashPath = normalizeSlash(path);
    const advancedFilter =
      !filter ||
      (typeof filter === 'function'
        ? filter(slashPath)
        : filter instanceof RegExp
        ? filter.test(slashPath)
        : mm.all(slashPath, filter, { strictSlashes: true }));

    return basicFilter && advancedFilter;
  });
}

function dotFilter(relativePath: string) {
  const filename = basename(relativePath);
  return filename.charAt(0) !== '.';
}

function junkFilter(relativePath: string) {
  const filename = basename(relativePath);
  return isNotJunkFile(filename);
}
