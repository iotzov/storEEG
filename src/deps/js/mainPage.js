const {ipcRenderer} = require('electron')

function exitProgram() {
	ipcRenderer.send('exit-clicked');
}

function openHelpWindow() {
	ipcRenderer.send('help-clicked');
}
