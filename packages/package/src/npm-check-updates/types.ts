export interface UpdatePackageOptions {
  /**
   * child process work directory.
   */
  cwd: string;
  /**
   * package file location (default: ./package.json)
   * @default `./package.json`
   */
  packageFile?: string;

  /**
   * Exclude packages matching the given string, wildcard, glob, comma-or-space-delimited list, or /regex/.
   */
  reject?: string | string[] | RegExp;

  /**
   * Exclude package.json versions using comma-or-space-delimited list, or /regex/.
   */
  rejectVersion?: string | string[] | RegExp;
  /**
   * Third-party npm registry.
   */
  registry?: string;
  /**
   * Global timeout in milliseconds.
   * @default 30000
   */
  timeout?: number;
  /**
   * nclude only package names matching the given string,
   * comma-or-space-delimited list, or /regex/
   * @example filter = /^@flatjs/
   */
  filter?: string | RegExp;
}
