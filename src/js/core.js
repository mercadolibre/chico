/*! Chico-UI Copyright 2011, MercadoLibre.com (Natan santolo, Leandro Linares, Guillermo Paz, Natalia Devalle) */

/**
 * Chico-UI namespace
 * @namespace ch
 * @name ch
 */

var ch = window.ch = {

    /**
     * Current version
     * @name version
     * @type {Number}
     * @memberOf ch
     */
    version: "0.6.4",
    /**
     * List of UI components available.
     * @name components
     * @type {String}
     * @memberOf ch
     */
    components: "",
    /**
     * List of internal components available.
     * @name internals
     * @type {String}
     * @memberOf ch
     */
    internals: "",
    /**
     * Here you will find a map of all component's instances created by Chico-UI.
     * @name instances
     * @type {Map Object}
     * @memberOf ch
     */
    instances: {},
    /**
     * Available device's features.
     * @name features
     * @type {Map Object}
     * @see ch.Support
     * @memberOf ch
     */
    features: {},
    /**
     * Core constructor function.
     * @name init
     * @function
     * @memberOf ch
     */
    init: function() { 
        // unmark the no-js flag on html tag
        $("html").removeClass("no-js");
        // check for browser support
		ch.features = ch.support();
        // iterate and create components               
        $(ch.components.split(",")).each(function(i,e){ ch.factory({component:e}); });
        
        // TODO: This should be on keyboard controller.
		ch.utils.document.bind("keydown", function(event){ ch.keyboard(event); });
        
    },
    /**
     * References and commons functions.
     * @name utils
     * @type {Object Literal}
     * @memberOf ch
     */
    utils: {
		body: $("body"),
		html: $("html"),
		window: $(window),
		document: $(document),
		zIndex: 1000,
		index: 0, // global instantiation index
		isSelector: function(string){
			if(typeof string !== "string") return false;
			
			for (var regex in $.expr.match){
				if ($.expr.match[ regex ].test(string) && $(string).length > 0) {
					return true;
				};
			};
			return false;
		},
		isUrl: function(url){
			return ( (/^((https?|ftp|file):\/\/|((www|ftp)\.)|(\/|.*\/)*)[a-z0-9-]+((\.|\/)[a-z0-9-]+)+([/?].*)?$/).test(url) );
		}
	},

    /**
     * Chico-UI global events reference.
	 * @abstract
     * @name Events
     * @class Events
     * @type {Map Object}
     * @memberOf ch 
     * @see ch.Events.KEY
     */	
    events: {
        /**
         * Every time Chico-UI needs to inform al visual components that layout has been changed, he triggers this event.
         * @public
         * @name CHANGE_LAYOUT
         * @memberOf ch.Events
         */ 
        CHANGE_LAYOUT: "changeLayout", 
        /**
         * Keryboard event collection.
         * @name KEY
         * @namespace KEY
         * @memberOf ch.Events
         */
        KEY: {
            /**
             * Enter key event.
             * @name ENTER
             * @memberOf ch.Events.KEY
             */
        	ENTER: "enter",
            /**
             * Esc key event.
             * @name ESC
             * @memberOf ch.Events.KEY
             */
			ESC: "esc",
            /**
             * Left arrow key event.
             * @name LEFT_ARROW
             * @memberOf ch.Events.KEY
             */
			LEFT_ARROW: "left_arrow",
            /**
             * Up arrow key event.
             * @name UP_ARROW
             * @memberOf ch.Events.KEY
             */
			UP_ARROW: "up_arrow",
            /**
             * Rigth arrow key event.
             * @name RIGHT_ARROW
             * @memberOf ch.Events.KEY
             */
			RIGHT_ARROW: "right_arrow",
            /**
             * Down arrow key event.
             * @name DOWN_ARROW
             * @memberOf ch.Events.KEY
             */
			DOWN_ARROW: "down_arrow"
        }
    }
};


/** 
 * Utility to clone objects
 * @function
 * @name clon
 * @param {Object} o Object to clone
 * @return {Object}
 * @memberOf ch
 */
