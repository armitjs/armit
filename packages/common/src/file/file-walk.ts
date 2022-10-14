import type { Options } from 'globby';
import { globbySync, globby } from 'globby';

/**
 * Traversing the file system and returning pathnames that matched a defined set of a specified pattern according to the rules
 * @example
 * ```ts
 * // https://github.com/mrmlnc/fast-glob
 * const files = fileWalkSync('**\/*.*', {
 *   cwd: fixtureCwd,
 *   ignore: ['**\/*.{jpg,png}'],
 * });
 * ```
 * @returns
 */
export const fileWalkSync = (
  pattern: string | readonly string[],
  options: Options = {}
): string[] => {
  return globbySync(pattern, {
    absolute: true,
    dot: false,
    unique: true,
    ...options,
  });
};

/**
 * Traversing the file system and returning pathnames that matched a defined set of a specified pattern according to the rules
 * @example
 * ```ts
 * // https://github.com/mrmlnc/fast-glob
 * const files = await fileWalk('**\/*.*', {
 *   cwd: fixtureCwd,
 *   ignore: ['**\/*.{jpg,png}'],
 * });
 * ```
 * @returns
 */
export const fileWalk = (
  pattern: string | readonly string[],
  options: Options = {}
): Promise<string[]> => {
  return globby(pattern, {
    absolute: true,
    dot: false,
    unique: true,
    ...options,
  });
};
