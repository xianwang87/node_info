var lists = require('../list/lists')
	, user = require('../user')
  	, resources = require('../resource/resources')
  	, mywork = require('../mywork/mywork')
  	, login = require('../permission/login')
  	, learn = require('../learning/learn');
  
var debug_flg = true;

exports.loadRoutes = function(app) {
	//app.get('/', routes.index);
	app.get('/', lists.getTodos);
	app.get('/login', login.login);
	app.post('/dologin', login.dologin);
	app.get('/users', user.list);
	
	
	app.post('/list/newATask', lists.newATask);
	app.post('/addNewTask', lists.addNewTask);
	
	
	app.get('/resourceHome', resources.resourceHome);
	app.get('/resource/:resid/:docid', resources.getCertainDoc);
	app.get('/resource/:resid', resources.getCertainResource);
	
	
	app.get('/myworkDone', mywork.myworkHome);
	
	
	if (debug_flg) {
		app.get('/testMysql', lists.testDB);
		app.get('/testHttps', learn.testHttpsGet);
	}
};