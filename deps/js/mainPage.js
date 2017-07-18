const ipcRenderer = require('electron').ipcRenderer
const localforage = require('localforage')
const dragula = require('dragula')
const uuid = require('uuid/v4')
const remote = require('electron').remote
const {BrowserWindow, dialog} = require('electron').remote
const fs = require('fs-extra')
const path = require('path');
const url = require('url');
const jsonfile = require('jsonfile')
jsonfile.spaces = 2;
const studyFolder = path.join(__dirname, '..', 'studies');
var currentStudy = null;
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

// Function definitions

function exitProgram() {
	ipcRenderer.send('exit-clicked');
}

function moveFilesToStudyFolder(studyName) {
	localforage.getItem(studyName).then((data) => {
		if(!fs.existsSync(path.join(studyFolder, studyName, 'stimuli'))) {
			fs.mkdirSync(path.join(studyFolder, studyName, 'stimuli'));
		}

		for(var i in data.stimuli) {
			var currentLocation = data.stimuli[i].stimulusFile
			if(currentLocation) {
				fs.copy(currentLocation, path.join(studyFolder, studyName, 'stimuli', currentLocation.replace(/^.*[\\\/]/, '')))
			}
		}

		if(!fs.existsSync(path.join(studyFolder, studyName, 'rawEEG'))) {
			fs.mkdirSync(path.join(studyFolder, studyName, 'rawEEG'));
		}

		for(var i in data.recordings) {
			var currentLocation = data.recordings[i].fileLocation
			if(currentLocation) {
				fs.copy(currentLocation, path.join(studyFolder, studyName, 'rawEEG', currentLocation.replace(/^.*[\\\/]/, '')))
			}
		}

	})
}

function checkSubmit(e) {
	console.log(e)
   if(e && e.originalEvent.keyCode == 13) {
      e.currentTarget.submit();
   }
}

function objToArray(toConvert) {
	// Converts the object that is passed to an array of the values of all of its properties
	var temp = [];
	for(var a in toConvert) {
		temp.push(toConvert[a]);
	}

	return temp
}

function arrayToObj(toConvert) {
	// Converts passed array to an obj
	// Property names are the UUIDs of the array elements
	// Property values are the values of the array elements

	var temp = {};
	if(toConvert.length==0){
		return []
	}
	if(toConvert[0].hasOwnProperty('UUID')) {
		for(var i in toConvert) {
				temp[toConvert[i].UUID] = toConvert[i];
		}
	}
	else {
		temp = toConvert;
	}
	return temp
}

function openAddRecordingWindow(currentRecording) {
		var recordingWindow = new BrowserWindow({
			width: 1200,
			height: 1000,
			id: 'recordingWindow',
			show: false,
			parent: remote.getCurrentWindow(),
			modal: true
		})
		recordingWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'addRecordingWindow.html'),
			protocol: 'file:',
			slashes: true
		}))
		recordingWindow.once('ready-to-show', () => {
			ipcRenderer.send('created-recording-window', currentRecording, currentStudy)
			recordingWindow.show()
		})
}

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}

function writeCurrentStudy(callback) {
	// Writes the current study to a JSON file under /studies/'filename' after converting objects to arrays
	if(!fs.existsSync(path.join(studyFolder, currentStudy))) {
		fs.mkdirSync(path.join(studyFolder, currentStudy));
	}

	localforage.getItem(currentStudy).then((data) => {
		var UUID = data.UUID;
		var title = data.studyTitle;
		var description = data.studyDescription;
		for(var i in data) {
			data[i] = objToArray(data[i]);
		}
		data.UUID = UUID;
		data.studyTitle = title;
		data.studyDescription = description;
		jsonfile.writeFile(path.join(studyFolder, currentStudy, 'studyDescription.json'), data, (err) => {
			console.log(err);
			if(callback){callback();}
		})
	})
}

function resetCurrentIndicators() {
	currentStudy = null;
	studyInProgress = 0;
}

function writeStudy(filename, studyName) {

	if(!fs.existsSync(path.join(studyFolder, currentStudy))) {
		fs.mkdirSync(path.join(studyFolder, currentStudy));
	}

	localforage.getItem(studyName).then((data) => {
		var UUID = data.UUID;
		var title = data.studyTitle;
		var description = data.studyDescription;
		for(var i in data) {
			data[i] = objToArray(data[i]);
		}
		data.UUID = UUID;
		data.studyTitle = title;
		data.studyDescription = description;
		jsonfile.writeFile(path.join(studyFolder, filename, 'studyDescription.json'), data, (err) => {
			console.log(err);
		})
	})
}

