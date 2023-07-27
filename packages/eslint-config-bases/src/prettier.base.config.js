// @ts-check

/**
 * @type {import('prettier').Config}
 */
module.exports = {
  // use single quotes instead of double quotes
  singleQuote: true,
  // add semicolons at the end of statements
  semi: true,
  // specify the number of spaces per indentation-level
  tabWidth: 2,
  // add spaces inside brackets (e.g., { foo: bar })
  bracketSpacing: true,
  // add trailing commas where valid in ES5 (objects, arrays, etc.)
  trailingComma: 'es5',
  // Print spaces between brackets in object literals.
  bracketSameLine: false,
  // use spaces instead of tabs for indentation
  useTabs: false,
  // specify the line length that the formatter will wrap on
  printWidth: 80,
  // maintain the line endings of the file
  endOfLine: 'auto',
  //
  overrides: [],
};
