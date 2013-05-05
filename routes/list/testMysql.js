var http = require('http');
var https = require('https');
var _ = require("underscore");

var mysql = require('../common/db/dbmysql').db;

exports.testDB = function(req, res){
	console.log("start to test mysql connection.");
	res.writeHead(200, {'Content-Type': 'text/plain'});
	var resultStr = "";
	mysql.query("select * from test_tbl", function(err, results, fields) {
		if (results) {
			_.each(results, function(result) {
				_.each(fields, function(field) {
					resultStr += field.name + ": " + result[field.name] + "\n";
				});
			});
		}
		res.write(resultStr);
		res.end();
	});
};