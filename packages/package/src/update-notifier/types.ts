export type PackageUpdate = {
  pkg: { name: string; version: string };
  /**
   * How often to check for updates.
   * @default: 1000 * 60 * 60 * 24 (1 day)
   */
  updateCheckInterval?: number;
  /**
   * Allows notification to be shown when running as an npm script.
   * @default false
   */
  shouldNotifyInNpmScript?: boolean;
  /**
   * Which dist-tag to use to find the latest version.
   * @default 'latest'
   */
  distTag?: string;
  /**
   * If always run update checker
   * @default false
   */
  alwaysRun?: boolean;
  /**
   * Removes colors from the console output
   * @default false
   */
  noColor?: boolean;
};
