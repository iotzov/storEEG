const {ipcRenderer} = require('electron')

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
		data[element.id] = element.value;
	}
	return data;
}, {});

function isValidEntry(element) {
	return element.id && element.value;
};

$(".data-entry").on('submit', handleFormSubmit);

$(".nav-link").on('click', function (event) {
	hideAllSectionsAndDeselectButtons()

	$('#' + $(this).data('section')).show()
	$(this).parent().addClass("active")
});

const links = document.querySelectorAll('link[rel="import"]')
// Import and add each page to the DOM
Array.prototype.forEach.call(links, function (link) {
	let template = link.import.querySelector('.section-template')
	let clone = document.importNode(template.content, true)
	document.querySelector('#main-area').appendChild(clone)
})

$("#home-section").show()
