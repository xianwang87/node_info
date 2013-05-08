$(function() {
	
	$("#add-edit-task-submit").click(function(e) {
		$.post("/addNewTask",
				{
					name: $("#task-name").val(),
					priority: $("#task-priority").val(), 
					desc: $("#task-description").val(),
					onDate: $("#datetimepicker1 input").val(),
					ftime: $("#datetimepicker-time-from input").val(),
					ttime: $("#datetimepicker-time-to input").val()
				},
				function(data, textStatus) {
					MyInfoN.dlgModal.hide();
					MyInfoN.browser.refresh();
				},
				"json");
	});
	
	$(".task-op-btn-group .btn-add").click(function(e) {
		MyInfoN.ModalIt({
			url: "/list/newATask",
			title: "Add New Task",
			width: 650,
			height: 450,
			saveFunc: function(e) {
				$("#add-edit-task-submit").click();
			}
		});
	});
	
	$(".table-tasks tbody tr").hover(function(e) {
		var name = $(this).attr("name"),
			$parent = $(this).parent("tbody");
		$parent.find("tr[name=" + name + "]").addClass("hover");
		$parent.find("tr.second-row[name=" + name + "] div.task-op-items").show();
	}, function(e) {
		//$(this).removeClass("hover");
		var name = $(this).attr("name"),
			$parent = $(this).parent("tbody");
		$parent.find("tr[name=" + name + "]").removeClass("hover");
		$parent.find("tr.second-row[name=" + name + "] div.task-op-items").hide();
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
				height: 450,
				saveFunc: function(e) {
					//$("#add-edit-task-submit").click();
					MyInfoN.dlgModal.hide();
				}
			});
		};
	};
	$(".table-tasks .task-op-items ul li").each(function() {
		var $this = $(this);
		var id = $this.parents(".task-op-items").attr("data-el-id");
		if ($this.hasClass("icon-remove")) {
			$this.click(removeACertainTask(id));
		} else if ($this.hasClass("icon-edit")) {
			$this.click(editACertainTask(id));
		}
	});
	
	var curLink = $("input[name='res-left-nav-link']").val() || 'today';
	curLink = "task-" + curLink + "-left-link";
	$("ul#task-left-nav-bar li").each(function() {
		if (curLink == this.id) {
			$(this).addClass("active");
		}
	});
	
	var def_list_obj = [];
	$("[click-modify]").each(function(i, el) {
		var $el = $(el);
		def_list_obj.push({def: $el.attr("click-modify"), type: $el.attr("click-modify-type")});
	});
	
	var def_list_obj_def = _.map(def_list_obj, function(obj) {return obj.def;});
	if (def_list_obj_def.length > 0) {
		MyInfoN.defs.load(def_list_obj_def, function() {
			MyInfoN.widget.helper.initHiddenEls(def_list_obj);
			$("[click-modify]").dblclick(function(e) {
				var $this = $(this),
					refId = $this.attr("refer-id"),
					afterMethod = $this.attr("click-modify-after"),
					statusCode = $this.attr("task-status-code");
				MyInfoN.widget.helper.showWidget("select", "task_status", $this, {
					whenShow: function($el) {
						$el.val(statusCode);
					},
					events: {
						change: function(e) {
							$(this).hide();
							$.post("/list/task/chgStatus",
									{
										taskId: refId,
										status: $(this).val()
									},
									function(data, textStatus) {
										if (afterMethod == "refresh") {
											MyInfoN.browser.refresh();
										}
									}, "json")
						}
					}
				});
			});
		});
	}
});
