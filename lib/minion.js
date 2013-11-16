var spawn = require('child_process').spawn;
var _ = require('underscore');

function MinionSlave(info) {
	var self = this;
	self.name = info.name || 'Minion slave ' + info.uniqueId;
	self.output = '';
	self.id = info.id;
	self.alive = true;
	self.disableRestart = false;
	self.life = null;
	self.port = null;
	self.liveSince = null
	self.getLifeTime = function () {
		return ((new Date().getTime()) - self.liveSince) / 1000;
	}

	self.getMLifeTime = function () {
		return Math.ceil(self.getLifeTime() / 60);
	}

	self.bringToLife = function (again) {
		if(self.life){
			self.life.kill('SIGKILL');
			delete self.life;
		}
		console.log(self.output);
		if (again) {
			self.disableRestart = false;
		}

		self.liveSince = new Date().getTime();

		if (info.hasPorts) {
			if(!self.port){
				self.port = _.random(51000, 52000);
				info.env[info.portEnv] = self.port;
			}
			console.log('Starting slave: ' + self.name + ' @ ' + self.port);
		}else{
			console.log('Starting slave: ' + self.name);
		}

		self.life = spawn(info.command, info.args, {
			cwd: info.dir,
			env: info.env
		});

		var resurrect = function () {
			resurrect = null;
			setTimeout(function () {
				if (!self.disableRestart) {
					self.bringToLife();
				}
			}, 1000);
		}

		self.life.on('error', function (err) {
			if (resurrect) resurrect();
			self.output += JSON.stringify(err);
			self.alive = false;
		});

		self.life.on('exit', function (code, signal) {
			if (resurrect) resurrect();
			self.output += "Code: \"" + code + "\" Signal: " + signal;
			self.alive = false;
		});

		self.life.on('close', function (code, signal) {
			if (resurrect) resurrect();
			self.output += "Code: \"" + code + "\" Signal: " + signal;
			self.alive = false;
		});

		self.life.on('disconnect', function (err) {
			if (resurrect) resurrect();
			self.output += 'Desconectado';
			self.alive = false;
		});

		self.life.stdout.on('data', function (data) {
			self.output += data;
		});
	}

	self.bringToLife();

	self.kill = function () {
		self.disableRestart = true;
		self.life.kill('SIGINT');
	}
}

module.exports = function (info) {
	var self = this;

	self.name = info.name || 'Minion ' + info.uniqueId;

	var defaults = {
		hasPorts: false,
		amount: 1
	};

	self.lives = [];

	for (var i = 0; i < info.amount; i++) {
		self.lives.push(new MinionSlave(info));
	}
}


