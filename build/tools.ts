import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ENV } from './setting';

const isProd = process.env.NODE_ENV === 'production';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const rootDir = resolve(__dirname, '../');

const resolveRootDir = (...paths: string[]) => {
  return resolve(rootDir, ...paths);
};

const joinSubDir = (...paths: string[]) => {
  return join(ENV[process.env.NODE_ENV!].SUB_DIR, ...paths);
};

export { isProd, rootDir, resolveRootDir, joinSubDir };
