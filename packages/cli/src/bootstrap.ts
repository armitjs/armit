import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CliOption } from '@armit/common';
import {
  createCli,
  findParentDir,
  loadPlugins,
  updateNotifier,
  getPackageData,
} from '@armit/common';
import { infoCmd } from './info/define.js';
import { packCmd } from './pack/define.js';

export const bootstrap = async (options?: Partial<CliOption>) => {
  // Read cli package json data.
  const packageJson = getPackageData();

  if (packageJson) {
    // Check if newer cli version here.
    updateNotifier({
      pkg: {
        name: packageJson?.name || '',
        version: packageJson?.version || '',
      },
    });
  }

  // __dirname
  const curDirName = dirname(fileURLToPath(import.meta.url));

  // Load all available cli plugins
  const externalPlugins = await loadPlugins(
    [],
    ['@armit/cli-plugin-*/package.json', 'armit-cli-plugin-*/package.json'],
    [process.cwd(), join(findParentDir(curDirName, '@armit'), '../')]
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
};
