var index = r('/routes/index')
, users = r('/routes/users')
, execute = r('/routes/execute')
, auth = r('/lib/auth');

module.exports = function (app) {
	app.get('/login', users.login);
	app.post('/login', users.doLogin);

	app.get('/execute', execute.index)
	app.get('/execute/kill', execute.kill)
	app.get('/execute/alive', execute.alive)

	app.get('/', auth, index);
}
