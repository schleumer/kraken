var User = r('/models/user')
, crypto = require('crypto');

exports.login = function (req, res) {
	res.render('users/login');
};

exports.doLogin = function (req, res) {
	var m = crypto.createHash('md5');
	m.update(req.body.password);
	var pass = m.digest('hex');

	User.find({
		username: req.body.username,
		password: pass
	}, function (err, data) {
		if (data.length) {
			req.session.user = data[0].toObject();
			res.send('lel');
		} else {
			res.redirect('/login');
		}
	});
}