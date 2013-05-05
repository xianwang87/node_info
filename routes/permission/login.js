var mysql = require('../common/db/dbmysql').db;
var stringUtil = require('../common/helper/stringUtil').stringUtil;
var lists = require('../list/lists');

var login = function(req, res){
  	res.render('permission/login', { title: 'Login'});
};
exports.login = login;

exports.dologin = function(req, res){
  	mysql.query("select count(1) as user_count from my_user where name=? and pwd=? order by adddate desc",
  					[req.body.userName, req.body.userPwd],
  					function(err, results, fields) {
		if (err || !results || results.length == 0 || results[0]["user_count"] == 0) {
			login(req, res);
		} else {
			req.session.user = req.body.userName;
			lists.getTodos(req, res);
		}
	});
};