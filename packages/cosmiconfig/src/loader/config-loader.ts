/* eslint-disable @typescript-eslint/no-explicit-any */
import { existsSync } from 'fs';
import { cosmiconfig } from 'cosmiconfig';
import { type CosmiconfigResult } from 'cosmiconfig/dist/types.js';
import { tsLoader } from './loader.js';

type ConfigLoadResult<T> = Omit<CosmiconfigResult, 'config'> & {
  config: T;
};

/**
 * Search up the directory tree, checking each of these places in each directory, until it finds some acceptable configuration (or hits the home directory).
 * @param moduleName Your module name. This is used to create the default searchPlaces and packageProp.
 * @param searchFrom Default search from process.cwd()
 * @returns
 */
export const searchConfig = async <T = any>(
  moduleName: string,
  searchFrom: string = process.cwd()
) => {
  const explorer = cosmiconfig(moduleName, {
    searchPlaces: [
      'package.json',
      `.${moduleName}rc`,
      `.${moduleName}rc.json`,
      `.${moduleName}rc.yaml`,
      `.${moduleName}rc.yml`,
      `.${moduleName}rc.js`,
      `.${moduleName}rc.ts`,
      `.${moduleName}rc.cjs`,
      `${moduleName}.config.js`,
      `${moduleName}.config.ts`,
      `${moduleName}.config.cjs`,
    ],
    loaders: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '.ts': tsLoader(),
    },
  });
  return explorer.search(searchFrom).then((result) => {
    return result as ConfigLoadResult<T> | null;
  });
};

export const loadConfig = async <T = any>(configFile: string) => {
  if (!existsSync(configFile)) {
    return null;
  }
  const explorer = cosmiconfig('', {
    loaders: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '.ts': tsLoader(),
    },
  });
  return explorer.load(configFile).then((result) => {
    return result as ConfigLoadResult<T> | null;
  });
};
