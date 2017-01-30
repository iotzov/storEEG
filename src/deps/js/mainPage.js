const {ipcRenderer} = require('electron');
const localforage = require('localforage');
const dragula = require('dragula');
const uuid = require('uuid/v4');
var currentStudy = null;

const links = document.querySelectorAll('link[rel="import"]')
// Import and add each page to the DOM
Array.prototype.forEach.call(links, function (link) {
	let template = link.import.querySelector('.section-template')
	let clone = document.importNode(template.content, true)
	document.querySelector('#main-area').appendChild(clone)
})

// Function definitions

function exitProgram() {
	ipcRenderer.send('exit-clicked');
}

function hideAllSectionsAndDeselectButtons() {
	$("#main-area > div").hide() // Hide all sections

	$(".nav-pills > li").removeClass("active") // De-activate all nav buttons
}

const handleFormSubmit = event => {
	event.preventDefault()

	var data = formToJSON(event.currentTarget.elements);

	localforage.getItem(currentStudy, (err, value) => {
		value[event.currentTarget.name].push(data);
		localforage.setItem(currentStudy, value).then(function () {
			event.currentTarget.reset();
			updateObjectDisplays(event);
		});
	});
}

function printCurrent() {
	localforage.getItem(currentStudy, (err, value) => {
		console.log(JSON.stringify(value, null, "  "));
	})
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

function updateObjectDisplays(event) {
	var currentForm = event.currentTarget.id.slice(4);

	localforage.getItem(currentStudy).then(function (value){
		var currentForm = event.currentTarget.name;
		value = value[currentForm];
		$('#' + currentForm + 'Drag').empty()
		for(var i = 0; i < value.length; i++) {
			createDragObject(value[i], currentForm);
		}
	});
}

function createDragObject(item, where) {

	$('<div/>', {
		'class': 'drag-item',
		'text': where.charAt(0).toUpperCase() + where.slice(1, where.length-1) + ' ID: ' + item.label
	}).appendTo($('#' + where + 'Drag'));

}

function initializeDragging(){

}

// Event Handlers

$(".data-entry").on('submit', handleFormSubmit);

$(".nav-link").on('click', function (event) {
	hideAllSectionsAndDeselectButtons()

	$('#' + $(this).data('section')).show()
	$(this).parent().addClass("active")
});

$("#initial-add-form").on('submit', function (event) {
	event.preventDefault();

	var data = formToJSON(event.currentTarget.elements);
	$("#initial-add-form")[0].reset()
	localforage.getItem(data.studyTitle, (err, study) => {
		if(study) {
			alert('Study already exists!');
		}
		else {
			data.subjects = [];
			data.stimuli = [];
			data.recordingParameterSets = [];
			data.recordings = [];
			data.events = [];
			data.publications = [];
			data.experimenters = [];
			data.license = [];
			data.contacts = [];

			localforage.setItem(data.studyTitle, data, (value) => {
				$("#add-section").hide();
				$("#main-add-section").show();
			});
			currentStudy = data.studyTitle;
		}
	});

});

$("#home-section").show()

const drake = dragula([$("#subjectsDrag")[0]], {
	removeOnSpill: true
});
