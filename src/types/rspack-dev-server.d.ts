declare module '@rspack/dev-server' {
  import { Compiler } from '@rspack/core';

  export interface DevServerOptions {
    host?: string;
    port?: number;
    hot?: boolean;
    client?: {
      logging?: string;
      overlay?: boolean;
      progress?: boolean;
    };
    headers?: Record<string, string>;
    historyApiFallback?: boolean | { disableDotRule?: boolean };
    proxy?: Array<{
      context: string[];
      target: string;
      pathRewrite?: Record<string, string>;
      changeOrigin?: boolean;
    }>;
  }

  export class RspackDevServer {
    constructor(options: DevServerOptions, compiler: Compiler);
    startCallback(callback: () => void): void;
    close(): void;
  }
}
