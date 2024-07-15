import { type CommandModule } from 'yargs';

export type PluginConfig = {
  /**
   * The plugin name, Optional, fallback to name of package.json
   */
  name?: string;
  /**
   * The plugin command definition.
   */

  commandModule: CommandModule<any, any>;
};

/**
 * For now we could need to AVOID use `export default` to export an plugin
 * it seems that using dynamic `import(filename)` will always return `[Module: null prototype] {}` with empty.
 * ```ts
 * // below is wrong
 * export default definePlugin({});
 * // below is correct, `myPlugin` can be any name you want
 * // we can also export multi plugin in one module
 * export const myPlugin = definePlugin({
 *    name:'',
 *    commandModule: ?
 * });
 * ```
 * @param config
 * @returns
 */
export const definePlugin = (config: PluginConfig) => config;
