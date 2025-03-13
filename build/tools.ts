import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ENV, Targets } from './setting';

const isProd = process.env.NODE_ENV === 'production';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const rootDir = resolve(__dirname, '../');

const resolveRootDir = (...paths: string[]) => {
  return resolve(rootDir, ...paths);
};

const joinSubDir = (...paths: string[]) => {
  return join(ENV[process.env.NODE_ENV!].SUB_DIR, ...paths);
};

const getCSSModuleRules = () => {
  const sourceMap = isProd;

  const cssLoader = {
    loader: 'builtin:lightningcss-loader',
    options: {
      targets: Targets,
      sourceMap,
    },
  };

  const cssModuleLoader = {
    loader: 'builtin:lightningcss-loader',
    options: {
      targets: Targets,
      sourceMap,
      cssModules: {
        pattern: '[hash]-[local]',
      },
    },
  };

  const lessLoader = {
    loader: 'less-loader',
    options: {
      sourceMap,
    },
  };

  const cssNodeModuleRule = {
    test: /\.css$/,
    use: [cssLoader],
    include: [resolveRootDir('node_modules')],
    type: 'css',
  };

  const cssRule = {
    test: /\.global\.css$/,
    use: [cssLoader],
    include: [resolveRootDir('src/renderer')],
    type: 'css',
  };

  const cssModuleRule = {
    test: /^(?!.*\.global).*\.css$/,
    use: [cssModuleLoader],
    include: [resolveRootDir('src/renderer')],
    type: 'css/module',
  };

  const lessNodeModuleRule = {
    test: /\.less$/,
    use: [cssLoader, lessLoader],
    include: [resolveRootDir('node_modules')],
    type: 'css',
  };

  const lessRule = {
    test: /\.global\.less$/,
    use: [cssLoader, lessLoader],
    include: [resolveRootDir('src/renderer')],
    type: 'css',
  };

  const lessModuleRule = {
    test: /^(?!.*\.global).*\.less$/,
    use: [cssModuleLoader, lessLoader],
    include: [resolveRootDir('src/renderer')],
    type: 'css/module',
  };

  return [cssNodeModuleRule, cssRule, cssModuleRule, lessNodeModuleRule, lessRule, lessModuleRule];
};

export { isProd, rootDir, resolveRootDir, joinSubDir, getCSSModuleRules };
