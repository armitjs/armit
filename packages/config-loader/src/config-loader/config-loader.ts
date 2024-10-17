import { cosmiconfig, type Loader } from 'cosmiconfig';
import { type CosmiconfigResult } from 'cosmiconfig/dist/types.js';
import { existsSync } from 'fs';
import { isEsmMode } from '../helpers/is-esm-mode.js';
import { esmLoader, type EsmLoaderOptions } from './esm-loader.js';

type ConfigLoadResult<T> = Omit<CosmiconfigResult, 'config'> & {
  config: T;
};

export type LoaderOptions = { esm?: EsmLoaderOptions };

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
      `.${moduleName}rc.mjs`,
      `.${moduleName}rc.cjs`,
      `${moduleName}.config.js`,
      `${moduleName}.config.mjs`,
      `${moduleName}.config.cjs`,
      // TS
      `.${moduleName}rc.ts`,
      `${moduleName}.config.ts`,
      `${moduleName}.config.mts`,
    ],
    loaders: {
      // https://github.com/cosmiconfig/cosmiconfig/tree/889d3b491b54babf4d816a10a6c6720df5ccd944
      // https://github.com/cosmiconfig/cosmiconfig/blob/HEAD/CHANGELOG.md#820
      // isESM with `type:module`, otherwise `commonjs`
      // '.js': dynamicLoader(options, searchFrom),
      // isESM with `type:module`, otherwise `commonjs`
      '.ts': dynamicLoader(options, searchFrom),
      '.mts': dynamicLoader(options, searchFrom),
      // '.mjs': dynamicLoader(options, searchFrom),
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
      // '.js': dynamicLoader(options),
      // isESM with `type:module`, otherwise `commonjs`
      '.ts': dynamicLoader(options),
      '.mts': dynamicLoader(options),
      // '.mjs': dynamicLoader(options),
    },
  });
  return explorer.load(configFile).then((result) => {
    return result as ConfigLoadResult<T> | null;
  });
};

function dynamicLoader(options?: LoaderOptions, searchFrom?: string): Loader {
  return async (path: string, content: string) => {
    const isESM = isEsmMode(path);
    if (!isESM) {
      throw new Error('Only ESM is supported');
    }
    return esmLoader({
      externals: [],
      plugins: [],
      ...options?.esm,
      projectCwd: options?.esm?.projectCwd || searchFrom,
    })(path, content);
  };
}
