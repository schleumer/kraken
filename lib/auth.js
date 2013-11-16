var async = require('async');

module.exports = function (err, req, res, next) {
	async.waterfall([
		function (callback) {
			if (!req.session.hasOwnProperty('user')) {
				res.redirect('/login');
				next();
			} else {
				res.locals.user = req.session.user;
				next();
			}
		}
	]);
};
