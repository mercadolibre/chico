
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
    * @returns {Chico-UI Object}
    * @memberOf ch.Object
    * @requires ch.Cache
    */
    that.content = function(content) {
    
            // Save argument or configuration
        var content = content,
            // Get context, could be a single component or a controller
            context = ( ch.utils.hasOwn(that, "controller") ) ? that.controller : that["public"],
            // Local isURL
            isUrl = ch.utils.isUrl(content||that._content),
            // Local isSelector
            isSelector = ch.utils.isSelector(content||that._content),
            // Defined content will return at the end
            definedContent,
            undefined;

    /**
     * Get content
     */
		// return defined content
		if ( content === undefined ) {

            if ( that._content === undefined ) {
                return "<p>No content defined for this component</p>";    
            }
            
            // return jQuery Object for Selectors
            if ( isSelector ) {
                return $(that._content);    
            }
            
            // for ajax
            if ( isUrl ) {
                return that._content;
            }
            
            return that._content;

		}
		
    /**
     * Set content
     */	
     
        // Save cache configuration
        var cache = conf.cache;
		// Turn off cache so we can change the content        
        conf.cache = false;
        
    /* Evaluate AJAX content */  

        if (isUrl) {
            
            if (cache) {
                
                }
            
            var _method, _serialized, _params;
            
			// If the trigger is a form button, serialize its parent to send data to the server.
			if (that.$element.attr('type') == 'submit') {
				_method = that.$element.parents('form').attr('method') || 'GET';
				_serialized = that.$element.parents('form').serialize();
				_params = "x=x" + ((_serialized != '') ? '&' + _serialized : '');
			};
			
			console.log(content)
			console.log(that._content)

			$.ajax({
				url: that._content,
				type: _method || 'GET',
				data: _params,
				cache: true, // TODO: Configuration here?
				async: true,
				beforeSend: function(jqXHR){
					jqXHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				},
				success: function(data, textStatus, jqXHR){
                    that.contentCallback.call(that,data);
					if (ch.utils.hasOwn(conf, "onContentLoad")) conf.onContentLoad.call(context, data, textStatus, jqXHR);
				},
				error: function(jqXHR, textStatus, errorThrown){
                    that.contentCallback.call(that,"<p>Error on ajax call </p>");
					if (ch.utils.hasOwn(conf, "onContentError")) conf.onContentError.call(context, jqXHR, textStatus, errorThrown)
				}
			});

            // Return Spinner and wait for callbacks
			definedContent = '<div class="loading"></div>';

        }

    /* Evaluate DOM content */

        if (ch.utils.isSelector(content)) {
									            
            that.DOMParent = $(content).parent();
            that.DOMContentIsVisible = $(content).is(":visible")

            // Define content            
			definedContent = $(content).detach().clone().removeClass("ch-hide").show();

        }
 
    /* Finally return 'definedContent' or static content */

        // Save previous cache configuration
        conf.cache = cache;
        // trigger onContentLoad callback for DOM and Static,
        // Avoid trigger this callback on AJAX requests.
		if ( ch.utils.hasOwn(conf, "onContentLoad") && !ch.utils.isUrl(content)) { conf.onContentLoad.call( context ); }
        // set 'definedContent' or static content
		return definedContent || content;
    };

   /**
    * Executes a specific callback
    * @name callbacks
    * @function
    * @memberOf ch.Object
    */
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
