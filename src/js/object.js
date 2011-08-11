/**
* Object represent the abstract class of all UI Objects.
* @abstract
* @name Object
* @class Object
* @memberOf ch
* @see ch.Controllers
* @see ch.Floats
* @see ch.Navs
* @see ch.Watcher
*/

ch.object = function(){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Object#that
	* @type object
	*/
	var that = this;

	var conf = that.conf;

/**
*	Public Members
*/

	/**
	* Component static content.
	* @public
	* @name ch.Object#staticContent
	* @type string
	*/
	that.staticContent;

	/**
	* DOM Parent of content, this is useful to attach DOM Content when float is hidding.
	* @public
	* @name ch.Object#DOMParent
	* @type HTMLElement
	*/
	that.DOMParent;

	/**
	* Component original content.
	* @public
	* @name ch.Object#originalContent
	* @type HTMLElement
	*/
	that.originalContent;

	/**
	* Prevent propagation and default actions.
	* @name ch.Object#prevent
	* @function
	* @protected
	* @param {event} event Recieves a event object
	*/
	that.prevent = function(event) {

		if (event && typeof event == "object") {
			event.preventDefault();
			event.stopPropagation();
		};

		return that;
	};

	/**
	* Set and get the content of a component. With no arguments will behave as a getter function. Send any kind of content and will be a setter function. Use a valid URL for AJAX content, use a CSS selector for a DOM content or just send a static content like HTML or Text.
	* @name ch.Object#content
	* @protected
	* @function
	* @param {string} [content] Could be a simple text, html or a url to get the content with ajax.
	* @returns {string} content
	* @requires ch.Cache
	* @example
	* // Simple static content
	* $(element).layer().content("Some static content");
	* @example
	* // Get DOM content
	* $(element).layer().content("#hiddenContent");
	* @example
	* // Get AJAX content
	* $(element).layer().content("http://chico.com/content/layer.html");
	*/
	that.content = function(content) {

		var _get = (content) ? false : true,

			// Local argument
			content = content,
			// Local isURL
			sourceIsUrl = ch.utils.isUrl(that.source),
			// Local isSelector
			sourceIsSelector = ch.utils.isSelector(that.source),
			// Local inDom
			sourceInDom = (!sourceIsUrl) ? ch.utils.inDom(that.source) : false,
			// Get context, could be a single component or a controller
			context = ( ch.utils.hasOwn(that, "controller") ) ? that.controller : that["public"],
			// undefined, for comparison.
			undefined,
			// Save cache configuration
			cache = ( ch.utils.hasOwn(conf, "cache") ) ? conf.cache : true;

		/**
		* Get content
		*/

		// return defined content
		if (_get) {

			// no source, no content
			if (that.source === undefined) {
				that.staticContent = "<p>No content defined for this component</p>";
				that.trigger("contentLoad");

				return;
			}

			// First time we need to get the content.
			// Is cache is off, go and get content again.
			// Yeap, recursive.
			if (!cache || that.staticContent === undefined) {
				that.content(that.source);
				return;
			}

			// Get data from cache if the staticContent was defined
			if (cache && that.staticContent) {
				var fromCache = ch.cache.get(that.source);

				// Load content from cache
				if (fromCache && that.staticContent != fromCache) {
					that.staticContent = fromCache;

					that.trigger("contentLoad");

					// Return and load content from cache
					return;
				}

				// Return and show the latest content that was loaded
				return;
			}
		}

		/**
		* Set content
		*/

		// Reset cache to overwrite content
		conf.cache = false;

		// Local isURL
		var isUrl = ch.utils.isUrl(content),
			// Local isSelector
			isSelector = ch.utils.isSelector(content),
			// Local inDom
			inDom = (!isUrl) ? ch.utils.inDom(content) : false;

		/* Evaluate static content*/

		// Set 'that.staticContent' and overwrite 'that.source'
		// just in case you want to update DOM or AJAX Content.

		that.staticContent = that.source = content;

		/* Evaluate AJAX content*/

		if (isUrl) {

			// First check Cache
			// Check if this source is in our cache
			if (cache) {
				var fromCache = ch.cache.get(that.source);
				if (fromCache) {
					conf.cache = cache;
					that.staticContent = fromCache;
					that.trigger("contentLoad", context);
					return;
				}
			}

			var _method, _serialized, _params = "x=x";

			// If the trigger is a form button, serialize its parent to send data to the server.
			if (that.$element.attr('type') == 'submit') {
				_method = that.$element.parents('form').attr('method') || 'GET';
				_serialized = that.$element.parents('form').serialize();
				_params = _params + ((_serialized != '') ? '&' + _serialized : '');
			};

			// Set ajax config
			// On IE (6-7) "that" reference losts for second time
			// Why?? I don't know... but with a setTimeOut() works fine!
			setTimeout(function(){

				$.ajax({
					url: that.source,
					type: _method || 'GET',
					data: _params,
					// each component could have a different cache configuration
					cache: cache,
					async: true,
					beforeSend: function(jqXHR){
						// Ajax default HTTP headers
						jqXHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					},
					success: function(data, textStatus, jqXHR){
						// Save data as staticContent
						that.staticContent = data;

						// Use the contentLoad callback.
						that.trigger("contentLoad", context);

						// Save new staticContent to the cache
						if (cache) {
							ch.cache.set(that.source, that.staticContent);
						}

					},
					error: function(jqXHR, textStatus, errorThrown){
						that.staticContent = "<p>Error on ajax call.</p>";

						var data = {
							"context": context,
							"jqXHR": jqXHR,
							"textStatus": textStatus,
							"errorThrown": errorThrown
						};

						// Use the contentError callback.
						that.trigger("contentError", data);
					}
				});

			}, 0);

			// Return Spinner and wait for async callback
			that.$content.html("<div class=\"loading\"></div>");
			that.staticContent = undefined;

		} else {

			/* Evaluate DOM content*/

			if (isSelector && inDom) {

				// Save original DOMFragment.
				that.originalContent = $(content);

				// Save DOMParent, so we know where to re-insert the content.
				that.DOMParent = that.originalContent.parent();

				// Save a clone to original DOM content
				that.staticContent = that.originalContent.clone().removeClass("ch-hide");

			}

			// Save new data to the cache
			if (cache) {
				ch.cache.set(that.source, that.staticContent);
			}

			// First time we need to set the callbacks that append and remove the original content.
			if (that.originalContent && that.originalContent.selector == that.source) {

				// Remove DOM content from DOM to avoid ID duplications
				that["public"].on("show", function() {
					that.originalContent.detach();
				});

				// Returns DOMelement to DOM
				that["public"].on("hide", function(){
					that.originalContent.appendTo(that.DOMParent||"body");
				});
			}
		}

		/* Set previous cache configuration*/
		conf.cache = cache;

		// trigger contentLoad callback for DOM and Static content.
		if (that.staticContent !== undefined) {
			that.trigger("contentLoad", context);
		}

	};

	/**
	* This method will be deprecated soon. Triggers a specific callback inside component's context.
	* @name ch.Object#callbacks
	* @function
	* @protected
	*/
	// TODO: Add examples!!!
	that.callbacks = function(when) {
		if( ch.utils.hasOwn(conf, when) ) {
			var context = ( that.controller ) ? that.controller["public"] : that["public"];
			return conf[when].call( context );
		};
	};

	/**
	* Change component's position configuration. If a "refresh" {string} is recived, will refresh component's positioning with the same configuration. You can send an {object} with a new configuration.
	* @name ch.Object#position
	* @function
	* @protected
	* @param {string} ["refresh"] Refresh
	* @returns {object} Configuration object if no arguments are sended.
	* @see ch.Positioner
	*/
	// TODO: Add examples!!!
	that.position = function(o) {

		switch(typeof o) {

			case "object":
				conf.position.context = o.context || conf.position.context;
				conf.position.points = o.points || conf.position.points;
				conf.position.offset = o.offset || conf.position.offset;
				conf.position.fixed = o.fixed || conf.position.fixed;

				ch.positioner(conf.position);
				return that["public"];
				break;

			case "string":
				if(o != "refresh") {
					alert("Chico UI error: position() expected to find \"refresh\" parameter.");
				}

				ch.positioner(conf.position);

				return that["public"];
				break;

			case "undefined":
				return conf.position;
				break;
		};

	};

	/**
	* Triggers a specific event within the component public context.
	* @name ch.Object#trigger
	* @function
	* @protected
	* @param {string} event The event name you want to trigger.
	* @since version 0.7.1
	*/
	that.trigger = function(event, data) {
		$(that["public"]).trigger("ch-"+event, data);
	};

	/**
	* Component's public scope. In this scope you will find all public members.
	*/
	that["public"] = {};

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Object#uid
	* @type number
	* @ignore
	*/
	that["public"].uid = that.uid;

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Object#element
	* @type HTMLElement
	* @ignore
	*/
	that["public"].element = that.element;

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Object#type
	* @type string
	* @ignore
	*/
	that["public"].type = that.type;

	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @name ch.Object#position
	* @example
	* // Change component's position.
	* me.position({ 
	*	  offset: "0 10",
	*	  points: "lt lb"
	* });
	* @see ch.Object#position
	*/
	that["public"].position = that.position;

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Object#content
	* @function
	* @param {string} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @example
	* // Get the defined content
	* me.content();
	* @example
	* // Set static content
	* me.content("Some static content");
	* @example
	* // Set DOM content
	* me.content("#hiddenContent");
	* @example
	* // Set AJAX content
	* me.content("http://chico.com/some/content.html");
	*/
	that["public"].content = function(content){
		if (content) { // sets
			// Reset content data
			that.source = content;
			that.staticContent = undefined;

			if (that.active) {
				that.content(content);
			}

			return that["public"];

		} else { // gets
			return that.staticContent;
		}
	};

	/**
	* Add a callback function from specific event.
	* @public
	* @function
	* @name ch.Object#on
	* @param {string} event Event name.
	* @param {function} handler Handler function.
	* @returns itself
	* @since version 0.7.1
	* @example
	* // Will add a event handler to the "ready" event
	* me.on("ready", startDoingStuff);
	*/
	that["public"].on = function(event, handler) {

		if (event && handler) {
			$(that["public"]).bind("ch-"+event, handler);
		}

		return that["public"];
	};

	/**
	* Removes a callback function from specific event.
	* @public
	* @function
	* @name ch.Object#off
	* @param {string} event Event name.
	* @param {function} handler Handler function.
	* @returns itself
	* @since version 0.7.1
	* @example
	* // Will remove event handler to the "ready" event
	* me.off("ready", startDoingStuff);
	*/
	that["public"].off = function(event, handler) {

		if (event && handler) {
			$(that["public"]).unbind("ch-"+event, handler);
		}

		return that["public"];
	};

	return that;
};