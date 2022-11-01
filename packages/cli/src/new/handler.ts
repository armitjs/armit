import type { CommandArgv } from '@armit/common';
import { AbstractHandler } from '@armit/common';

export type NewCommandArgs = CommandArgv;

export class NewCommandHandler extends AbstractHandler<NewCommandArgs> {
  async handle() {
    console.log(
      this.logger.chalk(
        ['magenta', 'bold'],
        `  CLI tool for armitjs applications`
      )
    );
  }
}
