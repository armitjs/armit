import { headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const now = headers().get('x-now');
  const timeZone = headers().get('x-time-zone') ?? undefined;
  const messages = (await import(`./locales/${locale}.json`)).default;

  return {
    now: now ? new Date(now) : undefined,
    timeZone,
    messages,
    defaultTranslationValues: {
      globalString: 'Global string',
      highlight: (chunks) => <strong>{chunks}</strong>,
    },
    formats: {
      dateTime: {
        medium: {
          dateStyle: 'medium',
          timeStyle: 'short',
          hour12: false,
        },
      },
    },
    onError(error) {
      if (
        error.message ===
        (process.env.NODE_ENV === 'production'
          ? 'MISSING_MESSAGE'
          : 'MISSING_MESSAGE: Could not resolve `missing` in `Index`.')
      ) {
        // Do nothing, this error is triggered on purpose
      } else {
        console.error(JSON.stringify(error.message));
      }
    },
    getMessageFallback({ key, namespace }) {
      return (
        '`getMessageFalback` called for ' +
        [namespace, key].filter((part) => part).join('.')
      );
    },
  };
});
