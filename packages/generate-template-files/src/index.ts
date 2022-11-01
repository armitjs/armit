import { GenerateTemplateFiles } from './generate-template-files.js';
import type { ConfigItem } from './models/config-item.js';
export * from './models/index.js';
export * from './constants/index.js';

/**
 * Main method to create your template files. Accepts an array of `IConfigItem` items.
 */
export function generateTemplateFiles(data: Array<ConfigItem>): Promise<void> {
  return new GenerateTemplateFiles().generate(data);
}

/**
 * Main method to run generate on multiple templates at once, without any interactive prompts.
 */
export function generateTemplateFilesBatch(
  data: Array<Omit<ConfigItem, 'promptReplacers'>>
): Promise<void> {
  return new GenerateTemplateFiles().batchGenerate(data);
}
