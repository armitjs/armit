import { createCommand } from '@armit/commander';
import type { NewCommandArgs } from './handler.js';
import { NewCommandHandler } from './handler.js';

export const newCmd = createCommand<NewCommandArgs>(
  'new',
  {
    command: 'new',
    describe: 'Create armit project.',
  },
  NewCommandHandler
);
