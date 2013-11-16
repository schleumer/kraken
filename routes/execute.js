var _ = require('underscore');

exports.index = function (req, res) {
	console.log(res.locals.__p);
	res.render('execute/index');
}

exports.kill = function(req, res){
	inExecution.forEach(function(item){
		if(parseInt(item.id) == parseInt(req.query.id)){
			item.kill('SIGINT');
		}
	});
	res.send('lel');
}

exports.alive = function(req, res){
	inExecution.forEach(function(item){
		if(parseInt(item.id) == parseInt(req.query.id)){
			if(!item.alive){
				item.bringToLife(true);
			}
		}
	});
	res.send('lel');
}

