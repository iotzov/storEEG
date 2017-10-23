/*

  This file contains all of the functions required for management/creation of studies

*/

// misc. functions

function exitProgram() {
	ipcRenderer.send('exit-clicked');
}

function restartApp(){
	remote.BrowserWindow.getAllWindows()[0].reload();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function tsvJSON(tsv){

  var lines=tsv.split("\n");

  var result = [];

  var headers=lines[0].split("\t");

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split("\t");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }

	  result.push(obj);

  }

  return result; //JavaScript object
  //return JSON.stringify(result); //JSON
}

function importTSVFile(filePath) {
	var imports = fs.readFileSync(filePath, 'utf8');
	return tsvJSON(imports);
}

function createNewStudy(studyData) { // Function for initial study creation
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

function updateRecordingsList(files) { // updates list of recordings on the add recording page
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

function createStudyInfoElement(dataObject) {
	// Creates elements for edit study info containers
	// dataObject => study item object w/ all fields for its type in addition to 'type' field

	var tempvar = $("<div></div>");
	tempvar.addClass('study-info-object');
	tempvar.addClass('col-2 m-2 text-light text-truncate');
	tempvar.addClass(dataObject.type+'-color');
	tempvar.text(dataObject.label);
	tempvar.data('studyElement', dataObject);

	var removebtn = $("<a class='recording-list-remove-btn'><i class='fa fa-trash-o' aria-hidden='true'></i></a>");
	removebtn.click(function() {
		$(this).parent().remove();
	});

	var editbtn   = $("<a class='mx-1 study-element-edit-btn'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></a>");
	editbtn.click(function(e) {
		e.preventDefault();

		$('#addNewModal').data('currentInfoType', dataObject.type);
		$('#addNewModal').data('editing', $(this).parent());
		$('#addNewModal').data('mode', 'edit');
		$('#addNewModal .modal-body').load('./forms/' + dataObject.type + '.html', function() {
			if($('#addNewModal').data('currentInfoType') == 'stimulus') {

				var currentEvents = $(e.currentTarget).closest('.main-content').find('.event').children();

				currentEvents.each(function(ev) {
					var tmp = $('<option>' + $(this).data('studyElement').label + '</option>');
					$('.modal-body .link-event').append(tmp);
				});
			};
		});
		$('#addNewModalLabel').text('Add New ' + capitalizeFirstLetter(dataObject.type));

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

	tempvar.prepend(editbtn);
	tempvar.prepend(removebtn);

	return tempvar

};

function createRecordingObject(rec) {

	var tempvar = $("<div></div>");
	tempvar.addClass('study-info-object');
	tempvar.addClass('col-2 m-2 text-light text-truncate recordings-color')
	tempvar.text(rec.file.replace(/^.*[\\\/]/, ''));

	var viewbtn = $('<a class="mx-1 recording-view-btn"><i class="fa fa-eye" aria-hidden="true"></i></a>');
	viewbtn.click(function(e) {

		e.preventDefault();

		displayRecording(rec);

	});

	tempvar.append(viewbtn);

	return tempvar

}

/*

Data management functions below

Used to load, store, and modify data stored in .json files on local machine


*/

function getStudyByUUID(uuid) {

	return _.filter(studies, function(obj){
		return obj.uuid == uuid;
	})[0];

}

function getItemByUUID(uuid) {

	loadElements();
	var tmp = _.flatten(_.values(studyElements));

	return _.filter(tmp, function(obj) {
		return obj.uuid == uuid;
	})[0];

}

function containsItem(item, study){ // returns true if 'study' contains 'item' of type 'dataType', false otherwise

	var type = item.type;

	return !_.isEmpty(_.filter(study[type], function(obj) {
		return obj.uuid == item.uuid
	}));

}

function findMatchingStudies(item) { // returns list of studies that have element 'item' in them

	return _.filter(studies, function(obj) {
		return containsItem(item, obj);
	});

}

function loadStudies() {

	studies = jsonfile.readFileSync('studies.json', {
		throws: false
	});

	if(studies == null) {
		studies = [];
		jsonfile.writeFileSync('studies.json', studies);
	};

}

function loadElements() {

	loadStudies();

	keySet = [
		'subject',
		'stimulus',
		'parameters',
		'task',
		'event',
		'recordings'
	];

	studyElements = {};

	for(var i=0; i < keySet.length; i++) {

		studyElements[keySet[i]] = [];

		for(var j=0; j < studies.length; j++) {

			studyElements[keySet[i]] = _.concat(studyElements[keySet[i]], studies[j][keySet[i]]);

		}

	}

}

function saveStudies() {

	jsonfile.writeFile('studies.json', studies);

}

function addStudy(study) {

	loadStudies();
	studies.push(study);
	jsonfile.writeFile('studies.json', studies);

}

function studyComparison(one, two, key) {
	if(key==='uuid') {
		return true;
	};
	if(key==='study'){
		return true;
	};
}

function writeStudyToFile(study, callback) {
	// writes the js object representing the study to 'studyInfo.json' under that study's top folder
	// each study's top folder is identical to its 'Name' property

	if(!fs.existsSync(path.join(studyFolder, study.Name))) {
		fs.mkdirSync(path.join(studyFolder, study.Name));
	};

	if(callback) {
		jsonfile.writeFile(path.join(studyFolder, study.Name, 'studyInfo.json'), study, callback);
	} else {
		jsonfile.writeFile(path.join(studyFolder, study.Name, 'studyInfo.json'), study);
	};

}

function copyRecordings(study, callback) {
	// copies each file under the 'recordings' of a study to its top folder
	// original file names are preserved

	// _.forEach(study.recordings, function(rec) {
	//
	// 	var dest = path.join(studyFolder, study.Name, rec.file.replace(/^.*[\\\/]/, ''));
	//
		// fs.copy(rec.file, dest, (err) => {
		// 	if(err) throw err;
		// 	console.log('Copied ' + rec.file.replace(/^.*[\\\/]/, '') + ' successfully.');
		// 	rec.file = dest;
		// });
	//
	// });

	for(var i=0; i<study.recordings.length; i++) {

		var dest = path.join(studyFolder, study.Name, study.recordings[i].file.replace(/^.*[\\\/]/, ''));

		fs.copy(study.recordings[i].file, dest, (err) => {
			if(err) throw err;
			console.log('Copied ' + study.recordings[i].file.replace(/^.*[\\\/]/, '') + ' successfully.');
		});

		study.recordings[i].file = dest;

	};

	typeof callback === 'function' && callback(study, restartApp);

}

function displayRecording(recording) {

	var options = {
		mode: 'json',
		args: [recording.uuid],
		pythonPath: 'python3',
		scriptPath: pythonFolder
	};

	pyshell.run('displayRecording.py', options, function(err, msg) {

		if(err) throw err;
		console.log('Success displaying '+recording.file.replace(/^.*[\\\/]/, ''));

	});

}

/*

  Functions for creating and managing drag n drop functionality

*/



/*

  Functions for creating and managing the main page table

*/

function createHomeTable() {

	var data = [];

	loadStudies();

	for(var i=0; i < studies.length; i++) {

		data.push({
			name: studies[i].Name,
			description: studies[i].studyDescription,
			numSubjects: studies[i].subject.length,
			numStimuli: studies[i].stimulus.length,
			uuid: studies[i].uuid
		});

	};

	$('#home-table').bootstrapTable({
		columns: [{
			field: 'name',
			title: 'Study',
			sortable: true,
			// formatter: createEditLink
		}, {
			field: 'numSubjects',
			title: 'Number of Subjects',
			sortable: true
		}, {
			field: 'numStimuli',
			title: 'Number of Stimuli',
			sortable: true
		}, {
			field: 'description',
			title: 'Study Description',
			sortable: false
		}, {
			field: 'uuid',
			title: 'Edit/View Study',
			sortable: false,
			formatter: createEditLink
		}, {
			field: 'uuid',
			title: 'UUID',
			sortable: false,
			visible: false
		}],
		search: true,
		pagination: true,
		showToggle: true,
		showRefresh: true,
		showColumns: true,
		iconsPrefix: 'fa',
		icons: {
			paginationSwitchDown: 'fa-collapse-down icon-chevron-down',
			paginationSwitchUp: 'fa-collapse-up icon-chevron-up',
			refresh: 'fa-refresh icon-refresh',
			toggle: 'fa-list-alt icon-list-alt',
			columns: 'fa-th icon-th',
			detailOpen: 'fa-plus icon-plus',
			detailClose: 'fa-minus icon-minus'
		},
		data
	});

	$('.home-table-wrapper [title="Refresh"]').on('click', (event) => {
		event.preventDefault()
		updateHomeTable()
	});

	$('.home-table-wrapper .edit-study-link').click(function(e) {

		$('#edit-study-page .edit-study-element-container').empty();
		$('#edit-study-page .edit-study-element-container').toggle();

		var study = getStudyByUUID($(this).data('uuid'));

		var elements = ['subject', 'stimulus', 'event', 'task', 'parameters'];

		for(var i=0; i < elements.length; i++) {

			study[elements[i]].forEach(function(elm) {

				$('#edit-study-page .'+elm.type).append(createStudyInfoElement(elm));

			});

		};

		study.recordings.forEach(function(rec) {

			$('#edit-study-page .recordings').append(createRecordingObject(rec));

		});

		hideAllSections();

		$('#edit-study-page').show();
		$('#studyElementsNavBar').show();

		//recordings
	});

}

function updateHomeTable() {

	var data = [];

	loadStudies();

	for(var i=0; i < studies.length; i++) {

		data.push({
			name: studies[i].Name,
			description: studies[i].studyDescription,
			numSubjects: studies[i].subject.length,
			numStimuli: studies[i].stimulus.length
		});

	};

	if(~_.isEmpty(data)) {
		$('#home-table').bootstrapTable('load', data)
	} else {
		$('#home-table').bootstrapTable('removeAll')
	};

}

function createEditLink(text, row, column) {

	return [
		"<a href='#' class='edit-study-link' data-uuid=",
		text,
		">Edit</a>"
	].join('');

}

/*

	End home table section

*/


/*

	Functions for creating/updating/managing the element display table

*/

function createElementTable() {

	var data = [];

	loadElements();

	for(var i in studyElements) {

		for(var j=0; j < studyElements[i].length; j++){
			data.push({
				name: studyElements[i][j].label,
				type: studyElements[i][j].type,
				uuid: studyElements[i][j].uuid,
				study: studyElements[i][j].study
			});
		}

	};

	$('#element-display-table').bootstrapTable({
		columns: [{
			checkbox: true
		}, {
			field: 'name',
			title: 'Item Label',
			sortable: true,
			// formatter: createEditLink
		}, {
			field: 'type',
			title: 'Element Type',
			sortable: true
		}, {
			field: 'uuid',
			title: 'UUID',
			sortable: false,
			visible: false
		}, {
			field: 'study',
			title: 'Original Study',
			sortable: true,
			visible: true
		}],
		search: true,
		pagination: true,
		showToggle: true,
		showRefresh: true,
		showColumns: true,
		pageSize: 25,
		maintainSelected: true,
		iconsPrefix: 'fa',
		icons: {
			paginationSwitchDown: 'fa-collapse-down icon-chevron-down',
			paginationSwitchUp: 'fa-collapse-up icon-chevron-up',
			refresh: 'fa-refresh icon-refresh',
			toggle: 'fa-list-alt icon-list-alt',
			columns: 'fa-th icon-th',
			detailOpen: 'fa-plus icon-plus',
			detailClose: 'fa-minus icon-minus'
		},
		data
	});

	$('#element-display-page [title="Refresh"]').on('click', (event) => {
		event.preventDefault()
		updateElementTable()
	});
}

function updateElementTable() {}

/*

	End element display table section

*/

/*

	functions for creating/modifying modal table

*/

function createModalTable_import(type) {

	$('#import-link-table').bootstrapTable({
		columns: [{
			checkbox: true
		}, {
			field: 'label',
			title: 'Label',
			sortable: true,
		}, {
			field: 'study',
			title: 'Study',
			sortable: true,
		}, {
			field: 'uuid',
			title: 'UUID',
			sortable: false,
		}],
		pagination: false,
		showColumns: false,
		trimOnSearch: false,
		clickToSelect: true,
		height: 400,
		data: studyElements[type]
	});

}

function createModalTable_link(type) {

	$('#import-link-table').bootstrapTable({
		columns: [{
			checkbox: true
		}, {
			field: 'label',
			title: 'Label',
			sortable: true,
		}, {
			field: 'study',
			title: 'Study',
			sortable: true,
		}, {
			field: type + 'Description',
			title: 'Description',
			sortable: false
		}, {
			field: 'uuid',
			title: 'UUID',
			sortable: false,
			visible: false,
		}],
		pagination: false,
		showColumns: true,
		clickToSelect: true,
		height: 400,
		iconsPrefix: 'fa',
		icons: {
			paginationSwitchDown: 'fa-collapse-down icon-chevron-down',
			paginationSwitchUp: 'fa-collapse-up icon-chevron-up',
			refresh: 'fa-refresh icon-refresh',
			toggle: 'fa-list-alt icon-list-alt',
			columns: 'fa-th icon-th',
			detailOpen: 'fa-plus icon-plus',
			detailClose: 'fa-minus icon-minus'
		},
		data: currentStudy[type]
	});

}

/*

	end modal table section

*/

function initializeSelectDataTable(type) {

	loadElements();

	var data = studyElements[type];

	$('#data-select-table').bootstrapTable({
		columns: [{
			checkbox: true
		}, {
			field: 'label',
			title: 'Item Label',
			sortable: true,
			// formatter: createEditLink
		}, {
			field: 'uuid',
			title: 'UUID',
			sortable: false,
			visible: false
		}],
		search: true,
		pagination: true,
		showToggle: true,
		showRefresh: true,
		showColumns: true,
		pageSize: 25,
		maintainSelected: true,
		iconsPrefix: 'fa',
		icons: {
			paginationSwitchDown: 'fa-collapse-down icon-chevron-down',
			paginationSwitchUp: 'fa-collapse-up icon-chevron-up',
			refresh: 'fa-refresh icon-refresh',
			toggle: 'fa-list-alt icon-list-alt',
			columns: 'fa-th icon-th',
			detailOpen: 'fa-plus icon-plus',
			detailClose: 'fa-minus icon-minus'
		},
		data
	});

	$('#export-data-select [title="Refresh"]').on('click', (event) => {
		event.preventDefault()
		updateElementTable()
	});

}

function hideAllSections() {
	$("#main-area > div").hide() // Hide all sections
}
