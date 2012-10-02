/**
* Expandable lets you show or hide the content. Expandable needs a pair: the title and the content related to that title.
* @name Expandable
* @class Expandable
* @augments ch.Navs
* @see ch.Dropdown
* @see ch.TabNavigator
* @see ch.Navs
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.open] Shows the expandable open when component was loaded. By default, the value is false.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @factorized
* @exampleDescription Create a new expandable without configuration.
* @example
* var widget = $(".example").expandable();
* @exampleDescription Create a new expandable with configuration.
* @example
* var widget = $(".example").expandable({
*     "open": true,
*     "fx": true
* });
*/

(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}


	function Expandable($el, conf) {

		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @name ch.Expandable#that
		 * @type object
		 */
		var that = this;

		that.$element = $el;
		that.element = $el[0];
		that.type = 'expandable';
		conf = conf || {};

		conf = ch.util.clone(conf);
		that.conf = conf;

		/**
		 *	Inheritance
		 */

		that = ch.Navs.call(that);
		that.parent = ch.util.clone(that);

		/**
		 *  Protected Members
		 */
		var $nav = that.$element.children(),
			triggerAttr = {
				"aria-expanded":conf.open,
				"aria-controls":"ch-expandable-" + that.uid
			},
			contentAttr = {
				id:triggerAttr["aria-controls"],
				"aria-hidden":!triggerAttr["aria-expanded"]
			};

		/**
		 * The component's trigger.
		 * @protected
		 * @name ch.Expandable#$trigger
		 * @type jQuery
		 */
		that.$trigger = that.$trigger.attr(triggerAttr);

		/**
		 * The component's trigger.
		 * @protected
		 * @name ch.Expandable#$content
		 * @type jQuery
		 */
		that.$content = $nav.eq(1).attr(contentAttr);

		/**
		 * Shows component's content.
		 * @protected
		 * @function
		 * @name ch.Expandable#innerShow
		 * @returns itself
		 */
		that.innerShow = function(event){
			that.$trigger.attr("aria-expanded","true");
			that.$content.attr("aria-hidden","false");
			that.parent.innerShow();
			return that;
		}

		/**
		 * Hides component's content.
		 * @protected
		 * @function
		 * @name ch.Expandable#innerHide
		 * @returns itself
		 */
		that.innerHide = function(event){
			that.$trigger.attr("aria-expanded","false");
			that.$content.attr("aria-hidden","true");
			that.parent.innerHide();
			return that;
		}


		/**
		 *  Public Members
		 */

		/**
		 * @borrows ch.Object#uid as ch.Expandable#uid
		 */

		/**
		 * @borrows ch.Object#element as ch.Expandable#element
		 */

		/**
		 * @borrows ch.Object#type as ch.Expandable#type
		 */

		/**
		 * @borrows ch.Navs#show as ch.Expandable#show
		 */

		/**
		 * @borrows ch.Navs#hide as ch.Expandable#hide
		 */

		/**
		 *  Default event delegation
		 */

		that.$trigger.children().attr("role","presentation");
		ch.util.avoidTextSelection(that.$trigger);

		/**
		 * Triggers when the component is ready to use (Since 0.8.0).
		 * @name ch.Expandable#ready
		 * @event
		 * @public
		 * @since 0.8.0
		 * @exampleDescription Following the first example, using <code>widget</code> as expandable's instance controller:
		 * @example
		 * widget.on("ready",function () {
		 *	this.show();
		 * });
		 */
		setTimeout(function(){ that.trigger("ready") }, 50);

		return that['public'];

	}

	Expandable.prototype.name = 'expandable';
	Expandable.prototype.constructor = Expandable;

	ch.factory(Expandable);

	$.fn.expando = $.fn.expandable;

}(this, this.jQuery, this.ch));