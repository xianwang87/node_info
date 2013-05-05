$(function(){
	var curLink = $("input[name='res-left-nav-link']").val() || 'remind';
	curLink = "resource-" + curLink + "-left-link";
	$("ul#resouce-left-nav-bar li").each(function() {
		if (curLink == this.id) {
			$(this).addClass("active");
		}
	});
});