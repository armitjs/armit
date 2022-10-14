import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { getDirname } from '../file/index.js';

/**
 * Method for dynamic creating fixture workspace dir for jest
 * @param url The default should be dynamic `import.meta.url`
 * @param dir The default fixture workspace dir is default: `fixture`
 * @param files ['a/hello.txt', 'b/hello.txt', 'b/world.txt']
 * @param randomContent The random file content
 * @return __dirname
 */
export const ensureFixtureFiles = (
  url: string,
  dir = 'fixture',
  files: string[],
  randomContent = true
) => {
  const fixtureCwd = getDirname(url, dir);
  mkdirSync(fixtureCwd, {
    recursive: true,
  });
  files.forEach((file) => {
    const item = join(fixtureCwd, file);
    mkdirSync(dirname(item), {
      recursive: true,
    });
    writeFileSync(item, randomContent ? 'hello' + Math.random() : 'hello');
  });
  return fixtureCwd;
};
