import merge, { all } from 'deepmerge';
import omit from 'object.omit';
import { type ConfigItem, loadPartialConfig } from '@babel/core';
import { babelMerge, babelMergeAll } from '../babel-merge.js';
import { requireResolve } from './require-resolve.js';

function formatBabelConfig({ file, options }: ConfigItem) {
  return options ? [file?.resolved, options] : file?.resolved;
}

test('should deeply merge preset options', () => {
  const result = babelMerge(
    {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              browsers: ['latest 1 Chrome'],
            },
          },
        ],
      ],
    },
    {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              browsers: ['latest 1 Firefox'],
            },
          },
        ],
      ],
    }
  );
  expect(result).toEqual({
    presets: [
      [
        requireResolve(import.meta.url, '@babel/preset-env'),
        {
          targets: {
            browsers: ['latest 1 Firefox'],
          },
        },
      ],
    ],
  });
});

test('should merge by resolved name', () => {
  const result = babelMerge(
    {
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: {
              browsers: ['latest 1 Chrome'],
            },
          },
        ],
      ],
    },
    {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              browsers: ['latest 1 Firefox'],
            },
          },
        ],
      ],
    }
  );
  expect(result).toEqual({
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: {
            browsers: ['latest 1 Firefox'],
          },
        },
      ],
    ],
  });
});

test('should merge env options', () => {
  const result = babelMerge(
    {
      env: {
        development: {
          presets: [
            [
              require.resolve('@babel/preset-env'),
              {
                targets: {
                  browsers: ['latest 1 Chrome'],
                },
              },
            ],
          ],
        },
      },
    },
    {
      env: {
        development: {
          presets: [
            [
              '@babel/env',
              {
                targets: {
                  browsers: ['latest 1 Firefox'],
                },
              },
            ],
          ],
        },
      },
    }
  );
  expect(result).toEqual({
    env: {
      development: {
        presets: [
          [
            require.resolve('@babel/preset-env'),
            {
              targets: {
                browsers: ['latest 1 Firefox'],
              },
            },
          ],
        ],
      },
    },
  });
});

test('should preserve plugin / preset order', () => {
  const result = babelMerge(
    {
      presets: ['./__tests__/local-preset.cjs'],
      plugins: [
        'module:fast-async',
        '@babel/plugin-syntax-dynamic-import',
        './__tests__/local-plugin.cjs',
      ],
    },
    {
      presets: ['@babel/env'],
      plugins: [
        ['./__tests__/local-plugin.cjs', { foo: 'bar' }],
        '@babel/plugin-proposal-object-rest-spread',
        ['module:fast-async', { spec: true }],
        '@babel/plugin-proposal-class-properties',
      ],
    }
  );
  expect(result).toEqual({
    presets: [
      requireResolve(import.meta.url, './local-preset.cjs'),
      requireResolve(import.meta.url, '@babel/preset-env'),
    ],
    plugins: [
      [requireResolve(import.meta.url, 'fast-async'), { spec: true }],
      requireResolve(import.meta.url, '@babel/plugin-syntax-dynamic-import'),
      [requireResolve(import.meta.url, './local-plugin.cjs'), { foo: 'bar' }],
      requireResolve(
        import.meta.url,
        '@babel/plugin-proposal-object-rest-spread'
      ),
      requireResolve(
        import.meta.url,
        '@babel/plugin-proposal-class-properties'
      ),
    ],
  });
});

test('should merge an array of config objects', () => {
  const presetEnv = requireResolve(import.meta.url, '@babel/preset-env');

  const result = babelMergeAll([
    {
      presets: [presetEnv],
    },
    {
      presets: ['@babel/preset-env'],
    },
    {
      presets: ['@babel/env'],
    },
  ]);

  expect(result).toEqual({
    presets: [presetEnv],
  });
});

test('should dedupe merged arrays', () => {
  const result = babelMergeAll([
    {
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: {
              browsers: ['latest 1 Chrome'],
            },
          },
        ],
      ],
    },
    {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: ['latest 1 Chrome'],
            },
          },
        ],
      ],
    },
    {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              browsers: ['latest 1 Chrome'],
            },
          },
        ],
      ],
    },
  ]);
  expect(result).toEqual({
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: {
            browsers: ['latest 1 Chrome'],
          },
        },
      ],
    ],
  });
});

