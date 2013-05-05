var _ = require("underscore");

var getEmumValue = function(enumObj) {
	return enumObj.value;
};
var getEmumText = function(value, enumObj) {
	var result = _.find(_.values(enumObj), function(obj) {return obj.value == value;});
	if (typeof result == 'undefined') {
		result = value;
	} else {
		if ("text" in result) {
			result = result.text;
		} else {
			result = result.value;
		}
	}
	
	return result;
};

exports.enumUtil = {
	getValue: getEmumValue,
	getText: getEmumText
};