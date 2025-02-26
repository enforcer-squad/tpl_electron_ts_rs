const { app, BrowserWindow } = require('electron');
console.log('app, BrowserWindow',app, BrowserWindow);

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
