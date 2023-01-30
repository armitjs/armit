import type { CommandArgv } from '@armit/commander';
import { AbstractHandler } from '@armit/commander';
import { terminalColor } from '@armit/terminal';

export type NewCommandArgs = CommandArgv;

export class NewCommandHandler extends AbstractHandler<NewCommandArgs> {
  async handle() {
    console.log(
      terminalColor(
        ['magenta', 'bold'],
        this.args.noColor
      )(`  CLI tool for armitjs applications`)
    );
  }
}
