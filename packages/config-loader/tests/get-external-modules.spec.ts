import { getDirname } from '@armit/file-utility';
import { getEsmExternalModules } from '../src/config-loader/loader-esm/get-external-modules.js';

describe('cosmiconfig get external modules', () => {
  const projectCwd = getDirname(import.meta.url);
  it('should load a valid TS file with named export', async () => {
    const externalModules = await getEsmExternalModules(projectCwd);
    expect(externalModules).toEqual(
      expect.arrayContaining([
        '@armit/file-utility',
        '@armit/package',
        'cosmiconfig',
        'type-fest',
      ])
    );
  });
});
