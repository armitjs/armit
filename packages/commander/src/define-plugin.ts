import { type CommandModule } from 'yargs';

export type PluginConfig = {
  name?: string;
  command: CommandModule;
};

export const definePlugin = (config: PluginConfig) => config;
