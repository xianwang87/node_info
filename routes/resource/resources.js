var _ = require("underscore");

var mysql = require('../common/db/dbmysql').db;
var dateUtil = require('../common/helper/dateUtil').dateUtil;

var getArticleListQuery = function() {
	var sql = "select id, title, summary, content, author, addDate from my_articles order by addDate desc";
	return {
		sql: sql
	};
};
var getMenuArticlesQuery = function(menuId) {
	var sql = "select a.id, a.title, a.summary, a.content, a.author, a.addDate from my_articles a, my_menu_article b"
				+ " where a.id = b.articleId"
				+ " and b.menuId = ?"
				+ " order by addDate desc";
	var params = [menuId];
	return {
		sql: sql,
		params: params
	};
};
var resourceHome = function(req, res) {
	var menuId = req.body.menuId || -1,
		listType = req.params.listType;
	var myQuery;
	if (!menuId || menuId < 0) {
		listType = listType || "recentlyAdded";
		myQuery = getArticleListQuery();
	} else {
		myQuery = getMenuArticlesQuery(menuId);
	}
	mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
		if (err) {
			res.render('resources/index', { title: 'Resources Home', 
											top_link: 'resources', 
											res_nav_link: listType, 
											inMenuItem: menuId,
											errMsg: err});
		} else {
			var itemLst = [];
			if (results) {
				_.each(results, function(result) {
					itemLst.push({
						"id": result.id,
						"title": result.title,
						"summary": result.summary,
						"content": result.content,
						"author": result.author,
						"addDate": dateUtil.getOnlyDateStr(result.addDate)
					});
				});
			}
			res.render('resources/index', { title: 'Resources Home', 
											top_link: 'resources', 
											res_nav_link: listType, 
											inMenuItem: menuId,
											itemLst: itemLst});
		}
	});
	
};

//and user support later
var getCertainArticleQuery = function(menuId) {
	var sql = "select id, title, summary, content, author, addDate from my_articles where id=?";
	var params = [menuId];
	return {
		sql: sql,
		params: params
	};
};
var resourceArticleDetail = function(req, res) {
	var menuId = req.body.menuId,
		listType = req.body.listType;
	var myQuery = getCertainArticleQuery(menuId);
	mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
		if (err) {
			res.render('resources/articles/detail', { title: 'Resources Home', 
											top_link: 'resources', 
											res_nav_link: listType, 
											inMenuItem: menuId,
											article: MyArticleObject(),
											errMsg: err});
		} else {
			var article = MyArticleObject();
			if (results && results.length > 0) {
				var result = results[0];
				article.id = result.id;
				article.title = result.title;
				article.summary = result.summary;
				article.content = result.content;
				article.author = result.author;
				article.addDate = dateUtil.getOnlyDateStr(result.addDate);
			}
			res.render('resources/articles/detail', { title: 'Resources Home', 
											top_link: 'resources', 
											res_nav_link: listType, 
											inMenuItem: menuId,
											article: article});
		}
	});
};

var MyArticleObject = function() {
	return {
		id: -1,
		title: "",
		summary: "",
		content: "",
		author: "",
		addDate: ""
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
exports.resourceArticleDetail = resourceArticleDetail;