$(".form-edit-container #add-edit-tool").ready(function() {
	$("input[my-type]").click(function(e) {
		console.log('click me...');
		var $this = $(this);
		var type = $this.attr("my-type");
		$("input[name=toolType]").val(type);
	});
});