ch.clon = function(o) {
    
    obj = {};
    
    for (x in o) {
        obj[x] = o[x]; 
    };
    
    return obj;
};


/** 
 * Class to create UI Components
 * @abstract
 * @name Factory
 * @class Factory
 * @param {Configuration Object} o 
 * @example
 *   o {
 *      component: "chat",
 *      callback: function(){},
 *      [script]: "http://..",
 *      [style]: "http://..",
 *      [callback]: function(){}    
 *   }
 * @return {Collection} A collection of object instances
 * @memberOf ch
 */    

ch.factory = function(o) {
    
    if (!o) { 
        alert("Factory fatal error: Need and object {component:\"\"} to configure a component."); 
        return;
    };

    if (!o.component) { 
        alert("Factory fatal error: No component defined."); 
        return;
    };

    var x = o.component;

    var create = function(x) { 

        // Send configuration to a component trough options object
        $.fn[x] = function( options ) {

            var results = [];			    
            var that = this;       

 			// Could be more than one argument
 			var _arguments = arguments;
 			
            that.each( function(i, e) {
            	
				var conf = options || {};

                var context = {};
                    context.type = x;
                    context.element = e;
                    context.$element = $(e);
                    context.uid = ch.utils.index += 1; // Global instantiation index
               
				switch(typeof conf) {
					// If argument is a number, join with the conf
					case "number":
						var num = conf;
						conf = {};
						conf.value = num;
						
						// Could come a messages as a second argument
		                if (_arguments[1]) {
		                    conf.msg = _arguments[1];
		                };
					break;
					
					// This could be a message
					case "string":						
						var msg = conf;
						conf = {};
						conf.msg = msg;
					break;
					
					// This is a condition for custom validation
					case "function":
						var func = conf;
						conf = {};
						conf.lambda = func;
						
						// Could come a messages as a second argument
		                if (_arguments[1]) {      	
		                    conf.msg = _arguments[1];
		                };
					break;
				};
               
                // Create a component from his constructor
                var created = ch[x].call( context, conf );

				/* 
					MAPPING INSTANCES
				
    				Internal interface for avoid mapping objects
    				{
    					exists:true,
    					object: {}
    				}
				*/
				
				created = ( created.hasOwnProperty("public") ) ? created["public"] : created;
				
			    if (created.type) {
			        var type = created.type;		    
                    // If component don't exists in the instances map create an empty array
                    if (!ch.instances[type]) { ch.instances[type] = []; }
                         ch.instances[type].push( created );
			    }
                
                // Avoid mapping objects that already exists
				if (created.exists) {				
					// Return the inner object
					created = created.object;
				}			

			    results.push( created );
			    
            });
            
            // return the created components collection or single component   
            return ( results.length > 1 ) ? results : results[0];
        };

        // if a callback is defined 
        if ( o.callback ) { o.callback(); }
                        
    } // end create function
    
    if ( ch[o.component] ) {
        // script already here, just create it
        create(o.component);
        
    } else {
        // get resurces and call create later
        ch.get({
            "method":"component",
            "component":o.component,
            "script": ( o.script )? o.script : "src/js/"+o.component+".js",
            "styles": ( o.style ) ? o.style : "src/css/"+x+".css",
            "callback":create
        });
    }
}


/**
 * Load components or content
 * @abstract
 * @name Get
 * @class Get
 * @param o {Object} object 
 * @example
 *   o {
 *      method: "content"|"component",
 *      component: "chat",
 *      [script]: "http://..",
 *      [style]: "http://..",
 *      [callback]: function(){}
 *   }
 * @memberOf ch
 */
