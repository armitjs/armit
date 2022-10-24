import { terminalColor } from '../../index.js';
import type { PackageUpdate } from './has-new-version.js';
import { hasNewVersion } from './has-new-version.js';
import { isNpmOrYarn } from './is-npm-or-yarn.js';

/**
 * Simple update notifier to check for npm updates for cli applications.
 * @returns
 */
export const updateNotifier = async (args: PackageUpdate) => {
  if (!args.alwaysRun && isNpmOrYarn && !args.shouldNotifyInNpmScript) {
    return;
  }
  try {
    const latestVersion = await hasNewVersion(args);
    if (latestVersion) {
      console.log(
        terminalColor(
          ['bold', 'cyan'],
          args.noColor
        )(
          `New version of ${terminalColor(
            ['bold', 'magenta'],
            args.noColor
          )(args.pkg.name)} available!`
        )
      );
      console.log(
        `Current Version: ${terminalColor(
          ['bold', 'magenta'],
          args.noColor
        )(args.pkg.version)}`
      );
      console.log(
        `Latest Version : ${terminalColor(
          ['bold', 'magenta'],
          args.noColor
        )(latestVersion)}`
      );
    }
  } catch (err) {
    // Catch any network errors or cache writing errors so module doesn't cause a crash
  }
};
