$(".form-edit-container #add-edit-work").ready(function() {
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
	
	$("#add-edit-work-submit").click(function(e) {
		$.post("/mywork/addNewWork",
				{
					title: $("#work-title").val(),
					onDate: $("#datetimepicker1 input").val(),
					desc: tinyMCE.activeEditor.getContent()
				},
				function(data, textStatus) {
					MyInfoN.dlgModal.hide();
					MyInfoN.browser.refresh();
				},
				"json");
	});
	
	var blnNewWork = $("input[name=workId]").val();
	if (!blnNewWork || blnNewWork < 0) {
		var curTime = new Date().getTime();
		$('#datetimepicker1 input').val(MyInfoN.date.getOnlyDateStr(curTime));
	}
	
	MyInfoN.RT.TinyMCE.initBase("#work-description");
});