var https = require('https');
//var $ = require('jquery');
var _ = require("underscore");
var bugHelper = require("../_parser/bugzilla/_getInfo");

exports.testHttpsGet = function(req, res){
	bugHelper.getSingleBugInfo(25171, function(result) {
		if (result.err) {
			res.write("something error occurs: " + result.err);
		} else {
			res.write("version: " + result.bugObj.version);
			res.write("target milestone: " + result.bugObj.target);
		}
		res.end();
	});
};


exports.testHttpsGetSimple = function(req, res){
		var options = {
	    host: '<bugzilla-url>',
	    path: '/show_bug.cgi?id=25171'
	};
	
	options.rejectUnauthorized = false;
	//options.agent = new https.Agent( options );
	  res.write("fail");
	res.end();
	return;
	
	var html = '';
	try {
		https.get(options, function(resArg) {
		    resArg.on('data', function(data) {
		        // collect the data chunks to the variable named "html"
		        html += data;
		    }).on('end', function() {
		        // the whole of webpage data has been collected. parsing time!
		        var $html = $(html);
		        //var elTmp = $html.find(".sw_qbox");
		        //elTmp.val(elTmp.attr("title"));
		        //res.write($html.html());
		        //console.log(html);
		        res.write("succ");
		        res.end();
		     });
		});
	} catch (e) {
		console.log(e);
	}
};