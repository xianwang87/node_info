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
			$.post('/mywork/removeAWork', 
					{workId: id},
					function(data, textStatus) {
						MyInfoN.browser.refresh();
					}, 'json');
		};
	};
	var editACertainTool = function(id) {
		return function(e) {
			MyInfoN.ModalIt({
				url: "/mywork/editAWork",
				args: {
					workId: id,
					curPageType: curPageType
				},
				title: "Edit My Work",
				width: 650,
				height: 300,
				saveFunc: function(e) {
					$("#add-edit-work-submit").click();
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
	
});
