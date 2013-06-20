
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , loader = require('./routes/loader/loader')
  , checkuser = require('./routes/common/middleware/checkuser');

var app = express();
var MY_CONSTANTS= require("./gconfig").MY_CONSTANTS;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir: MY_CONSTANTS.uploadPath}));
  app.use(express.cookieParser());
  //app.use(express.cookieSession({secret: 'x-wab321'}));
  app.use(express.session({secret: 'x-wab321'}));
  
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/upload', express.static(MY_CONSTANTS.uploadPath));
  app.use(express.methodOverride());
  //app.use(checkuser.checkLogin());
  
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// prepare folders that will be used, e.g. /uploads
(function(){
	fs.exists(MY_CONSTANTS.uploadPath, function(exists) {
		if (!exists) {
			fs.mkdirSync(MY_CONSTANTS.uploadPath);
		}
	});
})();

loader.loadRoutes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
