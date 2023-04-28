import {
  type PackageGraph,
  type PackageItem,
  type VersionDepsGraph,
} from './types.js';

function recursiveModuleVersionGraph(
  moduleName: string,
  dependencies: Record<string, PackageGraph> = {},
  cachePath: Map<string, PackageItem[]> = new Map<string, PackageItem[]>(),
  finalVersion: Array<VersionDepsGraph> = []
): Array<VersionDepsGraph> {
  for (const [key, value] of Object.entries(dependencies)) {
    const oldDep = cachePath.get(moduleName) || [];
    // copy `oldDep`
    const newDep = new Map<string, PackageItem[]>().set(moduleName, oldDep);

    if (moduleName === key) {
      // re-instance new Map to store current dependent chain
      const lineCachePath: VersionDepsGraph = {
        version: value.version,
        depsGraph: [...oldDep],
      };
      finalVersion.push(lineCachePath);
    } else {
      // Add new dep layer to `newDep`
      newDep.set(moduleName, [
        ...oldDep,
        {
          name: key,
          version: value.version,
        },
      ]);
      if (value.dependencies && Object.keys(value.dependencies).length) {
        // Using `newDep` as start of recursive tree
        recursiveModuleVersionGraph(
          moduleName,
          value.dependencies,
          newDep,
          finalVersion
        );
      }
    }
  }
  return finalVersion;
}

/**
 * 根据特定的包模块名称, 寻找当前CWD下根依赖, 以及其他包间接对此模块的依赖关系列表
 * @param moduleName 指定的模块名称`@dimjs/utils`
 * @param dependencies `npm ls @dimjs/utils --json=true` 列出来的依赖json graph
 * @returns
 */
export function extractModuleVersionGraph(
  moduleName: string,
  dependencies: Record<string, PackageGraph> = {}
) {
  return recursiveModuleVersionGraph(moduleName, dependencies);
}
