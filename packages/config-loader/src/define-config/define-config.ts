export type MaybePromise<T> = T | Promise<T>;

export type ConfigEnvBase = {
  command: 'build' | 'serve';
};

export type UserConfigFn<UserConfig, ConfigEnv extends ConfigEnvBase> = (
  env: ConfigEnv
) => UserConfig | Promise<UserConfig>;

export type UserConfigExport<
  UserConfig,
  ConfigEnv extends ConfigEnvBase = ConfigEnvBase
> = UserConfig | Promise<UserConfig> | UserConfigFn<UserConfig, ConfigEnv>;

export const defineConfig = <
  UserConfig,
  ConfigEnv extends ConfigEnvBase = ConfigEnvBase
>(
  config: UserConfigExport<UserConfig, ConfigEnv>
) => config;
