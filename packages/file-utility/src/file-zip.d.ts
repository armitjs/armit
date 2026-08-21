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
export declare const zipFiles: (fileNames: string[], saveZipTo: string, options: ZipOptions) => string;
/**
 * Zip matched files into .zip file
 * @param cwd absolute directory path.
 * @param saveTo the directory Where can save it to
 * @param options zip configuration
 */
export declare const zip: (cwd: string, saveTo: string, options: ZipOptions) => Promise<void>;
/**
 * Decompress zip files directly to disk
 * @param zipFile The absolute file path for this zip, or zip buffer data.
 * @param extractTo Extracts the specified file to the specified location
 * @param filter Each zip file path should matches all given glob patterns
 */
export declare const unzip: (zipFile: string | Buffer, extractTo: string, filter?: string[]) => string;
/**
 * Extract file from zip to Buffer
 * @param zipFileName The absolute file path for this zip.
 * @param zipEntryName `test.txt`
 * @returns Buffer
 */
export declare const extractFileFromZip: (zipFileName: string, zipEntryName: string) => Buffer<ArrayBufferLike> | null;
