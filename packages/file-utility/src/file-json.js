import { readFileSync, writeFileSync } from 'node:fs';
export function readJsonFromFile(fileFrom) {
  const content = readFileSync(fileFrom, { encoding: 'utf-8' });
  return JSON.parse(content);
}
export const writeJsonToFile = (saveTo, content) => {
  writeFileSync(saveTo, JSON.stringify(content, null, 2), {
    encoding: 'utf-8',
  });
};
export const writeJsonToBuffer = (content) => {
  return Buffer.from(JSON.stringify(content, null, 2), 'utf-8');
};
