import type picocolors from 'picocolors';
import C from 'picocolors';

/**
 * Represents an ANSI color.
 */
export type Color = Exclude<
  keyof typeof picocolors,
  'createColors' | 'isColorSupported'
>;

/**
 * Terminal output formatting with ANSI colors
 * @param colors The colors for the console output
 * @param noColor Removes colors from the console output
 * @returns
 */
export function terminalColor(colors: readonly Color[], noColor?: boolean) {
  if (noColor || !colors.length) {
    // Pure text output.
    return (x: string) => x;
  }
  return (x: string) => {
    let out: string = x;
    for (let i = 0; i < colors.length; i++) {
      out = C[colors[i]](out);
    }
    return out;
  };
}
