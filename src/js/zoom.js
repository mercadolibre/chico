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
	
	var main = {};
		main.img = that.$element.children();
		main.w = main.img.width();
		main.h = main.img.height();
	
	var zoomed = {};
		zoomed.img = conf.content;
	
	// Magnifying glass
	//var $lens = $("<div>").addClass("ch-lens ch-hide");
	
	// Seeker
	var seeker = {};
		// TODO: Calc relativity like in that.size (en lugar de la division por 3)
		seeker.w = conf.width / 3;
		seeker.h = conf.height / 3;
		seeker.shape = $("<div>")
			.addClass("ch-seeker ch-hide")
			.bind("mousemove", function(event){ move(event); })
			.css({width: seeker.w, height: seeker.h});
	
	var move = function(event){
		var offset = main.img.offset();
		
		var x = event.pageX - offset.left;
		var y = event.pageY - offset.top;
		
		// Zoomed image
		zoomed.img.css({
			"left": -( ((zoomed.w * x) / main.w) - (conf.width / 2) ),
			"top": -( ((zoomed.h * y) / main.h) - (conf.height / 2) )
		});
		
		// Seeker shape
		seeker.shape.css({
			"left": x - (seeker.w / 2),
			"top": y - (seeker.h / 2)
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
		//$lens.fadeIn();
		
		// Seeker
		seeker.shape.removeClass("ch-hide");
		
		return that;
	};
	
	that.hide = function(event){
		that.prevent(event);
		
		// Seeker
		seeker.shape.addClass("ch-hide");
		
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
		
		// Size of zoomed image
		zoomed.w = zoomed.img.width();
		zoomed.h = zoomed.img.height();
		zoomed.ref_x = (zoomed.w / main.w - 1);
		zoomed.ref_y = (zoomed.h / main.h - 1);
		
		var at = attr.substr(0,1);
		
		// Configuration
		that.conf[attr] = data;
		
		// Container
		that.$container[attr](data);
		
		// Seeker
		var rel = (main[at] * data) / zoomed[at];
		seeker[at] = rel;
		seeker.shape[attr](rel);

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
	
	// TODO: El setTimeout soluciona problemas en el viewer
	setTimeout( function(){
		that.$element
			.addClass("ch-zoom-trigger")
			
			// Magnifying glass
			//.append( $lens )
			
			// Seeker
			.append( seeker.shape )
			
			// Size (same as image)
			.css({"width": main.w, "height": main.h})
			
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
	if(ch.hasOwnProperty("preload")) ch.preload(that.element.href);
	
	return that;
};
