import { isJunk, isNotJunk } from 'junk';
/**
 * Returns true if filename matches a junk file.
 * @param filename normally it should be path.basename()
 * @returns
 */
export const isJunkFile = (filename) => {
  return isJunk(filename);
};
/**
 * Returns true if filename does not match a junk file.
 * @param filename normally it should be path.basename()
 * @returns
 */
export const isNotJunkFile = (filename) => {
  return isNotJunk(filename);
};
