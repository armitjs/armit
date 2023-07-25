export interface UpdatePackageOptions {
  /**
   * child process work directory.
   */
  cwd: string;
  /**
   * Check one or more sections of dependencies only: dev, optional, peer, prod, or packageManager (comma-delimited).
   * @default ["prod","dev","optional"]
   */
  dep?: string | string[];
  /**
   * Run recursively in current working directory.
   * @default `['./package.json', './packages/*\/package.json']`
   */
  packageFiles?: string | string[];

  /**
   * Don't output anything. Alias for `--loglevel` silent.
   */
  silent?: boolean;
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
