/**
* Abstract class that brings the functionality of all form controls.
* @abstract
* @name Controls
* @class Controls 
* @augments ch.Uiobject
* @memberOf ch
* @returns itself
* @see ch.Countdown
* @see ch.Validator
* @see ch.AutoComplete
* @see ch.Calendar
* @see ch.Mask
*/

ch.controls = function () {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @name ch.Controls#that
	* @type Object
	*/
	var that = this,

		conf = that.conf;

/**
*  Inheritance
*/
	that = ch.uiobject.call(that);
	that.parent = ch.clon(that);

/**
*  Protected Members
*/

	/**
	* Reference to the elements to be watched (a.k.a. form inputs).
	* @protected
	* @type Object
	* @name ch.Controls#watcher
	*/
	that.watcher = {
		"elements": that.element,
		"$elements": that.$element,
		"form": that.$element.parents("form"),
		"on": function (event, callback) {
			// TODO: pluralize this
			this.$elements.bind(event, callback);
		},
		"content": function (data) {
			// TODO: pluralize this
			this.$elements.val(data);
		}
	};
	
	/**
	* Reference to the Float component instanced.
	* @protected
	* @type Object
	* @name ch.Controls#float
	*/
	that.float = {};

/**
*  Public Members
*/

	/**
	* Monitors all form controls associated with this component
	* @public
	* @name ch.Controls#watcher
	* @type Object
	*/
	that["public"].watcher = that.watcher;

	return that;
};