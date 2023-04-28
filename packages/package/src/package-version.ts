import packageJson from 'package-json';
import { logger } from './logger.js';

/**
 * Get the latest version of an npm package
 * Package version such as `1.0.0` or a [dist tag](https://docs.npmjs.com/cli/dist-tag) such as `latest`.
 * The version can also be in any format supported by the [semver](https://github.com/npm/node-semver) module. For example:
 *	- `1` - Get the latest `1.x.x`
 *	- `1.2` - Get the latest `1.2.x`
 *	- `^1.2.3` - Get the latest `1.x.x` but at least `1.2.3`
 *	- `~1.2.3` - Get the latest `1.2.x` but at least `1.2.3`
 * * @example
 * ```
 *  Also works with semver ranges and dist-tags
 *  latestVersion('npm', {version: 'latest-5'}));
 * ```
 * @param packageName the name of the package
 * @param version default { version:'latest' } the configuration of `package-json`
 */
export function getPackageLatestVersion(
  packageName: string,
  option = { version: 'latest' }
): Promise<string> {
  return packageJson(packageName, option)
    .then((rawData) => {
      return rawData.version as string;
    })
    .catch((err) => {
      logger.error(
        new Error(`Registry error ${String(err.message)}`),
        'getPackageLatestVersion'
      );
      return '';
    });
}
