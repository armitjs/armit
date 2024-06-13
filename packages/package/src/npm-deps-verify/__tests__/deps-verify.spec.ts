import { groupBy } from '../../helpers/array-group.js';
import { isPkgNeedToBeVerify } from '../deps-verify-helper.js';
import { type PackageStatus } from '../type.js';

describe('@flatjs/common/helper/package/verify-deps', () => {
  describe('package-verify-deps.ts', () => {
    it('isPkgNeedToBeVerify()', () => {
      const pckages = {
        'https://registry.npmjs.org': [/@flatjs\/cli/, /@flatjs\/evolve/],
        'https://registry.npm.taobao.org': [
          /@flatjs\/common/,
          /@flatjs\/sculpt/,
          /@flatjs\/*/,
        ],
      };
      const results: Array<[string, boolean, string]> = [
        ['@flatjs/cli', true, 'https://registry.npmjs.org'],
        ['@flatjs/evolve', true, 'https://registry.npmjs.org'],
        ['@flatjs/common', true, 'https://registry.npm.taobao.org'],
        ['@flatjs/sculpt', true, 'https://registry.npm.taobao.org'],
        ['@flatjs/forge', true, 'https://registry.npm.taobao.org'],
      ];
      for (const [nameTo, verifyTo, registryTo] of results) {
        const { newRegistry, verify } = isPkgNeedToBeVerify(nameTo, pckages);
        expect(verify).toBe(verifyTo);
        expect(newRegistry).toBe(registryTo);
      }
    });

    it('groupBy package status', () => {
      const toInstall: PackageStatus[] = [
        {
          installed: null,
          latest: '',
          name: '@flatjs/cli',
          shouldBeInstalled: true,
          type: 'dev',
          wanted: '1.0.1',
          registry: 'https://registry.npm.taobao.org',
        },
        {
          installed: null,
          latest: '',
          name: '@flatjs/common',
          shouldBeInstalled: true,
          type: 'dev',
          wanted: '1.0.1',
          registry: 'https://registry.npm.taobao.org',
        },
        {
          installed: null,
          latest: '',
          name: '@flatjs/forge',
          shouldBeInstalled: true,
          type: 'prod',
          wanted: '1.0.1',
          registry: 'https://registry.npm.taobao.org',
        },
        {
          installed: null,
          latest: '',
          name: '@flatjs/cli2',
          shouldBeInstalled: true,
          type: 'dev',
          wanted: '1.0.1',
          registry: 'https://registry.npmjs.org',
        },
        {
          installed: null,
          latest: '',
          name: '@flatjs/common2',
          shouldBeInstalled: true,
          type: 'dev',
          wanted: '1.0.1',
          registry: 'https://registry.npmjs.org',
        },
        {
          installed: null,
          latest: '',
          name: '@flatjs/forge2',
          shouldBeInstalled: true,
          type: 'prod',
          wanted: '1.0.1',
          registry: 'https://registry.npmjs.org',
        },
      ];
      const registries = groupBy(toInstall, (pkg) => pkg.registry);
      for (const [registry, toInstallOfRegistry] of registries.entries()) {
        if (registry === 'https://registry.npmjs.org') {
          expect(toInstallOfRegistry.length).toBe(3);
        } else {
          expect(toInstallOfRegistry.length).toBe(3);
        }
      }
    });
  });
});
