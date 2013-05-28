var pg = require('pg');

var pgConnPool = require('../tools/dbaccess/pg/getConn').connPool;

var pgConfig = {
	user: '',
	password: '',
	host: 'localhost',
	database: ''
};
 
var testPgFirst = function(req, res) {
	pgConnPool.get(pgConfig, function(errStatus, errMsg) {
		if (!errStatus) {
			res.end(errMsg);
		} else {
			this.query("select * from hm_domain",function(err,results){
				if (err) {
					console.log("query error");
					console.log('GetData Error: ' + error.message);
				} else if(results.rowCount > 0) {
					console.log(results);
					res.end("hello, result");
				}
			});
		}
	});
};

exports.testPgFirst = testPgFirst;