function readStudy(filename) {
	jsonfile.readFile(path.join(studyFolder, filename, 'studyDescription.json'), (err, data) => {
		for(var i in data) {
			data[i] = arrayToObj(data[i]);
		}
		localforage.setItem(data.studyTitle, data, (value) => {
			successfulAddAlert();
		})
	})
}

function readStudyNoAlert(filename) {
	jsonfile.readFile(path.join(studyFolder, filename, 'studyDescription.json'), (err, data) => {
		for(var i in data) {
			data[i] = arrayToObj(data[i]);
		}
		localforage.setItem(data.studyTitle, data)
	})
}

function writeDB() {
	// Writes all files in the localforage DB to JSON under /studies/
	localforage.iterate(function(key, data, iterationNumber) {
		writeStudy(key, key);
	}).catch((err) => {
		console.log(err);
	})
}

function refreshDB() {
	// Clears localforage and repopulates from /studies/ folder
	localforage.clear()

	var studies = getDirectories(studyFolder);
	for(var i in studies) {
		readStudyNoAlert(studies[i]);
	}
}

function hideAllSections() {
	$("#main-area > div").hide() // Hide all sections
	//$(".nav-pills > li").removeClass("active") // De-activate all nav buttons
}

const handleFormSubmit = event => {
	event.preventDefault()

	var data = formToJSON(event.currentTarget.elements);
	data.UUID = uuid();

	if(data.referenceChannels) {
		data.referenceChannels = data.referenceChannels.split(',');
		data.nonScalpChannels = data.nonScalpChannels.split(',');
	}

	if(event.currentTarget.name === 'events') {
		data.stimulusUUID = $('.linked-stim').children().data().uuid
		stimDragger.start($('.linked-stim').children()[0])
		stimDragger.cancel()
	}

	localforage.getItem(currentStudy, (err, value) => {
		var temp = value[event.currentTarget.name];
		temp[data.UUID] = data;
		value[event.currentTarget.name] = temp;
		localforage.setItem(currentStudy, value).then(function () {
			event.currentTarget.reset();
			updateObjectDisplays(event.currentTarget.name);
		});
	});
}

const formToJSON = elements => [].reduce.call(elements, (data, element) => {
	if(isValidEntry(element)) {
		data[element.name] = element.value;
	}
	return data;
}, {});

function isValidEntry(element) {
	return element.name && element.value;
};

function printCurrent() {
	localforage.getItem(currentStudy, (err, value) => {
		console.log(JSON.stringify(value, null, "  "));
	})
}

function updateObjectDisplays(sectionToUpdate) {

	localforage.getItem(currentStudy).then(function (value){
		value = value[sectionToUpdate];
		$('#' + sectionToUpdate + 'Drag').empty()
		for(var i in value) {
			createDragObject(value[i], sectionToUpdate);
		}
	});
}

function createDragObject(item, where) {

	var temp = $('<div/>', {
		'class': 'drag-item',
		//'text': where.charAt(0).toUpperCase() + where.slice(1, where.length-1) + ' ID: ' + item.label,
		//'text': '<a data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-pencil"></span></a>',
		'data-UUID': item.UUID,
		'data-objType': where,
		'style': 'text-align: center;'
	})
temp.prop('innerHTML', '<a class="mouse-pointer edit-link" data-toggle="modal" data-target="#myModal">' + where.charAt(0).toUpperCase() + where.slice(1, where.length-1) + ' ID: ' + item.label + '</a>')

	//temp.prop('innerHTML', where.charAt(0).toUpperCase() + where.slice(1, where.length-1) + ' ID: ' + item.label+'   '+'<a class="mouse-pointer" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-pencil"></span></a>')

	temp.appendTo($('#' + where + 'Drag'));

	$('#' + where + 'Drag > div').on('click', (event) => {

	})
}

function initializeDragging(){
	const drakes = {
		'subjects': dragula([$("#subjectsDrag")[0]], {removeOnSpill: true}),
		'stimuli': dragula([$("#stimuliDrag")[0]], {removeOnSpill: true}),
		'recordingParameterSets': dragula([$("#recordingParameterSetsDrag")[0]], {removeOnSpill: true}),
		'events': dragula([$("#eventsDrag")[0]], {removeOnSpill: true}),
		'recordings': dragula([$('#recordingsDrag')[0]], {removeOnSpill: true})
	};

	for(var key in drakes) {
		drakes[key].on('remove', (el, container, source) => {
			var name = container.id;
			name = name.slice(0, container.id.length-4);
			localforage.getItem(currentStudy, (err, value) => {
				delete value[name][el.dataset.uuid];
				localforage.setItem(currentStudy, value).then(function () {console.log('success!');});
			});
		});
	}
	return drakes
}

