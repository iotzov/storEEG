const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const debug = /--debug/.test(process.argv[2])
const ipcMain = electron.ipcMain


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 250, height: 240})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
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
app.on('ready', createWindow)

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

// New Dataset main menu button clicked --> open data entry window
ipcMain.on('open-new-data-clicked', (event) => {
	openNewDataWindow()
})

ipcMain.on('help-clicked', (event) => {
	openHelpWindow()
})

ipcMain.on('open-browse-clicked', (event) => {
	openBrowseWindow()
})

// Exit main menu button clicked --> quit app
ipcMain.on('exit-clicked', (event) => {
	app.quit()
})

function openNewDataWindow() {
	let newDataWindow = new BrowserWindow({width: 800, height: 600, parent: mainWindow, show: false});
	newDataWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'newStudy.html'),
		protocol: 'file:',
		slashes: true
	}));
	newDataWindow.on('closed', function () {
		newDataWindow = null;
	});
	newDataWindow.once('ready-to-show', () => {
	newDataWindow.show();
	});
	//newDataWindow.webContents.openDevTools();
	//newDataWindow.maximize();
}
function openHelpWindow() {
	let helpWindow = new BrowserWindow({width: 800, height: 600, parent: mainWindow, show: false});
	helpWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'help.html'),
		protocol: 'file:',
		slashes: true
	}));
	helpWindow.on('closed', function () {
		helpWindow = null;
	});
	helpWindow.once('ready-to-show', () => {
		helpWindow.show();
	});
}
function openBrowseWindow() {
	let browseWindow = new BrowserWindow({width: 800, height: 600, parent: mainWindow, show: false});
	browseWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'browse.html'),
		protocol: 'file:',
		slashes: true
	}));
	browseWindow.on('closed', function () {
		browseWindow = null;
	});
	browseWindow.once('ready-to-show', () => {
		browseWindow.show();
	});
}
