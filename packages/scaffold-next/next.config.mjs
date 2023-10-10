import { readFileSync } from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs'; // https://docs.sentry.io/platforms/javascript/guides/nextjs/
import ms from 'ms';
import withNextIntl from 'next-intl/plugin';
import pc from 'picocolors';

const workspaceRoot = path.resolve(
  path.dirname(url.fileURLToPath(import.meta.url)),
  '..',
  '..'
);
/**
 * Once supported replace by node / eslint / ts and out of experimental, replace by
 * `import packageJson from './package.json' assert { type: 'json' };`
 * @type {import('type-fest').PackageJson}
 */
const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url)).toString('utf-8')
);

const trueEnv = ['true', '1', 'yes'];

const isProd = process.env.NODE_ENV === 'production';
const isCI = trueEnv.includes(process.env?.CI ?? 'false');

const NEXTJS_IGNORE_ESLINT = trueEnv.includes(
  process.env?.NEXTJS_IGNORE_ESLINT ?? 'false'
);

const NEXTJS_IGNORE_TYPECHECK = trueEnv.includes(
  process.env?.NEXTJS_IGNORE_TYPECHECK ?? 'false'
);

const NEXTJS_SENTRY_UPLOAD_DRY_RUN = trueEnv.includes(
  process.env?.NEXTJS_SENTRY_UPLOAD_DRY_RUN ?? 'false'
);

const NEXTJS_DISABLE_SENTRY = trueEnv.includes(
  process.env?.NEXTJS_DISABLE_SENTRY ?? 'false'
);

const NEXTJS_SENTRY_DEBUG = trueEnv.includes(
  process.env?.NEXTJS_SENTRY_DEBUG ?? 'false'
);

const NEXTJS_SENTRY_TRACING = trueEnv.includes(
  process.env?.NEXTJS_SENTRY_TRACING ?? 'false'
);

/**
 * A way to allow CI optimization when the build done there is not used
 * to deliver an image or deploy the files.
 * @link https://nextjs.org/docs/advanced-features/source-maps
 */
const disableSourceMaps = trueEnv.includes(
  process.env?.NEXT_DISABLE_SOURCEMAPS ?? 'false'
);

if (disableSourceMaps) {
  console.log(
    `${pc.green(
      'notice'
    )}- Sourcemaps generation have been disabled through NEXT_DISABLE_SOURCEMAPS`
  );
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  httpAgentOptions: {
    // @link https://nextjs.org/blog/next-11-1#builds--data-fetching
    keepAlive: true,
  },
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: (isCI ? 3600 : 25) * 1000,
  },

  // @link https://nextjs.org/docs/advanced-features/compiler#minification
  // Sometimes buggy so enable/disable when debugging.
  swcMinify: true,

  compiler: {
    // This transform allows for removing all console.* calls in application code (not node_modules).
    removeConsole: isProd
      ? {
          // Remove console.* output except console.error:
          exclude: ['error'],
        }
      : false,
  },

  experimental: {
    // @link https://nextjs.org/docs/advanced-features/output-file-tracing#caveats
    outputFileTracingRoot: workspaceRoot,

    // Prefer loading of ES Modules over CommonJS
    // @link {https://nextjs.org/blog/next-11-1#es-modules-support|Blog 11.1.0}
    // @link {https://github.com/vercel/next.js/discussions/27876|Discussion}
    esmExternals: true,

    // Experimental monorepo support
    // @link {https://github.com/vercel/next.js/pull/22867|Original PR}
    // @link {https://github.com/vercel/next.js/discussions/26420|Discussion}
    externalDir: true,
  },
  // https://nextjs.org/docs/advanced-features/compiler#modularize-imports
  modularizeImports: {
    '@dimjs/utils': {
      transform: '@dimjs/utils/cjs/{{kebabCase member}}',
      preventFullImport: true,
      skipDefaultConversion: true,
    },
    '@dimjs/lang': {
      transform: '@dimjs/lang/cjs/{{kebabCase member}}',
      preventFullImport: true,
      skipDefaultConversion: true,
    },
    '@wove/react': {
      transform: '@wove/react/cjs/{{kebabCase member}}',
      preventFullImport: true,
      skipDefaultConversion: true,
    },
  },

  typescript: {
    ignoreBuildErrors: NEXTJS_IGNORE_TYPECHECK,
  },

  eslint: {
    ignoreDuringBuilds: NEXTJS_IGNORE_ESLINT,
  },

  webpack: (config, { webpack }) => {
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/tree-shaking/
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: NEXTJS_SENTRY_DEBUG,
        __SENTRY_TRACING__: NEXTJS_SENTRY_TRACING,
      })
    );
    return config;
  },
  env: {
    APP_NAME: packageJson.name ?? 'not-in-package.json',
    APP_VERSION: packageJson.version ?? 'not-in-package.json',
    BUILD_TIME: new Date().toISOString(),
  },
  headers() {
    return [
      {
        source: '/((?!_next|assets|favicon.ico).*)',
        missing: [
          {
            type: 'header',
            key: 'Next-Router-Prefetch',
          },
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: [
              `s-maxage=` + ms('1d') / 1000,
              `stale-while-revalidate=` + ms('1y') / 1000,
            ].join(', '),
          },
        ],
      },
    ];
  },
};

let config = nextConfig;

if (!NEXTJS_DISABLE_SENTRY) {
  // Attach sentry configurations.
  config = {
    ...config,
    /**
     * @type {import('@sentry/nextjs/types/config/types').UserSentryOptions}
     */
    sentry: {
      hideSourceMaps: true,
      transpileClientSDK: true,
    },
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because sentry does not match nextjs current definitions
  config = withSentryConfig(config, {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
    // silent: isProd, // Suppresses all logs
    // sentry-cli configuration
    authToken: process.env?.SENTRY_AUTH_TOKEN,
    org: process.env?.SENTRY_ORG,
    project: process.env?.SENTRY_PROJECT,
    release: `${packageJson.name}-${packageJson.version}`.replace('/', '-'),
    dryRun: NEXTJS_SENTRY_UPLOAD_DRY_RUN,
  });
}

if (process.env.ANALYZE === 'true') {
  config = withBundleAnalyzer({
    enabled: true,
  })(config);
}

export default withNextIntl()(config);
