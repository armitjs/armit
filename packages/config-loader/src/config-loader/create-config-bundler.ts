import type { TransformOptions } from 'esbuild';
import { rollup } from 'rollup';
import { getPackageDependencyKeys } from '@armit/package';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginJson from '@rollup/plugin-json';
import pluginResolve from '@rollup/plugin-node-resolve';
import { getTsconfig } from '../helpers/get-tsconfig.js';
import { esbuildTransform } from '../plugins/esbuild.js';
import { externalizeNodeModules } from '../plugins/externalize-node-modules.js';
import { resolveTsconfigPaths } from '../plugins/resolve-tsconfig-paths.js';
import { type ConfigBundler } from '../types.js';
import { type EsmLoaderOptions } from './esm-loader.js';

export const createConfigBundler: (
  options: EsmLoaderOptions
) => Promise<ConfigBundler> = async (options) => {
  // node-resolve plugin
  // .mts, .cts, .tsx, .jsx support :https://github.com/rollup/plugins/pull/1498
  const nodeResolvePlugin = (pluginResolve.default || pluginResolve)({
    rootDir: options.projectCwd,
    extensions: [
      '.js',
      '.ts',
      '.tsx',
      '.jsx',
      '.mts',
      '.mjs',
      '.cts',
      '.cjs',
      '.json',
    ],
  });

  // commonjs plugin
  const commonjsPlugin = (pluginCommonjs.default || pluginCommonjs)({});

  // Json plugin
  const jsonPlugin = (pluginJson.default || pluginJson)({});

  const repoExternalModules = await getPackageDependencyKeys(
    options.projectCwd,
    options.externals
  );

  const tsconfig = getTsconfig(options.tsconfig);

  const esbuildConfig: TransformOptions = {
    target: options.target || 'node20',
    tsconfigRaw: tsconfig?.config,
  };

  return {
    async bundle(fileName: string): Promise<{ code: string }> {
      const bundle = await rollup({
        input: fileName,
        treeshake: {
          annotations: true,
          moduleSideEffects: false,
          unknownGlobalSideEffects: false,
        },
        cache: false,
        plugins: [
          // Keep externalizeNodeModules plugin first, to externalize all external modules.
          externalizeNodeModules(repoExternalModules),
          // keep correct order, make tsPaths resolver plugin after externalizeNodeModules plugin
          ...(tsconfig ? [resolveTsconfigPaths(tsconfig)] : []),
          nodeResolvePlugin,
          commonjsPlugin,
          jsonPlugin,
          esbuildTransform(esbuildConfig),
          ...(options.plugins || []),
        ],
      });
      const { output } = await bundle.generate({
        format: 'esm',
        indent: true,
        extend: true,
        strict: false,
      });
      const allCodes: string[] = [];
      for (const chunkOrAsset of output) {
        if (chunkOrAsset.type !== 'asset') {
          allCodes.push(chunkOrAsset.code);
        }
      }
      const bundledCode = allCodes.join('\n');
      return {
        code: bundledCode,
      };
    },
  };
};
