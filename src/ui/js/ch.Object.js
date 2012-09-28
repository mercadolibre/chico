/**
* Object represents the abstract class of all Objects.
* @abstract
* @name Object
* @class Object
* @memberOf ch
* @see ch.Controllers
* @see ch.Floats
* @see ch.Navs
* @see ch.Validator
* @see ch.Controls
*/

(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	/**
	 * Global instantiation widget id.
	 * @private
	 * @type {Number}
	 */
	var uid = 0;


	function _Object() {

		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @name ch.Object#that
		 * @type object
		 */
		var that = this;

		var conf = that.conf;

	/**
	 * Public Members
	 */

		/**
		 * This method will be deprecated soon. Triggers a specific callback inside component's context.
		 * @name ch.Object#callbacks
		 * @function
		 * @protected
		 */
		// TODO: Add examples!!!
		that.callbacks = function (when, data) {
			if( ch.util.hasOwn(conf, when) ) {
				var context = ( that.controller ) ? that.controller["public"] : that["public"];
				return conf[when].call( context, data );
			};
		};


		// Triggers a specific event within the component public context.
		that.trigger = function (event, data) {
			$(that["public"]).trigger("ch-"+event, data);
		};

		// Add a callback function from specific event.
		that.on = function (event, handler) {
			if (event && handler) {
				$(that["public"]).bind("ch-"+event, handler);
			}
			return that["public"];
		};

		// Add a callback function from specific event that it will execute once.
		that.once = function (event, handler) {

			if (event && handler) {
				$(that["public"]).one("ch-"+event, handler);
			}

			return that["public"];
		};


		// Removes a callback function from specific event.
		that.off = function (event, handler) {
			if (event && handler) {
				$(that["public"]).unbind("ch-"+event, handler);
			} else if (event) {
				$(that["public"]).unbind("ch-"+event);
			}
			return that["public"];
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
		 */
		that["public"].uid = that.uid = (uid += 1);

		/**
		 * Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
		 * @public
		 * @name ch.Object#element
		 * @type HTMLElement
		 */
		that["public"].element = that.element;

		/**
		 * This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
		 * @public
		 * @name ch.Object#type
		 * @type string
		 */
		that["public"].type = that.type;

		/**
		 * Triggers a specific event within the component public context.
		 * @name trigger
		 * @name ch.Object
		 * @public
		 * @param {string} event The event name you want to trigger.
		 * @since 0.7.1
		 */
		that["public"].trigger = that.trigger;

		/**
		 * Add a callback function from specific event.
		 * @public
		 * @name ch.Object#on
		 * @function
		 * @param {string} event Event nawidget.
		 * @param {function} handler Handler function.
		 * @returns itself
		 * @since version 0.7.1
		 * @exampleDescription Will add a event handler to the "ready" event
		 * @example
		 * widget.on("ready", startDoingStuff);
		 */
		that["public"].on = that.on;

		/**
		 * Add a callback function from specific event that it will execute once.
		 * @public
		 * @name ch.Object#once
		 * @function
		 * @param {string} event Event nawidget.
		 * @param {function} handler Handler function.
		 * @returns itself
		 * @since version 0.8.0
		 * @exampleDescription Will add a event handler to the "contentLoad" event once
		 * @example
		 * widget.once("contentLoad", startDoingStuff);
		 */
		that["public"].once = that.once;

		/**
		 * Removes a callback function from specific event.
		 * @public
		 * @function
		 * @name ch.Object#off
		 * @param {string} event Event nawidget.
		 * @param {function} handler Handler function.
		 * @returns itself
		 * @since version 0.7.1
		 * @exampleDescription Will remove event handler to the "ready" event
		 * @example
		 * var startDoingStuff = function () {
		 *     // Some code here!
		 * };
		 *
		 * widget.off("ready", startDoingStuff);
		 */
		that["public"].off = that.off;

		// Gets or creates the klass's instances map
		ch.instances[that.name] = ch.instances[that.name] || {};
		ch.instances[that.name][uid] = that['public'];

		return that;
	}

	_Object.prototype.name = 'object';
	_Object.prototype.constructor = _Object;

	ch.Object = _Object;

}(this, this.jQuery, this.ch));