import { globbySync } from 'globby';
import memoize, { memoizeClear } from 'memoize';
import { statSync } from 'node:fs';
import path, { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import resolve from 'resolve';
import type { CommandModule } from 'yargs';
import { searchParentDir } from '@armit/package';
import { type PluginConfig } from './define-plugin.js';

const memoizedLoad = memoize(load, { cacheKey: JSON.stringify });
const memoizedSearch = memoize(findPluginsInNodeModules);
const getDirname = (url: string, subDir = '') => {
  return join(dirname(fileURLToPath(url)), subDir);
};

type PluginItem = {
  name: string;
  requirePath: string;
};

function uniqByKey(array: PluginItem[], key: string) {
  const result: Array<PluginItem> = [];
  const seen = new Set();

  for (const element of array) {
    const value = element[key];
    if (!seen.has(value)) {
      seen.add(value);
      result.push(element);
    }
  }

  return result;
}

/**
 * Load plugin from external specificed or auto searched from `pluginSearchDirs`
 * @param plugins The manual load external plugin package names
 * @param pluginPackPattern `['armit-plugin-*\/package.json', '@*\/armit-plugin-*\/package.json', '@armit/plugin-*\/package.json']`
 * @param pluginSearchDirs `The directory search from, it should not include `node_modules`
 * @param cwd The directory to begin resolving from
 * @returns
 */
async function load(
  plugins: string[] = [],
  pluginPackPattern: string[] = [],
  pluginSearchDirs: string[] = [],
  cwd: string = process.cwd()
): Promise<
  Array<{
    name: string;
    plugin: CommandModule;
  }>
> {
  // unless pluginSearchDirs are provided, auto-load plugins from node_modules that are parent to `commander`
  if (pluginSearchDirs.length === 0) {
    const autoLoadDir = searchParentDir(
      getDirname(import.meta.url),
      'node_modules'
    );
    if (autoLoadDir) {
      pluginSearchDirs = [autoLoadDir];
    }
  }

  const externalPluginNames = plugins.filter(
    (plugin) => typeof plugin === 'string'
  );

  const externalManualLoadPluginInfos = externalPluginNames
    .map((pluginName: string) => {
      let requirePath;
      try {
        // try local files
        requirePath = resolve.sync(path.resolve(cwd, pluginName));
      } catch {
        try {
          // try node modules
          requirePath = resolve.sync(pluginName, { basedir: cwd });
        } catch {
          return undefined;
        }
      }
      return {
        name: pluginName,
        requirePath,
      };
    })
    .filter(Boolean) as Array<PluginItem>;

  const externalAutoLoadPluginInfos = pluginSearchDirs.flatMap(
    (pluginSearchDir: string) => {
      const resolvedPluginSearchDir = path.resolve(cwd, pluginSearchDir);

      const nodeModulesDir = path.resolve(
        resolvedPluginSearchDir,
        'node_modules'
      );

      // In some fringe cases (ex: files "mounted" as virtual directories), the
      // isDirectory(resolvedPluginSearchDir) check might be false even though
      // the node_modules actually exists.
      if (
        !isDirectory(nodeModulesDir) &&
        !isDirectory(resolvedPluginSearchDir)
      ) {
        throw new Error(
          `${pluginSearchDir} does not exist or is not a directory`
        );
      }

      return memoizedSearch(nodeModulesDir, pluginPackPattern).map(
        (pluginName) => {
          // pluginName : `armit-cli-plugin-a`, `@armit/cli-plugin-b`
          return {
            name: pluginName,
            requirePath: resolve.sync(pluginName, {
              basedir: resolvedPluginSearchDir,
            }),
          };
        }
      );
    }
  );

  const externalPlugins = [
    ...uniqByKey(
      [...externalManualLoadPluginInfos, ...externalAutoLoadPluginInfos],
      'requirePath'
    ),
  ];

  const allPlugins: Array<{
    name: string;
    plugin: CommandModule;
  }> = [];
  for (const pluginInfo of externalPlugins) {
    const requirePath = pathToFileURL(pluginInfo.requirePath).href;
    const importModule = await import(requirePath);
    const pluginModule = importModule.default || importModule;
    for (const [pluginAlias, plugin] of Object.entries(pluginModule)) {
      const pluginDefine = plugin as PluginConfig;
      const pluginName = pluginDefine.name || pluginInfo.name;
      const pluginCommandModule = pluginDefine.commandModule;
      // Make sure that we have a plugin name and command module
      if (pluginName && pluginCommandModule) {
        if (allPlugins.find((s) => s.name === pluginName)) {
          console.warn(
            `${pluginAlias}:${pluginName} has been loaded, duplicate plug-ins are defined? `
          );
        } else {
          allPlugins.push({
            name: pluginName,
            plugin: pluginCommandModule,
          });
        }
      }
    }
  }
  return allPlugins;
}
/**
 * Find plugins in node_mdoules
 * @param nodeModulesDir directory of search for plugin
 * @param pluginPackPattern ['@*\/armit-cli-plugin-*\/package.json','armit-cli-plugin-*\/package.json', '@armit/cli-plugin-*\/package.json']
 * @returns
 */
function findPluginsInNodeModules(
  nodeModulesDir: string,
  pluginPackPattern: string[]
) {
  const pluginPackageJsonPaths = globbySync(pluginPackPattern, {
    cwd: nodeModulesDir,
    expandDirectories: false,
  });
  return pluginPackageJsonPaths.map((pluginPath) => {
    return path.dirname(pluginPath);
  });
}

function isDirectory(dir) {
  try {
    return statSync(dir).isDirectory();
  } catch {
    return false;
  }
}

export const clearCache = () => {
  memoizeClear(memoizedLoad);
  memoizeClear(memoizedSearch);
};

export const loadCliPlugins = memoizedLoad;
