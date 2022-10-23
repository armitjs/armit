import { join, relative } from 'path';
import type { CommandArgv } from '@armit/common';
import {
  terminalColor,
  fileWalk,
  zipFiles,
  AbstractHandler,
} from '@armit/common';
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
    const fileFromTo = join(this.args.cwd, this.args.to);
    const zipFileName = join(
      fileFromTo,
      `${(this.cliPackageJson?.name || 'unknow').replace(
        /\//g,
        '-'
      )}-${Date.now()}.zip`
    );
    await zipFiles(allFiles, zipFileName, {
      relativePathTo: fileFromCwd,
    });
  }
}
