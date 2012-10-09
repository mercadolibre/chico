/**
* Expandable lets you show or hide the content. Expandable needs a pair: the title and the content related to that title.
* @name Expandable
* @class Expandable
* @augments ch.Widget
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.open] Shows the Expandable open when component was loaded. By default, the value is false.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @factorized
* @see ch.Widget
* @exampleDescription Create a new Expandable without configuration.
* @example
* var widget = $(".example").expandable();
* @exampleDescription Create a new Expandable with configuration.
* @example
* var widget = $(".example").expandable({
*     "open": true
* });
*/
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Expandable($el, conf) {
		/**
		* Reference to a internal component instance, saves all the information and configuration properties.
		* @private
		* @name ch.Expandable-that
		* @type object
		*/
		var that = this,

			/**
			* Reference to Parent Class.
			* @private
			* @name ch.Expandable-parent
			* @type object
			*/
			parent;

		that.$element = $el;
		that.element = $el[0];
		that.type = that.type || 'expandable';
		conf = conf || {};

		conf = ch.util.clone(conf);
		conf.open = conf.open || false;
		conf.classes = conf.classes || "";
		that.conf = conf;

	/**
	*	Inheritance
	*/
		that = ch.Widget.call(that);
		parent = ch.util.clone(that);

	/**
	*  Private Members
	*/

		/**
		* Private reference to the Zepto element
		* @privated
		* @name ch.Expandable-$el
		* @type Zepto Object
		*/
		var $el = that.$element,

			/**
			* Private reference to the element
			* @privated
			* @name ch.Expandable-el
			* @type HTMLElement

			*/
			el = that.element,

			/**
			* The component's toggle.
			* @privated
			* @function
			* @name ch.Expandable-$toggle
			* @returns itself
			*/
			toggle = function () {
				that.$trigger.toggleClass("ch-" + that["type"] + "-trigger-on");
				that.$content.toggleClass("ch-hide");

				// Arrows icons
				/*if (conf.icon) { }*/

				return that;
			};

	/**
	*  Protected Members
	*/

		/**
		* The component's trigger.
		* @protected
		* @name ch.Expandable#trigger
		* @type HTMLElement
		*/
		that.trigger = el.firstElementChild;

		/**
		* The component's trigger.
		* @protected
		* @name ch.Expandable#$trigger
		* @type Zepto Object
		*/
		that.$trigger = $(that.trigger);

		/**
		* The component's content.
		* @protected
		* @name ch.Expandable#content
		* @type HTMLElement
		*/
		that.content = el.lastElementChild;

		/**
		* The component's content.
		* @protected
		* @name ch.Expandable#$content
		* @type Zepto Object
		*/
		that.$content = $(that.content);

		/**
		* Shows component's content.
		* @protected
		* @function
		* @name ch.Expandable#innerShow
		* @returns itself
		*/
		that.innerShow = function (event) {

			if (that.active) { return that.innerHide(event); }

			that.active = true;

			toggle();

			// ARIA attr
			that.trigger.setAttribute("aria-expanded", "true");
			that.content.setAttribute("aria-hidden", "false");


			/**
			* Triggers when component is visible.
			* @name ch.Expandable#show
			* @event
			* @public
			* @exampleDescription It change the content when the component was shown.
			* @example
			* widget.on("show",function () {
			*	this.content("Some new content");
			* });
			*/
			that.emit("show");

			return that;
		};

		/**
		* Hides component's content.
		* @protected
		* @function
		* @name ch.Expandable#innerHide
		* @returns itself
		*/
		that.innerHide = function (event) {

			if (!that.active) { return; }

			that.active = false;

			toggle();

			// ARIA attr
			that.trigger.setAttribute("aria-expanded", "false");
			that.content.setAttribute("aria-hidden", "true");


			/**
			* Triggers when component is not longer visible.
			* @name ch.Expandable#hide
			* @event
			* @public
			* @exampleDescription When the component hides show other component.
			* @example
			* widget.on("hide",function () {
			*	otherComponent.show();
			* });
			*/
			that.emit("hide");

			return that;
		};

		/**
		* Create component's behaivor
		* @protected
		* @function
		* @name ch.Expandable#configBehavior
		*/
		that.configBehavior = function () {

			$el.addClass("ch-" + that.type);

			// ARIA
			el.setAttribute("role", "presentation");

			that.trigger.setAttribute("aria-expanded", false);
			that.trigger.setAttribute("aria-controls", "ch-" + that["type"] + "-" + that.uid);

			that.content.setAttribute("id", "ch-" + that["type"] + "-" + that.uid);
			that.content.setAttribute("aria-hidden", true);

			// Trigger behaivor
			// ClassNames
			that.$trigger.addClass("ch-" + that.type + "-trigger");


			/*if (conf.icon) { }*/

			// Events
			that.$trigger.bind(ch.events.TAP, function (event) { event.preventDefault(); that.innerShow(event); });

			// Content behaivor

			// ClassNames
			that.$content.addClass("ch-" + that.type + "-content ch-hide " + conf.classes);

			// Visual configuration
			if (conf.open) { that.innerShow(); }

		};


	/**
	*  Public Members
	*/

		/**
		* @borrows ch.Widget#uid as ch.Expandable#uid
		*/

		/**
		* @borrows ch.Widget#el as ch.Expandable#el
		*/

		/**
		* @borrows ch.Widget#type as ch.Expandable#type
		*/

		/**
		* @borrows ch.Widget#emit as ch.Expandable#emit
		*/

		/**
		* @borrows ch.Widget#on as ch.Expandable#on
		*/

		/**
		* @borrows ch.Widget#once as ch.Expandable#once
		*/

		/**
		* @borrows ch.Widget#off as ch.Expandable#off
		*/

		/**
		* @borrows ch.Widget#offAll as ch.Expandable#offAll
		*/

		/**
		* @borrows ch.Widget#setMaxListeners as ch.Expandable#setMaxListeners
		*/


		/**
		* Shows component's content.
		* @public
		* @function
		* @name ch.Expandable#show
		* @returns itself
		*/
		that["public"].show = function(){
			that.innerShow();
			return that["public"];
		};

		/**
		* Hides component's content.
		* @public
		* @function
		* @name ch.Expandable#hide
		* @returns itself
		*/
		that["public"].hide = function(){
			that.innerHide();
			return that["public"];
		};

	/**
	*  Default behaivor
	*/

		that.configBehavior();

		/**
		* Emits an event when the component is ready to use.
		* @name ch.Expandable#ready
		* @event
		* @public
		* @example
		* // Following the first example, using 'me' as Expandable's instance controller:
		* widget.on("ready",function () {
		*	this.show();
		* });
		*/
		window.setTimeout(function(){ that.emit("ready")}, 50);

		return that['public'];
	}

	Expandable.prototype.name = 'expandable';
	Expandable.prototype.constructor = Expandable;

	ch.factory(Expandable);

}(this, this.Zepto, this.ch));