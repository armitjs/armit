import boxen from 'boxen';
import C from 'picocolors';
import { logger } from '../logger.js';
import {
  isGlobalYarnOrNpm,
  isYarnGlobal,
  projectHasYarn,
} from '../npm-yarn.js';
import { hasNewVersion } from './has-new-version.js';
import { isNpmOrYarn } from './is-npm-or-yarn.js';
import { type PackageUpdate } from './types.js';
/**
 * Simple update notifier to check for npm updates for cli applications.
 * @returns
 */
export const updateNotifier = async (args: PackageUpdate) => {
  if (!args.alwaysRun && isNpmOrYarn && !args.shouldNotifyInNpmScript) {
    return;
  }
  try {
    let installCommand = '';
    if (isYarnGlobal()) {
      installCommand = `yarn global add ${args.pkg.name}`;
    } else if (isGlobalYarnOrNpm()) {
      installCommand = `npm i -g ${args.pkg.name}`;
    } else if (projectHasYarn()) {
      installCommand = `yarn add ${args.pkg.name}`;
    } else {
      installCommand = `npm i ${args.pkg.name}`;
    }

    const latestVersion = await hasNewVersion(args);
    if (latestVersion) {
      const notifyTemplate =
        'Update available ' +
        C.dim(args.pkg.version) +
        C.reset(' → ') +
        C.green(latestVersion) +
        ' \nRun ' +
        C.cyan(installCommand) +
        ' to update';

      console.log(
        boxen(notifyTemplate, {
          padding: 1,
          margin: 1,
          textAlignment: 'center',
          borderColor: 'yellow',
          borderStyle: 'round',
        })
      );
    }
  } catch (err) {
    logger.error(err);
    // Catch any network errors or cache writing errors so module doesn't cause a crash
  }
};
