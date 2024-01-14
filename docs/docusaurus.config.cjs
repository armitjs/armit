// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MUI color input',
  tagline: 'A color input designed for the React library MUI',
  url: 'https://armitjs.github.io',
  baseUrl: '/mui-color-input/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // Now, all files in public as well as static will be copied to the build output.
  staticDirectories: ['public', 'static'],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'armitjs', // Usually your GitHub org/user name.
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
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'api-cli',
        entryPoints: ['../packages/cli/src/index.ts'],
        tsconfig: '../packages/cli/tsconfig.json',
        out: 'api-cli',
        sidebar: {
          categoryLabel: 'API CLI',
        },
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'api-commander',
        entryPoints: ['../packages/commander/src/index.ts'],
        tsconfig: '../packages/commander/tsconfig.json',
        out: 'api-commander',
        sidebar: {
          categoryLabel: 'API commander',
        },
      },
    ],
    [
      require.resolve('docusaurus-plugin-search-local'),
      /** @type {import('docusaurus-plugin-search-local').Options} */
      ({
        hashed: true,
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
    ['docusaurus-tailwindcss', {}],
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        theme: {
          customCss: [require.resolve('./src/theme/armit.css')],
        },
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [
            // require('@sapphire/docusaurus-plugin-npm2yarn2pnpm').npm2yarn2pnpm,
            // require('remark-github'),
            // require('mdx-mermaid'),
          ],
        },
        // Optional: disable the blog plugin
        blog: false,
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
            // 'api' is the 'out' directory
            to: 'docs/api-cli/',
            activeBasePath: 'docs',
            position: 'left',
            label: 'API CLI',
          },
          {
            // 'api' is the 'out' directory
            to: 'docs/api-commander/',
            activeBasePath: 'docs',
            position: 'left',
            label: 'API Commander',
          },
          {
            href: 'https://github.com/armitjs/armit',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://www.npmjs.com/package/@armit/cli',
            label: 'NPM',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} by armitjs`,
      },
      prism: {
        // theme: lightCodeTheme,
        // darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
