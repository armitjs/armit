import type { Options } from 'globby';
/**
 * Traversing the file system and returning pathnames that matched a defined set of a specified pattern according to the rules
 * Note '!**\/__MACOSX/**', '!**\/*.DS_Store' will be ignored.
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
export declare const fileWalkSync: (pattern: string | readonly string[], options?: Options) => string[];
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
export declare const fileWalk: (pattern: string | readonly string[], options?: Options) => Promise<string[]>;
