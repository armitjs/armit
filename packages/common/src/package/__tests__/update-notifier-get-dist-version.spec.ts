import { ClientRequest } from 'node:http';
import Stream from 'node:stream';
import { vi } from 'vitest';
import { getDistVersion } from '../update-notifier/get-dist-version.js';

async function getMocked(callback: (url: string | URL, cb) => ClientRequest) {
  const https = await import('node:https');
  return vi.mocked(https.default).get.mockImplementationOnce(callback);
}

describe('getDistVersion', () => {
  beforeAll(() => {
    vi.mock('node:https', () => {
      return {
        default: {
          get: vi.fn(),
        },
      };
    });
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it('Valid response returns version', async () => {
    const st = new Stream();
    await getMocked((url, cb) => {
      cb(st);
      st.emit('data', '{"latest":"1.0.0"}');
      st.emit('end');
      return new ClientRequest(url);
    });

    const version = await getDistVersion('test', 'latest');
    expect(version).toEqual('1.0.0');
  });

  it('Invalid response throws error', async () => {
    const st = new Stream();
    await getMocked((url, cb) => {
      cb(st);
      st.emit('data', 'some invalid json');
      st.emit('end');
      return new ClientRequest(url);
    });
    await expect(getDistVersion('test', 'latest')).rejects.toThrow(
      'Could not parse version response'
    );
  });
});
