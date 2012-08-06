ch.routes = (function () {
	var pages = {},
		data,
		location = win.location,
		history = win.history,
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

	$win.bind(EVENT.PATH_CHANGE, resolvePaths);

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