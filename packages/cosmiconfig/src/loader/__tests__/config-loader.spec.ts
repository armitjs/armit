import path, { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import { loadConfig, searchConfig } from '../config-loader.js';

describe('ConfigLoader', () => {
  const fixturesPath = getDirname(import.meta.url, 'fixtures');

  describe('cosmiconfig load single config file', () => {
    it('should load a valid TS file with named export', async () => {
      const loadedCfg = await loadConfig<{
        test: {
          cake: string;
        };
      }>(path.resolve(fixturesPath, 'valid.config.ts'));
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(typeof loadedCfg?.config.test).toStrictEqual('object');
      expect(loadedCfg?.config.test.cake).toStrictEqual('a lie');
    });

    it('should load a valid TS file with default export', async () => {
      const loadedCfg = await loadConfig<{
        cake: string;
      }>(path.resolve(fixturesPath, 'valid-default.config.ts'));
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.cake).toStrictEqual('a lie');
    });

    it('Should return null if not correct config file', async () => {
      const loadedCfg = await loadConfig<{
        test: {
          cake: string;
        };
      }>(path.resolve(fixturesPath, 'valid-unknow.config.ts'));
      expect(loadedCfg).toBeNull();
    });
  });

  describe('cosmiconfig search matched config file', () => {
    it('should load a valid TS file with named export', async () => {
      const loadedCfg = await searchConfig<{
        test: {
          cake: string;
        };
      }>('valid', join(fixturesPath, 'nested'));
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(typeof loadedCfg?.config.test).toStrictEqual('object');
      expect(loadedCfg?.config.test.cake).toStrictEqual('a lie nest');
    });

    it('Should return null if not correct moduleName specificed', async () => {
      const loadedCfg = await searchConfig<{
        test: {
          cake: string;
        };
      }>('valid111', join(fixturesPath, 'nested'));
      expect(loadedCfg).toBeNull();
    });
  });
});
