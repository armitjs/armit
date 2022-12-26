import { Json } from '../json.js';

describe('tsconfig json', () => {
  test('Read tsconfig.json (async)', async () => {
    const file = new Json('./tsconfig.json');
    const json = await file.load();

    expect(json.extends).toBe('../../tsconfig.base.json');
    expect(json.compilerOptions?.baseUrl).toBe('./src');
  });

  test('Read tsconfig.json', () => {
    const file = new Json('./tsconfig.json');
    const json = file.loadSync();

    expect(json.extends).toBe('../../tsconfig.base.json');
    expect(json.compilerOptions?.baseUrl).toBe('./src');
  });
});
