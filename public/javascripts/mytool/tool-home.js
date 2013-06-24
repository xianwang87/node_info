$(function() {
	var curPageType = $("#cur_page_curPageType").val();
	$(".mytool-op-btn-group .btn-add").click(function(e) {
		MyInfoN.ModalIt({
			url: "/mytool/newATool",
			title: "Add New Tool",
			args: {
				curPageType: curPageType
			},
			width: 650,
			height: 300,
			saveFunc: function(e) {
				$("#add-edit-tool-submit").click();
			}
		});
	});
	
	var removeACertainTool = function(id) {
		return function(e) {
			$.post('/mytool/removeATool', 
					{toolId: id},
					function(data, textStatus) {
						MyInfoN.browser.refresh();
					}, 'json');
		};
	};
	var editACertainTool = function(id) {
		return function(e) {
			MyInfoN.ModalIt({
				url: "/mytool/editATool",
				args: {
					toolId: id,
					curPageType: curPageType
				},
				title: "Edit My Tool",
				width: 650,
				height: 300,
				saveFunc: function(e) {
					$("#add-edit-tool-submit").click();
					MyInfoN.dlgModal.hide();
				}
			});
		};
	};
	
	var curLink = $("input[name='res-left-nav-link']").val() || 'html';
	curLink = "mytool-" + curLink + "-left-link";
	$("ul#mytool-left-nav-bar li").each(function() {
		if (curLink == this.id) {
			$(this).addClass("active");
		}
	});
	
	$(".single-common1-item-more-operations ul li").each(function() {
		var $this = $(this);
		var id = $this.attr("my-tool-id");
		if ($this.hasClass("icon-remove")) {
			$this.click(removeACertainTool(id));
		} else if ($this.hasClass("icon-edit")) {
			$this.click(editACertainTool(id));
		}
	});
	
	$(".single-common1-item-title").hover(function() {
		$(this).find(".single-common1-item-more-operations").css("display", "inline-block");
	}, function() {
		$(this).find(".single-common1-item-more-operations").hide();
	});
});
