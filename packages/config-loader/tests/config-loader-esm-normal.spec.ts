import path from 'node:path';
import { getDirname } from '@armit/file-utility';
import {
  loadConfig,
  searchConfig,
} from '../src/config-loader/config-loader.js';

const loaderOptions = {
  esm: {
    externals: ['vite'],
  },
};

describe('ConfigLoader normal', () => {
  const fixturesPath = getDirname(import.meta.url, 'fixtures/esm');

  describe('cosmiconfig load single config file for .mjs', () => {
    it('should search a valid TS file with named export for .mjs', async () => {
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
      }>(path.resolve(fixturesPath, 'valid-default.config.mts'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.cake).toStrictEqual('a lie');
    });
  });
});
