import AdmZip from 'adm-zip';
import { readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { ensureSlash, isPathMatch } from './file-path.js';
import { fileWalk } from './file-walk.js';
/**
 * Compress the specified list of files and keep the file directory of the ZIP package as the specified relative path
 * Note the jszip depends `dom` to load `lib.dom.d.ts`
 * @param fileNames All files with full path
 * @param saveTo Where will zip save to?
 * @param options Some configurations while ziping.
 */
export const zipFiles = (fileNames, saveZipTo, options) => {
  const admZip = new AdmZip();
  for (const filename of fileNames) {
    const metaName = relative(options.relativePathTo, filename);
    const fileData = readFileSync(filename);
    admZip.addFile(metaName, fileData);
  }
  admZip.writeZip(saveZipTo);
  return saveZipTo;
};
/**
 * Zip matched files into .zip file
 * @param cwd absolute directory path.
 * @param saveTo the directory Where can save it to
 * @param options zip configuration
 */
export const zip = async (cwd, saveTo, options) => {
  const allFiles = await fileWalk(`${ensureSlash(cwd, false)}/**/*.*`);
  await zipFiles(allFiles, saveTo, options);
};
/**
 * Decompress zip files directly to disk
 * @param zipFile The absolute file path for this zip, or zip buffer data.
 * @param extractTo Extracts the specified file to the specified location
 * @param filter Each zip file path should matches all given glob patterns
 */
export const unzip = (
  zipFile,
  extractTo,
  filter = ['!**/__MACOSX/**', '!**/*.DS_Store']
) => {
  // Reading archives
  const zip = new AdmZip(zipFile);
  zip.forEach((zipEntry) => {
    const fileDist = join(extractTo, zipEntry.entryName);
    if (!zipEntry.isDirectory && isPathMatch(fileDist, filter)) {
      zip.extractEntryTo(zipEntry, dirname(fileDist), false, true);
    }
  });
  return extractTo;
};
/**
 * Extract file from zip to Buffer
 * @param zipFileName The absolute file path for this zip.
 * @param zipEntryName `test.txt`
 * @returns Buffer
 */
export const extractFileFromZip = (zipFileName, zipEntryName) => {
  // reading archives
  const zip = new AdmZip(zipFileName);
  return zip.readFile(zipEntryName);
};
