/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { existsSync } from 'fs';
import { type Loader, cosmiconfig } from 'cosmiconfig';
import { type CosmiconfigResult } from 'cosmiconfig/dist/types.js';
import { type RegisterOptions } from 'ts-node';
import { isEsmMode } from '../helpers/is-esm-mode.js';
import { type EsmLoaderOptions, esmLoader } from './loader-esm/esm-loader.js';
import { tsLoader } from './loader-ts-cjs/ts-loader.js';

type ConfigLoadResult<T> = Omit<CosmiconfigResult, 'config'> & {
  config: T;
};

type LoaderOptions = { ts?: RegisterOptions; esm?: EsmLoaderOptions };
/**
 * Search up the directory tree, checking each of these places in each directory, until it finds some acceptable configuration (or hits the home directory).
 * @param moduleName Your module name. This is used to create the default searchPlaces and packageProp.
 * @param searchFrom Default search from process.cwd()
 * @returns
 */
export const searchConfig = async <T = any>(
  moduleName: string,
  searchFrom: string = process.cwd(),
  options?: LoaderOptions
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
      `${moduleName}.config.cjs`,
      `${moduleName}.config.ts`,
      `${moduleName}.config.mts`,
      `${moduleName}.config.mjs`,
    ],
    loaders: {
      // isESM with `type:module`, otherwise `commonjs`
      '.js': dynamicLoader(options, searchFrom),
      // isESM with `type:module`, otherwise `commonjs`
      '.ts': dynamicLoader(options, searchFrom),
      '.mts': dynamicLoader(options, searchFrom),
      '.mjs': dynamicLoader(options, searchFrom),
    },
  });
  return explorer.search(searchFrom).then((result) => {
    return result as ConfigLoadResult<T> | null;
  });
};

export const loadConfig = async <T = any>(
  configFile: string,
  options?: LoaderOptions
) => {
  if (!existsSync(configFile)) {
    return null;
  }
  const explorer = cosmiconfig('', {
    loaders: {
      // isESM with `type:module`, otherwise `commonjs`
      '.js': dynamicLoader(options),
      // isESM with `type:module`, otherwise `commonjs`
      '.ts': dynamicLoader(options),
      '.mts': dynamicLoader(options),
      '.mjs': dynamicLoader(options),
    },
  });
  return explorer.load(configFile).then((result) => {
    return result as ConfigLoadResult<T> | null;
  });
};

function dynamicLoader(options?: LoaderOptions, searchFrom?: string): Loader {
  return async (path: string, content: string) => {
    const isESM = isEsmMode(path);
    if (isESM) {
      return esmLoader({
        externals: [],
        plugins: [],
        ...options?.esm,
        projectCwd: options?.esm?.projectCwd || searchFrom,
      })(path, content);
    } else {
      return tsLoader(options?.ts)(path, content);
    }
  };
}
