import { createCommand } from '@armit/common';
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
