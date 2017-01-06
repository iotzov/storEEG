const {dialog} = require('electron').remote; 
// var {dialog} = require('electron').remote
// var dialog = remote.dialog;

function myFunction() {
	document.getElementById("p1").style.color="red";
}

function mySecondFunction(name) {
	document.getElementById(name).style.color="black";
}

function openFile() {
	console.log(dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']}))
}
