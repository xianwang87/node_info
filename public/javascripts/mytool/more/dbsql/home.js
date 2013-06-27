$(function() {
	$(".mytool-op-btn-group .btn-add").click(function(e) {
		MyInfoN.ModalIt({
			url: "/mytool/db/sql/add",
			title: "Add New Database SQL",
			width: 650,
			height: 470,
			saveFunc: function(e) {
				$("#add-edit-sql-submit").click();
			}
		});
	});
	
	var removeACertainTool = function(id) {
		return function(e) {
			$.post('/mytool/db/sql/remove', 
					{sqlId: id},
					function(data, textStatus) {
						MyInfoN.browser.refresh();
					}, 'json');
		};
	};
	var editACertainTool = function(id) {
		return function(e) {
			MyInfoN.ModalIt({
				url: "/mytool/db/sql/edit",
				args: {
					sqlId: id
				},
				title: "Edit Database SQL",
				width: 650,
				height: 470,
				saveFunc: function(e) {
					$("#add-edit-sql-submit").click();
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
