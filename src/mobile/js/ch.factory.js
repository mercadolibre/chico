/** 
* Creational patterns to create UI Components
* @name factory
* @class Factory
* @static
* @param o Configuration Object
* @returns {Object}
* @memberOf ch
*/
ch.factory = function (klass) {
	// Sets the klass name
	var name = klass.toLowerCase(),

		// Creates a new instance
		create = function (e, conf) {

			var context = {
				"type": name,
				"el": e,
				"$el": $(e),
				"uid": uid += 1 // Global instantiation index
			};

			switch (typeof conf) {
			// If argument is a number, join with the conf
			case "number":
				var num = conf;
				conf = {};
				conf.value = num;

				// Could come a messages as a second argument
				if (arguments[1]) {
					conf.msg = arguments[1];
				}
			break;

			// This could be a message
			case "string":
				var msg = conf;
				conf = {};
				conf.msg = msg;
			break;

			// This is a condition for custom validation
			case "function":
				var func = conf;
				conf = {};
				conf.lambda = func;
				
				// Could come a messages as a second argument
				if (arguments[1]) {
					conf.msg = arguments[1];
				}
			break;
			};

			var created = ch[klass].call(context, conf);
			created = (hasOwn(created, "public")) ? created["public"] : created;

			if (created.type) {
				var type = created.type;
				// If component don't exists in the instances map create an empty array
				if (!ch.instances[type]) { 
					ch.instances[type] = [];
				}
				ch.instances[type].push(created);
			}

			// Avoid mapping objects that already exists
			if (created.exists) {
				// Return the inner object
				created = created.object;
			}

			return created;
		};

	
	// Add class constructor to ch
	$.fn[name] = function (conf) {
		// Collection of instances
		var output = [],
			instantiated = [];

		$.each(this, function (i, e) {
			if (hasOwn(ch.instances, name)) {
				$.each(ch.instances[name], function (i, instance) {
					if (e === instance.el) {
						instantiated.push(instance);
					}
				});
			}

			output.push(((instantiated.length > 1) ? instantiated : instantiated[0]) || create(e, conf));
		});

		// Return the instances or collection of instances
		return (output.length > 1) ? output : output[0];
	};

	return this;
};