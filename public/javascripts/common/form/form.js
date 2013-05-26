;(function($) {
	var root = this;
	root.MyInfoN = root.MyInfoN || {};
	
	root.MyInfoN.form = root.MyInfoN.form || {};
	
	var _hidden_helper_form_id = "my-hidden-form-only-for-simple-hidden-submit";
	var _createHiddenFormIfNotExist = function() {
		if ($("#"+_hidden_helper_form_id).length < 1) {
			$("body").append($("<form style='display:none;' id='" 
								+ _hidden_helper_form_id + "' method='POST'></form>"));
		}
	};
	
	var _createHiddenArgsForArray = function(argArr) {
		var html = "";
		if (argArr && argArr.length > 0) {
			_.each(argArr, function(argObj) {
				_.each(_.keys(argObj), function(key) {
					html += "<input type='hidden' name='" + key + "' value='" + argObj[key] + "'/>"
				});
			});
		}
		return html;
	};
	var _createHiddenArgs = function(args) {
		var html = "";
		if (args) {
			if (_.isArray(args)) {
				html += _createHiddenArgsForArray(args);
			} else {
				_.each(_.keys(args), function(key) {
					var  obj = args[key];
					if (_.isArray(obj)) {
						html += _createHiddenArgsForArray(obj);
					} else {
						html += "<input type='hidden' name='" + key + "' value='" + obj + "'/>"
					}
				});
			}
		}
		return html;
	};
	root.MyInfoN.form.submit = function(action, args) {
		args = args || {};
		_createHiddenFormIfNotExist();
		var $form = $("#" + _hidden_helper_form_id);
		$form.attr("action", action)
				.html(_createHiddenArgs(args))
				.submit();
	}; 
	
})(jQuery);