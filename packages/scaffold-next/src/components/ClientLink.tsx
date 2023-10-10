'use client';

import { type ComponentProps } from 'react';
import { Link, type pathnames } from '../navigation';

export default function NavigationLink<Pathname extends keyof typeof pathnames>(
  props: ComponentProps<typeof Link<Pathname>>
) {
  return <Link {...props} />;
}
