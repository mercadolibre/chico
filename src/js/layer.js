/**
 *	Context Layer
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.layer = function(conf){
	var that = ui.floats(); // Inheritance

	// Global configuration
	conf.$trigger = $(conf.element);
	conf.align = 'down';
	conf.cone = true;
	conf.classes = 'box';
	conf.wrappeable = true;
	conf.visible = false;
    conf.publish = that.publish;


    var show = function(event) {
        
        that.show(event, conf);				

        if (conf.event === "click") {
            
            $('.uiLayer').bind('click', function(event){ event.stopPropagation() });
								
            // Document events
            $(document).bind('click', function(event){
                that.hide(event, conf);
                $(document).unbind('click');
            });
        }

        // return publish object
        return conf.publish;    
    }

    var hide = function(event) {
        
        that.hide(event, conf);
        
        // return publish object
        return conf.publish;
    }

	// Click
	if(conf.event === 'click'){
		// Local configuration
		conf.closeButton = true;

		// Trigger events
		conf.$trigger
			.css('cursor', 'pointer')
			.bind('click',show);

	// Hover
	}else{
		// Trigger events
		conf.$trigger
			.css('cursor', 'default')
			.bind('mouseover', show)
			.bind('mouseout', hide);
	};

    // create the publish object to be returned

        conf.publish.uid = conf.id,
        conf.publish.element = conf.element,
        conf.publish.type = "ui.layer",
        conf.publish.content = conf.content.data,
        conf.publish.show = function(event){ return show(event, conf) },
        conf.publish.hide = function(event){ return hide(event, conf) }

	return conf.publish;
    
};
