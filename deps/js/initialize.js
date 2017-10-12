createHomeTable()

$('#mainNavBar').hide()

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

dragOptions.containers = [$("div.subject.left-dragger")[0], $("div.subject.right-dragger")[0]];
var drake1 = dragula(dragOptions);
dragOptions.containers = [$("div.stimulus.left-dragger")[0], $("div.stimulus.right-dragger")[0]];
var drake2 = dragula(dragOptions);
dragOptions.containers = [$("div.parameters.left-dragger")[0], $("div.parameters.right-dragger")[0]];
var drake3 = dragula(dragOptions);
dragOptions.containers = [$("div.task.left-dragger")[0], $("div.task.right-dragger")[0]];
var drake4 = dragula(dragOptions);
dragOptions.containers = [$("div.event.left-dragger")[0], $("div.event.right-dragger")[0]];
var drake5 = dragula(dragOptions);
