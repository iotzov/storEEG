const {ipcRenderer} = require('electron')
const localforage = require('localforage')
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
	console.log(JSON.stringify(data, null, "  "));
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
			console.log(JSON.stringify(data, null, "  "));
		}
	});
});

$("#home-section").show()
