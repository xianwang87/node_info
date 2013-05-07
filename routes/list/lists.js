var testMysql = require("./testMysql");
var taskOp = require("./taskOp");

exports.testDB = testMysql.testDB;
exports.addNewTask = taskOp.addNewTask;
exports.getTodos = taskOp.getTodos;
exports.newATask = taskOp.newATask;
exports.removeATask = taskOp.removeATask;