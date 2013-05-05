var _ = require("underscore");
var db = require("./common/db").db;

exports.testMysql = function(req, res){
	console.log("come to call testMysql");
	var myResult = [];
	db.query("select * from test01", function(err, results, fields) {
		if (results) {
			_.each(results, function(result) {
				myResult.push({
					name: result.name,
					age: result['age']
				});
			})
		}
		res.render('testMysql', {title: 'Test MySQL', 'table_title': 'Test MySQL connection', 'results': myResult});
	});
};