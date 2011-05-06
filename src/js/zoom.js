/**
 *	Zoom
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ch.zoom = function(conf) {


/**
 *	Validation
 */

	if(
		(this.element.nodeName != "A") ||						// Exists an anchor
		(this.element.href.length == 0) ||						// Anchor have an "href" property
		(this.$element.children()[0].nodeName != "IMG") ||		// Exists an image inside anchor
		(this.$element.children().eq(0).hasOwnProperty("src"))	// Image have a "src" property
	) {
		alert("Chico-UI: Expected to find an image inside an anchor.");
	};
    
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
	var $lens = $("<div>").addClass("ch-lens ch-hide");
	
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
		var x = event.pageX;
		var y = event.pageY;
		
		var context = that.$element.children();
		var contextOffset = context.offset();
		var zoomedImage = that.$content.children();
		
		zoomedImage.css({
			"left": -(x - contextOffset.left) * (zoomedImage.outerWidth() / context.outerWidth() - 1),
			"top": -(y - contextOffset.top) * (zoomedImage.outerHeight() / context.outerHeight() - 1)
		});

		// Shape
		$seeker.css({
			"left": x - contextOffset.left - ($seeker.width() / 2),
			"top": y - contextOffset.top - ($seeker.height() / 2)
		});
	};
	
/**
 *  Protected Members
 */
	
	that.$trigger = that.$element;
	
	that.show = function(event){
		that.prevent(event);
		
		// Floats show
		that.parent.show();
		
		// Magnifying glass
		$lens.fadeIn();
		
		// Seeker
		$seeker.removeClass("ch-hide");
		
		return that;
	};
	
	that.hide = function(event){
		that.prevent(event);
		
		// Seeker
		$seeker.addClass("ch-hide");
		
		// Magnifying glass
		$lens.fadeOut();
		
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
	
	that.$element
		.addClass("ch-zoom-trigger")
		
		// Magnifying glass
		.append( $lens )
		
		// Seeker
		.append( $seeker )
		
		// Show
		.bind("mouseover", that.show)
		
		// Hide
		.bind("mouseleave", that.hide)
		
		// Move
		.bind("mousemove", function(event){ move(event); })
		
		// Enlarge
		.bind("click", function(event){ that.enlarge(event); });
	
	// Preload zoomed image
	ch.preload(that.element.href);
	
	return that;
};
