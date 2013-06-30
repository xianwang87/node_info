var mysql = require('mysql');
var queues = require('mysql-queues');

var dbconfig = require('../config/config').dbconfig;

var db = mysql.createConnection({
    host : dbconfig.mysql.host,
    port : dbconfig.mysql.port,
    user : dbconfig.mysql.user,
    password : dbconfig.mysql.password,
    database : dbconfig.mysql.database,
    charset : dbconfig.mysql.charset,
    debug : dbconfig.mysql.debug
});
db.connect();

const DEBUG = true;
queues(db, DEBUG);

exports.db = db;