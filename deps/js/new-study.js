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

	for(var k in studyData) {
		currentStudy[k] = studyData[k];
	};

	currentStudy.subject = [];
	currentStudy.event = [];
	currentStudy.parameters = [];
	currentStudy.task = [];
	currentStudy.stimulus = [];
	currentStudy.uuid = uuid();

	jsonfile.writeFileSync(path.join(studyFolder, studyData.Name, 'dataset_description.json'), studyData);
};

$('#dataset-description-create-study-btn').click(function(e) {
	e.preventDefault();
	var studyData = $('#new-study-initial-page-form').serializeObject();
	createNewStudy(studyData)
	$('#new-study-initial-page').hide();
	$('#new-study-session-info').show();
});

// Handler for all cancel buttons

$('.cancel-btn').click(function(e) {

	e.preventDefault()

	dialog.showMessageBox({
		buttons: ["Yes", "No"],
		message: "Are you sure you want to quit?",
		type: "question"
	}, function (response) {
		if (response==0) {
			remote.BrowserWindow.getAllWindows()[0].reload()
		};
	});

});

// Handler for multi-session studies

$('#multiple-sessions-continue-btn').click(function(e) {
	currentStudy.numberOfSessions = $('#numberOfSessions').val();
	if (currentStudy.numberOfSessions > 1) {
		for (var i = 1; i <= currentStudy.numberOfSessions; i++) {
			var temp = $("<div class='form-group'><label class='control-label'>Session "+i+"</label><input type='text' name='sessionLabels[]' class='form-control' placeholder='Session Label'></div>");
			$('#new-study-label-sessions').append(temp);
			//$('#new-study-label-sessions').append($('<h3>hi</h3>'));
		};
		$('#new-study-session-info').hide();
		$('#new-study-name-sessions').show();
	} else {
		$('#new-study-session-info').hide();
		$('#new-study-recordings').show();
	}
})

// Handlers for adding new recordings to be processed

function updateRecordingsList(files) {
	for(var i = 0; i < files.length; i++) {
		var tempLI = $("<li>" + files[i].name + "     " + "</li>");
		var tempButton = $("<button class='btn btn-xs btn-danger recording-list-remove-btn'>Remove</button>");
		tempLI.data().file = files[i].path;
		tempButton.click(function() {
			$(this).parent().remove();
		});
		$("#recordings-added-display-list").append(tempLI.append(tempButton));
	};
}

$(".btn-recording-drag").on('click', (event) => {

	var fileLocation = dialog.showOpenDialog({properties: ['openFile', 'multiSelections']});

	for(var i = 0; i < fileLocation.length; i++) {
		var tempLI = $("<li>" + fileLocation[i].replace(/^.*[\\\/]/, '') + "     " + "</li>");
		var tempButton = $("<button class='btn btn-xs btn-danger recording-list-remove-btn'>Remove</button>");
		tempLI.data().file = fileLocation[i];
		tempButton.click(function() {
			$(this).parent().remove();
		});
		$("#recordings-added-display-list").append(tempLI.append(tempButton));
	}
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
	var files = event.originalEvent.dataTransfer.files;
	$(".btn-recording-drag").removeClass('btn-success');
	$(".btn-recording-drag").addClass('btn-primary');
	updateRecordingsList(files);
})

$('#add-new-recordings-continue').click(function(e) {
	$('#new-study-recordings').hide();
	$('')
})

// Handler for labeling sessions

$('#sessions-label-continue-btn').click(function (e) {
	e.preventDefault()

	var temp = $('#new-study-label-sessions').serializeObject();
	currentStudy.sessionLabels = temp.sessionLabels;

	$('#new-study-name-sessions').hide();
	$('#new-study-recordings').show();
})

// Edit recordings

// Creates elements for edit study info containers
// insertLocation = string --> '#id-of-container-to-insert-into'

function createStudyInfoElement(insertLocation) {

}

$('.edit-study-info-btn.add').click(function(e) {
	e.preventDefault();
	$('#addNewModal .modal-body').load('./forms/' + $(e.currentTarget).data('infotype') + '.html')
	$('#addNewModal').modal('show');
	$('#addNewModalLabel').text('Add New ' + capitalizeFirstLetter($(e.currentTarget).data('infotype')));
	$('#addNewModal').data('currentInfoType', $(e.currentTarget).data('infotype'));
})

$('#addNewModalSaveButton').click(function(e) {

	e.preventDefault();
	var currentType = $('#addNewModal').data('currentInfoType');
	var newObject = $('.data-entry').serializeObject();
	newObject.uuid = uuid();
	newObject.study = currentStudy.Name;
	currentStudy[$('#addNewModal').data('currentInfoType')].push(newObject);
	$('#addNewModal').modal('hide');

});
