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
			remote.BrowserWindow.getAllWindows()[0].reload()
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
		/*
		var tempvar = $("<option>"+$(this).data('file').replace(/^.*[\\\/]/, '')+"</option>");
		tempvar.data('file', $(this).data('file'));
		$('#edit-recordings-list').append(tempvar);
		*/
		currentStudy.recordings.push($(this).data('file'));
		var cardTemplate = $("<div class='card bg-light mb-2'></div>");
		var linkbtn = $("<button class='btn btn-outline-primary'>Link Items</button>"); // btn to open linking page

		linkbtn.data('recording', $(this).data('file'));

		linkbtn.click(function(e) {
			$('#new-study-link-recordings').hide();
			$('#new-study-link-page').show()
			$('#new-study-link-page').data('linking', $(this).data('recording'));
      $('.left-dragger').empty();
		});

		var cardtitle = $("<h4 class='card-title text-center'>"+ $(this).data('file').replace(/^.*[\\\/]/, '') +"</h4>");
		var cardbody = $("<div class='card-body'></div>");
		cardbody.append(linkbtn);

		cardTemplate.append(cardtitle);
		cardTemplate.append(cardbody);

		$('#new-study-link-recordings .card-group').append(cardTemplate);

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
	$('#addNewModal .modal-body').load('./forms/' + $(e.currentTarget).data('infotype') + '.html')
	$('#addNewModal').modal('show');
	$('#addNewModalLabel').text('Add New ' + capitalizeFirstLetter($(e.currentTarget).data('infotype')));
	$('#addNewModal').data('currentInfoType', $(e.currentTarget).data('infotype'));
	$('#addNewModal').data('mode', 'new');
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
		createStudyInfoElement(newObject);
		$('#addNewModal').modal('hide');
	} else {

			$($('#addNewModal').data('editing')).remove();
			var currentType = $('#addNewModal').data('currentInfoType');
			var newObject = $('.data-entry').serializeObject();
			newObject.uuid = uuid();
			newObject.study = currentStudy.Name;
			newObject.type = currentType;
			//currentStudy[$('#addNewModal').data('currentInfoType')].push(newObject);
			createStudyInfoElement(newObject);
			$('#addNewModal').modal('hide');

	}

});

$('#edit-recordings-list').on('hidden.bs.select', function (e) {
	console.log($('#edit-recordings-list').val());
})

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
    $('.right-dragger.'+$(this).data('studyElement').type).append($(this).clone());
	});

  $('.right-dragger a').remove();

	$('.navbar-nav > button').removeClass('active');
	$('.navbar-nav > [data-linkTo="#new-study-link-recordings"]').addClass('active');
	$('#new-study-add-items').hide();
	$('#new-study-link-recordings').show();

});

$('#link-page-back-btn').click(function(e) {
	$('#new-study-link-page').hide();
	$('#new-study-link-recordings').show();
});

$('.edit-study-info-btn').each(function(e) {

  $(this).data('infotype', $(this).parent().parent().data('infotype'));

});

$('.navbar-brand').click(function(e) {
  e.preventDefault();
  hideAllSections();
  $('#mainNavBar').hide();
  $('#home-section').show();
})

$('#link-page-save-btn').click(function(e) {

  

});
