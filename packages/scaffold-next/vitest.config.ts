import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    tsconfigPaths(),
    svgr({
      // Set it to `true` to export React component as default.
      // svgr options: https://react-svgr.com/docs/options/
      svgrOptions: {},
    }),
  ],
  cacheDir: '../../.cache/vitest/scaffold-next',
  test: {
    // Makebe suite for local debug
    testTimeout: 1000 * 30,
    globals: true,
    environment: 'happy-dom',
    passWithNoTests: false,
    setupFiles: './config/tests/setupVitest.ts',
    coverage: {
      provider: 'istanbul',
      reporter: ['json-summary', 'html'],
      extension: ['js', 'jsx', 'ts', 'tsx'],
    },
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
  },
});
