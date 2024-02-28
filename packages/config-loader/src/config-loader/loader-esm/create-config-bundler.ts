import { getPackageDependencyKeys, requireResolve } from '@armit/package';
import { babel } from '@rollup/plugin-babel';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginJson from '@rollup/plugin-json';
import pluginResolve from '@rollup/plugin-node-resolve';
import { rollup } from 'rollup';
import { isExternalModule } from '../../helpers/is-external-module.js';
import { type ConfigBundler } from '../../types.js';
import { type EsmLoaderOptions } from './esm-loader.js';

const nodeBabelPreset = {
  presets: [
    [
      requireResolve(import.meta.url, '@babel/preset-env'),
      {
        loose: true,
        useBuiltIns: false,
        targets: 'node >= 14.0',
      },
    ],
    [
      requireResolve(import.meta.url, '@babel/preset-typescript'),
      {
        // https://babeljs.io/docs/en/babel-preset-typescript
        // https://github.com/babel/babel/blob/main/packages/babel-parser/src/plugins/typescript/index.js#L3133
        isTSX: false,
        allExtensions: false,
      },
    ],
  ],
  plugins: [] as Array<[string, Record<string, unknown>]>,
};

const decorators = requireResolve(
  import.meta.url,
  '@babel/plugin-proposal-decorators'
);
if (decorators) {
  nodeBabelPreset.plugins.push([decorators, { legacy: true }]);
}

const classProperties = requireResolve(
  import.meta.url,
  '@babel/plugin-transform-class-properties'
);
if (classProperties) {
  nodeBabelPreset.plugins.push([classProperties, { loose: true }]);
}

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

  return {
    async bundle(fileName: string): Promise<{ code: string }> {
      const bundle = await rollup({
        input: fileName,
        external: (moduleId) => {
          // Indicate which modules should be treated as external
          return isExternalModule(repoExternalModules, moduleId);
        },
        treeshake: {
          annotations: true,
          moduleSideEffects: false,
          unknownGlobalSideEffects: false,
        },
        cache: false,
        plugins: [
          nodeResolvePlugin,
          commonjsPlugin,
          jsonPlugin,
          babel({
            ...nodeBabelPreset,
            babelrc: false,
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
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
          }),
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
