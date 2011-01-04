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
	var showTimer = function(e){ st = setTimeout(function(){ show(e) }, showTime)};
	var hideTimer = function(e){ ht = setTimeout(function(){ hide(e) }, hideTime)};
	var clearTimers = function(){ clearTimeout(st); clearTimeout(ht); };

	// Global configuration
	conf.$trigger = $(conf.element);
	conf.cone = true;
	conf.classes = 'box';
	conf.visible = false;	
	conf.position = {
   		context: conf.$trigger,
        offset: "0 10",
		points: "lt lb"
    }
    conf.publish = that.publish;

	var clearTimers = function() {
		clearTimeout(st);
		clearTimeout(ht);
	};

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
        
        // return publish object
        return conf.publish;    
    }

    var hide = function(event) {

        that.hide(event, conf);
        
        // return publish object
        return conf.publish;
    }
    
    var position = function(event) {
		ui.positioner(conf.position);
		
		return conf.publish;
	}

	// Click
	if(conf.event === 'click') {
		// Local configuration
		conf.closeButton = true;

		// Trigger events
		conf.$trigger
			.css('cursor', 'pointer')
			.bind('click',show);

	// Hover
	} else {
		// Trigger events
		conf.$trigger
			.css('cursor', 'default')
			.bind('mouseover', showTimer)
			.bind('mouseout', hideTimer);
	};

    // create the publish object to be returned

        conf.publish.uid = conf.id,
        conf.publish.element = conf.element,
        conf.publish.type = "layer",
        conf.publish.content = (conf.content) ? conf.content : conf.ajax,
        conf.publish.show = function(event){ return show(event, conf) },
        conf.publish.hide = function(event){ return hide(event, conf) },
        conf.publish.position = function(event){return position(event) }

	return conf.publish;
    
};
