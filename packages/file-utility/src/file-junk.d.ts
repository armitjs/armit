/**
 * Returns true if filename matches a junk file.
 * @param filename normally it should be path.basename()
 * @returns
 */
export declare const isJunkFile: (filename: string) => boolean;
/**
 * Returns true if filename does not match a junk file.
 * @param filename normally it should be path.basename()
 * @returns
 */
export declare const isNotJunkFile: (filename: string) => boolean;
