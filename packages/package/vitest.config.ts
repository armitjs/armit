import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    exclude: [...configDefaults.exclude, '**/installPackageLocally.spec.ts'],
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
  },
});
