
/**
 * Object represent the abstract class of all UI Objects.
 * @abstract
 * @name Object
 * @class Object 
 * @memberOf ch
 * @see ch.Controllers
 * @see ch.Floats
 * @see ch.Navs
 * @see ch.Watcher
 */
 
ch.object = function(){
	
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Object
     */ 
	var that = this;	
	var conf = that.conf;
		
/**
 *  Public Members
 */
 

   /**
    * Component's static content.
    * @public
    * @name staticContent
	* @type {String}
    * @memberOf ch.Object
    */ 
    that.staticContent;
    
   /**
    * DOM Parent of content, this is useful to attach DOM Content when float is hidding.
    * @public
    * @name DOMParent
    * @type {HTMLElement}
    * @memberOf ch.Object
    */ 
    that.DOMParent;

   /**
    * Flag to know if the DOM Content is visible or not.
    * @public
    * @name DOMContentIsVisible
    * @type {Boolean}
    * @memberOf ch.Object
    */ 
    that.DOMContentIsVisible;

   /**
    * Prevent propagation and default actions.
    * @name prevent
    * @function
    * @param {EventObject} event Recieves a event object
    * @memberOf ch.Object
    */
	that.prevent = function(event) {
	   
		if (event && typeof event == "object") {
		    event.preventDefault();
			event.stopPropagation();
		};
		
		return that;
	};


   /**
    * Set and get the content of a component
    * @name content
    * @function
    * @param {String} [content] Could be a simple text, html or a url to get the content with ajax.
    * @returns {String} content
    * @memberOf ch.Object
    * @requires ch.Cache
    * @example
    * // Simple static content
    * $(element).layer("Some static content");
    * @example
    * // Get DOM content
    * $(element).layer("#hiddenContent");
    * @example
    * // Get AJAX content
	* $(element).layer("http://chico.com/content/layer.html");
    */
    that.content = function(content) {

        var _get = (content) ? false : true,

            // Local argument
            content = content,
            // Local static content reference
            staticContent = that.staticContent,
            // Local content source reference
            source = that.source,
            // Local isURL
            sourceIsUrl = ch.utils.isUrl(source),
            // Local isSelector
            sourceIsSelector = ch.utils.isSelector(source),
            // Get context, could be a single component or a controller
            context = ( ch.utils.hasOwn(that, "controller") ) ? that.controller : that["public"],
            // undefined, for comparison.
            undefined,
            // Save cache configuration
            cache = conf.cache;

    /**
     * Get content
     */
		// return defined content
		if ( _get ) {
            // Get data from cache for DOMContent or AJAXContent
            if ( cache && ( sourceIsSelector || sourceIsUrl )) {
            console.log("get from cache");
                var fromCache = ch.cache.get(source);
                if (fromCache) {
                    return fromCache;
                }
            }
            // First time we need to get the contemt.
            // Is cache is off, go and get content again.
            // Yeap, recursive.
            if ( !cache || staticContent === undefined ) {
            	return that.content(source);
            }
			// no source, no content
            if ( source === undefined ) {
                return "<p>No content defined for this component</p>";    
            }
			
			// get at last
            return staticContent;

		}

    /**
     * Set content
     */	
     
    /* Evaluate static content */  
        
        // set 'staticContent' as defined in source
		staticContent = source;

    /* Evaluate DOM content */

        if (sourceIsSelector) {
									            
            that.DOMParent = $(content).parent();
            that.DOMContentIsVisible = $(content).is(":visible")

            // Return DOM content            
			staticContent = $(content).detach().clone().removeClass("ch-hide").show();
			
			// Save new data to the cache
            if (cache) {
            	ch.cache.set(source,staticContent);
            }
       
        }

        // trigger onContentLoad callback for DOM and Static,
        // Avoid trigger this callback on AJAX requests.
		if ( ch.utils.hasOwn(conf, "onContentLoad") && !sourceIsUrl) { conf.onContentLoad.call( context ); }

    /* Evaluate AJAX content */  

        if (sourceIsUrl) {
            
            var _method, _serialized, _params = "x=x";
            
			// If the trigger is a form button, serialize its parent to send data to the server.
			if (that.$element.attr('type') == 'submit') {
				_method = that.$element.parents('form').attr('method') || 'GET';
				_serialized = that.$element.parents('form').serialize();
				_params = _params + ((_serialized != '') ? '&' + _serialized : '');
			};
			
			$.ajax({
				url: source,
				type: _method || 'GET',
				data: _params,
				// each component could have a different cache configuration
				cache: cache,
				async: true,
				beforeSend: function(jqXHR){
					// Ajax default HTTP headers
					jqXHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				},
				success: function(data, textStatus, jqXHR){
					// TODO: It would be nice to re-use the onContentLoad callback.
                    that.contentCallback.call(that,data);
                    // Callback your way out
					if (ch.utils.hasOwn(conf, "onContentLoad")) {
					   conf.onContentLoad.call(context, data, textStatus, jqXHR);
					}
					// Save new data to the cache
                    if (cache) {
                        ch.cache.set(source,data);
                    }
				},
				error: function(jqXHR, textStatus, errorThrown){
					// TODO: It would be nice to re-use the onContentError callback.                    
                    that.contentCallback.call(that,"<p>Error on ajax call </p>");
                    // Callback your way out                    
					if (ch.utils.hasOwn(conf, "onContentError")) {
					   conf.onContentError.call(context, jqXHR, textStatus, errorThrown)
					}
				}
			});

            // Return Spinner and wait for callbacks
			staticContent = '<div class="loading"></div>';

        }

     /* Finally return 'staticContent' */

		return staticContent;
    };

   /**
    * Executes a specific callback
    * @name callbacks
    * @function
    * @memberOf ch.Object
    */
    // TODO: Add examples!!!
	that.callbacks = function(when) {
		if( ch.utils.hasOwn(conf, when) ) {
			var context = ( that.controller ) ? that.controller["public"] : that["public"];
			return conf[when].call( context );
		};
	};

   /**
    * Change components position
    * @name position
    * @function
    * @param {Object} [o] Configuration object
    * @param {String} ["refresh"] Refresh
    * @memberOf ch.Object
    * @returns {Object} o Configuration object is arguments are empty
    */	
    // TODO: Add examples!!!
	that.position = function(o) {
	
		switch(typeof o) {
		 
			case "object":
				conf.position.context = o.context || conf.position.context;
				conf.position.points = o.points || conf.position.points;
				conf.position.offset = o.offset || conf.position.offset;				
				conf.position.fixed = o.fixed || conf.position.fixed;
			
				ch.positioner(conf.position);
				return that["public"];
				break;
		
			case "string":
				if(o != "refresh") {
					alert("Chico UI error: position() expected to find \"refresh\" parameter.");
				};

				ch.positioner(conf.position);

				return that["public"];   			
				break;
		
			case "undefined":
				return conf.position;
			    break;
		};
		
	};
	

 	that["public"] = {};
	
	return that;
};
