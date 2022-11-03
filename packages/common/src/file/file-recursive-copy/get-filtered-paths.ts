import { basename } from 'node:path';
import mm from 'micromatch';
import { isNotJunkFile, slash } from '../path.js';
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
    return (
      (!useDotFilter || dotFilter(path)) &&
      (!useJunkFilter || junkFilter(path)) &&
      (!filter || mm.isMatch(slash(path), filter))
    );
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
