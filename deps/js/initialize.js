loadStudies();
createHomeTable();

$('#mainNavBar').hide();
$('#studyElementsNavBar').hide();

var dragOptions = {
	accepts: function(el, target, source, sibling) {
		if(target.classList.value.indexOf('left-dragger') != -1){
			return true;
		} else {
			return false;
		};
	},
	copy: function(el, source) {
		if(source.classList.value.indexOf('left-dragger') != -1){
			return false;
		} else {
			return true;
		};
	},
	removeOnSpill: true
};

function copySourceData(clone, original, type) {

	$(clone).data('studyElement', $(original).data('studyElement'));

}

dragOptions.containers = [$("div.subject.left-dragger")[0], $("div.subject.right-dragger")[0]];
var drake1 = dragula(dragOptions);
drake1.on('cloned', copySourceData);
dragOptions.containers = [$("div.stimulus.left-dragger")[0], $("div.stimulus.right-dragger")[0]];
var drake2 = dragula(dragOptions);
drake2.on('cloned', copySourceData);
dragOptions.containers = [$("div.parameters.left-dragger")[0], $("div.parameters.right-dragger")[0]];
var drake3 = dragula(dragOptions);
drake3.on('cloned', copySourceData);
dragOptions.containers = [$("div.task.left-dragger")[0], $("div.task.right-dragger")[0]];
var drake4 = dragula(dragOptions);
drake4.on('cloned', copySourceData);
dragOptions.containers = [$("div.event.left-dragger")[0], $("div.event.right-dragger")[0]];
var drake5 = dragula(dragOptions);
drake5.on('cloned', copySourceData);