function successfulAddAlert() {
	$("#main-area").prepend('<div class="alert alert-success alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close" name="button"><span aria-hidden="true">x</span></button><strong>Success!</strong> Study has been added successfully to the repository! </div>')
}

function alreadyExistsAlert() {
	$("#main-area").prepend('<div class="alert alert-danger alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close" name="button"><span aria-hidden="true">x</span></button><strong>Error!</strong> A Study with that name already exists! </div>')
}

function resetDraggers() {

	var default1 = '<div class="drag-item">Add some items to the left!</div><div class="drag-item">Drag & drop items outside this box to delete them.</div>';

	$('.drag-container').html(default1)

}

function showAddSection(event) {
	currentStudy = $(event.target).data('study');
	hideAllSections()
	$('#main-add-section').show()
	refreshAllDraggers();
}

function refreshAllDraggers() {
	updateObjectDisplays('subjects');
	updateObjectDisplays('stimuli');
	updateObjectDisplays('events');
	updateObjectDisplays('recordingParameterSets');
	updateObjectDisplays('recordings');
}

function createEditLink(desiredText, row, column) {
	//var temp = $('<a href="'+desiredText+'"></a>');
	//temp.on('click', (event) => {
	//	currentStudy = $(this).prop('innerHTML')
	//	showAddSection()
	//})
	//return temp[0]

	return [
            '<button class="btn btn-primary btn-block" data-study="',
								desiredText,
								'" onclick="showAddSection(event)">',
                desiredText,
            '</button>'].join('');
}

function createHomeTable() {

	var data = [];
	localforage.keys().then((keys) => {
	localforage.iterate((value, key, iterationNumber) => {
			data.push({
				studyTitle: value.studyTitle,
				numSubjects: Object.keys(value.subjects).length,
				numEvents: Object.keys(value.events).length,
				studyDescription: value.studyDescription
			});
			if(iterationNumber===keys.length) {
				return data
			}
		}).then((data) => {
			$('#home-table').bootstrapTable({
				columns: [{
					checkbox: true
				}, {
					field: 'studyTitle',
					title: 'Study',
					sortable: true,
					formatter: createEditLink
				}, {
					field: 'studyDescription',
					title: 'Study Description',
					sortable: true
				}, {
					field: 'numSubjects',
					title: 'Number of Subjects',
					sortable: true
				}, {
					field: 'numEvents',
					title: 'Number of Events',
					sortable: true
				}],
				search: true,
				pagination: true,
				showToggle: true,
				showRefresh: true,
				data
			});
			$('[title="Refresh"]').on('click', (event) => {
				event.preventDefault()
				updateHomeTable()
			})
		})
	})
}

function updateHomeTable() {
	var data = [];
	localforage.keys().then((keys) => {
	localforage.iterate((value, key, iterationNumber) => {
			data.push({
				studyTitle: value.studyTitle,
				numSubjects: Object.keys(value.subjects).length,
				numEvents: Object.keys(value.events).length,
				studyDescription: value.studyDescription
			});
			if(iterationNumber===keys.length) {
				return data
			}
		}).then((data) => {
			if(data){
				$('#home-table').bootstrapTable('load', data)
			}
			else {
				$('#home-table').bootstrapTable('removeAll')
			}
		})
})
}

// Event Handlers

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

$(".data-entry").on('submit', handleFormSubmit);

//$(".nav-link").on('click', function (event) {
//	hideAllSectionsAndDeselectButtons()

//	$('#' + $(this).data('section')).show()
//	$(this).parent().addClass("active")
//});

$('#add-new-study-btn').on('click', (event) => {
	hideAllSections();
	$('#new-study-initial-page').show()
})

$('#home-button').on('click', (event) => {
	hideAllSections();
	updateHomeTable();
	$('#home-section').show()
})

$(".file-adder").on('click', function (event) {
	event.preventDefault();
	// event.stopPropagation();
	//this.parentNode.value =
	var filePath = dialog.showOpenDialog({properties: ['openFile']});
	$(this).prop('value', filePath);
	filePath = filePath[0].replace(/^.*[\\\/]/, '');
	$(this).toggleClass('btn-primary btn-success')
	$(this).prop('innerHTML', filePath)
});

$('.data-entry').on('reset', function (event) {
	$("[name='"+event.currentTarget.name+"'] .file-adder").removeClass('btn-success');
	$("[name='"+event.currentTarget.name+"'] .file-adder").addClass('btn-primary');
	$("[name='"+event.currentTarget.name+"'] .file-adder").prop('innerHTML', 'Add File');
})

