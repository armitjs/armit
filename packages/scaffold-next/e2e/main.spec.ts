import { test, expect } from '@playwright/test';

test('keeps route handlers intact', async ({ request }) => {
  const response = await request.get('/api');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toEqual({ message: 'Hello world' });
});
