import { platform, release } from 'os';
import type { CommandArgv } from '@armit/commander';
import { AbstractHandler } from '@armit/commander';
import { showBanner } from '@armit/terminal';
import osName from 'os-name';

export type InfoCommandArgs = CommandArgv;

interface ProjectDependency {
  name: string;
  version: string;
  latestVersion?: string;
}

export class InfoCommandHandler extends AbstractHandler<InfoCommandArgs> {
  async handle() {
    await showBanner(`armit`, {
      align: 'left',
      gradient: 'red,blue',
      letterSpacing: 3,
    });
    console.log(
      this.logger.chalk(
        ['magenta', 'bold'],
        `  CLI tool for armitjs applications`
      )
    );
    this.displaySystemInformation();
  }

  private displaySystemInformation() {
    console.info('');
    console.info(this.logger.chalk(['green'], '  ✔ System Information'));
    console.info(
      '   OS Version     :',
      this.logger.chalk(['magenta'], ` ${osName(platform(), release())}`)
    );
    console.info(
      '   NodeJS Version :',
      this.logger.chalk(['magenta'], ` ${process.version}`)
    );
    this.displayCliVersion();
    this.displayArmitInformation();
  }

  private displayArmitInformation() {
    console.info(
      this.logger.chalk(['green'], '  ✔ @armit Platform Information')
    );
    try {
      this.displayArmitVersions();
    } catch {
      console.error(
        this.logger.chalk(
          ['red'],
          `  😼  cannot read your project package.json file, are you inside your project directory?`
        )
      );
    }
  }

  private displayArmitVersions() {
    if (this.cliPackageJson) {
      const dependencies: Record<string, unknown> = Object.assign(
        {},
        this.cliPackageJson.dependencies,
        this.cliPackageJson.devDependencies,
        this.cliPackageJson.peerDependencies
      );
      const armitDependencies = this.collectNestDependencies(dependencies);
      this.dependencyformat(armitDependencies).forEach((dependency) =>
        console.info(
          '   ' + dependency.name,
          this.logger.chalk(['magenta'], `${dependency.version}`)
        )
      );
      console.info(' ');
    }
  }

  private collectNestDependencies(dependencies: Record<string, unknown>) {
    const armitDependencies: Array<ProjectDependency> = [];
    Object.keys(dependencies).forEach((key) => {
      if (key.includes('@armit')) {
        armitDependencies.push({
          name: `${key.replace(/@armit\//, '')} ➞ version`,
          version: dependencies[key] as string,
        });
      }
    });
    return armitDependencies;
  }

  private displayCliVersion() {
    if (this.cliPackageJson) {
      console.info('');
      console.info(this.logger.chalk(['green'], '  ✔ @armit CLI'));
      console.info(
        '   @armit CLI Version :',
        this.logger.chalk(['magenta'], `${this.cliPackageJson.version || ''}`),
        '\n'
      );
    }
  }

  private dependencyformat(dependencies: ProjectDependency[]) {
    const sorted = dependencies.sort(
      (dependencyA, dependencyB) =>
        dependencyB.name.length - dependencyA.name.length
    );
    // Maybe dependencies is an empty array.
    const length = sorted[0]?.name?.length;
    sorted.forEach((dependency) => {
      if (dependency.name.length < length) {
        dependency.name = this.rightPad(dependency.name, length);
      }
      dependency.name = dependency.name.concat(' :');
      dependency.version = dependency.version.replace(/\^|~/, '');
    });
    return sorted;
  }

  private rightPad(name: string, length: number) {
    while (name.length < length) {
      name = name.concat(' ');
    }
    return name;
  }
}
