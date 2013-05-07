;(function($) {
	var root = this;
	root.MyInfoN = root.MyInfoN || {};
	root.MyInfoN.date = root.MyInfoN.date || {};
	
	 var timeOffset = new Date().getTimezoneOffset()*60000;
	 root.MyInfoN.date.timeOffset = timeOffset;
	
	root.MyInfoN.date.getOnlyDateNoTimezoneStr = function(time, diffTime) {
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
	root.MyInfoN.date.getOnlyDateStr = function(time, diffTime) {
		return root.MyInfoN.date.getOnlyDateNoTimezoneStr(time-timeOffset, diffTime);
	};
	
	root.MyInfoN.date.getOnlyTimeNoTimezoneStr = function(time, deltaTime) {
		if (deltaTime) {
			time = time + deltaTime;
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
	root.MyInfoN.date.getOnlyTimeStr = function(time, deltaTime) {
		return root.MyInfoN.date.getOnlyTimeNoTimezoneStr(time-timeOffset, deltaTime);
	};
	
	root.MyInfoN.date.getOnlyHourNoTimezoneStr = function(time, deltaHour) {
		if (deltaHour) {
			time = time + deltaHour*3600000;
		}
		var date = new Date(time);
		var hour = date.getUTCHours();
		var fillNumber = function(value) {
			if (value < 10) {
				return '0'+value;
			}
			return value;
		};
		
		return fillNumber(hour) + ':00';
	};
	root.MyInfoN.date.getOnlyHourStr = function(time, deltaHour) {
		return root.MyInfoN.date.getOnlyHourNoTimezoneStr(time-timeOffset, deltaHour);
	};
	
})(jQuery);