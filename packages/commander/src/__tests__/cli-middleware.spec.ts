import { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import type { ExecOptions } from '@hyperse/exec-program';
import { runTsScript } from '@hyperse/exec-program';

describe('cli basic infrusture with middlewareCliHandler', () => {
  it('async middlewareCliHandler', async () => {
    async function runCliMock<T extends ExecOptions>(...args: string[]) {
      const program = join(
        getDirname(import.meta.url),
        'fixtures/cli-boot-async-middleware.ts'
      );
      return runTsScript<T>(program, args);
    }

    const { stdout } = await runCliMock('test');
    const list = stdout?.toString().split('\n') || [];
    expect(list?.length).toBe(2);
    expect(list[0]).toStrictEqual(
      expect.stringContaining(`this is global middleware`)
    );
    expect(list[1]).toStrictEqual(
      expect.stringContaining(`this is test command handle`)
    );
  });

  it('sync middlewareCliHandler', async () => {
    async function runCliMock<T extends ExecOptions>(...args: string[]) {
      const program = join(
        getDirname(import.meta.url),
        'fixtures/cli-boot-sync-middleware.ts'
      );
      return runTsScript<T>(program, args);
    }

    const { stdout } = await runCliMock('test');
    const list = stdout?.toString().split('\n') || [];
    expect(list?.length).toBe(2);
    expect(list[0]).toStrictEqual(
      expect.stringContaining(`this is global async middleware`)
    );
    expect(list[1]).toStrictEqual(
      expect.stringContaining(`this is test command handle`)
    );
  });
});
