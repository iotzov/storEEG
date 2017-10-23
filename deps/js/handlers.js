// Handler to add more author names

$('#dataset-description-add-authors-btn').click(function(e) {

	e.preventDefault()
	$(this).before($('<div class="form-group"><input class="form-control" name="Authors[]" placeholder="Author Name"></div>'));

});

// Handler for initial dataset description continue button

$('#dataset-description-create-study-btn').click(function(e) {
	e.preventDefault();
	var studyData = $('#new-study-initial-page-form').serializeObject();
	createNewStudy(studyData)
	$('#new-study-initial-page').hide();
	$('#new-study-session-info').show();
	$('.navbar-nav > button').removeClass('active')
	$('.navbar-nav > [data-linkTo="#new-study-session-info"]').addClass('active')
	$('.navbar-nav > [data-linkTo="#new-study-initial-page"]').prepend('<i class="fa fa-check" aria-hidden="true"></i>')
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
			restartApp();
		};
	});

});

// Handler for multi-session studies

$('#multiple-sessions-continue-btn').click(function(e) {
	currentStudy.numberOfSessions = $('#numberOfSessions').val();
	$('#new-study-label-sessions').empty();
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
		$('.navbar-nav > button').removeClass('active')
		$('.navbar-nav > [data-linkTo="#new-study-recordings"]').addClass('active')
		$('.navbar-nav > [data-linkTo="#new-study-session-info"]').prepend('<i class="fa fa-check" aria-hidden="true"></i>');
	}
});

// Handler for click on initial add recordings button

$(".btn-recording-drag").on('click', (event) => {

	var fileLocation = dialog.showOpenDialog({properties: ['openFile', 'multiSelections']});

	for(var i = 0; i < fileLocation.length; i++) {
		var tempLI = $("<li class='small-text'>" + fileLocation[i].replace(/^.*[\\\/]/, '') + "     " + "</li>");
		var tempButton = $("<a class='recording-list-remove-btn ml-2'><i class='fa fa-trash-o' aria-hidden='true'></i></a>");
		tempLI.data().file = fileLocation[i];
		tempButton.click(function() {
			$(this).parent().remove();
		});
		$("#recordings-added-display-list").append(tempLI.append(tempButton));
	}
})

// handles recolor on drag n dropping files

$(".btn-recording-drag-wrapper").on('dragover', (event) => {
	$(".btn-recording-drag").addClass('btn-success');
	$(".btn-recording-drag").removeClass('btn-primary');
})

// handles recolor on drag n dropping files

$(".btn-recording-drag-wrapper").on('dragleave', (event) => {
	$(".btn-recording-drag").removeClass('btn-success');
	$(".btn-recording-drag").addClass('btn-primary');
})

// handles dropping files onto recording button

$(".btn-recording-drag-wrapper").on('drop', (event) => {
	event.preventDefault();
	var files = event.originalEvent.dataTransfer.files;
	$(".btn-recording-drag").removeClass('btn-success');
	$(".btn-recording-drag").addClass('btn-primary');
	updateRecordingsList(files);
});

$('#add-new-recordings-continue').click(function(e) {
	$('#new-study-recordings').hide();
	$('#new-study-add-items').show();
	$('#recordings-added-display-list').children().each(function (x) {

		var tempRecording = {};
		tempRecording.subject = [];
		tempRecording.stimulus = [];
		tempRecording.event = [];
		tempRecording.task = [];
		tempRecording.parameters = [];
		tempRecording.file = $(this).data('file');
		tempRecording.uuid = uuid();

		currentStudy.recordings.push(tempRecording);
		var cardTemplate = $("<div class='card bg-light mb-2 text-center'></div>");
		var linkbtn = $("<button class='btn btn-outline-primary recording-linker-btn'>Link Items</button>"); // btn to open linking page

		linkbtn.data('recording', $(this).data('file'));

		linkbtn.click(function(e) {
			$('#new-study-link-recordings').hide();
			$('#new-study-link-page').show()
			$('#new-study-link-page').data('linking', $(this).data('recording'));
		});

		var cardtitle = $("<h4 class='card-title'>"+ $(this).data('file').replace(/^.*[\\\/]/, '') +"</h4>");
		var cardbody = $("<div class='card-body'></div>");
		cardbody.append(linkbtn);

		cardTemplate.append(cardtitle);
		cardTemplate.append(cardbody);

		$('.recording-card-container').append(cardTemplate);

	});
	$('.card').wrap("<div class='col-4'></div>");
	$('.navbar-nav > button').removeClass('active');
	$('.navbar-nav > [data-linkTo="#new-study-add-items"]').addClass('active');
	$('.navbar-nav > [data-linkTo="#new-study-recordings"]').prepend('<i class="fa fa-check" aria-hidden="true"></i>');
});

// Handler for labeling sessions

