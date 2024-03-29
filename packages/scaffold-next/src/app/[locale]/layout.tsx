import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  getFormatter,
  getNow,
  getTimeZone,
  getTranslations,
} from 'next-intl/server';
import { type ReactNode } from 'react';
import Navigation from '../../components/Navigation';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Omit<Props, 'children'>): Promise<Metadata> {
  const t = await getTranslations('LocaleLayout');
  const formatter = await getFormatter({ locale });
  const now = await getNow({ locale });
  const timeZone = await getTimeZone({ locale });

  return {
    title: t('title'),
    description: t('description'),
    other: {
      currentYear: formatter.dateTime(now, { year: 'numeric' }),
      timeZone: timeZone || 'N/A',
    },
  };
}

export default function LocaleLayout({ children, params }: Props) {
  const locale = useLocale();

  // Show a 404 error for unknown locales
  if (params.locale !== locale) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <div
          style={{
            padding: 24,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1.5,
          }}
        >
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
