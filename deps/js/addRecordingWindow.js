const localforage = require('localforage')
const dragula = require('dragula')
const uuid = require('uuid/v4')
const path = require('path');
const remote = require('electron').remote;
const {BrowserWindow} = remote;
var current = remote.getGlobal('currentRecording');
var currentName = current.replace(/^.*[\\\/]/, '');

$('.col-sm-offset-4 > h3').prop('innerHTML', currentName);
