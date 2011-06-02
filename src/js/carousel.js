
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
	
	conf = ch.clon(conf);

	conf.pagination = conf.pagination || false;
	if( ch.utils.hasOwn(conf, "rolling") ) { conf.rolling = conf.rolling; } else { conf.rolling = true; };
	if( ch.utils.hasOwn(conf, "arrows") ) { conf.arrows = conf.arrows; } else { conf.arrows = true; };
	if( ch.utils.hasOwn(conf, "fx") ) { conf.fx = conf.fx; } else { conf.fx = true; };
	
	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

	var _createLayout = function(){

		// Create carousel's content
		that.$content = $("<div>")
			.addClass("ch-carousel-content")
			.css("width", (that.itemSize.width * that.items.size()) )
			.append( that.$collection );

		// Create carousel's mask
		that.$container = $("<div>")
			.addClass("ch-carousel-container")
			.append( that.$content )
			.appendTo( that.$element );

		// Visual configuration
		if ( ch.utils.hasOwn(conf, "width") ) { that.$element.css("width", conf.width); };
		if ( ch.utils.hasOwn(conf, "height") ) { that.$element.css("height", conf.height); };
		if ( !conf.fx && ch.features.transition ) { that.$content.addClass("ch-carousel-nofx"); };

		return;

	},

	_createArrows = function(){
		that.prevArrow = $("<p>")
			.addClass("ch-prev-arrow")
			.append("<span>Previous</span>")
			.bind("click", that.prev	);
			
		that.nextArrow = $("<p>")
			.addClass("ch-next-arrow")
			.append("<span>Next</span>")
			.bind("click", that.next);

		if ( !conf.rolling ) { that.prevArrow.addClass("ch-hide") };

		that.$element.prepend(that.prevArrow).append(that.nextArrow);
		
		var arrowsPosition = (that.$element.outerHeight() - that.nextArrow.outerHeight()) / 2;
		$(that.prevArrow).css("top", arrowsPosition);
		$(that.nextArrow).css("top", arrowsPosition);

		return;
	},

	_toggleArrows = function(page){

		if (page > 1 && page < that.pages ){
			that.prevArrow.removeClass("ch-hide");
			that.nextArrow.removeClass("ch-hide");
		} else {
			if (page == 1) { that.prevArrow.addClass("ch-hide"); that.nextArrow.removeClass("ch-hide"); };
			if (page == that.pages) { that.prevArrow.removeClass("ch-hide"); that.nextArrow.addClass("ch-hide"); };
		};

		return;
	},

	_createPagination = function(){

		that.$pagination = $("<ul>").addClass("ch-carousel-pages");

		// Create each mini thumb
		for (var i = 1, j = that.pages; i <= j; i += 1){
			var thumb = $("<li>").html(i);
			if (i == that.currentPage) { thumb.addClass("ch-carousel-pages-on"); };

			that.$pagination.append(thumb);
		};

		$.each(that.$pagination.children(), function(i, e){
			$(e).bind("click", function(){
				that.goTo(i + 1);
			});
		});
		
		that.$element.append( that.$pagination );

		that.$pagination.css("left", (that.$element.outerWidth() - that.$pagination.outerWidth()) / 2);
		
		return;
	},
	
	_getItemsPerPage = function(){
		return  ~~( (that.$element.outerWidth() - that.itemSize.width) / that.itemSize.width );
	},

	_getPages = function(){		
		return  Math.ceil( that.items.size() / that.itemsPerPage );
	},

	_getItemSize = function(){
		that.itemSize.margin = parseInt( $(that.items.children[0]).css("marginLeft") ) + parseInt( $(that.items.children[0]).css("marginRight") );

		that.itemSize.width = $(that.items.children[0]).outerWidth() + that.itemSize.margin;
		that.itemSize.height = $(that.items.children[0]).outerHeight();

		return;
	},

	_draw = function(){
		// Calculate total pages and items per page
		that.itemsPerPage = _getItemsPerPage();
		that.pages = _getPages();

		// Set container dimmensions
		that.$container.css({
			"height": that.itemSize.height,
			"width": that.itemSize.width * that.itemsPerPage
		});
	},
	
	_resize = false;

/**
 *  Protected Members
 */

	// Create a List object to carousel's items
	that.$collection = that.$element.children();
	
	// Create a List object to carousel's items and 	append items to List
	that.items = ch.List();
	$.each( that.$collection.children(), function(i, e){
		that.items.add(e);
	});

	// Item sizes (width and height)
	that.itemSize = {};

	// Initialize current page
	that.currentPage = 1;
	
	//
	that.goTo = function(page){

		if (page == that.currentPage || page > that.pages || page < 1 || isNaN(page)) { return that; };
		
		var movement = -(that.$container.outerWidth() * (page - 1));

		//TODO: review this conditional
		// Have CSS3 Transitions feature?
		if (conf.fx && ch.features.transition) {
			that.$content.css("left", movement);
		// Ok, let JQuery do the magic...
		} else if (conf.fx){
			that.$content.animate({ left: movement });
		} else {
			that.$content.css("left", movement);
		};

		// Arrows behavior
		if (!conf.rolling) _toggleArrows(page);

		that.currentPage = page;

		if (conf.pagination) {
			that.$pagination.children()
				.removeClass("ch-carousel-pages-on")
				.eq(page-1)
				.addClass("ch-carousel-pages-on");
		};

 		return that;
	};

	//
	that.prev = function(){
		that.goTo(that.currentPage - 1);

		that.callbacks("onPrev");

		return that;
	};
	
	//
	that.next = function(){
		that.goTo(that.currentPage + 1);

		that.callbacks("onNext");

		return that;
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
	that["public"].getItemsPerPage = function() { return that.itemsPerPage; };
    
    /**
     * Get the current page.
     * @public
     * @name getPage
     * @return {Number}
     * @memberOf ch.Carousel
     */
    that["public"].getPage = function() { return that.currentPage; };
    
    /**
     * Moves the carousel to the defined page.
     * @public
     * @name moveTo
     * @return {Chico-UI Object}
     * @memberOf ch.Carousel
     */
    that["public"].goTo = function(page) {
	    	that.goTo(page);

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
		that.next();

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
		that.prev();

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
		_draw();
		
		return that["public"];
	};


/**
 *  Default event delegation
 */
	// Add class name to carousel container
	that.$element.addClass("ch-carousel");
	
	// Add class name to collection's children
	that.$collection.children().addClass("ch-carousel-item");
	
	// Calculate item size
	_getItemSize();

	// Detach collection and set width attribute	
	that.$collection
		.detach()
		.addClass("ch-carousel-list")
	
	// Create carousel layout
 	_createLayout();

	_draw();

	// Create arrows and pagination
	if ( conf.arrows && that.pages > 1) { _createArrows(); };
	if ( conf.pagination && that.pages > 1) { _createPagination(); };

	// Elastic behavior    
    if ( !conf.hasOwnProperty("width") ){
		
	    ch.utils.window.bind("resize", function() {
			_resize = true;
		});
		
		setInterval(function() {
		    if( !_resize ) return;
			_resize = false;
			_draw();
		}, 250);
		
	};
	


	return that;
}
