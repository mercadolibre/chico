
/**
 *	Chat Component
 *	@author Javier
 *	@return empty object
 */

ui.chat = function(conf) {
    
   	var that = ui.object(); // Inheritance
   	
   	ui.get("internal","http://www.mercadolibre.com.ar/org-img/jsapi/chat/chatRBIScript.js",function(){
   	    that.load(); 
    });
    
    that.load = function() {
        loadChat(conf.ruleGroupName, conf.id, conf.style, conf.template); 
    }
    
    that.publish = {
    	uid: conf.id,
		element: conf.element,
        type: "chat",
        load: function() { that.load(); }
    }
    
    return that.publish;

}