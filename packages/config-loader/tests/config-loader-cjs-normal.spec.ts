import path, { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import {
  loadConfig,
  searchConfig,
} from '../src/config-loader/config-loader.js';
import { rollupBundler } from './rollup-bundler.js';

const loaderOptions = {
  esm: {
    configBundler: rollupBundler,
  },
};

describe('ConfigLoader normal cjs', () => {
  const fixturesPath = getDirname(import.meta.url, 'fixtures/cjs');

  describe('cosmiconfig load single config file', () => {
    it('should load a valid TS file with named export', async () => {
      const loadedCfg = await loadConfig<{
        test: {
          cake: string;
        };
      }>(path.resolve(fixturesPath, 'valid.config.cjs'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(typeof loadedCfg?.config.test).toStrictEqual('object');
      expect(loadedCfg?.config.test.cake).toStrictEqual('a lie');
    });

    it('should load a valid TS file with default export', async () => {
      const loadedCfg = await loadConfig<{
        cake: string;
      }>(path.resolve(fixturesPath, 'valid-default.config.cjs'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.cake).toStrictEqual('a lie');
    });

    it('Should return null if not correct config file', async () => {
      const loadedCfg = await loadConfig<{
        test: {
          cake: string;
        };
      }>(path.resolve(fixturesPath, 'valid-unknow.config.cjs'), loaderOptions);
      expect(loadedCfg).toBeNull();
    });
  });

  describe('cosmiconfig search matched config file', () => {
    it('should load a valid JS file with named export', async () => {
      const loadedCfg = await searchConfig<{
        test: {
          cake: string;
        };
      }>('valid', join(fixturesPath, 'nested'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(typeof loadedCfg?.config.test).toStrictEqual('object');
      expect(loadedCfg?.config.test.cake).toStrictEqual('a lie nest');
    });
  });
});