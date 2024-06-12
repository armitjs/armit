import { resolve } from 'path';
import { type PackageJson } from 'type-fest';
import { readJsonFromFile } from '@armit/file-utility';
import { type PackageItem } from './types.js';

/**
 * Given the specified module `@dimjs/utils`, the module expression `@dimjs/*` extracts the correct list of dependent modules for the current project
 * @param modulePatterns Package module name, or module expression. [`^babel-`,`@dimjs/*`]
 * @param packageFile The path to the package.json file, either absolute or relative to your workspace(`cwd`).
 * @param cwd Working directory
 * @returns
 */
export function fetchTestModules(
  modulePatterns: string[],
  packageFile: string,
  cwd = process.cwd()
): PackageItem[] {
  try {
    const matchedModules: PackageItem[] = [];
    const packageAbsPath = resolve(cwd, packageFile);
    const packageJson = readJsonFromFile<PackageJson>(packageAbsPath);
    const dependencies = packageJson.dependencies || {};
    const dependencyKeys = Object.keys(dependencies);
    for (const partern of modulePatterns) {
      dependencyKeys.forEach((moduleName) => {
        if (new RegExp(partern).test(moduleName)) {
          matchedModules.push({
            name: moduleName,
            version: dependencies[moduleName] as string,
          });
        }
      });
    }
    return matchedModules;
  } catch {
    return [];
  }
}
