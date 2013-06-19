var lists = require('../list/lists')
	, user = require('../user')
  	, resources = require('../resource/resources')
  	, mywork = require('../mywork/mywork')
  	, login = require('../permission/login')
  	, learn = require('../learning/learn')
  	, simpleGetter = require('../common/helper/simpleGetter')
  	, menuOp = require('../menu/menuOp')
  	, myTest = require('../_test/testDBAbout')
  	, fileHandler = require('../tools/tool/fileHandle');
  
var debug_flg = true;

exports.loadRoutes = function(app) {
	//app.get('/', routes.index);
	app.get('/', lists.taskOp.getTodos);
	app.get('/login', login.login);
	app.post('/dologin', login.dologin);
	app.get('/users', user.list);
	
	loadSomeSimpleHelperRoutes(app);
	
	loadTaskAboutRoutes(app);
	loadMyWorkAboutRoutes(app);
	loadResourceAboutRoutes(app);
	loadMenuAboutRoutes(app);
	loadToolsAboutRoutes(app);
	
	if (debug_flg) {
		app.get('/testMysql', lists.testDB);
		app.get('/testHttps', learn.testHttpsGet);
		_loadMyTestAboutRoutes(app);
	}
};

var _loadMyTestAboutRoutes = function(app) {
	app.get('/myTest/dbNoTrans', myTest.testWhenNoTrans);
	app.get('/myTest/dbWithTrans', myTest.testWhenWithTrans);
	var pgTest = require('../_test/testPostgres');
	app.get('/myTest/postgres1', pgTest.testPgFirst);
	var fileTest1 = require('../_test/testHtmlInOtherFolder');
	app.get('/myTest/file/otherFolder1', fileTest1.serveUploadedHtml);
	app.get('/myTest/file/unzip1', fileTest1.testUpzipZipFile);
};

var loadSomeSimpleHelperRoutes = function(app) {
	app.get('/help/bugzilla/host', simpleGetter.getter.bugziallHost);
	app.get('/get/def/:defName', simpleGetter.getSimpleDef);
	app.post('/getLisDefs', simpleGetter.getLisDefs);
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
var loadResourceAboutRoutes = function(app) {
	app.get('/resource', resources.resourceHome);
	app.all('/resourceHome/:listType', resources.resourceHome);
	app.post('/resource/newArticleForMenu', resources.newArticleForMenu);
	app.post('/resource/editMenuArticle', resources.editMenuArticle);
	app.post('/resource/getArticle', resources.resourceHome);
	app.post('/resource/article/detail', resources.resourceArticleDetail);
	// just goto edit page, not really update in DB
	app.post('/resource/article/edit', resources.editArticleForMenu);
};

var loadMenuAboutRoutes = function(app) {
	app.post('/menu/context/:menuFor', menuOp.getCommonMenu);
	app.post('/menu/edit', menuOp.editMenuContext);
	app.post('/menu/update', menuOp.updateMenuContext);
};

var loadToolsAboutRoutes = function(app) {
	//fileHandler
	app.get('/myTools', fileHandler.toolsHome);
	app.get('/mytool/kind/:toolType', fileHandler.startFileUpload);
	app.post('/mytool/newATool', fileHandler.newATool);
	app.post('/mytool/addANewTool', fileHandler.fileUpload);
};