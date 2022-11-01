import { existsSync } from 'fs';
import { DefaultLogger, LogLevel } from '@armit/common';
import enquirer from 'enquirer';
import recursiveCopy from 'recursive-copy';
import replaceString from 'replace-string';
import through from 'through2';
import { CaseConverterEnum } from './constants/case-converter-enum.js';
import type { ConfigItem } from './models/config-item.js';
import type { DefaultCaseConverter } from './models/default-case-converter.js';
import type { QuestionReplacer } from './models/replacer-slot-question.js';
import type { Replacer } from './models/replacer.js';
import type { Results } from './models/results.js';
import {
  throwErrorIfNoConfigItems,
  throwErrorIfNoPromptOrDynamicReplacers,
  throwErrorIfPromptReplacersExistOrNoDynamicReplacers,
} from './utilities/check-utility.js';
import { StringUtility } from './utilities/string-utility.js';

export class GenerateTemplateFiles {
  private isBatch = false;
  private logger: DefaultLogger = new DefaultLogger({
    level: LogLevel.Warn,
  });

  constructor(options?: {
    /**
     * The actived logging level
     * @default 'Info'
     */
    logLevel?: keyof typeof LogLevel;
    /**
     * Removes colors from the console output
     * @default false
     */
    noColor?: boolean;
  }) {
    this.logger.setOptions({
      level: options?.logLevel ? LogLevel[options.logLevel] : LogLevel.Warn,
      noColor: options?.noColor,
    });
    this.logger.setDefaultContext('generate-template-files');
  }

  /**
   * Main method to create your template files. Accepts an array of `ConfigItem` items.
   */
  public async generate(options: ConfigItem[]): Promise<void> {
    try {
      throwErrorIfNoConfigItems(options);
      throwErrorIfNoPromptOrDynamicReplacers(options);

      const selectedConfigItem: ConfigItem = await this.getSelectedItem(
        options
      );
      const answeredReplacers: Replacer[] = await this.getReplacerSlotValues(
        selectedConfigItem
      );

      await this.outputFiles(selectedConfigItem, answeredReplacers);
    } catch (error) {
      this.logger.error(
        (error as Error).message,
        undefined,
        (error as Error).stack
      );
    }
  }

  /**
   * Main method to run generate on multiple templates at once, without any interactive prompts
   */
  public async batchGenerate(options: Omit<ConfigItem, 'promptReplacers'>[]) {
    this.isBatch = true;
    throwErrorIfNoConfigItems(options);
    throwErrorIfPromptReplacersExistOrNoDynamicReplacers(options);

    for (const selectedConfigItem of options) {
      const answeredReplacers = await this.getDynamicReplacerSlotValues(
        selectedConfigItem
      );
      await this.outputFiles(selectedConfigItem, answeredReplacers);
    }
  }

  private async outputFiles(
    selectedConfigItem: ConfigItem,
    replacers: Replacer[]
  ): Promise<void> {
    const { contentCase, outputPathCase } =
      this.getDefaultCaseConverters(selectedConfigItem);

    const contentReplacers: Replacer[] = this.getReplacers(
      replacers,
      contentCase
    );

    const outputPathReplacers: Replacer[] = this.getReplacers(
      replacers,
      outputPathCase
    );

    const outputPath: string = await this.getOutputPath(
      outputPathReplacers,
      selectedConfigItem
    );

    const shouldWriteFiles: boolean = await this.shouldWriteFiles(
      outputPath,
      selectedConfigItem
    );

    if (shouldWriteFiles === false) {
      this.logger.warn('No new files created');
      return;
    }

    const outputtedFilesAndFolders: string[] = await this.createFiles(
      replacers,
      outputPathReplacers,
      contentReplacers,
      outputPath,
      selectedConfigItem.entry.folderPath
    );

    this.onComplete(
      selectedConfigItem,
      outputPath,
      outputtedFilesAndFolders,
      replacers
    );
  }

