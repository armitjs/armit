import type { CaseConverterEnum } from '../constants/case-converter-enum.js';
import type { QuestionReplacer } from './replacer-slot-question.js';
import type { Replacer } from './replacer.js';
import type { Results } from './results.js';

/**
 * ```json
 * {
 *     option: 'Create Redux Store',
 *     defaultCase: '(pascalCase)',
 *     entry: {
 *         folderPath: './tools/templates/react/redux-store/',
 *     },
 *     promptReplacers: ['__store__', '__model__'],
 *     output: {
 *         path: './src/stores/__store__(lowerCase)',
 *         pathAndFileNameDefaultCase: '(kebabCase)',
 *     },
 *     onComplete: (results) => {
 *         console.log(`results`, results);
 *     },
 * }
 * ```
 */
export interface ConfigItem {
  /**
   * The name of the option to choose when asked
   *
   * ```
   * option: 'Some Option Name',
   * ```
   */
  option: string;
  /**
   * The default [Case Converters](#case-converters) to use with the [Replacer Slots](#replacer-slots) in the template files or path/file name. Default is `(noCase)`.
   *
   * ```
   * defaultCase: '(pascalCase)',
   * ```
   */
  defaultCase: CaseConverterEnum;
  /**
   * ```
   * entry: {
   *     folderPath: './folder/to/templates/',
   * },
   * ```
   */
  entry: {
    /**
     * Path to a folder of files or a single template file.
     */
    folderPath: string;
  };
  /**
   * An array of Replacer Slots used to replace content in the designated entry.folderPath.
   * ```
   * promptReplacers: ['__store__', '__model__'],
   * ```
   */
  promptReplacers?: QuestionReplacer[];
  /**
   * (Optional) An array of Replacer used to replace content in the designated entry.folderPath.
   * ```
   * dynamicReplacers: [{slot:'__description__', slotValue: config.description}],
   * ```
   */
  dynamicReplacers?: Replacer[];
  /**
   * ```
   * output: {
   *     path: './src/stores/__store__(lowerCase)',
   *     pathAndFileNameDefaultCase: '(kebabCase)',
   * },
   * ```
   */
  output: {
    /**
     * The desired output path for generated files.
     * Case Converters and Replacer Slots can be used to make the path somewhat dynamic.
     */
    path:
      | string
      | ((
          outputPathReplacers: Replacer[],
          selectedConfigItem: ConfigItem
        ) => string);
    /**
     * The Case Converters to use for the file path and file name(s).
     */
    pathAndFileNameDefaultCase?: CaseConverterEnum;
    /**
     * Tetermines if existing files with the same name be over written.
     */
    overwrite?: boolean;
  };
  /**
   * Takes a callback function that is called once the file(s) have been outputted.
   * A Results object will be passed to the callback.
   * ```
   * onComplete: (results) => {
   *     console.log(`results`, results);
   * },
   * ```
   */
  onComplete?: (results: Results) => void;
}
