$(function(){
	var curLink = $("input[name='res-left-nav-link']").val() || 'remind';
	curLink = "resource-" + curLink + "-left-link";
	$("ul#resouce-left-nav-bar li").each(function() {
		if (curLink == this.id) {
			$(this).addClass("active");
		}
	});
	
	var $treeMenu = $("#resource-left-menu-home");
	$.post("/menu/context/Resource", null, function(data, textStatus) {
			$treeMenu.tree({
		        data: data.menu,
		        autoOpen: true,
		        selectable: true,
		        onCreateLi: function(node, $li) {
			        $li.find('.jqtree-element').attr("node_tip", '<div class="my_menu_tip">' + node.name + '<br>' + node.desc + '</div>');
			    }
		    }).bind("tree.click", function(e) {
		    	var node = e.node;
		    	var nodeSelected = $treeMenu.tree('getSelectedNode');
		    });
		    var node = $treeMenu.tree('getNodeById', 3);
			$treeMenu.tree('selectNode', node);
			
			$('#resource-left-menu-home .jqtree-element').tooltip({
				placement: 'right',
				html: true,
				title: function(){ return $(this).attr('node_tip');}
			});
		}, 'json');
    
    $("#my-menu-article-op-btn-group .btn-add").click(function() {
    	var nodeSelected = $treeMenu.tree('getSelectedNode');
    	if (nodeSelected == null) {
    		return;
    	}
    	var menuFullPath = nodeSelected.name;
    	var nodeTmp = nodeSelected;
    	while (nodeTmp.parent != null && nodeTmp.parent.parent != null) {
    		nodeTmp = nodeTmp.parent;
    		menuFullPath = nodeTmp.name + " > " + menuFullPath;
    	}
    	var $form = $("#edit_article");
    	$form.find("input[name=articleId]").val("-1");
    	$form.find("input[name=menuId]").val(nodeSelected.id);
    	$form.find("input[name=menuFullPath]").val(menuFullPath);
    	$form.submit();
    });
    
    $("#resource-menu-title").hover(function(e) {
    	$(this).find(".my-edit-menu").show();
    }, function(e) {
    	$(this).find(".my-edit-menu").hide();
    });
    
    $("#resource-menu-title .my-edit-menu").click(function(e) {
    	var nodeSelected = $treeMenu.tree('getSelectedNode') || {};
    	MyInfoN.form.submit("/menu/edit", {menu: 'Resource', menuSelected: nodeSelected.id});
    });
});