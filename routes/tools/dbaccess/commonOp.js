var _ = require("underscore");

var mysql = require('../../common/db/dbmysql').db;
var dateUtil = require('../../common/helper/dateUtil').dateUtil;
var MY_ENUM = require('../../common/constant/enum').MY_ENUM,
	DB_TYPES = MY_ENUM.DB_TYPES,
	TOP_LINK = MY_ENUM.TOP_LINK;
var pagination = require('../../common/pagination');
var pageUtil = require('../../common/helper/pageUtil').pageUtil;
var pgConnPool = require('./pg/getConn').connPool;

var _getCreateDBConnQuery = function(options) {
	var sql = "insert into my_dbconns(username, password, host, dbname, dbtype, addDate, lastModifyDate)"
				+ " values (?, ?, ?, ?, ?, ?, ?)";
	var params = [];
	params.push(options.username);
	params.push(options.password);
	params.push(options.host);
	params.push(options.dbname);
	params.push(_getRealDBType(options.dbtype));
	params.push(options.addDate);
	params.push(options.lastModifyDate);
	
	return {
		sql: sql,
		params: params
	};
};
var addDBConnOptionInDB = function(options, callback) {
	var curDate = dateUtil.getDateStr(new Date().getTime());
	options.addDate = curDate;
	options.lastModifyDate = curDate;
	
	var myQuery = _getCreateDBConnQuery(options);
	mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
		if (err) {
			callback(false, err);
		} else {
			callback(true);
		}
	});
};
var addDBConnOption = function(req, res) {
	var options = {};
	options.username = req.body.username;
	options.password = req.body.password;
	options.host = req.body.host;
	options.dbname = req.body.dbname;
	options.dbtype = req.body.dbtype;
	var blnJson = req.body.json1;
	
	addDBConnOptionInDB(options, function(status, err) {
		if (blnJson) {
			res.end({rs: status, msg: err});
		} else {
			res.end("hello, test, has added into db..");
		}
	});
};

var removeDBConnOptionInDB = function(id, callback) {
	mysql.query("delete from my_dbconns where id = ?", [id], function(err, results, fields) {
		if (err) {
			callback(false, err);
		} else {
			callback(true);
		}
	});
};
var removeDBConnOption = function(req, res) {
	var connId = req.body.id;
	removeDBConnOptionInDB(connId, function(status, err) {
		if (blnJson) {
			res.end({rs: status, msg: err});
		} else {
			res.end("hello, has been removed");
		}
	});
};

