/**
 *	Zoom
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ch.zoom = function(conf) {

/**
 *	Constructor
 */

	var that = this;
	
	conf = ch.clon(conf);
	
	// Link source as zoomed image
	conf.content = $("<img>").attr("src", that.element.href);
	
	conf.position = {};
	conf.position.context = conf.context || that.$element;
	conf.position.offset = conf.offset || "20 0";
	conf.position.points = conf.points || "lt rt";
	conf.position.hold = true;
	
	conf.width = conf.width || 300;
	conf.height = conf.height || 300;
	
	conf.fx = false;

	that.conf = conf;

/**
 *	Inheritance
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);
    
/**
 *  Private Members
 */
	
	// Magnifying glass
	//var $lens = $("<div>").addClass("ch-lens ch-hide");
	
	// Seeker
	var $seeker = $("<div>")
		.addClass("ch-seeker ch-hide")
		.bind("mousemove", function(event){ move(event); })
		// TODO: Make a scale reference calc for seeker size
		.css({
			width: conf.width / 3, //(conf.content.width() / that.$element.children().width()),
			height: conf.height / 3 //(conf.content.height() / that.$element.children().height())
		});
	
	var move = function(event){
		var offset = that.$child.offset();
		
		var x = event.pageX - offset.left;
		var y = event.pageY - offset.top;
		
		// Zoomed image
		conf.content.css({
			"left": -x * (conf.content.outerWidth() / that.$child.outerWidth() - 1),
			"top": -y * (conf.content.outerHeight() / that.$child.outerHeight() - 1)
		});
		
		// Seeker shape
		$seeker.css({
			"left": x - ($seeker.width() / 2),
			"top": y - ($seeker.height() / 2)
		});
	};
	
/**
 *  Protected Members
 */
	
	that.$trigger = that.$element;
	
	that.$child = that.$trigger.children();
	
	that.show = function(event){
		that.prevent(event);
		
		// Floats show
		that.parent.show();
		
		// Magnifying glass
		//$lens.fadeIn();
		
		// Seeker
		$seeker.removeClass("ch-hide");
		
		return that;
	};
	
	that.hide = function(event){
		that.prevent(event);
		
		// Seeker
		$seeker.addClass("ch-hide");
		
		// Magnifying glass
		//$lens.fadeOut();
		
		// Floats hide
		that.parent.hide();
		
		return that;
	};
	
	that.enlarge = function(event){
		that.prevent(event);
		
		// Open pop-up
	};
	
	that.size = function(attr, data) {
		if (!data) return conf[attr]; // Getter
		
		// Configuration
		that.conf[attr] = data;
		
		// Container
		that.$container[attr](data);
		
		// Seeker
		$seeker[attr](data / 3);

		return that["public"];
	};

/**
 *  Public Members
 */
   	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].content = that.content;
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
	
	that["public"].position = that.position;
	
	that["public"].width = function(data){ that.size("width", data); };
	that["public"].height = function(data){ that.size("height", data) };

	
/**
 *  Default event delegation
 */
setTimeout( function(){
	that.$element
		.addClass("ch-zoom-trigger")
		
		// Magnifying glass
		//.append( $lens )
		
		// Seeker
		.append( $seeker )
		
		// Size
		.css({
			"width": that.$child.width(),
			"height": that.$child.height()
		})
		
		// Show
		.bind("mouseover", that.show)
		
		// Hide
		.bind("mouseleave", that.hide)
		
		// Move
		.bind("mousemove", function(event){ move(event); })
		
		// Enlarge
		.bind("click", function(event){ that.enlarge(event); });
},50);	
	// Preload zoomed image
	ch.preload(that.element.href);
	
	return that;
};
