// eslint-disable-next-line @typescript-eslint/naming-convention
import C from 'picocolors';

export type Color = Exclude<
  keyof typeof C,
  'createColors' | 'isColorSupported'
>;

export function chalk(colors: readonly Color[], noColor?: boolean) {
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
