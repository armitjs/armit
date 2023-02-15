import './globals.css';
import '@/styles/tailwind.css';
import type { Metadata } from 'next';
import { useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import notFound from '../not-found';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export async function generateMetadata(): Promise<Metadata> {
  // For /products/123, params.id is "123"
  // For /products/123?foo=bar, searchParams.get("foo") is "bar"
  // The return value is the metadata object
  const t = await getTranslations('Meta');

  return {
    title: t('title'),
    description: t('description'),
  };
}

// export const dynamic = 'force-static';
// https://github.com/amannn/next-intl/pull/149#issuecomment-1431084451
// export async function generateStaticParams() {
//   return [{ locale: 'en' }, { locale: 'de' }];
// }

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
