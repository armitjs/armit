import { getDirname } from '@armit/file-utility';
import { getPackageDependencyKeys } from '../package-dependency.js';

describe('cosmiconfig get external modules', () => {
  const projectCwd = getDirname(import.meta.url);
  it('should load a valid TS file with named export', async () => {
    const externalModules = await getPackageDependencyKeys(projectCwd);
    expect(externalModules).toEqual(
      expect.arrayContaining([
        '@armit/file-utility',
        '@armit/logger-node',
        'as-table',
        'boxen',
        'dependency-tree',
      ])
    );
  });
});
