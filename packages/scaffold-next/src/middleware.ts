import createMiddleware from 'next-intl/middleware';
import { locales, pathnames } from './navigation';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames,
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
  matcher: ['/((?!api|_next|public|assets|favicon.ico).*)'],
};
