/**
 * Fill the string left or right
 * @param str String to be processed
 * @param length Total length of string will be filled to e.g. `-5` | `5` symbol `-` indicates directory `left`
 * @param value The default string to populate
 */
export declare const strPad: (str: string, length?: number, value?: string) => string;
export declare const strTimePad: (time: string | number) => string;
