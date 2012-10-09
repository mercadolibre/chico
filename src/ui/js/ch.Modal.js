/**
 * Modal is a centered floated window with a dark gray dimmer background. Modal lets you handle its size, positioning and content.
 * @name Modal
 * @class Modal
 * @augments ch.Floats
 * @memberOf ch
 * @param {Object} [conf] Object with configuration properties.
 * @param {String} [conf.content] Sets content by: static content, DOM selector or URL. By default, the content is the href attribute value  or form's action attribute.
 * @param {Number || String} [conf.width] Sets width property of the component's layout. By default, the width is "500px".
 * @param {Number || String} [conf.height] Sets height property of the component's layout. By default, the height is elastic.
 * @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
 * @param {Boolean} [conf.cache] Enable or disable the content cache. By default, the cache is enable.
 * @param {String} [conf.closable] Sets the way (true, "button" or false) the Modal close. By default, the modal close true.
 * @returns itself
 * @factorized
 * @see ch.Floats
 * @see ch.Tooltip
 * @see ch.Layer
 * @see ch.Zoom
 * @exampleDescription Create a new modal window triggered by an anchor with a class name 'example'.
 * @example
 * var widget = $("a.example").modal();
 * @exampleDescription Create a new modal window triggered by form.
 * @example
 * var widget = $("form").modal();
 * @exampleDescription Create a new modal window with configuration.
 * @example
 * var widget = $("a.example").modal({
 *     "content": "Some content here!",
 *     "width": "500px",
 *     "height": 350,
 *     "cache": false,
 *     "fx": false
 * });
 * @exampleDescription Now <code>widget</code> is a reference to the modal instance controller. You can set a new content by using <code>widget</code> like this:
 * @example
 * widget.content("http://content.com/new/content");
 */
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	var $html = $('html');

	function Modal($el, conf) {

		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @name ch.Modal#that
		 * @type object
		 */
		var that = this;
		that.$element = $el;
		that.element = $el[0];
		that.type = 'modal';
		conf = conf || {};

		conf = ch.util.clone(conf);

		conf.classes = conf.classes || "ch-box";
		conf.reposition = false;

		// Closable configuration
		conf.closeButton = ch.util.hasOwn(conf, "closeButton") ? conf.closeButton : true;
		conf.closable = ch.util.hasOwn(conf, "closable") ? conf.closable : true;

		conf.aria = {};

		if (conf.closeButton) {
			conf.aria.role = "dialog";
			conf.aria.identifier = "aria-label";
		} else {
			conf.aria.role = "alert";
		}

		that.conf = conf;

		/**
		 * Content configuration property.
		 * @protected
		 * @name ch.Modal#source
		 */
		that.source = conf.content || that.element.href || that.$element.parents("form").attr("action");

	/**
	 * Inheritance
	 */

		that = ch.Floats.call(that);
		that.parent = ch.util.clone(that);

	/**
	 * Private Members
	 */

		/**
		 * Reference to the dimmer object, the gray background element.
		 * @private
		 * @name ch.Modal#$dimmer
		 * @type jQuery
		 */
		var $dimmer = $("<div class=\"ch-dimmer\">"),

			/**
			 * Reference to dimmer control, turn on/off the dimmer object.
			 * @private
			 * @name ch.Modal#dimmer
			 * @type object
			 */
			dimmer = {
				on: function () {

					if (that.active) { return; }

					$dimmer
						.css("z-index", ch.util.zIndex += 1)
						.appendTo($('body'))
						.fadeIn();

					if (conf.closable && conf.closable !== 'button') {
						$dimmer.one("click", function (event) { that.innerHide(event) });
					}

					// TODO: position dimmer with Positioner
					if (!ch.support.fixed) {
					 	ch.positioner({ element: $dimmer });
					}
				},
				off: function () {
					$dimmer.fadeOut("normal", function () {
						$dimmer.detach();
					});
				}
			};

	/**
	 * Protected Members
	 */

		/**
		 * Inner show method. Attach the component's layout to the DOM tree and load defined content.
		 * @protected
		 * @name ch.Modal#innerShow
		 * @function
		 * @returns itself
		 */
		that.innerShow = function (event) {
			dimmer.on();
			that.parent.innerShow(event);
			that.$element.blur();
			return that;
		};

		/**
		 * Inner hide method. Hides the component's layout and detach it from DOM tree.
		 * @protected
		 * @name ch.Modal#innerHide
		 * @function
		 * @returns itself
		 */
		that.innerHide = function (event) {
			dimmer.off();
			that.parent.innerHide(event);
			return that;
		};

		/**
		 * Returns any if the component closes automatic.
		 * @protected
		 * @name ch.Modal#closable
		 * @function
		 * @returns boolean
		 */

	/**
	 * Public Members
	 */

		/**
		 * @borrows ch.Object#uid as ch.Modal#uid
		 * @borrows ch.Object#element as ch.Modal#element
		 * @borrows ch.Object#type as ch.Modal#type
		 * @borrows ch.Uiobject#content as ch.Modal#content
		 * @borrows ch.Floats#isActive as ch.Modal#isActive
		 * @borrows ch.Floats#show as ch.Modal#show
		 * @borrows ch.Floats#hide as ch.Modal#hide
		 * @borrows ch.Floats#width as ch.Modal#width
		 * @borrows ch.Floats#height as ch.Modal#height
		 * @borrows ch.Floats#position as ch.Modal#position
		 * @borrows ch.Floats#closable as ch.Modal#closable
		 */

	/**
	 * Default event delegation
	 */

		if (that.element.tagName === "INPUT" && that.element.type === "submit") {
			that.$element.parents("form").on("submit", function (event) { that.innerShow(event); });
		} else {
			that.$element.on("click", function (event) { that.innerShow(event); });
		}

		/**
		 * Triggers when the component is ready to use.
		 * @name ch.Modal#ready
		 * @event
		 * @public
		 * @example
		 * // Following the first example, using <code>widget</code> as modal's instance controller:
		 * widget.on("ready",function () {
		 *	this.show();
		 * });
		 */
		window.setTimeout(function(){ that.trigger("ready")}, 50);

		return that['public'];
	}

	Modal.prototype.name = 'modal';
	Modal.prototype.constructor = Modal;

	ch.factory(Modal);

}(this, this.jQuery, this.ch));