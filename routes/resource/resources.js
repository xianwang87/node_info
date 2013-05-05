exports.resourceHome = function(req, res) {
	res.render('resources/remind', { title: 'Resources Home', top_link: 'resources', res_nav_link: 'remind'});
};

var resourceItems = {
	"remind": {
		title: 'Resouces - Reminds',
		top_link: 'resources',
		res_nav_link: 'remind'
	},
	"mydate": {
		title: 'Resouces - My Date',
		top_link: 'resources',
		res_nav_link: 'mydate'
	},
	"document": {
		title: 'Resouces - Documents',
		top_link: 'resources',
		res_nav_link: 'document'
	},
	"function": {
		title: 'Resouces - Functions',
		top_link: 'resources',
		res_nav_link: 'function'
	},
	"tech": {
		title: 'Resouces - Technologies',
		top_link: 'resources',
		res_nav_link: 'tech'
	},
	"test": {
		title: 'Resouces - Tests',
		top_link: 'resources',
		res_nav_link: 'test'
	},
	"tool": {
		title: 'Resouces - Tools',
		top_link: 'resources',
		res_nav_link: 'tool'
	},
	"help": {
		title: 'Resouces - Help',
		top_link: 'resources',
		res_nav_link: 'help'
	}
};
exports.getCertainResource = function(req, res) {
	var resId = req.params.resid;
	res.render('resources/' + resId, resourceItems[resId]);
};
exports.getCertainDoc = function(req, res) {
	var resId = req.params.resid,
		docId = req.params.docid;
	var result = resourceItems[resId];
	result.title = result.title + ' - ' + docId;
	result.page_sub_title = "&gt;&nbsp;" + docId;
	res.render('resources/' + resId + '/' + docId, result);
};