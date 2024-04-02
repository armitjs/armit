import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileWalk } from '@armit/file-utility';
import { cosmiconfig } from 'cosmiconfig';
import { run } from 'npm-check-updates';
import { projectHasYarn } from '../npm-yarn.js';
import { getNcuConfigFile } from './cache-file.js';
import { type UpdatePackageOptions } from './types.js';

/**
 * Upgrading pacakges using npm installer `npm`
 * @param packages [name@version]
 * @param options installation configurations
 */
export const npmCheckUpdates = async (options: UpdatePackageOptions) => {
  const cacheFile = getNcuConfigFile();
  if (!existsSync(cacheFile)) {
    mkdirSync(dirname(cacheFile), {
      recursive: true,
    });
  }

  const packageFiles = options.packageFiles || [
    './package.json',
    './packages/*/package.json',
  ];

  const rootCwd = options.cwd || process.cwd();
  const explorer = cosmiconfig('ncu', {
    searchPlaces: ['package.json', `.ncurc`, `.ncurc.json`, `.ncurc.yaml`],
  });

  const rootConfig = await explorer.search(rootCwd).then((result) => {
    return result;
  });

  const { dep, reject } = rootConfig?.config || {};

  const projects = await fileWalk(packageFiles, {
    cwd: rootCwd,
  });

  for (const project of projects) {
    const projectCwd = dirname(project);
    if (existsSync(projectCwd)) {
      // TODO: need to read project `.ncurc.json`
      await runNcuUpdate(
        {
          ...options,
          dep: options.dep || dep,
          reject: options.reject || reject,
          cwd: projectCwd,
        },
        cacheFile
      );
    }
  }
};

async function runNcuUpdate(options: UpdatePackageOptions, cacheFile: string) {
  return await run({
    // Any command-line option can be specified here.
    // These are set by default:
    dep: options.dep || ['prod', 'dev', 'optional'],
    cwd: options.cwd,
    cache: true,
    cacheFile,
    cacheExpiration: 20,
    deep: false,
    mergeConfig: false,
    filter: options.filter,
    timeout: options.timeout || 30000,
    registry: options.registry,
    reject: options.reject,
    rejectVersion: options.rejectVersion,
    jsonUpgraded: false,
    packageManager: projectHasYarn() ? 'yarn' : 'npm',
    silent: options.silent,
    upgrade: true,
  });
}
