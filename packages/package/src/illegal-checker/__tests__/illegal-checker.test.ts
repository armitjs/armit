import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import {
  illegalInstalledVersionOfModules,
  printUnexpectedModules,
  semverTest,
} from '../illegal-checker.js';
const fixtureCwd = join(__dirname, 'fixtures-install');
describe('package-guarantee.test.ts', () => {
  // "@babel/core": "^7.21.4",
  // "@flatjs/common": "^1.5.25",
  // "@flatjs/evolve-preset-babel": "^1.5.23",
  // "@flatjs/forge-plugin-postcss-pixel": "^1.6.0",
  // "@flatjs/mock": "^1.5.25",
  it('Should current check semver version constraint', () => {
    expect(semverTest(`7.21.4`, `^7.21.4`)).toBe(true);
    expect(semverTest(`7.21.4`, `7.21.4`)).toBe(true);
    expect(semverTest(`7.21.3`, `7.21.4`)).toBe(false);
    expect(semverTest(`7.21.3`, `^7.21.4`)).toBe(false);
    expect(semverTest(`7.21.4`, `^7.21.3`)).toBe(true);
    expect(semverTest(`7.21.4`, `^7.21.3`)).toBe(true);
    expect(semverTest(`7.21.4`, `^7.21.3`)).toBe(true);
    expect(semverTest(`7.21.4`, `*`)).toBe(true);
  });

  it('Should correct if local installed modules satisfies package.json declared', async () => {
    const { illegalModules } = await illegalInstalledVersionOfModules(
      ['@flatjs/*'],
      'packages/evolve/package.json'
    );
    expect(illegalModules.length).toBe(0);
  });

  beforeEach(() => {
    rmSync(fixtureCwd, {
      recursive: true,
      force: true,
    });
    mkdirSync(fixtureCwd, {
      recursive: true,
    });
  });

  function makeData() {
    const dirs = [
      {
        name: '@dimjs/utils',
        version: '1.3.0',
        path: 'node_modules/@dimjs/utils',
        dependencies: {},
      },
      {
        name: '@dimjs/request',
        version: '1.2.45',
        path: 'node_modules/@dimjs/request',
        dependencies: {
          '@dimjs/logger': '^1.3.0',
        },
      },
      {
        name: '@dimjs/logger',
        version: '1.3.0',
        path: 'node_modules/@dimjs/request/node_modules/@dimjs/logger',
        dependencies: {
          '@dimjs/request': '^1.3.0',
        },
      },
      {
        name: '@dimjs/request',
        version: '1.3.0',
        path: 'node_modules/@dimjs/request/node_modules/@dimjs/logger/node_modules/@dimjs/request',
        dependencies: {
          '@dimjs/utils': '^1.2.0',
        },
      },
      {
        name: '@dimjs/utils',
        version: '1.2.0',
        path: 'node_modules/@dimjs/request/node_modules/@dimjs/logger/node_modules/@dimjs/request/node_modules/@dimjs/utils',
        dependencies: {},
      },
    ];
    if (!existsSync(join(fixtureCwd, 'package.json'))) {
      writeFileSync(
        join(fixtureCwd, 'package.json'),
        JSON.stringify(
          {
            name: 'test',
            version: '1.0.0',
            dependencies: {
              '@dimjs/utils': '^1.3.0',
              '@dimjs/request': '^1.2.45',
            },
          },
          null,
          2
        ),
        'utf-8'
      );
    }
    for (const dir of dirs) {
      const ensureDir = join(fixtureCwd, dir.path);
      if (!existsSync(ensureDir)) {
        mkdirSync(ensureDir, {
          recursive: true,
        });
      }
      const ensureDirPackageFile = join(ensureDir, 'package.json');
      if (!existsSync(ensureDirPackageFile)) {
        writeFileSync(
          ensureDirPackageFile,
          JSON.stringify(
            {
              name: dir.name,
              version: dir.version,
              dependencies: dir.dependencies,
            },
            null,
            2
          ),
          'utf-8'
        );
      }
    }
  }
  it('illegalInstalledVersionOfModules', async () => {
    makeData();
    const { illegalModules } = await illegalInstalledVersionOfModules(
      ['@dimjs/*'],
      'package.json',
      join(__dirname, 'fixtures-install')
    );
    expect(illegalModules.length).toBe(1);
    expect(illegalModules[0].name).toBe('@dimjs/utils');
    expect(illegalModules[0].data.expectVersion).toBe('^1.3.0');
    expect(illegalModules[0].data.installedVersion).toBe('1.2.0');
    expect(illegalModules[0].data.installedDepGrap).toEqual([
      { name: '@dimjs/request', version: '1.2.45' },
      { name: '@dimjs/logger', version: '1.3.0' },
      { name: '@dimjs/request', version: '1.3.0' },
    ]);
  });

  it('extractInstalledModuleGrap', async () => {
    makeData();
    const { allInstalledModules } = await illegalInstalledVersionOfModules(
      ['@dimjs/utils'],
      'package.json',
      join(__dirname, 'fixtures-install')
    );
    expect(allInstalledModules.length).toBe(2);

    expect(allInstalledModules[0].name).toBe('@dimjs/utils');
    expect(allInstalledModules[0].data.expectVersion).toBe('^1.3.0');
    expect(allInstalledModules[0].data.installedVersion).toBe('1.2.0');
    expect(allInstalledModules[0].data.installedDepGrap).toEqual([
      { name: '@dimjs/request', version: '1.2.45' },
      { name: '@dimjs/logger', version: '1.3.0' },
      { name: '@dimjs/request', version: '1.3.0' },
    ]);

    expect(allInstalledModules[1].name).toBe('@dimjs/utils');
    expect(allInstalledModules[1].data.expectVersion).toBe('^1.3.0');
    expect(allInstalledModules[1].data.installedVersion).toBe('1.3.0');
    expect(allInstalledModules[1].data.installedDepGrap).toEqual([]);
  });

  it('printUnexpectedModules', async () => {
    makeData();
    const { allInstalledModules } = await illegalInstalledVersionOfModules(
      ['@dimjs/utils'],
      'package.json',
      join(__dirname, 'fixtures-install')
    );
    printUnexpectedModules(allInstalledModules);
  });
});
