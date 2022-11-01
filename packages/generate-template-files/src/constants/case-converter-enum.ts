/**
 * Case Converters, transform the string value entered upon use of the generator.
 * @example
 * 1. In the generator template __replacerSlot__ is appended by the (pascalCase) converter such as __replacerSlot__(pascalCase).
 * 2. When the generator is ran, the string "product reducer" is provided for __replacerSlot__.
 * 3. As a result, the converter will produce ProductReducer.
 * Here is the string Lives down BY the River with each of the converters:
 *
 * ```
 * // If you typed in 'Lives down BY the River' for the a Replacer Slot named '__replacerSlot__' and
 * // used one of the optional Case Converters you would get the following:
 *
 * __replacerSlot__(noCase;)       // Lives down BY the River
 * __replacerSlot__(camelCase);    // livesDownByTheRiver
 * __replacerSlot__(constantCase); // LIVES_DOWN_BY_THE_RIVER
 * __replacerSlot__(dotCase);      // lives.down.by.the.river
 * __replacerSlot__(kebabCase);    // lives-down-by-the-river
 * __replacerSlot__(lowerCase);    // livesdownbytheriver
 * __replacerSlot__(pascalCase);   // LivesDownByTheRiver
 * __replacerSlot__(pathCase);     // lives/down/by/the/river
 * __replacerSlot__(sentenceCase); // Lives down by the river
 * __replacerSlot__(snakeCase);    // lives_down_by_the_river
 * __replacerSlot__(titleCase);    // Lives Down By The River
 *
 * // Note: you can set a 'defaultCase' converter in IConfigItem so all
 * // Replacer Slots without a Case Converter will be transformed the same way.
 * __replacerSlot__; //                LivesDownByTheRiver
 *
 * ```
 * You may also specify the case using an underscores-only syntax e.g. PascalCase__:
 *
 * ```
 * __replacerSlot__NoCase__;       // Lives down BY the River
 * __replacerSlot__CamelCase__;    // livesDownByTheRiver
 * __replacerSlot__ConstantCase__; // LIVES_DOWN_BY_THE_RIVER
 * __replacerSlot__DotCase__;      // lives.down.by.the.river
 * __replacerSlot__KebabCase__;    // lives-down-by-the-river
 * __replacerSlot__LowerCase__;    // livesdownbytheriver
 * __replacerSlot__PascalCase__;   // LivesDownByTheRiver
 * __replacerSlot__PathCase__;     // lives/down/by/the/river
 * __replacerSlot__SentenceCase__; // Lives down by the river
 * __replacerSlot__SnakeCase__;    // lives_down_by_the_river
 * __replacerSlot__TitleCase__;    // Lives Down By The River
 * ```
 * Take your Replacer Slots __replacerSlot__, the Case Converters PascalCase__ and combine them together to make __replacerSlot__PascalCase__.
 * One Rule: no spaces between the Replacer Slots and Case Converters. If there is a space, Case Converters will not work.
 *
 *```
 * ✅ __name__(camelCase) OR __name__CamelCase__
 * ❌ __name__ (camelCase) OR __name__ CamelCase__
 *```
 */
