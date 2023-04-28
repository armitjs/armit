import { join } from 'path';
import { readJsonFromFile } from '@armit/file-utility';
import hasYarn from 'has-yarn';
import { type PackageJson } from 'type-fest';
import { chalk, groupBy } from '../helpers/index.js';
import { isMonorepo } from '../helpers/is-mono-repo.js';
import { logger } from '../logger.js';
import {
  LOGGER_VERIFY_DEPS_CONTEXT,
  execAsync,
  getPkgIds,
  pushPkgs,
} from './deps-verify-helper.js';
import { type PackageVerifyDeps, type VerifyDepsOption } from './type.js';

/**
 * Verifies the dependencies listed in the package.json of the given directory.
 *
 * @param options Optional parameters.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export async function verifyDeps(options: VerifyDepsOption) {
  const {
    dir = '',
    autoUpgrade = false,
    needVerifyPackages = {},
    registry = 'https://registry.npmjs.org',
  } = options;

  const { dependencies = {}, devDependencies = {} } =
    readJsonFromFile<PackageJson>(join(dir, 'package.json'));

  logger.info(
    chalk(['blue'])('Verifying dependencies…\n'),
    LOGGER_VERIFY_DEPS_CONTEXT
  );

  const prodPkgs = await pushPkgs({
    deps: dependencies,
    dir,
    type: 'prod',
    registry,
    needVerifyPackages,
  });

  const devPkgs = await pushPkgs({
    deps: devDependencies,
    dir,
    type: 'dev',
    registry,
    needVerifyPackages,
  });

  const pkgs = [...prodPkgs, ...devPkgs];

  const toInstall = pkgs.filter(({ shouldBeInstalled }) => shouldBeInstalled);
  if (toInstall.length > 0) {
    const registries = groupBy(toInstall, (pkg) => pkg.registry);
    if (autoUpgrade) {
      logger.info('UPGRADING…', LOGGER_VERIFY_DEPS_CONTEXT);
    }
    for (const [registry, toInstallOfRegistry] of registries.entries()) {
      const prodPkgs = toInstallOfRegistry.filter(
        ({ type }) => type === 'prod'
      );
      let upgradePackages = '';
      const cmd = hasYarn(dir) ? 'yarn add' : 'npm i';
      if (prodPkgs.length > 0) {
        upgradePackages += `${cmd} ${getPkgIds(
          prodPkgs
        )} --registry=${registry}`;
      }
      const devPkgs = toInstallOfRegistry.filter(({ type }) => type === 'dev');
      if (devPkgs.length > 0) {
        upgradePackages += `\n${cmd} -D ${getPkgIds(
          devPkgs
        )} --registry=${registry}`;
      }
      if (autoUpgrade) {
        try {
          logger.info(upgradePackages);
          if (prodPkgs.length) {
            const prodResult = await execAsync(
              `${cmd} ${getPkgIds(prodPkgs)} --registry=${registry}`
            );
            logger.info(
              `${chalk(['green', 'bold'])(
                `${'Upgraded dependencies:\n'}${prodResult.stdout}`
              )}`,
              LOGGER_VERIFY_DEPS_CONTEXT
            );
          }
          if (devPkgs.length) {
            const devResult = await execAsync(
              `${cmd} ${getPkgIds(devPkgs)} --registry=${registry}`
            );
            logger.info(
              `${chalk(['green', 'bold'])(
                `${'Upgraded development dependencies:\n'}${devResult.stdout}`
              )}`,
              LOGGER_VERIFY_DEPS_CONTEXT
            );
          }
        } catch (err) {
          logger.error(`autoUpgrade err ${err}`, LOGGER_VERIFY_DEPS_CONTEXT);
        }
      } else {
        logger.info(
          `\n${chalk(['bold'])('To resolve this, run:')}`,
          LOGGER_VERIFY_DEPS_CONTEXT
        );
        logger.info(upgradePackages);
        throw new Error(
          chalk(['red'])('Please update your installed modules.')
        );
      }
    }
  } else {
    logger.info(
      chalk(['green'])('All NPM modules are up to date.'),
      LOGGER_VERIFY_DEPS_CONTEXT
    );
  }
}

export const verifyPackageDeps = (options: PackageVerifyDeps) => {
  return verifyDeps({
    dir: options.cwd,
    autoUpgrade: options.autoUpgrade,
    needVerifyPackages: options.needVerifyPackages || {},
  });
};

/**
 * Verifies the dependencies listed in the package.json of the given directory.
 * ignored `monorepo`
 * @param options
 */
export const keepPackageDepsUpToDateForNonMonoRepo = async (
  options: PackageVerifyDeps
) => {
  // Verify current project if is monorepo
  const monoRepo = await isMonorepo(options.cwd);
  if (!monoRepo) {
    try {
      // Verify package depenencies only for non `monorepo` project.
      await verifyPackageDeps({
        cwd: options.cwd,
        autoUpgrade: options.autoUpgrade,
        needVerifyPackages: options.needVerifyPackages || {},
      });
    } catch (err) {
      logger.error(
        `keepPackageDepsUpToDateForNonMonoRepo err: ${err}`,
        LOGGER_VERIFY_DEPS_CONTEXT
      );
    }
  }
};
