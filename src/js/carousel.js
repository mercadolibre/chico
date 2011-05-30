
/**
 * Carousel is a UI-Component.
 * @name Carousel
 * @class Carousel
 * @augments ch.Controllers
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */
 
ch.carousel = function(conf){
	
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Carousel
     */	
	var that = this;
	
	that.$element.addClass('ch-carousel');
	
	if ( conf.height ) that.$element.height( conf.height );
	if ( conf.width ) that.$element.width( conf.width );
	if ( conf.hasOwnProperty("arrows") ) conf.arrows = conf.arrows; else conf.arrows = true;
	
	// UL configuration
	that.$content = that.$element.find('.carousel')	 // TODO: wrappear el contenido para que los botones se posicionen con respecto a su contenedor
		.addClass('ch-carousel-content')
		.wrap($('<div>').addClass('ch-mask'))//gracias al que esta abajo puedo leer el $mask.width()
	
	conf = ch.clon(conf);
	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.sliders.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */
 
    /**
     * Page size.
     * @private
     * @name page
     * @type {Number}
     * @memberOf ch.Carousel
     */ 
	var page = 1;
	
	// UL Width calculator
	var htmlElementMargin = parseInt( that.$content.children().css("marginLeft") ) * 2;

	var extraWidth = (ch.utils.html.hasClass("ie6")) ? that.$content.children().outerWidth() : 0;
	var htmlContentWidth = that.$content.children().size() * (that.$content.children().outerWidth() + htmlElementMargin) + extraWidth;
	that.$content.css('width', htmlContentWidth);
	
	// Mask Object and draw function	
	var $mask = that.$element.find('.ch-mask');
	var steps, totalPages, moveTo, margin;
	
    /**
     * Calculate size of the carousel's mask.
     * @private
     * @name calculateMask
     * @function
     * @return {That Object}
     * @memberOf ch.Carousel
     */ 
	var calculateMask = function(){
		// Steps = (width - marginMask / elementWidth + elementMargin) 70 = total margin (see css)
		steps = ~~( (that.$element.outerWidth() - 70) / (that.$content.children().outerWidth() + htmlElementMargin));
		steps = (steps == 0) ? 1 : steps;
		totalPages = Math.ceil(that.$content.children().size() / steps);
		
		// Move to... (steps in pixels)
		moveTo = (that.$content.children().outerWidth() + htmlElementMargin) * steps;
		// Mask configuration
		margin = ($mask.width()-moveTo) / 2;
		$mask.width( moveTo ).height( conf.height || that.$content.children().outerHeight() );
		
		return that;
	};

	calculateMask();

    /**
     * Create pager functionlity whitin a carousel instance.
     * @private
     * @name makePager
     * @function
     * @return {Pager Object}
     * @memberOf ch.Carousel
     */ 
 	var makePager = function(){
		that.$element.find(".ch-pager").remove();
			
		var pager = $("<ul class=\"ch-pager\">");
		var thumbs = [];
		
		// Create each mini thumb
		for(var i = 1, j = totalPages + 1; i < j; i += 1){
			if(i == page) thumbs.push("<li class=\"ch-pager-on\">"); else thumbs.push("<li>");
			thumbs.push(i);
			thumbs.push("</li>");
		};
		pager.append( thumbs.join("") );
		
		// Create pager
		that.$element.append( pager );
		
		// Position
		var contextWidth = pager.parent().width();
		var pagerWidth = pager.outerWidth();
		
		pager.css('left', (contextWidth - pagerWidth) / 2);

		if ( ch.utils.html.hasClass("ie6") ) { pager.css('top', that.$element.height() + 15) };

		// Children functionality
		pager.children().each(function(i, e){ //TODO: unificar con el for de arriba (pager)
			$(e).bind("click", function(){
				that.select(i+1);
			});
		});

		return pager;
	};
	
	var resize = false;
	

/**
 *  Protected Members
 */

    /**
     * Internal class that handles buttons behavior.
     * @private
     * @name buttons
     * @memberOf ch.Carousel
     */ 
 	that.buttons = {
		prev: {
			//TODO usar positioner cuando esten todos los casos de posicionamiento
			$element: $('<p class="ch-prev"><span>Previous</span></p>').bind('click', function(){ that.move("prev", 1) }),
			on: function(){ that.buttons.prev.$element.addClass("ch-prev-on") },
			off: function(){ that.buttons.prev.$element.removeClass("ch-prev-on") }
		},
		next: {
			//TODO usar positioner cuando esten todos los casos de posicionamiento
			$element: $('<p class="ch-next"><span>Next</span></p>').bind('click', function(){ that.move("next", 1) }),
			on: function(){ that.buttons.next.$element.addClass("ch-next-on") },
			off: function(){ that.buttons.next.$element.removeClass("ch-next-on") }
		},
		position: function(){
			// 50 = button height + "margin"; 10 = bottom position if pager exists },
			var newTop = {'top': (that.$element.outerHeight() - 50 + (( conf.pager ) ? 10 : 0)) / 2};
				
			that.buttons.prev.$element.css(newTop);
			that.buttons.next.$element.css(newTop);
		}
	};
	
	that.move = function(direction, distance){
		var movement;
		
		switch(direction){
			case "prev":
				// Validation
				if(that.active || (page - distance) <= 0) return;
				
				// Next move
				page -= distance;
				
				// Css object
				movement = that.$content.position().left + (moveTo * distance);
				
				// Buttons behavior
				if ( conf.arrows ) {
					if(page == 1) that.buttons.prev.off();
					that.buttons.next.on();
				};
			break;
			case "next":
				// Validation
				if(that.active || (page + distance) > totalPages) return;
				
				// Next move
				page += distance;
				
				// Css object
				movement = that.$content.position().left - (moveTo * distance);
				
				// Buttons behavior
				if ( conf.arrows ) {
					if(page == totalPages) that.buttons.next.off();
					that.buttons.prev.on();
				};
			break;
		};
				
		// Status moving
		that.active = true;
		
		// Function executed after movement
		var afterMove = function(){
			that.active = false;
			
			// Pager behavior
			if (conf.pager) {								
				that.pager.children().removeClass("ch-pager-on");
				that.pager.children(":nth-child("+page+")").addClass("ch-pager-on");
			};

			// Callbacks
			that.callbacks("onMove");
		};
		
		// Have CSS3 Transitions feature?
		if (ch.features.transition) {
			
			// Css movement
			that.$content.css({ left: movement });
			
			// Callback
			afterMove();
			
		// Ok, let JQuery do the magic...
		} else {
			
			that.$content.animate({ left: movement }, afterMove);
		};
		
		return that;
	};
	
	
	that.select = function(pageToGo){
		//var itemPage = ~~(item / steps) + 1; // Page of "item"
		
		// Move right
		if(pageToGo > page){
			that.move("next", pageToGo - page);
		// Move left
		}else if(pageToGo < page){
	        that.move("prev", page - pageToGo);
		};
		
		if (conf.pager) {
			that.pager.children().removeClass("ch-pager-on");
			that.pager.children(":nth-child("+page+")").addClass("ch-pager-on");
		};
			
	    return that;
	};
	
	that.redraw = function(){
		if (steps > 1){ that.select(1); } //reset the position
		
		calculateMask();
		
		that.buttons.position();
		
		if (conf.pager && totalPages > 1) that.pager = makePager();
	};

/**
 *  Public Members
 */

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Carousel
     */ 
   	that["public"].uid = that.uid;
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Carousel
     */
	that["public"].element = that.element;
   
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Carousel
     */
	that["public"].type = that.type;

    /**
     * Get the amount of steps.
     * @public
     * @name getSteps
     * @return {Number}
     * @memberOf ch.Carousel
     */
	that["public"].getSteps = function() { return steps; };
    
    /**
     * Get the current page.
     * @public
     * @name getPage
     * @return {Number}
     * @memberOf ch.Carousel
     */
    that["public"].getPage = function() { return page; };
    
    /**
     * Moves the carousel to the defined page.
     * @public
     * @name moveTo
     * @return {Chico-UI Object}
     * @memberOf ch.Carousel
     */
    that["public"].moveTo = function(page) {
    	that.select(page);

    	return that["public"];
    };
    
    /**
     * Moves to the next page.
     * @public
     * @name next
     * @return {Chico-UI Object}
     * @memberOf ch.Carousel
     */
    that["public"].next = function(){
    	that.move("next", 1);

    	return that["public"];
    };

    /**
     * Moves to the previous page.
     * @public
     * @name prev
     * @return {Chico-UI Object}
     * @memberOf ch.Carousel
     */
	that["public"].prev = function(){
		that.move("prev", 1);

		return that["public"];
	};

    /**
     * Re-calculate positioning, sizing, paging, and re-draw.
     * @public
     * @name redraw
     * @return {Chico-UI Object}
     * @memberOf ch.Carousel
     */	
	that["public"].redraw = function(){
		that.redraw();
		
		return that["public"];
	};


/**
 *  Default event delegation
 */
 	
	// UL width configuration
	that.$content.css('width', htmlContentWidth);

	// Create pager if it was configured
	if (conf.pager){
		that.$element.addClass("ch-pager-bottom");
		that.pager = makePager();	
	};
	
	// Buttons behavior
	if ( conf.arrows ){
		that.$element.prepend( that.buttons.prev.$element ).append( that.buttons.next.$element ); // Append prev and next buttons
		if (htmlContentWidth > $mask.width()) that.buttons.next.on(); // Activate Next button if items amount is over carousel size
		that.buttons.position();
		
		ch.utils.avoidTextSelection(that.buttons.prev.$element,that.buttons.next.$element);
	};
	
	// Elastic behavior    
    if ( !conf.hasOwnProperty("width") ){
		
	    ch.utils.window.bind("resize", function() {
			resize = true;
		});
		
		setInterval(function() {
		    if( !resize ) return;
			resize = false;
			that.redraw();
		}, 250);
		
	};
 
	return that;
}
