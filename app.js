
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , loader = require('./routes/loader/loader')
  , checkuser = require('./routes/common/middleware/checkuser');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  //app.use(express.cookieSession({secret: 'x-wab321'}));
  app.use(express.session({secret: 'x-wab321'}));
  
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.methodOverride());
  //app.use(checkuser.checkLogin());
  
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

loader.loadRoutes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
