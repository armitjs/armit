import { Link, useTranslations } from 'next-intl';

export default function Navigation() {
  const t = useTranslations('Navigation');

  return (
    <nav style={{ display: 'flex', gap: 10 }}>
      <Link href="/">{t('home')}</Link>
      <Link href="/client">{t('client')}</Link>
      <Link href="/nested">{t('nested')}</Link>
    </nav>
  );
}
