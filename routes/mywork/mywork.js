exports.myworkHome = function(req, res) {
	res.render('mywork/index', { title: 'My Finished Work', top_link: 'mywork', res_nav_link: 'mywork'});
};