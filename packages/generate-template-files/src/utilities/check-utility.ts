import type { ConfigItem } from '../models/config-item.js';

export const throwErrorIfNoConfigItems = (options: ConfigItem[]) => {
  const hasAtLeastOneItem = Boolean(options?.length);

  if (!hasAtLeastOneItem) {
    throw new Error('There was no ConfigItem items found.');
  }
};

export const throwErrorIfNoPromptOrDynamicReplacers = (
  options: ConfigItem[]
) => {
  const hasStringOrDynamicReplacers =
    options.every((item: ConfigItem) => {
      return (
        Boolean(item?.promptReplacers?.length) ||
        Boolean(item?.dynamicReplacers?.length)
      );
    }) && options.length > 0;

  if (!hasStringOrDynamicReplacers) {
    throw new Error(
      'ConfigItem needs to have a promptReplacers or dynamicReplacers.'
    );
  }
};

export const throwErrorIfPromptReplacersExistOrNoDynamicReplacers = (
  options: ConfigItem[]
) => {
  const allValidBatchEntries =
    options.every((item: ConfigItem) => {
      return (
        !item?.promptReplacers?.length &&
        Boolean(item?.dynamicReplacers?.length)
      );
    }) && options.length > 0;

  if (!allValidBatchEntries) {
    throw new Error(
      'ConfigItem for batchGenerate does not support promptReplacers, and must have dynamicReplacers.'
    );
  }
};
