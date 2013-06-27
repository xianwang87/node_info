var _ = require("underscore");

var mysql = require('../common/db/dbmysql').db;
var menuUtil = require('../menu/menuUtil').menuUtil;
var menuReturn = require('../menu/menuReturn');
var dateUtil = require('../common/helper/dateUtil').dateUtil;

var getCommonMenu = function(req, res) {
	var menuFor = req.params.menuFor;
	menuUtil.proxy.loadMenuToGo(req, menuFor, null, function(menuObj) {
		res.json({menu: menuObj});
	});
};

var editMenuContext = function(req, res) {
	var menuFor = req.body.menu,
		menuSelected = req.body.menuSelected;
	res.render('common/menu/menuEdit', {title: 'Edit Menu', 
					top_link: menuUtil.TOP_MENU_FOR[menuFor], 
					menuFor: menuFor,
					menuSelected: menuSelected});
};

var _idNotReallyExist = function(id) {
	return !id || id[0] == 'A';
};
var _getAnValidId = function(id) {
	if (_idNotReallyExist(id)) {
		return -2;
	}
	return id;
};

var updateMenuContext = function(req, res) {
	var menuFor = req.body.menuFor,
		menuSelected = req.body.menuSelected,
		ids = req.body.id,
		names = req.body.name,
		descs = req.body.desc,
		levels = req.body.level,
		parents = req.body.parent,
		orders = req.body.myorder;
	var curDate = dateUtil.getDateStr(new Date().getTime());
	
	var _getUpdateQuery = function(i) {
		var sql = "update my_menus set name=?, mydesc=?, level=?, parent=?, myorder=?,"
					+ " lastModifyDate=? where id=?";
		var params = [names[i], descs[i], levels[i], _getAnValidId(parents[i]), orders[i], curDate, ids[i]];
		
		return {
			sql: sql,
			params: params
		};
	};
	var _getAddQuery = function(i) {
		var sql = "insert into my_menus(menuFor, name, mydesc, level, parent, myorder, addDate, lastModifyDate)"
					+ " values(?, ?, ?, ?, ?, ?, ?, ?)";
		var params = [menuFor, names[i], descs[i], levels[i], _getAnValidId(parents[i]), orders[i], curDate, curDate];
		
		return {
			sql: sql,
			params: params
		};
	};
	
	var _getCurIdForNotExist = function(arr, i, newIdMap) {
		var result = arr[i];
		if (result in newIdMap) {
			result = newIdMap[result];
		}
		return result;
	};
	var _getUpdateParentQuery = function(i, newIdMap) {
		newIdMap = newIdMap || {};
		var id = _getCurIdForNotExist(ids, i, newIdMap),
			pId = _getCurIdForNotExist(parents, i, newIdMap);
		var sql = "update my_menus set parent=? where id=?";
		var params = [pId, id];
		
		return {
			sql: sql,
			params: params
		};
	};
	var _updateAllNotExistParents = function(trans, newIdMap) {
		var needParents = [];
		_.each(parents, function(parent, i) {
			if (_idNotReallyExist(parent)) {
				needParents.push({
					id: parent,
					idx: i
				});
			}
		});
		
		if (needParents && needParents.length > 0) {
			var maxParentsLen = needParents.length,
				curLength = 0;
			var blnError = false;
			_.each(needParents, function(parent) {
				var idx = parent.idx,
					parent = parent.parent;
				var myQuery = _getUpdateParentQuery(idx, newIdMap);
				trans.query(myQuery.sql, myQuery.params, function(err, results, fields) {
					if (err) {
						blnError = true;
						trans.rollback();
					} else {
						curLength++;
						if (curLength == maxParentsLen) {
							_doCommitQueryTrans(trans);
						}
					}
				});
			});
		} else {
			_doCommitQueryTrans(trans);
		}
	};
	
	var _doCommitQueryTrans = function(trans) {
		trans.commit();
		menuReturn.getMenuSuccPageReturn(menuFor)(req, res);
	};
	
	var myIds = [];
	_.each(ids, function(id) {
		if (!_idNotReallyExist(id)) {
			myIds.push(parseFloat(id));
		}
	});
	var trans = mysql.startTransaction();
	if (myIds.length == 0) {
		myIds.push(-1);
	}
	var totalLength = ids.length + 2,
		curLength = 0;
	trans.query("select id from my_menus where id not in (?)", [myIds], function(err, results, fields) {
		if (err) {
			console.log(err);
			trans.rollback();
		} else {
			curLength++;
			var idrm = [];
			if (results && _.isArray(results) && results.length > 0) {
				_.each(results, function(result) {
					idrm.push(result.id);
				});
			} else {
				idrm.push(-1);
			}
			trans.query("delete from my_menus where id in (?)", [idrm], function(err, results, fields) {
				if (err) {
					trans.rollback();
				} else {
					curLength++;
					var blnError = false;
					var myQuery,
						blnInsert = false,
						newIdMap = {};
					_.each(ids, function(id, i) {
						if (blnError) {
							return;
						}
						if (_idNotReallyExist(id)) {
							blnInsert = true;
							myQuery = _getAddQuery(i);
						} else {
							blnInsert = false;
							myQuery = _getUpdateQuery(i);
						}
						trans.query(myQuery.sql, myQuery.params, function(err, results, fields) {
							if (err) {
								blnError = true;
								trans.rollback();
							} else {
								if (blnInsert) {
									newIdMap[ids[i]] = results.insertId;
								}
								curLength++;
								if (curLength == totalLength) {
									//trans.commit();
									_updateAllNotExistParents(trans, newIdMap);
								}
							}
						});
					});
				}
			});
		}
	});
	
	trans.execute();
};

exports.getCommonMenu = getCommonMenu;
exports.editMenuContext = editMenuContext;
exports.updateMenuContext = updateMenuContext;