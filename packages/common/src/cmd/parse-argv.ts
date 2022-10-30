import yargs from 'yargs';

/**
 * Parse command line script
 * @example
 * ```
 * ./generate.js create-reduce-action __store__=some-name __model__=some-other-name --outputpath=./src/here --overwrite
 *
 *  {
 *   _: [
 *     'create-reduce-action',
 *     '__store__=some-name',
 *     '__model__=some-other-name'
 *   ],
 *   outputpath: './src/here',
 *   overwrite: true,
 * }
 * ```
 * @param cwd
 * @returns
 */
export const parseArgv = async (cwd?: string) => {
  return await yargs(process.argv.slice(2), cwd).parse();
};
