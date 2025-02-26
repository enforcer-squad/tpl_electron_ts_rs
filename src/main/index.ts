import { app, BrowserWindow } from 'electron';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
    },
  });
  
};

app.whenReady().then(() => {
  createWindow();
});
