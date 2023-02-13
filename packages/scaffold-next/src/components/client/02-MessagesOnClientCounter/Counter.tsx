import { useLocale, NextIntlClientProvider } from 'next-intl';
import ClientCounter from './ClientCounter';

export default async function Counter() {
  const locale = useLocale();
  const messages = (await import(`../../../locales/${locale}.json`)).default;

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={
        // Only provide the minimum of messages
        { ClientCounter: messages['ClientCounter'] }
      }
    >
      <ClientCounter />
    </NextIntlClientProvider>
  );
}
