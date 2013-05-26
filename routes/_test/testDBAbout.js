var mysql = require('../common/db/dbmysql').db;

// will insert one record
exports.testWhenNoTrans = function(req, res) {
	var sql = "insert into my_invite(name, email) values(?, ?)";
	
	//this should be inserted successfully
	mysql.query(sql, ['name1', 'name@mail.com'], function(err, results, fields) {
		console.log(err);
	});
	
	//this should be inserted failed
	mysql.query(sql, ['name1', null], function(err, results, fields) {
		console.log(err);
	});
	
	res.end("returned soon");
};


// np records will be inserted
exports.testWhenWithTrans = function(req, res) {
	var trans = mysql.startTransaction();
	var sql = "insert into my_invite(name, email) values(?, ?)";
	
	mysql.query(sql, ['remained', 'remained@mail.com'], function(err, results, fields) {
		console.log(err);
	});
	
	var blnError = false;
	trans.query('delete from my_invite', function(err, results, fields) {
		if (err) {
			blnError = true;
			trans.rollback();
		}
	});
	
	//this should be inserted successfully
	trans.query(sql, ['name1', 'name@mail.com'], function(err, results, fields) {
		if (err) {
			blnError = true;
			trans.rollback();
		}
	});
	
	if (!blnError) {
		//this should be inserted failed
		trans.query(sql, ['name1', null], function(err, results, fields) {
			if (err) {
				console.log(err);
				blnError = true;
				trans.rollback();
			}
		});
	}
	
	trans.execute();
	trans.commit();
	res.end("returned soon");
};