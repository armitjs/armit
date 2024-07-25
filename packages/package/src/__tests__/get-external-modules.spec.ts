import { getPackageDependencyKeys } from '../package-dependency.js';

describe('cosmiconfig get external modules', () => {
  it('should load a valid TS file with named export', async () => {
    const externalModules = await getPackageDependencyKeys();
    expect(externalModules).toEqual(
      expect.arrayContaining([
        '@armit/file-utility',
        '@armit/logger-node',
        '@hyperse/install-local',
      ])
    );
  });
});
