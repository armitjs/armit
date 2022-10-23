import { arrayUnique, arrayFlatten } from '@armit/common';

/**
 * normalize yargs --filter --modules option into standard globby patterns
 * @param option The given yargs -f (--filter) = "a;b;c"
 */
export const normalizeOptionSemicolonParts = (option: string[]): string[] => {
  const semicolonParts = arrayFlatten<string[]>(
    option.map((item) => {
      return item
        .split(/\s*;\s*/)
        .filter(Boolean)
        .map((s) => s.trim());
    })
  ).filter(Boolean);

  return arrayUnique(semicolonParts);
};
