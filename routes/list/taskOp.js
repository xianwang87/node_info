var _ = require("underscore");

var mysql = require('../common/db/dbmysql').db;
var taskenum = require('../common/constant/task/enum').TASK_ENUM;
var dateUtil = require('../common/helper/dateUtil').dateUtil;
var stringUtil = require('../common/helper/stringUtil').stringUtil;
var enumUtil = require('../common/helper/enumUtil').enumUtil;

var MyTaskBO = function() {
	return {
		id: -1,
		taskName: "",
		priority: 1,
		mydesc: "",
		onDate: "",
		fromTime: "",
		toTime: ""
	}
};

var getHourMinute = function(ftime) {
	return stringUtil.splitStr(ftime, ":", 0, 2, true);
};

// just show the panel to add a task
var newATask = function(req, res) {
	res.render('list/edit', {editBo: MyTaskBO()});
};

// really create the task in database
var addNewTask = function(req, res){
	var taskName = req.body.name,
		priority = req.body.priority,
		mydesc = req.body.desc,
		onDate = req.body.onDate,
		fromTime = req.body.ftime,
		toTime = req.body.ttime,
		status = enumUtil.getValue(taskenum.TASK_STATUS.NOT_STARTED);
	var curDate = dateUtil.getDateStr(new Date().getTime());
		
	var encapStr = function(str) {
		return "'" + str + "'";
	};
	var getInsertSentence = function() {
		var sql = "insert into my_tasks(name, mydesc, adddate, lastModifyDate, onDate,"
					+ " fromTime, toTime, priority, status) values("
					+ encapStr(taskName) + ", " + encapStr(mydesc) + ", "
					+ encapStr(curDate) + ", " + encapStr(curDate) + ", "
					+ encapStr(onDate) + ", " + encapStr(fromTime) + ", "
					+ encapStr(toTime) + ", " + priority + ", " + status
					+ ")";
		return sql;
	};
		
	mysql.query(getInsertSentence(), function(err, results, fields) {
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
			res.render('list/edit', {editBo: editBo});
		});
};


var removeATask = function(req, res){
	var taskId = req.body.taskId;
	mysql.query("delete from my_tasks where id=?", [taskId], 
		function(err, results, fields) {
			res.json({rs: true});
		});
};

var getTodos = function(req, res) {
	var status = req.params.status,
		datet = req.params.datet;
	if (!datet) {
		datet = 'today';
	}
	var nav = datet;
	var curTime = new Date().getTime();
	var getQuerySentence = function() {
		var params = [];
		var sql = "select id, name, mydesc, priority, status, ondate, fromtime, totime from my_tasks";
		if (status || datet) {
			sql += " where 1=1";
			if (status) {
				if (status === 'finished') {
					sql += " and status=?";
					params.push(enumUtil.getValue(taskenum.TASK_STATUS.FINISHED));
				} else if (status === 'notfinished') {
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
				}
			}
		}
		sql += " order by adddate desc";
		return {
			sql: sql,
			params: params
		};
	};
	
	var myQuery = getQuerySentence();
	mysql.query(myQuery.sql, myQuery.params, 
		function(err, results, fields) {
			todos = [];
			if (results) {
				_.each(results, function(result) {
					todos.push({
						"id": result.id,
						"name": result.name,
						"desc": result["mydesc"],
						"priority": result.priority,
						"status": enumUtil.getText(result.status, taskenum.TASK_STATUS),
						"statusCode": result.status,
						"onDate": dateUtil.getOnlyDateStr(result.ondate),
						"fromTime": getHourMinute(result.fromtime),
						"toTime": getHourMinute(result.totime)
					});
				});
			}
			res.render('index', { title: 'To-do list', top_link: 'home', todos: todos, res_nav_link: nav});
		}
	);
};

var chgTaskStatus = function(req, res) {
	var taskId = req.body.taskId,
		taskStatus = req.body.status;
	mysql.query("update my_tasks set status=? where id=?", [taskStatus, taskId], 
		function(err, results, fields) {
			res.json({rs: true});
		});
};

exports.addNewTask = addNewTask;
exports.getTodos = getTodos;
exports.newATask = newATask;
exports.removeATask = removeATask;
exports.editATask = editATask;
exports.chgTaskStatus = chgTaskStatus;