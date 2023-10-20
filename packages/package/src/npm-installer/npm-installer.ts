import { join } from 'path';
import { execa } from 'execa';
import npmLinked from 'npm-list-linked';
import ora from 'ora';
import pic from 'picocolors';
import { arrayUnique } from '../helpers/array-unique.js';
import { logger } from '../logger.js';
import { runingNpmOrYarn } from '../npm-yarn.js';

export interface InstallPackageOptions {
  /**
   * child process work directory.
   */
  cwd: string;
  /**
   * Now support npm/yarn
   */
  installer?: 'npm' | 'yarn';
  /**
   * --no-save : Prevents saving to dependencies
   * @default undefined
   */
  noSave?: boolean;
}

/**
 * Simply exec `npm i` in specificed work directory.
 * @param cwd the work directory default is process.cwd()
 */
export const execNpmInstaller = (cwd: string): Promise<boolean> => {
  return execa('npm', ['install'], { cwd }).then(() => {
    return true;
  });
};

/**
 * Returns a list of the listed packages in the directory
 * @param {String[]} [cwd] Node modules directories - Defaults to process directory
 * @returns [ '@flatjs/common', '@flatjs/mock' ]
 */
export const getLocalNpmLinkPackages = (cwds: string[]): string[] => {
  let npmLinks: string[] = [];
  for (const cwd of cwds) {
    // For npm@7 maybe it linked packages in process.cwd() while `workspace` configuration
    const cwdLinks = npmLinked.getLinked(join(cwd, 'node_modules')) as string[];
    npmLinks = npmLinks.concat(cwdLinks);
  }
  return arrayUnique(npmLinks);
};

/**
 * To guarantee the production-like installation of your dependency, install-local uses npm pack and npm install <tarball file> under the hood. This is as close as production-like as it gets.
 * https://github.com/nicojs/node-install-local
 * @param pkgs package dependencies ['../sibling-dependency', '../sibling-dependency2']
 */
export const installPackageLocally = async (
  workCwd: string,
  pkgs: string[]
): Promise<number> => {
  // dargs Reverse minimist. Convert an object of options into an array of command-line arguments.
  if (!pkgs.length) {
    return 0;
  }
  logger.info(pkgs, `installPackageLocally`);
  const spinner = ora(`Installing packages locally...`).start();
  try {
    await execa('install-local', pkgs, {
      cwd: workCwd,
      localDir: workCwd,
      preferLocal: true,
      stdio: 'ignore',
    });
    spinner.succeed();
  } catch {
    spinner.fail();
  }
  return pkgs.length;
};

/**
 * Install pacakges using npm installer `npm`
 * @param packages [name@version]
 * @param options installation configurations
 */
export const installPackages = (
  packages: string[],
  options: Omit<InstallPackageOptions, 'noSave'>
): Promise<boolean> => {
  if (!packages.length) {
    return Promise.resolve(true);
  }
  const { cwd } = options;
  const { isYarn } = runingNpmOrYarn();
  const installer = options.installer
    ? options.installer
    : isYarn
    ? 'yarn'
    : 'npm';

  const useYarn = installer === 'yarn';

  logger.info(packages, `installPackages`);
  const npmArgs = [useYarn ? 'add' : 'install']
    .concat(packages)
    .filter(Boolean);

  const spinner = ora(`Installing using ${pic.green(installer)} ...`).start();
  return execa(installer, npmArgs, { cwd })
    .then((output) => {
      spinner.succeed();
      logger.debug(output.stdout, `installPackages`);
      logger.debug(output.stderr, `installPackages`);
      return true;
    })
    .catch((err) => {
      spinner.fail();
      throw err;
    });
};

/**
 * Install package into dependencies.
 * @param saveDependencies the updated packages
 * @param options installation configuration
 */
export const installDependencies = (
  saveDependencies: string[],
  options: InstallPackageOptions
): Promise<boolean> => {
  const isNpm = options.installer === 'npm';
  if (options.noSave === true && isNpm) {
    saveDependencies.unshift('--no-save');
  } else if (saveDependencies.length && isNpm) {
    saveDependencies.unshift('--save');
  }
  return installPackages(saveDependencies, options);
};

/**
 * Install package into devDependencies.
 * @param saveDependencies the updated packages
 * @param options installation configuration
 */
export const installDevDependencies = (
  saveDevDependencies: string[],
  options: InstallPackageOptions
): Promise<boolean> => {
  const isNpm = options.installer === 'npm';
  if (options.noSave === true && isNpm) {
    saveDevDependencies.unshift('--no-save');
  } else if (saveDevDependencies.length) {
    saveDevDependencies.unshift(isNpm ? '--save-dev' : '--dev');
  }
  return installPackages(saveDevDependencies, options);
};
