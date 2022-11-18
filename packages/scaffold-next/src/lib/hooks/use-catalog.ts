import { useVendure } from '@kzfoo/core';
import type { ID } from '@kzfoo/service';

export function useCatalog(id?: ID) {
  const { catalogs } = useVendure();
  if (!id) {
    return null;
  }
  const catalogItem = catalogs.find((s) => String(s.id) === String(id));
  return catalogItem || null;
}
