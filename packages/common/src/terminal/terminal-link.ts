import terminalLink from 'terminal-link';
/**
 * Create a link for use in stdout.
 * @param text Text to linkify.
 * @param url URL to link to.
 */
export const getTerminalLink = (text: string, url: string): string => {
  return terminalLink(text, url);
};
