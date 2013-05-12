var _ = require("underscore");

var mysql = require('../common/db/dbmysql').db;
var taskenum = require('../common/constant/task/enum').TASK_ENUM;
var dateUtil = require('../common/helper/dateUtil').dateUtil;
var stringUtil = require('../common/helper/stringUtil').stringUtil;
var pageUtil = require('../common/helper/pageUtil').pageUtil;
var enumUtil = require('../common/helper/enumUtil').enumUtil;
var simpleGetter = require('../common/helper/simpleGetter');

var MyTaskBO = function() {
	return {
		id: -1,
		taskName: "",
		priority: 0,
		mydesc: "",
		onDate: "",
		fromTime: "",
		toTime: ""
	}
};

var DEF_LIST_PROPERTIES = [
	"task_status",
	"task_priority"
];
var encap_with_list_options = function(obj, proList) {
	proList = proList || DEF_LIST_PROPERTIES;
	obj.mylist = {};
	_.each(proList, function(defName) {
		obj.mylist[defName] = simpleGetter.getSortedDefList(defName);
	});
	return obj;
};
var render_with_encap_list_options = function(res, jtemplate, obj, proList) {
	res.render(jtemplate, encap_with_list_options(obj, proList));
};

var getHourMinute = function(ftime) {
	return stringUtil.splitStr(ftime, ":", 0, 2, true);
};

// just show the panel to add a task
var newATask = function(req, res) {
	render_with_encap_list_options(res, 'list/edit', {editBo: MyTaskBO()});
};

// really create the task in database
var addNewTask = function(req, res){
	var id = req.body.id,
		taskName = req.body.name,
		priority = req.body.priority,
		mydesc = req.body.desc,
		onDate = req.body.onDate,
		fromTime = req.body.ftime,
		toTime = req.body.ttime,
		status = enumUtil.getValue(taskenum.TASK_STATUS.NOT_STARTED);
	var curDate = dateUtil.getDateStr(new Date().getTime());
		
	var sql = "";
	var params = [];
	var getInsertSentence = function() {
		sql = "insert into my_tasks(name, mydesc, adddate, lastModifyDate, onDate,"
					+ " fromTime, toTime, priority, status) values(?, ?, ?, ?, ?, ?, ?, ?, ?)";
		params.push(taskName);
		params.push(mydesc);
		params.push(curDate);
		params.push(curDate);
		params.push(onDate);
		params.push(fromTime);
		params.push(toTime);
		params.push(priority);
		params.push(status);
		return {
			sql: sql,
			params: params
		};
	};
	
	var getInsertSentenceUpdate = function() {
		sql = "update my_tasks set name=?, mydesc=?, lastModifyDate=?, onDate=?,"
					+ " fromTime=?, toTime=?, priority=?, status=? where id=?";
		params.push(taskName);
		params.push(mydesc);
		params.push(curDate);
		params.push(onDate);
		params.push(fromTime);
		params.push(toTime);
		params.push(priority);
		params.push(status);
		params.push(id);
		return {
			sql: sql,
			params: params
		};
	};
	
	var myQuery;
	if (id > 0) {
		myQuery = getInsertSentenceUpdate();
	} else {
		myQuery = getInsertSentence();
	}
	mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
		res.json({rs: true});
	});
};


var editATask = function(req, res) {
	var taskId = req.body.taskId;
	mysql.query("select id, name, mydesc, priority, status, ondate, fromtime, totime from my_tasks where id=?", [taskId], 
		function(err, results, fields) {
			var editBo = MyTaskBO();
			if (results) {
				var result0 = results[0];
				editBo.id = result0.id;
				editBo.taskName = result0.name;
				editBo.priority = result0.priority;
				editBo.mydesc = result0.mydesc;
				editBo.onDate = dateUtil.getOnlyDateStr(result0.ondate);
				editBo.fromTime = getHourMinute(result0.fromtime);
				editBo.toTime = getHourMinute(result0.totime);
			}
			render_with_encap_list_options(res, 'list/edit', {editBo: editBo});
		});
};


