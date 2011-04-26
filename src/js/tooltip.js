/**
 *	Tooltip
 *	@author 
 *	@Contructor
 *	@return An interface object
 *  @memberOf ch.Floats
 */

ch.tooltip = function(conf) {
    
/**
 *	Constructor
 *	Guardo el contexto de ejecucion (this) que viene con 3 propiedades del factory (uid, element, type).
 *	Luego, seteamos la configuracion básica del componente y lo guardamos en el contexto para que llegue a sus padres cuando pasamos el contexto (that.conf)
 */

	var that = this;
	
	conf = ch.clon(conf);
	conf.cone = true;
	conf.content = that.element.title;	
	conf.position = {};
	conf.position.context = $(that.element);
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";
	
	that.conf = conf;
	
/**
 *	Inheritance
 *		
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

    
/**
 *  Protected Members
 */     
    that.$trigger = that.$element;

    that.show = function(event) {
        that.$trigger.attr('title', ''); // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.parent.show(event);
		
		return that;
	};
	
    that.hide = function(event) {
		that.$trigger.attr('title', conf.content);
		that.parent.hide(event);
		
		return that;
    };

/**
 *  Public Members
 */
 	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].content = that.content;
	that["public"].show = function(){
		that.show();

		return that["public"];
	};
	that["public"].hide = function(){
		that.hide();

		return that["public"];
	};	
	that["public"].position = that.position;
    


/**
 *  Default event delegation
 */	
 	
	that.$trigger
		.bind('mouseenter', that.show)
		.bind('mouseleave', that.hide);

    // Fix: change layout problem
    $("body").bind(ch.events.CHANGE_LAYOUT, function(){ that.position("refresh") });


	return that;
};
