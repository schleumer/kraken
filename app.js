var express = require('express')
, app = express()
, r = require('./lib/r')
, routes = require('./routes')
, path = require('path')
, mongoose = require('mongoose')
, minion = r('/lib/minion');

GLOBAL.r = require('./lib/r');
GLOBAL.config = r('/config');
GLOBAL.__ = r('/lib/i18n');
GLOBAL.inExecution = [];

var routes = require('./config/routes');

var mongoOpts = {
	'db': {
		'native_parser': true
	},
	'server': {
		'auto_reconnect': true
	},
	'replset': {
		'readPreference': 'nearest',
		'strategy': 'ping',
		'rs_name': 'mySet'
	}
}

mongoose.connect('mongodb://localhost/kraken', mongoOpts);

var SessionStore = require("session-mongoose")(express);
var store = new SessionStore({
	interval: 120000,
	connection: mongoose.connection
});

app.configure('development', function () {
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));

	app.set('view engine', 'jade');
	app.set('view options', {layout: false});

	app.use(express.cookieParser('123456'));
	app.use(express.session({
		store: store,
		cookie: { maxAge: 900000 } // expire session in 15 min or 900 seconds
	}));

	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());

	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.errorHandler());

	var helpers = r('/lib/helpers');
	app.use(helpers);

	app.locals.pretty = true;
	app.locals.basedir = path.join(__dirname, 'views');

	inExecution.push(new minion({
		id: 1,
		name: 'Guia do Lugar',
		command: 'node',
		args: ['app.js'],
		dir: '/workspace/node/node-guiadolugar',
		amount: 2,
		hasPorts: true,
		portEnv: 'PORT',
		env: {
			PORT: null,
			SISTEMA: 'guiadolugar'
		}
	}));

	inExecution.push(new minion({
		id: 1,
		name: 'Indexador Guia do Lugar',
		command: 'node',
		args: ['indexer.js'],
		dir: '/workspace/node/node-guiadolugar',
		amount: 1,
		env: {}
	}));

	app.use(app.router);
	routes(app);
});

app.on('close', function () {
	console.log("Closed");
});

process.once('SIGTERM', function () {
	console.log("Closing");
	inExecution.forEach(function (v) {
		if (v.life) {
			v.life.kill();
		}
	});
	process.exit();
});

app.listen(app.get('port'), function () {
	console.log('Escutando em ' + app.get('port'));
});