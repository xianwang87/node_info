var fs = require("fs"),
	unzip = require("unzip"),
	path = require("path");

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

exports.serveUploadedHtml = serveUploadedHtml;
exports.testUpzipZipFile = testUpzipZipFile;