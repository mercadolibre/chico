
/**
 *	Chat Component
 *  $("#chat").chat({
 *      ruleGroupName: "",
 *      style: ["block"],
 *      template: [1],
 *      url: [http://www.mercadolibre.com.ar/org-img/jsapi/chat/chatRBIScript.js]
 *  });
 */

ui.chat = function(conf) {
    
   	var that = ui.object(); // Inheritance

    if (conf.msg) {
        conf.ruleGroupName = conf.msg;
    }

    that.load = function() {
//      console.log(conf.ruleGroupName, conf.element.id, conf.style||"block", conf.template||"1");
        loadChat(conf.ruleGroupName, conf.element.id, conf.style||"block", conf.template||"1"); 
    }

   	ui.get({
   	    method: "component",
   	    name: "chat",
   	    script: conf.url||"http://www.mercadolibre.com.ar/org-img/jsapi/chat/chatRBIScript.js",
   	    callback: function() {
       	    that.load(); 
        }
   	});

    that.publish = {
    	uid: conf.id,
		element: conf.element,
        type: "chat"
    }
    
    return that.publish;

}