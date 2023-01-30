/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  dts: true,
  entry: {
    index: 'src/index.ts',
    'web/index': 'src/web/index.ts',
    'node/index': 'src/node/index.ts',
  },
  splitting: false,
  sourcemap: !options.watch,
  clean: true,
  minify: !options.watch,
  treeshake: true,
  tsconfig: './tsconfig.build.json',
  format: ['esm'],
}));