$('#sessions-label-continue-btn').click(function (e) {
	e.preventDefault();

	var temp = $('#new-study-label-sessions').serializeObject();
	currentStudy.sessionLabels = temp.sessionLabels;

	$('#new-study-name-sessions').hide();
	$('#new-study-recordings').show();
	$('.navbar-nav > [data-linkTo="#new-study-session-info"]').prepend('<i class="fa fa-check" aria-hidden="true"></i>');
})

// Edit recordings

$('.edit-study-info-btn.add').click(function(e) {
	e.preventDefault();
	$('#addNewModalLabel').text('Add New ' + capitalizeFirstLetter($(e.currentTarget).data('infotype')));
	$('#addNewModal').data('currentInfoType', $(e.currentTarget).data('infotype'));
	$('#addNewModal').data('mode', 'new');
	$('#addNewModal .modal-body').load('./forms/' + $(e.currentTarget).data('infotype') + '.html', function() {
		if($('#addNewModal').data('currentInfoType') == 'stimulus') {

			var currentEvents = $(e.currentTarget).closest('.main-content').find('.event').children();

			currentEvents.each(function(ev) {
				var tmp = $('<option>' + $(this).data('studyElement').label + '</option>');
				$('.modal-body .link-event').append(tmp);
			});
		};
	});
	$('#addNewModal').modal('show');

});

$('#addNewModalSaveButton').click(function(e) {

	e.preventDefault();
	if($('#addNewModal').data('mode') == 'new') {
		var currentType = $('#addNewModal').data('currentInfoType');
		var newObject = $('.data-entry').serializeObject();
		newObject.uuid = uuid();
		newObject.study = currentStudy.Name;
		newObject.type = currentType;
		//currentStudy[$('#addNewModal').data('currentInfoType')].push(newObject);
		// $('#study-info-' + newObject.type + '>.study-info-element-container').append(createStudyInfoElement(newObject));
		$('.' + newObject.type + '.new-items').append(createStudyInfoElement(newObject));
		$('#addNewModal').modal('hide');
	} else {

			var parent = $($('#addNewModal').data('editing')).parent();
			$($('#addNewModal').data('editing')).remove();
			var currentType = $('#addNewModal').data('currentInfoType');
			var newObject = $('.data-entry').serializeObject();
			newObject.uuid = uuid();
			newObject.study = currentStudy.Name;
			newObject.type = currentType;
			//currentStudy[$('#addNewModal').data('currentInfoType')].push(newObject);
			// $('#study-info-' + newObject.type + '>.study-info-element-container').append(createStudyInfoElement(newObject));
			parent.append(createStudyInfoElement(newObject));
			$('#addNewModal').modal('hide');

	}

});

$('.nav-btn').click(function(e) {
	e.preventDefault();
	$('.navbar-nav > button').removeClass('active');
	$('#main-area').children().hide();
	$(e.currentTarget).addClass('active');
	$($(e.currentTarget).data('linkto')).show();
})

$('#add-items-continue-btn').click(function(e) {
	// Add each recording to #new-study-link-recordings page as a card
	// attach link to each card to connect study elements to the recording

	$('[data-linkto="#new-study-add-items"]').prepend('<i class="fa fa-check" aria-hidden="true"></i>');

	$('.study-info-object').each(function(e) {
		currentStudy[$(this).data('studyElement').type].push($(this).data('studyElement'));
		var tempVar = $(this).clone();
		tempVar.data('studyElement', $(this).data('studyElement'));
    $('.right-dragger.'+$(this).data('studyElement').type).append(tempVar);
	});

  $('.right-dragger a').remove();

	$('.navbar-nav > button').removeClass('active');
	$('.navbar-nav > [data-linkTo="#new-study-link-recordings"]').addClass('active');
	$('#new-study-add-items').hide();
	$('#new-study-link-recordings').show();

	$('.link-recording-wrapper.new-items').empty()

});

$('#link-page-back-btn').click(function(e) {
	$('#new-study-link-page').hide();
	$('#new-study-link-recordings').show();
});

// $('.edit-study-info-btn').each(function(e) {
//
//   $(this).data('infotype', $(this).parent().parent().data('infotype'));
//
// });

$('.navbar-brand').click(function(e) {
  e.preventDefault();
  hideAllSections();
  $('#mainNavBar').hide();
	$('#studyElementsNavBar').hide();
  $('#home-section').show();
});

