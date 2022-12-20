import { createCli } from '@armit/commander';
import { getDirname } from '@armit/file-utility';
import { readPackageData } from '@armit/package';
import { infoCmd } from '../index.js';

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
  .register(infoCmd)
  .parse(process.argv.slice(2));
