var mysql = require('./common/db/dbmysql').db;
var _ = require("underscore");

/*
 * GET home page.
 */

exports.index = function(req, res){
	mysql.query("select id, name, age from test_tbl", function(err, results, fields) {
		todos = [];
		if (results) {
			_.each(results, function(result) {
				todos.push({
					"name": result.name,
					"desc": "Description of " + result["name"],
					"status": result.age,
				});
			});
		}
		res.render('index', { title: 'To-do list', top_link: 'home', todos: todos});
	});
};