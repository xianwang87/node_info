exports.stringUtil = {
	encapStr: function(str) {
		return "'" + str + "'";
	},
	splitStr: function(str, splitor, startPos, endPos, blnResultStr) {
		var result = str.split(splitor);
		var results = result.slice(startPos, endPos);
		if (blnResultStr) {
			result = "";
			for (var i = 0; i < results.length; i++) {
				if (result === "") {
					result = results[i];
				} else {
					result += splitor + results[i];
				}
			}
			return result;
		} else {
			return results;
		}
	}
};