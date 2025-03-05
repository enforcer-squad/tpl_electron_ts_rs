declare namespace NodeJS {
  export interface ProcessEnv {
    API_PATH: string;
    TIME_OUT: number;
    NODE_ENV: 'development' | 'production';
  }
}

interface Window {
  tx_language: Record<string, string>;
}

// declare module '*.less' {
//   const classes: { [key: string]: string };
//   export default classes;
// }
