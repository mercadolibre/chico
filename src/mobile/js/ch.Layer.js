/**
* Layer lets you show a contextual data.
* @name Layer
* @class Layer
* @augments ch.Expando
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.open] Shows the layer open when component was loaded. By default, the value is false.
* @returns itself
* @factorized
* @see ch.Widget
* @see ch.Expando
* @exampleDescription Create a new layer.
* @example
* var widget = $(".some-element").layer();
*/
ch.Layer = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Layer-that
	* @type object
	*/
	var that = this,

		/**
		* Reference to Parent Class.
		* @private
		* @name ch.Layer-parent
		* @type object
		*/
		parent,

		/**
		* Reference to configuration object.
		* @private
		* @name ch.Layer-conf
		* @type object
		*/
		conf = clone(conf) || {};

	conf.icon = false;

	conf.aria = {};
	conf.aria.role = "tooltip";
	conf.aria.identifier = "aria-describedby";
	conf.classes = conf.classes || "ch-box ch-cone ch-points-ltlb";

	that.conf = conf;
	that.type = "layer"

/**
*	Inheritance
*/
	// Borrow a constructor and return a parent
	parent = ch.inherit(ch.Expando, that);


	/**
	* @borrows ch.Widget#uid as ch.Layer#uid
	*/	
	
	/**
	* @borrows ch.Widget#el as ch.Layer#el
	*/

	/**
	* @borrows ch.Widget#type as ch.Layer#type
	*/

	/**
	* @borrows ch.Widget#emit as ch.Layer#emit
	*/

	/**
	* @borrows ch.Widget#on as ch.Layer#on
	*/

	/**
	* @borrows ch.Widget#once as ch.Layer#once
	*/

	/**
	* @borrows ch.Widget#off as ch.Layer#off
	*/

	/**
	* @borrows ch.Widget#offAll as ch.Layer#offAll
	*/

	/**
	* @borrows ch.Expando#show as ch.Layer#show
	*/

	/**
	* @borrows ch.Expando#hide as ch.Layer#hide
	*/


	/**
	* Emits an event when the component is ready to use.
	* @name ch.Layer#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as layer's instance controller:
	* widget.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.emit("ready")}, 50);

	return that;
};
ch.factory("Layer");