import {join} from 'node:path';
import { app, BrowserWindow } from 'electron';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      devTools:true,
      preload: 'preload.js',
    },
  });
  mainWindow.loadFile('../index.html');
};

app.whenReady().then(() => {
  createWindow();
});
