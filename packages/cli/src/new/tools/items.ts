import type { ConfigItem } from '@armit/generate-template-files';
import { CaseConverterEnum } from '@armit/generate-template-files';
export const items: ConfigItem[] = [
  // React
  {
    option: 'React Redux Store',
    defaultCase: CaseConverterEnum.PascalCase,
    entry: {
      folderPath: './tools/templates/react/redux-store/',
    },
    promptReplacers: ['__store__', '__model__'],
    output: {
      path: './src/stores/__store__(kebabCase)',
      pathAndFileNameDefaultCase: CaseConverterEnum.PascalCase,
      overwrite: true,
    },
    onComplete: (results) => {
      console.log(`results`, results);
    },
  },
  {
    option: 'React Component',
    defaultCase: CaseConverterEnum.PascalCase,
    entry: {
      folderPath: './tools/templates/react/component/',
    },
    promptReplacers: ['__name__'],
    output: {
      path: './src/views/__name__(kebabCase)',
      pathAndFileNameDefaultCase: CaseConverterEnum.PascalCase,
    },
  },
  {
    option: 'React Connected Component',
    defaultCase: CaseConverterEnum.PascalCase,
    entry: {
      folderPath: './tools/templates/react/connected-component/',
    },
    promptReplacers: ['__name__'],
    output: {
      path: './src/views/__name__(kebabCase)',
      pathAndFileNameDefaultCase: CaseConverterEnum.PascalCase,
    },
  },
  {
    option: 'Selector',
    defaultCase: CaseConverterEnum.PascalCase,
    entry: {
      folderPath: './tools/templates/react/selectors/',
    },
    promptReplacers: ['__name__'],
    output: {
      path: './src/selectors/__name__(kebabCase)',
      pathAndFileNameDefaultCase: CaseConverterEnum.PascalCase,
    },
  },
  {
    option: 'Model',
    defaultCase: CaseConverterEnum.PascalCase,
    entry: {
      folderPath: './tools/templates/react/__model__Model.ts',
    },
    promptReplacers: ['__model__'],
    output: {
      path: './src/models/__model__Model.ts',
      pathAndFileNameDefaultCase: CaseConverterEnum.PascalCase,
    },
  },
  {
    option: 'Interface',
    defaultCase: CaseConverterEnum.PascalCase,
    entry: {
      folderPath: './tools/templates/react/I__interface__.ts',
    },
    promptReplacers: ['__interface__'],
    output: {
      path: './src/models/I__interface__.ts',
      pathAndFileNameDefaultCase: CaseConverterEnum.PascalCase,
    },
  },
  {
    option: 'Enum',
    defaultCase: CaseConverterEnum.PascalCase,
    entry: {
      folderPath: './tools/templates/react/__enum__Enum.ts',
    },
    promptReplacers: ['__enum__'],
    output: {
      path: './src/constants/__enum__Enum.ts',
      pathAndFileNameDefaultCase: CaseConverterEnum.PascalCase,
    },
  },
];
