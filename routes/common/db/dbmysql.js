var mysql = require('mysql');
var queues = require('mysql-queues');

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

const DEBUG = true;
queues(db, DEBUG);

exports.db = db;