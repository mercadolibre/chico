
/**
 * Is a centered floated window UI-Object.
 * @name Modal
 * @class Modal
 * @augments ch.Floats
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Tooltip
 * @see ch.Layer
 */ 

ch.modal = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Modal
     */
  	var that = this;
	conf = ch.clon(conf);
	conf.ajax = ( !ch.utils.hasOwn(conf, "ajax") && !ch.utils.hasOwn(conf, "content") && !ch.utils.hasOwn(conf, "msg") ) ? true : conf.ajax; //Default	
	conf.closeButton = (that.type == "modal") ? true : false;
	conf.classes = "box";

	that.conf = conf;

/**
 *	Inheritance
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

    /**
     * Reference to the dimmer object, the gray background element.
     * @private
     * @name $dimmer
     * @type {jQuery Object}
     * @memberOf ch.Modal
     */
	var $dimmer = $("<div>").addClass("ch-dimmer");
	
	// Set dimmer height for IE6
	if (ch.utils.html.hasClass("ie6")) { $dimmer.height( parseInt(document.documentElement.clientHeight, 10) * 3) };
	
    /**
     * Reference to dimmer control, turn on/off the dimmer object.
     * @private
     * @name dimmer
     * @type {Object}
     * @memberOf ch.Modal
     */
	var dimmer = {
		on: function() { //TODO: posicionar el dimmer con el positioner
			$dimmer
				.appendTo("body")
				.css("z-index", ch.utils.zIndex ++)
				.fadeIn();
		
			if (that.type == "modal") {
				$dimmer.one("click", function(event){ that.hide(event) });
			};
			
			if (!ch.features.fixed) {
			  	ch.positioner({ element: $dimmer });
			};

			if ($("html").hasClass("ie6")) {
				$("select, object").css("visibility", "hidden");
			};
		},
		off: function() {
			$dimmer.fadeOut("normal", function(){
				$dimmer.detach();

				if ($("html").hasClass("ie6")) {
					$("select, object").css("visibility", "visible");
				};
			});
		}
	};

/**
 *  Protected Members
 */ 
	that.$trigger = that.$element;
	
	that.show = function(event) {	
		dimmer.on();
		that.parent.show(event);		
		that.$trigger.blur();
		
		return that;
	};
	
	that.hide = function(event) {
		dimmer.off();		
		that.parent.hide(event);

		return that;
	};
	
/**
 *  Public Members
 */
 
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Modal
     */
   	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Modal
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Modal
     */
	that["public"].type = that.type;
    /**
     * The component's content.
     * @public
     * @name content
     * @type {String}
     * @memberOf ch.Modal
     */
	that["public"].content = that.content;
    /**
     * Shows component's content.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Modal
     */
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Modal
     */ 
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Modal
     */
	that["public"].position = that.position;
 
/**
 *  Default event delegation
 */	
	that.$trigger
		.css("cursor", "pointer")
		.bind("click", function(event){ that.show(event); });

	return that;
};


/**
 * Transition
 * @name Transition
 * @interface Transition
 * @augments ch.Modal
 * @memberOf ch.Modal
 * @returns {Chico-UI Object}
 */
 
ch.transition = function(conf) {

    conf = conf || {};

	conf.closeButton = false;
	conf.msg = conf.msg || conf.content || "Please wait...";
	conf.content = $("<div>")
		.addClass("loading")
		.after( $("<p>").html(conf.msg) );

	return ch.modal.call(this, conf);

};

ch.factory({ component: 'transition' });
