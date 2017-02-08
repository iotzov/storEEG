const localforage = require('localforage')
const dragula = require('dragula')
const uuid = require('uuid/v4')
const path = require('path');
const remote = require('electron').remote;
const {BrowserWindow} = remote;
const {ipcRenderer} = require('electron')
var currentRec = remote.getGlobal('currentRecording');
var currentStudy = remote.getGlobal('currentStudy');
var currentName = currentRec.fileLocation.replace(/^.*[\\\/]/, '');

//drake = dragula([$('#subjectDragFrom')[0], $('#eventDragFrom')[0], $('#paramDragFrom')[0]]);

function objToArray(toConvert) {
	// Converts the object that is passed to an array of the values of all of its properties
	var temp = [];
	for(var a in toConvert) {
		temp.push(toConvert[a]);
	}

	return temp
}

function initializeDragging() {
  var subjects, events, params = [];
  localforage.getItem(currentStudy).then((data) => {
    subjects = data.subjects;
    events = data.events;
    params = data.recordingParameterSets;

    for(var i in subjects) {
      var temp = $("<div class='drag-item' data-UUID='"+i+"'>"+subjects[i].label+"</div>")
      //var temp = $("<div class='drag-item'>"+subjects[i].label+"</div>")
      //temp.data('UUID', i);
      $('#subjectDragFrom').append(temp);
      //console.log(temp.data())
    }

    for(var i in events) {
      var temp = $("<div class='drag-item' data-UUID='"+i+"'>"+events[i].label+"</div>")
      $('#eventDragFrom').append(temp);
    }

    for(var i in params) {
      var temp = $("<div class='drag-item' data-UUID='"+i+"'>"+params[i].label+"</div>")
      $('#paramDragFrom').append(temp);
    }
  })
  drakeSubject = dragula([$('#subjectDragFrom')[0], $('#subjectDragTo')[0]], {
    copy: function (el, source) {
      return source === $('#subjectDragFrom')[0]
    },
    accepts: function (el, target) {
      return target !== $('#subjectDragFrom')[0]
    },
    removeOnSpill: true
  });

  drakeEvent = dragula([$('#eventDragFrom')[0], $('#eventDragTo')[0]], {
    copy: function (el, source) {
      return source === $('#eventDragFrom')[0]
    },
    accepts: function (el, target) {
      return target !== $('#eventDragFrom')[0]
    },
    removeOnSpill: true
  });

  drakeParam = dragula([$('#paramDragFrom')[0], $('#paramDragTo')[0]], {
    copy: function (el, source) {
      return source === $('#paramDragFrom')[0]
    },
    accepts: function (el, target) {
      return target !== $('#paramDragFrom')[0]
    },
    removeOnSpill: true
  });

  drakeSubject.on('drop', (el, target, source, sibling) => {
    var name = '#'+target.id;
    $(name).children('.initial-drag-item').remove()
  });

  drakeEvent.on('drop', (el, target, source, sibling) => {
    var name = '#'+target.id;
    $(name).children('.initial-drag-item').remove()
  });

  drakeParam.on('drop', (el, target, source, sibling) => {
    var name = '#'+target.id;
    $(name).children('.initial-drag-item').remove()
  });
}

$('#recordingAddButton').on('click', (event) => {
  var temp = $('#eventDragTo').children();
  var e = [];
  for(var i=0; i<temp.length;i++) {
    e[i] = temp[i].dataset.uuid;
  }
  var s = $('#subjectDragTo').children().data()['uuid'];
  var p = $('#paramDragTo').children().data()['uuid'];

  currentRec.eventUUIDs = e;
  currentRec.subjectUUID = s;
  currentRec.recordingParameterSetUUID = p;
  currentRec.label = $('#recLabel').prop('value');

  localforage.getItem(currentStudy).then((data) => {
    data.recordings[currentRec.UUID] = currentRec;
    localforage.setItem(currentStudy, data).then((data) => {
			ipcRenderer.send('update-draggers')
			remote.getCurrentWindow().close()
    })
  })
})

$('#recordingCancelButton').on('click', (event) => {
  remote.getCurrentWindow().close()
})

//$('#pageTitle').prop('innerHTML', currentName)
//$('#pageTitle').css({'color': 'dimgray'});

$('#recLabel').prop('value', currentName)

initializeDragging()
