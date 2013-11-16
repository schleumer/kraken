var _ = require('underscore');
_.str = require('underscore.string');

module.exports = function (string, replaces) {
	replaces = replaces || null;
	if (replaces) {

		return _.str.sprintf.apply(null, arguments);
	} else {
		return string;
	}
}