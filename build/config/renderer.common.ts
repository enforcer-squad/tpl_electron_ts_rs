import { defineConfig } from '@rspack/cli';
// import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { rspack } from '@rspack/core';
import { ENV, Polyfill } from '../setting';
import { isProd, resolveRootDir, joinSubDir } from '../tools';
// import { getCSSModuleRules } from './helper.mjs';

const base = defineConfig({
  target: 'web',
  entry: {
    index: resolveRootDir('src/index.ts'),
  },
  output: {
    clean: true,
    path: resolveRootDir(ENV[process.env.NODE_ENV].PATH),
    publicPath: ENV[process.env.NODE_ENV].PUBLIC_PATH,
    filename: '[name].js',
  },
  resolve: {
    alias: {
      '@': resolveRootDir('src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.glsl'],
    tsConfig: resolveRootDir('tsconfig.json'),
  },
  experiments: {
    css: true,
  },
  module: {
    parser: {
      'css/module': {
        namedExports: false,
      },
    },
    rules: [
      {
        test: /\.[t|j]s[x]?$/,
        include: [resolveRootDir('src')],
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              sourceMap: !isProd,
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    pragma: 'React.createElement',
                    pragmaFrag: 'React.Fragment',
                    runtime: 'automatic',
                    development: !isProd,
                    refresh: !isProd,
                  },
                },
              },
              env: Polyfill,
              rspackExperiments: {
                import: [
                  {
                    libraryName: 'antd',
                    style: true,
                  },
                ],
              },
            },
          },
        ],
      },
      // ...getCSSModuleRules(),
    ],
  },
  plugins: [
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.TIME_OUT': JSON.stringify(ENV[process.env.NODE_ENV].REQUEST_TIMEOUT),
      'process.env.API_PATH': JSON.stringify(ENV[process.env.NODE_ENV].API_BASE_URL),
      'process.env.SUB_DIR': JSON.stringify(ENV[process.env.NODE_ENV].SUB_DIR),
      'process.env.PUBLIC_PATH': JSON.stringify(ENV[process.env.NODE_ENV].PUBLIC_PATH),
    }),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: resolveRootDir('src/public'),
          to: joinSubDir('/'),
        },
      ],
    }),
    new rspack.HtmlRspackPlugin({
      template: resolveRootDir(`src/index.html`),
      filename: `index.html`,
      minify: true,
    }),
    //  new ModuleFederationPlugin({
    //   name: 'federation_consumer',
    //   remotes: {
    //     federation_provider:
    //       'federation_provider@/federation_provider/remoteEntry.js',
    //   },
    //   shared: {
    //     react: { singleton: true },
    //     'react-dom': { singleton: true },
    //   },
    // }),
  ],
});

export default base;
