var _ = require('underscore');

var mysql = require('../common/db/dbmysql').db;
var tagEnum = require('../common/constant/enum').MY_ENUM;
var dateUtil = require('../common/helper/dateUtil').dateUtil;

var addTagForItem = function(req, res) {
	var tag = req.body.tag,
		oriTagType = req.body.tagType,
		obId = req.body.obId;
	tag = 'abc,test,tag,hello';
	oriTagType = 'Resource';
	obId = 1;
	
	if (!(oriTagType in tagEnum.TAG_OBJECT_TYPE)) {
		res.json({rs: false, msg: 'Tag type is not supported.'});
		return;
	}
	var tagType = tagEnum.TAG_OBJECT_TYPE[oriTagType];
	
	var tags;
	if (tag.indexOf(',') >= 0) {
		tags = _.reject(_.map(tag.split(','), function(tag) { 
					if (tag) {
						return tag.trim();
					}
					return null;
				}), function(tag) {
					return tag == null;
				});
	} else {
		tags = [tag];
	}
	
	if (tags.length < 1) {
		res.json({rs: false, msg: 'No Tag was supplied.'});
		return;
	}
	
	var dbExecResult = {rs: true};
	var existTagsMap = {};
	console.log(tags);
	mysql.query('select id, tagName from my_tags where tagName in (?)', [tags], function(err, results, fields) {
		if (err) {
			console.log(err);
			res.json({rs: false, msg: err});
			return;
		} else {
			if (results && results.length > 0) {
				_.each(results, function(result) {
					existTagsMap[result.tagName] = result.id;
				});
			}
			
			var newTags = _.filter(tags, function(tag) { 
								return !(tag in existTagsMap); 
							});
			if (newTags && newTags.length > 0) {
				addNewTags(req, res, newTags, existTagsMap, dbExecResult, function(req, res, existTagsMap, dbExecResult) {
					addTagsForCertainObject(req, res, existTagsMap, tagType, obId, dbExecResult, function(req, res, tagIds, tagType, obId, dbExecResult) {
						getCertainTagNames(req, res, tagIds, tagType, obId, dbExecResult, function(req, res, tagObjs) {
							returnTagsAdded(req, res, tagObjs);
						})
					})
				});
			} else {
				addTagsForCertainObject(req, res, existTagsMap, tagType, obId, dbExecResult, function(req, res, tagIds, tagType, obId, dbExecResult) {
					getCertainTagNames(req, res, tagIds, tagType, obId, dbExecResult, function(req, res, tagObjs) {
						returnTagsAdded(req, res, tagObjs);
					})
				});
			}
		}
	});
};
var addNewTags = function(req, res, tags, existTagsMap, dbExecResult, callback) {
	var curDate = dateUtil.getDateStr(new Date().getTime());
	
	if (tags && tags.length > 0) {
		var params = [];
		var sql = "insert into my_tags(tagName, addDate, lastModifyDate) values ";
		for (var i = 0; i < tags.length; i++) {
			if (i != 0) {
				sql += ' ,';
			}
			sql += '(?,?,?)';
			params.push(tags[i]);
			params.push(curDate);
			params.push(curDate);
		}
		
		mysql.query(sql, params, function(err, results, fields) {
			if (err) {
				dbExecResult.rs = false;
				res.json({rs: false, msg: err});
			} else {
				mysql.query('select id, tagName from my_tags where tagName in (?)', [tags], function(err, results, fields) {
					if (err) {
						dbExecResult.rs = false;
						res.json({rs: false, msg: err});
						return;
					} else {
						if (results && results.length > 0) {
							_.each(results, function(result) {
								existTagsMap[result.tagName] = result.id;
							});
						}
						if (callback) {
							callback(req, res, existTagsMap, dbExecResult);
						} else {
							res.json({rs: true});
						}
					}
				});
			}
		});
	}
};
var addTagsForCertainObject = function(req, res, existTagsMap, tagType, obId, dbExecResult, callback) {
	var tagIds = _.values(existTagsMap);
	if (!tagIds || tagIds.length < 1) {
		tagIds = [-1];
	}
	mysql.query('select id, tagId from my_tag_object where tagId in (?)', [tagIds], function(err, results, fields) {
		if (err) {
			dbExecResult.rs = false;
			res.json({rs: false, msg: err});
			return;
		} else {
			if (results && results.length > 0) {
				var existTagIds = _.map(results, function(result) { return result.tagId; });
				tagIds = _.difference(tagIds, existTagIds);
			};
			if (tagIds && tagIds.length > 0) {
				var curDate = dateUtil.getDateStr(new Date().getTime());
				var params = [];
				var sql = "insert into my_tag_object(tagId, objectType, objectId, addDate, lastModifyDate) values ";
				for (var i = 0; i < tagIds.length; i++) {
					if (i != 0) {
						sql += ' ,';
					}
					sql += '(?,?,?,?,?)';
					params.push(tagIds[i]);
					params.push(tagType);
					params.push(obId);
					params.push(curDate);
					params.push(curDate);
				}
				mysql.query(sql, params, function(err, results, fields) {
					if (err) {
						dbExecResult.rs = false;
						res.json({rs: false, msg: err});
						return;
					} else {
						if (callback) {
							callback(req, res, tagIds, tagType, obId, dbExecResult);
						} else {
							res.json({rs: true});
							return;
						}
					}
				});
			} else {
				if (callback) {
					callback(req, res, tagIds, tagType, obId, dbExecResult);
				} else {
					res.json({rs: true});
					return;
				}
			}
		}
	});
};
var getCertainTagNames = function(req, res, tagIds, tagType, obId, dbExecResult, callback) {
	if (!tagIds || tagIds.length < 1) {
		tagIds = [-1];
	}
	mysql.query('select id, tagName from my_tags where id in (?)', [tagIds], function(err, results, fields) {
		if (err) {
			dbExecResult.rs = false;
			res.json({rs: false, msg: err});
			return;
		} else {
			var tags = [];
			if (results && results.length > 0) {
				tags = _.map(results, function(result) {
					return {
						id: result.id,
						name: result.tagName
					};
				});
			}
			if (callback) {
				callback(req, res, tags);
			} else {
				res.json({rs: true});
				return;
			}
		}
	});
};
var returnTagsAdded = function(req, res, tagObjs) {
	res.json({rs: true, tags: tagObjs});
};


