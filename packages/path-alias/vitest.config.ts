import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsConfigPaths({})],
  resolve: {
    // https://github.com/aleclarson/vite-tsconfig-paths/issues/54
    alias: [
      // handle `@/*`
      { find: /^(@\/.*)\.js$/, replacement: '$1.ts' },
    ],
  },
  test: {
    // Makebe suite for local debug
    testTimeout: 1000 * 30,
    globals: true,
    environment: 'node',
    passWithNoTests: false,
    cache: {
      dir: '../../.cache/vitest/path-alias',
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'clover'],
      extension: ['js', 'jsx', 'ts', 'tsx'],
    },
    exclude: [
      '**/node_modules/**',
      'dist/**',
      '**/coverage/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
  },
});
