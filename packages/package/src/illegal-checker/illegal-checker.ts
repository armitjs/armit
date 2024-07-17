import table from 'as-table';
import ora from 'ora';
import semver from 'semver';
import { chalk } from '../helpers/chalk-color.js';
import { logger } from '../logger.js';
import { fetchTestModules } from './fetch-test-modules.js';
import { metadataOfInstalledModules } from './metadata-of-installed-modules.js';
import { type DetectedRiskInstallPackageItem } from './types.js';

/**
 * Detect locally installed dependencies that have correctly installed from `package.json` declared version `dependencies`
 * @param modules The modules we want to detect, module name, or module expression. [`^babel-`,`@armit/*`]
 * @param packageFile Where we can found the `package.json`
 * @param cwd The workspace default process.cwd()
 */
export const illegalInstalledVersionOfModules = async (
  modules: string[] = [],
  packageFile = 'package.json',
  cwd = process.cwd()
): Promise<{
  illegalModules: DetectedRiskInstallPackageItem[];
  allInstalledModules: DetectedRiskInstallPackageItem[];
}> => {
  const testModules = fetchTestModules(modules, packageFile, cwd);
  const testModuleNames: string[] = testModules.map((s) => s.name);
  const installedMetadata = await metadataOfInstalledModules(
    testModuleNames,
    cwd
  );
  const illegalModules: Array<DetectedRiskInstallPackageItem> = [];
  const allInstalledModules: Array<DetectedRiskInstallPackageItem> = [];

  for (const testModule of testModules) {
    const installedGraphs = installedMetadata.get(testModule.name);
    if (!installedGraphs) {
      // No this module installed in local.
      illegalModules.push({
        name: testModule.name,
        data: {
          expectVersion: testModule.version,
          installedVersion: '',
          installedDepGrap: [],
        },
      });
    } else {
      for (const grapItem of installedGraphs) {
        // Save all detected graph map.
        allInstalledModules.push({
          name: testModule.name,
          data: {
            expectVersion: testModule.version,
            installedVersion: grapItem.version,
            installedDepGrap: grapItem.depsGraph,
          },
        });

        // Note: `testModule.version` can be a `range` verison
        const versionSatisfies = semverTest(
          grapItem.version,
          testModule.version
        );
        // No matched version / no correct install expected version
        if (!versionSatisfies) {
          illegalModules.push({
            name: testModule.name,
            data: {
              expectVersion: testModule.version,
              installedVersion: grapItem.version,
              installedDepGrap: grapItem.depsGraph,
            },
          });
        }
      }
    }
  }
  return {
    illegalModules,
    allInstalledModules,
  };
};

export const printUnexpectedModules = (
  riskModules: DetectedRiskInstallPackageItem[],
  level: 'error' | 'warn' = 'error'
) => {
  if (!riskModules.length) {
    return;
  }
  const tableRows = riskModules.map((s) => {
    const { expectVersion, installedVersion, installedDepGrap } = s.data;
    return [
      s.name,
      expectVersion,
      semverTest(installedVersion, expectVersion)
        ? installedVersion
        : chalk(['red'])(installedVersion),
      installedDepGrap
        .map((s) => `${s.name}@${s.version}`)
        .join(chalk(['cyan', 'bold'])(' ⇨ ')),
    ];
  });

  const asTable = table.configure({
    title: (x) => chalk(['cyan'])(x),
    delimiter: chalk(['dim', 'cyan'])(' | '),
  });

  tableRows.unshift([
    chalk(['yellow', 'bold'])('Name'),
    chalk(['yellow', 'bold'])('ExpectVersion'),
    chalk(['yellow', 'bold'])('InstalledVersion'),
    chalk(['yellow', 'bold'])('DepGraph'),
  ]);
  const riskAsATable = asTable(tableRows);
  if (level === 'error') {
    logger.error(`\n${riskAsATable}\n`);
  } else {
    logger.warn(`\n${riskAsATable}\n`);
  }
};

/**
 * A method to simply check if we installed version satisfies constraint `declare` of package.json
 * @param current 1.7.2 with any `range` modifier, `^1.7.2` is not correct.
 * @param expectedRange `^1.7.2`、`1.7.2`
 * @returns
 */
export const semverTest = (current: string, expectedRange: string) => {
  return semver.satisfies(current, expectedRange);
};
/**
 * Package checker.
 * @param modules The modules we want to detect
 * @param packageFile Where we can found the `package.json`
 * @param cwd The workspace default process.cwd()
 */
export const illegalPackageChecker = async (
  options: {
    modules?: string[];
    packageFile?: string;
    cwd?: string;
    throwError?: boolean;
    showAllInstalledGraph?: boolean;
  } = {
    modules: [],
    packageFile: 'package.json',
    cwd: process.cwd(),
    throwError: false,
    showAllInstalledGraph: false,
  }
) => {
  // check illegal Installed VersionOfModules
  const { modules, packageFile, cwd, throwError, showAllInstalledGraph } =
    options;
  const spinner = ora(`Checking illegal installed modules...`).start();

  const { allInstalledModules, illegalModules } =
    await illegalInstalledVersionOfModules(modules, packageFile, cwd);

  // 如果存在异常模块
  if (!illegalModules.length) {
    spinner.succeed();
    return;
  } else {
    spinner.fail();
  }

  printUnexpectedModules(illegalModules, 'error');

  if (showAllInstalledGraph) {
    logger.info('Extracting local installed module graph...');
    printUnexpectedModules(allInstalledModules, 'warn');
  }

  if (throwError && illegalModules.length) {
    throw new Error('Has illegal installed modules');
  }
};
