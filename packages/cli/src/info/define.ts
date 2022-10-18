import { createCommand } from '@armit/common';
import type { InfoCommandArgs } from './handler.js';
import { InfoCommandHandler } from './handler.js';

export const infoCmd = createCommand<InfoCommandArgs>(
  'info',
  {
    command: 'info',
    describe: 'Display armit project details.',
  },
  InfoCommandHandler
);
