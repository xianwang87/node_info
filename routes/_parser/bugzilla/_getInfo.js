var https = require('https');
//var $ = require('jquery');
var _ = require("underscore");

exports.getSingleBugInfo = function(bugId, endFunc) {
	

	var options = {
	    host: '<bugzilla-url>',
	    path: '/show_bug.cgi?id=' + bugId
	};
	options.rejectUnauthorized = false;
	
	console.log(options);
	
	var result = {
		err: null,
		bugObj: {}
	};
	
	endFunc(result);
	return;
	
	var html = '';
	try {
		https.get(options, function(res) {
		    res.on('data', function(data) {
		        // collect the data chunks to the variable named "html"
		        html += data;
		    }).on('end', function() {
		        // the whole of webpage data has been collected. parsing time!
		        var $html = $(html);
		        
		        console.log(html);
		        var version = $html.find("select#version").val();
		        console.log("version::" + version);
		        var target = $html.find("#target_milestone").text();
/*
Assigned To: #bz_assignee_edit_container a.email span
Status: #static_bug_status
Reporter: .bz_comment.bz_first_comment .bz_first_comment_head .bz_comment_user a.email span
First Report Time: .bz_comment.bz_first_comment .bz_first_comment_head .bz_comment_time
Original Description: #comment_text_0
cc list: #cc
Priority: #priority
Severity: #bug_severity
Product: #product
Name: #short_desc_nonedit_display
Bug Id: .bz_alias_short_desc_container > a
*/
		        result.bugObj = {
		        	version: version,
		        	target: target
		        };
		        endFunc(result);
		     });
		});
	} catch (e) {
		console.log(e);
		result.err = e.message;
		endFunc(result);
	}
};