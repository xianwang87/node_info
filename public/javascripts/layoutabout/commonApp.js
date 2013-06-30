$(function(){
	var root = this;
	root.MyInfoN = root.MyInfoN || {};
	
	var curLink = $("input[name='top-link-el']").val() || 'home';
	curLink = "top-" + curLink + "-link";
	$("ul#top-link-bar li").each(function() {
		//$(this).removeClass("active");
		if (curLink == this.id) {
			$(this).addClass("active");
		}
	});
	
	$.get('/help/bugzilla/host',
		{}, 
		function(data, textStatus) {
			addBugzillaLink(data.host);
		}, 'json');
	function addBugzillaLink(host) {
		$(".my-bug").each(function() {
			var $this = $(this);
			var text = $this.text();
			var texts = text.split(" ");
			var bugHtml = "";
			_.each(texts, function(text) {
				bugHtml += "<a target='_blank' href='" + host + "/show_bug.cgi?id=" + text + "'>" + text + "</a>";
			});
			$this.html(bugHtml);
		});
	}
	
	MyInfoN.tags.init();
});