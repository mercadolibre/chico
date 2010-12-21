
/**
*	Creates a new Object.
*  Represent the abstract class of all ui objects.
*/	
ui.object = function(){
	
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
			if (conf.ajax && conf.content) { alert('UI: "Ajax" and "Content" can\'t live together.'); return; };

			// Returns css selector, html code or plain text as content
			if (!conf.ajax) return ($(conf.content).length > 0) ? $(conf.content).clone().show() : conf.content;

			// Return Ajax content from ajax:true
			if (conf.ajax === true) {
				
				// Load URL from href or form action
				conf.ajaxUrl = conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action');
				
				// Ajax parameters
				conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax
				
				// If trigger is a form button...
				if(conf.$trigger.attr('type') == 'submit'){
					conf.ajaxType = conf.$trigger.parents('form').attr('method') || 'POST';
					var serialized = conf.$trigger.parents('form').serialize();
					conf.ajaxParams = conf.ajaxParams + ((serialized != '') ? '&' + serialized : '');
				};

				// Returns ajax results
				return ui.get({method:"content", conf:conf}) || '<p>Error on ajax call</p>';

			// Returns Ajax content from ajax:URL
			} else if ( conf.ajax.match(/(?:(?:(https?|file):\/\/)([^\/]+)(\/(?:[^\s])+)?)|(\/(?:[^\s])+)/g) ) { // Relatives and absolutes url regex
				// Set url
				conf.ajaxUrl = conf.ajax;

				// Ajax parameters
				conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax

				// Returns ajax results
				return ui.get({method:"content", conf:conf});
			
			// Invalid Ajax parameter
			} else {
				alert('UI: "Ajax" attribute error.'); return;				
			};

		},
		
		callbacks: function(conf, when){
			if(conf.callbacks && conf.callbacks[when]) conf.callbacks[when](conf);
		},
        
        publish: { 
            // The publish Object will be returned in all instanced component, all public methods and properties goes here.
        }

	};
}