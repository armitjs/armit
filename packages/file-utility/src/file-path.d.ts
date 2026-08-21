import type { Options } from 'micromatch';
/**
 * Ensure your string ends with a slash.
 * @param str
 * @param slashEndfix
 * @returns
 */
export declare const ensureSlash: (str: string, slashEndfix?: boolean) => string;
/**
 * Returns true if every string in the given list matches any of the given glob patterns.
 * @param str The string to test.
 * @param pattern One or more glob patterns to use for matching.
 * @param options https://github.com/micromatch/micromatch#options
 * @returns
 */
export declare const isPathMatch: (str: string, pattern: string | string[], options?: Options) => boolean;
/**
 * Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
 * Forward-slash paths can be used in Windows as long as they're not extended-length paths.
 * This was created since the path methods in Node.js outputs \\ paths on Windows.
 * @param path
 * @returns
 */
export declare const normalizeSlash: (path: string) => string;
