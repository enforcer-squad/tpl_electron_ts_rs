import path from 'path';

export const DevServer = {
  client: {
    logging: 'info',
    overlay: true,
    progress: true,
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  historyApiFallback: {
    disableDotRule: true,
    index: '/',
  },
  host: '0.0.0.0',
  port: 2333,
  static: {
    directory: path.join(__dirname, '../dist'),
    publicPath: '/',
  },
  open: true,
};
