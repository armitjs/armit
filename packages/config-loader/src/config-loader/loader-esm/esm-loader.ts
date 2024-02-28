import type { Loader } from 'cosmiconfig';
import { type Plugin } from 'rollup';
import { loadConfigFromFile } from '../../helpers/load-config-from-file.js';
import { createConfigBundler } from './create-config-bundler.js';

export type EsmLoaderOptions = {
  externals: Array<RegExp | string>;
  plugins?: Plugin[];
  projectCwd?: string;
};

export function esmLoader(
  options: EsmLoaderOptions = {
    externals: [],
    plugins: [],
  }
): Loader {
  return async (path: string) => {
    const configBundler = await createConfigBundler(options);
    const { config } = await loadConfigFromFile(path, configBundler);
    // `default` is used when exporting using export default, some modules
    // may still use `module.exports` or if in TS `export = `
    return config;
  };
}
