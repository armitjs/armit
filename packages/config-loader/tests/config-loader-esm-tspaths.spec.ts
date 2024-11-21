import path from 'node:path';
import { getDirname } from '@armit/file-utility';
import type { LoaderOptions } from '../src/config-loader/config-loader.js';
import {
  loadConfig,
  searchConfig,
} from '../src/config-loader/config-loader.js';

const fixturesPath = getDirname(import.meta.url, 'fixtures/ts-paths');

const loaderOptions: LoaderOptions = {
  esm: {
    externals: ['vite'],
    tsconfig: path.resolve(fixturesPath, 'tsconfig.json'),
  },
};

describe('ConfigLoader ts paths', () => {
  describe('cosmiconfig load single config file for .ts', () => {
    it('should search a valid TS file with named export for .ts', async () => {
      const loadedCfg = await searchConfig<{
        cake: string;
      }>('valid-default', fixturesPath, loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.cake).toStrictEqual('a lie');
    });

    it('should load a valid TS file with default export', async () => {
      const loadedCfg = await loadConfig<{
        cake: string;
      }>(path.resolve(fixturesPath, 'valid-default.config.ts'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.cake).toStrictEqual('a lie');
    });
  });
});
