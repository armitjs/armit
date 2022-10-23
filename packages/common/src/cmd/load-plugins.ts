import { statSync } from 'node:fs';
import path from 'node:path';
import { globbySync } from 'globby';
import mem, { memClear } from 'mem';
import resolve from 'resolve';
import type { CommandModule } from 'yargs';
import { findParentDir, getDirname } from '../index.js';

const memoizedLoad = mem(load, { cacheKey: JSON.stringify });
const memoizedSearch = mem(findPluginsInNodeModules);

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
  // unless pluginSearchDirs are provided, auto-load plugins from node_modules that are parent to Prettier
  if (pluginSearchDirs.length === 0) {
    const autoLoadDir = findParentDir(
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
      } catch (err) {
        try {
          // try node modules
          requirePath = resolve.sync(pluginName, { basedir: cwd });
        } catch (err) {
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
    const importModule = await import(pluginInfo.requirePath);
    allPlugins.push({
      name: pluginInfo.name,
      plugin: importModule.default || importModule,
    });
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
  memClear(memoizedLoad);
  memClear(memoizedSearch);
};

export const loadPlugins = memoizedLoad;
