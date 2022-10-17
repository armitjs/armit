import C from 'picocolors';
import type { Color } from './types.js';

export function terminalColor(colors: readonly Color[]) {
  if (!colors.length) {
    // Pure text output.
    return (x: string) => x;
  }
  return (x) => {
    let out = x;
    for (let i = 0; i < colors.length; i++) {
      out = C[colors[i]](out);
    }
    return out;
  };
}
