import { readFileSync, writeFileSync } from 'node:fs';

export function readJsonFromFile<T>(fileFrom: string) {
  const content = readFileSync(fileFrom, { encoding: 'utf-8' });
  return JSON.parse(content) as T;
}

export const writeJsonToFile = (saveTo: string, content): void => {
  writeFileSync(saveTo, JSON.stringify(content, null, 2), {
    encoding: 'utf-8',
  });
};

export const writeJsonToBuffer = (content): Buffer => {
  return Buffer.from(JSON.stringify(content, null, 2), 'utf-8');
};
