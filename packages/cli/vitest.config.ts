import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsConfigPaths()],
  resolve: {
    // https://github.com/aleclarson/vite-tsconfig-paths/issues/54
    alias: [
      // handle `@/*.js`
      { find: /^(@\/.*)\.js$/, replacement: '$1.ts' },
      // handle @armit/commander
      // {
      //   find: '@armit/commander',
      //   replacement: path.resolve('../commander/src/index.ts'),
      // },
    ],
  },
  test: {
    // Makebe suite for local debug
    testTimeout: 1000 * 30,
    globals: true,
    environment: 'node',
    passWithNoTests: false,
    cache: {
      dir: '../../.cache/vitest/cli',
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['json-summary', 'html'],
      extension: ['js', 'jsx', 'ts', 'tsx'],
    },
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
    exclude: [
      '**/node_modules/**',
      'dist/**',
      '**/coverage/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
  },
});
