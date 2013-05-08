var _ = require("underscore");

var config = require('../config/config').config;
var taskenum = require('../constant/task/enum').TASK_ENUM;

var myGetter = {
	bugziallHost: function(req, res) {
		res.json({host: config.bugzilla.host});
	},
	taskStatus: function(req, res) {
		res.json({list: DEF_OBJECT.task_status});
	}
};

var DEF_OBJECT = {
	task_status:  _.sortBy(_.values(taskenum.TASK_STATUS), 
						function(obj) {return obj.value;})
};

exports.getter = myGetter;
exports.getSimpleDef = function(req, res) {
	var defName = req.params.defName;
	if (defName in myGetter) {
		myGetter[defName](req, res);
	} else {
		res.json({rs: false, msg: "undefined resource"});
	}
};
exports.getLisDefs = function(req, res) {
	var defNames = req.body.defNames;
	var result = {};
	_.each(defNames, function(defName) {
		if (defName in DEF_OBJECT) {
			result[defName] = DEF_OBJECT[defName];
		}
	});
	res.json({list: result});
};