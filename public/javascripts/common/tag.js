;(function($) {
	var root = this;
	root.MyInfoN = root.MyInfoN || {};
	root.MyInfoN.tags = root.MyInfoN.tags || {};
	
	root.MyInfoN.tags.init = function() {
		$(".common-tag-container").each(function(e) {
			var $this = $(this);
			if ($this.attr("tag-can-edit")) {
				var objType = $this.attr("tag-obj-type"),
					objId = $this.attr("tag-obj-id");
				var $tagTitle = $this.find(".common-tag-title");
				var $tagContainer = $this.find(".common-tag-content");
				$tagTitle.click(function(e) {
					$(this).parents(".common-tag-container").toggleClass("edit");
				});
				var $addInput = $("<input></input>").attr({
					type: 'text',
					size: '16'
				}).addClass("tag-name-input");
				var $addBtn = $("<button></button>").addClass("btn btn-mini").text("Add");
				var $addli = $("<li></li>").addClass("add-new-tag");
				$addli.append($addInput);
				$addli.append($addBtn);
				$tagContainer.find("ul").append($addli);
				
				$addBtn.click(function() {
					var tagText = $(this).siblings(".tag-name-input").val();
					if (!tagText || tagText.trim() == '') {
						alert('please input tags...');
						return;
					}
				});
			}
		});
	};
})(jQuery);