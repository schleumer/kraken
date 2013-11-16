var routes = r('routes');

module.exports = function (app) {
	app.get('/', routes.index);
}
