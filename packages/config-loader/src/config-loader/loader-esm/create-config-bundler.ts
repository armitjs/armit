import { builtinModules, createRequire, isBuiltin } from 'node:module';
import { getPackageDependencyKeys } from '@armit/package';
import { babel } from '@rollup/plugin-babel';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginJson from '@rollup/plugin-json';
import pluginResolve from '@rollup/plugin-node-resolve';
import { rollup } from 'rollup';
import { type ConfigBundler } from '../../types.js';
import { type EsmLoaderOptions } from './esm-loader.js';

const esmRequire = createRequire(import.meta.url);

const resolve = (modulePath: string) => {
  try {
    return esmRequire.resolve(modulePath);
  } catch (err) {
    return null;
  }
};
const nodeBabelPreset = {
  presets: [
    [
      esmRequire.resolve('@babel/preset-env'),
      {
        loose: true,
        useBuiltIns: false,
        targets: 'node >= 14.0',
      },
    ],
    [
      esmRequire.resolve('@babel/preset-typescript'),
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

const decorators = resolve('@babel/plugin-proposal-decorators');
if (decorators) {
  nodeBabelPreset.plugins.push([decorators, { legacy: true }]);
}

const classProperties = resolve('@babel/plugin-proposal-class-properties');
if (classProperties) {
  nodeBabelPreset.plugins.push([classProperties, { loose: true }]);
}

export const createConfigBundler: (
  options: EsmLoaderOptions
) => Promise<ConfigBundler> = async (options) => {
  // node-resolve plugin
  // FIXME: .mts, .cts, .tsx, .jsx support :https://github.com/rollup/plugins/pull/1498
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
          const isExternal = repoExternalModules.find(
            (externalModule: string) => {
              return moduleId.startsWith(externalModule);
            }
          );
          return (
            !!isExternal ||
            builtinModules.includes(moduleId) ||
            isBuiltin(moduleId)
          );
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
