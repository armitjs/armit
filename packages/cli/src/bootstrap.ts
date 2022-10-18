import { join } from 'node:path';
import type { CliOption } from '@armit/common';
import {
  createCli,
  findParentDir,
  loadPlugins,
  updateCheck,
  getPackageData,
} from '@armit/common';
import { infoCmd } from './info/define.js';
import { packCmd } from './pack/define.js';

export const bootstrap = (options?: Partial<CliOption>) => {
  // Read cli package json data.
  const packageJson = getPackageData();

  // Check if newer cli version here.
  updateCheck(packageJson);

  // Load all available cli plugins
  const externalPlugins = loadPlugins(
    [],
    ['@armit/cli-plugin-*/package.json', 'armit-cli-plugin-*/package.json'],
    [process.cwd(), join(findParentDir(__dirname, '@armit'), '../')]
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
  externalPlugins.forEach((plugin) => {
    if (plugin) {
      armitCli.register(plugin);
    }
  });
  return armitCli;
};
