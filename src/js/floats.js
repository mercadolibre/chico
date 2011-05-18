
/**
 * Abstract class of all floats UI-Objects.
 * @name Floats
 * @class Floats
 * @augments ch.Object
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 * @see ch.Tooltip
 * @see ch.Layer
 * @see ch.Modal
 */ 

ch.Floats = function() {

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Floats
     */ 
 	var that = this;
	var conf = that.conf;

/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);
    
/**
 *  Private Members
 */
	var createCone = function() {
		$("<div>")
			.addClass("ch-cone")
			.prependTo( that.$container );
		
		return;
	};

	var createClose = function() {
		// Close Button
		$("<div>")
			.addClass("btn close")
			.css("z-index", ch.utils.zIndex ++)
			.bind("click", function(event){ that.hide(event); })
			.prependTo( that.$container );
		
		// ESC key
		ch.utils.document.bind(ch.events.KEY.ESC, function(event){ that.hide(event); });
		
		return;
	};

    var createLayout = function() {
		
        that.$content = $("<div>")
        	.addClass("ch-" + that.type + "-content")
        	.html( that.loadContent() );
		
    	that.$container = $("<div>")
    		.addClass("ch-hide ch-" + that.type)
    		.css("z-index", ch.utils.zIndex ++)
    		.append( that.$content )
    		.appendTo("body");
		
		// Visual configuration
		if( conf.hasOwnProperty("classes") ) that.$container.addClass(conf.classes);
		if( conf.hasOwnProperty("width") ) that.$container.css("width", conf.width);
		if( conf.hasOwnProperty("height") ) that.$container.css("height", conf.height);
		if( conf.hasOwnProperty("closeButton") ) createClose();
		if( conf.hasOwnProperty("cone") ) createCone();
		if( conf.hasOwnProperty("fx") ) conf.fx = conf.fx; else conf.fx = true;
		
		// Cache - Default: true
		conf.cache = ( conf.hasOwnProperty("cache") ) ? conf.cache : true;
		
		// Show component with effects
		if( conf.fx ) {
			that.$container.fadeIn("fast", function(){ that.callbacks("onShow"); });
		
		// Show component without effects
		} else {
			// TODO: that.$container.removeClass("ch-hide");
			that.$container.show();
			that.callbacks("onShow");
		};
		
		// Position component
		conf.position = conf.position || {};
		conf.position.element = that.$container;
		conf.position.hold = conf.hold || false;
		ch.positioner.call(that);
		
		return;
    };
    

/**
 *  Protected Members
 */ 
			
/**
 *  Public Members
 */
 
	that.active = false;

    /**
     * Shows component's content.
     * @public
     * @name show
     * @return {Chico-UI Object}
     * @memberOf ch.Floats
     */ 
	that.show = function(event) {
		
		if ( event ) that.prevent(event);
		
		if ( that.active ) return;
		
		that.active = true;
		
		// Show if exist, else create		
		if ( that.$container ) {
				
			// If not cache... get content again! // Flush cache where?? when?? do it!
			if ( !conf.cache ) that.$content.html( that.loadContent() );
			
			// Detach the content of BODY
			var content = conf.content || conf.msg;
			if ( ch.utils.isSelector(content) ) $(content).detach();

    		that.$container
    		    .appendTo("body")
    			.css("z-index", ch.utils.zIndex++)
			    .fadeIn('fast', function(){ 
					that.active = true;
					
					// Callback execute
					that.callbacks('onShow');
				});

			that.position("refresh");
						
			return that;
		};
		
		// If you reach here, create a float
        createLayout();
        
        return that;
	};

    /**
     * Hides component's content.
     * @public
     * @name hide
     * @return {Chico-UI Object}
     * @memberOf ch.Floats
     */ 
	that.hide = function(event) {

		if (event) that.prevent(event);

		if (!that.active) return;

		var afterHide = function(){ 
			 
			that.active = false;
			
			// Append the content of BODY
			var content = conf.content || conf.msg;
			
			if(ch.utils.isSelector(content)) {
				that.$content.children()
					.clone()
					.addClass("ch-hide")
					.appendTo("body");
			};
			
			// Callback execute
			that.callbacks('onHide');
			
			$(this).detach();
			
		};
		
		// Show component with effects
		if( conf.fx ) {
			that.$container.fadeOut("fast", afterHide);
		
		// Show component without effects
		} else {
			// TODO: that.$container.addClass("ch-hide");
			that.$container.hide();
			afterHide();
		};
		
		return that;

	};
	
	return that;
	
};