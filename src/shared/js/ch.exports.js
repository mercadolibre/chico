(function () {
	exports.inherits = inherits;
	exports.require = require;
	exports.extend = extend;
	exports.clone = clone;

	exports.helpers = {
		'hasOwn': hasOwn,
		'isArray': isArray,
		'VENDOR_PREFIX': VENDOR_PREFIX,
		'inDom': inDom,
		'isUrl': isUrl,
		'avoidTextSelection': avoidTextSelection,
		'getStyles': getStyles,
		'isTag': isTag,
		'isSelector': isSelector
	};

	window.ch = exports;
}());