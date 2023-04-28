import { type Index } from 'npm-check-updates/build/src/types/IndexType.js';
import { type PackageFile } from 'npm-check-updates/build/src/types/PackageFile.js';
import { type VersionSpec } from 'npm-check-updates/build/src/types/VersionSpec.js';
import { run } from 'npm-check-updates';

export interface UpdatePackageOptions {
  /**
   * child process work directory.
   */
  cwd: string;
  /**
   * package file location (default: ./package.json)
   * @default `./package.json`
   */
  packageFile?: string;

  /**
   * Exclude packages matching the given string, wildcard, glob, comma-or-space-delimited list, or /regex/.
   */
  reject?: string | string[] | RegExp;

  /**
   * Exclude package.json versions using comma-or-space-delimited list, or /regex/.
   */
  rejectVersion?: string | string[] | RegExp;
  /**
   * Third-party npm registry.
   */
  registry?: string;
  /**
   * Global timeout in milliseconds.
   * @default 30000
   */
  timeout?: number;
  /**
   * nclude only package names matching the given string,
   * comma-or-space-delimited list, or /regex/
   * @example filter = /^@flatjs/
   */
  filter?: string | RegExp;
}

/**
 * Upgrading pacakges using npm installer `npm`
 * @param packages [name@version]
 * @param options installation configurations
 */
export const npmCheckUpdates = (
  options: UpdatePackageOptions
): Promise<PackageFile | Index<VersionSpec> | void> => {
  return run({
    // Any command-line option can be specified here.
    // These are set by default:
    dep: 'prod,dev,bundle,peer,optional',
    cwd: options.cwd,
    filter: options.filter,
    timeout: options.timeout || 30000,
    registry: options.registry,
    packageFile: options.packageFile,
    reject: options.reject,
    rejectVersion: options.rejectVersion,
    jsonUpgraded: true,
    packageManager: 'npm',
    silent: true,
    upgrade: true,
  });
};
