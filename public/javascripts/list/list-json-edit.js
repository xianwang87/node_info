$(".task-edit-container").ready(function() {
	$('#datetimepicker1').datetimepicker({
		format: 'yyyy-mm-dd',
		todayBtn: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		maxView: 2,
		showMeridian: 1,
		autoclose: 1
	});
	
	function initTimeSelector(e) {
		$(this).datetimepicker('setStartDate', $("#datetimepicker1 input").val())
				.datetimepicker('update');
	};
	$('#datetimepicker-time-from').datetimepicker({
		format: 'hh:ii',
		startView: 1,
		minView: 0,
		maxView: 1,
		showMeridian: 1,
		autoclose: 1,
		minuteStep: 30
	}).on('show', initTimeSelector);
	
	$('#datetimepicker-time-to').datetimepicker({
		format: 'hh:ii',
		startView: 1,
		minView: 0,
		maxView: 1,
		showMeridian: 1,
		autoclose: 1,
		minuteStep: 30
	}).on('show', initTimeSelector);
	
	$(".my-task-time-check").click(function(e) {
		$(".my-task-edit-time-range").toggleClass("hidden", !this.checked);
	});
	
	$("#add-edit-task-submit").click(function(e) {
		$.post("/addNewTask",
				{
					id: $("input[name=taskId]").val(),
					name: $("#task-name").val(),
					priority: $("#task-priority").val(), 
					desc: tinyMCE.activeEditor.getContent(),
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
	
	
	var blnNewTask = $("input[name=taskId]").val();
	if (!blnNewTask || blnNewTask < 0) {
		var curTime = new Date().getTime();
		$('#datetimepicker1 input').val(MyInfoN.date.getOnlyDateStr(curTime));
		$('#datetimepicker-time-from input').val(MyInfoN.date.getOnlyHourStr(curTime));
		$('#datetimepicker-time-to input').val(MyInfoN.date.getOnlyHourStr(curTime, 1));
	}
	
	//var priorityVal = $("#task-priority-val").val() || 0;
	//$("#task-priority").val(priorityVal);
	
	MyInfoN.RT.TinyMCE.initBase("#task-description");
});
