var lists = require('../list/lists')
	, user = require('../user')
  	, resources = require('../resource/resources')
  	, mywork = require('../mywork/mywork')
  	, login = require('../permission/login')
  	, learn = require('../learning/learn')
  	, simpleGetter = require('../common/helper/simpleGetter').getter;
  
var debug_flg = true;

exports.loadRoutes = function(app) {
	//app.get('/', routes.index);
	app.get('/', lists.getTodos);
	app.get('/login', login.login);
	app.post('/dologin', login.dologin);
	app.get('/users', user.list);
	
	loadTaskAboutRoutes(app);
	
	app.get('/resourceHome', resources.resourceHome);
	app.get('/resource/:resid/:docid', resources.getCertainDoc);
	app.get('/resource/:resid', resources.getCertainResource);
	
	
	app.get('/myworkDone', mywork.myworkHome);
	
	loadSomeSimpleHelperRoutes(app);
	
	if (debug_flg) {
		app.get('/testMysql', lists.testDB);
		app.get('/testHttps', learn.testHttpsGet);
	}
};

var loadSomeSimpleHelperRoutes = function(app) {
	app.get('/help/bugzilla/host', simpleGetter.bugziallHost)
};
var loadTaskAboutRoutes = function(app) {
	app.post('/list/newATask', lists.newATask);
	app.post('/addNewTask', lists.addNewTask);
	app.post('/list/removeATask', lists.removeATask);
	app.get('/list/items/:status/:datet', lists.getTodos);
};