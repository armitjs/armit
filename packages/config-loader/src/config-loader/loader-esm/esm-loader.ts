import type { Loader } from 'cosmiconfig';
import { type Plugin } from 'rollup';
import { loadConfigFromFile } from '../../helpers/load-config-from-file.js';
import { createConfigBundler } from './create-config-bundler.js';
import { EsmCompileError } from './esm-compile-error.js';

export type EsmLoaderOptions = {
  externals: string[];
  plugins?: Plugin[];
};

export function esmLoader(options?: EsmLoaderOptions): Loader {
  return async (path: string) => {
    try {
      const { config } = await loadConfigFromFile(
        path,
        createConfigBundler(options?.externals || [], options?.plugins)
      );
      // `default` is used when exporting using export default, some modules
      // may still use `module.exports` or if in TS `export = `
      return config;
    } catch (error) {
      if (error instanceof Error) {
        // Coerce generic error instance into typed error with better logging.
        throw EsmCompileError.fromError(error);
      }
      throw error;
    }
  };
}