$("#initial-add-form").on('submit', function (event) {
	event.preventDefault();

	studyInProgress = 1;
	resetDraggers(draggers)
	var data = formToJSON(event.currentTarget.elements);
	data.UUID = uuid();
	$("#initial-add-form")[0].reset()
	localforage.getItem(data.studyTitle, (err, study) => {
		if(study) {
			alreadyExistsAlert();
		}
		else {
			data.subjects = {};
			data.stimuli = {};
			data.recordingParameterSets = {};
			data.recordings = {};
			data.events = {};
			data.publications = {};
			data.experimenters = {};
			data.license = {};
			data.contacts = {};

			localforage.setItem(data.studyTitle, data, (value) => {
				$("#add-new-section").hide();
				$("#main-add-section").show();
			});
			currentStudy = data.studyTitle;
		}
	});

});

$("#import-study-button").on('click', function (event) {
	var filePath = dialog.showOpenDialog({properties: ['openFile']});
	readStudy(filePath[0]);
})

$("#add-new-study-button").on('click', function (event) {
	$("#add-section").hide();
	$("#add-new-section").show();
})

//$(".btn-recording-drag").on('click', (event) => {
//	var currentRecording = {};
//	currentRecording.fileLocation = dialog.showOpenDialog({properties: ['openFile']});
//	currentRecording.fileLocation = currentRecording.fileLocation[0];
//	currentRecording.eventUUIDs = [];
//	currentRecording.subjectUUID = "";
//	currentRecording.recordingParameterSetUUID = "";
//	currentRecording.label = "";
//	currentRecording.UUID = uuid();
//
//	openAddRecordingWindow(currentRecording);
//})
//
//$(".btn-recording-drag-wrapper").on('dragover', (event) => {
//	$(".btn-recording-drag").addClass('btn-success');
//	$(".btn-recording-drag").removeClass('btn-primary');
//})
//
//$(".btn-recording-drag-wrapper").on('dragleave', (event) => {
//	$(".btn-recording-drag").removeClass('btn-success');
//	$(".btn-recording-drag").addClass('btn-primary');
//})
//
//$(".btn-recording-drag-wrapper").on('drop', (event) => {
//	event.preventDefault();
//	var currentRecording = {};
//	currentRecording.fileLocation = event.originalEvent.dataTransfer.files[0].path;
//	currentRecording.eventUUIDs = [];
//	currentRecording.subjectUUID = "";
//	currentRecording.recordingParameterSetUUID = "";
//	currentRecording.label = "";
//	currentRecording.UUID = uuid();
//	$(".btn-recording-drag").removeClass('btn-success');
//	$(".btn-recording-drag").addClass('btn-primary');
//	openAddRecordingWindow(currentRecording);
//})

$("#submitStudyButton").on('click', (event) => {
	moveFilesToStudyFolder(currentStudy)
	writeCurrentStudy(resetCurrentIndicators)
	$('#home-button').click()
	successfulAddAlert()
	updateHomeTable()
})

$('#eventTabButton').on('click', (event) => {
	$('.stim-linker').empty()
	localforage.getItem(currentStudy).then((data) =>{
		for(var i in data.stimuli) {
			$('.stim-linker').append($('<div/>', {
				'class': 'drag-item',
				'text': ' ID: ' + data.stimuli[i].label,
				'data-UUID': data.stimuli[i].UUID
			}))
		}
	})
})

$('.tool-button').tooltip({
	delay: {
		'show': 300,
		'hide': 100
	},
	placement: 'right',
})

$('.collapse').collapse()

var stimDragger = dragula([$('.linked-stim')[0], $('.stim-linker')[0]], {
	accepts: function (el, target, source, sibling) {
		return target !== $('.stim-linker')[0] && $('.linked-stim').children().length<1
	},
	copy: function (el, source) {
		return source === $('.stim-linker')[0]
	}
});

stimDragger.on('drop', (el, target) => {
	if(target === $('.linked-stim')[0]) {
		$('.linked-stim').addClass('success-background')
		$('[data-target="#linkStimToEvent"]').removeClass('btn-primary')
		$('[data-target="#linkStimToEvent"]').addClass('btn-success')
	}
})

stimDragger.on('cancel', (el, container, source) => {
	if(container === $('.linked-stim')[0]) {
		$('.linked-stim').removeClass('success-background')
		$('[data-target="#linkStimToEvent"]').addClass('btn-primary')
		$('[data-target="#linkStimToEvent"]').removeClass('btn-success')
		$('.linked-stim').empty()
	}
})

