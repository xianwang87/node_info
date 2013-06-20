var fs = require("fs"),
	unzip = require("unzip"),
	path = require("path");

var mmm = require('mmmagic'),
	Magic = mmm.Magic;
	
var findit = require("findit");
var _ = require("underscore");

var serveUploadedHtml = function(req, res) {
	var filePath = "filename...";
	fs.readFile(filePath, "UTF8", function(err, file) {
		res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(file);
        res.end();
	});
};

var testUpzipZipFile = function(req, res) {
	var filePath = "filename...";
	//fs.createReadStream(filePath).pipe(unzip.Extract({ path:  path.dirname(filePath)}));
	fs.createReadStream(filePath).pipe(unzip.Extract({ path:  filePath}));
	res.end("please check the result");
};


var magicFiletype = new Magic(mmm.MAGIC_MIME_TYPE);
var testFileTypeDetection = function(req, res) {
	magicFiletype.detectFile('/home/xianwang/workspace/eclipse/node/node_info/uploads/df2ca77dc2bf2097933a50436018d2f7', function(err, result) {
	  if (err) throw err;
	  res.end(result);
	});
};


var pStaticReg1 = /'[\.|\/]*__public_static/g;
var pStaticReg2 = /"[\.|\/]*__public_static/g;
var testWalkDirectoryWithFindit = function(req, res) {
	var dirPath = "/home/xianwang/workspace/eclipse/node/node_info/uploads";
	var finder = findit.find(dirPath);
	var result = "";
	finder.on("file", function(file, stat) {
		result += file + "\n";
		var extName = path.extname(file);
		if (extName === ".html"
				|| extName === ".html"
				|| extName === ".css") {
			result += "it's file to be replace::" + extName + "\n";
			var parentDir = file.replace(dirPath, "");
			result += "parentDir::" + parentDir + ", will be splited by: " + path.sep + "\n";
			if (parentDir[0] === path.sep) {
				parentDir = parentDir.substr(1);
			}
			parentDir = parentDir.split(path.sep);
			result += "parent dir name::" + parentDir[0] + "\n";
			var toReplaceStr1 = "upload";
			if (parentDir.length > 1) {
				toReplaceStr1 = path.join(toReplaceStr1, parentDir[0]);
			}
			toReplaceStr1 = path.join(toReplaceStr1, "__public_static");
			var data = fs.readFileSync(file);
			if (data) {
				data = data.toString();
				result += "reg::" + pStaticReg1 + "\n";
				data = data.replace(pStaticReg1, "'" + toReplaceStr1);
				data = data.replace(pStaticReg2, '"' + toReplaceStr1);
				result += data + "\n";
				fs.writeFileSync(file, data);
			}
			result += "type::" + typeof data + "\n\n";
		}
	});
	finder.on("end", function() {
		res.end(result);
	});
};

exports.serveUploadedHtml = serveUploadedHtml;
exports.testUpzipZipFile = testUpzipZipFile;
exports.testFileTypeDetection = testFileTypeDetection;
exports.testWalkDirectoryWithFindit = testWalkDirectoryWithFindit;