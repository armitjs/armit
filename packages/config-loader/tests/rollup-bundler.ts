import { builtinModules, isBuiltin } from 'node:module';
import { babel } from '@rollup/plugin-babel';
import pluginCommonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { rollup } from 'rollup';
import { type ConfigBundler } from '../src/types.js';

const nodeBabelPreset = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        loose: true,
        useBuiltIns: false,
        targets: 'node >= 14.0',
      },
    ],
    [
      require.resolve('@babel/preset-typescript'),
      {
        // https://babeljs.io/docs/en/babel-preset-typescript
        // https://github.com/babel/babel/blob/main/packages/babel-parser/src/plugins/typescript/index.js#L3133
        isTSX: false,
        allExtensions: false,
      },
    ],
  ],
  plugins: [
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      { loose: true },
    ],
  ],
};

export const rollupBundler: ConfigBundler = {
  async bundle(fileName: string): Promise<{ code: string }> {
    const bundle = await rollup({
      input: fileName,
      external: (moduleId) => {
        const externals = ['vite'];
        if (!externals.length) {
          return false;
        }
        const isExternal = externals.find((externalModule: string) => {
          // moduleId: `@dimjs/utils/esm/class-names`
          return moduleId.startsWith(externalModule);
        });
        return (
          !!isExternal ||
          builtinModules.includes(moduleId) ||
          isBuiltin(moduleId)
        );
      },
      cache: false,
      plugins: [
        nodeResolve({
          extensions: ['.js', '.ts', '.tsx', '.json', '.vue'],
        }),
        (pluginCommonjs.default || pluginCommonjs)({}),
        babel({
          ...nodeBabelPreset,
          babelrc: false,
          exclude: 'node_modules/**',
          babelHelpers: 'bundled',
          extensions: ['.js', '.ts', '.tsx', '.json', '.vue'],
        }),
      ],
    });
    try {
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
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
