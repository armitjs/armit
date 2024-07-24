import { join } from 'path';
import { getDirname } from '@armit/file-utility';
import { getNpmLinked } from '../npm-installer/get-npm-linked.js';

describe('List linked npm packages in a project', () => {
  const projectCwd = getDirname(import.meta.url, '../../../../');
  it('Should correct linked npm packages', async () => {
    const externalModules = await getNpmLinked(
      join(projectCwd, 'node_modules')
    );
    expect(externalModules).toEqual(
      expect.arrayContaining([
        '@armit/terminal',
        '@armit/package',
        '@armit/logger-node',
        '@armit/logger',
        '@armit/ldap',
        '@armit/git',
        '@armit/generate-template-files',
        '@armit/file-utility',
        '@armit/file-recursive-copy',
        '@armit/config-loader',
        '@armit/commander',
        '@armit/cli',
        '@armit/babel-merge',
      ])
    );
  });
});
