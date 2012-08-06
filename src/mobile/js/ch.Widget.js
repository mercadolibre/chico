/**
* Represents the abstract class of all Widgets.
* @abstract
* @name Widget
* @class Widget
* @memberOf ch
* @see ch.Expando
* @see ch.Menu
* @see ch.Layer
* @see ch.Modal
*/
ch.Widget = function () {
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Widget-that
	* @type object
	*/
	var that = this;

	// Use ch.EventEmitter
	ch.use(ch.EventEmitter, that);

	/**
	* Status of component
	* @protected
	* @name ch.Widget#active
	* @type boolean
	*/
	that.active = false;

	/**
	* Component's public scope. In this scope you will find all public members.
	*/
	that["public"] = {};

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Widget#uid
	* @type number
	*/
	that["public"].uid = that.uid;

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Widget#el
	* @type HTMLElement
	*/
	that["public"].el = that.el;

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Widget#type
	* @type string
	*/
	that["public"].type = that.type;
	
	/**
	* Execute each of the listener collection in order with the data object.
	* @name ch.Widget#Emit
	* @public
	* @param {string} event The event name you want to emit.
	* @param {object} data Optionl data
	* @example
	* // Will add a event handler to the "ready" event
	* widget.emit("ready", {});
	*/
	that["public"].emit = that.emit;

	/**
	* Adds a listener to the collection for a specified event.
	* @public
	* @function
	* @name ch.Widget#on
	* @param {string} event Event name.
	* @param {function} listener Listener function.
	* @example
	* // Will add a event listener to the "ready" event
	* var startDoingStuff = function () {
	*     // Some code here!
	* };
	*
	* widget.on("ready", startDoingStuff);
	*/
	that["public"].on = that.on;

	/**
	* Adds a one time listener to the collection for a specified event. It will execute only once.
	* @public
	* @function
	* @name ch.Widget#once
	* @param {string} event Event name.
	* @param {function} listener Listener function.
	* @returns itself
	* @example
	* // Will add a event handler to the "contentLoad" event once
	* widget.once("contentLoad", startDoingStuff);
	*/
	that["public"].once = that.once;

	/**
	* Removes a listener from the collection for a specified event.
	* @public
	* @function
	* @name ch.Widget#off
	* @param {string} event Event name.
	* @param {function} listener Listener function.
	* @returns itself
	* @example
	* // Will remove event handler to the "ready" event
	* var startDoingStuff = function () {
	*     // Some code here!
	* };
	*
	* widget.off("ready", startDoingStuff);
	*/
	that["public"].off = that.off;

	/**
	* Removes all listeners from the collection for a specified event.
	* @protected
	* @function
	* @name ch.Widget#removeAllListeners
	* @param {string} event Event name.
	* @returns itself
	* @example
	* widget.removeAllListeners("ready");
	*/
	that["public"].removeAllListeners = that.removeAllListeners;

	/**
	* Increases the number of listeners. Set to zero for unlimited.
	* @public
	* @function
	* @name ch.Widget#setMaxListeners
	* @param {number} n Number of max listeners.
	* @returns itself
	* @example
	* widget.setMaxListeners(20);
	*/
	that["public"].setMaxListeners = that.setMaxListeners;

	return that;
};