
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
		conf.content: "selector css"
		conf.content: "texto plano"
		conf.content: "<tag>texto plano</tag>"
		
		conf.ajax
		conf.ajax:true (levanta href o action)
		conf.ajax: "http://www..."
		*/

		loadContent: function(conf) {
			
			if ( (conf.ajax && conf.content) ) { alert('UI: "Ajax" and "Content" can\'t live together.'); return; };				

			// selector css, html or string content
			if ( !conf.ajax ) return ( $(conf.content).length > 0  ) ? $(conf.content).clone() : conf.content; 
			
			// ajax content
			if ( conf.ajax === true ) {
				
				// set the ajaxUrl and params
				conf.ajaxUrl = conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action'); //Se pisaba esta variable porque tiene el mismo class pero content.data diferente. Ejmplo del Type param con contenido distintos pero la misma class (va a traer la del primero)					
				conf.ajaxParams = 'x=x';//TODO refactor con el header de ajax
				
				// If trigger is a button of form
				if(conf.$trigger.attr('type') == 'submit'){
					conf.ajaxType = conf.$trigger.parents('form').attr('method') || 'POST';
					var serialized = conf.$trigger.parents('form').serialize();
					conf.ajaxParams = conf.ajaxParams + ((serialized != '') ? '&' + serialized : '');
				};
				
				var result = ui.get({method:"content", conf:conf});
				return result || '<p>Error on ajax call</p>';

			} else if ( conf.ajax.match(/(?:(?:(https?|file):\/\/)([^\/]+)(\/(?:[^\s])+)?)|(\/(?:[^\s])+)/g) ) { // relatives and absolutes url regex
				
				//.match(/^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([\w]+)(.[\w]+){1,2}$/)
				conf.ajaxUrl = conf.ajax;				
				var result = ui.get({method:"content", conf:conf});
				return result || '<p>Error on ajax call</p>';
				
			}else{				
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
