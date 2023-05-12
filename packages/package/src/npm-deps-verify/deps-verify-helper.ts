import { exec } from 'child_process';
import { join } from 'path';
import { promisify } from 'util';
import { readJsonFromFile } from '@armit/file-utility';
import { lt, prerelease, rcompare, satisfies } from 'semver';
import { type PackageJson } from 'type-fest';
import validatePackageName from 'validate-npm-package-name';
import { chalk } from '../helpers/chalk-color.js';
import { logger } from '../logger.js';

import {
  type PackageStatus,
  type PushPkgsOption,
  type VerifyPackagePattern,
} from './type.js';

export const execAsync = promisify(exec);

export const LOGGER_VERIFY_DEPS_CONTEXT = 'verify-deps';

const red = chalk(['red']);
const green = chalk(['green']);

/**
 * Validates package name.
 *
 * @param name Package name.
 * @throws {Error} - Package name is invalid.
 */
export function isValidNpmPackageName(name: string) {
  const { errors } = validatePackageName(name);
  if (errors) {
    throw new Error(`NPM package name: "${name}" is invalid. ${errors}`);
  }
}

/**
 * Gets available versions for provided package name.
 *
 * @param name Package name.
 * @param registry NPM registry service
 * @returns List of available versions.
 * @throws {Error} - Output failed JSON parse.
 */
export async function getLatestVersions(
  name: string,
  registry: string
): Promise<string[]> {
  isValidNpmPackageName(name);
  try {
    const { stdout } = await execAsync(
      `npm view ${name} versions --json --registry=${registry}`
    );
    const versions = JSON.parse(stdout) as string[] | string;
    return Array.isArray(versions) ? versions : [versions];
  } catch (err) {
    const message =
      err instanceof SyntaxError
        ? `Failed to parse output from NPM view - ${err.toString()}`
        : `Error getting latest versions - ${err}`;
    throw new Error(message);
  }
}

/**
 * Gets latest tag from provided package name.
 *
 * @param name Package name.
 * @param registry NPM registry service
 * @returns Return latest version, if latest tag exists.
 * @throws {Error} - Output failed JSON parse.
 */
export async function getLatestTag(
  name: string,
  registry: string
): Promise<string> {
  isValidNpmPackageName(name);
  try {
    const { stdout } = await execAsync(
      `npm view ${name} dist-tags --json --registry=${registry}`
    );
    const { latest } = JSON.parse(stdout);
    return latest as string;
  } catch (err) {
    const message =
      err instanceof SyntaxError
        ? `Failed to parse output from NPM view - ${err.toString()}`
        : `Error getting latest tag - ${err}`;
    throw new Error(message);
  }
}

/**
 * Finds valid upgrade version of the provided package name.
 *
 * @param name Package name.
 * @param wanted Package version.
 * @param registry NPM registry service
 * @returns Valid upgrade version.
 * @throws {Error} - Outdated version in package.json, version was likely unpublished.
 */
export async function getLatestVersion(
  name: string,
  wanted: string,
  registry: string
) {
  const versions = await getLatestVersions(name, registry);
  const latest = await getLatestTag(name, registry);
  let applicableVersions = versions.filter((i) => satisfies(i, wanted));

  const prereleases: string[] = [];
  if (prerelease(wanted.slice(1))) {
    for (const version of versions) {
      if (prerelease(version)) {
        prereleases.push(version);
      }
    }
    applicableVersions = prereleases.filter((i) => satisfies(i, wanted));
  }

  applicableVersions.sort((a, b) => {
    return rcompare(a, b);
  });

  if (applicableVersions.length === 0) {
    throw new Error(
      `${red(
        `Current version of ${name}:${wanted} seems to be invalid. The version was likely unpublished. Please manually upgrade to a valid version and re-run this application.`
      )}`
    );
  }

  if (
    !prerelease(wanted.slice(1)) &&
    latest &&
    lt(latest, applicableVersions[0])
  ) {
    return latest;
  }
  return applicableVersions[0];
}

/**
 * Gets currently installed version for provided package name.
 *
 * @param currentDir Path to package.json directory.
 * @param name Package name.
 * @param logger Logger flag.
 * @returns Installed version or null if not installed.
 * @throws {Error} - Unable to find installed versions, try installing node modules by running `npm i`.
 */
export function getInstalledVersion(
  currentDir: string,
  name: string
): string | null {
  try {
    const { version } = readJsonFromFile<PackageJson>(
      join(currentDir, 'node_modules', name, 'package.json')
    );
    return version || null;
  } catch (err) {
    logger.info(
      `Error getting a list of installed modules from package.json - ${err}`,
      LOGGER_VERIFY_DEPS_CONTEXT
    );
    return null;
  }
}

/**
 * Verify if current package need to be verify.
 * @param name Package name
 * @param needVerifyPackages verify include regexp pattern
 * @returns
 */
export function isPkgNeedToBeVerify(
  name: string,
  needVerifyPackages: VerifyPackagePattern
): { verify: boolean; newRegistry?: string } {
  const registries = Object.keys(needVerifyPackages);
  for (let index = 0; index < registries.length; index++) {
    const newRegistry = registries[index];
    const regPattern = (needVerifyPackages[newRegistry] || []).filter(Boolean);
    for (let j = 0; j < regPattern.length; j++) {
      const regExp = regPattern[j];
      if (regExp.test(name)) {
        return {
          verify: true,
          newRegistry,
        };
      }
    }
  }
  return {
    verify: false,
  };
}

/**
 * Builds list of packages to update.
 *
 * @param options Object with parameters.
 * @returns NPM package state.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export async function pushPkgs(options: PushPkgsOption) {
  const { dir, deps = {}, type, registry, needVerifyPackages = {} } = options;
  const result: PackageStatus[] = [];
  for (const name of Object.keys(deps)) {
    const { verify, newRegistry } = isPkgNeedToBeVerify(
      name,
      needVerifyPackages
    );
    // If current package is wanted to be verify?
    if (verify) {
      let wanted = deps[name];
      if (!wanted?.startsWith('^')) wanted = `^${wanted}`;
      const installed = getInstalledVersion(dir, name);
      const latest = await getLatestVersion(
        name,
        wanted,
        newRegistry || registry
      );
      const wantedFixed = wanted.slice(1);
      const shouldBeInstalled =
        installed === null || wantedFixed !== installed || installed !== latest;
      if (shouldBeInstalled) {
        const warning =
          installed !== null
            ? `outdated: ${red(
                wantedFixed !== installed ? wantedFixed : installed
              )} → ${green(latest)}`
            : red('not installed');
        logger.info(`${red(name)} is ${warning}`, LOGGER_VERIFY_DEPS_CONTEXT);
      }
      result.push({
        installed,
        latest,
        name,
        shouldBeInstalled,
        type,
        wanted,
        registry: newRegistry || registry,
      });
    }
  }
  return result;
}

/**
 * Formats package name for installation.
 *
 * @param filteredPkgs Package properties
 * @returns Concatenated 'name@latest' for provided package.
 */
export function getPkgIds(filteredPkgs: Array<PackageStatus>) {
  return filteredPkgs.map(({ latest, name }) => `${name}@${latest}`).join(' ');
}
