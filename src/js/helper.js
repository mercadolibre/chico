/**
 *	Helper
 */

ch.helper = function(controller){

/** 
 *  Constructor
 */
	
	var that = this;

	var conf = {};		
		conf.cone = true;
		conf.position = {};
		conf.position.context = controller.reference;
		conf.position.offset = "15 0";
		conf.position.points = "lt rt";
		conf.cache = false;
	
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
 *  Protected Members
 */ 
	that.$trigger = that.$element;
	
	that.show = function(text) {

		conf.content = '<p><span class="ico error">Error: </span>' + text + '</p>';

		that.parent.show();
		
		// This is a awful fix
		// TODO: We need  to update validation messages on each validation somehow
        that.$content.html( that.loadContent() );		
		
		return that;
	};

/**
 *  Public Members
 */

   	that.public.uid = that.uid;
	that.public.element = that.element;
	that.public.type = that.type;
	that.public.content = conf.content || conf.ajax || conf.msg;
	that.public.show = function(text){
		that.show(text);
		
		return that.public;
	};
	
	that.public.hide = function(){
		that.hide();
		
		return that.public;
	};
	
	that.public.position = that.position;


/**
 *  Default event delegation
 */

    $("body").bind(ch.events.CHANGE_LAYOUT, function(){ 
        that.position("refresh");
    });

	 
	return that;
};
