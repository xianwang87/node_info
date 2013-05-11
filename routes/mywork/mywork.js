var _ = require("underscore");

var mysql = require('../common/db/dbmysql').db;
var dateUtil = require('../common/helper/dateUtil').dateUtil;

exports.myworkHome = function(req, res) {
	var itmesToGet = " id, title, mydesc, ondate ";
	var getQuerySentence = function(items) {
		items = items || itmesToGet;
		var params = [];
		var sql = "select " + items + " from my_work_done";
		sql += " order by ondate desc";
		return {
			sql: sql,
			params: params
		};
	};
	
	var myQuery = getQuerySentence();
	mysql.query(myQuery.sql, myQuery.params, 
		function(err, results, fields) {
			var works = {
				items: []
			};
			if (results) {
				_.each(results, function(result) {
					works.items.push({
						"id": result.id,
						"title": result.title,
						"titleHtml": dealWithAdditionalOperations(result.title, "mybug"),
						"desc": result["mydesc"],
						"onDate": dateUtil.getOnlyDateStr(result.ondate)
					});
				});
			}
			var groupedItems =_.groupBy(works.items, function(obj) { return obj.onDate; });
			console.log(groupedItems);
			var sortedDate = _.sortBy(_.keys(groupedItems), function(key) { return key; });
			console.log(sortedDate);
			works.items = [];
			for (var i = sortedDate.length; i > 0; i--) {
				works.items.push({
					mydate: sortedDate[i-1],
					items: groupedItems[sortedDate[i-1]]
				});
			}
			res.render('mywork/index', { title: 'My Finished Work', works: works, top_link: 'mywork', res_nav_link: 'finished'});
		}
	);
};

var MyWorkObj = function() {
	return {
		id: -1,
		title: "",
		mydesc: ""
	}
};
exports.newAWork = function(req, res) {
	res.render('mywork/edit', {editBo: MyWorkObj()});
};

var _bug_str_replace = /mybug\(([\S|\s]*)\)/g;
var OPERATION_FUNC_MAP = {
	"mybug": function(text) {
		var result = "";
		result = text.replace(_bug_str_replace, "<span class='my-bug'>$1</span>");
		return result;
	}
};
var dealWithAdditionalOperations = function(text, opName) {
	if (opName in OPERATION_FUNC_MAP) {
		return OPERATION_FUNC_MAP[opName](text);
	} else {
		return text;
	}
};
exports.addNewWork = function(req, res) {
	var title = req.body.title,
		mydesc = req.body.desc,
		onDate = req.body.onDate;
	var curDate = dateUtil.getDateStr(new Date().getTime());
		
	var params = [];
	var sql = "";
	var getInsertSentence = function() {
		sql = "insert into my_work_done(title, mydesc, adddate, lastModifyDate, onDate)"
					+ " values(?, ?, ?, ?, ?)";
		params.push(title);
		params.push(mydesc);
		params.push(curDate);
		params.push(curDate);
		params.push(onDate);
		return {
			sql: sql,
			params: params
		};
	};
	
	var myQuery = getInsertSentence();
	console.log(myQuery);
	mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
		res.json({rs: true});
	});
};