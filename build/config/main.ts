import { defineConfig } from '@rspack/cli';
import rspack from '@rspack/core';
import { resolveRootDir } from '../tools';

const mainConfig = (isDev: boolean, envConfig: Record<string, string>) => {
  return defineConfig({
    target: 'electron-main',
    devtool: false,
    mode: isDev ? 'development' : 'production',
    entry: {
      index: resolveRootDir('src/main/index.ts'),
      preload: resolveRootDir('src/main/preload.ts'),
    },
    output: {
      clean: true,
      path: resolveRootDir('dist/app'),
      filename: '[name].js',
    },
    resolve: {
      alias: {
        '@main': resolveRootDir('src/main'),
      },
      extensions: ['.ts', '.mjs', '.js', '.json', '.node'],
      tsConfig: resolveRootDir('tsconfig.json'),
    },
    optimization: {
      minimize: !isDev,
    },
    module: {
      rules: [
        {
          test: /\.ts[x]?$/,
          include: [resolveRootDir('src/main')],
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                  },
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          include: [resolveRootDir('src/main')],
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new rspack.DefinePlugin({
        ...envConfig,
      }),
      // new rspack.CopyRspackPlugin({
      //   patterns: [
      //     {
      //       from: resolveRootDir('src/public'),
      //       to: resolveRootDir('dist'),
      //     },
      //   ],
      // }),
    ],
  });
};

export default mainConfig;
