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
	* Reference to the Float component instanced.
	* @protected
	* @type Object
	* @name ch.Controls#float
	*/

	that.float = (function () {
		conf.float.position = {
			"context": conf.context || conf.float.context || conf.float.$trigger || that.$element,
			"offset": conf.float.offset,
			"points": conf.float.points
		};

		var float = ch.floats.call({
			"element": conf.float.$trigger[0] || that.element,
			"$element": conf.float.$trigger || that.$element,
			"uid": (ch.utils.index += 1),
			"type": conf.float.type || that.type,
			"conf": conf.float
		});

		return float;
	})();

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