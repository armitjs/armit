import { type PackageJson } from 'type-fest';

export type PackageStatus = {
  /**
   * Latest version available.
   */
  latest: string;
  /**
   * Module name.
   */
  name: string;
  /**
   * Module type.
   */
  type: 'dev' | 'prod';
  /**
   *  Version from package.json.
   */
  wanted: string;
  /**
   * Currently installed version.
   */
  installed: string | null;
  /**
   * If module should be installed.
   */
  shouldBeInstalled: boolean;

  /**
   * NPM registry service
   */
  registry: string;
};

/**
 * The verify package regex pattern definition.
 */
export type VerifyPackagePattern = Partial<{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'https://registry.npmjs.org': RegExp[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'https://registry.npm.taobao.org': RegExp[];
  [registry: string]: RegExp[];
}>;

export type VerifyDepsOption = {
  /**
   * Automatically upgrade all suggested dependencies.
   * @default false
   */
  autoUpgrade?: boolean;
  /**
   * The path where to look for the package.json file.
   * @default ''
   */
  dir?: string;

  /**
   * NPM registry service
   * @default `https://registry.npmjs.org`
   */
  registry?: string;

  /**
   * The regexp patterns to filter dependencies(will be verified) from package.json
   * @default []
   */
  needVerifyPackages?: VerifyPackagePattern;
};

export type PushPkgsOption = {
  /**
   * List of dependencies.
   */
  deps: PackageJson['dependencies'];
  /**
   * Directory location.
   */
  dir: string;
  /**
   * Type of dependency.
   */
  type: 'dev' | 'prod';
  /**
   * NPM registry service
   */
  registry: string;

  /**
   * The regexp patterns to filter dependencies(will be verified) from package.json
   * @default []
   */
  needVerifyPackages?: VerifyPackagePattern;
};

export type PackageVerifyDeps = {
  /**
   * The path where to look for the package.json file.
   * @default ''
   */
  cwd?: string;
  /**
   * Automatically upgrade all suggested dependencies.
   * @default false
   */
  autoUpgrade?: boolean;

  /**
   * The regexp patterns to filter dependencies(will be verified) from package.json
   * @default []
   */
  needVerifyPackages?: VerifyPackagePattern;
};
