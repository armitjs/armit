import { join } from 'node:path';
import type { CliMain, CliOption } from '@armit/common';
import {
  getDirname,
  createCli,
  findParentDir,
  loadPlugins,
  updateNotifier,
  getPackageData,
} from '@armit/common';
import { infoCmd } from '../info/define.js';
import { packCmd } from '../pack/define.js';

export async function bootstrap(
  options: Partial<CliOption> = {}
): Promise<CliMain> {
  // __dirname
  const curDirName = getDirname(import.meta.url);

  // Read cli package json data.
  const packageJson = getPackageData({
    cwd: curDirName,
  });

  if (packageJson) {
    // Check if newer cli version here.
    await updateNotifier({
      pkg: {
        name: packageJson?.name || '',
        version: packageJson?.version || '',
      },
      shouldNotifyInNpmScript: true,
    });
  }

  const armitDir = findParentDir(curDirName, '@armit') || '';

  // Load all available cli plugins
  const externalPlugins = await loadPlugins(
    [],
    ['@armit/cli-plugin-*/package.json', 'armit-cli-plugin-*/package.json'],
    [process.cwd(), join(armitDir, '../')]
  );

  // Register built-in commands.
  const armitCli = createCli({
    group: '@armit',
    packageJson,
    ...options,
  })
    .register(infoCmd)
    .register(packCmd);

  // Register external plugins.
  for (const { plugin } of externalPlugins) {
    if (plugin) {
      armitCli.register(plugin);
    }
  }
  return armitCli;
}
