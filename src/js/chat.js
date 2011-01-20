
/**
 *	Chat Component
 *	@author Javier
 *	@return empty object
 */

ui.chat = function(conf) {
    
   	var that = ui.object(); // Inheritance

    if (conf.msg) conf.ruleGroupName = conf.msg;

    that.load = function() {
        loadChat(conf.ruleGroupName, conf.element.id, conf.style||"block", conf.template||"1"); 
    }

   	ui.get({
   	    method: "component",
   	    name: "chat",
   	    script: "http://www.mercadolibre.com.ar/org-img/jsapi/chat/chatRBIScript.js",
   	    callback: function() {
       	    that.load(); 
        }
   	});

    that.publish = {
    	uid: conf.id,
		element: conf.element,
        type: "chat",
        load: function() { that.load(); },
    }
    
    return that.publish;

}