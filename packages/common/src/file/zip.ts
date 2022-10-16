import { readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import AdmZip from 'adm-zip';
import { fileWalk } from './file-walk.js';
import { ensureSlash, isPathMatch } from './path.js';

export interface ZipOptions {
  /**
   * e.g. `/Users/Documents/xxxx`
   */
  relativePathTo: string;
}

/**
 * Compress the specified list of files and keep the file directory of the ZIP package as the specified relative path
 * Note the jszip depends `dom` to load `lib.dom.d.ts`
 * @param fileNames All files with full path
 * @param saveTo Where will zip save to?
 * @param options Some configurations while ziping.
 */
export const zipFiles = (
  fileNames: string[],
  saveZipTo: string,
  options: ZipOptions
) => {
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
export const zip = async (
  cwd: string,
  saveTo: string,
  options: ZipOptions
): Promise<void> => {
  const allFiles = await fileWalk(`${ensureSlash(cwd, false)}/**/*.*`);
  await zipFiles(allFiles, saveTo, options);
};

/**
 * Decompress zip files directly to disk
 * @param zipFileName The absolute file path for this zip.
 * @param extractTo Extracts the specified file to the specified location
 * @param filter Each zip file path should matches all given glob patterns
 */
export const unzip = (
  zipFileName: string,
  extractTo: string,
  filter: string[] = ['!**/__MACOSX/**', '!**/*.DS_Store']
) => {
  // Reading archives
  const zip = new AdmZip(zipFileName);

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
export const extractFileFromZip = (
  zipFileName: string,
  zipEntryName: string
) => {
  // reading archives
  const zip = new AdmZip(zipFileName);
  return zip.readFile(zipEntryName);
};
