var fs = require("fs"),
	unzip = require("unzip"),
	path = require('path');
	
var mmm = require('mmmagic'),
	Magic = mmm.Magic;
var findit = require("findit");
var _ = require("underscore");
var url = require('url');
var rmdir = require('rimraf');

var MY_ENUM = require('../../common/constant/enum').MY_ENUM,
	TOP_LINK = MY_ENUM.TOP_LINK;
var mysql = require('../../common/db/dbmysql').db;
var dateUtil = require('../../common/helper/dateUtil').dateUtil;
var MY_CONSTANTS = require("../../../gconfig").MY_CONSTANTS;
var pageUtil = require('../../common/helper/pageUtil').pageUtil;
var pagination = require('../../common/pagination');

var getMyCreateToolQuery = function(options) {
	var sql = "insert into my_tools (name, oriName, mydesc, fileType, filePath, entryFile, addDate, lastModifyDate) "
			+ " values (?, ?, ?, ?, ?, ?, ?, ?)";
	var params = [];
	params.push(options.name);
	params.push(options.oriName);
	params.push(options.mydesc);
	params.push(options.fileType);
	params.push(options.filePath);
	params.push(options.entryFile);
	params.push(options.addDate);
	params.push(options.lastModifyDate);
	
	return {
		sql: sql,
		params: params
	};
};

var magicFiletype = new Magic(mmm.MAGIC_MIME_TYPE);
var checkUploadedFileType = function(filePath, callback) {
	magicFiletype.detectFile(filePath, function(err, result) {
		if (err) {
			callback(false, err, result);
		};
		callback(result);
	});
};

var pStaticReg1 = /'[\.|\/]*__public_static/g;
var pStaticReg2 = /"[\.|\/]*__public_static/g;
var walkUploadFileAndModify = function(filePath, callback) {
	var dirPath = MY_CONSTANTS.uploadPath;
	var finder = findit.find(filePath);
	finder.on("file", function(file, stat) {
		var extName = path.extname(file);
		if (extName === ".html"
				|| extName === ".htm"
				|| extName === ".css") {
			var parentDir = file.replace(dirPath, "");
			if (parentDir[0] === path.sep) {
				parentDir = parentDir.substr(1);
			}
			parentDir = parentDir.split(path.sep);
			var toReplaceStr1 = "/upload";
			if (parentDir.length > 1) {
				toReplaceStr1 = path.join(toReplaceStr1, parentDir[0]);
			}
			toReplaceStr1 = path.join(toReplaceStr1, "__public_static");
			var data = fs.readFileSync(file);
			if (data) {
				data = data.toString();
				data = data.replace(pStaticReg1, "'" + toReplaceStr1);
				data = data.replace(pStaticReg2, '"' + toReplaceStr1);
				fs.writeFileSync(file, data);
			}
		}
	});
	finder.on("end", function() {
		callback(true, filePath);
	});
	finder.on("error", function() {
		callback(false);
	});
};
var fileUpload = function(req, res) {
	var toolId = req.body.toolId,
		toolName = req.body.toolName,
		toolDesc = req.body.toolDesc,
		toolType = req.body.toolType,
		fileName = req.files.toolFile.name;
		filePath = req.files.toolFile.path,
		curPageType = req.body.curPageType;
	var curDate = dateUtil.getDateStr(new Date().getTime());
	
	var randomFileName = filePath.split(path.sep);
	if (randomFileName.length > 0) {
		randomFileName = randomFileName[randomFileName.length - 1];
	} else {
		randomFileName = null;
	}
	var options = {
		name: toolName,
		oriName: fileName,
		mydesc: toolDesc,
		fileType: toolType,
		filePath: randomFileName,
		addDate: curDate,
		lastModifyDate: curDate
	};
	checkUploadedFileType(filePath, function() {
		var arg0 = arguments[0];
		var fileType = arg0;
		if (arg0 === true || arg0 === false) {
			fileType = arguments[2];
		}
		if (fileType === "application/zip") {
			// unzip it, it's a sync method
			var unzipper = unzip.Extract({ path:  filePath});
			unzipper.on("close", function() {
				_createToolItem(filePath, options, function() {
					res.redirect('/mytool/kind/' + curPageType);
				});
			});
			fs.createReadStream(filePath).pipe(unzipper);
			if (toolType === "html") {
				options.entryFile = "index.html";
			}
		} else {
			_createToolItem(filePath, options, function() {
				res.redirect('/mytool/kind/' + curPageType);
			});
		}
	});
};
var _createToolItem = function(filePath, options, callback) {
	walkUploadFileAndModify(filePath, function(rsStatus, filePath) {
		var myQuery;
		//if (id > 0) {
		//	myQuery = getInsertSentenceUpdate();
		//} else {
			myQuery = getMyCreateToolQuery(options);
		//}
		mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
			callback();
		});
	});
};


