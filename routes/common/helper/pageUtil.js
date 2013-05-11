var DEF_PAGE_CONFIG = {
	PAGE_SIZE: 15
};


exports.pageUtil = {
	config: DEF_PAGE_CONFIG,
	paging: {
		getSql: function(curPage, pageSize) {
			return " limit " + (curPage-1)*pageSize + ", " + pageSize;
		}
	}
};