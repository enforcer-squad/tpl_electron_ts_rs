import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow } from 'electron';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../../');

const preloadPath = resolve(rootDir, 'dist/app/preload.js');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      devTools: true,
      preload: preloadPath,
    },
  });
  mainWindow.loadURL('http://localhost:2333/');
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
});
