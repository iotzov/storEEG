// Handler to add more author names

$('#dataset-description-add-authors-btn').click(function(e) {

	e.preventDefault()
	$(this).before($('<div class="form-group"><input class="form-control" name="Authors[]" placeholder="Author Name"></div>'));

});

// Function for initial study creation

function createNewStudy(studyData) {
	if(!fs.existsSync(path.join(studyFolder, studyData.Name))) {
		fs.mkdirSync(path.join(studyFolder, studyData.Name));
	};

	for(var k in studyData) {
		currentStudy[k] = studyData[k];
	};

	if(currentStudy.subject    == undefined){ currentStudy.subject      = [];};
	if(currentStudy.event      == undefined){ currentStudy.event        = [];};
	if(currentStudy.parameters == undefined){ currentStudy.parameters   = [];};
	if(currentStudy.task       == undefined){ currentStudy.task         = [];};
	if(currentStudy.stimulus   == undefined){ currentStudy.stimulus     = [];};
	if(currentStudy.uuid       == undefined){ currentStudy.uuid         = uuid();};
	if(currentStudy.recordings == undefined){ currentStudy.recordings   = [];};

	jsonfile.writeFileSync(path.join(studyFolder, studyData.Name, 'dataset_description.json'), studyData);
};

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

// Handlers for adding new recordings to be processed

function updateRecordingsList(files) {
	for(var i = 0; i < files.length; i++) {
		var tempLI = $("<li class='small-text'>" + files[i].name + "     " + "</li>");
		//var tempButton = $("<button class='btn btn-xs btn-danger recording-list-remove-btn'>Remove</button>");
		var tempButton = $("<a class='recording-list-remove-btn ml-2'><i class='fa fa-trash-o' aria-hidden='true'></i></a>");
		tempLI.data().file = files[i].path;
		tempButton.click(function() {
			$(this).parent().remove();
		});
		$("#recordings-added-display-list").append(tempLI.append(tempButton));
	};
}

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
		});

		var cardtitle = $("<h4 class='card-title text-center'>"+ $(this).data('file').replace(/^.*[\\\/]/, '') +"</h4>");
		var cardbody = $("<div class='card-body'></div>");
		cardbody.append(linkbtn);

		cardTemplate.append(cardtitle);
		cardTemplate.append(cardbody);

		$('#new-study-link-recordings > .card-group').append(cardTemplate);

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

// Creates elements for edit study info containers
// dataObject => study item object w/ all fields for its type in addition to 'type' field

function createStudyInfoElement(dataObject) {

	var tempvar = $('<div></div>');
	tempvar.addClass('study-info-object');
	tempvar.addClass('col-6')
	tempvar.text(dataObject.label);
	tempvar.data('studyElement', dataObject);

	var removebtn = $("<a class='recording-list-remove-btn'><i class='fa fa-trash-o' aria-hidden='true'></i></a>");
	removebtn.click(function() {
		$(this).parent().remove();
	});

	var editbtn   = $("<a class='mx-1 study-element-edit-btn'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></a>");
	editbtn.click(function(e) {
		e.preventDefault();

		$('#addNewModal .modal-body').load('./forms/' + dataObject.type + '.html');
		$('#addNewModalLabel').text('Add New ' + capitalizeFirstLetter(dataObject.type));
		$('#addNewModal').data('currentInfoType', dataObject.type);
		$('#addNewModal').data('editing', $(this).parent());
		$('#addNewModal').data('mode', 'edit');

		$('#addNewModal').on('shown.bs.modal', function(e) {
			if($(e.currentTarget).data('mode') == 'edit') {
				var temp = $(e.currentTarget).data('editing').data('studyElement');

				for(elm in temp) {
					//$('.modal-body .form-group > :not(label)[name='+elm+']')[0].value = temp[elm];
					$('.modal-body .form-group > :not(label)[name='+elm+']').val(temp[elm]);
				};
			};
		});

		$('#addNewModal').modal('show');

	});

	tempvar.append(editbtn);
	tempvar.append(removebtn);

	$('#study-info-' + dataObject.type + '>.study-info-element-container').append(tempvar)

};

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
	});

	$('.navbar-nav > button').removeClass('active');
	$('.navbar-nav > [data-linkTo="#new-study-link-recordings"]').addClass('active');
	$('#new-study-add-items').hide();
	$('#new-study-link-recordings').show();

});

$('#link-page-back-btn').click(function(e) {
	$('#new-study-link-page').hide();
	$('#new-study-link-recordings').show();
});

var dragOptions = {
	// accepts: function(el, target, source, sibling) {
	// 	if(target.classList.value.indexOf('left-dragger') != -1){
	// 		console.log('pass')
	// 		return true;
	// 	} else {
	// 		console.log('fail')
	// 		return false;
	// 	};
	// },
	// copy: function(el, source) {
	// 	if(source.classList.value.indexOf('left-dragger') != -1){
	// 		return true;
	// 	} else {
	// 		return false;
	// 	};
	// },
	// removeOnSpill: true
};

// const drakes = {
// 	'subject': dragula([$("div .subject.left-dragger")[0], $("div .subject.right-dragger")[0]], dragOptions),
// 	'stimulus': dragula([$("div .stimulus.left-dragger")[0], $("div .stimulus.right-dragger")[0]], dragOptions),
// 	'parameters': dragula([$("div .parameters.left-dragger")[0], $("div .parameters.right-dragger")[0]], dragOptions),
// 	'task': dragula([$("div .task.left-dragger")[0], $("div .task.right-dragger")[0]], dragOptions),
// 	'event': dragula([$("div .event.left-dragger")[0], $("div .event.right-dragger")[0]], dragOptions)
// };

function testDragging() {
	var tempVar = $("<div class='study-info-object'>Test</div>");
	for(var i=0; i<10;i++){
		$('.right-dragger').append(tempVar);
		$('.left-dragger').append(tempVar);
	};
};


dragula([$("div .stimulus.left-dragger")[0], $("div .stimulus.right-dragger")[0]], dragOptions);
dragula([$("div .parameters.left-dragger")[0], $("div .parameters.right-dragger")[0]], dragOptions);
dragula([$("div .task.left-dragger")[0], $("div .task.right-dragger")[0]], dragOptions);
dragula([$("div .event.left-dragger")[0], $("div .event.right-dragger")[0]], dragOptions);
dragula([$("div .subject.left-dragger")[0], $("div .subject.right-dragger")[0]], dragOptions);
