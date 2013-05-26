$(function(){
	$("#add-edit-menu-article-submit").click(function() {
		var $form = $("#add-edit-menu-article");
		$form.find("article-content").val(tinyMCE.activeEditor.getContent());
		$form.submit();
	});

	MyInfoN.RT.TinyMCE.initBase("#article-content");
});