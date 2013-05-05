var mysql = require('mysql');

var db = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : '<user-name>',
    password : '<password>',
    database : '<db-name>',
    charset : 'UTF8',
    debug : false
});
db.connect();

exports.db = db;