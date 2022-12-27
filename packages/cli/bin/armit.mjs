#!/usr/bin/env node

import { getDirname } from '@armit/file-utility';
import { terminalColor } from '@armit/terminal';
import importLocal from 'import-local';
import { bootstrap } from '../index.js';

if (importLocal(getDirname(import.meta.url))) {
  console.log(
    `Using local version of ${(terminalColor['green']('@armit/cli'), false)}`
  );
} else {
  bootstrap().then((cli) => {
    cli.parse(process.argv.slice(2));
  });
}
