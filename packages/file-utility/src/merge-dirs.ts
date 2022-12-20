import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';

function copyFile(file: string, location: string) {
  mkdirSync(file.split('/').slice(0, -1).join('/'), {
    mode: 0x1ed,
    recursive: true,
  });
  writeFileSync(file, readFileSync(location));
}

export function mergeDirs(
  src: string,
  dest: string,
  conflict: 'skip' | 'overwrite' = 'skip'
) {
  const files = readdirSync(src);

  files.forEach((file) => {
    const srcFile = '' + src + '/' + file;
    const destFile = '' + dest + '/' + file;
    const stats = lstatSync(srcFile);

    if (stats.isDirectory()) {
      mergeDirs(srcFile, destFile, conflict);
    } else {
      if (!existsSync(destFile)) {
        copyFile(destFile, srcFile);
      } else {
        if (conflict === 'overwrite') {
          copyFile(destFile, srcFile);
        } else if (conflict === 'skip') {
          console.log(`${destFile} exists, skipping...`);
        }
      }
    }
  });
}
