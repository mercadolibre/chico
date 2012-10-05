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
		 * @borrows ch.Object#trigger as ch.Uiobject#trigger
		 * @borrows ch.Object#on as ch.Uiobject#on
		 * @borrows ch.Object#once as ch.Uiobject#once
		 * @borrows ch.Object#off as ch.Uiobject#off
		 */

		return that;
	}

	Uiobject.prototype.name = 'uiobject';
	Uiobject.prototype.constructor = Uiobject;

	ch.Uiobject = Uiobject;

}(this, this.jQuery, this.ch));