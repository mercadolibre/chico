/**
* Class to create UI Components
* @name Factory
* @class Factory
* @param o Configuration Object
* @example
*	o {
*		component: "chat",
*		callback: function(){},
*		[script]: "http://..",
*		[style]: "http://..",
*		[callback]: function(){}
*	}
* @returns collection
* @memberOf ch
*/
// TODO: Always it should receive a conf object as parameter (see Multiple component)
// TODO: Try to deprecate .and() method on Validator
ch.factory = function(o) {

	var x = o.component || o;

	var create = function(x) {

		// Send configuration to a component trough options object
		$.fn[x] = function( options ) {

			var results = [];
			var that = this;

			// Could be more than one argument
			var _arguments = arguments;

			that.each( function(i, e) {

				var conf = options || {};

				var context = {};
					context.type = x;
					context.element = e;
					context.$element = $(e);
					context.uid = ch.utils.index += 1; // Global instantiation index

				switch(typeof conf) {
					// If argument is a number, join with the conf
					case "number":
						var num = conf;
						conf = {};
						conf.value = num;

						// Could come a messages as a second argument
						if (_arguments[1]) {
							conf.msg = _arguments[1];
						};
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
						if (_arguments[1]) {
							conf.msg = _arguments[1];
						};
					break;
				};

				// Create a component from his constructor
				var created = ch[x].call( context, conf );

				/*
					MAPPING INSTANCES
					Internal interface for avoid mapping objects
					{
						exists:true,
						object: {}
					}
				*/

				created = ( ch.utils.hasOwn(created, "public") ) ? created["public"] : created;

				if (created.type) {
					var type = created.type;
					// If component don't exists in the instances map create an empty array
					if (!ch.instances[type]) { ch.instances[type] = []; }
						ch.instances[type].push( created );
				}

				// Avoid mapping objects that already exists
				if (created.exists) {
					// Return the inner object
					created = created.object;
				}

				results.push( created );

			});

			// return the created components collection or single component
			return ( results.length > 1 ) ? results : results[0];
		};

		// if a callback is defined
		if ( o.callback ) { o.callback(); }

	}
	// end create function

	if ( ch[x] ) {
		// script already here, just create it
		create(x);

	} else {
		// get resurces and call create later
		ch.get({
			"method":"component",
			"component": x,
			"script": (o.script)? o.script : "src/js/"+x+".js",
			"styles": (o.style)? o.style : "src/css/"+x+".css",
			"callback":create
		});
	}
}