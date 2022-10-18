import { readFileSync } from 'fs';
import { pathsToModuleNameMapper } from 'ts-jest';
import { getJestCachePath } from '../../cache.config.cjs';

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url)).toString('utf-8')
);

const { compilerOptions: baseTsConfig } = JSON.parse(
  readFileSync(new URL('./tsconfig.json', import.meta.url)).toString('utf-8')
);

const tsConfigFile = './tsconfig.jest.json';

// Take the paths from tsconfig automatically from base tsconfig.json
// @link https://kulshekhar.github.io/ts-jest/docs/paths-mapping
const getTsConfigBasePaths = () => {
  return baseTsConfig.paths
    ? pathsToModuleNameMapper(baseTsConfig.paths, {
        prefix: '<rootDir>/',
      })
    : {};
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  displayName: `${packageJson.name}:unit`,
  cacheDirectory: getJestCachePath(packageJson.name),
  testEnvironment: 'node',
  verbose: true,
  resolver: '<rootDir>/../mjs-resolver.ts',
  extensionsToTreatAsEsm: ['.mts', '.ts'],
  rootDir: './src',
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: tsConfigFile,
        useESM: true,
      },
    ],
  },
  setupFilesAfterEnv: [],
  testMatch: ['<rootDir>/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  moduleNameMapper: {
    // '^@/test-utils$': '<rootDir>/../config/jest/test-utils',
    ...getTsConfigBasePaths(),
  },
  // false by default, overrides in cli, ie: yarn test:unit --collect-coverage=true
  collectCoverage: false,
  coverageDirectory: '<rootDir>/../coverage',
  collectCoverageFrom: ['<rootDir>/**/*.{ts,tsx,js,jsx}', '!**/*.test.ts'],
};

export default config;