var _getRealDBType = function(dbtype) {
	if (dbtype in DB_TYPES) {
		return DB_TYPES[dbtype];
	}
	return dbtype;
};
var _getDBTypeString = function(dbtype) {
	return _.find(_.keys(DB_TYPES), function(key) { return DB_TYPES[key] === dbtype; });
};
var _getCreateSqlStringQuery = function(options) {
	var sql = "insert into my_sqls(name, mydesc, mysql, orisql, dbtype, addDate, lastModifyDate)"
				+ " values (?, ?, ?, ?, ?, ?, ?)";
	var params = [];
	params.push(options.name);
	params.push(options.mydesc);
	params.push(options.sql);
	params.push(options.orisql);
	params.push(_getRealDBType(options.dbtype));
	params.push(options.addDate);
	params.push(options.lastModifyDate);
	
	return {
		sql: sql,
		params: params
	};
};
var _getUpdateSqlStringQuery = function(options) {
	var sql = "update my_sqls set name=?, mydesc=?, mysql=?, orisql=?, dbtype=?, lastModifyDate=? where id=?";
	var params = [];
	params.push(options.name);
	params.push(options.mydesc);
	params.push(options.sql);
	params.push(options.orisql);
	params.push(_getRealDBType(options.dbtype));
	params.push(options.lastModifyDate);
	params.push(options.sqlId);
	
	return {
		sql: sql,
		params: params
	};
};
var _getCreateSqlParamsQuery = function(options) {
	if (!options.items || options.items.length < 1) {
		return;
	}
	var sqlId = options.sqlId;
	var sql = "insert into my_sql_params(name, myorder, paramType, defvalue, sqlId, addDate, lastModifyDate)"
				+ " values ";
	var params = [];
	_.each(options.items, function(item, idx) {
		if (idx > 0) {
			sql += " ,";
		}
		sql += "(?, ?, ?, ?, ?, ?, ?)";
		params.push(item.name);
		params.push(idx);
		params.push(item.type);
		params.push(item.defValue || "");
		params.push(sqlId);
		params.push(options.lastModifyDate);
		params.push(options.lastModifyDate);
	});
	
	return {
		sql: sql,
		params: params
	};
};
var _getDeleteSqlParamsQuery = function(options) {
	var sql = "delete from my_sql_params where sqlId = ?";
	var params = [options.sqlId];
	
	return {
		sql: sql,
		params: params
	};
};
var _getListSqlStringQuery = function(options, paging) {
	var sql = "select id, name, mydesc, mysql, orisql, dbtype, addDate from my_sqls";
	//var filterp = pagination.FilterParams();
	//filterp.add({'b.menuId': menuId});
	var sortp = pagination.SortParams();
	sortp.add(['addDate', 'desc']);
	var pagep = null;
	if (paging) {
		pagep = pagination.PagingParams();
		pagep.update(paging);
	}
	return pagination.encapMyQuery({
		myQuery: {
			sql: sql
		},
		filter: null,
		sort: sortp,
		page: pagep
	});
};
var _getListSqlParamsQuery = function(options, paging) {
	var sql = "select name, myorder, defvalue, paramType, sqlId, addDate from my_sql_params";
	var filterp = pagination.FilterParams();
	filterp.add({'sqlId': options.sqlId});
	var sortp = pagination.SortParams();
	sortp.add(['myorder', 'asc']);
	var pagep = null;
	if (paging) {
		pagep = pagination.PagingParams();
		pagep.update(paging);
	}
	return pagination.encapMyQuery({
		myQuery: {
			sql: sql
		},
		filter: null,
		sort: sortp,
		page: pagep
	});
};


var _renderSqlListPage = function(res, ritems, options) {
	res.render("tools/list/sqlList", {
		title: 'My Tools - DB Access', 
		tools: {
			items: ritems
		}, 
		top_link: TOP_LINK.TOOLS,
		res_nav_link: 'db_access_sql',
		//curPageType: 'dbsql',
		totalCount: 1, //_option.totalCount,
		pageSize: pageUtil.config.PAGE_SIZE,
		curPage: 1 //curPage
	});
};
var getSqlListPage = function(req, res) {
	var myQuery = _getListSqlStringQuery();
	mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
		var ritems = [];
		if (!err) {
			if (results && results.length > 0) {
				_.each(results, function(result) {
					ritems.push({
						"id": result.id,
						"name": result.name,
						"mydesc": result.mydesc,
						"author": result.author,
						"addDate": dateUtil.getOnlyDateStr(result.addDate)
					});
				});
			}
		}
		_renderSqlListPage(res, ritems);
	});
};


var EditSqlBo = function() {
	return {
		id: -1,
		name: "",
		mydesc: "",
		sql: "",
		dbType: "PG"
	};
};
var startToNewASqlSentence = function(req, res) {
	res.render("tools/editPage/sqlEdit", {editBo: EditSqlBo()});
};

var _getFormatSqlAndParamsPostgres = function(sql) {
	if (!sql || sql.trim() == "") {
		return null;
	}
	var sqlParams = [];
	var sqlNew = sql;
	
	var testParams = sql.match(/{{[^{}]+}}/g);
	if (testParams && testParams.length > 0) {
		_.each(testParams, function(paramStr, idx) {
			sqlNew = sqlNew.replace(paramStr, "$" + (idx+1));
			paramStr = paramStr.substring(2, paramStr.length - 2);
			var settings = paramStr.split("|");
			var paramTmp = {};
			paramTmp.myorder = idx;
			paramTmp.name = (settings[0] || "").trim();
			var lenTmp = settings.length;
			if (lenTmp > 1) {
				paramTmp.type = (settings[1] || "").trim();
			}
			if (lenTmp > 2) {
				paramTmp.defValue = (settings[2] || "").trim();
			}
			sqlParams.push(paramTmp);
		});
	}
	
	return {
		sql: sqlNew,
		sqlParams: sqlParams
	};
};
var DB_SQL_FORMATTER = {
	1: _getFormatSqlAndParamsPostgres
};

