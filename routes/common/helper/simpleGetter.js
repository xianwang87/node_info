var config = require('../config/config').config;

exports.getter = {
	bugziallHost: function(req, res) {
		res.json({host: config.bugzilla.host});
	}
};