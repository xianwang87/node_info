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

var getOnlyDateWithDeltaDayStr = function(time, delta) {
	return getOnlyDateStr(time, delta*24*3600000*-1);
};

var getOnlyDateForAWeekStr = function(time) {
	var date = new Date(time);
	var dayOfWeek = date.getDay();
	return {
		start: getOnlyDateWithDeltaDayStr(time, dayOfWeek*-1),
		end: getOnlyDateWithDeltaDayStr(time, 6 - dayOfWeek)
	};
};


var getOnlyHourMinuteStr = function(time, diffTime) {
	if (diffTime) {
		time = time - diffTime;
	}
	var date = new Date(time);
	var hour = date.getUTCHours();
	var minute = date.getUTCMinutes();
	var fillNumber = function(value) {
		if (value < 10) {
			return '0'+value;
		}
		return value;
	};
	
	return fillNumber(hour) + ':' + fillNumber(minute);
};

exports.dateUtil = {
	getDateStr: getStringKindOfDate,
	getOnlyDateStr: getOnlyDateStr,
	getOnlyDateWithDeltaDayStr: getOnlyDateWithDeltaDayStr,
	getOnlyDateForAWeekStr: getOnlyDateForAWeekStr,
	getOnlyHourMinuteStr: getOnlyHourMinuteStr
};