import { existsSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getDirname } from '@armit/file-utility';
import { installPackageLocally } from '../npm-installer/npm-installer.js';

describe('correct install locall modules', () => {
  const projectCwd = getDirname(import.meta.url);

  const cleanPackageJson = () => {
    if (existsSync(join(projectCwd, 'package.json'))) {
      rmSync(join(projectCwd, 'package.json'));
    }
  };

  const cleanNodeModules = () => {
    if (existsSync(join(projectCwd, 'node_modules'))) {
      rmSync(join(projectCwd, 'node_modules'), {
        recursive: true,
        force: true,
      });
    }
  };
  beforeAll(() => {
    cleanPackageJson();
    writeFileSync(join(projectCwd, 'package.json'), '{"name":"test"}');
  });

  afterAll(() => {
    cleanPackageJson();
    cleanNodeModules();
  });

  it('should correct install local modules', async () => {
    const result = await installPackageLocally(projectCwd, ['../../../logger']);
    expect(existsSync(join(projectCwd, 'node_modules'))).toBe(true);
    expect(existsSync(join(projectCwd, 'node_modules/@armit/logger'))).toBe(
      true
    );
    expect(result).toBe(1);
  });
});
