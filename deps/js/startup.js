/*

  This file contains requires and global variables and functionality
  related to the management of windows/GUI elements generally

*/

// requires
const ipcRenderer = require('electron').ipcRenderer;
const localforage = require('localforage');
const dragula = require('dragula');
const uuid = require('uuid/v4');
const remote = require('electron').remote;
const {BrowserWindow, dialog} = require('electron').remote;
const fs = require('fs-extra');
const path = require('path');
const url = require('url');
const jsonfile = require('jsonfile');
jsonfile.spaces = 2;
const _ = require('lodash');
const cp = require('child_process');
const pyshell = require('python-shell');
const Mousetrap = require('mousetrap');
const opn = require('opn');
const md5 = require('md5-file');

// bind konami code for opening dev DevTools
Mousetrap.bind('up up down down left right left right b a enter', function() {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
});

// study folder settings functions
function getStudyFolder() {

	if(fs.existsSync(path.join(__dirname, '..','settings.json'))) {

		var settings = jsonfile.readFileSync('settings.json');
		if(settings.studyFolder === 'default') {
			return path.join(__dirname, '..','studies');
		} else {
			return settings.studyFolder;
		}

	} else {
		return path.join(__dirname, '..','studies');
	}

}

function setStudyFolder(studyFolderPath) {

	if(fs.existsSync(path.join(__dirname, '..','settings.json'))) {
		var settings = jsonfile.readFileSync('settings.json');
		settings.studyFolder = studyFolderPath;
		jsonfile.writeFileSync('settings.json', settings);
	} else {
		settings = {
			studyFolder: studyFolderPath
		};
		jsonfile.writeFileSync('settings.json', settings);
	}

  studyFolder = studyFolderPath;

}


// global variables
var studyFolder = getStudyFolder();
const pythonFolder = path.join(__dirname, '..', 'deps', 'python')
var currentStudy = {};
// var studies = [];
var studyElements = {};
var studyInProgress = 0;

const links = document.querySelectorAll('link[rel="import"]')
// Import and add each page to the DOM
Array.prototype.forEach.call(links, function (link) {
	let template = link.import.querySelector('.section-template')
	if(template){
		let clone = document.importNode(template.content, true)
		document.querySelector('#main-area').appendChild(clone)
	}
})

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}
