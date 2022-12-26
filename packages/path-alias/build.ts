/* eslint-disable @typescript-eslint/naming-convention */
import type { Format } from 'tsup';
import { build } from 'tsup';

async function buildAll() {
  const entries = {
    'src/index.ts': {
      format: ['esm', 'cjs'],
      entry: 'index',
      dts: true,
      clean: true,
      outExtension: undefined,
    },
    'src/register/index.ts': {
      format: ['cjs'],
      entry: 'register/index',
      dts: false,
      clean: false,
      outExtension() {
        return {
          js: `.cjs`,
        };
      },
    },
    'src/loader/index.mts': {
      format: ['esm'],
      entry: 'loader/index',
      dts: false,
      clean: false,
      outExtension() {
        return {
          js: `.mjs`,
        };
      },
    },
  };

  for (const [key, value] of Object.entries(entries)) {
    const { format, entry, dts, clean, outExtension } = value;
    await build({
      splitting: false,
      treeshake: true,
      tsconfig: './tsconfig.build.json',
      entry: {
        [entry]: key,
      },
      dts,
      clean,
      outExtension,
      format: format as Format[],
    });
  }
}

await buildAll();
