import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow } from 'electron';
import sum from './test';
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../../');

const preloadPath = resolve(rootDir, 'dist/app/preload.js');
console.log(sum(1, 2));
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      devTools: true,
      preload: preloadPath,
    },
  });
  mainWindow.loadFile('../index.html');
};

app.whenReady().then(() => {
  createWindow();
});
