import { join, relative } from 'path';
import type { CommandArgv } from '@armit/common';
import {
  terminalColor,
  fileWalk,
  getPackageData,
  zipFiles,
  AbstractHandler,
} from '@armit/common';

export type PackCommandArgs = CommandArgv<{
  /**
   * the filter pattern using globby (fast-glob)
   * multiple pattern separated using `;`
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
   * the base relative path will be ignore related to process.cwd()
   * @alias -e
   * @default `public`
   */
  basePath: string;

  /**
   * the directory where the zip will save to
   * it's relative to process.cwd()
   * @alias -t
   * @default `packages`
   */
  to: string;
}>;

export class PackCommand extends AbstractHandler<PackCommandArgs> {
  async handle() {
    return this.prepareZip();
  }

  private async prepareZip() {
    const fileFromCwd = join(process.cwd(), this.args.basePath);
    const allFiles = await fileWalk(this.args.filter, {
      cwd: fileFromCwd,
      ignore: this.args.ignore,
    });
    if (!allFiles.length) {
      this.logger.warn('No matched files found');
    } else {
      console.info(terminalColor(['green'])('✔ All ziped files'));
      allFiles.forEach((file) => {
        console.info(
          `${terminalColor(['cyan'])(' ➩ ')}${terminalColor(['magenta'])(
            relative(fileFromCwd, file)
          )}`
        );
      });
      console.info(' ');
      await this.toZip(allFiles, fileFromCwd);
    }
  }

  async toZip(allFiles: string[], fileFromCwd: string): Promise<void> {
    const cwdPkgJson = getPackageData({
      cwd: process.cwd(),
    });
    const fileFromTo = join(process.cwd(), this.args.to);
    const zipFileName = join(
      fileFromTo,
      `${(cwdPkgJson?.name || 'unknow').replace(/\//g, '-')}-${Date.now()}.zip`
    );
    await zipFiles(allFiles, zipFileName, {
      relativePathTo: fileFromCwd,
    });
  }
}
