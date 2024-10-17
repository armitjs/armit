import path from 'node:path';
import { getDirname } from '@armit/file-utility';
import {
  loadConfig,
  LoaderOptions,
} from '../src/config-loader/config-loader.js';

const loaderOptions: LoaderOptions = {
  esm: {
    externals: ['vite'],
  },
};
const fixturesPath = getDirname(import.meta.url, 'fixtures/esm');

describe('cosmiconfig correct load config file using defineConfig', () => {
  it('should correct load `defineConfig` with default input', async () => {
    const loadedCfg = await loadConfig<{
      name: string;
    }>(
      path.resolve(fixturesPath, 'valid-define-config.config.ts'),
      loaderOptions
    );
    expect(typeof loadedCfg?.config).toStrictEqual('object');
    expect(typeof loadedCfg?.config.name).toStrictEqual('string');
    expect(loadedCfg?.config.name).toBe('tian');
  });

  it('should correct load `defineConfig` with funtion input', async () => {
    const loadedCfg = await loadConfig<{ root: string }>(
      path.resolve(fixturesPath, 'valid-define-config-fn.config.ts'),
      loaderOptions
    );
    expect(typeof loadedCfg?.config).toStrictEqual('object');
    expect(typeof loadedCfg?.config.root).toStrictEqual('string');
    expect(loadedCfg?.config.root).toBe('tian');
  });
});
