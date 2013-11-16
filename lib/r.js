var path = require('path'),
	full = path.join(__dirname, '..');

console.log(full);

module.exports = function (file) {
	return require(path.join(full, file));
}