var _ = require("underscore");

var pageUtil = require("./helper/pageUtil").pageUtil;

var FilterParams = function() {
	return {
		add: function() {
			var args = arguments,
				argLen = args.length;
			var filterObj = args[0];
			var self = this;
			if (_.isObject(filterObj)) {
				self._filter = '(';
				var hasAnd = false;
				_.each(_.keys(filterObj), function(key) {
					if (!hasAnd) {
						self._filter += ' ' + key + '=?';
						hasAnd = true;
					} else {
						self._filter += ' and ' + key + '=?';
					}
					self._params.push(filterObj[key]);
				});
				self._filter += ')';
			} else {
				this._filter = args[0];
				this._params = args[1];
			}
		},
		value: function() {
			return {
				filter: this._filter,
				params: this._params
			}
		},
		_filter: '',
		_params: []
	};
};


var SortParams = function() {
	return {
		add: function() {
			var self = this;
			var argArr = arguments;
			self._sort = 'order by';
			var blnFirst = true;
			_.each(argArr, function(ss) {
				if (blnFirst) {
					self._sort += ' ';
					blnFirst = false;
				} else {
					self._sort += ', ';
				}
				if (_.isArray(ss)) {
					self._sort += ss[0];
					if (ss.length > 1) {
						self._sort += ' ' + ss[1];
					}
				} else {
					self._sort += ss;
				}
			});
		},
		value: function() {
			return {
				sort: this._sort
			};
		},
		_sort: ''
	};
};


var GroupParams = function() {
	return {
		add: function(argArr) {
			var self = this;
			self._group = 'group by';
			var blnFirst = true;
			_.each(argArr, function(ss) {
				if (blnFirst) {
					self._group += ' ';
					blnFirst = false;
				} else {
					self._group += ', ';
				}
				self._group += ss;
			});
		},
		value: function() {
			return {
				group: this._group
			};
		},
		_group: ''
	};
};

var PagingParams = function() {
	return {
		update: function(option) {
			option = option || {};
			_.extend(this._paging, option);
		},
		pageDelta: function(count) {
			this._paging.curPage += count;
		},
		gotoPage: function(pageCount) {
			this._paging.curPage = pageCount;
		},
		value: function() {
			return {
				page: pageUtil.paging.getSql(this._paging.curPage, this._paging.pageSize)
			};
		},
		_paging: {
			curPage: 1,
			pageSize: pageUtil.config.PAGE_SIZE
		}
	};
};

var encapMyQuery = function(options) {
	options = options || {};
	var sql = options.myQuery.sql,
		params = options.myQuery.params || [];
	var valTmp;
	if (options.filter) {
		valTmp = options.filter.value();
		if (!options.blnWhere) {
			sql += ' where';
		} else {
			sql += ' and';
		}
		sql += ' ' + valTmp.filter;
		params = params.concat(valTmp.params);
	}
	if (options.sort) {
		valTmp = options.sort.value();
		sql += ' ' + valTmp.sort;
	}
	if (options.group) {
		valTmp = options.group.value();
		sql += ' ' + valTmp.group;
	}
	if (options.page) {
		valTmp = options.page.value();
		sql += ' ' + valTmp.page;
	}
	
	return {
		sql: sql,
		params: params
	};
};

exports.FilterParams = FilterParams;
exports.SortParams = SortParams;
exports.GroupParams = GroupParams;
exports.PagingParams = PagingParams;
exports.encapMyQuery = encapMyQuery;