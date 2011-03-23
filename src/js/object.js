/**
 *  @class Object. Represent the abstract class of all ui objects.
 *  @return {object} Object.
 */	

ui.object = function(){
	
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
		
	that.loadContent = function() {
		// TODO: Properties validation
		//if( self.ajax && (self.content || self.msg) ) { alert('UI: "Ajax" and "Content" can\'t live together.'); return; };
		
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

			ui.get({method:"content", that:that});
			
			return '<div class="loading"></div>';
			
		} else if ( conf.ajax || (conf.msg && conf.msg.match(/(?:(?:(https?|file):\/\/)([^\/]+)(\/(?:[^\s])+)?)|(\/(?:[^\s])+)/g)) ){
			// Set url
			conf.ajaxUrl = conf.ajax || conf.msg;

			// Ajax parameters
			conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax

			// Returns ajax results

			ui.get({method:"content", that:that});
			return '<div class="loading"></div>';
			
		} else {
			var content = conf.content || conf.msg;
			return ($(content).length > 0) ? $(content).detach().clone().show() : content ;
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
			
				ui.positioner(conf.position);
				return that.public;
				break;
		
			case "string":
				if(o != "refresh"){
					alert("ChicoUI error: position() expected to find \"refresh\" parameter.");
				};

				ui.positioner(conf.position);
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
