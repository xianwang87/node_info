var _ = require("underscore");
var mysql = require('../../common/db/dbmysql').db;

var DEF_PAGE_CONFIG = {
	PAGE_SIZE: 15
};

var getRecordCounts = function(myQuery, callback) {
	var sqlNew = myQuery.sql;
	if (myQuery && myQuery.sql) {
		var sqls = myQuery.sql.split(' from ');
		sqls[0] = 'select count(1) as totalCount ';
		sqlNew = _.reduce(
							sqls 
							, function(result, sqlTmp, idx) {
								return result + (idx>0?' from ':'') + sqlTmp;
							}
							, ""
						);
	}
	mysql.query(sqlNew, myQuery.params, function(err, results, fields) {
		var totalCount = 0;
		if (!err) {
			if (results && results.length > 0) {
				totalCount = results[0].totalCount;
			}
		}
		callback(totalCount);
	});
};

exports.pageUtil = {
	config: DEF_PAGE_CONFIG,
	paging: {
		getSql: function(curPage, pageSize) {
			return " limit " + (curPage-1)*pageSize + ", " + pageSize;
		}
	},
	getRecordCounts: getRecordCounts
};