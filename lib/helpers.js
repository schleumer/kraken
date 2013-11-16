(function () {
	id_counter = 1;
	Object.defineProperty(Object.prototype, "__uniqueId", {
		writable: true
	});
	Object.defineProperty(Object.prototype, "uniqueId", {
		get: function () {
			if (this.__uniqueId == undefined)
				this.__uniqueId = id_counter++;
			return this.__uniqueId;
		}
	});
}());

module.exports = function (req, res, next) {
	res.locals.__p = function (count, singular, plural, none) {
		count = parseInt(count || 0);
		if (count <= 0) {
			return __(none);
		} else if (count == 1) {
			return __(singular);
		} else {
			return __(plural);
		}
	}
	next();
}