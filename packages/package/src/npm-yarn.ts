import hasYarn from 'has-yarn';
import installedGlobally from 'is-installed-globally';
import { isNpm, isNpmOrYarn, isYarn } from 'is-npm';
import yarnGlobal from 'is-yarn-global';
/**
 * Check if installed by yarn globally without any `fs` calls
 * @returns
 */
export const isYarnGlobal = () => {
  return yarnGlobal();
};

/**
 * Check if your package was installed globally, npm / yarn
 * @returns
 */
export const isGlobalYarnOrNpm = () => {
  return installedGlobally;
};

/**
 * Check if a project is using Yarn, It checks if a yarn.lock file is present in the working directory.
 * Useful for tools that needs to know whether to use yarn or npm to install dependencies.
 * @returns
 */
export const projectHasYarn = () => {
  return hasYarn();
};

/**
 * Check if your code is running as an npm or yarn script
 * @exmaple
 * ```sh
 * $ node foo.js
 * # ┌─────────────┬────────┐
 * # │   (index)   │ Values │
 * # ├─────────────┼────────┤
 * # │ isNpmOrYarn │ false  │
 * # │    isNpm    │ false  │
 * # │   isYarn    │ false  │
 * # └─────────────┴────────┘
 * $ npm run foo
 * # ┌─────────────┬────────┐
 * # │   (index)   │ Values │
 * # ├─────────────┼────────┤
 * # │ isNpmOrYarn │  true  │
 * # │    isNpm    │  true  │
 * # │   isYarn    │ false  │
 * # └─────────────┴────────┘
 * $ yarn run foo
 * # ┌─────────────┬────────┐
 * # │   (index)   │ Values │
 * # ├─────────────┼────────┤
 * # │ isNpmOrYarn │  true  │
 * # │    isNpm    │ false  │
 * # │   isYarn    │  true  │
 * # └─────────────┴────────┘
 * ```
 * @returns
 */
export const runingNpmOrYarn = () => {
  return {
    isNpmOrYarn,
    isNpm,
    isYarn,
  };
};
