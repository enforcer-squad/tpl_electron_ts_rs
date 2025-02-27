import {resolve} from "node:path";
import { defineConfig } from "@rspack/cli";
import rspack from "@rspack/core";
import { rootDir } from "../tools";


const mainConfig = (isDev: boolean, envConfig: Record<string, string>) => {
  return defineConfig({
    target: "electron-main",
    devtool: false,
    mode: isDev ? "development" : "production",
    entry: {
      index: resolve(rootDir, "src/main/index.ts"),
      preload: resolve(rootDir, "src/main/preload.ts"),
    },
    output: {
      clean: true,
      path: resolve(rootDir, "dist/app"),
      filename: "[name].js",
    },
    resolve: {
      alias: {
        "@": resolve(rootDir, "src"),
      },
      extensions: [".ts", ".mjs", ".js", ".json", ".node"],
      tsConfig: resolve(rootDir, "tsconfig.json"),
    },
    optimization: {
      minimize: !isDev,
    },
    module: {
      rules: [
        {
            test: /\.ts[x]?$/,
            include: [resolve(rootDir, 'src')],
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
            type: 'asset/resource',
          },
      ],
    },
    plugins: [
      new rspack.DefinePlugin({
        ...envConfig
      }),
      new rspack.CopyRspackPlugin({
        patterns: [
          {
            from: resolve(rootDir,'src/public'),
            to: resolve(rootDir, "dist"),
          },
        ],
      }),
    ],
  });
};

export default mainConfig;
