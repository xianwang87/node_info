;(function($) {
	var root = this;
	root.MyInfoN = root.MyInfoN || {};
	
	var showModalDialog = function(html) {
		$("#myCommonModalDlg .modal-body").html(html);
		$("#myCommonModalDlg").modal({});
	};
	
	$(function() {
		$("#myCommonModalDlg").on("shown", function() {
			if (!init_left_pos) {
				init_left_pos = $("#myCommonModalDlg").position().left;
			}
			$("#myCommonModalDlg").css("left", init_left_pos-(widthTmp-init_dlg_width)/2);
		}).on("hidden", function() {
			$("#myCommonModalDlg .modal-body").html("");
		});
	});
	
	var screenWidth = $(window).width();
	var pre_click_event;
	var init_left_pos = 0,
		init_dlg_width = 560;
	var widthTmp;
	root.MyInfoN.ModalIt = function(options) {
		options = options || {};
		widthTmp = options.width || 760;
		$("#myCommonModalDlg").width(widthTmp);
		$("#myCommonModalDlg-title").html(options.title || "Default Title");
		$("#myCommonModalDlg-save").unbind("click", pre_click_event);
		$("#myCommonModalDlg-save").click(options.saveFunc);
		pre_click_event = options.saveFunc;
		var html = options.html || "";
		if (!html && options.url) {
			$.post(options.url,
					options.args || {},
					function(data, textStatus) {
						showModalDialog(data);
					}, "html");
		} else {
			showModalDialog(html);
		}
	};
})(jQuery);