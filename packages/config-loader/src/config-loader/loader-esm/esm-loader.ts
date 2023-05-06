import type { Loader } from 'cosmiconfig';
import { loadConfigFromFile } from '../../helpers/load-config-from-file.js';
import { type ConfigBundler } from '../../types.js';
import { EsmCompileError } from './esm-compile-error.js';

export type EsmLoaderOptions = {
  configBundler: ConfigBundler;
};

export function esmLoader(options?: EsmLoaderOptions): Loader {
  return async (path: string) => {
    try {
      const { config } = await loadConfigFromFile(path, options?.configBundler);
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
