import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const express = require('express');
const appWeb = express();
const port = process.env.PORT || 8000;

appWeb.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(
    Buffer.from(`
      <html>
        <head>
          <title>Electron App</title>
        </head>
        <style>
          body {
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100vh;
            width: 100vw;
            margin: 0;
          }
          h1 {
            font-size: 5vw;
            margin: 0;
            color: #fff;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          }
          p {
            font-size: 4vw;
            margin: 0;
            color: #fff;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          }
        </style>
        <body>
          <h1>Responsive Dev</h1>
          <p>Easily develop responsive websites</p>
        </body>
      </html>
    `)
  );
});

appWeb.listen(port, () => {
  console.log('Server app listening on port ' + port);
});

//modifier le nom de l'application
app.setName('AdaptiView')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    minWidth: 1200,
    height: 680,
    minHeight: 680,
    show: false,
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    hasShadow: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      height: 35,
    },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }

  if (process.platform === 'darwin') {
    mainWindow.setWindowButtonVisibility(true)
  }

  ipcMain.on('minimize', () => {
    mainWindow?.minimize()
  })

  ipcMain.on('maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow?.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.on('toggle-terminal', () => {
    if (mainWindow?.isDevToolsOpened()) {
      mainWindow?.closeDevTools()
    } else {
      mainWindow?.openDevTools()
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
    app.quit()
  // }
})

ipcMain.on('close', () => {
  app.quit()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
