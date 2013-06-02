$(function(){
	var inMenuItem = $("#inMenuItemValue").val();
	var $treeMenu = $("#resource-left-menu-home");
	
	var getMenuFullPath = function(nodeSelected) {
		if (!nodeSelected) {
			return $("ul#resouce-left-nav-bar > li.active > a").text();
		}
		var menuFullPath = nodeSelected.name;
    	var nodeTmp = nodeSelected;
    	while (nodeTmp.parent != null && nodeTmp.parent.parent != null) {
    		nodeTmp = nodeTmp.parent;
    		menuFullPath = nodeTmp.name + " > " + menuFullPath;
    	}
    	return menuFullPath;
	};
    $("#my-menu-article-op-btn-group .btn-add").click(function() {
    	var nodeSelected = $treeMenu.tree('getSelectedNode');
    	if (nodeSelected == null) {
    		return;
    	}
    	var $form = $("#edit_article");
    	$form.find("input[name=articleId]").val("-1");
    	$form.find("input[name=menuId]").val(nodeSelected.id);
    	$form.find("input[name=listType]").val($("#menuListType").val());
    	$form.find("input[name=menuFullPath]").val(getMenuFullPath(nodeSelected));
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
    
    var addArticleDetailViewClick = function($el) {
    	var $els;
    	if ($el) {
    		$els = $el.find("[my-article-more]");
    	} else {
    		$els = $("[my-article-more]");
    	}
    	if ($els) {
		    $els.click(function(e) {
		    	var $this = $(this);
		    	var menuId = $this.attr("my-article-id");
		    	var menuFullPath = getMenuFullPath($treeMenu.tree('getSelectedNode'));
		    	MyInfoN.form.submit('/resource/article/detail', {menuId: menuId, 
		    							menuFullPath: menuFullPath,
		    							listType: $("input[name='res-left-nav-link']").val()});
		    });
	    }
    };
    
    var listType = $("input[name='res-left-nav-link']").val();
    var contentPage = '/resource/getArticle';
    if (listType) {
    	contentPage = '/resourceHome/' + listType;
    }
    $('#resource-item-lists').scrollPagination({
		'contentPage': contentPage,
		'contentData': {
			'snippet': true,
			'menuId': inMenuItem,
			'listType': listType
		},
		'scrollTarget': $(window),
		'heightOffset': 10,
		'beforeLoad': function(){
			$('#loading').fadeIn();	
			this.contentData.listItems = $('#resource-item-lists').find(".single-resource-item").length;
		},
		'afterLoad': function(elementsLoaded){
			 $('#loading').fadeOut();
			 var i = 0;
			 $(elementsLoaded).fadeInWithDelay();
			 if (elementsLoaded.length < 1){
			 	$('#nomoreresults').fadeIn();
				$('#resource-item-lists').stopScrollPagination();
			 }
			 _.each(elementsLoaded, function(el) {
			 	addArticleDetailViewClick($(el));
			 });
		}
	});
	
});