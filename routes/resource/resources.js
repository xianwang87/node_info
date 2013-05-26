var _ = require("underscore");

var mysql = require('../common/db/dbmysql').db;
var dateUtil = require('../common/helper/dateUtil').dateUtil;

var resourceHome = function(req, res) {
	res.render('resources/index', { title: 'Resources Home', top_link: 'resources', res_nav_link: 'remind'});
};

var MyArticleObject = function() {
	return {
		id: -1,
		title: "",
		summary: "",
		content: ""
	};
}

var newArticleForMenu = function(req, res) {
	var articleId = req.body.articleId,
		menuId = req.body.menuId,
		menuFullPath = req.body.menuFullPath;
	res.render('resources/articles/edit', { title: 'Resources Home', top_link: 'resources', 
					res_nav_link: 'remind', editBo: MyArticleObject(),
					menuId: menuId,
					menuFullPath: menuFullPath});
};
exports.newArticleForMenu = newArticleForMenu;


var createOrEditMenuArticle = function(req, res) {
	var articleId = req.body.articleId,
		articleTitle = req.body.articleTitle,
		articleSummary = req.body.articleSummary,
		articleContent = req.body.articleContent,
		menuId = req.body.menuId;
	var curDate = dateUtil.getDateStr(new Date().getTime());
	
	var getCreateQuery = function() {
		var sql = "insert into my_articles(title, summary, content, addDate, lastModifyDate)"
					+ " values(?, ?, ?, ?, ?)";
		var params = [];
		params.push(articleTitle);
		params.push(articleSummary);
		params.push(articleContent);
		params.push(curDate);
		params.push(curDate);
		
		return {
			sql: sql,
			params: params
		};
	};
	
	var getCreateQueryUpdate = function() {
		var sql = "update my_articles set title=?, summary=?, content=?, lastModifyDate=?"
					+ " where id=?";
		var params = [];
		params.push(articleTitle);
		params.push(articleSummary);
		params.push(articleContent);
		params.push(curDate);
		params.push(articleId);
		
		return {
			sql: sql,
			params: params
		};
	};
	
	var getMenuArticleRelation = function(newArticleId) {
		var sql = "insert into my_menu_article(articleId, menuId)"
					+ " values(?, ?)";
		var params = [];
		params.push(newArticleId);
		params.push(menuId);

		return {
			sql: sql,
			params: params
		};
	};
	
	var myQuery;
	if (articleId < 0) {
		myQuery = getCreateQuery();
	} else {
		myQuery = getCreateQueryUpdate();
	}
	
	mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
		if (results) {
			var myQueryTmp = getMenuArticleRelation(results.insertId);
			mysql.query(myQueryTmp.sql, myQueryTmp.params, function(err, results, fields){
				res.render('resources/index', { title: 'Resources Home', top_link: 'resources', res_nav_link: 'remind'});
			});
		}
	});
};


exports.resourceHome = resourceHome;
exports.editMenuArticle = createOrEditMenuArticle;
