import './globals.css';
import '@/styles/tailwind.css';
import { useLocale } from 'next-intl';
import type { ReactNode } from 'react';
import notFound from '../not-found';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export async function generateMetadata() {
  // For /products/123, params.id is "123"
  // For /products/123?foo=bar, searchParams.get("foo") is "bar"
  // The return value is the metadata object
  // const t = await getTranslations('LocaleLayout');

  // return {
  //   title: t('title'),
  //   description: t('description')
  // };
  return { title: '...' };
}

export default async function LocaleLayout({ children, params }: Props) {
  const locale = useLocale();
  // Show a 404 error for unknown locales
  if (params.locale !== locale) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
