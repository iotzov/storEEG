/*

  This file contains requires and global variables and functionality
  related to the management of windows/GUI elements generally

*/

// requires
const ipcRenderer = require('electron').ipcRenderer
const localforage = require('localforage')
const dragula = require('dragula')
const uuid = require('uuid/v4')
const remote = require('electron').remote
const {BrowserWindow, dialog} = require('electron').remote
const fs = require('fs-extra')
const path = require('path');
const url = require('url');
const jsonfile = require('jsonfile');
jsonfile.spaces = 2;
const _ = require('lodash');

// global variables
const studyFolder = path.join(__dirname, '..', 'studies');
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
