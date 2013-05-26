var _ = require("underscore");
var mysql = require('../common/db/dbmysql').db;

var MENU_CATEGORY = {
	RESOURCE: "Resource"
};

var NO_CACHE_FLAG = true;
var cachedMenu = {
	changed: {}
};

var TOP_MENU_FOR = {};
TOP_MENU_FOR[MENU_CATEGORY.RESOURCE] = 'resources';

var menuUtil = {
	loadMenuToGo: function(req, menuCategory, user, callback) {
		var self = this;
		req.session.myMenu = req.session.myMenu || {};
		if (!(menuCategory in req.session.myMenu)
			|| NO_CACHE_FLAG
			|| (!NO_CACHE_FLAG && cachedMenu.changed[menuCategory] && cachedMenu.changed[menuCategory][user])) {
			return this._loadMenuFromDB(menuCategory, user, function(menuObj){
				cachedMenu.changed[menuCategory] = cachedMenu.changed[menuCategory] || {};
				cachedMenu.changed[menuCategory][user] = false;
				req.session.myMenu[menuCategory] = menuObj;
				callback(self._prepareRootIfNoNode(menuObj));
			});
		}
		return callback(self._prepareRootIfNoNode(req.session.myMenu[menuCategory]));
	},
	_prepareRootIfNoNode: function(menuObj) {
		menuObj = menuObj || [];
		if (menuObj.length == 0) {
			menuObj.push({
						label: 'Root',
						id: 'A-1',
						desc: 'Root Menu Node'
					});
		}
		return menuObj;
	},
	_loadMenuFromDB: function(menuCategory, user, callback) {
		var getCurParentHolder = function(parents, id) {
			var parentObj = _.find(parents, function(obj) { return obj.id == id;});
			if (!parentObj.children) {
				parentObj.children = [];
			}
			return parentObj.children;
		};
		mysql.query("select id, name, mydesc, level, parent from my_menus where menuFor=?"
						+ " order by level asc, myorder asc"
						, [menuCategory]
						, function(err, results, fields) {
						var menuObj = [];
						var menuNode,
							curLevel,
							curLvlArr = [],
							preLvlArr = [],
							preHolder = menuObj;
						_.each(results, function(result) {
							var level = result['level'];
							if (level > 1 && level != curLevel) {
								curLevel = level;
								curLvlArr = preLvlArr;
								preLvlArr = [];
							}
							if (level > 1) {
								preHolder = getCurParentHolder(curLvlArr, result['parent']);
							}
							menuNode = {
								label: result['name'],
								id: result['id'],
								desc: result['mydesc']
							};
							preHolder.push(menuNode);
							preLvlArr.push(menuNode);
						});
						callback(menuObj);
			});
	},
	setMenuChanged: function(menuCategory, user, status) {
		cachedMenu.changed[menuCategory] = cachedMenu.changed[menuCategory] || {};
		cachedMenu.changed[menuCategory][user] = status;
	}
};


exports.menuUtil = {
	MENU_CATEGORY: MENU_CATEGORY,
	TOP_MENU_FOR: TOP_MENU_FOR,
	proxy: menuUtil
};