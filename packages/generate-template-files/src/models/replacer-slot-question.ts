export interface ReplacerSlotQuestion {
  /**
   * The question to ask the use what value should be used for the replacer slot
   */
  readonly question: string;
  /**
   * The string value for the Replacer Slots
   */
  readonly slot: string;
  /**
   * When the question is optional
   */
  readonly optional: boolean;
}

export type QuestionReplacer = string | ReplacerSlotQuestion;
