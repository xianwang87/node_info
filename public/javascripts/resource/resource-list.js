$(function(){
	var inMenuItem = $("#inMenuItemValue").val();
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
    
    if (!inMenuItem || inMenuItem < 0) {
    	$("#my-menu-article-op-btn-group").hide();
    	$("#resource-item-lists").addClass("resource-item-lists-top");
    }
    
    $("[my-article-more]").click(function(e) {
    	var $this = $(this);
    	var menuId = $this.attr("my-article-id");
    	MyInfoN.form.submit('/resource/article/detail', {menuId: menuId, 
    							listType: $("input[name='res-left-nav-link']").val()});
    });
});