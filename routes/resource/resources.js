var _ = require("underscore");

var mysql = require('../common/db/dbmysql').db;
var dateUtil = require('../common/helper/dateUtil').dateUtil;
var pageUtil = require('../common/helper/pageUtil').pageUtil;
var pagination = require('../common/pagination');

var getArticleListQuery = function(paging) {
	var sql = "select id, title, summary, content, author, addDate from my_articles";
	var sortp = pagination.SortParams();
	sortp.add(['addDate', 'desc']);
	var pagep = null;
	if (paging) {
		pagep = pagination.PagingParams();
		pagep.update(paging);
	}
	return pagination.encapMyQuery({
		myQuery: {
			sql: sql
		},
		sort: sortp,
		page: pagep
	});
};
var getMenuArticlesQuery = function(menuId, paging) {
	var sql = "select a.id, a.title, a.summary, a.content, a.author, a.addDate from my_articles a, my_menu_article b"
				+ " where a.id = b.articleId";
	var filterp = pagination.FilterParams();
	filterp.add({'b.menuId': menuId});
	var sortp = pagination.SortParams();
	sortp.add(['addDate', 'desc']);
	var pagep = null;
	if (paging) {
		pagep = pagination.PagingParams();
		pagep.update(paging);
	}
	return pagination.encapMyQuery({
		myQuery: {
			sql: sql
		},
		blnWhere: true,
		filter: filterp,
		sort: sortp,
		page: pagep
	});
};

var getCurPageCount = function(listedItems) {
	if (listedItems == 0) {
		return 1;
	}
	var result = Math.ceil(listedItems/pageUtil.config.PAGE_SIZE);
	if (listedItems%pageUtil.config.PAGE_SIZE == 0) {
		result += 1;
	}
	if (listedItems > 0 && listedItems <= pageUtil.config.PAGE_SIZE) {
		result = 2;
	}
	return result;
};
var resourceHome = function(req, res) {
	var menuId = req.body.menuId || -1,
		listType = req.params.listType,
		snippet = req.body.snippet,
		listItems = req.body.listItems || 0
		curPage = req.body.curPage;
	
	if (!curPage) {
		curPage = getCurPageCount(listItems);
	}
	
	console.log("curPage::" + curPage);
	getReturnListPage(req, res, {
		menuId: menuId,
		listType: listType,
		snippet: snippet,
		paging: {
			curPage: curPage
		}
	});
};

var getReturnListPage = function(req, res, options) {
	var menuId = options.menuId,
		listType = options.listType || "recentlyAdded",
		snippet = options.snippet,
		dataFirst = options.dataFirst,
		paging = options.paging;
	if (!menuId || menuId < 0) {
		listType = listType || "recentlyAdded";
	} else {
		listType = null;
	}
	if (!snippet && !dataFirst) {
		res.render('resources/index', { title: 'Resources Home', 
												top_link: 'resources', 
												res_nav_link: listType, 
												inMenuItem: menuId,
												listType: listType,
												itemLst: null});
		return;
	}
	var myQuery;
	if (!menuId || menuId < 0) {
		myQuery = getArticleListQuery(paging);
	} else {
		myQuery = getMenuArticlesQuery(menuId, paging);
	}
	mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
		if (err) {
			if (snippet) {
				res.render('resources/articles/listSnippet', {errMsg: err, itemLst: null});
			} else {
				res.render('resources/index', { title: 'Resources Home', 
												top_link: 'resources', 
												res_nav_link: listType, 
												inMenuItem: menuId,
												listType: listType,
												itemLst: null,
												errMsg: err});
			}
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
			if (snippet) {
				res.render('resources/articles/listSnippet', {itemLst: itemLst});
			} else {
				res.render('resources/index', { title: 'Resources Home', 
												top_link: 'resources', 
												res_nav_link: listType, 
												inMenuItem: menuId,
												listType: listType,
												itemLst: itemLst});
			}
		}
	});
};

//and user support later
var getCertainArticleQuery = function(articleId) {
	var sql = "select id, title, summary, content, author, addDate from my_articles where id=?";
	var params = [articleId];
	return {
		sql: sql,
		params: params
	};
};
var resourceArticleDetail = function(req, res) {
	var articleId = req.body.articleId,
		menuId = req.body.menuId,
		menuFullPath = req.body.menuFullPath,
		listType = req.body.listType;
	var myQuery = getCertainArticleQuery(articleId);
	mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
		if (err) {
			res.render('resources/articles/detail', { title: 'Resources Home', 
											top_link: 'resources', 
											res_nav_link: listType, 
											inMenuItem: menuId,
											menuFullPath: menuFullPath,
											listType: listType,
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
											menuFullPath: menuFullPath,
											listType: listType,
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
		menuFullPath = req.body.menuFullPath,
		listType = req.body.listType;
	res.render('resources/articles/edit', { title: 'Resources Home', top_link: 'resources', 
					res_nav_link: '--none--', editBo: MyArticleObject(),
					menuId: menuId,
					listType: listType,
					menuFullPath: menuFullPath});
};

var editArticleForMenu = function(req, res) {
	var articleId = req.body.articleId,
		menuId = req.body.menuId,
		menuFullPath = req.body.menuFullPath,
		listType = req.body.listType;
	
	var myQuery = getCertainArticleQuery(articleId);
	mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
		if (err) {
			res.render('resources/articles/edit', { title: 'Resources Home', 
											top_link: 'resources', 
											res_nav_link: '--none--', 
											menuId: menuId,
											menuFullPath: menuFullPath,
											listType: listType,
											editBo: MyArticleObject(),
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
			res.render('resources/articles/edit', { title: 'Resources Home', 
											top_link: 'resources', 
											res_nav_link: '--none--', 
											menuId: menuId,
											menuFullPath: menuFullPath,
											listType: listType,
											editBo: article});
		}
	});
};

var createOrEditMenuArticle = function(req, res) {
	var articleId = req.body.articleId,
		articleTitle = req.body.articleTitle,
		articleSummary = req.body.articleSummary,
		articleContent = req.body.articleContent,
		menuId = req.body.menuId,
		listType = req.body.listType;;
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
				getReturnListPage(req, res, {
					menuId: menuId,
					listType: listType
				});
			});
		}
	});
};


exports.resourceHome = resourceHome;
exports.editMenuArticle = createOrEditMenuArticle;
exports.resourceArticleDetail = resourceArticleDetail;
exports.newArticleForMenu = newArticleForMenu;
exports.editArticleForMenu = editArticleForMenu;
