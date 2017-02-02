const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const debug = /--debug/.test(process.argv[2])



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1200, height: 750, icon: __dirname + '/deps/img/repEEG_Icon.png'})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'html', 'mainPage.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  if(debug) {
	  mainWindow.webContents.openDevTools();
	  mainWindow.maximize();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  fs.access(path.join(__dirname, 'studies'), (err) => {
    if(err){
      fs.mkdir(path.join(__dirname, 'studies'), (err) => {
        if(err) {
        console.log(err)
        console.log('Something went south making the study dir. Do you have access?')
        }
      })
    }
  })
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

// Exit main menu button clicked --> quit app
ipcMain.on('exit-clicked', (event) => {
	app.quit()
})
