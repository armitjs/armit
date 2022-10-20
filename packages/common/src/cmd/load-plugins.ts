import { statSync } from 'node:fs';
import path from 'node:path';
import { globbySync } from 'globby';
import mem, { memClear } from 'mem';
import resolve from 'resolve';
import type { CommandModule } from 'yargs';
import { findParentDir } from '../index.js';

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

function partition(array: string[], predicate: (value: string) => boolean) {
  const result: [string[], string[]] = [[], []];

  for (const value of array) {
    result[predicate(value) ? 0 : 1].push(value);
  }

  return result;
}

/**
 * Load plugin from external specificed or auto searched from `pluginSearchDirs`
 * @param plugins The external plugin package names
 * @param pluginPackPattern `['armit-plugin-*\/package.json', '@*\/armit-plugin-*\/package.json', '@armit/plugin-*\/package.json']`
 * @param pluginSearchDirs `The directory search from, it should not include `node_modules`
 * @returns
 */
function load(
  plugins: string[],
  pluginPackPattern: string[],
  pluginSearchDirs?: string[]
) {
  if (!plugins) {
    plugins = [];
  }

  if (!pluginSearchDirs) {
    pluginSearchDirs = [];
  }
  // unless pluginSearchDirs are provided, auto-load plugins from node_modules that are parent to Prettier
  if (pluginSearchDirs.length === 0) {
    const autoLoadDir = findParentDir(__dirname, 'node_modules');
    if (autoLoadDir) {
      pluginSearchDirs = [autoLoadDir];
    }
  }

  const [externalPluginNames, externalPluginInstances] = partition(
    plugins,
    (plugin) => typeof plugin === 'string'
  );

  const externalManualLoadPluginInfos = externalPluginNames.map(
    (pluginName: string) => {
      let requirePath;
      try {
        // try local files
        requirePath = resolve.sync(path.resolve(process.cwd(), pluginName));
      } catch {
        // try node modules
        requirePath = resolve.sync(pluginName, { basedir: process.cwd() });
      }

      return {
        name: pluginName,
        requirePath,
      };
    }
  );

  const externalAutoLoadPluginInfos = pluginSearchDirs.flatMap(
    (pluginSearchDir: string) => {
      const resolvedPluginSearchDir = path.resolve(
        process.cwd(),
        pluginSearchDir
      );

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

  const externalPlugins: CommandModule[] = [
    ...uniqByKey(
      [...externalManualLoadPluginInfos, ...externalAutoLoadPluginInfos],
      'requirePath'
    ).map((externalPluginInfo) => {
      return require(externalPluginInfo.requirePath);
    }),
    ...externalPluginInstances,
  ];

  return [...externalPlugins];
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