var removeATask = function(req, res){
	var taskId = req.body.taskId;
	mysql.query("delete from my_tasks where id=?", [taskId], 
		function(err, results, fields) {
			res.json({rs: true});
		});
};

var _no_paging_bar = ['all_today', 'all_tomorrow', 'all_thisweek'];
var TASK_SESSION_KEY = "_task_query_sql";
var getTodos = function(req, res) {
	var status,
		datet,
		curPage = req.params.page || 1,
		blnPaging,
		blnPagingQuery = (req.params.paging == "page");
		
	var getElementsFromSession = function() {
		if (!req.session.myquery
				|| !(TASK_SESSION_KEY in req.session.myquery)) {
			// default for all of today
			status = "all";
			datet = "today";
			return;	
		}
		var mysession = req.session.myquery[TASK_SESSION_KEY];
		status =  mysession.status;
		datet = mysession.datet;
	};
	
	if (blnPagingQuery) {
		getElementsFromSession();
	} else {
		status = req.params.status;
		datet = req.params.datet;
	}
	if (!datet) {
		datet = 'today';
	}
	
	var dataType = 'all';
	if (status) {
		if (status === 'finished') {
			dataType = "finished";
		} else if (status === 'unfinished') {
			dataType = "unfinished";
		}
	}
	var nav = dataType + '_' + datet;
	if (_.indexOf(_no_paging_bar, nav) > -1) {
		blnPaging = false;
	} else {
		blnPaging = true;
	}
	var curTime = new Date().getTime();
	var itmesToGet = " id, name, mydesc, priority, status, ondate, fromtime, totime ";
	var getQuerySentence = function(items) {
		items = items || itmesToGet;
		var params = [];
		var sql = "select " + items + " from my_tasks";
		if (status || datet) {
			sql += " where 1=1";
			if (status) {
				if (status === 'finished') {
					dataType = "finished";
					sql += " and status=?";
					params.push(enumUtil.getValue(taskenum.TASK_STATUS.FINISHED));
				} else if (status === 'unfinished') {
					dataType = "unfinished";
					sql += " and status!=?";
					params.push(enumUtil.getValue(taskenum.TASK_STATUS.FINISHED));
				}
			}
			
			if (datet) {
				if (datet === 'today') {
					sql += " and ondate=?";
					params.push(dateUtil.getOnlyDateStr(curTime));
				} else if (datet === 'tomorrow') {
					sql += " and ondate=?";
					params.push(dateUtil.getOnlyDateWithDeltaDayStr(curTime, 1));
				} else if (datet === 'thisweek') {
					sql += " and ondate >= ? and ondate <= ?";
					var weekRange = dateUtil.getOnlyDateForAWeekStr(curTime);
					params.push(weekRange.start);
					params.push(weekRange.end);
				} else if (datet === 'yesterday') {
					sql += " and ondate=?";
					params.push(dateUtil.getOnlyDateWithDeltaDayStr(curTime, -1));
				} else if (datet === 'last3days') {
					sql += " and ondate >= ? and ondate <= ?";
					params.push(dateUtil.getOnlyDateWithDeltaDayStr(curTime, -3));
					params.push(dateUtil.getOnlyDateWithDeltaDayStr(curTime));
				}
			}
		}
		sql += " order by adddate desc";
		return {
			sql: sql,
			params: params
		};
	};
	
	var myGetCountQuery = getQuerySentence("count(1) as mycount");
	var totalCount = 0;
	var pageSize = pageUtil.config.PAGE_SIZE;
	mysql.query(myGetCountQuery.sql, myGetCountQuery.params, 
		function(err, results, fields) {
			if (results.length > 0) {
				totalCount = results[0].mycount;
			}
			getResults();
		});
		
	var getResults = function() {
		var myQuery;
		if (blnPagingQuery) {
			myQuery = req.session.myquery[TASK_SESSION_KEY].myQuery;
		} else {
			myQuery = getQuerySentence();
			req.session.myquery = req.session.myquery || {};
			req.session.myquery[TASK_SESSION_KEY] = {
				myQuery: myQuery,
				res_nav_link: nav,
				dataType: dataType,
				status: status,
				datet: datet
			};
		}
		var curQuerySql = myQuery.sql;
		if (blnPagingQuery || blnPaging) {
			curQuerySql += " " + pageUtil.paging.getSql(curPage, pageSize);
		}
		mysql.query(curQuerySql, myQuery.params, 
			function(err, results, fields) {
				todos = {
					unfinished: [],
					finished: []
				};
				if (results) {
					var curList = todos.unfinished;
					_.each(results, function(result) {
						if (result.status == taskenum.TASK_STATUS.FINISHED.value) {
							curList = todos.finished;
						} else {
							curList = todos.unfinished;
						}
						curList.push({
							"id": result.id,
							"name": result.name,
							"desc": result["mydesc"],
							"priority": enumUtil.getText(result.priority, taskenum.TASK_PRIORITY),
							"priorityCode": result.priority,
							"status": enumUtil.getText(result.status, taskenum.TASK_STATUS),
							"statusCode": result.status,
							"onDate": dateUtil.getOnlyDateStr(result.ondate),
							"fromTime": getHourMinute(result.fromtime),
							"toTime": getHourMinute(result.totime)
						});
					});
				
					if (!blnPaging) {
						todos.unfinished = _.sortBy(todos.unfinished, function(obj) { return _getPriorityOrder(obj.priorityCode) + "_" + obj.onDate + "_" + obj.fromTime; });
						todos.finished = _.sortBy(todos.finished, function(obj) { return obj.onDate + "_" + obj.fromTime; });
					}
				}
				render_with_encap_list_options(res, 'index', { 
						title: 'To-do list', 
						top_link: 'home', 
						todos: todos, 
						res_nav_link: nav,
						dataType: dataType,
						totalCount: totalCount,
						pageSize: pageSize,
						blnPaging: blnPaging,
						curPage: curPage});
			}
		);
	};
};

