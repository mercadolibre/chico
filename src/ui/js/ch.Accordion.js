/**
* Accordion lets you organize the content like folds.
* @name Accordion
* @class Accordion
* @factorized
* @interface
* @augments ch.Widget
* @requires ch.Menu
* @requires ch.Expandable
* @see ch.Widget
* @see ch.Menu
* @see ch.Expandable
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Number} [conf.selected] Selects a child that will be open when component was loaded.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @exampleDescription Create a new Accordion.
* @example
* var widget = $(".example").accordion();
* @exampleDescription Create a new Accordion with configuration.
* @example
* var widget = $(".example").accordion({
*     "selected": 2,
*     "fx": true
* });
*/
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Accordion($el, conf) {
		conf = conf || {};
		conf.accordion = true;
		conf.classes = conf.classes || 'ch-accordion';

		return $el.menu(conf);
	}

	Accordion.prototype.name = 'accordion';
	Accordion.prototype.constructor = Accordion;
	Accordion.prototype.preset = 'Menu';

	ch.factory(Accordion);

}(this, this.jQuery, this.ch));


/**
 * @borrows ch.Widget#uid as ch.Accordion#uid
 * @borrows ch.Widget#element as ch.Accordion#element
 * @borrows ch.Widget#type as ch.Accordion#type
 */

/**
* Select a specific children.
* @public
* @name select
* @name ch.Accordion#select
* @param item The number of the item to be selected
* @returns
*/

/**
* It is triggered when the a fold is selected by the user.
* @name ch.Accordion#select
* @event
* @public
* @exampleDescription When the user select
* @example
* widget.on("select",function(){
*     app.off();
* });
*/

/**
* Triggers when the component is ready to use (Since 0.8.0).
* @name ch.Accordion#ready
* @event
* @public
* @since 0.8.0
* @exampleDescription Following the first example, using <code>widget</code> as accordion's instance controller:
* @example
* widget.on("ready",function () {
*	this.select();
* });
*/