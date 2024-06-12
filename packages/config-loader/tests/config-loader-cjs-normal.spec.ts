import path from 'node:path';
import { getDirname } from '@armit/file-utility';
import { loadConfig } from '../src/config-loader/config-loader.js';

const loaderOptions = {
  esm: {
    externals: ['vite'],
  },
};

describe('ConfigLoader normal cjs', () => {
  const fixturesPath = getDirname(import.meta.url, 'fixtures/cjs');

  describe('cosmiconfig load single config file', () => {
    it('should load a valid TS file with default export', async () => {
      const loadedCfg = await loadConfig<{
        cake: string;
      }>(path.resolve(fixturesPath, 'valid-default.config.cjs'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.cake).toStrictEqual('a lie');
    });
  });
});
