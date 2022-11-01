import { CaseConverterEnum } from '../constants/case-converter-enum.js';
import { GenerateTemplateFiles } from '../generate-template-files.js';
import type { ConfigItem } from '../models/config-item.js';

describe('GenerateTemplateFiles - Batch', () => {
  test('should throw an error if no ConfigItem items', () => {
    const items: ConfigItem[] = [];
    const gtf = new GenerateTemplateFiles({
      noColor: true,
    });

    expect(() => gtf.batchGenerate(items)).rejects.toThrowError(
      'There was no ConfigItem items found.'
    );
  });

  test('should throw an error if no promptReplacers or dynamicReplacers', async () => {
    const items: ConfigItem[] = [
      {
        option: 'some-template',
        defaultCase: CaseConverterEnum.PascalCase,
        entry: {
          folderPath: 'path',
        },
        output: {
          path: 'path',
        },
      },
    ];
    const gtf = new GenerateTemplateFiles({
      noColor: true,
    });

    await expect(() => gtf.batchGenerate(items)).rejects.toThrowError(
      'ConfigItem for batchGenerate does not support promptReplacers, and must have dynamicReplacers'
    );
  });

  test('should throw an error if batch ConfigItem is not found for option name', async () => {
    const items: ConfigItem[] = [
      {
        option: 'some-template',
        defaultCase: CaseConverterEnum.PascalCase,
        promptReplacers: ['__name__'],
        entry: {
          folderPath: 'path',
        },
        output: {
          path: 'path',
        },
      },
    ];
    const gtf = new GenerateTemplateFiles({
      noColor: true,
    });

    await expect(() => gtf.batchGenerate(items)).rejects.toThrowError(
      `ConfigItem for batchGenerate does not support promptReplacers, and must have dynamicReplacers.`
    );
  });
});
