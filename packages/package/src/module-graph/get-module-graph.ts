import dependencyTree, { type Options, type Tree } from 'dependency-tree';

/**
 * @example
 * ```ts
 * {
 * '/Users/mrjoelkemp/Documents/node-dependency-tree/test/example/extended/a.js': {
 *   '/Users/mrjoelkemp/Documents/node-dependency-tree/test/example/extended/b.js': {
 *     '/Users/mrjoelkemp/Documents/node-dependency-tree/test/example/extended/d.js': {},
 *     '/Users/mrjoelkemp/Documents/node-dependency-tree/test/example/extended/e.js': {}
 *   },
 *   '/Users/mrjoelkemp/Documents/node-dependency-tree/test/example/extended/c.js': {
 *     '/Users/mrjoelkemp/Documents/node-dependency-tree/test/example/extended/f.js': {},
 *     '/Users/mrjoelkemp/Documents/node-dependency-tree/test/example/extended/g.js': {}
 *   }
 * }
 * ```
 */
function flatTreeDepsKeys(depTree: Tree, tree: Set<string>): string[] {
  const keys = Object.keys(depTree);
  for (const key of keys) {
    if (!tree.has(key)) {
      tree.add(key);
    }
    const childDepTree = depTree[key];
    if (childDepTree && Object.keys(childDepTree).length > 0) {
      flatTreeDepsKeys(childDepTree, tree);
    }
  }
  return Array.from(tree.values());
}

/**
 * Recursively find all dependencies (avoiding circular) traversing the entire dependency tree
 * and returns a flat list of all unique, visited nodes
 * @param modulePath The path of the module whose tree to traverse
 * @param projectCwd The directory containing all JS files
 * @param filter A function used to determine if a module (and its subtree) should be included in the dependency tree
 */
export const getModuleGraph = (config: Options) => {
  const { filter, ...rest } = config;

  const options: Options = {
    ...rest,
    filter(modulePath) {
      const isMatch = !modulePath.includes('node_modules');
      if (isMatch) {
        return filter ? filter(modulePath) : true;
      }
      return false;
    },
  };
  const depTree = dependencyTree(options);
  return flatTreeDepsKeys(depTree, new Set<string>());
};
