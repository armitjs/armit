import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { type Index } from 'npm-check-updates/build/src/types/IndexType.js';
import { type PackageFile } from 'npm-check-updates/build/src/types/PackageFile.js';
import { type VersionSpec } from 'npm-check-updates/build/src/types/VersionSpec.js';
import { run } from 'npm-check-updates';
import { projectHasYarn } from '../npm-yarn.js';
import { getNcuConfigFile } from './cache-file.js';
import { type UpdatePackageOptions } from './types.js';

/**
 * Upgrading pacakges using npm installer `npm`
 * @param packages [name@version]
 * @param options installation configurations
 */
export const npmCheckUpdates = (
  options: UpdatePackageOptions
): Promise<PackageFile | Index<VersionSpec> | void> => {
  const cacheFile = getNcuConfigFile();
  if (!existsSync(cacheFile)) {
    mkdirSync(dirname(cacheFile), {
      recursive: true,
    });
  }

  return run({
    // Any command-line option can be specified here.
    // These are set by default:
    dep: 'prod,dev,bundle', // ,peer,optional',
    cwd: options.cwd,
    cache: true,
    cacheFile,
    cacheExpiration: 10,
    deep: true,
    mergeConfig: true,
    filter: options.filter,
    timeout: options.timeout || 30000,
    registry: options.registry,
    reject: options.reject,
    rejectVersion: options.rejectVersion,
    jsonUpgraded: true,
    packageManager: projectHasYarn() ? 'yarn' : 'npm',
    silent: options.silent,
    upgrade: true,
  });
};
