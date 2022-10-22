import { createCommand } from '@armit/common';
import type { PackCommandArgs } from './handler.js';
import { PackCommand } from './handler.js';

export const packCmd = createCommand<PackCommandArgs>(
  'pack',
  {
    command: 'pack',
    describe: 'Extract filtered files compress to zip file.',
    builder(args) {
      return args
        .example(
          `$0 pack -f="a;b;c" -f="a"`,
          'Using `fast-glob` to filter files to zip'
        )
        .option('filter', {
          alias: 'f',
          type: 'array',
          default: ['**'],
          describe: 'Filter matched files that will be packed',
        })
        .option('ignore', {
          alias: 'i',
          type: 'array',
          default: ['**/*.{png,jpg,jpeg,gif,svg}'],
          describe: 'Ignore pattern will removed matched files from `filter`',
        })
        .option('basePath', {
          alias: 'b',
          type: 'string',
          default: 'public',
          describe: 'The path that will be ignored relative to `cwd()`',
        })
        .option('to', {
          alias: 't',
          type: 'string',
          default: 'packages',
          describe:
            'The directory where zip file saved to, it relative to `cwd()`',
        });
    },
  },
  PackCommand
);