var _removeInsertedSqlSentence = function(sqlId, callback) {
	mysql.query("delete from my_sqls where id=?", [sqlId], function(err, results, fields) {
		if (err) {
			callback(false, err);
		} else {
			callback(true);
		}
	});
};
var _updateSqlParamsToDB = function(options, callback) {
	var myQuery = _getDeleteSqlParamsQuery(options);
	mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
		if (err) {
			if (options.blnAdded) {
				_removeInsertedSqlSentence(options.sqlId, function(status, err1) {
					callback(false, err);
				});
			} else {
				callback(false, err);
			}
		} else {
			myQuery = _getCreateSqlParamsQuery(options);
			if (myQuery) {
				mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
					if (err) {
						if (options.blnAdded) {
							_removeInsertedSqlSentence(options.sqlId, function(status, err1) {
								callback(false, err);
							});
						} else {
							callback(false, err);
						}
					} else {
						callback(true);
					}
				});
			} else {
				callback(true);
			}
		}
	});
};

var _isValidSqlId = function(sqlId) {
	return sqlId && sqlId > 0;
};
var _updateSqlSentenceToDB = function(options, callback) {
	var sqlAndParams = DB_SQL_FORMATTER[options.dbtype](options.orisql);
	if (sqlAndParams) {
		options.sql = sqlAndParams.sql;
		options.items = sqlAndParams.sqlParams;
	} else {
		options.sql = sqlAndParams.orisql;
		options.items = null;
	}
	var myQuery;
	if (!_isValidSqlId(options.sqlId)) {
		myQuery = _getCreateSqlStringQuery(options);
		options.blnAdded = true;
	} else {
		myQuery = _getUpdateSqlStringQuery(options);
	}
	mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
		if (err) {
			callback(false, err);
		} else {
			if (!_isValidSqlId(options.sqlId)) {
				options.sqlId = results.insertId;
			}
			_updateSqlParamsToDB(options, callback);
		}
	});
};
var UpdateSqlSentence = function(req, res) {
	var curDate = dateUtil.getDateStr(new Date().getTime());
	var options = {
		sqlId: req.body.toolId,
		name: req.body.toolName,
		mydesc: req.body.toolDesc,
		orisql: req.body.toolSqlContent,
		dbtype: _getRealDBType(req.body.toolDbType),
		addDate: curDate,
		lastModifyDate: curDate
	};
	_updateSqlSentenceToDB(options, function(status, err) {
		res.redirect('/mytool/db/kind/dbsql');
	});
};

var SqlDetailBo = function() {
	return {
		id: -1,
		name: "",
		mydesc: "",
		sql: "",
		dbType: "PG",
		addDate: "",
		params: []
	};
};
var _getSqlDetailParamsInfoInDB = function(sqlId, callback) {
	mysql.query("select id, name, myorder, defvalue, paramType from my_sql_params "
					+ " where sqlId = ? order by myorder asc", [sqlId], function(err, results, fields) {
		var params = [];
		if (!err) {
			if (results && results.length > 0) {
				_.each(results, function(result) {
					params.push({
						"id": result.id,
						"name": result.name,
						"myorder": result.myorder,
						"defValue": result.defvalue,
						"paramType": result.paramType
					});
				});
			}
		}
		callback(true, params);
	});
};
var _getSqlDetailInfoInDB = function(sqlId, callback) {
	mysql.query("select id, name, mydesc, mysql, orisql, dbtype, "
					+ " addDate, lastModifyDate from my_sqls where id=?", [sqlId], function(err, results, fields) {
		if (err) {
			callback(false, err);
		} else {
			var result = SqlDetailBo();
			if (results && results.length > 0) {
				var result0 = results[0];
				result.id = result0.id;
				result.name = result0.name;
				result.mydesc = result0.mydesc;
				result.sql = result0.orisql;
				result.dbType = _getDBTypeString(result0.dbtype);
				result.addDate = dateUtil.getOnlyDateStr(result0.addDate);
			}
			_getSqlDetailParamsInfoInDB(sqlId, function(status, params) {
				if (params) {
					result.params = params;
				}
				callback(true, result);
			});
		}
	});
};
var DBConnInfoBo = function() {
	return {
		user: '',
		password: '',
		host: 'localhost',
		database: ''
	};
};
var _updateDBConnInSession = function(req, curDBConn) {
	req.session.cur_db_conn = curDBConn;
};
var _getDBConnInSession = function(req) {
	return req.session.cur_db_conn || DBConnInfoBo();
};
var getSqlDetailInfo = function(req, res) {
	var sqlId = req.params.sqlId;
	_getSqlDetailInfoInDB(sqlId, function(status, item) {
		if (!status) {
			item = [];
		}
		res.render("tools/detailPage/sqlDetail", {
						item: item, 
						errMsg: status?"":item,
						title: "DB Access - SQL detail",
						top_link: TOP_LINK.TOOLS,
						connDB: _getDBConnInSession(req)
						});
	});
};