var _getPriorityOrder = function(priority) {
	var result = 0;
	switch(priority) {
		case taskenum.TASK_PRIORITY.IMPORTANT.value:
			result = 1;
			break;
		case taskenum.TASK_PRIORITY.URGENCY.value:
			result = 2;
			break;
		case taskenum.TASK_PRIORITY.URGENCY_IMPORTANT.value:
			result = 3;
			break;
		default:
			result = 0;
	}
	
	return result;
};

var chgTaskStatus = function(req, res) {
	var taskId = req.body.taskId,
		taskStatus = req.body.value;
	mysql.query("update my_tasks set status=? where id=?", [taskStatus, taskId], 
		function(err, results, fields) {
			res.json({rs: true});
		});
};
var chgTaskPriority = function(req, res) {
	var taskId = req.body.taskId,
		taskPriority = req.body.value;
	mysql.query("update my_tasks set priority=? where id=?", [taskPriority, taskId], 
		function(err, results, fields) {
			res.json({rs: true});
		});
};

var SINGLE_MODIFY_TYPE_MAP = {
	"task_status": chgTaskStatus,
	"task_priority": chgTaskPriority
};
var commonModifySingle = function(req, res) {
	var modifyType = req.params.modifyType;
	if (modifyType in SINGLE_MODIFY_TYPE_MAP) {
		SINGLE_MODIFY_TYPE_MAP[modifyType](req, res);
	} else {
		res.json({rs: false, msg: "Operation was not found!"});
	}
};

exports.addNewTask = addNewTask;
exports.getTodos = getTodos;
exports.newATask = newATask;
exports.removeATask = removeATask;
exports.editATask = editATask;
//exports.chgTaskStatus = chgTaskStatus;
//exports.chgTaskPriority = chgTaskPriority;
exports.commonModifySingle = commonModifySingle;