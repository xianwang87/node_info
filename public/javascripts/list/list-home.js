$(function() {
	$('#datetimepicker1').datetimepicker({
		language: 'en',
		pick12HourFormat: true,
		pickTime: false
	});
	
	$('#datetimepicker-time-from').datetimepicker({
		language: 'en',
		pick12HourFormat: true,
		pickDate: false
	});
	
	$('#datetimepicker-time-to').datetimepicker({
		language: 'en',
		pick12HourFormat: true,
		pickDate: false
	});
	
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
					alert("returned..");
				},
				"json");
	});
	
	$(".task-op-btn-group .btn-add").click(function(e) {
		MyInfoN.ModalIt({
			url: "/list/newATask",
			title: "Add New Task",
			width: 650,
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
});
