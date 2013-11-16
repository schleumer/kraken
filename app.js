var express = require('express')
, routes = require('./routes')
, path = require('path');

// Isso me parece sujo, mas deixarei
GLOBAL.r = require('./lib/r');
GLOBAL.config = r('/config');
GLOBAL.__ = r('/lib/i18n');

var app = express();

require('./config/routes')(app);

app.configure('development', function () {
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));

	app.set('view engine', 'jade');
	app.set('view options', {layout: false});

	app.use(r('/lib/helpers'));

	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.errorHandler());
	app.locals.pretty = true;
});

app.listen(app.get('port'), function () {
	console.log('Escutando em ' + app.get('port'));
});
