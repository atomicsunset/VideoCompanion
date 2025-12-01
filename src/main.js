const { app, BrowserWindow, screen, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let playerWindow;
let currentPlaylist = [];
let currentIndex = 0;

function createMainWindow() {
  const displays = screen.getAllDisplays();
  const primaryDisplay = screen.getPrimaryDisplay();
  
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    x: primaryDisplay.bounds.x + 100,
    y: primaryDisplay.bounds.y + 100,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'Atomation Video Companion - Control',
    icon: null
  });

  mainWindow.loadFile('src/main.html');
  
  mainWindow.on('closed', () => {
    if (playerWindow) {
      playerWindow.close();
    }
    app.quit();
  });
}

function createPlayerWindow() {
  const displays = screen.getAllDisplays();
  const secondaryDisplay = displays.length > 1 ? displays[1] : displays[0];
  
  playerWindow = new BrowserWindow({
    x: secondaryDisplay.bounds.x,
    y: secondaryDisplay.bounds.y,
    width: secondaryDisplay.bounds.width,
    height: secondaryDisplay.bounds.height,
    fullscreen: true,
    frame: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    show: false
  });

  playerWindow.loadFile('src/player.html');
  
  playerWindow.on('closed', () => {
    playerWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();
  createPlayerWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('get-displays', () => {
  return screen.getAllDisplays().map((display, index) => ({
    id: display.id,
    label: `Display ${index + 1}`,
    bounds: display.bounds,
    primary: display === screen.getPrimaryDisplay()
  }));
});

ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Video Files', extensions: ['mp4', 'avi', 'mov', 'mkv', 'wmv'] }
    ]
  });
  
  if (!result.canceled) {
    return result.filePaths;
  }
  return [];
});

ipcMain.handle('load-video', (event, videoPath) => {
  if (playerWindow) {
    playerWindow.webContents.send('load-video', videoPath);
    playerWindow.show();
  }
});

ipcMain.handle('play-video', () => {
  if (playerWindow) {
    playerWindow.webContents.send('play-video');
  }
});

ipcMain.handle('pause-video', () => {
  if (playerWindow) {
    playerWindow.webContents.send('pause-video');
  }
});

ipcMain.handle('stop-video', () => {
  if (playerWindow) {
    playerWindow.webContents.send('stop-video');
    playerWindow.hide();
  }
});

ipcMain.on('video-ended', () => {
  mainWindow.webContents.send('video-ended');
});

ipcMain.handle('seek-to-first-frame', () => {
  if (playerWindow) {
    playerWindow.webContents.send('seek-to-first-frame');
  }
});

ipcMain.handle('set-loop', (event, looping) => {
  if (playerWindow) {
    playerWindow.webContents.send('set-loop', looping);
  }
});

ipcMain.on('video-ended', () => {
  mainWindow.webContents.send('video-ended');
});

ipcMain.on('video-error', (event, error) => {
  mainWindow.webContents.send('video-error', error);
});

ipcMain.on('video-time-update', (event, time, duration) => {
  mainWindow.webContents.send('video-time-update', time, duration);
});