import type { RspackOptions } from '@rspack/core';
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import { merge } from 'webpack-merge';
import base from './renderer.common';
import { ENV } from '../setting';
const rendererConfig = (isDev: boolean, envConfig: Record<string, string>) => {
  let config: RspackOptions = null as any;
  if (isDev) {
    console.log('11111');
    config = defineConfig({
      mode: 'development',
      devtool: 'source-map',
      plugins: [new ReactRefreshPlugin()],
      optimization: {
        moduleIds: 'named',
        chunkIds: 'named',
        minimize: false,
      },
    });
  } else {
    config = defineConfig({
      mode: 'production',
    });
  }

  config.plugins!.push(
    new rspack.DefinePlugin({
      'process.env.TIME_OUT': JSON.stringify(ENV[process.env.NODE_ENV].REQUEST_TIMEOUT),
      'process.env.API_PATH': JSON.stringify(ENV[process.env.NODE_ENV].API_BASE_URL),
      'process.env.SUB_DIR': JSON.stringify(ENV[process.env.NODE_ENV].SUB_DIR),
      'process.env.PUBLIC_PATH': JSON.stringify(ENV[process.env.NODE_ENV].PUBLIC_PATH),
      ...envConfig,
    }),
  );

  return merge(base, config);
};

export default rendererConfig;
