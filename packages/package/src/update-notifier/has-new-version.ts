import semver from 'semver';
import { createConfigDir, getLastUpdate, saveLastUpdate } from './cache.js';
import { getDistVersion } from './get-dist-version.js';
import { type PackageUpdate } from './types.js';

export const hasNewVersion = async ({
  pkg,
  updateCheckInterval = 1000 * 60 * 60 * 24,
  distTag = 'latest',
  alwaysRun,
}: PackageUpdate) => {
  createConfigDir();
  const lastUpdateCheck = getLastUpdate(pkg.name);
  if (
    alwaysRun ||
    !lastUpdateCheck ||
    lastUpdateCheck < new Date().getTime() - updateCheckInterval
  ) {
    const latestVersion = await getDistVersion(pkg.name, distTag);
    saveLastUpdate(pkg.name);
    if (latestVersion && semver.gt(latestVersion, pkg.version)) {
      return latestVersion;
    }
  }

  return false;
};
