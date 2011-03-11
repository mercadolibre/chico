/**
 *	Context Layer
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.layer = function(conf) {

    
/**
 *	Constructor
 *	Guardo el contexto de ejecucion (this) que viene con 3 propiedades del factory (uid, element, type).
 *	Luego, seteamos la configuracion básica del componente y lo guardamos en el contexto para que llegue a sus padres cuando pasamos el contexto (that.conf)
 */

	var that = this;
	
	conf.cone = true;
	conf.classes = "box";
	conf.position = {};
	conf.position.context = that.$element;
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";


	that.conf = conf;

/**
 *	Inheritance
 *		
 */

    that = ui.floats.call(that);
    that.parent = ui.clon(that);
    
/**
 *  Private Members
 */
 
    var showTime = conf.showTime || 400;
    var hideTime = conf.hideTime || 400;

	var st, ht; // showTimer and hideTimer
	
	var showTimer = function(){ st = setTimeout(that.show, showTime) };
	var hideTimer = function(){ ht = setTimeout(that.hide, hideTime) };
	
	var clearTimers = function(){ clearTimeout(st); clearTimeout(ht); };

/**
 *  Protected Members
 */
	
	that.$trigger = that.$element;
	
	that.show = function(event) {
	
		// Reset all layers
		$.each(ui.instances.layer, function(i, e){ e.hide(); });
		that.parent.show(event);
		that.$container.bind('click', function(event){ event.stopPropagation() });
        
        // Click
        if (conf.event == "click") {
            $('<p class="btn ch-close">x</p>').bind('click', that.hide).prependTo(that.$container);
            // Document events
            $(document).one('click', that.hide);
            
        // Hover
        } else {      	
        	clearTimers();    
        	that.$container
        		.one("mouseenter", clearTimers)
        		.bind("mouseleave", function(event){
					var target = event.srcElement || event.target;
					var relatedTarget = event.relatedTarget || event.toElement;
					var relatedParent = relatedTarget.parentNode;
					if ( target === relatedTarget || relatedParent === null || target.nodeName === "SELECT" ) return;
					hideTimer();
        		});
        };
        
        return that;
    };

/**
 *  Public Members
 */
   	that.public.uid = that.uid;
	that.public.element = that.element;
	that.public.type = that.type;
	that.public.content = conf.content || conf.ajax || conf.msg;
	that.public.show = function(){
		that.show();
		
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
	// Click
	if(conf.event === 'click') {
		// Local configuration
		conf.closeButton = true;

		// Trigger events
		that.$trigger
			.css('cursor', 'pointer')
			.bind('click', that.show);

	// Hover
	} else {
		// Trigger events
		that.$trigger
			.css('cursor', 'default')
			.bind('mouseenter', that.show)
			.bind('mouseleave', hideTimer);
	};

    // Fix: change layout problem
    $("body").bind(ui.events.CHANGE_LAYOUT, function(){ that.position("refresh") });
 

	return that;

};
