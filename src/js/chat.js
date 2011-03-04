
/**
 *	Chat Component
 *  $("#chat").chat({
 *      ruleGroupName: "",
 *      style: ["block"],
 *      template: [1],
 *      environment: "1"|"2"|"3"
 *  });
 */

ui.chat = function(conf) {
    
   	var that = ui.object(); // Inheritance

    var getDomain = function(n) {
        switch (n) {
            case "1": return "mercadolidesa.com.ar"; break;
            case "2": return "mercadolistage.com.ar"; break;
            case "3": return "mercadolibre.com.ar"; break;
        }
    }

    if (conf.msg) {
        conf.ruleGroupName = conf.msg;
    }

    that.load = function() {
        loadChatGZ(conf.ruleGroupName, conf.element.id, conf.style||"block", conf.template||"1",conf.environment||"3"); 
    }

   	ui.get({
   	    method: "component",
   	    name: "chat",
   	    script: "https://www."+getDomain(conf.environment)+"/org-img/jsapi/chat/chatRBIScript.js",
   	    callback: function() {
       	    that.load(); 
        }
   	});

    that.publish = {
    	uid: conf.uid,
		element: conf.element,
        type: conf.type
    }
    
    return that.publish;

}
