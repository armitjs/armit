import { test, expect } from '@playwright/test';
import { isNonEmptyString } from '@/utils/type-guards';

test('should call the mesh for random cats', async ({ request }) => {
  const resp = await request.post('https://demo.vendure.io/shop-api', {
    data: {
      query: `{
        product(id:1) {
          id
        }
      }`,
    },
  });
  expect(resp).toBeOK();
  const headers = resp.headers();
  expect(headers['content-type'].includes('application/json;')).toEqual(true);
  const json = await resp.json();
  const { id } = json?.data?.product ?? {};
  expect(isNonEmptyString(id)).toBeTruthy();
});
