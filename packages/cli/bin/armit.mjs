#!/usr/bin/env node

import { terminalColor, getDirname } from '@armit/common';
import importLocal from 'import-local';
import { bootstrap } from '../index.js';

if (importLocal(getDirname(import.meta.url))) {
  console.log(`Using local version of ${terminalColor['green']('@armit/cli')}`);
} else {
  bootstrap().then((cli) => {
    cli.parse(process.argv.slice(2));
  });
}
