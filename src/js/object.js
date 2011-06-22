
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
    * @name loadContent
    * @param {EventObject} Recieves a event object
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
    * Set the content of a component
    * @name content
    * @type {String} Could be a simple text, html or a url to get the content with ajax.
    * @memberOf ch.Object
    */

	//TODO: Analizar si unificar that.content (get and set) con that.loadContent(load).
	that.content = function(content){
		
		if ( content === undefined ) {
		
			var content = conf.content || conf.msg;
			return (content) ? (( ch.utils.isSelector(content) ) ? $(content) : content) : ((conf.ajax === true) ? (that.$trigger.attr('href') || that.$trigger.parents('form').attr('action')) : conf.ajax );
		
		} else {

			var cache = conf.cache;

			conf.cache = false;

			if ( ch.utils.isUrl(content) ) {
				conf.content = undefined;
				conf.ajax = content;
			} else {
				conf.ajax = false;
				conf.content = content;
			};

			if ( ch.utils.hasOwn(that, "$content") ) {
				that.$content.html(that.loadContent());
				that.position("refresh");
			};

			conf.cache = cache;

			return that["public"];
		};
		
	};

   /**
    * Load dynamic content
    * @name loadContent
    * @lends ch.Get
    * @memberOf ch.Object
    */
	that.loadContent = function() {
		// TODO: Properties validation
		//if( self.ajax && (self.content || self.msg) ) { alert('CH: "Ajax" and "Content" can\'t live together.'); return; };
		
		if( conf.ajax === true){
			
			// Load URL from href or form action
			conf.ajaxUrl = that.$element.attr('href') || that.$element.parents('form').attr('action');
			
			// Ajax parameters
			conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax
			
			// If trigger is a form button...
			if(that.$element.attr('type') == 'submit'){
				conf.ajaxType = that.$element.parents('form').attr('method') || 'GET';
				var serialized = that.$element.parents('form').serialize();
				conf.ajaxParams = conf.ajaxParams + ((serialized != '') ? '&' + serialized : '');
			};

			// Returns ajax results

			ch.get({method:"content", that:that});
			
			return '<div class="loading"></div>';
			
		} else if ( conf.ajax || (conf.msg && ch.utils.isUrl(conf.msg)) ){
			// Set url
			conf.ajaxUrl = conf.ajax || conf.msg;

			// Ajax parameters
			conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax

			// Returns ajax results

			ch.get({method:"content", that:that});
			return '<div class="loading"></div>';
			
		} else {
			var content = conf.content || conf.msg;		
			return ( ch.utils.isSelector(content) ) ? $(content).detach().clone().removeClass("ch-hide").show() : content;			
		};

	};

   /**
    * Executes a specific callback
    * @name callbacks
    * @function
    * @memberOf ch.Object
    */
	that.callbacks = function(when){
		if( ch.utils.hasOwn(conf, when) ) {
			var context = ( that.controller ) ? that.controller["public"] : that["public"];
			return conf[when].call( context );
		};
	};

    /**
    * Change components position
    * @name position
    * @lends ch.Positioner
    * @memberOf ch.Object
    */	
	that.position = function(o){
	
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
				if(o != "refresh"){
					alert("ChicoUI error: position() expected to find \"refresh\" parameter.");
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
