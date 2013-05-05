var getStringKindOfDate = function(time, diffTime) {
	if (diffTime) {
		time = time - diffTime;
	}
	var date = new Date(time);
	var year = date.getUTCFullYear();
	var month = date.getUTCMonth()+1;
	var dayOfMonth = date.getUTCDate();
	var hour = date.getUTCHours();
	var minute = date.getUTCMinutes();
	var fillNumber = function(value) {
		if (value < 10) {
			return '0'+value;
		}
		return value;
	};
	
	return fillNumber(year) + '-' + fillNumber(month) + '-' + fillNumber(dayOfMonth) + ' ' + fillNumber(hour) + ':' + fillNumber(minute);
};

var getOnlyDateStr = function(time, diffTime) {
	if (diffTime) {
		time = time - diffTime;
	}
	var date = new Date(time);
	var year = date.getUTCFullYear();
	var month = date.getUTCMonth()+1;
	var dayOfMonth = date.getUTCDate();
	var fillNumber = function(value) {
		if (value < 10) {
			return '0'+value;
		}
		return value;
	};
	
	return fillNumber(year) + '-' + fillNumber(month) + '-' + fillNumber(dayOfMonth);
};

exports.dateUtil = {
	getDateStr: getStringKindOfDate,
	getOnlyDateStr: getOnlyDateStr
};