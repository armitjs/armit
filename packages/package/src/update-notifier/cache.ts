import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path, { dirname } from 'node:path';

const homeDirectory = os.homedir();

const configDir =
  process.env.XDG_CONFIG_HOME ||
  path.join(homeDirectory, '.config', 'armit-update-notifier');

export const getConfigFile = (packageName: string) => {
  return path.join(configDir, `${packageName}.json`);
};

export const createConfigDir = () => {
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
};

export const getLastUpdate = (packageName: string) => {
  const configFile = getConfigFile(packageName);

  try {
    if (!existsSync(configFile)) {
      return undefined;
    }
    const file = JSON.parse(readFileSync(configFile, 'utf8'));
    return file.lastUpdateCheck as number;
  } catch {
    return undefined;
  }
};

export const saveLastUpdate = (packageName: string) => {
  const configFile = getConfigFile(packageName);
  mkdirSync(dirname(configFile), {
    recursive: true,
  });
  writeFileSync(
    configFile,
    JSON.stringify({ lastUpdateCheck: new Date().getTime() })
  );
};
