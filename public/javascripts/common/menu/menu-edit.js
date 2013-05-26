$(function(){
	var $rtContext = $("#context-menu-container");
	var $treeMenu = $("#menu-edit-container");
	$.post("/menu/context/" + $("#menuFor").val(), null, function(data, textStatus) {
		$treeMenu.tree({
	        data: data.menu,
	        autoOpen: true,
	        selectable: true,
	        dragAndDrop: true,
	        onCreateLi: function(node, $li) {
		        var $divEl = $li.find('.jqtree-element');
		        	$divEl.attr("node_tip", '<div class="my_menu_tip">' 
		        			+ node.name + '<br>' + node.desc + '</div>');
		        if (node.desc) {
		        	$divEl.append('<span class="my-menu-desc">(' + node.desc + ')</span>');
		        }
		    }
	    }).bind("tree.click", function(e) {
	    	var node = e.node;
	    	//$treeMenu.tree('selectNode', node);
	    }).bind('tree.contextmenu', function(e) {
			var node = e.node;
			$treeMenu.tree('selectNode', node);
			var ee = e.click_event;
			$rtContext.show().offset({
							left: ee.pageX,
							top: ee.pageY
							});
		});
	    
	    $('#menu-edit-container .jqtree-element').tooltip({
				placement: 'right',
				html: true,
				title: function(){ return $(this).attr('node_tip');}
			});
	 }, 'json');
	 

	$("body").click(function(e) {
		$rtContext.hide();
	});
	
	var addCertainNode = function(options) {
		options = options || {};
		var addType = options.addType,
			blnEdit = options.blnEdit;
		return function(e) {
			var menuObj = null;
			var nodeSelected = $treeMenu.tree('getSelectedNode');
			if (blnEdit) {
				menuObj = {
					name: nodeSelected.name,
					desc: nodeSelected.desc
				};
			};
			showEditMenuItemDlg(menuObj, function(nodeObj) {
				$treeMenu.tree(
				   	addType,
				    {
				        label: nodeObj.name,
				        desc: nodeObj.desc,
				        id: null
				    },
				    nodeSelected
				);
				MyInfoN.dlgModal.hide();
			});
		};
	};
	
	var updateCertainNode = function() {
		return function(e) {
			var nodeSelected = $treeMenu.tree('getSelectedNode');
			var menuObj = {
					name: nodeSelected.name,
					desc: nodeSelected.desc
				};
			showEditMenuItemDlg(menuObj, function(nodeObj) {
				$treeMenu.tree(
				   	'updateNode',
				   	nodeSelected,
				    {
				        label: nodeObj.name,
				        desc: nodeObj.desc,
				        id: null
				    }
				);
				MyInfoN.dlgModal.hide();
			});
		};
	};
	
	var removeCertainNode = function(e) {
		var nodeSelected = $treeMenu.tree('getSelectedNode');
		$treeMenu.tree('removeNode', nodeSelected);
	};
	
	$("#context-menu-container li").each(function(idx, el) {
		var $li = $(el);
		if ($li.hasClass("menu-add-after")) {
			$li.click(addCertainNode({addType: "addNodeAfter"}));
		} else if ($li.hasClass("menu-add-before")) {
			$li.click(addCertainNode({addType: "addNodeBefore"}));
		} else if ($li.hasClass("menu-add-parent")) {
			$li.click(addCertainNode({addType: "addParentNode"}));
		} else if ($li.hasClass("menu-add-child")) {
			$li.click(addCertainNode({addType: "appendNode"}));
		} else if ($li.hasClass("menu-add-remove")) {
			$li.click(removeCertainNode);
		} else if ($li.hasClass("menu-add-update")) {
			$li.click(updateCertainNode());
		}
	});
	
	$(".btn-my-submit").click(function(e) {
		var orderTmp = 0;
		var nodes = [];
		var _curTmpIdIdx = 0;
		var _getNodeId = function(data) {
			if (!data.id) {
				data.id = 'A' + _curTmpIdIdx++;
			}
			return data.id;
		};
		var iterateTreeNode = function(nodeArr, curLevel, parent) {
			if (nodeArr && nodeArr.length > 0) {
				_.each(nodeArr, function(data) {
					nodes.push({
						id: _getNodeId(data),
						name: data.name,
						desc: data.desc,
						level: curLevel,
						parent: parent,
						myorder: orderTmp++
					});
					if (data.children) {
						iterateTreeNode(data.children, curLevel+1, data.id);
					}
				});
			}
		};
		var treeJson = $treeMenu.tree("toJson");
		iterateTreeNode(eval(treeJson), 1, 0);
		
		var menuFor = $("#menuFor").val(),
			menuSelected = $("#menuSelected").val();
		MyInfoN.form.submit('/menu/update', {menuFor: menuFor, 
											 menuSelected: menuSelected, 
											 nodes: nodes});
	});
	
	var showEditMenuItemDlg = function(options, callback) {
		options = options || {name:"", desc:""};
		var title = "Add Menu Item";
		if (options.name != "") {
			title = "Edit Menu Item";
		}
		MyInfoN.ModalIt({
			html: $("#my-menu-edit-form-container").html(),
			title: title,
			width: 380,
			height: 180,
			saveFunc: function(e) {
				if (callback) {
					callback({
						name: $(".modal-body .menu-item-name").val(),
						desc: $(".modal-body .menu-item-desc").val()
					});
				}
			},
			callback: function() {
				$(".modal-body .menu-item-name").val(options.name);
				$(".modal-body .menu-item-desc").val(options.desc);
			}
		});
	};
});