$('#link-page-save-btn').click(function(e) {

	// insert uuids of linked elements into recording object

	var currentRecording = _.filter(currentStudy.recordings, function(obj){
		return obj.file == $('#new-study-link-page').data('linking');
	})[0];

	_.remove(currentStudy.recordings, function(obj){
		return obj.file == $('#new-study-link-page').data('linking');
	})[0];

	$('#new-study-link-page .study-info-object').each(function(x) {
		var tmp = $(this).data('studyElement');
		currentRecording[tmp.type].push(tmp.uuid);
	});

	currentStudy.recordings.push(currentRecording);

	// add check showing completion to the link btn

	var btnToUpdate = $('.recording-linker-btn').filter(function() {
		return $(this).data('recording') == currentRecording.file;
	});

	btnToUpdate.prepend('<i class="fa fa-check" aria-hidden="true"></i>');

	// empty the left draggers and change the page back to #new-study-link-recordings

	$('#new-study-link-page .study-info-object').remove();
	$('#new-study-link-page').hide();
	$('#new-study-link-recordings').show();

	document.body.scrollTop = document.documentElement.scrollTop = 0;

});

$('#final-save-btn').click(function(e) {
	e.preventDefault();

	addStudy(currentStudy);

	// jsonfile.writeFileSync(studyFolder + '/' + currentStudy.Name + '/study.json', currentStudy);

	copyRecordings(currentStudy, writeStudyToFile);
	// writeStudyToFile(currentStudy, restartApp);

	// hideAllSections();
	// $('#mainNavBar').hide();
	// $('#home-section').show();
	//
	// $('#home-section').prepend($('<div class="alert alert-success alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Success!</strong> Study has successfully been added to the repository.</div>'));
	//
	// updateHomeTable();

});

// handler for home page 'new study' button

$('#add-new-study-btn').on('click', (event) => {
	hideAllSections();
	$('#new-study-initial-page').show()
	$('#mainNavBar').show()
});

// make enter submit the 'add new element' modal form
$('#addNewModal .modal-body').keypress(function(e) {
	if(e.key == 'Enter'){
		$('#addNewModalSaveButton').click();
	};
});

// autofocus the first input element when modal is shown
$('#addNewModal').on('shown.bs.modal', function(e) {
	$('#addNewModal .modal-body input').first().focus();
});


// hide main section and show study element table
$('#view-study-elements-btn').click(function(e) {

	createElementTable();

	hideAllSections();
	$('#element-display-page').show();
	$('#studyElementsNavBar').show();

});


$('#export-study-data-btn').click(function(e) {

	hideAllSections();
	$('#export-data-choose-method').show();
	$('#studyElementsNavBar').show();

});

$('#export-by-stim-btn').click(function(e) {

	$('#export-data-choose-method').hide();
	$('#export-data-select').show();
	initializeSelectDataTable('stimulus');

});

$('#export-by-rec-btn').click(function(e) {

	$('#export-data-choose-method').hide();
	$('#export-data-select').show();
	initializeSelectDataTable('recordings');

});

$('#export-by-sub-btn').click(function(e) {

	$('#export-data-choose-method').hide();
	$('#export-data-select').show();
	initializeSelectDataTable('subject');

});

$('#export-data-btn').click(function(e) {

	var selections = $('#data-select-table').bootstrapTable('getSelections');

	console.log('Exporting data for these selections: ');

	for(var i=0; i < selections.length; i++) {

		console.log(selections[i].type);
		console.log(selections[i].label);

	};

	console.log('These studies match:');
	var matching = findMatchingStudies()

});

$('.edit-study-info-btn.import').click(function(e) {

	createModalTable_import($(e.currentTarget).data('infotype'));

	$('#tableModalSaveButton').one('click', function(e) {

		var selections = $('#import-link-table').bootstrapTable('getSelections');
		if(_.isEmpty(selections)) {
			$('#import-link-table').bootstrapTable('destroy');
			$('#tableModal').modal('hide');
		} else {

			var type = selections[0].type;
			_.forEach(selections, function(o) {
				$('.new-items.'+type).append(createStudyInfoElement(o));
			});
			$('#import-link-table').bootstrapTable('destroy');
			$('#tableModal').modal('hide');

		};

	});

	$('#tableModal').modal('show');

});

$('.linking-btn').click(function(e) {

	var type = $(e.currentTarget).data('infotype');

	createModalTable_link(type);

	$('#import-link-table').bootstrapTable('uncheckAll');

	$('#tableModalSaveButton').one('click', function(e) {

		var selections = $('#import-link-table').bootstrapTable('getSelections');
		if(_.isEmpty(selections)) {
			$('#import-link-table').bootstrapTable('destroy');
			$('#tableModal').modal('hide');
		} else {
			_.forEach(selections, function(o) {
				var tmp = createStudyInfoElement(o);
				$(tmp).find('.study-element-edit-btn').remove();
				$(tmp).find('.recording-list-remove-btn').addClass('mr-1')
				$('#new-study-link-page .link-recording-wrapper.'+type).append(tmp);
			});
			$('#import-link-table').bootstrapTable('destroy');
			$('#tableModal').modal('hide');
		}
	});

	$('#tableModal').modal('show');

});
