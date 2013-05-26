var lists = require('../list/lists'),
	resources = require('../resource/resources.js');

var _SUPPORTED_MENU_RETURN = {
	'Resource': resources.resourceHome
};
var getMenuSuccPageReturn = function(menuFor, menuId) {
	if (menuFor in _SUPPORTED_MENU_RETURN) {
		return _SUPPORTED_MENU_RETURN[menuFor];
	} else {
		return lists.taskOp.getTodos;
	}
};


exports.getMenuSuccPageReturn = getMenuSuccPageReturn;