ipcRenderer.on('update-recordings', (event) => {
	//var temp = {};
	//temp.currentTarget.name='recordings';
	updateObjectDisplays('recordings')
})

$('#myModal').on('show.bs.modal', (event) => {
	var thingToEdit = $(event.relatedTarget.parentNode)
	$('.modal-body').load(thingToEdit.data('objtype')+'.html')
	$('.modal-title').prop('innerHTML', thingToEdit.data('objtype'))
	$('#editSaveButton').data('currentItem', thingToEdit.data('uuid'))
	$('#editSaveButton').data('itemType', thingToEdit.data('objtype'))
	localforage.getItem(currentStudy).then((data) => {
		var currentItem = data[thingToEdit.data('objtype')][thingToEdit.data('uuid')];
		var fields = $('.modal-body > form > .form-group > input')
		for(var a in fields) {
			if(currentItem[fields[a].name]){
				fields[a].value = currentItem[fields[a].name]
			}
		}
	});
})

$('#editSaveButton').on('click', (event) => {
	localforage.getItem(currentStudy).then((data) => {
		var fields = $('.modal-body > form > .form-group > input');
		var currentItemID = $('#editSaveButton').data('currentItem');
		currentItem = data[$('#editSaveButton').data('itemType')][currentItemID];
		for(var a in fields) {
			currentItem[fields[a].name] = fields[a].value;
		}
		if(currentItem.referenceChannels) {
			currentItem.referenceChannels = currentItem.referenceChannels.split(',');
			currentItem.nonScalpChannels = currentItem.nonScalpChannels.split(',');
		}
		data[$('#editSaveButton').data('itemType')][currentItemID] = currentItem;
		localforage.setItem(currentStudy, data).then((value) => {
			$('#myModal').modal('hide');
		})
	})
})

// Handler to add more author names

$('#dataset-description-add-authors-btn').click(function(e) {

	e.preventDefault()
	$(this).before($('<div class="form-group"><input class="form-control" name="Authors[]" placeholder="Author Name"></div>'));

});

// Handler for initial study creation

function createNewStudy(studyData) {
	if(!fs.existsSync(path.join(studyFolder, studyData.Name))) {
		fs.mkdirSync(path.join(studyFolder, studyData.Name));
	};

	currentStudy = {};
	currentStudy.dataset_description = studyData;

	jsonfile.writeFileSync(path.join(studyFolder, studyData.Name, 'dataset_description.json'), studyData);
};

$('#dataset-description-create-study-btn').click(function(e) {
	e.preventDefault();
	var studyData = $('#new-study-initial-page-form').serializeObject();
	createNewStudy(studyData)
	$('#new-study-initial-page').hide();
	$('#new-study-session-info').show();
});

// Handler for 1 session studies

$('#multiple-sessions-no-btn').click(function(e) {
	e.preventDefault();
	$('#new-study-session-info').hide();
	$('#new-study-recordings').show();
});

// Handlers for adding new recordings to be processed

$(".btn-recording-drag").on('click', (event) => {
	var currentRecording = {};
	currentRecording.fileLocation = dialog.showOpenDialog({properties: ['openFile']});
	currentRecording.fileLocation = currentRecording.fileLocation[0];
	currentRecording.eventUUIDs = [];
	currentRecording.subjectUUID = "";
	currentRecording.recordingParameterSetUUID = "";
	currentRecording.label = "";
	currentRecording.UUID = uuid();

	openAddRecordingWindow(currentRecording);
})

$(".btn-recording-drag-wrapper").on('dragover', (event) => {
	$(".btn-recording-drag").addClass('btn-success');
	$(".btn-recording-drag").removeClass('btn-primary');
})

$(".btn-recording-drag-wrapper").on('dragleave', (event) => {
	$(".btn-recording-drag").removeClass('btn-success');
	$(".btn-recording-drag").addClass('btn-primary');
})

$(".btn-recording-drag-wrapper").on('drop', (event) => {
	event.preventDefault();
	var currentRecording = {};
	currentRecording.fileLocation = event.originalEvent.dataTransfer.files[0].path;
	currentRecording.eventUUIDs = [];
	currentRecording.subjectUUID = "";
	currentRecording.recordingParameterSetUUID = "";
	currentRecording.label = "";
	currentRecording.UUID = uuid();
	$(".btn-recording-drag").removeClass('btn-success');
	$(".btn-recording-drag").addClass('btn-primary');
	openAddRecordingWindow(currentRecording);
})


//$('form.data-entry').on('keypress', (event) => {
//	return checkSubmit(event)
//})

const draggers = initializeDragging()

createHomeTable()
