
/**
*	Creates a new Object.
*  Represent the abstract class of all ui objects.
*	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
*	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
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
		
		loadContent: function(conf){
			if(typeof conf.content !== 'object' || !conf.content.type ){
				alert('UI: "content" attribute error.'); return;
			}else{
				switch(conf.content.type.toLowerCase()){
					case 'ajax': // data = url
						var result = ui.get('content', conf);
						return result || '<p>Error on ajax call</p>';
					break;
					case 'dom': // data = class, id, element
						return $(conf.content.data).html();
					break;
					case 'param': // html code
						return conf.content.data;
					break;
				};
				
			};
		},			
		
		callbacks: function(conf, when, handler){
			if(conf.callbacks && conf.callbacks[when]) conf.callbacks[when]();
		}
		
	};
}
