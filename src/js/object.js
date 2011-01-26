/**
 *  @class Object. Represent the abstract class of all ui objects.
 *  @return {object} Object.
 */	

ui.object = function(){
	
	//constructor
	
	var that = this;
	
	return {
				
		prevent: function(event){
			if (event) {
			    event.preventDefault();
				event.stopPropagation();
			}
		},
		
		/*
		conf.content
		conf.content: "selector css" || "<tag>texto plano</tag>" || "texto plano"	
		conf.ajax
		conf.ajax:true (levanta href o action) || "http://www..." || "../test/test.html"
		*/
		loadContent: function(conf) {
			// Properties validation
			//if( conf.ajax && (conf.content || conf.msg) ) { alert('UI: "Ajax" and "Content" can\'t live together.'); return; };

			if( conf.ajax === true){
				
				// Load URL from href or form action
				conf.ajaxUrl = conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action');
				
				// Ajax parameters
				conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax
				
				// If trigger is a form button...
				if(conf.$trigger.attr('type') == 'submit'){
					conf.ajaxType = conf.$trigger.parents('form').attr('method') || 'GET';
					var serialized = conf.$trigger.parents('form').serialize();
					conf.ajaxParams = conf.ajaxParams + ((serialized != '') ? '&' + serialized : '');
				};

				// Returns ajax results
				conf.$htmlContent.html('<div class="loading"></div>');
				return ui.get({method:"content", conf:conf});
				
			}else if( conf.ajax || (conf.msg && conf.msg.match(/(?:(?:(https?|file):\/\/)([^\/]+)(\/(?:[^\s])+)?)|(\/(?:[^\s])+)/g)) ){
				// Set url
				conf.ajaxUrl = conf.ajax || conf.msg;

				// Ajax parameters
				conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax

				// Returns ajax results
				conf.$htmlContent.html('<div class="loading"></div>');
				return ui.get({method:"content", conf:conf});
				
			}else{
				
				var content = conf.content || conf.msg;
				return ($(content).length > 0) ? $(content).clone().show() : content;
				
			};

		},
		
		callbacks: function(conf, when){
			if(conf.callbacks && conf.callbacks[when]) conf.callbacks[when](conf.publish);
		},
        
        publish: { 
            // The publish Object will be returned in all instanced component, all public methods and properties goes here.
        }

	};
}