var _runCertainSqlWithParams = function(options, callback) {
	mysql.query("select mysql from my_sqls where id=?", [options.sqlId], function(err, results, fields) {
		if (err || !results || results.length < 1) {
			callback(false, err);
		} else {
			var sql = results[0].mysql;
			pgConnPool.get(options.dbConfig, function(errStatus, errMsg) {
				if (!errStatus) {
					callback(false, errMsg);
				} else {
					this.query(sql, options.params, function(err,results){
						if (err) {
							callback(false, err);
						} else {
							callback(true, results.rows);
						}
					});
				}
			});
		}
	});
};
var runCertainSqlSentence = function(req, res) {
	var sqlId = req.body.sqlId,
		params = req.body.params;
	var options = {
		sqlId: sqlId,
		params: params
	};
	console.log(req.body.connDB);
	options.dbConfig = req.body.connDB;
	_updateDBConnInSession(req, req.body.connDB);
	_runCertainSqlWithParams(options, function(status, items) {
		if (!status) {
			res.json({rs: false,  errMsg: items});
		} else {
			res.json({rs: true,  items: items});
		}
	});
};


var _removeSqlSentenceInDB = function(sqlId, callback) {
	var trans = mysql.startTransaction();
	trans.query("delete from my_sql_params where sqlId=?", [sqlId], function(err, results, fields) {
		if (err) {
			trans.rollback();
			callback(false, err);
		} else {
			trans.query("delete from my_sqls where id=?", [sqlId], function(err, results, fields) {
				if (err) {
					trans.rollback();
					callback(false, err);
				} else {
					trans.commit();
					callback(true);
				}
			});
		}
	});
	trans.execute();
};
var removeCertainSentence = function(req, res) {
	var sqlId = req.body.sqlId;
	_removeSqlSentenceInDB(sqlId, function(status, errMsg) {
		res.json({rs: status, errMsg: errMsg});
	});
};


var _editASqlSentence = function(sqlId, callback) {
	mysql.query("select id, name, mydesc, orisql, dbtype from my_sqls where id=?", [sqlId], function(err, results, fields) {
		var editBo = EditSqlBo();
		if (!err && results && results.length > 0) {
			var result0 = results[0];
			editBo.id = result0.id;
			editBo.name = result0.name;
			editBo.mydesc = result0.mydesc;
			editBo.sql = result0.orisql;
			editBo.dbType = _getDBTypeString(result0.dbtype);
		}
		callback(true, null, editBo)
	});
};
var startToEditASqlSentence = function(req, res) {
	var sqlId = req.body.sqlId;
	_editASqlSentence(sqlId, function(status, errMsg, editBo) {
		res.render("tools/editPage/sqlEdit", {editBo: editBo});
	});
};

exports.addDBConnOption = addDBConnOption;
exports.removeDBConnOption = removeDBConnOption;
exports.getSqlListPage = getSqlListPage;
exports.startToNewASqlSentence = startToNewASqlSentence;
exports.UpdateSqlSentence = UpdateSqlSentence;
exports.getSqlDetailInfo = getSqlDetailInfo;
exports.runCertainSqlSentence = runCertainSqlSentence;
exports.removeCertainSentence = removeCertainSentence;
exports.startToEditASqlSentence = startToEditASqlSentence;