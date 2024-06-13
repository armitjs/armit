import { extractModuleVersionGraph } from '../extract-module-version-graph.js';
import {
  monoProjectCwd,
  monoRootVersion,
  withSameVersion,
} from './fixtures/test-data.js';

describe('extract-module-version-graph.ts', () => {
  it('should correct detect module depGraph for nofound module', () => {
    const result = extractModuleVersionGraph(
      '@flatjs/xxxx',
      withSameVersion.dependencies
    );
    expect(result.length).toBe(0);
  });

  it('should correct detect module depGraph for basic logics', () => {
    const result = extractModuleVersionGraph(
      '@flatjs/forge',
      withSameVersion.dependencies
    );
    expect(result.length).toBe(2);
    // 第一个version 处于根目录下, 无任何依赖.
    expect(result[0].version).toBe('1.6.0');
    expect(result[0].depsGraph).toEqual([]);

    // 第二个处于其他依赖项下, 存在间接依赖.
    expect(result[1].version).toBe('1.6.0');
    expect(result[1].depsGraph).toEqual([
      { name: '@flatjs/sculpt', version: '1.5.25' },
    ]);
  });

  it('should correct detect module depGraph for mono project with `project` workspace', () => {
    const result = extractModuleVersionGraph(
      '@dimjs/utils',
      monoProjectCwd.dependencies
    );
    expect(result.length).toBe(5);
    expect(result[0].version).toBe('1.2.33');
    expect(result[0].depsGraph).toEqual([
      { name: '@semic/admin-ui', version: '1.0.14' },
    ]);

    expect(result[1].version).toBe('1.3.2');
    expect(result[1].depsGraph).toEqual([
      { name: '@semic/admin-ui', version: '1.0.14' },
      { name: '@dimjs/tracker-core', version: '0.0.1' },
    ]);

    expect(result[2].version).toBe('1.2.44');
    expect(result[2].depsGraph).toEqual([
      { name: '@semic/admin-ui', version: '1.0.14' },
      { name: '@semic/layout', version: '1.0.13' },
    ]);

    expect(result[3].version).toBe('1.2.44');
    expect(result[3].depsGraph).toEqual([
      { name: '@semic/admin-ui', version: '1.0.14' },
      { name: '@semic/layout', version: '1.0.13' },
      { name: '@wove/react', version: '1.2.23' },
    ]);

    expect(result[4].version).toBe('1.2.33');
    expect(result[4].depsGraph).toEqual([
      { name: '@semic/admin-ui', version: '1.0.14' },
      { name: '@wove/react', version: '1.2.23' },
    ]);
  });

  it('should correct detect module depGraph for mono project with `mono` workspace', () => {
    const result = extractModuleVersionGraph(
      '@dimjs/utils',
      monoRootVersion.dependencies
    );
    expect(result.length).toBe(6);

    expect(result[0].version).toBe('1.3.0');
    expect(result[0].depsGraph).toEqual([]);

    expect(result[1].version).toBe('1.2.33');
    expect(result[1].depsGraph).toEqual([
      { name: '@semic/admin-ui', version: '1.0.14' },
    ]);

    expect(result[2].version).toBe('1.2.44');
    expect(result[2].depsGraph).toEqual([
      { name: '@semic/admin-ui', version: '1.0.14' },
      { name: '@semic/layout', version: '1.0.13' },
    ]);

    expect(result[3].version).toBe('1.2.33');
    expect(result[3].depsGraph).toEqual([
      { name: '@semic/admin-ui', version: '1.0.14' },
      { name: '@wove/react', version: '1.2.23' },
    ]);

    expect(result[4].version).toBe('1.2.44');
    expect(result[4].depsGraph).toEqual([
      { name: '@semic/layout', version: '1.0.13' },
    ]);

    expect(result[5].version).toBe('1.2.44');
    expect(result[5].depsGraph).toEqual([
      { name: '@semic/layout', version: '1.0.13' },
      { name: '@wove/react', version: '1.2.23' },
    ]);
  });
});
