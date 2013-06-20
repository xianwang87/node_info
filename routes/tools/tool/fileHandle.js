var fs = require("fs"),
	unzip = require("unzip"),
	path = require('path');
	
var mmm = require('mmmagic'),
	Magic = mmm.Magic;
var findit = require("findit");

var MY_ENUM = require('../../common/constant/enum').MY_ENUM,
	TOP_LINK = MY_ENUM.TOP_LINK;
var mysql = require('../../common/db/dbmysql').db;
var dateUtil = require('../../common/helper/dateUtil').dateUtil;

var MY_CONSTANTS= require("../../../gconfig").MY_CONSTANTS;

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
				|| extName === ".html"
				|| extName === ".css") {
			var parentDir = file.replace(dirPath, "");
			if (parentDir[0] === path.sep) {
				parentDir = parentDir.substr(1);
			}
			parentDir = parentDir.split(path.sep);
			var toReplaceStr1 = "upload";
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
		filePath = req.files.toolFile.path;
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
			fs.createReadStream(filePath).pipe(unzip.Extract({ path:  filePath}));
			if (toolType === "html") {
				options.entryFile = "index.html";
			}
		}
		walkUploadFileAndModify(filePath, function(rsStatus, filePath) {
			var myQuery;
			//if (id > 0) {
			//	myQuery = getInsertSentenceUpdate();
			//} else {
				myQuery = getMyCreateToolQuery(options);
			//}
			mysql.query(myQuery.sql, myQuery.params, function(err, results, fields) {
				res.end("hello, check database now...");
			});
		});
	});
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
	res.render("tools/index", {
		title: 'My Tools', 
		tools: {
			items: []
		}, 
		top_link: TOP_LINK.TOOLS,
		res_nav_link: 'html'
	});
};

var newATool = function(req, res) {
	res.render("tools/edit", {editBo: new MyToolObj()});
};

var toolsHome = function(req, res) {
	res.redirect('/mytool/kind/html');
};

exports.fileUpload = fileUpload;
exports.startFileUpload = startFileUpload;
exports.toolsHome = toolsHome;
exports.newATool = newATool;