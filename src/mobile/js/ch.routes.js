(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	var routes = (function () {
		var pages = {},
			data,
			location = window.location,
			history = window.history,
			$window = $(window),
			url,
			x,
			resolvePaths = function () {
				url = location.hash.split("#!/")[1];
				if (typeof url === "undefined" || url === "") {
					pages[""].forEach(function (e, i) {
						e();
					});
					return;
				}

				if (pages[url]) {
					pages[url]();
				}
			};

		pages[""] = [];

		$window.bind(ch.events.PATH_CHANGE, resolvePaths);

		return {

			"add": function (paths) {
				for (x in paths) {
					if (x === "") {
						pages[""].push(paths[""]);
						continue;
					}
					pages[x] = paths[x];
				}
			},

			"remove": function (path, fn) {
				delete pages[path][fn];
			},

			"update": function (path) {
				if (typeof path === "undefined") {
					history.back();
					return;
				}

				if (location.hash === "") {
					history.pushState(null, "", "#!/" + path);
				}
			}
		};
	}());

	ch.routes = routes

}(this, this.Zepto, this.ch));