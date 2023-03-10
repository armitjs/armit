import { useLocale, useTranslations } from 'next-intl';

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations('NotFound');

  return (
    <html lang={locale}>
      <body>
        <h1>GLOBAL NOT FOUND </h1>
        <h2>{t('title')}</h2>
      </body>
    </html>
  );
}
