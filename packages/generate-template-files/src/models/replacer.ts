/**
 * Dynamic Replacer Slots
 * If you have data that is dynamically generated, or you have hard coded values you can use the dynamicReplacers
 */
export interface Replacer {
  /**
   * @example `__description__`
   */
  readonly slot: string;
  /**
   * @example `config.description`
   */
  readonly slotValue: string;
}
