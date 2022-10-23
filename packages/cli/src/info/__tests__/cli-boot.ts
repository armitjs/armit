import { createCli, getDirname, getPackageData } from '@armit/common';
import { infoCmd } from '../index.js';

// __dirname
const curDirName = getDirname(import.meta.url);

// Read cli package json data.
const packageJson = getPackageData({
  cwd: curDirName,
});

void createCli({
  group: '@armit',
  packageJson,
  exitProcess: false,
})
  .register(infoCmd)
  .parse(process.argv.slice(2));
