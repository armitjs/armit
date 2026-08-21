/**
 * Compare two files base on their computed hash rather than just size or timestamp
 * @param file1 required string path to file 1
 * @param file2 required string path to file 2
 * @param algo option string algorithm for hash computation
 * @returns boolean indicating if compare succeeded
 */
export declare const fileCompare: (file1: string, file2: string, algo: "sha1" | "md5") => Promise<boolean>;
