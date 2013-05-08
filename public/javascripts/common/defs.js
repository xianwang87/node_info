;(function($) {
	var root = this;
	root.MyInfoN = root.MyInfoN || {};
	root.MyInfoN.defs = root.MyInfoN.defs || {};
	
	root.MyInfoN.defs.ready = false;
	root.MyInfoN.defs.objects = {};
	
	root.MyInfoN.defs.load = function(defNames, callback) {
		$.post("/getLisDefs", 
				$.param({defNames: defNames}),
				function(data, textStatus) {
					root.MyInfoN.defs.objects = data.list;
					root.MyInfoN.defs.ready = true;
					if (callback) {
						callback();
					}
				}, "json");
	};
})(jQuery);