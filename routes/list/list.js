var _ = require("underscore");

exports.add_list = function(req, res){
	console.log("come to add list here");
	res.render('list/edit.jade', {});
};