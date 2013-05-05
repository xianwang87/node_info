exports.checkLogin = function() {
	return function(req, res, next){
		var curTime = new Date().getTime();
		if (req.url == '/dologin') {
			next();
			return;
		}
		if (!req.session || !req.session.user) {
			res.render('permission/login', { title: 'Login'});
		} else {
			next();
		}
	}
};