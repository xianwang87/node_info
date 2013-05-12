var lists = require('../list/lists')
	, user = require('../user')
  	, resources = require('../resource/resources')
  	, mywork = require('../mywork/mywork')
  	, login = require('../permission/login')
  	, learn = require('../learning/learn')
  	, simpleGetter = require('../common/helper/simpleGetter');
  
var debug_flg = true;

exports.loadRoutes = function(app) {
	//app.get('/', routes.index);
	app.get('/', lists.taskOp.getTodos);
	app.get('/login', login.login);
	app.post('/dologin', login.dologin);
	app.get('/users', user.list);
	
	loadTaskAboutRoutes(app);
	
	app.get('/resourceHome', resources.resourceHome);
	app.get('/resource/:resid/:docid', resources.getCertainDoc);
	app.get('/resource/:resid', resources.getCertainResource);
	
	loadMyWorkAboutRoutes(app);
	
	loadSomeSimpleHelperRoutes(app);
	
	if (debug_flg) {
		app.get('/testMysql', lists.testDB);
		app.get('/testHttps', learn.testHttpsGet);
	}
};

var loadSomeSimpleHelperRoutes = function(app) {
	app.get('/help/bugzilla/host', simpleGetter.getter.bugziallHost)
	app.get('/get/def/:defName', simpleGetter.getSimpleDef)
	app.post('/getLisDefs', simpleGetter.getLisDefs)
};
var loadTaskAboutRoutes = function(app) {
	app.post('/list/newATask', lists.taskOp.newATask);
	app.post('/addNewTask', lists.taskOp.addNewTask);
	app.post('/list/removeATask', lists.taskOp.removeATask);
	app.get('/list/items/:status/:datet', lists.taskOp.getTodos);
	app.get('/list/pitems/:paging/:page', lists.taskOp.getTodos);
	app.post('/list/editATask', lists.taskOp.editATask);
	//app.post('/list/task/chgStatus', lists.taskOp.chgTaskStatus);
	//app.post('/list/task/chgPriority', lists.taskOp.chgTaskPriority);
	app.post('/list/task/modifysingle/:modifyType', lists.taskOp.commonModifySingle);
};
var loadMyWorkAboutRoutes = function(app) {
	app.get('/myworkDone', mywork.myworkHome);
	app.post('/mywork/newAWork', mywork.newAWork);
	app.post('/mywork/addNewWork', mywork.addNewWork);
	app.post('/mywork/removeAWork', mywork.removeAWorkItem);
	app.post('/mywork/editAWork', mywork.editAWorkItem);
};