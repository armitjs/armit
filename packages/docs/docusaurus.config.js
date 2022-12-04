// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MUI color input',
  tagline: 'A color input designed for the React library MUI',
  url: 'https://viclafouch.github.io',
  baseUrl: '/mui-color-input/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // Now, all files in public as well as static will be copied to the build output.
  staticDirectories: ['public', 'static'],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'viclafouch', // Usually your GitHub org/user name.
  projectName: 'mui-color-input', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: true,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html gitlang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [
    // ... Your other plugins.
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'api-cli',
        entryPoints: ['../cli/src/index.ts'],
        tsconfig: '../cli/tsconfig.json',
        out: 'api-cli',
        sidebar: {
          categoryLabel: 'API CLI',
        },
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'api-common',
        entryPoints: ['../common/src/index.ts'],
        tsconfig: '../common/tsconfig.json',
        out: 'api-common',
        sidebar: {
          categoryLabel: 'API Common',
        },
      },
    ],
    [
      require.resolve('docusaurus-plugin-search-local'),
      /** @type {import('docusaurus-plugin-search-local').Options} */
      ({
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        highlightSearchTermsOnTargetPage: true,
        externalSearchSources: [
          {
            heading: 'Dummy External Source 1',
            uri: '/docusaurus-plugin-search-local/fixtures/index-1/',
          },
          {
            heading: 'Dummy External Source 2',
            uri: '/docusaurus-plugin-search-local/fixtures/index-2/',
          },
        ],
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        // language: ["en", "zh"],
        // ```
        // When applying `zh` in language, please install `nodejieba` in your project.
      }),
    ],
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        theme: {
          customCss: [require.resolve('./src/css/custom.css')],
        },
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false, // Optional: disable the blog plugin
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        hideOnScroll: false,
        title: 'MUI color input',
        logo: {
          alt: 'MUI color input',
          src: 'img/logo.jpg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: 'docs/api-cli/', // 'api' is the 'out' directory
            activeBasePath: 'docs',
            position: 'left',
            label: 'API CLI',
          },
          {
            to: 'docs/api-common/', // 'api' is the 'out' directory
            activeBasePath: 'docs',
            position: 'left',
            label: 'API Common',
          },
          {
            href: 'https://github.com/viclafouch/mui-color-input',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://www.npmjs.com/package/mui-color-input',
            label: 'NPM',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} by Victor de la Fouchardiere`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
