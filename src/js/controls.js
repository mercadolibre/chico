/**
* Abstract class that brings the functionality of all form controls.
* @abstract
* @name Controls
* @class Controls 
* @augments ch.Uiobject
* @requires ch.Floats
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
	* Creates a reference to the Float component instanced.
	* @protected
	* @type Object
	* @name ch.Controls#createFloat
	*/
	that.createFloat = function (c) {
		c.position = {
			"context": conf.context || c.context || c.$element || that.$element,
			"offset": c.offset,
			"points": c.points
		};

		var float = ch.floats.call({
			"element": (ch.utils.hasOwn(c, "$element")) ? c.$element[0] : that.element,
			"$element": c.$element || that.$element,
			"uid": (ch.utils.index += 1),
			"type": c.type || that.type,
			"conf": c
		});

		return float;
	};

/**
*  Public Members
*/

	return that;
};