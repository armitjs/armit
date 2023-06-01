import { type CommandModule } from 'yargs';

export type PluginConfig = {
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  command: CommandModule<any, any>;
};

export const definePlugin = (config: PluginConfig) => config;
