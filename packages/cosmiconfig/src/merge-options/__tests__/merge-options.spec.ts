import { mergeOptions } from '../merge-options.js';

describe('mergeOptions()', () => {
  it('creates a new object reference', () => {
    const nestedObject = { b: 2 };
    const input: any = {
      a: nestedObject,
      x: 1,
    };

    const result = mergeOptions(input, {
      c: 5,
      x: undefined,
      d: undefined,
    } as any);
    expect(result).toEqual({
      a: nestedObject,
      c: 5,
      x: undefined,
      d: undefined,
    });

    expect(input).not.toBe(result);
    expect(input.a).not.toBe(result.a);
  });
  it('merges top-level properties', () => {
    const input: any = {
      a: 1,
      b: 2,
    };

    const result = mergeOptions(input, { b: 3, c: 5 } as any);
    expect(result).toEqual({
      a: 1,
      b: 3,
      c: 5,
    });
  });

  it('does not merge arrays', () => {
    const input: any = {
      a: [1],
    };

    const result = mergeOptions(input, { a: [2] } as any);
    expect(result).toEqual({
      a: [2],
    });
  });

  it('merges deep properties', () => {
    const input: any = {
      a: 1,
      b: { c: 2 },
    };

    const result = mergeOptions(input, { b: { c: 5 } } as any);
    expect(result).toEqual({
      a: 1,
      b: { c: 5 },
    });
  });

  it('does not mutate target', () => {
    const input: any = {
      a: 1,
      b: { c: { d: 'foo', e: { f: 1 } } },
    };

    const result = mergeOptions(input, { b: { c: { d: 'bar' } } } as any);
    expect(result).toEqual({
      a: 1,
      b: { c: { d: 'bar', e: { f: 1 } } },
    });
    expect(input).toEqual({
      a: 1,
      b: { c: { d: 'foo', e: { f: 1 } } },
    });
  });

  it('works when nested', () => {
    const input1: any = {
      a: 1,
      b: { c: { d: 'foo1', e: { f: 1 } } },
    };

    const input2: any = {
      b: { c: { d: 'foo2', e: { f: 2 } } },
    };

    const result = mergeOptions(
      input1,
      mergeOptions(input2, { b: { c: { d: 'bar' } } } as any)
    );

    expect(result).toEqual({
      a: 1,
      b: { c: { d: 'bar', e: { f: 2 } } },
    });
    expect(input1).toEqual({
      a: 1,
      b: { c: { d: 'foo1', e: { f: 1 } } },
    });
    expect(input2).toEqual({
      b: { c: { d: 'foo2', e: { f: 2 } } },
    });
  });

  it('replaces class instances rather than merging their properties', () => {
    class Foo {
      name = 'foo';
    }

    class Bar {
      name = 'bar';
    }

    const input: any = {
      class: new Foo(),
    };

    const result = mergeOptions(input, { class: new Bar() } as any);

    expect(result.class instanceof Bar).toBe(true);
    expect(result.class.name).toBe('bar');
  });

  it('merge deep nested objects', () => {
    const defaultValue = {
      settingOptions: {
        autoDataInit: false,
      },
      nextCacheOptions: {
        nextFrontEndPoint: 'https://www.kzfoo.com',
        nextCleanSSGCacheToken: 'YYDS',
      },
      // 1. redis session cache db: 1
      // 2. semic redis data cache db: 2,
      // 3. BullMQJobQueuePlugin db: 0,
      dataCacheOptions: {
        strategyType: 'mysql',
        // available only while `strategyType: 'redis'`
        redisOptions: {
          redisCacheTTL: 60 * 60 * 24 * 30,
          redisConnection: {
            port: 6379,
            db: 2,
            host: process.env.REDIS_CONN_HOST || '127.0.0.1',
            password: process.env.REDIS_CONN_PASSWORD || '',
            maxRetriesPerRequest: null,
          },
        },
      },
      sessionCacheOptions: {
        strategyType: 'mysql',
        // available only while `strategyType: 'redis'`
        redisOptions: {
          redisCacheTTL: 60 * 60 * 24 * 30,
          redisConnection: {
            db: 1,
            port: 6379,
            host: process.env.REDIS_CONN_HOST || '127.0.0.1',
            password: process.env.REDIS_CONN_PASSWORD || '',
            maxRetriesPerRequest: null,
          },
        },
      },
      exchangeRatesOptions: {
        exchangeRateAppId: '2893632f2da64ec88de0e311184efc82',
      },
    };
    const result = mergeOptions(defaultValue, {
      dataCacheOptions: {
        redisOptions: {
          redisConnection: {
            db: 5,
          },
        },
      },
    });
    expect(result.dataCacheOptions.strategyType).toBe('mysql');
    expect(result.dataCacheOptions.redisOptions.redisConnection.db).toBe(5);
    expect(defaultValue.dataCacheOptions.redisOptions.redisConnection.db).toBe(
      2
    );
  });
});