import { join } from 'node:path';
import { getDirname } from '@/test-utils';
import semver from 'semver';
import type { CliMockResult } from '../run-program.js';
import { runTsCliMock } from '../run-program.js';

async function runCliMock(...args: string[]): Promise<CliMockResult> {
  const program = join(
    getDirname(import.meta.url),
    'fixtures/cli-boot-sync.ts'
  );
  return runTsCliMock(program, ...args);
}

describe('cli basic infrusture with nested command', () => {
  it('Should output correct `help` -h', async () => {
    const { stdout } = await runCliMock('super', '-h');
    expect(stdout).toStrictEqual(expect.stringContaining(`Commands:`));
    expect(stdout).toStrictEqual(
      expect.stringContaining(`cli-boot-sync.ts super test`)
    );
  });
  it('The output should be run handler()', async () => {
    const { stdout } = await runCliMock('super', 'test');
    console.log(stdout);
    expect(stdout).toStrictEqual(
      expect.stringContaining(`this is test command handle`)
    );
  });
});

describe('cli basic infrusture', () => {
  it('Should output correct `version` -v', async () => {
    const { stdout } = await runCliMock('-v');
    expect(semver.valid(stdout)).not.toBeNull();
  });
  it('Should output correct `help` -h', async () => {
    const { stdout } = await runCliMock('-h');
    expect(stdout).toStrictEqual(
      expect.stringContaining(`Usage: cli-boot-sync.ts <command> [options]`)
    );
    expect(stdout).toStrictEqual(expect.stringContaining(`Commands:`));
    expect(stdout).toStrictEqual(
      expect.stringContaining(`cli-boot-sync.ts test`)
    );
    expect(stdout).toStrictEqual(expect.stringContaining(`Globals:`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-h, --help`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-v, --version`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-l, --logLevel`));
    expect(stdout).toStrictEqual(expect.stringContaining(`--noColor`));
    expect(stdout).toStrictEqual(expect.stringContaining(`Copyright 2022`));
  });
  it('Should output correct `test help` -h', async () => {
    const { stdout } = await runCliMock('test', '-h');
    expect(stdout).toStrictEqual(
      expect.stringContaining(`cli-boot-sync.ts test`)
    );
    expect(stdout).toStrictEqual(expect.stringContaining(`Globals:`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-h, --help`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-v, --version`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-l, --logLevel`));
    expect(stdout).toStrictEqual(expect.stringContaining(`--noColor`));
    expect(stdout).toStrictEqual(expect.stringContaining(`Options:`));
    expect(stdout).toStrictEqual(expect.stringContaining(`-t, --test`));
    expect(stdout).toStrictEqual(expect.stringContaining(`test describe`));
    expect(stdout).toStrictEqual(expect.stringContaining(`[default: true]`));
  });

  it('The output should be run handler()', async () => {
    const { stdout } = await runCliMock('test');
    expect(stdout).toStrictEqual(
      expect.stringContaining('this is test command handle')
    );
  });

  it('The output should have unknown command recommand', async () => {
    const { stderr } = await runCliMock('test1');
    expect(stderr).toStrictEqual(expect.stringContaining('Did you mean test?'));
  });

  it('The output should have correct global options', async () => {
    let { stdout } = await runCliMock('test', '-l=Debug');
    expect(stdout).toStrictEqual(
      expect.stringContaining('this is debug message for test command')
    );
    ({ stdout } = await runCliMock('test', '-l=Info'));
    expect(stdout).not.toStrictEqual(
      expect.stringContaining('this is debug message for test command')
    );
  });

  it('The output should have correct handle wrong param input', async () => {
    const { stderr } = await runCliMock('test', '-l=Wrong');
    expect(stderr).toStrictEqual(
      expect.stringContaining('Error: Invalid values:')
    );
    expect(stderr).toStrictEqual(
      expect.stringContaining(
        `Given: "Wrong", Choices: "Error", "Warn", "Info", "Verbose", "Debug"`
      )
    );
  });
});
