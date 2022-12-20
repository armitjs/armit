import cfonts from 'cfonts';

type BannerFontsOptions = {
  /**
   * define the font face
   * e.g. `'block'`
   */
  font:
    | 'console'
    | 'block'
    | 'simpleBlock'
    | 'simple'
    | '3d'
    | 'simple3d'
    | 'chrome'
    | 'huge'
    | 'shade'
    | 'slick'
    | 'grid'
    | 'pallet'
    | 'tiny';
  /**
   * define text alignment
   * e.g. `'left'`
   */
  align: 'left' | 'center' | 'right' | 'top' | 'bottom';
  /**
   * define all colors
   * e.g. `['system']`
   */
  colors: Array<
    | 'system'
    | 'black'
    | 'red'
    | 'green'
    | 'yellow'
    | 'blue'
    | 'magenta'
    | 'cyan'
    | 'white'
    | 'gray'
    | 'redBright'
    | 'greenBright'
    | 'yellowBright'
    | 'blueBright'
    | 'magentaBright'
    | 'cyanBright'
    | 'whiteBright'
    | '#ff8800'
    | 'hex-colors'
  >;
  /**
   * define the background color'|'you can also use `backgroundColor` here as key
   * `'transparent'`
   */
  background: string;
  /**
   * define letter spacing
   */
  letterSpacing: number;
  /**
   * define the line height
   */
  lineHeight: number;
  /**
   * define if the output text should have empty lines on top and on the bottom
   */
  space: boolean;
  /**
   * define how many character can be on one line
   */
  maxLength: number;
  /**
   * define your two gradient colors
   * @example `red,blue,green`
   */
  gradient: string;
  /**
   * define if you want to recalculate the gradient for each new line
   * @example `red,blue`
   */
  independentGradient: string;
  /**
   * define if this is a transition between colors directly
   * @example `red,blue,green`
   */
  transitionGradient: string;
};
export const showBanner = (
  text: string,
  options: Partial<BannerFontsOptions>,
  debug = false
) => {
  cfonts.say(
    text,
    {
      ...options,
      env: 'node',
    },
    debug
  );
};
