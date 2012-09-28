/**
* Object represents the abstract class of all widgets.
* @abstract
* @name Uiobject
* @class Uiobject
* @augments ch.Object
* @requires ch.Cache
* @memberOf ch
* @exampleDescription
* @example
* ch.uiobject.call();
* @see ch.Object
* @see ch.Cache
* @see ch.Controllers
* @see ch.Floats
* @see ch.Navs
* @see ch.Watcher
*/

(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Uiobject() {

		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @name ch.Uiobject#that
		 * @type object
		 */
		var that = this;

		var conf = that.conf;


	/**
	 * Inheritance
	 */

		that = ch.Object.call(that);
		that.parent = ch.util.clone(that);



	/**
	 * Protected Members
	 */

		/**
		 * Component static content.
		 * @protected
		 * @name ch.Uiobject#staticContent
		 * @type string
		 */
		that.staticContent;

		/**
		 * DOM Parent of content, this is useful to attach DOM Content when float is hidding.
		 * @protected
		 * @name ch.Uiobject#DOMParent
		 * @type HTMLElement
		 */
		that.DOMParent;

		/**
		 * Component original content.
		 * @protected
		 * @name ch.Uiobject#originalContent
		 * @type HTMLElement
		 */
		that.originalContent;

		/**
		 * Set and get the content of a component. With no arguments will behave as a getter function. Send any kind of content and will be a setter function. Use a valid URL for AJAX content, use a CSS selector for a DOM content or just send a static content like HTML or Text.
		 * @ignore
		 * @name ch.Uiobject#content
		 * @protected
		 * @function
		 * @param {string} [content] Could be a simple text, html or a url to get the content with ajax.
		 * @returns {string} content
		 * @requires ch.Cache
		 * @exampleDescription Simple static content
		 * @example
		 * $(element).layer().content("Some static content");
		 * @exampleDescription Get DOM content
		 * @example
		 * $(element).layer().content("#hiddenContent");
		 * @exampleDescription Get AJAX content
		 * @example
		 * $(element).layer().content("http://chico.com/content/layer.html");
		 */
		that.content = function(content) {

			var _get = (content) ? false : true,

				// Local argument
				content = content,
				// Local isURL
				sourceIsUrl = ch.util.isUrl(that.source),
				// Local isSelector
				sourceIsSelector = ch.util.isSelector(that.source),
				// Local inDom
				sourceInDom = (!sourceIsUrl) ? ch.util.inDom(that.source) : false,
				// Get context, could be a single component or a controller
				context = ( ch.util.hasOwn(that, "controller") ) ? that.controller : that["public"],
				// undefined, for comparison.
				undefined,
				// Save cache configuration
				cache = ( ch.util.hasOwn(conf, "cache") ) ? conf.cache : true;

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
			var isUrl = ch.util.isUrl(content),
				// Local isSelector
				isSelector = ch.util.isSelector(content),
				// Local inDom
				inDom = (!isUrl) ? ch.util.inDom(content) : false;

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
				that.$content.html("<div class=\"ch-loading\"></div>");
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
					ch.cache.set(that.uid, that.staticContent);
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
		 * Prevent propagation and default actions.
		 * @name ch.Uiobject#prevent
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
	 * Public Members
	 */

		/**
		 * Component's public scope. In this scope you will find all public members.
		 */

		/**
		 * Sets and gets component content. To get the defined content just use the method without arguments, like 'widget.content()'. To define a new content pass an argument to it, like 'widget.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
		 * @ignore
		 * @public
		 * @name ch.Uiobject#content
		 * @function
		 * @param {string} content Static content, DOM selector or URL. If argument is empty then will return the content.
		 * @exampleDescription Get the defined content
		 * @example
		 * widget.content();
		 * @exampleDescription Set static content
		 * @example
		 * widget.content("Some static content");
		 * @exampleDescription Set DOM content
		 * @example
		 * widget.content("#hiddenContent");
		 * @exampleDescription Set AJAX content
		 * @example
		 * widget.content("http://chico.com/some/content.html");
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
		 * @borrows ch.Object#trigger as ch.Uiobject#trigger
		 */

		/**
		 * @borrows ch.Object#on as ch.Uiobject#on
		 */

		/**
		 * @borrows ch.Object#once as ch.Uiobject#once
		 */

		/**
		 * @borrows ch.Object#off as ch.Uiobject#off
		 */


		return that;
	}

	Uiobject.prototype.name = 'uiobject';
	Uiobject.prototype.constructor = Uiobject;

	ch.Uiobject = Uiobject;

}(this, this.jQuery, this.ch));