/**
 *  @class Object. Represent the abstract class of all ui objects.
 *  @return {object} Object.
 */	

ch.object = function(){
	
/**
 *  Inheritance: Create a symbolic link to myself
 */
	var that = this;	
	var conf = that.conf;
	//Porque llegan las cosas que pisa el modal cuando sube... si no estan definidas todavia.
/**
 *  Public Members
 */
	that.prevent = function(event) {
		if (event && typeof event == "object") {
		    event.preventDefault();
			event.stopPropagation();
		};
		
		return that;
	};
	
	//TODO: Analizar si unificar that.content (get and set) con that.loadContent(load).
	that.content = function(content){
		
		if ( content === undefined ) {
		
			var content = conf.content || conf.msg;
			return (content) ? (( ch.utils.isSelector(content) ) ? $(content) : content) : ((conf.ajax === true) ? (that.$trigger.attr('href') || that.$trigger.parents('form').attr('action')) : conf.ajax );
		
		} else {
			
			//TODO: We have to cache the content if it's the same
			conf.cache = false;
			
			if ( ch.utils.isUrl(content) ) {
				conf.content = undefined;
				conf.ajax = content;
			} else {
				conf.ajax = false;
				conf.content = content;
			};
	
			if ( that.active ) {
				that.$content.html(that.loadContent());
				return that.position("refresh");
			};

			if (that.active) that.position("refresh");
			return that.public;
		};
		
	};

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

	that.callbacks = function(when){
		if( conf.hasOwnProperty(when) ) {
			var context = ( that.controller ) ? that.controller.public : that.public;
			return conf[when].call( context );
		};
	};
	
	that.position = function(o){
	
		switch(typeof o) {
		 
			case "object":
				conf.position.context = o.context || conf.position.context;
				conf.position.points = o.points || conf.position.points;
				conf.position.offset = o.offset || conf.position.offset;				
				conf.position.fixed = o.fixed || conf.position.fixed;
			
				ch.positioner(conf.position);
				return that.public;
				break;
		
			case "string":
				if(o != "refresh"){
					alert("ChicoUI error: position() expected to find \"refresh\" parameter.");
				};

				ch.positioner(conf.position);
				return that.public;   			
				break;
		
			case "undefined":
				return conf.position;
			    break;
		};
		
	};
	

	 
 	that.public = {};
	
	return that;
};
