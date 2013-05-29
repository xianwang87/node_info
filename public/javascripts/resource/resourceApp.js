$(function(){
	var curLink = $("input[name='res-left-nav-link']").val() || 'recentlyAdded';
	curLink = "resource-" + curLink + "-left-link";
	$("ul#resouce-left-nav-bar li").each(function() {
		if (curLink == this.id) {
			$(this).addClass("active");
		}
	});
	
	var inMenuItem = $("#inMenuItemValue").val();
	var $treeMenu = $("#resource-left-menu-home");
	$.post("/menu/context/Resource", null, function(data, textStatus) {
			$treeMenu.tree({
		        data: data.menu,
		        autoOpen: true,
		        selectable: true,
		        onCreateLi: function(node, $li) {
			        $li.find('.jqtree-element').attr("node_tip", '<div class="my_menu_tip">' + node.name + '<br>' + node.desc + '</div>');
			    },
			    onCanSelectNode: function(node) {
			    	var nodeSelected = $treeMenu.tree('getSelectedNode');
			    	if (nodeSelected && nodeSelected.id == node.id) {
			    		return false;
			    	}
			    	return true;
			    }
		    }).bind("tree.click", function(e) {
		    	var node = e.node;
		    	var nodeSelected = $treeMenu.tree('getSelectedNode');
		    	if (!nodeSelected || nodeSelected.id != node.id) {
		    		MyInfoN.form.submit('/resource/getArticle', {menuId: e.node.id});
		    	}
		    }).bind("tree.select", function(e) {
		    	// do nothing for now
		    });
		    var node = $treeMenu.tree('getNodeById', inMenuItem);
			$treeMenu.tree('selectNode', node);
			
			$('#resource-left-menu-home .jqtree-element').tooltip({
				placement: 'right',
				html: true,
				title: function(){ return $(this).attr('node_tip');}
			});
		}, 'json');
    
});