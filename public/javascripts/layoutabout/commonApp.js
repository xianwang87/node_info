$(function(){
	var curLink = $("input[name='top-link-el']").val() || 'home';
	curLink = "top-" + curLink + "-link";
	$("ul#top-link-bar li").each(function() {
		//$(this).removeClass("active");
		if (curLink == this.id) {
			$(this).addClass("active");
		}
	});
	
	$(".my-bug").each(function() {
		var $this = $(this);
		var text = $this.text();
		var texts = text.split(" ");
		var bugHtml = "";
		_.each(texts, function(text) {
			bugHtml += "<a target='_blank' href='https://<bugzilla-url>/show_bug.cgi?id=" + text + "'>" + text + "</a>";
		});
		$this.html(bugHtml);
	});
});