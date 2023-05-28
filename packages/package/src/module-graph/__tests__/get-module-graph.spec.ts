import { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import { getModuleGraph } from '../get-module-graph.js';

const directory = join(getDirname(import.meta.url), `fixtures`);
const tsConfig = join(directory, 'tsconfig.json');
function fixture(...args: string[]): string {
  return join(directory, ...args);
}

describe('module-import-graph', () => {
  it('the resolve modules with ts paths', () => {
    const deps = getModuleGraph({
      tsConfig,
      filename: fixture('src/react.tsx'),
      directory,
    });
    expect(deps).toEqual(
      expect.arrayContaining([
        fixture('src/react.tsx'),
        fixture('src/react/index.ts'),
        fixture('src/react/module1/index.ts'),
        fixture('src/react/module1/module1.tsx'),
        fixture('src/react/module2/index.ts'),
        fixture('src/react/less/index.less'),
        fixture('src/react/module2/module2.tsx'),
      ])
    );
  });

  it('the resolve modules without filter works fine', () => {
    const deps = getModuleGraph({
      tsConfig,
      filename: fixture('src/index.ts'),
      directory,
    });
    expect(deps).toStrictEqual([
      fixture('src/index.ts'),
      fixture('src/style.css'),
      fixture('src/style1.css'),
      fixture('src/style2.css'),
    ]);
  });

  it('the resolve modules with filter() works fine', () => {
    const deps = getModuleGraph({
      tsConfig,
      filename: fixture('src/index.ts'),
      directory,
      filter(filepath) {
        return filepath !== fixture('src/style.css');
      },
    });
    expect(deps).toStrictEqual([
      fixture('src/index.ts'),
      fixture('src/style1.css'),
      fixture('src/style2.css'),
    ]);
  });

  it('the resolve modules with indirectly reference', () => {
    const deps = getModuleGraph({
      tsConfig,
      filename: fixture('src/module2/index.ts'),
      directory,
      filter() {
        return true;
      },
    });
    expect(deps).toStrictEqual([
      fixture('src/module2/index.ts'),
      fixture('src/module2/module2.ts'),
      fixture('src/module-no-style/index.ts'),
      fixture('src/module-no-style/module-no-style.ts'),
      fixture('src/module0/index.ts'),
      fixture('src/shared/index.ts'),
      fixture('src/shared/shared.less'),
      fixture('src/module0/module0.less'),
      fixture('src/module1/module1.ts'),
      fixture('src/module1/folder/folder.ts'),
      fixture('src/module1/folder/folder.less'),
      fixture('src/module1/folder2/index.ts'),
      fixture('src/module1/folder2/folder2.ts'),
      fixture('src/module1/folder2/folder2.less'),
      fixture('src/module1/module1.less'),
      fixture('src/module0/module0-outer.less'),
      fixture('src/module2/module2.less'),
    ]);
  });
});
