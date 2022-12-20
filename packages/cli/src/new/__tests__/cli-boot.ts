import { createCli } from '@armit/commander';
import { getDirname } from '@armit/file-utility';
import { readPackageData } from '@armit/package';
import { newCmd } from '../index.js';

// __dirname
const curDirName = getDirname(import.meta.url);

// Read cli package json data.
const packageJson = readPackageData({
  cwd: curDirName,
});

void createCli({
  group: '@armit',
  packageJson,
  exitProcess: false,
})
  .register(newCmd)
  .parse(process.argv.slice(2));
