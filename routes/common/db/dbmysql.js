var mysql = require('mysql');
var dbconfig = require('../config/config').dbconfig;

var db = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : dbconfig.mysql.user,
    password : dbconfig.mysql.password,
    database : dbconfig.mysql.database,
    charset : 'UTF8',
    debug : false
});
db.connect();

exports.db = db;