test('should support ES6+ data structures', () => {
  const a = {
    Map: new Map([['a', 'a']]),
    Set: new Set(['a']),
    WeakMap: new WeakMap([[{ a: true }, 'a']]),
    WeakSet: new WeakSet([{ a: true }]),
  };

  const b = {
    Map: new Map([['b', 'b']]),
    Set: new Set(['b']),
    WeakMap: new WeakMap([[{ b: true }, 'b']]),
    WeakSet: new WeakSet([{ b: true }]),
  };

  const c = {
    Map: new Map([['c', 'c']]),
    Set: new Set(['c']),
    WeakMap: new WeakMap([[{ c: true }, 'c']]),
    WeakSet: new WeakSet([{ c: true }]),
  };
  const result = babelMergeAll([
    { presets: [[require.resolve('@babel/preset-env'), a]] },
    { presets: [['@babel/preset-env', b]] },
    { presets: [['@babel/env', c]] },
  ]);
  expect(result).toEqual({
    presets: [[require.resolve('@babel/preset-env'), c]],
  });
});

test('should support deepmerge option overrides', () => {
  const result1 = babelMerge(
    {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              browsers: new Set(),
            },
          },
        ],
      ],
    },
    undefined,
    { isMergeableObject: () => true }
  );
  expect(result1).toEqual({
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: {
            browsers: {},
          },
        },
      ],
    ],
  });
  const result2 = babelMergeAll(
    [
      {
        presets: [
          [
            '@babel/env',
            {
              targets: {
                browsers: new Set(),
              },
            },
          ],
        ],
      },
    ],
    { isMergeableObject: () => true }
  );
  expect(result2).toEqual({
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: {
            browsers: {},
          },
        },
      ],
    ],
  });
});

test(`should mirror babel's merge behavior`, async () => {
  function getOverrides() {
    return {
      presets: [
        [requireResolve(import.meta.url, './local-preset.cjs'), { foo: 'bar' }],
        [
          '@babel/env',
          {
            targets: {
              browsers: ['>= 0.25%', 'not dead'],
            },
          },
        ],
      ],
      plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        ['module:fast-async', { spec: true }],
        '@babel/plugin-proposal-class-properties',
      ],
    };
  }
  let babelrc = await import('./.babelrc.cjs');

  babelrc = babelrc.default || babelrc;

  const babelPluginConfigs = loadPartialConfig({
    ...getOverrides(),
    configFile: requireResolve(import.meta.url, './.babelrc.cjs'),
  });

  const { presets = [], plugins = [] } = babelPluginConfigs?.options || {};

  expect({
    presets: presets!.map((item) => {
      return formatBabelConfig(item as ConfigItem);
    }),
    plugins: plugins!.map((item) => {
      return formatBabelConfig(item as ConfigItem);
    }),
  }).toEqual(
    omit(babelMergeAll([babelrc, babelrc['env'].test, getOverrides()]), ['env'])
  );
});

describe('merge babel options', () => {
  it('should deeply merge preset options', () => {
    const x = {
      foo: { bar: 3 },
      array: [
        {
          does: 'work',
          too: [1, 2, 3],
        },
      ],
    };

    const y = {
      foo: { baz: 4 },
      quux: 5,
      array: [
        {
          does: 'work',
          too: [4, 5, 6],
        },
        {
          really: 'yes',
        },
      ],
    };
    const output = {
      foo: {
        bar: 3,
        baz: 4,
      },
      array: [
        {
          does: 'work',
          too: [1, 2, 3],
        },
        {
          does: 'work',
          too: [4, 5, 6],
        },
        {
          really: 'yes',
        },
      ],
      quux: 5,
    };
    const result = merge(x, y);

    expect(result).toEqual(output);
  });

  it('deep merge all', () => {
    const foobar = { foo: { bar: 3 } };
    const foobaz = { foo: { baz: 4 } };
    const bar = { bar: 'yay!' };

    expect(all([foobar, foobaz, bar])).toEqual({
      foo: { bar: 3, baz: 4 },
      bar: 'yay!',
    });
  });
});
