import type { Replacer } from './replacer.js';

/**
 * Below is an example of what you receive from the onComplete callback.
 * It has the output path, list of files created and the Replacer Slots with the value entered.
 * @example
 * ```json
 * {
 *   output: {
 *     path: './src/stores/some-thing',
 *     files: [
 *       './src/stores/some-thing/SomeThingModule.ts',
 *       './src/stores/some-thing/SomeThingModuleAction.ts',
 *       './src/stores/some-thing/SomeThingModuleGetter.ts',
 *       './src/stores/some-thing/SomeThingModuleMutation.ts',
 *       './src/stores/some-thing/SomeThingService.ts',
 *       './src/stores/some-thing/models/actions/ISomeThingState.ts',
 *       './src/stores/some-thing/models/actions/OtherThingResponseModel.ts'
 *     ]
 *   },
 *   stringReplacers: [
 *     {
 *       slot: '__store__',
 *       slotValue: 'some thing'
 *     },
 *     {
 *        slot: '__model__',
 *        slotValue: 'other thing'
 *     }
 *   ]
 * }
 *```
 */
export interface Results {
  readonly output: {
    /**
     * The file(s) output path
     */
    readonly path: string;
    /**
     * - List of files created
     */
    readonly files: string[];
  };
  /**
   *  List of Replacer Slots; name and values entered during the setup process
   */
  readonly stringReplacers: Replacer[];
}
