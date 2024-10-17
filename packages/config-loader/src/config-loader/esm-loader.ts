import type { Loader } from 'cosmiconfig';
import { type Plugin } from 'rollup';
import { loadConfigFromFile } from '../helpers/load-config-from-file.js';
import { createConfigBundler } from './create-config-bundler.js';

export type EsmLoaderOptions = {
  externals: Array<RegExp | string>;
  plugins?: Plugin[];
  projectCwd?: string;
  /**
   * The target specifies the environments the output should support
   * @see https://esbuild.github.io/api/#target
   * @example es2020,chrome58,edge16,firefox57,node12,safari11
   * @default node20
   */
  target?: string;
  /**
   * Custom tsconfig.json path
   * By default, will looks for tsconfig.json configuration file in the current working directory.
   * You can pass in a custom tsconfig.json path with the --tsconfig flag:
   */
  tsconfig?: string;
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