ch.get = function(o) {
     
    switch(o.method) {
		
		case "content":

	        var that = o.that;
	        var conf = that.conf;
			var context = ( that.hasOwnProperty("controller") ) ? that.controller : that["public"];

			// Set ajax config
			// On IE (6-7) "that" reference losts when I call ch.get for second time
			// Why?? I don't know... but with a setTimeOut() works fine!
			setTimeout(function(){
			
				$.ajax({
					url: conf.ajaxUrl,
					type: conf.ajaxType || 'GET',
					data: conf.ajaxParams,
					cache: true,
					async: true,
					beforeSend: function(jqXHR){
						jqXHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					},
					success: function(data, textStatus, jqXHR){					
						that.$content.html( data );
						if ( conf.hasOwnProperty("onContentLoad") ) conf.onContentLoad.call(context, data, textStatus, jqXHR);
						if ( conf.hasOwnProperty("position") ) ch.positioner(conf.position);
					},
					error: function(jqXHR, textStatus, errorThrown){
						data = (conf.hasOwnProperty("onContentError")) ? conf.onContentError.call(context, jqXHR, textStatus, errorThrown) : "<p>Error on ajax call </p>";
						that.$content.html( data );
						if ( conf.hasOwnProperty("position") ) ch.positioner(conf.position);
					}
				});
				
			}, 0);
			
		break;
	        
		case "component":
	        
	        // ch.get: "Should I get a style?"
	        if ( o.style ) {
	    		var style = document.createElement('link');
	        		style.href = o.style;
	    	    	style.rel = 'stylesheet';
	            	style.type = 'text/css';
	        }
	        // ch.get: "Should I get a script?"        
	        if ( o.script ) {
	    	   	var script = document.createElement("script");
	    			script.src = o.script;
	        }
	        
	        var head = document.getElementsByTagName("head")[0] || document.documentElement;
	
			// Handle Script loading
			var done = false;
	
			// Attach handlers for all browsers
			script.onload = script.onreadystatechange = function() {
	    
	    	if ( !done && (!this.readyState || 
						this.readyState === "loaded" || this.readyState === "complete") ) {

					done = true;

		   			// if callback is defined call it
		   	        if ( o.callback ) { o.callback( o.component ); }

			   		// Handle memory leak in IE
		   			script.onload = script.onreadystatechange = null;

			   		if ( head && script.parentNode ) { head.removeChild( script ); }
				}
			};
	            
			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used.
			if ( o.script ) { head.insertBefore( script, head.firstChild ); }
			if ( o.style ) { head.appendChild( style ); }
	    
		break;        
	}

}


/**
 * Returns a data object with features supported by the device
 * @abstract
 * @name Support
 * @class Support
 * @return {Object}
 * @memberOf ch 
 */
ch.support = function() {
	
	/**
	 * Private reference to the <body> element
	 * @private
	 * @name thisBody
	 * @type {HTMLBodyElement}
	 * @memberOf ch.Support
	 */
	var thisBody = document.body || document.documentElement;
	
	/**
     * Based on: http://gist.github.com/373874
     * Verify that CSS3 transition is supported (or any of its browser-specific implementations)
     *
     * @private
     * @return {Boolean}
     * @memberOf ch.Support
     */
	var transition = (function(){
		var thisStyle = thisBody.style;
		return thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.OTransition !== undefined || thisStyle.transition !== undefined;
	})();

    /**
     * Based on: http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
     * Verify that position fixed is supported
     * 
     * @private
     * @return {Boolean}
     * @memberOf ch.Support
     */	
	var fixed = (function(){
        var isSupported = false;
		var e = document.createElement("div");
			e.style.position = "fixed";
			e.style.top = "10px";
			
		thisBody.appendChild(e);
		if (e.offsetTop === 10) { isSupported = true; };
  		thisBody.removeChild(e);
  		
  		return isSupported;
  		
	})();

	return {
        /**
         * Boolean property that indicates if CSS3 Transitions are supported by the device.
         * @public
         * @name transition
         * @type {Boolean}
         * @memberOf ch.Support
         */
 		transition: transition,
        /**
         * Boolean property that indicates if Fixed positioning are supported by the device.
         * @public
         * @name fixed
         * @type {Boolean}
         * @memberOf ch.Support
         */
		fixed: fixed
	};
	
};