  /**
   * Ask what template options the user wants to use
   */
  private async getSelectedItem(options: ConfigItem[]): Promise<ConfigItem> {
    const templateAnswers: { optionChoice: string } = await enquirer.prompt({
      type: 'autocomplete',
      name: 'optionChoice',
      message: 'What do you want to generate?',
      choices: options.map((configItem: ConfigItem) => configItem.option),
      suggest(input: string, choices: string[]) {
        return choices.filter((choice) => {
          return choice['message']
            .toLowerCase()
            .startsWith(input.toLowerCase());
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    return options.find(
      (item: ConfigItem) => item.option === templateAnswers.optionChoice
    ) as ConfigItem;
  }

  private getDefaultCaseConverters(
    selectedConfigItem: ConfigItem
  ): DefaultCaseConverter {
    const defaultContentCase: CaseConverterEnum =
      selectedConfigItem?.defaultCase ?? CaseConverterEnum.None;
    const defaultOutputPath: CaseConverterEnum =
      selectedConfigItem.output?.pathAndFileNameDefaultCase ??
      defaultContentCase;

    return {
      contentCase: defaultContentCase,
      outputPathCase: defaultOutputPath,
    };
  }

  /**
   * New question asking what should text should be used to replace the template text.
   */
  private async getReplacerSlotValues(
    selectedConfigItem: ConfigItem
  ): Promise<Replacer[]> {
    const promptReplacers: QuestionReplacer[] =
      selectedConfigItem.promptReplacers ?? [];
    const replacerQuestions = promptReplacers.map((item: QuestionReplacer) => {
      const isOptional = typeof item !== 'string' ? item.optional : false;
      return {
        type: 'input',
        name: StringUtility.isString(item) ? item : item.slot,
        message: StringUtility.isString(item)
          ? `Replace ${item} with`
          : item.question,
        validate: (replacerSlotValue: string) => {
          const isValid = Boolean(replacerSlotValue.trim()) || isOptional;

          return isValid || 'You must provide an answer.';
        },
      };
    });

    const answer: { [replacer: string]: string } = await enquirer.prompt(
      replacerQuestions
    );

    const replacers: Replacer[] = Object.entries(answer).map(
      ([key, value]: [string, string]): Replacer => {
        return {
          slot: key,
          slotValue: value,
        };
      }
    );
    const dynamicReplacers = await this.getDynamicReplacerSlotValues(
      selectedConfigItem
    );

    return [...replacers, ...dynamicReplacers];
  }

  /**
   * Dynamic replacer values, used for interactive and batch generation
   */
  private async getDynamicReplacerSlotValues(
    selectedConfigItem: ConfigItem
  ): Promise<Replacer[]> {
    const dynamicReplacers: Replacer[] =
      selectedConfigItem.dynamicReplacers || [];

    return dynamicReplacers;
  }

  /**
   * Create every variation for the for the replacement keys
   */
  private getReplacers(
    replacers: Replacer[],
    defaultCase: CaseConverterEnum
  ): Replacer[] {
    const caseTypes: CaseConverterEnum[] = Object.values(CaseConverterEnum);

    return replacers.reduce(
      (
        previousReplacers: Replacer[],
        answeredReplacer: Replacer
      ): Replacer[] => {
        const { slot, slotValue } = answeredReplacer;

        return [
          ...previousReplacers,
          ...caseTypes.map((caseType: CaseConverterEnum): Replacer => {
            return {
              slot: `${slot}${caseType}`,
              slotValue: StringUtility.toCase(slotValue, caseType),
            };
          }),
          {
            slot,
            slotValue: StringUtility.toCase(slotValue, defaultCase),
          },
        ];
      },
      []
    );
  }

  /**
   */
  private async getOutputPath(
    outputPathReplacers: Replacer[],
    selectedConfigItem: ConfigItem
  ): Promise<string> {
    // Determine output path dyanamiclly.
    const outputPath =
      typeof selectedConfigItem.output.path === 'string'
        ? selectedConfigItem.output.path
        : selectedConfigItem.output.path(
            outputPathReplacers,
            selectedConfigItem
          );

    // Create the output path replacing any template keys.
    const outputPathFormatted: string = outputPathReplacers.reduce<string>(
      (outputPath: string, replacer: Replacer) => {
        return replaceString(outputPath, replacer.slot, replacer.slotValue);
      },
      outputPath
    );

    if (this.isBatch) {
      return outputPathFormatted;
    }

    const outputPathAnswer = await enquirer.prompt<{ outputPath: string }>({
      type: 'input',
      name: 'outputPath',
      message: 'Output path:',
      initial: outputPathFormatted,
    });

    return outputPathAnswer.outputPath;
  }

  /**
   */
  private async shouldWriteFiles(
    outputPath: string,
    selectedConfigItem: ConfigItem
  ): Promise<boolean> {
    const doesPathExist: boolean = existsSync(outputPath);

    if (!doesPathExist) {
      return true;
    }

    if (selectedConfigItem.output.overwrite) {
      return true;
    }

    if (this.isBatch) {
      return Boolean(selectedConfigItem.output.overwrite);
    }

    const overwriteFilesAnswer = await enquirer.prompt<{ overwrite: boolean }>({
      name: 'overwrite',
      message: 'Overwrite files, continue?',
      type: 'confirm',
      initial: false,
    });

    return overwriteFilesAnswer.overwrite;
  }

  /**
   * Process and copy files.
   */
  private async createFiles(
    answeredReplacer: Replacer[],
    outputPathReplacers: Replacer[],
    replacers: Replacer[],
    outputPath: string,
    entryFolderPath: string
  ): Promise<string[]> {
    const outputtedFilesAndFolders: string[] = [];

    const recursiveCopyOptions = {
      overwrite: true,
      expand: false,
      dot: true,
      junk: true,
      rename: (fileFolderPath: string): string => {
        const fileOrFolder: string = answeredReplacer.reduce((path: string) => {
          let formattedFilePath: string = path;

          outputPathReplacers.forEach((replacer: Replacer) => {
            formattedFilePath = replaceString(
              formattedFilePath,
              replacer.slot,
              replacer.slotValue
            );
          });

          return formattedFilePath;
        }, fileFolderPath);

        outputtedFilesAndFolders.push(fileOrFolder);

        return fileOrFolder;
      },
      transform: (_src: string, _dest: string, _stats: unknown) => {
        return through((chunk, enc, done) => {
          let output: string = chunk.toString();

          replacers.forEach((replacer: Replacer) => {
            output = replaceString(output, replacer.slot, replacer.slotValue);
          });

          done(null, output);
        });
      },
    };

    try {
      await recursiveCopy(entryFolderPath, outputPath, recursiveCopyOptions);

      this.logger.info(`Files saved to: '${outputPath}'`);

      return outputtedFilesAndFolders.filter(Boolean);
    } catch (error) {
      this.logger.error(`Copy failed: ${error}`);
      return [`Copy failed: ${error}`];
    }
  }

  private onComplete(
    selectedConfigItem: ConfigItem,
    outputPath: string,
    outputtedFilesAndFolders: string[],
    stringReplacers: Replacer[]
  ): void {
    const files: string[] = outputtedFilesAndFolders.filter((path: string) =>
      path.includes('.')
    );

    if (typeof selectedConfigItem.onComplete === 'function') {
      const results: Results = {
        output: {
          path: outputPath,
          files: files.map((file: string) => `${outputPath}/${file}`),
        },
        stringReplacers,
      };

      selectedConfigItem.onComplete(results);
    }
  }
}
