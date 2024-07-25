import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    testTimeout: 1000 * 30,
    exclude: [...configDefaults.exclude],
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
  },
});