var getToolsQuery = function(type, paging) {
	var sql = "select id, name, oriName, mydesc, fileType, filePath, entryFile, author, addDate, lastModifyDate from my_tools";
	var filterp = pagination.FilterParams();
	filterp.add({'fileType': type});
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
		filter: filterp,
		sort: sortp,
		page: pagep
	});
};
var listToolsPage = function(options, callback) {
	pageUtil.getRecordCounts(getToolsQuery(options.toolType), function(totalCount) {
		var myQuery = getToolsQuery(options.toolType, options.paging);
		mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
			if (err) {
				callback(false, err);
			} else {
				var items = [];
				if (results && results.length > 0) {
					_.each(results, function(result) {
						items.push({
							id: result.id,
							name: result.name,
							oriName: result.oriName,
							mydesc: result.mydesc,
							fileType: result.fileType,
							//filePath: result.filePath,
							//entryFile: result.entryFile,
							hrefFile: getEntryFileURLPath(result.filePath, result.entryFile),
							author: result.author,
							addDate: dateUtil.getOnlyDateStr(result.addDate),
							lastModifyDate: dateUtil.getOnlyDateStr(result.lastModifyDate)
						});
					});
				}
				callback(true, items, {totalCount: totalCount});
			}
		});
	});
};
var getEntryFileURLPath = function(filePath, entryFile) {
	var indexFile = filePath;
	if (entryFile) {
		indexFile = path.join(indexFile, entryFile);
	}
	return indexFile;
};

var MyToolObj = function() {
	return {
		id: -1,
		name: "",
		mydesc: "",
		mytype: ""
	}
};
var startFileUpload = function(req, res) {
	var toolType = req.body.toolType || "html",
		curPage = req.body.curPage || 1,
		curPageType = req.params.toolType || "html";
	var options = {
		toolType: toolType,
		paging: {
			curPage: curPage
		}
	};
	listToolsPage(options, function(status, items, _option) {
		if (!status) {
			var errMsg = items;
		} else {
			var ritems = items || [];
		}
		_option = _option || {};
		res.render("tools/index", {
			title: 'My Tools', 
			tools: {
				items: ritems
			}, 
			top_link: TOP_LINK.TOOLS,
			res_nav_link: 'html',
			curPageType: curPageType,
			totalCount: _option.totalCount,
			pageSize: pageUtil.config.PAGE_SIZE,
			curPage: curPage
		});
	});
};

var newATool = function(req, res) {
	res.render("tools/edit", {curPageType: req.body.curPageType || 'html', editBo: new MyToolObj()});
};

var toolsHome = function(req, res) {
	res.redirect('/mytool/kind/html');
};

var _getFullUploadedFilePath = function(filePath) {
	return path.join(MY_CONSTANTS.uploadPath, filePath);
};
var renderUploadedHtmlFile = function(req, res) {
	var toolId = req.params.toolId;
	mysql.query("select filePath, entryFile from my_tools where fileType='html' and id=?", [toolId], function(err, results, fields) {
		if (!err) {
			if (results && results.length > 0) {
				var result0 = results[0];
				var filePath = _getFullUploadedFilePath(getEntryFileURLPath(result0.filePath, result0.entryFile));
				fs.readFile(filePath, function(err, file) {
					res.writeHead(200, {
			            'Content-Type': 'text/html'
			        });
			        res.end(file);
				});
			} else {
				res.end("file is not found..");
			}
		} else {
			res.end(err);
		}
	});
};

var _removeCertainToolInDB = function(toolId, callback) {
	mysql.query("delete from my_tools where id=?", [toolId], function(err, results, fields) {
		if (err) {
			callback(false, err);
		} else {
			callback(true);
		}
	});
};
var _removeCertainTool = function(toolId, callback) {
	mysql.query("select filePath from my_tools where id=?", [toolId], function(err, results, fields) {
		if (err) {
			callback(false, err);
		} else {
			var filePath = null;
			if (results && results.length > 0) {
				filePath = results[0].filePath;
			}
			if (filePath != null) {
				var _fullPath = _getFullUploadedFilePath(filePath);
				fs.stat(_fullPath, function(err, status) {
					if (status.isFile()) {
						fs.unlink(_fullPath, function(err1) {
							if (err1) {
								callback(false, err1);
							} else {
								_removeCertainToolInDB(toolId, callback);
							}
						});
					} else {
						//status.isDirectory()
						rmdir(_fullPath, function(err1) {
							if (err1) {
								callback(false, err1);
							} else {
								_removeCertainToolInDB(toolId, callback);
							}
						})
					}
				});
			} else {
				_removeCertainToolInDB(toolId, callback);
			}
		}
	});
};
var removeATool = function(req, res) {
	var toolId = req.body.toolId;
	_removeCertainTool(toolId, function(status, err) {
		if (status) {
			res.json({rs: true});
		} else {
			res.json({rs: false, msg: err});
		}
	});
};

exports.fileUpload = fileUpload;
exports.startFileUpload = startFileUpload;
exports.toolsHome = toolsHome;
exports.newATool = newATool;
exports.listToolsPage = listToolsPage;
exports.renderUploadedHtmlFile = renderUploadedHtmlFile;
exports.removeATool = removeATool;