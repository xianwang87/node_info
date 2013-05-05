var _ = require("underscore");

var mysql = require('../common/db/dbmysql').db;
var taskenum = require('../common/constant/task/enum').TASK_ENUM;
var dateUtil = require('../common/helper/dateUtil').dateUtil;
var enumUtil = require('../common/helper/enumUtil').enumUtil;


// just show the panel to add a task
var newATask = function(req, res) {
	res.render('list/edit', {});
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
		res.write("hello, may be successful");
		res.end();
	});
};

var getTodos = function(req, res) {
	mysql.query("select id, name, mydesc, priority, status, ondate, fromtime, totime from my_tasks order by adddate desc", 
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
						"onDate": dateUtil.getOnlyDateStr(result.ondate),
						"fromTime": result.fromtime,
						"toTime": result.totime
					});
				});
			}
			res.render('index', { title: 'To-do list', top_link: 'home', todos: todos});
		}
	);
};


exports.addNewTask = addNewTask;
exports.getTodos = getTodos;
exports.newATask = newATask;