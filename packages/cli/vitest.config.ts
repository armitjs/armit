import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    testTimeout: 1000 * 30,
    exclude: [...configDefaults.exclude],
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
  },
});
