const electron = require('electron');
const {dialog, BrowserWindow} = electron.remote;
const url = require('url');
const path = require('path');
const {ipcRenderer} = require('electron')

function openFile() {
	console.log(dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']}))
}
function openNewDataWindow() {
	ipcRenderer.send('open-new-data-clicked');
}

function exitProgram() {
	ipcRenderer.send('exit-clicked');
}

function openHelpWindow() {
	ipcRenderer.send('help-clicked');
}

function openBrowseWindow() {
	ipcRenderer.send('open-browse-clicked');
}

