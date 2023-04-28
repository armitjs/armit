import { execa } from 'execa';
import { arrayUnique } from '../helpers/index.js';
import { logger } from '../logger.js';
import { extractModuleVersionGraph } from './extract-module-version-graph.js';
import { type PackageGraphRoot, type VersionDepsGraph } from './types.js';

/**
 * Try list all install package modules metadata
 * @param modules The modules we need to care
 * @param cwd Where we can search start from
 * @returns The version dependency graph of each package module.
 *
 * @example
 * ```
 * // For module: `@dimjs/utils`
 * Map<`@dimjs/utils`, [
 *    { version: `1.2.44`, depsGraph: [ { name: '@semic/admin-ui', version: '1.0.14' },{ name: '@semic/layout', version: '1.0.13' }]},
 *    { version: `1.2.33`, depsGraph: [ { name: '@semic/admin-ui', version: '1.0.14' },{ name: '@wove/react', version: '1.2.23' }]}
 * ]>
 * ```
 */
export async function metadataOfInstalledModules(
  modules: string[],
  cwd = process.cwd()
) {
  const metadata = new Map<string, Array<VersionDepsGraph>>();
  const uniqueModules = arrayUnique<string>(modules);
  if (uniqueModules.length) {
    const lsModules = uniqueModules.join(' ');
    try {
      const metaJson = await execa(`npm ls ${lsModules} --json=true`, [], {
        preferLocal: true,
        cwd: cwd,
        localDir: cwd,
        stdio: 'pipe',
        shell: true,
      });
      const depGraph: PackageGraphRoot = JSON.parse(metaJson.stdout);
      for (const moduleName of uniqueModules) {
        metadata.set(
          moduleName,
          extractModuleVersionGraph(moduleName, depGraph.dependencies)
        );
      }
    } catch (err) {
      logger.error(err, 'metadataOfInstalledModules()');
    }
  }
  return metadata;
}
