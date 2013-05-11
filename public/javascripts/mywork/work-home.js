$(function() {
	$(".mywork-op-btn-group .btn-add").click(function(e) {
		MyInfoN.ModalIt({
			url: "/mywork/newAWork",
			title: "Add New Work",
			width: 650,
			height: 400,
			saveFunc: function(e) {
				$("#add-edit-work-submit").click();
			}
		});
	});
	
	var removeACertainTask = function(id) {
		return function(e) {
			$.post('/list/removeATask', 
					{taskId: id},
					function(data, textStatus) {
						MyInfoN.browser.refresh();
					}, 'json');
		};
	};
	var editACertainTask = function(id) {
		return function(e) {
			MyInfoN.ModalIt({
				url: "/list/editATask",
				args: {
					taskId: id
				},
				title: "Edit Task",
				width: 650,
				height: 300,
				saveFunc: function(e) {
					//$("#add-edit-task-submit").click();
					MyInfoN.dlgModal.hide();
				}
			});
		};
	};
	
	var curLink = $("input[name='res-left-nav-link']").val() || 'finished';
	curLink = "mywork-" + curLink + "-left-link";
	$("ul#mywork-left-nav-bar li").each(function() {
		if (curLink == this.id) {
			$(this).addClass("active");
		}
	});
	
	$(".page_container[page_for=task_list] ul li[page_number]").click(function(e) {
		var $this = $(this);
		if ($this.hasClass("disabled")) { 
			return;
		}
		var page_number = $this.attr("page_number");
		window.location.href = "/list/pitems/page/" + page_number;
	});
});
