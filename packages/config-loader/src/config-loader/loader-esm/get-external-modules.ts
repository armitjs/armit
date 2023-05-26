import { join } from 'node:path';
import { fileWalk, readJsonFromFile } from '@armit/file-utility';
import { isMonorepo, searchPackageDir } from '@armit/package';
import { type PackageJson } from 'type-fest';

function arrayUnique<T>(arr: T[]): T[] {
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  return arr.filter(onlyUnique);
}

export const getEsmExternalModules = async (
  cwd = process.cwd(),
  externals: string[] = []
) => {
  const projectCwd = searchPackageDir({
    cwd,
  });

  const allPackageJson: string[] = projectCwd
    ? [join(projectCwd, 'package.json')]
    : [];

  const repoCwd = projectCwd ? join(projectCwd, '../..') : projectCwd;
  const isMono = await isMonorepo(repoCwd);
  if (isMono && repoCwd) {
    const monoCwd = join(repoCwd, './packages/*/package.json');
    const monoPackageJson = await fileWalk(monoCwd);
    allPackageJson.push(...monoPackageJson);
  }
  const externalModules: string[] = [...externals];

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
