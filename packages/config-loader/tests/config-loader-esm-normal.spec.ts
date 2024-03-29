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

    // FIXME:https://github.com/cosmiconfig/cosmiconfig/issues/308
    // it('should search a valid TS file with default export for .js', async () => {
    //   const loadedCfg = await searchConfig<{
    //     test: {
    //       cake: string;
    //     };
    //   }>('valid', fixturesPath, loaderOptions);
    //   expect(typeof loadedCfg?.config).toStrictEqual('object');
    //   expect(typeof loadedCfg?.config.test).toStrictEqual('object');
    //   expect(loadedCfg?.config.test.cake).toStrictEqual('a lie');
    // });

    // it('should load a valid TS file with named export', async () => {
    //   const loadedCfg = await loadConfig<{
    //     test: {
    //       cake: string;
    //     };
    //   }>(path.resolve(fixturesPath, 'valid.config.mjs'), loaderOptions);
    //   expect(typeof loadedCfg?.config).toStrictEqual('object');
    //   expect(typeof loadedCfg?.config.test).toStrictEqual('object');
    //   expect(loadedCfg?.config.test.cake).toStrictEqual('a lie');
    // });

    // it('should load a valid TS file with named export for .js', async () => {
    //   const loadedCfg = await loadConfig<{
    //     test: {
    //       cake: string;
    //     };
    //   }>(path.resolve(fixturesPath, 'valid.config.js'), loaderOptions);
    //   expect(typeof loadedCfg?.config).toStrictEqual('object');
    //   expect(typeof loadedCfg?.config.test).toStrictEqual('object');
    //   expect(loadedCfg?.config.test.cake).toStrictEqual('a lie');
    // });

    it('should load a valid TS file with default export', async () => {
      const loadedCfg = await loadConfig<{
        cake: string;
      }>(path.resolve(fixturesPath, 'valid-default.config.mts'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.cake).toStrictEqual('a lie');
    });

    // it('Should return null if not correct config file', async () => {
    //   const loadedCfg = await loadConfig<{
    //     test: {
    //       cake: string;
    //     };
    //   }>(path.resolve(fixturesPath, 'valid-unknow.config.ts'), loaderOptions);
    //   expect(loadedCfg).toBeNull();
    // });
  });

  // describe('cosmiconfig search matched config file', () => {
  //   it('should load a valid TS file with named export', async () => {
  //     const loadedCfg = await searchConfig<{
  //       test: {
  //         cake: string;
  //       };
  //     }>('valid', join(fixturesPath, 'nested'), loaderOptions);
  //     expect(typeof loadedCfg?.config).toStrictEqual('object');
  //     expect(typeof loadedCfg?.config.test).toStrictEqual('object');
  //     expect(loadedCfg?.config.test.cake).toStrictEqual('a lie nest');
  //   });

  //   it('Should return null if not correct moduleName specificed', async () => {
  //     const loadedCfg = await searchConfig<{
  //       test: {
  //         cake: string;
  //       };
  //     }>('valid111', join(fixturesPath, 'nested'), loaderOptions);
  //     expect(loadedCfg).toBeNull();
  //   });
  // });
});
