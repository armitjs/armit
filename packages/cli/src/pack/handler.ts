import { join, relative } from 'path';
import type { CommandArgv } from '@armit/commander';
import { AbstractHandler } from '@armit/commander';
import { fileWalk, zipFiles } from '@armit/file-utility';
import { readPackageData } from '@armit/package';
import { terminalColor } from '@armit/terminal';
import { normalizeOptionSemicolonParts } from '../utils/index.js';

export type PackCommandArgs = CommandArgv<{
  /**
   * The filter pattern using globby (fast-glob)
   * multiple pattern separated using semicolon `;`
   * @alias -f
   * @default [`**`]
   */
  filter: string[];

  /**
   * Reverse pattern will removed matched files from `filter`
   * @default [`**\/*.{png,jpg,jpeg,gif,svg}`]
   */
  ignore: string[];

  /**
   * The base relative path will be ignore related to process.cwd()
   * @alias -e
   * @default `public`
   */
  basePath: string;

  /**
   * The directory where the zip will save to
   * it's relative to process.cwd()
   * @alias -t
   * @default `packages`
   */
  to: string;

  /**
   * The directory to start searching from.
   * @default process.cwd()
   */
  cwd: string;
}>;

export class PackCommand extends AbstractHandler<PackCommandArgs> {
  async handle() {
    return this.prepareZip();
  }

  private async prepareZip() {
    const fileFromCwd = join(this.args.cwd, this.args.basePath);
    const pattern = normalizeOptionSemicolonParts(this.args.filter);
    const allFiles = await fileWalk(pattern, {
      cwd: fileFromCwd,
      ignore: this.args.ignore,
    });
    if (!allFiles.length) {
      this.logger.warn('No matched files found');
    } else {
      console.info(
        terminalColor(['green'], this.args.noColor)('✔ All ziped files')
      );
      allFiles.forEach((file) => {
        console.info(
          `${terminalColor(['cyan'], this.args.noColor)(' ➩ ')}${terminalColor(
            ['magenta'],
            this.args.noColor
          )(relative(fileFromCwd, file))}`
        );
      });
      console.info(' ');
      await this.toZip(allFiles, fileFromCwd);
    }
  }

  async toZip(allFiles: string[], fileFromCwd: string): Promise<void> {
    const fileFromTo = join(this.args.cwd, this.args.to);
    // Try to read target project package.json.
    const targetPackageJson = readPackageData({
      cwd: this.args.cwd,
    });
    const zipFileName = join(
      fileFromTo,
      `${(targetPackageJson?.name || 'unknow').replace(
        /\//g,
        '-'
      )}-${Date.now()}.zip`
    );
    await zipFiles(allFiles, zipFileName, {
      relativePathTo: fileFromCwd,
    });
  }
}
