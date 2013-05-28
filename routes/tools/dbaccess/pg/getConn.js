var _ = require("underscore");
var pg = require('pg');

/* pg config in this kind of type
var pgConfig = {
	user: '',
	password: '',
	host: 'localhost',
	database: ''
};
*/
var generatePgConnection = function(pgConf) {
	if (_.isObject(pgConf)){
		var result = "";
		result += "tcp://"
					+ pgConf.user
					+ ":"
					+ pgConf.password
					+ "@"
					+ pgConf.host
					+ "/"
					+ pgConf.database;
		return result;
	}
	return pgConf;
};

var connPool = {
	get: function(pgConf, callback) {
		var connStr = generatePgConnection(pgConf);
		var self = this;
		if (!(connStr in this._conns)) {
			var client = new pg.Client(connStr);
			client.connect(function(err, results) {
				if(err){
					console.log('connect for ' + connStr + ' Error: ' + err.message);
					client.end();
					if (callback) {
						callback.call(client, false, err.message);
					}
				} else {
					console.log("client.connect OK for " + connStr + ".\n");
					self._conns[connStr] = {
						client: client,
						lastTime: new Date().getTime()
					};
					if (callback) {
						callback.call(client, true);
					}
				}
			});
		} else {
			console.log("using the exist conn for " + connStr);
			this._conns[connStr].lastTime = new Date().getTime();
			if (callback) {
				callback.call(this._conns[connStr].client, true);
			}
		}
	},
	remove: function(pgConf) {
		var connStr = generatePgConnection(pgConf);
		if (connStr in this._conns) {
			this._conns[connStr].client.end();
			delete this._conns[connStr];
		}
		return true;
	},
	getCounts: function() {
		return _.keys(this._conns).length;
	},
	iterate: function(callback) {
		var self = this;
		_.each(_.keys(self._conns), function(keyArg) {
			callback.call(self, keyArg, self._conns[keyArg]);
		});
	},
	_conns: {
	}
};

var CONN_EXIST_MAX_TIME = 600000;
var clearConnectionsNotInUse = function(intervalTime) {
	// default is 10 minutes
	intervalTime = intervalTime || 600000;
	setInterval(function(){
		var curTime = new Date().getTime();
		if (connPool.getCounts() > 0) {
			connPool.iterate(function(keyArg, value) {
				if (value.lastTime + CONN_EXIST_MAX_TIME < curTime) {
					this.remove(keyArg);
				}
			});
		}
	}, intervalTime);
};


clearConnectionsNotInUse();
exports.connPool = connPool;