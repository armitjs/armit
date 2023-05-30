import os from 'node:os';
import path from 'node:path';

const homeDirectory = os.homedir();

const configDir =
  process.env.XDG_CONFIG_HOME ||
  path.join(homeDirectory, '.config', 'armit-npm-check-update');

export const getNcuConfigFile = (packageName = 'ncu-cache') => {
  return path.join(configDir, `${packageName}.json`);
};
