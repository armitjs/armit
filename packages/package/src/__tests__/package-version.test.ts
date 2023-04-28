import semver from 'semver';
import semverRegex from 'semver-regex';
import { getPackageLatestVersion } from '../package-version.js';

describe('get package latest version', () => {
  let logSpy;
  beforeEach(() => {
    logSpy = vi.spyOn(global.console, 'log').mockImplementation(() => true);
  });
  afterEach(() => {
    logSpy.mockRestore();
  });
  describe('package-helper.ts', () => {
    it('latest version', async () => {
      const vesion = await getPackageLatestVersion('ava');
      expect(vesion).toMatch(semverRegex());
    });

    it('latest version with version', async () => {
      const vesion = semver.satisfies(
        await getPackageLatestVersion('package-json', { version: '0' }),
        '0.x'
      );
      expect(vesion).toBe(true);
    });

    it('latest version with dist-tag', async () => {
      const vesion = semver.satisfies(
        await getPackageLatestVersion('npm', { version: 'latest-5' }),
        '5.x'
      );
      expect(vesion).toBe(true);
    });

    it('latest version scoped', async () => {
      const vesion = await getPackageLatestVersion('@sindresorhus/df');
      expect(vesion).toMatch(semverRegex());
    });
  });
});
