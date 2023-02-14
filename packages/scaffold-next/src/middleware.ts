import createIntlMiddleware from 'next-intl/middleware';

export default createIntlMiddleware({
  locales: ['en', 'de'],
  defaultLocale: 'en',
  domains: [
    {
      domain: 'www.nailip.com',
      defaultLocale: 'en',
    },
    {
      domain: 'rc.nailip.com',
      defaultLocale: 'de',
    },
  ],
});

export const config = {
  // Skip all non-content paths
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
