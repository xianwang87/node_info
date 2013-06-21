$(".form-edit-container #add-edit-tool").ready(function() {
	$("input[my-type]").click(function(e) {
		var $this = $(this);
		var type = $this.attr("my-type");
		$("input[name=toolType]").val(type);
	});
});