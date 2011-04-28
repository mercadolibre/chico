var start = new Date().getTime();
/** 
  * @namespace
  */
var ch = window.ch = {

    version: "0.6.0",

    components: "",

    internals: "",

    instances: {},
    
    features: {},
 	
    init: function() { 
        // unmark the no-js flag on html tag
        $("html").removeClass("no-js");
        // check for browser support
		ch.features = ch.support();
        // check for pre-configured components
        ch.components = (window.components) ? ch.components+","+window.components : ch.components ;
        // check for pre-configured internals
        ch.internals = (window.internals) ? ch.internals+","+window.internals : ch.internals ;
        // iterate and create components               
        $(ch.components.split(",")).each(function(i,e){ ch.factory({component:e}); });
    },
/**
 *	@static Utils. Common usage functions.
 */		
    utils: {
		body: $('body'),
		html: $('html'),
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
 *	@const Event's Map.
 */	
    events: {
        CHANGE_LAYOUT: "changeLayout"
    }    
};




/**
 *	Pre-Load function
 */	

ch.preload = function(arr) {

	if (typeof arr === "string") {
		arr = (arr.indexOf(",") > 0) ? arr.split(",") : [arr] ;
	}

	for (var i=0;i<arr.length;i++) {
				
		var o = document.createElement("object");
			o.data = arr[i]; // URL
			
		var h = document.getElementsByTagName("head")[0];
			h.appendChild(o);
			h.removeChild(o); 
	}       
};




/**
*	Factory
*/	
ch.factory = function(o) {

    /**
    *   o {
            component: "chat",
            callback: function(){},
            [script]: "http://..",
            [style]: "http://..",
            [callback]: function(){}    
    *    }
    *
    *	@return A collection of object instances
    */
    
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
            
            // return the created components or component   
            return ( results.length > 1 ) ? results : results[0];
        };

        // if a callback is defined 
        if ( o.callback ) { o.callback(); }
                        
    } // end create function
    
    if ( ch[o.component] ) {
        // script already here, just create
        create(o.component);
        
    } else {
        // get resurces and call create
        ch.get({
            "method":"component",
            "component":o.component,
            "script": ( o.script )? o.script : "src/js/"+o.component+".js",
            "styles": ( o.style ) ? o.style : "src/css/"+x+".css",
            "callback":create
        });
        
        //alert("CH: " + x + " configuration error. The component do not exists");
    }
}

/**
 *  Get
 */
 
ch.get = function(o) {
    /**
    *   o {
            method: "content"|"component",
            component: "chat",
            [script]: "http://..",
            [style]: "http://..",
            [callback]: function(){}
    *    }
    */
    
    switch(o.method) {
		
		case "content":

	        var that = o.that;
	        var conf = that.conf;
			var context = ( that.controller ) ? that.controller["public"] : that["public"];
			//Set ajax config
			//setTimeout(function(){
			
			$.ajax({
				url: conf.ajaxUrl,
				type: conf.ajaxType || 'GET',
				data: conf.ajaxParams,
				cache: true,
				async: true,
				beforeSend: function(jqXHR){
					jqXHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				},
				success: function(data, textStatus, xhr){					
					that.$content.html( data ); 
					if ( conf.onContentLoad ) conf.onContentLoad.call(context);
					if ( conf.position ) ch.positioner(conf.position);
				},
				error: function(xhr, textStatus, errorThrown){
					data = (conf.hasOwnProperty("onContentError")) ? conf.onContentError.call(context, xhr, textStatus, errorThrown) : "<p>Error on ajax call </p>";
					that.$content.html( data );
					if ( conf.position ) ch.positioner(conf.position);
				}
			});
			//}, 25);
			
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
	            
			// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
			// This arises when a base node is used.
			if ( o.script ) { head.insertBefore( script, head.firstChild ); }
			if ( o.style ) { head.appendChild( style ); }
	    
		break;        
	}

}

/**
 *  Eraser
 */
 
ch.eraser = function(data) {
	
	if(typeof data == "number"){
		
		// By UID
		for(var x in ch.instances){
			
			var component = ch.instances[x];
			
			for(var i = 0, j = component.length; i < j; i += 1){
				if(component[i].uid == data){
					// TODO: component.delete()
					delete component[i];
					component.splice(i, 1);
					
					return;
				};
			};
		};
	
	} else {
		
		// All
		if(data === "meltdown"){
			// TODO: component.delete()
			/*for(var x in ch.instances){
				var component = ch.instances[x];
				for(var i = 0, j = component.length; i < j; i += 1){
					component.delete();
				};
			};*/
			
			delete ch.instances;
			ch.instances = {};
			
		// By component name	
		} else {
			
			for(var x in ch.instances){
			
				if(x == data){
					
					var component = ch.instances[x];
					
					// TODO: component.delete()
					/*for(var i = 0; i < component.length; i += 1){
						component.delete()
					};*/
					
					delete ch.instances[x];
				};
			};
			
		};
		
	};
	
};


/**
 *  Support
 */
 
ch.support = function() {
	var thisBody = document.body || document.documentElement;
	// Based on: http://gist.github.com/373874
	// Verify that CSS3 transition is supported (or any of its browser-specific implementations)
	var transition = (function(){
		var thisStyle = thisBody.style;

		return thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.OTransition !== undefined || thisStyle.transition !== undefined;
	})();
	
	// Based on: http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
	// Verify that position fixed is supported
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
		transition: transition,
		fixed: fixed
		// gradient: gradient
	};
	
};


/**
 *  Cache
 */

ch.cache = {
	map: {},
	add: function(url, data) {
		ch.cache.map[url] = data;
	},
	get: function(url) {
		return ch.cache.map[url];
	},
	rem: function(url) {
		ch.cache.map[url] = null;
		delete ch.cache.map[url];
	},
	flush: function() {
		delete ch.cache.map;
		ch.cache.map = {};
	}
};


/**
 *	Clone function
 */	

ch.clon = function(o) {
	
	obj = {};
	
    for (x in o) {
    	obj[x] = o[x]; 
    };
    
    return obj;
};


$(function() { // DOM Ready
	var now = new Date().getTime();
    ch.loadTime = now - start;
});
