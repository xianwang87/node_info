;(function($) {
	var root = this;
	root.MyInfoN = root.MyInfoN || {};
	root.MyInfoN.RT = root.MyInfoN.RT || {};
	root.MyInfoN.RT.TinyMCE = root.MyInfoN.RT.TinyMCE || {};
	
	var def_tinymce_option_base = {
		menubar: false,
		plugins: [
	        "advlist autolink lists link image charmap print preview anchor",
	        "searchreplace visualblocks code fullscreen",
	        "insertdatetime media table contextmenu paste"
	    ],
		toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link"
	};
	root.MyInfoN.RT.TinyMCE.init = function(baseOption, selector, options, callback) {
		options = options || {};
		var tinyOption = $.extend(true, {}, baseOption, options.tiny || {});
		tinyOption.selector = selector;
		tinymce.init(tinyOption);
	};
	
	root.MyInfoN.RT.TinyMCE.initBase = function(selector, options, callback) {
		root.MyInfoN.RT.TinyMCE.init(def_tinymce_option_base, selector, options, callback);
	};
	
})(jQuery);