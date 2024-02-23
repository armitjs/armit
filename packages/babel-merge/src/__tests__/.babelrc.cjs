module.exports = {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            node: 'current'
          }
        }
      ],
      require.resolve('./local-preset.cjs')
    ],
    plugins: [
      require.resolve('./local-plugin.cjs'),
      '@babel/plugin-proposal-object-rest-spread',
      ['module:fast-async', {
        runtimePattern: null,
        useRuntimeModule: false
      }]
    ],
    env: {
      test: {
        plugins: [
          [require.resolve('./local-plugin.cjs'), { foo: 'bar' }]
        ]
      }
    }
  };