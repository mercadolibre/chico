
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
            // Local isURL
            sourceIsUrl = ch.utils.isUrl(that.source),
            // Local isSelector
            sourceIsSelector = ch.utils.isSelector(that.source),
            // Get context, could be a single component or a controller
            context = ( ch.utils.hasOwn(that, "controller") ) ? that.controller : that["public"],
            // undefined, for comparison.
            undefined,
            // Save cache configuration
            cache = ( ch.utils.hasOwn(conf, "cache") ) ? conf.cache : true;

    /**
     * Get content
     */
		// return defined content
		if ( _get ) {

			// no source, no content
            if ( that.source === undefined ) {
                return "<p>No content defined for this component</p>";    
            }

            // Get data from cache for DOMContent or AJAXContent
            if ( cache && ( sourceIsSelector || sourceIsUrl )) {
                var fromCache = ch.cache.get(that.source);
                if (fromCache) {
                    return fromCache;
                }
            }
            
            // First time we need to get the contemt.
            // Is cache is off, go and get content again.
            // Yeap, recursive.
            if ( !cache || that.staticContent === undefined ) {
            	return that.content(that.source);
            }

            // Flag to remove DOM content and avoid ID duplication
            if ( sourceIsSelector ) {
            	$(that.source).detach();
            }
            
			// get at last
            return that.staticContent;

		}

    /**
     * Set content
     */	

    // Reset cache to overwrite content
	conf.cache = false;

		// Local isURL
	var isUrl = ch.utils.isUrl(content),
		// Local isSelector
		isSelector = ch.utils.isSelector(content);

    /* Evaluate static content */  

        // Set 'that.staticContent' and overwrite 'that.source'
		// just in case you want to update DOM or AJAX Content.
		that.staticContent = that.source = content;

    /* Evaluate DOM content */

        if (isSelector) {
			
			// Save DOMParent, so we know where to re-insert the content.
            that.DOMParent = $(content).parent();
            // Check if content was visible or not.
            that.DOMContentIsVisible = $(content).is(":visible")

            // Return DOM content, remove it from DOM to avoid ID duplications
			that.staticContent = $(content).removeClass("ch-hide").remove();
			
			// Save new data to the cache
            if (cache) {
            	ch.cache.set(that.source, that.staticContent);
            }       
        }

        // trigger onContentLoad callback for DOM and Static,
        // Avoid trigger this callback on AJAX requests.
		if ( ch.utils.hasOwn(conf, "onContentLoad") && !isUrl) { conf.onContentLoad.call( context ); }

    /* Evaluate AJAX content */  

        if (isUrl) {
            
            // First check Cache
            // Check if this source is in our cache
            if ( cache ) {
                var fromCache = ch.cache.get(that.source);
                if (fromCache) {
                    return fromCache;
                }
            }

            var _method, _serialized, _params = "x=x";
            
			// If the trigger is a form button, serialize its parent to send data to the server.
			if (that.$element.attr('type') == 'submit') {
				_method = that.$element.parents('form').attr('method') || 'GET';
				_serialized = that.$element.parents('form').serialize();
				_params = _params + ((_serialized != '') ? '&' + _serialized : '');
			};
			
			$.ajax({
				url: that.source,
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
                        ch.cache.set(that.source,data);
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
			that.staticContent = '<div class="loading"></div>';

        }

     /* Set previous cache configuration */

		conf.cache = cache;

     /* Finally return 'staticContent' */
		
		// Update Content
		that.contentCallback.call(that,that.staticContent);

		return that.staticContent;
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
