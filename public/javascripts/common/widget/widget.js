;(function($) {
	var root = this;
	root.MyInfoN = root.MyInfoN || {};
	root.MyInfoN.widget = root.MyInfoN.widget || {};
	
	var getHiddenHelperElName = function(defName) {
		return defName + "-def-hidden-el";
	};
	var createHiddenHelperElToBody = function(type, defName) {
		var html = "";
		if (type == "select"
			 && MyInfoN.defs.objects
			 && defName in MyInfoN.defs.objects) {
			 html = "<select name='" + getHiddenHelperElName(defName) + "'>";
			_.each(MyInfoN.defs.objects[defName], function(obj) {
				html += '<option value="' + obj.value + '">' + obj.text + "</option>";
			});
			html += "</select>";
		}
		
		if (html) {
			$("body").append(
				$(html)
				.hide()
				.blur(function(e) {
					$(this).hide();
				})
				);
		}
	};
	var getHiddenHelperEl = function(type, defName) {
		var selector = type + "[name=" + getHiddenHelperElName(defName) + "]";
		return $(selector);
	};
	var prepareHiddenHelperEl = function(type, defName) {
		var selector = type + "[name=" + getHiddenHelperElName(defName) + "]";
		if ($(selector).length < 1) {
			createHiddenHelperElToBody(type, defName);
		}
	};
	
	root.MyInfoN.widget.helper = {
		getDropdownEl: function(defName) {
			if (defName in root.MyInfoN.widget.select) {
				return root.MyInfoN.widget.select[defName];
			}
			return null;
		},
		initHiddenEls: function(defList) {
			_.each(defList, function(obj) {
				prepareHiddenHelperEl(obj.type, obj.def);
			});
		},
		showWidget: function(type, defName, $el, options) {
			options = options || {}; 
			var offset = $el.offset();
			var $targetEl = getHiddenHelperEl(type, defName);
			if (options.whenShow) {
				options.whenShow($targetEl);
			}
			$targetEl.css({
				"position": "absolute",
				"top": offset.top,
				"left": offset.left
				}).show().focus();
			if (options.events) {
				_.each(_.keys(options.events), function(key) {
					$targetEl[key](options.events[key]);
				});
			}
		},
		hideWidget: function(type, defName) {
			getHiddenHelperEl(type, defName).hide();
		}
	};
	
	root.MyInfoN.widget.select = {};
	
})(jQuery);