var getCertainTags = function(options, callback) {
	var objType = options.objType,
		objId = options.objId;
	mysql.query("select a.id, a.tagName from my_tags a, my_tag_object b where a.id = b.tagId"
					+ " and b.objectType=? and b.objectId=?",
				[objType, objId], function(err, results, fields) {
					var tags = null;
					if (!err) {
						if (results && results.length > 0) {
							tags = _.map(results, function(result) {
								return {
									id: result.id,
									name: result.tagName
								};
							});
						}
					}
					if (callback) {
						callback(tags, err);
					}
				});
};
var getTagsForCertainObject = function(req, res) {
	getCertainTags({
		objType: req.body.objType,
		objId: req.body.objId
	}, function(tags, err) {
		if (err) {
			res.json({rs: false, msg: err});
		} else {
			res.json({rs: true, tags: tags});
		}
	});
};

var deleteCertainTagRelations = function(objType, objId, tagIds, callback) {
	if (!tagIds || tagIds.length < 1) {
		tagIds = [-1];
	}
	mysql.query("delete from my_tag_object where objectType=?" 
				+ " and objectId=? and tagId in (?)", [objType, objId, tagIds],
				function(err, results, fields) {
					var deltags = null;
					if (!err) {
						deltags = tagIds;
					}
					if (callback) {
						callback(deltags, err);
					}
				});
};
var deleteTagForCertainObject = function(req, res) {
	deleteCertainTagRelations(req.body.objType, req.body.objId, req.body.tagId
		, function(tags, err) {
			if (err) {
				res.json({rs: false, msg: err});
			} else {
				res.json({rs: true, tags: tags});
			}
		});
};

// for calls between modules
exports.getCertainTags = getCertainTags;
exports.deleteCertainTagRelations = deleteCertainTagRelations;

// for calls from common HTTP request
exports.addTagForItem = addTagForItem;
exports.getTagsForCertainObject = getTagsForCertainObject;
exports.deleteTagForCertainObject = deleteTagForCertainObject;