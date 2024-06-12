import { join } from 'node:path';
import { type PackageJson } from 'type-fest';
import { fileWalk, readJsonFromFile } from '@armit/file-utility';
import { isMonorepo } from './helpers/is-mono-repo.js';
import { searchPackageDir } from './package-search.js';

function arrayUnique<T>(arr: T[]): T[] {
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  return arr.filter(onlyUnique);
}

export const getPackageDependencyKeys = async (
  cwd = process.cwd(),
  externals: Array<RegExp | string> = []
) => {
  const projectCwd =
    searchPackageDir({
      cwd,
    }) || process.cwd();

  const allPackageJson: string[] = projectCwd
    ? [join(projectCwd, 'package.json')]
    : [];

  const repoCwd = join(projectCwd, '../..');
  const isMono = await isMonorepo(repoCwd);
  if (isMono) {
    const monoCwd = join(repoCwd, './packages/*/package.json');
    const monoPackageJson = await fileWalk(monoCwd);
    allPackageJson.push(...monoPackageJson);
  }
  const externalModules: Array<RegExp | string> = [...externals];

  for (const packageJson of allPackageJson) {
    const pkgJson = readJsonFromFile<PackageJson>(packageJson);
    externalModules.push(
      ...Object.keys({
        ...pkgJson.dependencies,
        ...pkgJson.devDependencies,
      })
    );
  }
  return arrayUnique(externalModules);
};
