import https from 'node:https';
import { ensureSlash } from '@armit/file-utility';

export const getDistVersion = async (
  packageName: string,
  distTag: string,
  registry = 'https://registry.npmjs.org'
) => {
  const url = `${ensureSlash(
    registry,
    false
  )}/-/package/${packageName}/dist-tags`;

  return new Promise<string>((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            const version = json[distTag];
            if (!version) {
              reject(new Error('Error getting version'));
            }
            resolve(version);
          } catch {
            reject(new Error('Could not parse version response'));
          }
        });
      })
      .on('error', (err) => reject(err));
  });
};
