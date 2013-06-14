var path = require('path');

var MY_ENUM = require('../../common/constant/enum').MY_ENUM,
	TOP_LINK = MY_ENUM.TOP_LINK;

var myCreateQuery = function(options) {
	var sql = "insert into my_tools (name, oriName, mydesc, fileType, filePath, addDate, lastModifyDate) "
			+ " values (?, ?, ?, ?, ?, ?, ?)";
	var params = [];
	params.push(options.name);
	params.push(options.oriName);
	params.push(options.name);
	params.push(options.name);
	params.push(options.name);
	params.push(options.name);
};
var fileUpload = function(req, res) {
	var toolId = req.body.toolId,
		toolName = req.body.toolName,
		toolDesc = req.body.toolDesc,
		toolType = req.body.toolType,
		fileName = req.files.toolFile.name;
		filePath = req.files.toolFile.path;
	console.log("toolId::" + toolId);
	console.log("toolName::" + toolName);
	console.log("toolDesc::" + toolDesc);
	console.log("toolType::" + toolType);
	console.log("fileName::" + fileName);
	console.log("filePath::" + filePath);
	console.log("base random file name::" + path.basename(filePath));
	// save it when file size > 0
	res.end(console.dir(req.files));
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