
/**
 * Interface is a utility that resolve creating interfaces problem for all UI-Objects.
 * @abstract
 * @name Interface
 * @class Interface
 * @memberOf ch
 * @param {String} name Interface's name.
 * @param {Function} class Class to inherit from.
 * @param {Function} [process] Optional function to pre-process configuration, recieves a 'conf' param and must return the configration object.
 * @example
 * // Create an URL interface type based on String component.
 * ch.interface( "url", "string" );
 * @example
 * // Create an Accordion interface type based on Menu component.
 * createInterface( "accordion", "menu" ); 
 * @example
 * // And the coolest one...
 * // Create an Transition interface type based on his Modal component, with some conf manipulations:
 * createInterface( "transition", "modal" , function(conf) {
 *     conf.closeButton = false;
 *     conf.msg = conf.msg || conf.content || "Please wait...";
 *     conf.content = $("&lt;div&gt;").addClass("loading").after( $("&lt;p&gt;").html(conf.msg) );
 *     return conf;
 * });
 */
ch.interface = function( name, class, process ) {

    // Create the component in Chico-UI namespace
    ch[name] = function(conf) {

        // Invoke pre-proccess if is defined,
        // or grab the raw conf argument,
        // or just create an empty object.
        conf = (process) ? process(conf) : conf || {};

        // Some interfaces need a data value,
        // others simply need to be 'true'.
        conf[name] = conf.value || true;
        
        // Here we recieve messages,
        // or create an empty object.
    	conf.messages = conf.messages || {};

        // If the interface recieve a 'msg' argument,
        // store it in the message map.
        if ( ch.utils.hasOwn(conf, "msg") ) { 
    		conf.messages[name] = conf.msg;
        	conf.msg = null;
        	delete conf.msg;
        };
        
        // Here is where the magic happen,
        // invoke the class with the new conf,
        // and return the instance to the namespace.
        return ch[class].call(this, conf);
        
    };
    
    // Almost done, now we need expose the new component,
    // let's ask the factory to do it for us.
    ch.factory({ component: name });
};