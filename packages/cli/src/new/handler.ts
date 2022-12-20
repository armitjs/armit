import type { CommandArgv } from '@armit/commander';
import { AbstractHandler } from '@armit/commander';

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
