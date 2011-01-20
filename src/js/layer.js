/**
 *	Context Layer
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.layer = function(conf) {
    
	var that = ui.floats(); // Inheritance

    var showTime = conf.showTime || 300;
    var hideTime = conf.hideTime || 300;

	var st, ht; // showTimer and hideTimer
	var showTimer = function(event){ st = setTimeout(function(){ show(event) }, showTime) };
	var hideTimer = function(event){ ht = setTimeout(function(){ hide(event) }, hideTime) };
	var clearTimers = function(){ clearTimeout(st); clearTimeout(ht); };

	// Global configuration
	conf.$trigger = $(conf.element);
	conf.cone = true;
	conf.classes = 'box';
	conf.visible = false;	
	conf.position = {
   		context: conf.$trigger,
        offset: conf.offset || "0 10",
		points: conf.points || "lt lb"
    }
    conf.publish = that.publish;

    var show = function(event) {
        that.show(event, conf);				

        if (conf.event === "click") {
            
            $('.ch-layer').bind('click', function(event){ event.stopPropagation() });
	
            // Document events
            $(document).bind('click', function(event) {
                that.hide(event, conf);
                $(document).unbind('click');
            });
        }
        
        return conf.publish; // Returns publish object
    }

    var hide = function(event) {
        that.hide(event, conf);
        return conf.publish; // Returns publish object
    }

	// Click
	if(conf.event === 'click') {
		// Local configuration
		conf.closeButton = true;

		// Trigger events
		conf.$trigger
			.css('cursor', 'pointer')
			.bind('click', show);

	// Hover
	} else {
		// Trigger events
		conf.$trigger
			.css('cursor', 'default')
			.bind('mouseover', showTimer)
			.bind('mouseout', hideTimer);
	};

    // Create the publish object to be returned
    conf.publish.uid = conf.id;
    conf.publish.element = conf.element;
    conf.publish.type = "layer";
    conf.publish.content = (conf.content) ? conf.content : conf.ajax;
    conf.publish.show = function(){ return show($.Event()) };
    conf.publish.hide = function(){ return hide($.Event()) };
    conf.publish.position = function(o){ return that.position(o, conf) };

    // Fix: change layout problem
    ui.utils.body.bind(ui.events.CHANGE_LAYOUT, function(){ that.position("refresh", conf) });

	return conf.publish;

};
