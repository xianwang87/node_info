$(".task-edit-container").ready(function() {
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
					MyInfoN.dlgModal.hide();
					MyInfoN.browser.refresh();
				},
				"json");
	});
});