export enum CaseConverterEnum {
  /**
   *
   * [Case Converter](../index.html#case-converters) that does **not** convert [Replacer Slots](../index.html#replacer-slots). The text entered in will not be changed.
   *
   *  ```
   * // If you entered "Lives down BY the River" for __replacerSlot__
   * __replacerSlot__(noCase) OR __replacerSlot__NoCase__
   *
   * // It would output to:
   * Lives down BY the River
   * ```
   *
   * Usage:
   *
   * ```
   * CaseConverterEnum.None;
   * ```
   */
  None = '(noCase)',
  NoneUnderscore = 'NoCase__',
  /**
   * [Case Converter](../index.html#case-converters) that converts [Replacer Slots](../index.html#replacer-slots) to camel case.
   *
   *  ```
   * // If you entered "Lives down BY the River" for __replacerSlot__
   * __replacerSlot__(camelCase) OR __replacerSlot__CamelCase__
   *
   * // It would output to:
   * livesDownByTheRiver
   * ```
   *
   * Usage:
   *
   * ```
   * CaseConverterEnum.CamelCase;
   * ```
   */
  CamelCase = '(camelCase)',
  CamelCaseUnderscore = 'CamelCase__',
  /**
   * [Case Converter](../index.html#case-converters) that converts [Replacer Slots](../index.html#replacer-slots) to constant case.
   *
   *  ```
   * // If you entered "Lives down BY the River" for __replacerSlot__
   * __replacerSlot__(constantCase) OR __replacerSlot__ConstantCase__
   *
   * // It would output to:
   * LIVES_DOWN_BY_THE_RIVER
   * ```
   *
   * Usage:
   *
   * ```
   * CaseConverterEnum.ConstantCase;
   * ```
   */
  ConstantCase = '(constantCase)',
  ConstantCaseUnderscore = 'ConstantCase__',
  /**
   * [Case Converter](../index.html#case-converters) that converts [Replacer Slots](../index.html#replacer-slots) to dot case.
   *
   *  ```
   * // If you entered "Lives down BY the River" for __replacerSlot__
   * __replacerSlot__(dotCase) OR __replacerSlot__DotCase__
   *
   * // It would output to:
   * lives.down.by.the.river
   * ```
   *
   * Usage:
   *
   * ```
   * CaseConverterEnum.DotCase;
   * ```
   */
  DotCase = '(dotCase)',
  DotCaseUnderscore = 'DotCase__',
  /**
   * [Case Converter](../index.html#case-converters) that converts [Replacer Slots](../index.html#replacer-slots) to kebab case.
   *
   *  ```
   * // If you entered "Lives down BY the River" for __replacerSlot__
   * __replacerSlot__(kebabCase) OR __replacerSlot__KebabCase__
   *
   * // It would output to:
   * lives-down-by-the-river
   * ```
   *
   * Usage:
   *
   * ```
   * CaseConverterEnum.KebabCase;
   * ```
   */
  KebabCase = '(kebabCase)',
  KebabCaseUnderscore = 'KebabCase__',
  /**
   * [Case Converter](../index.html#case-converters) that converts [Replacer Slots](../index.html#replacer-slots) to all lower case.
   *
   *  ```
   * // If you entered "Lives down BY the River" for __replacerSlot__
   * __replacerSlot__(lowerCase) OR __replacerSlot__LowerCase__
   *
   * // It would output to:
   * livesdownbytheriver
   * ```
   *
   * Usage:
   *
   * ```
   * CaseConverterEnum.LowerCase;
   * ```
   */
  LowerCase = '(lowerCase)',
  LowerCaseUnderscore = 'LowerCase__',
  /**
   * [Case Converter](../index.html#case-converters) that converts [Replacer Slots](../index.html#replacer-slots) to pacal case.
   *
   *  ```
   * // If you entered "Lives down BY the River" for __replacerSlot__
   * __replacerSlot__(pascalCase) OR __replacerSlot__PascalCase__
   *
   * // It would output to:
   * LivesDownByTheRiver
   * ```
   *
   * Usage:
   *
   * ```
   * CaseConverterEnum.PascalCase;
   * ```
   */
  PascalCase = '(pascalCase)',
  PascalCaseUnderscore = 'PascalCase__',
  /**
   * [Case Converter](../index.html#case-converters) that converts [Replacer Slots](../index.html#replacer-slots) to path case.
   *
   *  ```
   * // If you entered "Lives down BY the River" for __replacerSlot__
   * __replacerSlot__(pathCase) OR __replacerSlot__PathCase__
   *
   * // It would output to:
   * lives/down/by/the/river
   * ```
   *
   * Usage:
   *
   * ```
   * CaseConverterEnum.PathCase;
   * ```
   */
  PathCase = '(pathCase)',
  PathCaseUnderscore = 'PathCase__',
  /**
   * [Case Converter](../index.html#case-converters) that converts [Replacer Slots](../index.html#replacer-slots) to sentence case.
   *
   *  ```
   * // If you entered "Lives down BY the River" for __replacerSlot__
   * __replacerSlot__(sentenceCase) OR __replacerSlot__SentenceCase__
   *
   * // It would output to:
   * Lives down by the river
   * ```
   *
   * Usage:
   *
   * ```
   * CaseConverterEnum.SentenceCase;
   * ```
   */
  SentenceCase = '(sentenceCase)',
  SentenceCaseUnderscore = 'SentenceCase__',
  /**
   * [Case Converter](../index.html#case-converters) that converts [Replacer Slots](../index.html#replacer-slots) to snake case.
   *
   *  ```
   * // If you entered "Lives down BY the River" for __replacerSlot__
   * __replacerSlot__(snakeCase) OR __replacerSlot__SnakeCase__
   *
   * // It would output to:
   * lives_down_by_the_river
   * ```
   *
   * Usage:
   *
   * ```
   * CaseConverterEnum.SnakeCase;
   * ```
   */
  SnakeCase = '(snakeCase)',
  SnakeCaseUnderscore = 'SnakeCase__',
  /**
   * [Case Converter](../index.html#case-converters) that converts [Replacer Slots](../index.html#replacer-slots) to title case.
   *
   *  ```
   * // If you entered "Lives down BY the River" for __replacerSlot__
   * __replacerSlot__(titleCase) OR __replacerSlot__TitleCase__
   *
   * // It would output to:
   * Lives Down By The River
   * ```
   *
   * Usage:
   *
   * ```
   * CaseConverterEnum.TitleCase;
   * ```
   */
  TitleCase = '(titleCase)',
  TitleCaseUnderscore = 'TitleCase__',
}
