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
	
	var removeACertainWork = function(id) {
		return function(e) {
			$.post('/mywork/removeAWork', 
					{workId: id},
					function(data, textStatus) {
						MyInfoN.browser.refresh();
					}, 'json');
		};
	};
	var editACertainWork = function(id) {
		return function(e) {
			MyInfoN.ModalIt({
				url: "/mywork/editAWork",
				args: {
					workId: id
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
	
	$(".work-date-expand").click(function(e) {
		var $this = $(this);
		var $expandEl = $this.find("span.icon-fold");
		if ($expandEl.hasClass("icon-chevron-down")) {
			$expandEl.removeClass("icon-chevron-down")
					.addClass("icon-chevron-right");
			$this.parents(".single-date-work").find(".work-items").hide();
		} else {
			$expandEl.removeClass("icon-chevron-right")
					.addClass("icon-chevron-down");
			$this.parents(".single-date-work").find(".work-items").show();
		}
	});
	
	$(".work-items li").hover(function(e) {
		$(this).addClass("hover");
		$(this).find(".item-name-op-group ul").show();
	}, function(e) {
		$(this).removeClass("hover");
		$(this).find(".item-name-op-group ul").hide();
	});
	
	$(".item-name-op-group li").each(function() {
		var $this = $(this);
		var id = $this.parents(".item-name-op-group").attr("data-el-id");
		if ($this.hasClass("icon-remove")) {
			$this.click(removeACertainWork(id));
		} else if ($this.hasClass("icon-edit")) {
			$this.click(editACertainWork(id));
		}
	}).click(function(e) {
		var $this = $(this);
		
	});
});
