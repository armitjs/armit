/* eslint-disable @typescript-eslint/naming-convention */
// @dimjs/utils
export const withSameVersion = {
  version: '1.0.0',
  name: '@flatjs/core-repo',
  dependencies: {
    '@flatjs/forge': {
      version: '1.6.0',
      overridden: false,
    },
    '@flatjs/sculpt': {
      version: '1.5.25',
      resolved: 'file:../../packages/sculpt',
      overridden: false,
      dependencies: {
        '@flatjs/forge': {
          version: '1.6.0',
        },
      },
    },
  },
};
// mono项目, 但是执行cwd在`@semic/admin-ui`目录下执行`npm ls @dimjs/utils` --json=true
export const monoProjectCwd = {
  version: '1.0.0',
  name: '@kzfoo/admin',
  dependencies: {
    '@semic/admin-ui': {
      version: '1.0.14',
      resolved: 'file:../../packages/semic-admin-ui',
      overridden: false,
      dependencies: {
        '@dimjs/utils': {
          version: '1.2.33',
          overridden: false,
        },
        '@dimjs/logger': {
          version: '1.3.1',
          overridden: false,
        },
        '@dimjs/tracker-core': {
          version: '0.0.1',
          resolved: 'file:../../packages/tracker-core',
          overridden: false,
          invalid: '"workspace:^" from packages/tracker-core-browser',
          dependencies: {
            '@dimjs/logger': {
              version: '1.3.1',
            },
            '@dimjs/utils': {
              version: '1.3.2',
            },
          },
        },
        '@semic/layout': {
          version: '1.0.13',
          resolved: 'file:../../../semic-layout',
          overridden: false,
          dependencies: {
            '@dimjs/utils': {
              version: '1.2.44',
              overridden: false,
            },
            '@wove/react': {
              version: '1.2.23',
              overridden: false,
              dependencies: {
                '@dimjs/utils': {
                  version: '1.2.44',
                },
              },
            },
          },
        },
        '@wove/react': {
          version: '1.2.23',
          overridden: false,
          dependencies: {
            '@dimjs/utils': {
              version: '1.2.33',
            },
          },
        },
      },
    },
  },
};
// mono项目, 但是执行cwd在`mono`根目录下执行`npm ls @dimjs/utils` --json=true
export const monoRootVersion = {
  version: '1.0.0',
  name: '@test/admin',
  dependencies: {
    '@dimjs/utils': {
      version: '1.3.0',
      overridden: false,
    },
    '@semic/admin-ui': {
      version: '1.0.14',
      resolved: 'file:../../packages/semic-admin-ui',
      overridden: false,
      dependencies: {
        '@dimjs/utils': {
          version: '1.2.33',
          overridden: false,
        },
        '@semic/layout': {
          version: '1.0.13',
          resolved: 'file:../../../semic-layout',
          overridden: false,
          dependencies: {
            '@dimjs/utils': {
              version: '1.2.44',
            },
          },
        },
        '@wove/react': {
          version: '1.2.23',
          overridden: false,
          dependencies: {
            '@dimjs/utils': {
              version: '1.2.33',
            },
          },
        },
      },
    },
    '@semic/layout': {
      version: '1.0.13',
      resolved: 'file:../../packages/semic-layout',
      overridden: false,
      dependencies: {
        '@dimjs/utils': {
          version: '1.2.44',
          overridden: false,
        },
        '@wove/react': {
          version: '1.2.23',
          overridden: false,
          dependencies: {
            '@dimjs/utils': {
              version: '1.2.44',
            },
          },
        },
      },
    },
  },
};
