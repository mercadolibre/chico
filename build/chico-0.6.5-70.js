/*!
 * Chico UI 0.6.5-70 MIT Licence
 * @autor <chico@mercadolibre.com>
 * @link http://www.chico-ui.com.ar 
 * @team Natan Santolo, Leandro Linares, Guillermo Paz, Natalia Devalle 
 */;(function($){/**
 * Chico-UI namespace
 * @namespace ch
 * @name ch
 */

var ch = window.ch = {

    /**
     * Current version
     * @name version
     * @type {Number}
     * @memberOf ch
     */
    version: "0.6.5",
    /**
     * List of UI components available.
     * @name components
     * @type {String}
     * @memberOf ch
     */
    components: "",
    /**
     * List of internal components available.
     * @name internals
     * @type {String}
     * @memberOf ch
     */
    internals: "",
    /**
     * Here you will find a map of all component's instances created by Chico-UI.
     * @name instances
     * @type {Map Object}
     * @memberOf ch
     */
    instances: {},
    /**
     * Available device's features.
     * @name features
     * @type {Map Object}
     * @see ch.Support
     * @memberOf ch
     */
    features: {},
    /**
     * Core constructor function.
     * @name init
     * @function
     * @memberOf ch
     */
    init: function() { 
        // unmark the no-js flag on html tag
        $("html").removeClass("no-js");
        // check for browser support
		ch.features = ch.support();
        // iterate and create components               
        $(ch.components.split(",")).each(function(i,e){ ch.factory({component:e}); });
        
        // TODO: This should be on keyboard controller.
		ch.utils.document.bind("keydown", function(event){ ch.keyboard(event); });
        
    },
    /**
     * References and commons functions.
     * @name utils
     * @type {Object Literal}
     * @memberOf ch
     */
    utils: {
		body: $("body"),
		html: $("html"),
		window: $(window),
		document: $(document),
		zIndex: 1000,
		index: 0, // global instantiation index
		isSelector: function(string){
			if(typeof string !== "string") return false;
			
			for (var regex in $.expr.match){
				if ($.expr.match[ regex ].test(string) && $(string).length > 0) {
					return true;
				};
			};
			
			return false;
		},
		isArray: function( o ) {
            return Object.prototype.toString.apply( o ) === "[object Array]";
	    }, 
		isUrl: function(url){
			return ( (/^((https?|ftp|file):\/\/|((www|ftp)\.)|(\/|.*\/)*)[a-z0-9-]+((\.|\/)[a-z0-9-]+)+([/?].*)?$/).test(url) );
		},
		avoidTextSelection: function(){
			$.each(arguments, function(i, e){
				if ( $.browser.msie ) {
					$(e).attr('unselectable', 'on');
				} else if ($.browser.opera) {
					$(e).bind("mousedown", function(){ return false; });
				} else { 
					$(e).addClass("ch-user-no-select");
				};
			});
				
			return;
		},
		hasOwn: function(o, property) {
			return Object.prototype.hasOwnProperty.call(o, property);
		}
	},

    /**
     * Chico-UI global events reference.
	 * @abstract
     * @name Events
     * @class Events
     * @type {Map Object}
     * @memberOf ch 
     * @see ch.Events.KEY
     */	
    events: {
        /**
         * Every time Chico-UI needs to inform al visual components that layout has been changed, he triggers this event.
         * @public
         * @name CHANGE_LAYOUT
         * @memberOf ch.Events
         */ 
        CHANGE_LAYOUT: "changeLayout", 
        /**
         * Keryboard event collection.
         * @name KEY
         * @namespace KEY
         * @memberOf ch.Events
         */
        KEY: {
            /**
             * Enter key event.
             * @name ENTER
             * @memberOf ch.Events.KEY
             */
        	ENTER: "enter",
            /**
             * Esc key event.
             * @name ESC
             * @memberOf ch.Events.KEY
             */
			ESC: "esc",
            /**
             * Left arrow key event.
             * @name LEFT_ARROW
             * @memberOf ch.Events.KEY
             */
			LEFT_ARROW: "left_arrow",
            /**
             * Up arrow key event.
             * @name UP_ARROW
             * @memberOf ch.Events.KEY
             */
			UP_ARROW: "up_arrow",
            /**
             * Rigth arrow key event.
             * @name RIGHT_ARROW
             * @memberOf ch.Events.KEY
             */
			RIGHT_ARROW: "right_arrow",
            /**
             * Down arrow key event.
             * @name DOWN_ARROW
             * @memberOf ch.Events.KEY
             */
			DOWN_ARROW: "down_arrow"
        }
    }
};


/** 
 * Utility to clone objects
 * @function
 * @name clon
 * @param {Object} o Object to clone
 * @returns {Object}
 * @memberOf ch
 */
ch.clon = function(o) {
    
    obj = {};
    
    for (x in o) {
        obj[x] = o[x]; 
    };
    
    return obj;
};


/** 
 * Class to create UI Components
 * @abstract
 * @name Factory
 * @class Factory
 * @param {Configuration Object} o 
 * @example
 *   o {
 *      component: "chat",
 *      callback: function(){},
 *      [script]: "http://..",
 *      [style]: "http://..",
 *      [callback]: function(){}    
 *   }
 * @returns {Collection} A collection of object instances
 * @memberOf ch
 */    

ch.factory = function(o) {
    
    if (!o) { 
        alert("Factory fatal error: Need and object {component:\"\"} to configure a component."); 
        return;
    };

    if (!o.component) { 
        alert("Factory fatal error: No component defined."); 
        return;
    };

    var x = o.component;

    var create = function(x) { 

        // Send configuration to a component trough options object
        $.fn[x] = function( options ) {

            var results = [];			    
            var that = this;       

 			// Could be more than one argument
 			var _arguments = arguments;
 			
            that.each( function(i, e) {
            	
				var conf = options || {};

                var context = {};
                    context.type = x;
                    context.element = e;
                    context.$element = $(e);
                    context.uid = ch.utils.index += 1; // Global instantiation index
               
				switch(typeof conf) {
					// If argument is a number, join with the conf
					case "number":
						var num = conf;
						conf = {};
						conf.value = num;
						
						// Could come a messages as a second argument
		                if (_arguments[1]) {
		                    conf.msg = _arguments[1];
		                };
					break;
					
					// This could be a message
					case "string":						
						var msg = conf;
						conf = {};
						conf.msg = msg;
					break;
					
					// This is a condition for custom validation
					case "function":
						var func = conf;
						conf = {};
						conf.lambda = func;
						
						// Could come a messages as a second argument
		                if (_arguments[1]) {      	
		                    conf.msg = _arguments[1];
		                };
					break;
				};
               
                // Create a component from his constructor
                var created = ch[x].call( context, conf );

				/* 
					MAPPING INSTANCES
				
    				Internal interface for avoid mapping objects
    				{
    					exists:true,
    					object: {}
    				}
				*/
				
				created = ( ch.utils.hasOwn(created, "public") ) ? created["public"] : created;
				
			    if (created.type) {
			        var type = created.type;		    
                    // If component don't exists in the instances map create an empty array
                    if (!ch.instances[type]) { ch.instances[type] = []; }
                         ch.instances[type].push( created );
			    }
                
                // Avoid mapping objects that already exists
				if (created.exists) {				
					// Return the inner object
					created = created.object;
				}			

			    results.push( created );
			    
            });
            
            // return the created components collection or single component   
            return ( results.length > 1 ) ? results : results[0];
        };

        // if a callback is defined 
        if ( o.callback ) { o.callback(); }
                        
    } // end create function
    
    if ( ch[o.component] ) {
        // script already here, just create it
        create(o.component);
        
    } else {
        // get resurces and call create later
        ch.get({
            "method":"component",
            "component":o.component,
            "script": ( o.script )? o.script : "src/js/"+o.component+".js",
            "styles": ( o.style ) ? o.style : "src/css/"+x+".css",
            "callback":create
        });
    }
}


/**
 * Load components or content
 * @abstract
 * @name Get
 * @class Get
 * @param o {Object} object 
 * @example
 *   o {
 *      method: "content"|"component",
 *      component: "chat",
 *      [script]: "http://..",
 *      [style]: "http://..",
 *      [callback]: function(){}
 *   }
 * @memberOf ch
 */
ch.get = function(o) {
     
    switch(o.method) {
		
		case "content":

	        var that = o.that;
	        var conf = that.conf;
			var context = ( ch.utils.hasOwn(that, "controller") ) ? that.controller : that["public"];

			// Set ajax config
			// On IE (6-7) "that" reference losts when I call ch.get for second time
			// Why?? I don't know... but with a setTimeOut() works fine!
			setTimeout(function(){
			
				$.ajax({
					url: conf.ajaxUrl,
					type: conf.ajaxType || 'GET',
					data: conf.ajaxParams,
					cache: true,
					async: true,
					beforeSend: function(jqXHR){
						jqXHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					},
					success: function(data, textStatus, jqXHR){					
						that.$content.html( data );
						if ( ch.utils.hasOwn(conf, "onContentLoad") ) conf.onContentLoad.call(context, data, textStatus, jqXHR);
						if ( ch.utils.hasOwn(conf, "position") ) ch.positioner(conf.position);
					},
					error: function(jqXHR, textStatus, errorThrown){
						data = (ch.utils.hasOwn(conf, "onContentError")) ? conf.onContentError.call(context, jqXHR, textStatus, errorThrown) : "<p>Error on ajax call </p>";
						that.$content.html( data );
						if ( ch.utils.hasOwn(conf, "position") ) ch.positioner(conf.position);
					}
				});
				
			}, 0);
			
		break;
	        
		case "component":
	        
	        // ch.get: "Should I get a style?"
	        if ( o.style ) {
	    		var style = document.createElement('link');
	        		style.href = o.style;
	    	    	style.rel = 'stylesheet';
	            	style.type = 'text/css';
	        }
	        // ch.get: "Should I get a script?"        
	        if ( o.script ) {
	    	   	var script = document.createElement("script");
	    			script.src = o.script;
	        }
	        
	        var head = document.getElementsByTagName("head")[0] || document.documentElement;
	
			// Handle Script loading
			var done = false;
	
			// Attach handlers for all browsers
			script.onload = script.onreadystatechange = function() {
	    
	    	if ( !done && (!this.readyState || 
						this.readyState === "loaded" || this.readyState === "complete") ) {

					done = true;

		   			// if callback is defined call it
		   	        if ( o.callback ) { o.callback( o.component ); }

			   		// Handle memory leak in IE
		   			script.onload = script.onreadystatechange = null;

			   		if ( head && script.parentNode ) { head.removeChild( script ); }
				}
			};
	            
			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used.
			if ( o.script ) { head.insertBefore( script, head.firstChild ); }
			if ( o.style ) { head.appendChild( style ); }
	    
		break;        
	}

}


/**
 * Returns a data object with features supported by the device
 * @abstract
 * @name Support
 * @class Support
 * @returns {Object}
 * @memberOf ch 
 */
ch.support = function() {
	
	/**
	 * Private reference to the <body> element
	 * @private
	 * @name thisBody
	 * @type {HTMLBodyElement}
	 * @memberOf ch.Support
	 */
	var thisBody = document.body || document.documentElement;
	
	/**
     * Based on: http://gist.github.com/373874
     * Verify that CSS3 transition is supported (or any of its browser-specific implementations)
     *
     * @private
     * @returns {Boolean}
     * @memberOf ch.Support
     */
	var transition = (function(){
		var thisStyle = thisBody.style;
		return thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.OTransition !== undefined || thisStyle.transition !== undefined;
	})();

    /**
     * Based on: http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
     * Verify that position fixed is supported
     * 
     * @private
     * @returns {Boolean}
     * @memberOf ch.Support
     */	
	var fixed = (function(){
        var isSupported = false;
		var e = document.createElement("div");
			e.style.position = "fixed";
			e.style.top = "10px";
			
		thisBody.appendChild(e);
		if (e.offsetTop === 10) { isSupported = true; };
  		thisBody.removeChild(e);
  		
  		return isSupported;
  		
	})();

	return {
        /**
         * Boolean property that indicates if CSS3 Transitions are supported by the device.
         * @public
         * @name transition
         * @type {Boolean}
         * @memberOf ch.Support
         */
 		transition: transition,
        /**
         * Boolean property that indicates if Fixed positioning are supported by the device.
         * @public
         * @name fixed
         * @type {Boolean}
         * @memberOf ch.Support
         */
		fixed: fixed
	};
	
};

/**
 * Cache control utility.
 * @abstract
 * @name Cache
 * @class Cache
 * @memberOf ch
 */
 
ch.cache = {

    /**
     * Map of resources cached
     * @name map 
     * @type {Object}
     * @memberOf ch.Cache
     */
    map: {},
    
    /**
     * Add a resource to the cache control
     * @function 
     * @name add
     * @param {String} url Resource location
     * @param {String} data Resource information
     * @memberOf ch.Cache
     */
    add: function(url, data) {
        ch.Cache.map[url] = data;
    },
    
    /**
     * Get a resource from the cache
     * @function
     * @name get
     * @param {String} url Resource location
     * @returns {String} data Resource information
     * @memberOf ch.Cache
     */
    get: function(url) {
        return ch.Cache.map[url];
    },
    
    /**
     * Remove a resource from the cache
     * @function
     * @name rem
     * @param {String} url Resource location
     * @memberOf ch.Cache
     */
    rem: function(url) {
        ch.Cache.map[url] = null;
        delete ch.Cache.map[url];
    },
    
    /**
     * Clears the cache map
     * @function
     * @name flush
     * @memberOf ch.Cache
     */
    flush: function() {
        delete ch.Cache.map;
        ch.Cache.map = {};
    }
};
/**
 * Carousel is a UI-Component.
 * @name Carousel
 * @class Carousel
 * @augments ch.Object
 * @requires ch.List   
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
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
	
	// Configurable pagination
	conf.pagination = conf.pagination || false;
	
	// Configuration for continue carousel
	// TODO: Rolling is forced to be false. Use this instead:
	// if( ch.utils.hasOwn(conf, "rolling") ) { conf.rolling = conf.rolling; } else { conf.rolling = true; };
	conf.rolling = false;
	
	// Configurable arrows
	if( ch.utils.hasOwn(conf, "arrows") ) { conf.arrows = conf.arrows; } else { conf.arrows = true; };
	
	// Configurable efects
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
	
	/**
     * Creates the necesary structure to carousel operation.
     * @private
     * @function
     * @name _createLayout
     * @memberOf ch.Carousel
     */
	var _createLayout = function() {

		// Create carousel's content
		that.$content = $("<div>")
			.addClass("ch-carousel-content")
			.append( that.$collection );

		// Create carousel's mask
		that.$container = $("<div>")
			.addClass("ch-carousel-container")
			.css("height", that.itemSize.height)
			.append( that.$content )
			.appendTo( that.$element );

		// Visual configuration
		if ( ch.utils.hasOwn(conf, "width") ) { that.$element.css("width", conf.width); };
		if ( ch.utils.hasOwn(conf, "height") ) { that.$element.css("height", conf.height); };
		if ( !conf.fx && ch.features.transition ) { that.$content.addClass("ch-carousel-nofx"); };

		return;
	},
	
	/**
     * Creates Previous and Next arrows.
     * @private
     * @function
     * @name _createArrows
     * @memberOf ch.Carousel
     */
	_createArrows = function(){
		
		// Previous arrow
		that.prevArrow = $("<p>")
			.addClass("ch-prev-arrow")
			.append("<span>Previous</span>")
			.bind("click", that.prev);
		
		// Next arrow
		that.nextArrow = $("<p>")
			.addClass("ch-next-arrow")
			.append("<span>Next</span>")
			.bind("click", that.next);
		
		// Continue carousel arrows behavior
		if ( !conf.rolling ) { that.prevArrow.addClass("ch-hide") };
		
		// Append arrows to carousel
		that.$element.prepend(that.prevArrow).append(that.nextArrow);
		
		// Positions arrows vertically inside carousel
		var arrowsPosition = (that.$element.outerHeight() - that.nextArrow.outerHeight()) / 2;
		$(that.prevArrow).css("top", arrowsPosition);
		$(that.nextArrow).css("top", arrowsPosition);

		return;
	},
	
	/**
     * Manages arrows turning it on and off when non-continue carousel is on first or last page.
     * @private
     * @function
     * @name _toggleArrows
     * @param {Number} page Page to be moved
     * @memberOf ch.Carousel
     */
	_toggleArrows = function(page){
 		
 		// Both arrows shown on carousel's middle
		if (page > 1 && page < that.pages ){
			that.prevArrow.removeClass("ch-hide");
			that.nextArrow.removeClass("ch-hide");
		} else {
			// Previous arrow hidden on first page
			if (page == 1) { that.prevArrow.addClass("ch-hide"); that.nextArrow.removeClass("ch-hide"); };
			
			// Next arrow hidden on last page
			if (page == that.pages) { that.prevArrow.removeClass("ch-hide"); that.nextArrow.addClass("ch-hide"); };
		};

		return;
	},
	
	/**
     * Creates carousel pagination.
     * @private
     * @function
     * @name _createPagination
     * @memberOf ch.Carousel
     */
	_createPagination = function(){
		
		// Deletes pagination if already exists
		that.$element.find(".ch-carousel-pages").remove();
		
		// Create an list of elements for new pagination
		that.$pagination = $("<ul>").addClass("ch-carousel-pages");

		// Create each mini thumbnail
		for (var i = 1; i <= that.pages; i += 1) {
			// Thumbnail <li>
			var thumb = $("<li>").html(i);
			
			// Mark as actived if thumbnail is the same that current page
			if (i == that.currentPage) { thumb.addClass("ch-carousel-pages-on"); };
			
			// Append thumbnail to list
			that.$pagination.append(thumb);
		};

		// Bind each thumbnail behavior
		$.each(that.$pagination.children(), function(i, e){
			$(e).bind("click", function(){
				that.goTo(i + 1);
			});
		});
		
		// Append list to carousel
		that.$element.append( that.$pagination );
		
		// Positions list
		that.$pagination.css("left", (that.$element.outerWidth() - that.$pagination.outerWidth()) / 2);
		
		// Save each generated thumb into an array
		_$itemsPagination = that.$pagination.children();
			
		return;
	},
	
	/**
     * Calculates items amount on each page.
     * @private
     * @function
     * @name _getItemsPerPage
     * @memberOf ch.Carousel
     * @returns {Number} Items amount on each page
     */
	_getItemsPerPage = function(){
		// Space to be distributed among all items
		var _widthDiff = that.$element.outerWidth() - that.itemSize.width;
		
		// If there are space to be distributed, calculate pages
		return (_widthDiff > that.itemSize.width) ? ~~(_widthDiff / that.itemSize.width) : 1;
	},
	
	/**
     * Calculates total amount of pages.
     * @private
     * @function
     * @name _getPages
     * @memberOf ch.Carousel
     * @returns {Number} Total amount of pages
     */
	_getPages = function(){
		// (Total amount of items) / (items amount on each page)
		return  Math.ceil( that.items.children.length / that.itemsPerPage );
	},

	/**
     * Calculates all necesary data to draw carousel correctly.
     * @private
     * @function
     * @name _draw
     * @memberOf ch.Carousel
     */
	_draw = function(){
		
		// Reset size of carousel mask
		_maskWidth = that.$container.outerWidth();

		// Recalculate items amount on each page
		that.itemsPerPage = _getItemsPerPage();
		
		// Recalculate total amount of pages
		that.pages = _getPages();
		
		// Calculate variable margin between each item
		var _itemMargin = (( _maskWidth - (that.itemSize.width * that.itemsPerPage) ) / that.itemsPerPage ) / 2;
		
		// Modify sizes only if new items margin are positive numbers
		if (_itemMargin < 0) return;
		
		// Detach content from DOM for make a few changes
		that.$content.detach();
		
		// Move carousel to first page for reset initial position
		that.goTo(1);
		
		// Sets new margin to each item
		$.each(that.items.children, function(i, e){
			e.style.marginLeft = e.style.marginRight = _itemMargin + "px";
		});
		
		// Change content size and append it to DOM again
		that.$content
			.css("width", ((that.itemSize.width + (_itemMargin * 2)) * that.items.size() + _extraWidth) )
			.appendTo(that.$container);
		
		// Create pagination if there are more than one page on total amount of pages
		if ( conf.pagination && that.pages > 1) { _createPagination(); };
		
		return;
	},
	
	/**
     * Size of carousel mask.
     * @private
     * @name _maskWidth
     * @type {Number}
     * @memberOf ch.Carousel
     */
	_maskWidth,
	
	/**
     * List of pagination thumbnails.
     * @private
     * @name _$itemsPagination
     * @type {Array}
     * @memberOf ch.Carousel
     */
	_$itemsPagination,
	
	/**
     * Extra size calculated on content
     * @private
     * @name _extraWidth
     * @type {Number}
     * @memberOf ch.Carousel
     */
	_extraWidth,
	
	/**
     * Resize status of Window.
     * @private
     * @name _resize
     * @type {Boolean}
     * @memberOf ch.Carousel
     */
	_resize = false;

/**
 *  Protected Members
 */

	/**
     * UL list of items.
     * @private
     * @name $collection
     * @type {Array}
     * @memberOf ch.Carousel
     */
	that.$collection = that.$element.children();
	
	/**
     * List object created from each item.
     * @private
     * @name items
     * @type {Object}
     * @memberOf ch.Carousel
     */
	that.items = ch.list( that.$collection.children().toArray() );
	
	/**
     * Width and height of first item.
     * @private
     * @name itemSize
     * @type {Object}
     * @memberOf ch.Carousel
     */
	that.itemSize = {
		width: $(that.items.children[0]).outerWidth(),
		height: $(that.items.children[0]).outerHeight()
	};

	/**
     * Page selected.
     * @private
     * @name currentPage
     * @type {Number}
     * @memberOf ch.Carousel
     */
	that.currentPage = 1;

	that.goTo = function(page){
		
		// Validation of page parameter
		if (page == that.currentPage || page > that.pages || page < 1 || isNaN(page)) { return that; };
		
		// Coordinates to next movement
		var movement = -(_maskWidth * (page - 1));

		// TODO: review this conditional
		// Movement with CSS transition
		if (conf.fx && ch.features.transition) {
			that.$content.css("left", movement);
		// Movement with jQuery animate
		} else if (conf.fx){
			that.$content.animate({ left: movement });
		// Movement without transition or jQuery
		} else {
			that.$content.css("left", movement);
		};

		// Manage arrows
		if (!conf.rolling && conf.arrows) { _toggleArrows(page); };
		
		// Refresh selected page
		that.currentPage = page;
		
		// TODO: Use toggleClass() instead remove and add.
		// Select thumbnail on pagination
		if (conf.pagination) {
			_$itemsPagination
				.removeClass("ch-carousel-pages-on")
				.eq(page - 1)
				.addClass("ch-carousel-pages-on");
		};
		
		// Movement callback
		that.callbacks("onMove");

 		return that;
	};

	that.prev = function(){
		that.goTo(that.currentPage - 1);

		that.callbacks("onPrev");

		return that;
	};
	
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
     * Get the items amount of each page.
     * @public
     * @name getItemsPerPage
     * @returns {Number}
     * @memberOf ch.Carousel
     */
	that["public"].getItemsPerPage = function() { return that.itemsPerPage; };
    
    /**
     * Get the total amount of pages.
     * @public
     * @name getPage
     * @returns {Number}
     * @memberOf ch.Carousel
     */
    that["public"].getPage = function() { return that.currentPage; };
    
    /**
     * Moves to a defined page.
     * @public
     * @function
     * @name goTo
     * @returns {Chico-UI Object}
     * @param {Number} page Page to be moved
     * @memberOf ch.Carousel
     * @example
     * // Create a carousel
     * var foo = $("bar").carousel();
     * 
     * // Go to second page
     * foo.goTo(2);
     */
    that["public"].goTo = function(page) {
    	that.goTo(page);

   		return that["public"];
    };
    
    /**
     * Moves to the next page.
     * @public
     * @name next
     * @returns {Chico-UI Object}
     * @memberOf ch.Carousel
     * @example
     * // Create a carousel
     * var foo = $("bar").carousel();
     * 
     * // Go to next page
     * foo.next();
     */
    that["public"].next = function(){
		that.next();

    	return that["public"];
    };

    /**
     * Moves to the previous page.
     * @public
     * @name prev
     * @returns {Chico-UI Object}
     * @memberOf ch.Carousel
     * @example
     * // Create a carousel
     * var foo = $("bar").carousel();
     * 
     * // Go to previous page
     * foo.prev();
     */
	that["public"].prev = function(){
		that.prev();

		return that["public"];
	};

    /**
     * Re-calculate positioning, sizing, paging, and re-draw.
     * @public
     * @name redraw
     * @returns {Chico-UI Object}
     * @memberOf ch.Carousel
     * @example
     * // Create a carousel
     * var foo = $("bar").carousel();
     * 
     * // Re-draw carousel
     * foo.redraw();
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

	// Add class name to collection and its children
	that.$collection
		.detach()
		.addClass("ch-carousel-list")
		.children()
			.addClass("ch-carousel-item");

	// Creates the necesary structure to carousel operation
 	_createLayout();

	// Calculate extra width for content before draw carousel
	_extraWidth = (ch.utils.html.hasClass("ie6")) ? that.itemSize.width : 0;
	
	// Calculates all necesary data to draw carousel correctly
	_draw();

	// Creates Previous and Next arrows
	if ( conf.arrows && that.pages > 1) { _createArrows(); };

	// Elastic behavior    
    if ( !conf.hasOwnProperty("width") ){
		
		// Change resize status on Window resize event
	    ch.utils.window.bind("resize", function() {
			_resize = true;
		});
		
		// Limit resize execution to a quarter of second
		setInterval(function() {
		    if( !_resize ) { return; };
			_resize = false;
			_draw();
		}, 250);
		
	};

	return that;
}

/**
 *	Chat Component
 *  $("#chat").chat({
 *      ruleGroupName: "",
 *      style: ["block"],
 *      template: [1],
 *      environment: "1"|"2"|"3"
 *  });
 */

ch.chat = function(conf) {
    
   	var that = ch.object(); // Inheritance

    var getDomain = function(n) {
        switch (n) {
            case "1": return "mercadolidesa.com.ar"; break;
            case "2": return "mercadolistage.com.ar"; break;
            case "3": return "mercadolibre.com.ar"; break;
        }
    }

    if (conf.msg) {
        conf.ruleGroupName = conf.msg;
    }

    that.load = function() {
        loadChatGZ(conf.ruleGroupName, conf.element.id, conf.style||"block", conf.template||"1",conf.environment||"3"); 
    }

   	ch.get({
   	    method: "component",
   	    name: "chat",
   	    script: "http://www."+getDomain(conf.environment)+"/org-img/jsapi/chat/chatRBIScript.js",
   	    callback: function() {
       	    that.load(); 
        }
   	});

    that["public"] = {
    	uid: conf.uid,
		element: conf.element,
        type: "chat"
    }
    
    return that;

}

/** 
 * A simple utility to highlight code snippets in the HTML.
 * @abstract
 * @name Codelighter
 * @class Codelighter 
 * @returns {Object}
 * @memberOf ch 
 * @example
 * ch.codelighter();
 * $(".xml").codeXML();
 */

ch.codelighter = function() {
/**
 *  Constructor
 */
	var that = this;
		
/**
 *  Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);
	
	
/**
 *  Private Members
 */

/**
 *  Protected Members
 */ 

/**
 *  Public Members
 */
	
	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;	
	that["public"].children = that.children;	


/**
 *  Default event delegation
 */	

	$("pre[name=code]").each(function(i, e){
		
		var codesnippet = {};
			codesnippet.uid = ch.utils.index += 1;
			codesnippet.type = "codesnippet";
			codesnippet.element = e;
			codesnippet.snippet = e.innerHTML;			

		that.children.push( ch["code" + e.className.toUpperCase()].call(codesnippet) );

	});

	ch.instances.codelighter = that.children; // Create codeligther instance
	
	return that;
};



/**
 *	@Codesnippet
 */
 
ch.codesnippet = function(conf){
/**
 *  Constructor
 */
	
	var that = this;	
	
	conf = ch.clon(conf);
	that.conf = conf;
	
		
/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);
	
/**
 *  Private Members
 */

	var paint = function() {
		for (var x in conf.brush){
			if (conf.brush[ x ].test(that.paintedSnippet)) {
				that.paintedSnippet = that.paintedSnippet.replace(conf.brush[ x ], x);
			};
		};

		return that.paintedSnippet;
	};
 
/**
 *  Protected Members
 */ 

	that.paintedSnippet = that.snippet;	
			
/**
 *  Public Members
 */	

	that["public"] = {};
	that["public"].uid = that.uid;
	that["public"].type = conf.type;
	that["public"].element = that.element;
	that["public"].snippet = that.snippet;
	that["public"].paintedSnippet = that.paintedSnippet;	

/**
 *  Default event delegation
 */		 	
	
	that.element.innerHTML = paint();
	
	return that;
};


/**
 *	@Interface xml
 *	@returns An interface object
 */

ch.codeXML = function(conf) {
    
/** 
 *  Constructor: Redefine or preset component's settings
 */

	conf = conf || {};
	
	conf.type = "codeXML";

	conf.brush = {
		"&lt;": /</g, // Menor
		"&gt;": />/g , // Mayor
		"<span class='ch-comment'><code></span>": /(\&lt;|&lt;)!--\s*.*?\s*--(\&gt;|&gt;)/g, // comments		
		"<span class='ch-attrName'><code></span>": /(id|name|class|title|alt|value|type|style|method|href|action|lang|dir|src|tabindex|usemap|data|rel|charset|encoding|size|selected|checked|placeholder|target|required|disabled|max|min|maxlength|accesskey)=".*"/g, // Attributes name
		"<span class='ch-attrValue'><code></span>": /".+?"/g, // Attributes
		"<span class='ch-tag'><code></span>": /(&lt;([a-z]|\/).*?&gt;)/g, // Tag
		"    ": /\t/g // Tab
	};
    
    this.snippet = this.snippet || this.element.innerHTML;
    
    return ch.codesnippet.call(this, conf);
    
};

ch.factory({ component: 'codeXML' });



/**
 *	@Interface js
 *	@returns An interface object
 */

ch.codeJS = function(conf) {
    
/** 
 *  Constructor: Redefine or preset component's settings
 */
	
	conf = conf || {};
	
	conf.type = "codeJS";
	
	conf.brush = {
		"$1 $2 $3": /(<)([a-z]|\/|.*?)(>)/g,
		"<span class='ch-operator'><code></span>": /(\+|\-|=|\*|&|\||\%|\!|\?)/g,
		">": />amp;/g,
		"<span class='ch-atom'><code></span>": /(false|null|true|undefined)/g,		
		"$1<span class='ch-keywords'>$2</span>$3": /(^|\s|\(|\{)(return|new|delete|throw|else|case|break|case|catch|const|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|switch|throw|try|typeof|var|void|while|with)(\s*)/g,
		"<span class='ch-attrValue'><code></span>": /(".+?")|[0-9]/g, // Attributes & numbers
		"    ": /\t/g, // Tab
		"<span class='ch-comment'><code></span>": /(\/\*)\s*.*\s*(\*\/)/g, // Comments
		"<span class='ch-comment'><code></span>": /(\/\/)\s*.*\s*\n*/g // Comments
		
	};
	    
    this.snippet = this.snippet || this.element.innerHTML;
    
    return ch.codesnippet.call(this, conf);
    
};

ch.factory({ component: 'codeJS' });


/**
 *	@Interface css
 *	@returns An interface object
 */

ch.codeCSS = function(conf) {
    
/** 
 *  Constructor: Redefine or preset component's settings
 */
	
	conf = conf || {};
	
	conf.type = "codeCSS";
	
	conf.brush = {
		//"<span class='ch-selector'><code></span>": /(a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1> - <h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|keygen|kbd|label|legend|li|link|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|u|ul|var|video|wbr|xmp)(\{*)/g, // Selectors
		"<span class='ch-comment'><code></span>": /(\/\*)\s*.*\s*(\*\/)/g, // Comments
		"<span class='ch-attrName'><code></span>": /(\w)\s*:".*"/g, // Attributes name
		"<span class='ch-selector'>$1$2</span>$3": /(#|\.)(\w+)({)/g, // Selectors
		"$1<span class='ch-property'>$2</span>$3": /({|;|\s)(\w*-*\w*)(\s*:)/g, // Properties
		"$1<span class='ch-attrValue'>$2</span>$3": /(:)(.+?)(;)/g, // Attributes
		"    ": /\t/g // Tab
	};
	
	this.snippet = this.snippet || this.element.innerHTML;
	
    return ch.codesnippet.call(this, conf);
    
};

ch.factory({ component: 'codeCSS' });
/**
 * Abstract class
 * @abstract
 * @name Controllers
 * @class Controllers 
 * @augments ch.Object
 * @memberOf ch
 * @returns {Object}
 * @see ch.Accordion
 * @see ch.Carousel
 * @see ch.Form
 */
 
ch.controllers = function(){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @name that
     * @type {Object}
     * @memberOf ch.Controllers
     */ 
 	var that = this;
		
    /**
     *  Inheritance
     */
    that = ch.object.call(that);
    that.parent = ch.clon(that);
	
 
    /**
     * Collection of children elements.
     * @name children
     * @type {Collection}
     * @memberOf ch.Controllers
     */ 
	that.children = [];
			
    /**
     *  Public Members
     */	
		
	return that;
};

/**
 * Create custom validation interfaces for Watcher validation engine.
 * @name Custom
 * @class Custom
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @example
 * // Validate a even number
 * $("input").custom(function(value){
 *      return (value%2==0) ? true : false;
 * }, "Enter a even number");
 * @see ch.Watcher
 */

ch.custom = function(conf) {

/**
 *  Validation
 */	
	
	if (!conf.lambda) {
        alert("Custom Validation fatal error: Need a function to evaluate, try $().custom(function(){},\"Message\");");
    };

/**
 *  Constructor
 */

	conf = conf || {};
    conf.messages = conf.messages || {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
    	conf.messages.custom = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };
    
	// Define the validation interface    
    conf.custom = true;

	// Add validation types
	conf.types = "custom";
    // Define the conditions of this interface
    conf.conditions = [{
		// I don't have pre-conditions, comes within conf.lambda argument 
        name: "custom",
        func: conf.lambda 
    }];


	return ch.watcher.call(this, conf);
    
};
/**
 * A navegable list of items, UI-Object.
 * @name Dropdown
 * @class Dropdown
 * @augments ch.Navs
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.dropdown = function(conf){


    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Dropdown
     */
	var that = this;

	conf = ch.clon(conf);
	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.navs.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */
    /**
     * Adds keyboard events.
     * @private
     * @name shortcuts
     * @function
     * @memberOf ch.TabNavigator
     */
	var shortcuts = function(items){
		
		// Keyboard support
		var selected = 0;
		
		// Item selected by mouseover
		// TODO: It's over keyboard selection and it is generating double selection.
		$.each(items, function(i, e){
			$(e).bind("mouseenter", function(){
				selected = i;
				items.eq( selected ).focus();
			});
		});
		
		var selectItem = function(arrow, event){
			that.prevent(event);
			
			if(selected == ((arrow == "bottom") ? items.length - 1 : 0)) return;
			
			items.eq( selected ).blur();
			
			if(arrow == "bottom") selected += 1; else selected -= 1;
			
			items.eq( selected ).focus();
		};
		
		// Arrows
		ch.utils.document.bind(ch.events.KEY.UP_ARROW, function(x, event){ selectItem("up", event); });
		ch.utils.document.bind(ch.events.KEY.DOWN_ARROW, function(x, event){ selectItem("bottom", event); });
	};


/**
 *  Protected Members
 */
    /**
     * The component's trigger.
     * @private
     * @name $trigger
     * @type {jQuery Object}
     * @memberOf ch.Dropdown
     */
	that.$trigger = that.$element.children().eq(0);
    /**
     * The component's content.
     * @private
     * @name $content
     * @type {jQuery Object}
     * @memberOf ch.Dropdown
     */
	that.$content = that.$trigger.next().detach(); // Save on memory;

	that.show = function(event){
		that.prevent(event);

		that.$content.css('z-index', ch.utils.zIndex ++);
		
		if (that.$element.hasClass("secondary")) { // Z-index of trigger over conten 
			that.$trigger.css('z-index', ch.utils.zIndex ++);
		}; 

		
		that.$element
			.addClass("ch-dropdown-on")
			.css('z-index', ch.utils.zIndex ++);

		that.parent.show(event);
		that.position("refresh");

		// Reset all dropdowns
		$.each(ch.instances.dropdown, function(i, e){ 
			if (e.uid !== that.uid) e.hide();
		});

		// Close events
		ch.utils.document.one("click " + ch.events.KEY.ESC, function(event){ that.hide(event); });
		// Close dropdown after click an option (link)
		that.$content.find("a").one("click", function(){ that.hide(); });

		// Keyboard support
		var items = that.$content.find("a");
			items.eq(0).focus(); // Select first anchor child by default

		if (items.length > 1){ shortcuts(items); };

		return that;
	};

	that.hide = function(event){
		that.prevent(event);

        that.parent.hide(event);
        	that.$element.removeClass("ch-dropdown-on");

        // Unbind events
        ch.utils.document.unbind(ch.events.KEY.ESC + " " + ch.events.KEY.UP_ARROW + " " + ch.events.KEY.DOWN_ARROW);

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
     * @memberOf ch.Dropdown
     */
   	that["public"].uid = that.uid;
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Dropdown
     */
	that["public"].element = that.element;
    
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Dropdown
     */	
	that["public"].type = that.type;
	
    /**
     * Shows component's content.
     * @public
     * @name show
     * @returns {Chico-UI Object}
     * @memberOf ch.Dropdown
     */
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};

    /**
     * Hides component's content.
     * @public
     * @name hide
     * @returns {Chico-UI Object}
     * @memberOf ch.Dropdown
     */ 
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Dropdown
     */
	that["public"].position = that.position;	


/**
 *  Default event delegation
 */		    

	that.configBehavior();
	
	that.$element.after( that.$content ); // Put content out of element
	ch.utils.avoidTextSelection(that.$trigger);
	
	if (that.$element.hasClass("secondary")) that.$content.addClass("secondary");
	
	// Prevent click on content (except links)
	that.$content.bind("click", function(event){ event.stopPropagation(); });
	
	// Position
	that.conf.position = {};
	that.conf.position.element = that.$content;
	that.conf.position.context = that.$trigger;
	that.conf.position.points = "lt lb";
	that.conf.position.offset = "0 -1";

	return that;

};

/**
 * Eraser is an utility to erase component's instances and free unused memory. A Numer will erase only that particular instance, a component's name will erase all components of that type, a "meltdown" will erase all component's instances from any kind.
 * @abstract
 * @name Eraser
 * @class Eraser
 * @memberOf ch
 * @param {String} [data] 
 */
 
ch.eraser = function(data) {
    
    if(typeof data == "number"){
        
        // By UID
        for(var x in ch.instances){
            
            var component = ch.instances[x];
            
            for(var i = 0, j = component.length; i < j; i += 1){
                if(component[i].uid == data){
                    // TODO: component.delete()
                    delete component[i];
                    component.splice(i, 1);
                    
                    return;
                };
            };
        };
    
    } else {
        
        // All
        if(data === "meltdown"){
            // TODO: component.delete()
            /*for(var x in ch.instances){
                var component = ch.instances[x];
                for(var i = 0, j = component.length; i < j; i += 1){
                    component.delete();
                };
            };*/
            
            delete ch.instances;
            ch.instances = {};
            
        // By component name    
        } else {
            
            for(var x in ch.instances){
            
                if(x == data){
                    
                    var component = ch.instances[x];
                    
                    // TODO: component.delete()
                    /*for(var i = 0; i < component.length; i += 1){
                        component.delete()
                    };*/
                    
                    delete ch.instances[x];
                };
            };
            
        };
        
    };
    
};

/**
 * Expando is a UI-Component.
 * @name Expando
 * @class Expando
 * @augments ch.Navs
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */
 
ch.expando = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Expando
     */
    var that = this;
		
	conf = ch.clon(conf);
	that.conf = conf;
	
/**
 *	Inheritance
 */

	that = ch.navs.call(that);
	that.parent = ch.clon(that);

/**
 *  Protected Members
 */ 

	that.$trigger = that.$element.children().eq(0).wrapInner("<span>").children();

	that.$content = that.$element.children().eq(1);

/**
 *  Public Members
 */
 
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Expando
     */
   	that["public"].uid = that.uid;
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Expando
     */
 	that["public"].element = that.element;
 	
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Expando
     */
	that["public"].type = that.type;
	
    /**
     * Shows component's content.
     * @public
     * @name show
     * @returns {Chico-UI Object}
     * @memberOf ch.Expando
     */
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};

    /**
     * Hides component's content.
     * @public
     * @name hide
     * @returns {Chico-UI Object}
     * @memberOf ch.Expando
     */	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
	

/**
 *  Default event delegation
 */		
    
	that.configBehavior();
	ch.utils.avoidTextSelection(that.$trigger);

	return that;

};

/**
 * Abstract class of all floats UI-Objects.
 * @abstract
 * @name Floats
 * @class Floats
 * @augments ch.Object
 * @memberOf ch
 * @requires ch.Positioner
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Tooltip
 * @see ch.Layer
 * @see ch.Modal
 */ 

ch.floats = function() {

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Floats
     */ 
 	var that = this;
	var conf = that.conf;

/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);
    
/**
 *  Private Members
 */
	var createCone = function() {
		$("<div>")
			.addClass("ch-cone")
			.prependTo( that.$container );
		
		return;
	};

	var createClose = function() {
		// Close Button
		$("<div>")
			.addClass("btn close")
			.css("z-index", ch.utils.zIndex ++)
			.bind("click", function(event){ that.hide(event); })
			.prependTo( that.$container );
		
		// ESC key
		ch.utils.document.bind(ch.events.KEY.ESC, function(event){ that.hide(event); });
		
		return;
	};

    var createLayout = function() {
		
		that.$content = $("<div>")
		    	.addClass("ch-" + that.type + "-content")
		    	.html( that.loadContent() );
		
		that.$container = $("<div>")
			.addClass("ch-" + that.type)
			.css("z-index", ch.utils.zIndex ++)
			.append( that.$content )
			.appendTo("body");
		
		// Visual configuration
		if( ch.utils.hasOwn(conf, "classes") ) that.$container.addClass(conf.classes);
		if( ch.utils.hasOwn(conf, "width") ) that.$container.css("width", conf.width);
		if( ch.utils.hasOwn(conf, "height") ) that.$container.css("height", conf.height);
		if( ch.utils.hasOwn(conf, "closeButton") && conf.closeButton ) createClose();
		if( ch.utils.hasOwn(conf, "cone") ) createCone();
		if( ch.utils.hasOwn(conf, "fx") ) conf.fx = conf.fx; else conf.fx = true;
		
		// Cache - Default: true
		conf.cache = ( ch.utils.hasOwn(conf, "cache") ) ? conf.cache : true;
		
		// Show component with effects
		if( conf.fx ) {
			that.$container.fadeIn("fast", function(){ that.callbacks("onShow"); });
		
		// Show component without effects
		} else {
			// TODO: that.$container.removeClass("ch-hide");
			that.$container.show();
			that.callbacks("onShow");
		};
		
		// Position component
		conf.position = conf.position || {};
		conf.position.element = that.$container;
		conf.position.hold = conf.hold || false;
		ch.positioner.call(that);
		
		return;
    };
    

/**
 *  Protected Members
 */ 
			
/**
 *  Public Members
 */
 
	that.active = false;

    /**
     * Shows component's content.
     * @public
     * @name show
     * @returns {Chico-UI Object}
     * @memberOf ch.Floats
     */ 
	that.show = function(event) {
		
		if ( event ) that.prevent(event);
		
		if ( that.active ) return;
		
		that.active = true;
		
		// Show if exist, else create		
		if ( that.$container ) {
				
			// If not cache... get content again! // Flush cache where?? when?? do it!
			if ( !conf.cache ) that.$content.html( that.loadContent() );
			
			// Detach the content of BODY
			var content = conf.content || conf.msg;
			if ( ch.utils.isSelector(content) ) $(content).detach();

    		that.$container
    		    .appendTo("body")
    			.css("z-index", ch.utils.zIndex++)
			    .fadeIn('fast', function(){ 
					that.active = true;
					
					// Callback execute
					that.callbacks('onShow');
				});

			that.position("refresh");
						
			return that;
		};
		
		// If you reach here, create a float
        createLayout();
        
        return that;
	};

    /**
     * Hides component's content.
     * @public
     * @name hide
     * @returns {Chico-UI Object}
     * @memberOf ch.Floats
     */ 
	that.hide = function(event) {

		if (event) that.prevent(event);
		
		if (!that.active) return;

		var afterHide = function(){ 
			 
			that.active = false;
			
			// Append the content of BODY
			var content = conf.content || conf.msg;
			
			if (ch.utils.isSelector(content)) {

				if ($("body " + content + ".ch-hide").length > 0) return false;

				that.$content.children()
					.clone()
					.addClass("ch-hide")
					.appendTo("body");
			};
			
			// Callback execute
			that.callbacks('onHide');
			
			that.$container.detach();
			
		};
		
		// Show component with effects
		if( conf.fx ) {
			that.$container.fadeOut("fast", afterHide);
		
		// Show component without effects
		} else {
			// TODO: that.$container.addClass("ch-hide");
			that.$container.hide();
			afterHide();
		};
		
		return that;

	};
	
	return that;
	
};

/**
 * Forms is a Controller of DOM's HTMLFormElement.
 * @name Form
 * @class Form
 * @augments ch.Controllers
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.form = function(conf) {

/**
 *  Validation
 */
	// Are there action and submit type?
	if ( this.$element.find(":submit").length == 0 || this.$element.attr("action") == "" ){ 
		alert("Form fatal error: The <input type=submit> is missing, or need to define a action attribute on the form tag.");
		return;
	};

	// Is there form in map instances?	
	if ( ch.utils.hasOwn(ch.instances, "form") && ch.instances.form.length > 0 ){
		for(var i = 0, j = ch.instances.form.length; i < j; i++){
			if(ch.instances.form[i].element === this.element){
				return { 
	                exists: true, 
	                object: ch.instances.form[i]
	            };
			};
		};
	};

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Form
     */ 
	var that = this;
	
	conf = ch.clon(conf);
	// Create the Messages for General Error
	if ( !ch.utils.hasOwn(conf, "messages") ) conf.messages = {};
	conf.messages["general"] = conf.messages["general"] || "Check for errors.";	
	
	// Disable HTML5 browser-native validations
	that.$element.attr("novalidate", "novalidate");	
	
	that.conf = conf;

/**
 *  Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);
	
	
/**
 *  Private Members
 */
 
    /**
     * A Boolean property that indicates is exists errors in the form.
     * @private
     * @name status
     * @type {Boolean}
     * @memberOf ch.Form
     */ 
	var status = true;
	
    /**
     * HTML snippet to show the general error on top of the form.
     * @private
     * @name $error
     * @type {jQuery Object}
     * @memberOf ch.Form
     */ 
	var $error = $("<p class=\"ch-validator\"><span class=\"ico error\">Error: </span>" + conf.messages["general"] + "</p>");
	
    /**
     * Inserts the general error snippet into the HTML. This implies a change in the document's flow, so it will trigger the CHANGE_LAYOUT Event.
     * @private
     * @function
     * @name createError
     * @memberOf ch.Form
     * @see ch.events.CHANGE_LAYOUT
     */ 
	var createError = function(){ 
		that.$element.before( $error );		
		$("body").trigger(ch.events.CHANGE_LAYOUT);
	};

    /**
     * Removes the general error snippet from the HTML. This implies a change in the document's flow, so it will trigger the CHANGE_LAYOUT Event.
     * @private
     * @function
     * @name removeError
     * @memberOf ch.Form
     * @see ch.events.CHANGE_LAYOUT
     */ 
 	var removeError = function(){
		$error.detach();
		$("body").trigger(ch.events.CHANGE_LAYOUT);
	};

    /**
     * Iterates all the Watchers defined as children, for each one of them will check it's active property and returns when finds an error.
     */
	var checkStatus = function(){
		// Check status of my childrens
		for(var i = 0, j = that.children.length; i < j; i ++){
			// Status error (cut the flow)
			if( that.children[i].active() ){
				if ( !status ) removeError();			
				createError();
				status = false;
				// Issue UI-332: On validation must focus the first field with errors.
				// Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
				that.children[i].element.focus();
				return;
			};
		};

		// Status OK (with previous error)
		if ( !status ) {
			removeError();
			status = true;
		};

	};
	
    /**
     * Executes all children's validations, if finds a error will trigger 'onError' callback, if no error is found will trigger 'onValidate' callback, and allways trigger 'afterValidate' callback.
     */
	var validate = function(){

        that.callbacks("beforeValidate");

		// Shoot validations
		for(var i = 0, j = that.children.length; i < j; i ++){
			that.children[i].validate();
		};

		checkStatus();
		
		status ? that.callbacks("onValidate") : that.callbacks("onError");  

        that.callbacks("afterValidate");
        
		return that;
	};

    /**
     * This methods triggers the 'beforSubmit' callback, then will execute validate() method, and if is defined triggers 'onSubmit' callback, at the end will trigger the 'afterSubmit' callback.
     */
	var submit = function(event){

        that.prevent(event);
        
        that.callbacks("beforeSubmit");

		validate(); // Validate start
		
		if ( status ){ // Status OK
			if ( !ch.utils.hasOwn(conf, "onSubmit") ) {
				that.element.submit();
			}else{
				that.callbacks("onSubmit");
			};
		};		

        that.callbacks("afterSubmit");
        
		return that;
	};

    /**
     * Use this method to clear al validations.
     */
	var clear = function(event){		
		that.prevent(event);		
		removeError();	
		for(var i = 0, j = that.children.length; i < j; i ++) that.children[i].reset(); // Reset helpers		
		
		that.callbacks("onClear");
		
		return that;
	};

    /**
     * Use this method to reset the form's input elements.
     */	
	var reset = function(event){
		clear();
		that.element.reset(); // Reset html form native
		that.callbacks("onReset");
		
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
     * @memberOf ch.Form
     */ 
	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Form
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Form
     */
	that["public"].type = that.type;
    /**
     * Watcher instances associated to this controller.
     * @public
     * @name children
     * @type {Collection}
     * @memberOf ch.Form
     */
	that["public"].children = that.children;
    /**
     * Collection of messages defined.
     * @public
     * @name messages
     * @type {String}
     * @memberOf ch.Form
     */
	that["public"].messages = conf.messages;
    /**
     * Executes all children's validations, if finds a error will trigger 'onError' callback, if no error is found will trigger 'onValidate' callback, and allways trigger 'afterValidate' callback.
     * @function
     * @name validate
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */
	that["public"].validate = function() { 
		validate(); 
		
		return that["public"]; 
	};
	
    /**
     * This methods triggers the 'beforSubmit' callback, then will execute validate() method, and if is defined triggers 'onSubmit' callback, at the end will trigger the 'afterSubmit' callback.
     * @function
     * @name submit
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */
	that["public"].submit = function() { 
		submit(); 
		
		return that["public"]; 
	};
	
    /**
     * Iterates all the Watchers defined as children, for each one of them will check it's active property and returns when finds an error.
     * @function
     * @name checkStatus
     * @memberOf ch.Form
     * @see ch.watcher.active
     */
	that["public"].checkStatus = function() { 
		checkStatus(); 
		
		return that["public"]; 
	};

    /**
     * Return the status value.
     * @function
     * @name getStatus
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */ 	
	that["public"].getStatus = function(){
		return status;	
	};

    /**
     * Use this method to clear al validations.
     * @function
     * @name clear
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */ 
	that["public"].clear = function() { 
		clear(); 
		
		return that["public"]; 
	};
    /**
     * Use this method to clear al validations.
     * @function
     * @name reset
     * @memberOf ch.Form
     * @returns {Chico-UI Object}
     */ 
	that["public"].reset = function() { 
		reset(); 
		
		return that["public"]; 
	};


/**
 *  Default event delegation
 */	

	// patch exists because the components need a trigger
	if (ch.utils.hasOwn(conf, "onSubmit")) {
		that.$element.bind('submit', function(event){ that.prevent(event); });
		// Delete all click handlers asociated to submit button >NATAN: Why?
			//Because if you want do something on submit, you need that the trigger (submit button) 
			//don't have events associates. You can add funcionality on onSubmit callback
		that.$element.find(":submit").unbind('click');
	};

	// Bind the submit
	that.$element.bind("submit", function(event){
		submit(event);
	});
	
	// Bind the reset
	that.$element.find(":reset, .resetForm").bind("click", function(event){ reset(event); });

	return that;
};

/**
 * Shows messages on the screen with a contextual floated UI-Component.
 * @name Helper
 * @class Helper
 * @augments ch.Floats
 * @memberOf ch
 * @param {Controller Object} o Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.helper = function(controller){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Helper
     */
	var that = this;

	var conf = {};		
		conf.cone = true;
		conf.position = {};
		conf.position.context = controller.reference;
		conf.position.offset = "15 0";
		conf.position.points = "lt rt";
		conf.cache = false;
	
	that.conf = conf;

/**
 *	Inheritance
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */



/**
 *  Protected Members
 */ 
	that.$trigger = that.$element;
	
	that.show = function(text) {

		if ( !that.active ) {
			// Load content and show!
			conf.content = '<p><span class="ico error">Error: </span>' + text + '</p>';
			that.parent.show();
			
		} else {
			// Just Reload content!
			that.$content.html('<p><span class="ico error">Error: </span>' + text + '</p>');
			
		};

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
     * @memberOf ch.Helper
     */ 
   	that["public"].uid = that.uid;
   	
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Helper
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Helper
     */
	that["public"].type = that.type;
    /**
     * The component's content.
     * @public
     * @name content
     * @type {String}
     * @memberOf ch.Helper
     */
	that["public"].content = that.content;
    /**
     * Shows component's content.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Helper
     */
	that["public"].show = function(text){
		that.show(text);
		
		return that["public"];
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Helper
     */ 
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Helper
     * @example
     * // Change helper's position.
     * $('input').required("message").helper.position({ 
     *    offset: "0 10",
     *    points: "lt lb"
     * });
     */
	that["public"].position = that.position;


/**
 *  Default event delegation
 */

    $("body").bind(ch.events.CHANGE_LAYOUT, function(){ 
        that.position("refresh");
    });

	 
	return that;
};

/**
 * Keyboard event controller utility to know wich keys are begin
 * @abstract
 * @name Keyboard  
 * @class Keyboard
 * @memberOF ch
 * @param {Event Object} event
 */ 
ch.keyboard = function(event) {
    
    /**
     * Map with references to key codes.
     * @private
     * @name keyCodes
     * @type {Object}
     * @memberOf ch.Keyboard
     */ 
    var keyCodes = {
        "13": "ENTER",
        "27": "ESC",
        "37": "LEFT_ARROW",
        "38": "UP_ARROW",
        "39": "RIGHT_ARROW",
        "40": "DOWN_ARROW"
    };
    
    if( !ch.utils.hasOwn(keyCodes, event.keyCode) ) return;
    
    ch.utils.document.trigger(ch.events.KEY[ keyCodes[event.keyCode] ], event);
    
};

/**
 * Is a contextual floated UI-Object.
 * @name Layer
 * @class Layer
 * @augments ch.Floats
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Tooltip
 * @see ch.Modal
 * @example
 * // Create a simple contextual layer
 * $("element").layer("<p>Content.</p>");
 */ 

ch.layer = function(conf) {
    
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Layer
     */ 
	var that = this;
	
	conf = ch.clon(conf);
	conf.cone = true;
	conf.classes = "box";
	conf.position = {};
	conf.position.context = that.$element;
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";

	that.conf = conf;

/**
 *	Inheritance
 *		
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);
    
/**
 *  Private Members
 */
 
    /**
     * Delay time to show component's contents.
     * @private
     * @name showTime
     * @type {Number}
     * @default 400
     * @memberOf ch.Layer
     */ 
    var showTime = conf.showTime || 400;
    /**
     * Delay time to hide component's contents.
     * @private
     * @name hideTime
     * @type {Number}
     * @default 400
     * @memberOf ch.Layer
     */ 
    var hideTime = conf.hideTime || 400;

    /**
     * Show timer instance.
     * @private
     * @name st
     * @type {Timer}
     * @memberOf ch.Layer
     */ 
	var st;
	/**
     * Hide timer instance.
     * @private
     * @name ht
     * @type {Timer}
     * @memberOf ch.Layer
     */ 
	var ht;
    /**
     * Starts show timer.
     * @private
     * @name showTimer
     * @function
     * @memberOf ch.Layer
     */ 
	var showTimer = function(){ st = setTimeout(that.show, showTime) };
    /**
     * Starts hide timer.
     * @private
     * @name hideTimer
     * @function
     * @memberOf ch.Layer
     */ 
	var hideTimer = function(){ ht = setTimeout(that.hide, hideTime) };
    /**
     * Clear all timers.
     * @private
     * @name clearTimers
     * @function
     * @memberOf ch.Layer
     */ 
	var clearTimers = function(){ clearTimeout(st); clearTimeout(ht); };

/**
 *  Protected Members
 */
	
	that.$trigger = that.$element;
	
	that.show = function(event) {
	
		// Reset all layers
		$.each(ch.instances.layer, function(i, e){ e.hide(); });
		//conf.position.context = that.$element;
		that.parent.show(event);

		that.$container.bind('click', function(event){ event.stopPropagation() });
        
        // Click
        if (conf.event == "click") {
			conf.close = true;
            // Document events
            $(document).one('click', that.hide);
            
        // Hover
        } else {      	
        	clearTimers();    
        	that.$container
        		.one("mouseenter", clearTimers)
        		.one("mouseleave", function(event){
					var target = event.srcElement || event.target;
					var relatedTarget = event.relatedTarget || event.toElement;
					var relatedParent = relatedTarget.parentNode;
					if ( target === relatedTarget || relatedParent === null || target.nodeName === "SELECT" ) return;
					hideTimer();
        		});
        };
        
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
     * @memberOf ch.Layer
     */
   	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Layer
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Layer
     */
	that["public"].type = that.type;
    /**
     * The component's content.
     * @public
     * @name content
     * @type {String}
     * @memberOf ch.Layer
     */
	that["public"].content = that.content;
    /**
     * Shows component's content.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Layer
     */
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Layer
     */	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Layer
     * @example
     * // Change layer's position.
     * $('input').layer("content").position({ 
     *    offset: "0 10",
     *    points: "lt lb"
     * });
     */
	that["public"].position = that.position;
	
/**
 *  Default event delegation
 */
	// Click
	if(conf.event === 'click') {
		// Local configuration
		conf.closeButton = true;

		// Trigger events
		that.$trigger
			.css('cursor', 'pointer')
			.bind('click', that.show);

	// Hover
	} else {
		// Trigger events
		that.$trigger
			.css('cursor', 'default')
			.bind('mouseenter', that.show)
			.bind('mouseleave', hideTimer);
	};

    // Fix: change layout problem
    $("body").bind(ch.events.CHANGE_LAYOUT, function(){ that.position("refresh") });
 

	return that;

};
/**
 * Manage collections with abstract lists. Create a list of objects, add, get and remove.
 * @abstract
 * @name List
 * @class List
 * @memberOf ch
 * @param {Array} [collection] Constructs a List with an optional initial collection
 */

ch.list = function( collection ) {

    var that = this;

    /**
     * @public
     * @name children
     * @type {Collection}
     * @memberOf ch.List
     */
    var _children = ( collection && ch.utils.isArray( collection ) ) ? collection : [] ;

    /**
     * Seek members inside the collection by index, query string or object comparison.
     * @private
     * @function
     * @name _find
     * @param {Number} [q]
     * @param {String} [q]
     * @param {Object} [q]
     * @param {Function} [a]
     * @return {Object} Returns the finded element
     * @memberOf ch.List
     */
    var _find = function(q, a) {
        // null search return the entire collection
        if ( !q ) {
            return _children;
        }

        var c = typeof q;
        // number? return a specific position
        if ( c === "number" ) {
            q--; // _children is a Zero-index based collection
            return ( a ) ? a.call( that , q ) : _children[q] ;
        }
        
        // string? ok, let's find it
        var t = size(), _prop, child;
        if ( c === "string" || c === "object" ) {
            while ( t-- ) {
                child = _children[t];
                // object or string strict equal
                if ( child === q ) {
                    return ( a ) ? a.call( that , t ) : child ;
                }
                // if isn't finded yet
                // search inside an object for a string
                for ( _prop in child ) {
                    if ( _prop === q || child[_prop] === q ) {
                        return ( a ) ? a.call( that , t ) : child ;
                    }
                } // end for
            } // end while
        }
    };

    /**
     * Adds a new child (or more) to the collection.
     * @public
     * @function
     * @name add
     * @param {String} [child]
     * @param {Object} [child]
     * @param {Array} [child]
     * @memberOf ch.List
     * @returns {Number} The index of the added child.
     * @returns {Collection} Returns the entire collecction if the input is an array.
     */
    var add = function( child ) {
        
        if ( ch.utils.isArray( child ) ) {
            var i = 0, t = child.length;
            for ( i; i < t; i++ ) {
                _children.push( child[i] );
            }            
            return _children;
        }
        return _children.push( child );
    };
    
    /**
     * Removes a child from the collection by index, query string or object comparison.
     * @public
     * @function
     * @name rem
     * @param {Number} [q]
     * @param {String} [q]
     * @param {Object} [q]
     * @return {Object} Returns the removed element
     * @memberOf ch.List
     */
    var rem = function( q ) {
        // null search return
        if ( !q ) {
            return that;
        }
        
        var remove = function( t ) {
            return _children.splice( t , 1 )[0];
        }

        return _find( q , remove );

    };

    /**
     * Get a child from the collection by index, query string or object comparison.
     * @public
     * @function
     * @name get
     * @param {Number} [q] Get a child from the collection by index number.
     * @param {String} [q] Get a child from the collection by a query string.
     * @param {Object} [q] Get a child from the collection by comparing objects.
     * @memberOf ch.List
     */
    var get = function( q ) {

        return _find( q );  

    };

    /**
     * Get the amount of children from the collection.
     * @public
     * @function
     * @name size
     * @return {Number}
     * @memberOf ch.List
     */

    var size = function() {
        return _children.length;    
    };

    /**
     * @public
     */
    var that = {
        children: _children,
        add: add,
        rem: rem,
        get: get,
        size: size
    };
    
    return that;
    
};/**
 * Menu is a UI-Component.
 * @name Menu
 * @class Menu
 * @augments ch.Controllers
 * @requires ch.Expando
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */
 
ch.menu = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Menu
     */
	var that = this;
	
	conf = ch.clon(conf);
	
	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

	/**
     * Indicates witch child is opened
     * @private
     * @type {Number}
     * @memberOf ch.Menu
     */
	var selected = conf.selected - 1;

	/**
     * Inits an Expando component on each list inside main HTML code snippet
     * @private
     * @name createLayout
     * @function
     * @memberOf ch.Menu
     */
	var createLayout = function(){
		
		// No slide efects for IE6 and IE7
		var efects = (ch.utils.html.hasClass("ie6") || ch.utils.html.hasClass("ie7")) ? false : true;
		
		// List elements
		that.$element.children().each(function(i, e){
			
			// Children of list elements
			var $child = $(e).children();
		
			// Anchor inside list
			if($child.eq(0).prop("tagName") == "A") {
				
				// Add class to list and anchor
				$(e).addClass("ch-bellows").children().addClass("ch-bellows-trigger");
				
				// Add anchor to that.children
				that.children.push( $child[0] );
				
				return;
			};
		
			// List inside list, inits an Expando
			var expando = $(e).expando({
				// Show/hide on IE6/7 instead slideUp/slideDown
				fx: efects,
				onShow: function(){
					// Updates selected tab when it's opened
					selected = i;
				}
			});
			
			// Add expando to that.children
			that.children.push( expando );

		});
	};
	
	/**
     * Opens specific Expando child and optionally grandson
     * @private
     * @function
     * @memberOf ch.Menu
     */
	var select = function(item){

		var child, grandson;
		
		// Split item parameter, if it's a string with hash
		if (typeof item == "string") {
			var sliced = item.split("#");
			child = sliced[0] - 1;
			grandson = sliced[1];
		
		// Set child when item is a Number
		} else {
			child = item - 1;
		};
		
		// Specific item of that.children list
		var itemObject = that.children[ child ];
		
		// Item as object
		if (ch.utils.hasOwn(itemObject, "uid")) {
			
			// Show this list
			itemObject.show();
			
			// Select grandson if splited parameter got a specific grandson
			if (grandson) $(itemObject.element).find("a").eq(grandson - 1).addClass("ch-menu-on");
			
			// Accordion behavior
			if (conf.accordion) {
				// Hides every that.children list that don't be this specific list item
				$.each(that.children, function(i, e){
					if(
						// If it isn't an anchor...
						(e.tagName != "A") &&
						// If there are an unique id...
						(ch.utils.hasOwn(e, "uid")) &&
						// If unique id is different to unique id on that.children list...
						(that.children[ child ].uid != that.children[i].uid)
					){
						// ...hide it
						e.hide();
					};
				});
				
			};
		
		// Item as anchor
		} else{
			// Just selects it
			that.children[ child ].addClass("ch-menu-on");
		};
		
		// onSelect callback
		that.callbacks("onSelect");

		return that;
	};
	
	/**
     * Binds controller's own click to expando triggers
     * @private
     * @name configureAccordion
     * @function
     * @memberOf ch.Menu
     */
	var configureAccordion = function(){

		$.each(that.children, function(i, e){
			$(e.element).find(".ch-expando-trigger").unbind("click").bind("click", function(){
				select(i + 1);
			});
		});
		
		return;
	};

/**
 *  Protected Members
 */

/**
 *  Public Members
 */
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Menu
     */ 	
	that["public"].uid = that.uid;
	
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Menu
     */
	that["public"].element = that.element;
	
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Menu
     */
	that["public"].type = that.type;
	
    /**
     * Select a specific children.
     * @public
     * @name select
     * @function
     * @memberOf ch.Menu
     */
	that["public"].select = function(item){
		select(item);

		return that["public"];
	};

/**
 *  Default event delegation
 */	
	
	// Sets component main class name
	that.$element.addClass('ch-menu');
	
	// Inits an Expando component on each list inside main HTML code snippet
	createLayout();
	
	// Accordion behavior
	if (conf.accordion) configureAccordion();
	
	// Select specific item if there are a "selected" parameter on component configuration object
    if (ch.utils.hasOwn(conf, "selected")) select(conf.selected);
    
	return that;
	
};


/**
 * Accordion is a UI-Component.
 * @name Accordion
 * @class Accordion
 * @augments ch.Menu
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.accordion = function(conf) {
    
    conf = conf || {};
	
	conf.accordion = true;

	return ch.menu.call(this, conf);

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Accordion
     */     
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Accordion
     */
    
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Accordion
     */
    
    /**
     * Select a specific children.
     * @public
     * @name select
     * @function
     * @memberOf ch.Accordion
     */
    
};

ch.factory({ component: "accordion" });

/**
 * Is a centered floated window UI-Object.
 * @name Modal
 * @class Modal
 * @augments ch.Floats
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Tooltip
 * @see ch.Layer
 */ 

ch.modal = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Modal
     */
  	var that = this;
	conf = ch.clon(conf);
	conf.ajax = ( !ch.utils.hasOwn(conf, "ajax") && !ch.utils.hasOwn(conf, "content") && !ch.utils.hasOwn(conf, "msg") ) ? true : conf.ajax; //Default	
	conf.closeButton = (that.type == "modal") ? true : false;
	conf.classes = "box";

	that.conf = conf;

/**
 *	Inheritance
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

    /**
     * Reference to the dimmer object, the gray background element.
     * @private
     * @name $dimmer
     * @type {jQuery Object}
     * @memberOf ch.Modal
     */
	var $dimmer = $("<div>").addClass("ch-dimmer");
	
	// Set dimmer height for IE6
	if (ch.utils.html.hasClass("ie6")) { $dimmer.height( parseInt(document.documentElement.clientHeight, 10) * 3) };
	
    /**
     * Reference to dimmer control, turn on/off the dimmer object.
     * @private
     * @name dimmer
     * @type {Object}
     * @memberOf ch.Modal
     */
	var dimmer = {
		on: function() { //TODO: posicionar el dimmer con el positioner
			$dimmer
				.appendTo("body")
				.css("z-index", ch.utils.zIndex ++)
				.fadeIn();
		
			if (that.type == "modal") {
				$dimmer.one("click", function(event){ that.hide(event) });
			};
			
			if (!ch.features.fixed) {
			  	ch.positioner({ element: $dimmer });
			};

			if ($("html").hasClass("ie6")) {
				$("select, object").css("visibility", "hidden");
			};
		},
		off: function() {
			$dimmer.fadeOut("normal", function(){
				$dimmer.detach();

				if ($("html").hasClass("ie6")) {
					$("select, object").css("visibility", "visible");
				};
			});
		}
	};

/**
 *  Protected Members
 */ 
	that.$trigger = that.$element;
	
	that.show = function(event) {	
		dimmer.on();
		that.parent.show(event);		
		that.$trigger.blur();
		
		return that;
	};
	
	that.hide = function(event) {
		dimmer.off();		
		that.parent.hide(event);

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
     * @memberOf ch.Modal
     */
   	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Modal
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Modal
     */
	that["public"].type = that.type;
    /**
     * The component's content.
     * @public
     * @name content
     * @type {String}
     * @memberOf ch.Modal
     */
	that["public"].content = that.content;
    /**
     * Shows component's content.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Modal
     */
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Modal
     */ 
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Modal
     */
	that["public"].position = that.position;
 
/**
 *  Default event delegation
 */	
	that.$trigger
		.css("cursor", "pointer")
		.bind("click", function(event){ that.show(event); });

	return that;
};


/**
 * Transition
 * @name Transition
 * @class Transition
 * @augments ch.Modal
 * @memberOf ch
 * @returns {Chico-UI Object}
 */
 
ch.transition = function(conf) {

    conf = conf || {};

	conf.closeButton = false;
	conf.msg = conf.msg || conf.content || "Please wait...";
	conf.content = $("<div>")
		.addClass("loading")
		.after( $("<p>").html(conf.msg) );

	return ch.modal.call(this, conf);

};

ch.factory({ component: 'transition' });

/**
 * Abstract representation of navs components.
 * @abstract
 * @name Navs
 * @class Navs
 * @augments ch.Object
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Dropdown
 * @see ch.Expando
 */
 
ch.navs = function(){
	
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Navs
     */ 
	var that = this;
	var conf = that.conf;
		conf.icon = (ch.utils.hasOwn(conf, "icon")) ? conf.icon : true;
		conf.open = conf.open || false;
		conf.fx = conf.fx || false;

/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);


/**
 *  Private Members
 */
    /**
     * Adds icon in trigger's content.
     * @private
     * @name createIcon
     * @function
     * @memberOf ch.Navs
     */
	var createIcon = function(){
		$("<span>")
			.addClass("ico")
			.html("drop")
			.appendTo( that.$trigger );

		return;
	};
	
/**
 *  Protected Members
 */ 	
     /**
     * Status of component
     * @public
     * @name active
     * @returns {Boolean}
     * @memberOf ch.Navs
     */
	that.active = false;

    /**
     * Shows component's content.
     * @public
     * @name show
     * @returns {Chico-UI Object}
     * @memberOf ch.Navs
     */
	that.show = function(event){
		that.prevent(event);

		if ( that.active ) {
			return that.hide(event);
		};
		
		that.active = true;

		that.$trigger.addClass("ch-" + that.type + "-trigger-on");
		
		// Animation
		if( conf.fx ) {
			that.$content.slideDown("fast", function(){
				//that.$content.removeClass("ch-hide");
				that.callbacks("onShow");
			});
		} else {
			that.$content.removeClass("ch-hide");
			that.callbacks("onShow");
		};
		
		return that;
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @returns {Chico-UI Object}
     * @memberOf ch.Navs
     */
	that.hide = function(event){
		that.prevent(event);
		
		if (!that.active) return;
		
		that.active = false;
		
		that.$trigger.removeClass("ch-" + that.type + "-trigger-on");

		// Animation
		if( conf.fx ) {
			that.$content.slideUp("fast", function(){
				//that.$content.addClass("ch-hide");
				that.callbacks("onHide");
			});
		} else {
			that.$content.addClass("ch-hide");
			that.callbacks("onHide");
		};
		
		return that;
	};

     /**
     * Create component's layout
     * @public
     * @name createLayout
     * @returns {void}
     * @memberOf ch.Navs
     */
	that.configBehavior = function(){
		that.$trigger
			.addClass("ch-" + that.type + "-trigger")
			.bind("click", function(event){ that.show(event); });

		that.$content
			.addClass("ch-" + that.type + "-content ch-hide");

		// Visual configuration
		if( conf.icon ) createIcon();
		if( conf.open ) that.show();

		return;
	};
	
/**
 *  Default event delegation
 */
	that.$element.addClass("ch-" + that.type);


	return that;
}

/**
 * Validate numbers.
 * @name Number
 * @class Number
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties.
 * @returns {Chico-UI Object}
 * @see ch.Min
 * @see ch.Max
 * @see ch.Price
 * @example
 * // Create a number validation
 * $("input").number("This field must be a number.");
 */

ch.number = function(conf) {

/**
 *  Constructor
 */

	conf = conf || {};
	
    conf.messages = conf.messages || {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
		conf.messages.number = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };
    
    // $.number("message"); support
	if ( !conf.number && !conf.min && !conf.max && !conf.price ) {
		conf.number = true;
	};
  
	// Add validation types
	conf.types = "number,min,max,price";
    
    // Define the conditions of this interface
    conf.conditions = [{
            name: "number",
            patt: /^([0-9\s]+)$/ 
    	},{
            name: "min",
            expr: function(a,b) { return a >= b } 
        },{
            name: "max",
            expr: function(a,b) { return a <= b } 
        },{
            name: "price",
            patt: /^(\d+)[.,]?(\d?\d?)$/ 
        }];


	return ch.watcher.call(this, conf);
    
};

/**
 * Validate a number with a minimun value.
 * @name Min
 * @class Min
 * @augments ch.Number
 * @memberOf ch
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Max
 * @see ch.Price
 * @example
 * $("input").min(10, "Write a number bigger than 10");
 */

ch.min = function(conf) {
    
    conf = conf || {};
	
	conf.min = conf.value;
	
	conf.value = null;
	
	delete conf.value;
	
	conf.messages = {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
		conf.messages.min = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.number.call(this, conf);
    
};

ch.factory({ component: 'min' });

/**
 * Validate a number with a maximun value.
 * @name Max
 * @class Max
 * @augments ch.Number
 * @memberOf ch
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Min
 * @see ch.Price
 * @example
 * $("input").max(10, "Write a number smaller than 10");
 */
 
ch.max = function(conf) {
    
    conf = conf || {};
	
	conf.max = conf.value;
	
	conf.value = null;
	
	delete conf.value;
	
	conf.messages = {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
		conf.messages.max = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.number.call(this, conf);
    
}

ch.factory({ component: 'max' });


/**
 * Validate a number with a price format.
 * @name Price
 * @class Price
 * @augments ch.Number
 * @memberOf ch
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Min
 * @see ch.Max
 * @example
 * $("input").price("Write valid price.");
 */
 
ch.price = function(conf) {
    
    conf = conf || {};
	
	conf.price = true;
	
	conf.value = null;
	
	delete conf.value;
	
	conf.messages = {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
		conf.messages.price = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.number.call(this, conf);
    
}

ch.factory({ component: 'price' });

/**
 * Object represent the abstract class of all UI Objects.
 * @abstract
 * @name Object
 * @class Object 
 * @memberOf ch
 * @requires ch.Get
 * @requires ch.Factory
 * @see ch.Controllers
 * @see ch.Floats
 * @see ch.Navs
 * @see ch.Watcher
 */
 
ch.object = function(){
	
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Object
     */ 
	var that = this;	
	var conf = that.conf;

/**
 *  Public Members
 */
	that.prevent = function(event) {
		if (event && typeof event == "object") {
		    event.preventDefault();
			event.stopPropagation();
		};
		
		return that;
	};
	
	//TODO: Analizar si unificar that.content (get and set) con that.loadContent(load).
	that.content = function(content){
		
		if ( content === undefined ) {
		
			var content = conf.content || conf.msg;
			return (content) ? (( ch.utils.isSelector(content) ) ? $(content) : content) : ((conf.ajax === true) ? (that.$trigger.attr('href') || that.$trigger.parents('form').attr('action')) : conf.ajax );
		
		} else {

			var cache = conf.cache;

			conf.cache = false;

			if ( ch.utils.isUrl(content) ) {
				conf.content = undefined;
				conf.ajax = content;
			} else {
				conf.ajax = false;
				conf.content = content;
			};

			if ( ch.utils.hasOwn(that, "$content") ) {
				that.$content.html(that.loadContent());
				that.position("refresh");
			};

			conf.cache = cache;

			return that["public"];
		};
		
	};

	that.loadContent = function() {
		// TODO: Properties validation
		//if( self.ajax && (self.content || self.msg) ) { alert('CH: "Ajax" and "Content" can\'t live together.'); return; };
		
		if( conf.ajax === true){
			
			// Load URL from href or form action
			conf.ajaxUrl = that.$element.attr('href') || that.$element.parents('form').attr('action');
			
			// Ajax parameters
			conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax
			
			// If trigger is a form button...
			if(that.$element.attr('type') == 'submit'){
				conf.ajaxType = that.$element.parents('form').attr('method') || 'GET';
				var serialized = that.$element.parents('form').serialize();
				conf.ajaxParams = conf.ajaxParams + ((serialized != '') ? '&' + serialized : '');
			};

			// Returns ajax results

			ch.get({method:"content", that:that});
			
			return '<div class="loading"></div>';
			
		} else if ( conf.ajax || (conf.msg && ch.utils.isUrl(conf.msg)) ){
			// Set url
			conf.ajaxUrl = conf.ajax || conf.msg;

			// Ajax parameters
			conf.ajaxParams = 'x=x'; // TODO refactor con el header de ajax

			// Returns ajax results

			ch.get({method:"content", that:that});
			return '<div class="loading"></div>';
			
		} else {
			var content = conf.content || conf.msg;		
			return ( ch.utils.isSelector(content) ) ? $(content).detach().clone().removeClass("ch-hide").show() : content;			
		};

	};

	that.callbacks = function(when){
		if( ch.utils.hasOwn(conf, when) ) {
			var context = ( that.controller ) ? that.controller["public"] : that["public"];
			return conf[when].call( context );
		};
	};
	
	that.position = function(o){
	
		switch(typeof o) {
		 
			case "object":
				conf.position.context = o.context || conf.position.context;
				conf.position.points = o.points || conf.position.points;
				conf.position.offset = o.offset || conf.position.offset;				
				conf.position.fixed = o.fixed || conf.position.fixed;
			
				ch.positioner(conf.position);
				return that["public"];
				break;
		
			case "string":
				if(o != "refresh"){
					alert("ChicoUI error: position() expected to find \"refresh\" parameter.");
				};

				ch.positioner(conf.position);
				return that["public"];   			
				break;
		
			case "undefined":
				return conf.position;
			    break;
		};
		
	};
	

	 
 	that["public"] = {};
	
	return that;
};

/**
 * Positioner is a utility that resolve positioning problem for all UI-Objects.
 * @abstract
 * @name Positioner
 * @class Positioner
 * @memberOf ch
 * @param {Position Object} o Object with positioning properties
 * @returns {jQuery Object}
 * @example
 * // First example
 * ch.positioner({
 *     element: $("#element1"),
 *     context: $("#context1"),
 *     points: "lt rt"                //  Element left-top point = Context left-bottom point
 * });
 * @example  
 * // Second example
 * ch.positioner({
 *     element: $("#element2"),
 *     context: $("#context2"),
 *     points: "lt lb"                //  Element center-middle point = Context center-middle point
 * });
 */
 
ch.positioner = function(o) {

    /**
     * Constructs a new positioning, get viewport size, check for relative parent's offests, 
     * find the context and set the position to a given element.
     * @constructs
     * @private
     * @function
     * @name initPosition
     * @memberOf ch.Positioner
     */
    var initPosition = function(){
        viewport = getViewport();
        parentRelative = getParentRelative();
        context = getContext();
        setPosition();        
    };


    /**
     * Object that contains all properties for positioning
     * @private
     * @name o
     * @type {Position Object}
     * @example
     * ch.Positioner({
     *   element: $element
     *   [context]: $element | viewport
     *   [points]: "cm cm"
     *   [offset]: "x y" 
     *   [hold]: false
     * });
     * @memberOf ch.Positioner
     */
	var o = o || this.conf.position;
        o.points = o.points || "cm cm";
        o.offset = o.offset || "0 0";
    
    /**
     * Reference to the DOM Element beign positioned
     * @private
     * @name element
     * @type {jQuery Object}
     * @memberOf ch.Positioner
     */
	var element = $(o.element);
		element.css("position","absolute");
    
    /**
     * Reference to the DOM Element that we will use as a reference
     * @private
     * @name context
     * @type {HTMLElement}
     * @memberOf ch.Positioner
     */
	var context;
    
    /**
     * Reference to the Window Object and it's size
     * @private
     * @name viewport
     * @type {Viewport Object}
     * @memberOf ch.Positioner
     */
	var viewport;
	
    /**
     * Reference to the element beign positioned
     * @private
     * @name parentRelative
     * @memberOf ch.Positioner
     */
	var parentRelative;

    /**
     * A map to reference the input points to output className
     * @private
     * @name classReferences
     * @memberOf ch.Positioner
     */
    var classReferences = {
		"lt lb": "bottom",
		"lb lt": "top",
		"rt rb": "bottom",
		"rb rt": "top",
		"lt rt": "right",
		"cm cm": "center"
	};

    /**
     * Array with offset information
     * @private
     * @name splittedOffset
     * @memberOf ch.Positioner
     */
    var splittedOffset = o.offset.split(" ");
   	/**
     * String with left offset information
     * @private
     */
   	var offset_left = parseInt(splittedOffset[0]);
   	/**
     * String with top offset information
     * @private
     */
    var offset_top = parseInt(splittedOffset[1]);

    /**
     * Get the viewport size
     * @private
     * @function
     * @name getViewport
     * @returns {Viewport Object}
     * @memberOf ch.Positioner
     */
	var getViewport = function() {
        
        var viewport, width, height, left, top, pageX, pageY, scrollBar = 30;	    
	    	    
        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
	    if (typeof window.innerWidth != "undefined") {
		    viewport = window;
			width = viewport.innerWidth - scrollBar;
			height = viewport.innerHeight;
			pageX = viewport.pageXOffset;
			pageY = viewport.pageYOffset;

			// Return viewport object
			return {
				element: viewport,			
				left: 0 + offset_left + pageX - scrollBar,
				top: 0 + offset_top + pageY,
				bottom: height + pageY,
				right: width + pageX,
				width: width,
				height: height
			}
		}
        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        // older versions of IE - viewport = document.getElementsByTagName('body')[0];		
		else {
			viewport = document.documentElement;
			width = viewport.clientWidth - scrollBar;
			height = viewport.clientHeight;
			pageX = viewport.scrollLeft;
			pageY = viewport.scrollTop;
			
			// Return viewport object
			return {
				element: viewport,			
				left: 0 + offset_left + pageX,
				top: 0 + offset_top + pageY,
				bottom: height + pageY,
				right: width + pageX,
				width: width,
				height: height
			}
	    }
	    
	};
	
 	
	/**
     * Calculate css left and top to element on context
     * @private
     * @function
     * @name getPosition
     * @returns {Axis Object}
     * @memberOf ch.Positioner
     */
	var getPosition = function(unitPoints) {		     
		// my_x and at_x values together
		// cache properties 
		var contextLeft = context.left;
		var contextTop = context.top;
		var contextWidth = context.width;
		var contextHeight = context.height;
		var elementWidth = element.outerWidth();
		var elementHeight = element.outerHeight();
		
		var xReferences = {
			ll: contextLeft,
			lr: contextLeft + contextWidth,
			rr: contextLeft + contextWidth - elementWidth,
			cc: contextLeft + contextWidth/2 - elementWidth/2
			// TODO: lc, rl, rc, cl, cr
		}
		
		// my_y and at_y values together
		var yReferences = {
			// jquery 1.6 do not support offset on IE
			tt: contextTop,
			tb: contextTop + contextHeight,
			bt: contextTop - elementHeight,
			mm: contextTop + contextHeight/2 - elementHeight/2
			// TODO: tm, bb, bm, mt, mb
		}
		
		var axis = {
			left: xReferences[unitPoints.my_x + unitPoints.at_x],
			top: yReferences[unitPoints.my_y + unitPoints.at_y]	
		} 

		return axis;
	};
	
    /**
     * Evaluate viewport spaces and set points
     * @private
     * @function
     * @name calculatePoints
     * @returns {Styles Object}
     * @memberOf ch.Positioner
     */
	var calculatePoints = function(points, unitPoints){					
		// Default styles
        var styles = getPosition(unitPoints);
        	styles.direction = classReferences[points];
		
		// Hold behavior
		if (o.hold) return styles;

        // Check viewport limits	
		// Bottom to top
		if ( (points == "lt lb") && ((styles.top + parentRelative.top + element.outerHeight()) > viewport.bottom) ) { // Element bottom > Viewport bottom
			unitPoints.my_y = "b";
			unitPoints.at_y = "t";

			//store old styles
			stylesBottom = styles;
			
			// New styles		 
			styles = getPosition(unitPoints);
			styles.direction = "top";
			styles.top -= (2 * offset_top);
		
			// Top to Bottom - Default again 
			if(styles.top + parentRelative.top < viewport.top){
				unitPoints.my_y = "t";
				unitPoints.at_y = "b";
				styles = stylesBottom;
				styles.direction = "bottom";
			};
		};
		
		// Left to right
		if ( (styles.left + parentRelative.left + element.outerWidth()) > viewport.right ) { // Element right > Viewport right
			unitPoints.my_x = "r";
			unitPoints.at_x = "r";
			
			//store old styles
			stylesLeft = styles;
			
			// New styles
			var current = styles.direction;
			styles = getPosition(unitPoints);
			styles.direction = current + "-right";						
			styles.left -= (2 * offset_left);
			if(current == "top") styles.top -= (2 * offset_top);
			
			// Right to Left - Default again 
			if(styles.left < viewport.left){
				unitPoints.my_y = "l";
				unitPoints.at_y = "l";
				styles = stylesLeft;
			};
		};

		return styles;
	};
	
	
    /**
     * Set position to element
     * @private
     * @function
     * @name setPosition
     * @memberOf ch.Positioner
     */
	var setPosition = function() {
		// Separate points config
        var splitted = o.points.split(" ");
        
        var unitPoints = {
        	my_x: splitted[0].slice(0,1),
        	my_y: splitted[0].slice(1,2),
        	at_x: splitted[1].slice(0,1),
        	at_y: splitted[1].slice(1,2)
        }

		var styles = calculatePoints(o.points, unitPoints);

		element
			.css({
				left: styles.left,
				top: styles.top
			})
			.removeClass( "ch-top ch-left ch-bottom ch-right ch-bottom-right ch-top-right  ch-right-right" )
			.addClass( "ch-" + styles.direction );
				
		if ( ch.utils.hasOwn(context, "element") && context.element !== ch.utils.window[0] ){
			$(context.element)
				.removeClass( "ch-top ch-left ch-bottom ch-right ch-bottom-right ch-top-right ch-right-right" )
				.addClass( "ch-" + styles.direction );
		};

	};	

    /**
     * Get context element for positioning, if ain't one, select the viewport as context.
     * @private
     * @function
     * @name getContext
     * @returns {Context Object}
     * @memberOf ch.Positioner
     */
	var getContext = function(){
	    
	    if (!o.context) {
	        return viewport;
	    }
	     
        var contextOffset = o.context.offset();
        
        context = {
            element: o.context,
            top: contextOffset.top + offset_top - parentRelative.top,
            left: contextOffset.left + offset_left - parentRelative.left,
            width: o.context.outerWidth(),
            height: o.context.outerHeight()
        };
        
        return context;	        
	    
	};
	
    /**
     * Get offset values from relative parents
     * @private
     * @function
     * @name getParentRelative
     * @returns {Offset Object}
     * @memberOf ch.Positioner 
     */
	var getParentRelative = function(){
		
		var relative = {};
			relative.left = 0;
			relative.top = 0;
		
		var parent = element.offsetParent();

		if ( parent.css("position") == "relative" ) {
			
			var borderLeft = (parent.outerWidth() - parent.width() - ( parseInt(parent.css("padding-left")) * 2 )) / 2;
			
			relative = parent.offset();
			relative.left -= offset_left - borderLeft;
			relative.top -= offset_top;
			
		};
		
		return {
			left: relative.left,
			top: relative.top
		};
		
	};
	
 	 
	var scrolled = false;

	// Scroll and resize events
	// Tested on IE, Magic! no lag!!
	ch.utils.window.bind("resize scroll", function() {
		scrolled = true;
	});
	
	setInterval(function() {
	    if( !scrolled ) return;
		scrolled = false;
		// Hidden behavior
		if( element.css("display") === "none" ) return; 	
		initPosition();
	}, 250);

   /**
    * @ignore
    */
    initPosition();
	
	// Return the reference to the positioned element
	return $(element);
};


/**
 * Pre-load is an utility to preload images on browser's memory. An array of sources will iterate and preload each one, a single source will do the same thing.
 * @abstract
 * @name Preload
 * @class Preload
 * @memberOf ch
 * @param {Array} [arr] Collection of image sources
 * @param {String} [str] A single image source
 * @example
 * ch.preload(["img1.jpg","img2.jpg","img3.png"]);
 * @example
 * ch.preload("logo.jpg");
 */
ch.preload = function(arr) {

    if (typeof arr === "string") {
        arr = (arr.indexOf(",") > 0) ? arr.split(",") : [arr] ;
    }

    for (var i=0;i<arr.length;i++) {
                
        var o = document.createElement("object");
            o.data = arr[i]; // URL
            
        var h = document.getElementsByTagName("head")[0];
            h.appendChild(o);
            h.removeChild(o); 
    }       
};
/**
 * Required interface for Watcher.
 * @name Required
 * @class Required
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Number
 * @see ch.String
 * @see ch.Custom
 * @example
 * // Simple validation
 * $("input").required("This field is required");
 * @see ch.Watcher
 */

ch.required = function(conf) {
/**
 *  Constructor
 */
	
	conf = conf || {};
	
    conf.messages = {};

    if ( ch.utils.hasOwn(conf, "msg") ) {     	
    	conf.messages.required = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };
    
	// Define the validation interface    
    conf.required = true;
    
    // Add validation types
	conf.types = "required";
    // Define the conditions of this interface
    conf.conditions = [{
        name: "required"
    }];
	
	return ch.watcher.call(this, conf);
    
};
/**
 * Abstract Slider.
 * @abstract
 * @name Slider
 * @class Slider
 * @augments ch.Object
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.sliders = function() {

/**
 *  Constructor
 */
	var that = this;
	var conf = that.conf;
	
/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);
    
/**
 *  Private Members
 */
	

/**
 *  Protected Members
 */ 
			
/**
 *  Public Members
 */
 
	that.active = false;
	
	return that;
	
};
/**
 * Validate strings.
 * @name String
 * @class String
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Email
 * @see ch.Url
 * @see ch.MaxLength
 * @see ch.MinLength
 * @example
 * // Create a string validation
 * $("input").string("This field must be a string.");
 */

ch.string = function(conf) {

/**
 *  Constructor
 */
	conf = conf || {};
	
    conf.messages = conf.messages || {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
		conf.messages.string = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };
    
    // $.string("message"); support
    if ( !conf.text && !conf.email && !conf.url && !conf.maxLength && !conf.minLength ) {
        conf.text = true;
    };

	// Add validation types
	conf.types = "text,email,url,minLength,maxLength";
    
    // Define the conditions of this interface
    conf.conditions = [{
            name: "text", 
            patt: /^([a-zA-Z\s]+)$/ 
        },{
            name:"email",
            patt: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/ 
        },{
            name: "url",
            patt: /^((https?|ftp|file):\/\/|((www|ftp)\.)|(\/|.*\/)*)[a-z0-9-]+((\.|\/)[a-z0-9-]+)+([/?].*)?$/ 
        },{
            name: "minLength",
            expr: function(a,b) { return a.length >= b } 
        },{
            name: "maxLength",
            expr: function(a,b) { return a.length <= b } 
        }];
        // Conditions map TODO: uppercase, lowercase, varchar

	return ch.watcher.call(this, conf);
    
};


/**
 * Validate email sintaxis.
 * @name Email
 * @class Email
 * @augments ch.String
 * @memberOf ch
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Url
 * @see ch.MaxLength
 * @see ch.MinLength
 * @example
 * // Create a email validation
 * $("input").email("This field must be a valid email.");
 */
 
ch.email = function(conf) {
    
    conf = conf || {};
	
	conf.email = true;
	
	conf.messages = {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
		conf.messages.email = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.string.call(this, conf);
    
};

ch.factory({ component: 'email' });


/**
 * Validate URL sintaxis.
 * @name Url
 * @class Url
 * @augments ch.String
 * @memberOf ch
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Email
 * @see ch.MaxLength
 * @see ch.MinLength
 * @example
 * // Create a URL validation
 * $("input").url("This field must be a valid URL.");
 */

ch.url = function(conf) {
    
    conf = conf || {};
	
	conf.url = true;
	
	conf.messages = {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
		conf.messages.url = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.string.call(this, conf);
    
};

ch.factory({ component: 'url' });


/**
 * Validate a minimun amount of characters.
 * @name MinLength
 * @class MinLength
 * @augments ch.String
 * @memberOf ch
 * @param {Number} value Minimun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Email
 * @see ch.Url
 * @see ch.MaxLength
 * @example
 * // Create a minLength validation
 * $("input").minLength(10, "At least 10 characters..");
 */

ch.minLength = function(conf) {
    
    conf = conf || {};
	
	conf.minLength = conf.value;
	
	conf.messages = {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
		conf.messages.minLength = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.string.call(this, conf);
    
};

ch.factory({ component: 'minLength' });


/**
 * Validate a maximun amount of characters.
 * @name MaxLength
 * @class MaxLength
 * @augments ch.String
 * @memberOf ch
 * @param {Number} value Maximun number value.
 * @param {String} [message] Validation message.
 * @returns {Chico-UI Object}
 * @see ch.Email
 * @see ch.Url
 * @see ch.MinLength
 * @example
 * // Create a maxLength validation
 * $("input").maxLength(10, "No more than 10 characters..");
 */

ch.maxLength = function(conf) {
    
    conf = conf || {};
	
	conf.maxLength = conf.value;
	
	conf.messages = {};

    if ( ch.utils.hasOwn(conf, "msg") ) { 
		conf.messages.maxLength = conf.msg;
    	conf.msg = null;
    	delete conf.msg;
    };

	return ch.string.call(this, conf);
    
};

ch.factory({ component: 'maxLength' });
/**
 * TabNavigator UI-Component for static and dinamic content.
 * @name TabNavigator
 * @class TabNavigator
 * @augments ch.Controllers
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.tabNavigator = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.TabNavigator
     */
	var that = this;

	conf = ch.clon(conf);

	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

    /**
     * The actual location hash, is used to know if there's a specific tab selected.
     * @private
     * @name hash
     * @type {String}
     * @memberOf ch.TabNavigator
     */
	var hash = window.location.hash.replace("#!", "");
    /**
     * A boolean property to know if the some tag should be selected.
     * @private
     * @name hashed
     * @type {Boolean}
     * @default false
     * @memberOf ch.TabNavigator
     */
    var hashed = false;
    /**
     * Get wich tab is selected.
     * @private
     * @name selected
     * @type {Number}
     * @memberOf ch.TabNavigator
     */
    var selected = conf.selected - 1 || conf.value - 1 || 0;
    /**
     * Create controller's children.
     * @private
     * @name createTabs
     * @function
     * @memberOf ch.TabNavigator
     */
	var createTabs = function(){

		// Children
		that.$element.children().eq(0).addClass("ch-tabNavigator-triggers").find("a").each(function(i, e){

			// Tab context
			var tab = {};
				tab.uid = that.uid + "#" + i;
				tab.type = "tab";
				tab.element = e;
				tab.$element = $(e);
				tab.controller = that["public"];

			// Tab configuration
			var conf = {};
				conf.open = (selected == i);
				conf.onShow = function(){
					selected = i;
				};

			// Callbacks
			if ( ch.utils.hasOwn(that.conf, "onContentLoad") ) conf.onContentLoad = that.conf.onContentLoad;
			if ( ch.utils.hasOwn(that.conf, "onContentError") ) conf.onContentError = that.conf.onContentError;

			// Create Tabs
			that.children.push(
				ch.tab.call(tab, conf)
			);

			// Bind new click to have control
			$(e).unbind("click").bind("click", function(event){
				that.prevent(event);
				select(i + 1);
			});

		});

		return;

	};
    /**
     * Select a child to show its content.
     * @private
     * @function
     * @memberOf ch.TabNavigator
     */
	var select = function(tab){

		tab = that.children[tab - 1];
		
		if(tab === that.children[selected]) return; // Don't click me if I'm open

		// Hide my open bro
		$.each(that.children, function(i, e){
			if(tab !== e) e.hide();
		});

		tab.show();

        //Change location hash
		window.location.hash = "#!" + tab.$content.attr("id");	
		
		// Callback
		that.callbacks("onSelect");
		
        return that;
	};

/**
 *  Protected Members
 */ 
    /**
     * The component's content.
     * @private
     * @name $content
     * @type {jQuery Object}
     * @memberOf ch.TabNavigator
     */
	that.$content = that.$element.children().eq(1).addClass("ch-tabNavigator-content box");

    
/**
 *  Public Members
 */

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.TabNavigator
     */
	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.TabNavigator
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.TabNavigator
     */
	that["public"].type = that.type;
    /**
     * Children instances associated to this controller.
     * @public
     * @name children
     * @type {Collection}
     * @memberOf ch.TabNavigator
     */
	that["public"].children = that.children;
    /**
     * Select a specific child.
     * @public
     * @function
     * @name select
     * @param {Number} tab Tab's index.
     * @memberOf ch.TabNavigator
     */
	that["public"].select = function(tab){
		select(tab);
		
		return that["public"];
	};
    /**
     * Returns the selected child's index.
     * @public
     * @function
     * @name getSelected
     * @returns {Number} selected Tab's index.
     * @memberOf ch.TabNavigator
     */	
	that["public"].getSelected = function(){ return (selected + 1); };

/**
 *  Default event delegation
 */	

    	that.$element.addClass('ch-tabNavigator');

	createTabs();

	//Default: Load hash tab or Open first tab	
	for(var i = that.children.length; i--; ){
		if ( that.children[i].$content.attr("id") === hash ) {
			select(i + 1);
			
			hashed = true;
			
			break;
		};
	};

	return that;
	
};



/**
 * Simple unit of content for TabNavigators.
 * @abstract
 * @name Tab
 * @class Tab
 * @augments ch.Navs
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.tab = function(conf){
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Tab
     */
    var that = this;

	conf = ch.clon(conf);
	conf.icon = false;
	
	that.conf = conf;

	
/**
 *	Inheritance
 */

	that = ch.navs.call(that);
	that.parent = ch.clon(that);

/**
 *  Private Members
 */
    /**
     * Creates the basic structure for the tab's content.
     * @private
     * @name createContent
     * @function
     * @memberOf ch.TabNavigator
     */
	var createContent = function(){
		var href = that.element.href.split("#");
		var controller = that.$element.parents(".ch-tabNavigator");
		var content = controller.find("#" + href[1]);
		
		// If there are a tabContent...
		if ( content.length > 0 ) {
			
			return content;
		
		// If tabContent doesn't exists        
		} else {
			// Set ajax configuration
			conf.ajax = true;

			// Create tabContent
			return $("<div>")
				.attr("id", (href.length == 2) ? href[1] : "ch-tab" + that.uid.replace("#","-") )
				.addClass("ch-hide")
				.appendTo( controller.children().eq(1) );
		};

	};

/**
 *  Protected Members
 */ 
    /**
     * Reference to the trigger element.
     * @private
     * @name $trigger
     * @type {jQuery Object}
     * @memberOf ch.Tab
     */
	that.$trigger = that.$element;

    /**
     * The component's content.
     * @private
     * @name $content
     * @type {jQuery Object}
     * @memberOf ch.Tab
     */	
	that.$content = createContent();

    /**
     * Process the show event.
     * @private
     * @function
     * @name show
     * @returns {jQuery Object}
     * @memberOf ch.Tab
     */ 
	that.show = function(event){
		that.prevent(event);

		// Load my content if I'need an ajax request 
		if( that.$content.html() == "" ) that.$content.html( that.loadContent() );

		// Show me
		that.parent.show(event);
		
		return that;
	};

/**
 *  Public Members
 */
	
	
/**
 *  Default event delegation
 */

	that.configBehavior();

	
	return that;
}

/**
 * Simple Tooltip UI-Object.
 * @name Tooltip
 * @class Tooltip
 * @augments ch.Floats
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.tooltip = function(conf) {
    
    
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Tooltip
     */
	var that = this;
	
	conf = ch.clon(conf);
	conf.cone = true;
	conf.content = that.element.title;	
	conf.position = {};
	conf.position.context = $(that.element);
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";
	
	that.conf = conf;
	
/**
 *	Inheritance
 *		
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

    
/**
 *  Protected Members
 */     
    that.$trigger = that.$element;

    that.show = function(event) {
        that.$trigger.attr('title', ''); // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.parent.show(event);
		
		return that;
	};
	
    that.hide = function(event) {
		that.$trigger.attr('title', conf.content);
		that.parent.hide(event);
		
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
     * @memberOf ch.Tooltip
     */
    that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Tooltip
     */
    that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Tooltip
     */
    that["public"].type = that.type;
    /**
     * The component's content.
     * @public
     * @name content
     * @type {String}
     * @memberOf ch.Tooltip
     */
    that["public"].content = that.content;
    /**
     * Shows component's content.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Tooltip
     */
	that["public"].show = function(){
		that.show();

		return that["public"];
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Tooltip
     */ 
	that["public"].hide = function(){
		that.hide();

		return that["public"];
	};
    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Tooltip
     */
	that["public"].position = that.position;

/**
 *  Default event delegation
 */	
 	
	that.$trigger
		.bind('mouseenter', that.show)
		.bind('mouseleave', that.hide);

    // Fix: change layout problem
    $("body").bind(ch.events.CHANGE_LAYOUT, function(){ that.position("refresh") });


	return that;
};
/**
 * Viewer UI-Component for images, videos and maps.
 * @name Viewer
 * @class Viewer
 * @augments ch.Controllers
 * @requires ch.Carousel
 * @requires ch.Zoom
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.viewer = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Viewer
     */
 	var that = this;
	conf = ch.clon(conf);
	that.conf = conf;
	
/**
 *  Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);
	
/**
 *  Private Members
 */
 
    /**
     * Reference to the viewer's visual object.
     * @private
     * @name $viewer
     * @type {jQuery Object}
     * @memberOf ch.Viewer
     */
	var $viewer = that.$element.addClass("ch-viewer");
	conf.width = $viewer.outerWidth();
	conf.height = $viewer.outerHeight();

    /**
     * Reference to the viewer's internal content.
     * @private
     * @name $content
     * @type {jQuery Object}
     * @memberOf ch.Viewer
     */
	var $content = $viewer.children().addClass("ch-viewer-content");

    /**
     * Reference to the viewer's display element.
     * @private
     * @name $display
     * @type {jQuery Object}
     * @memberOf ch.Viewer
     */
	var $display = $("<div>")
		.addClass("ch-viewer-display")
		.append( $content )
		.appendTo( $viewer )
		.carousel({
			width: conf.width,
			arrows: false,
			onMove: function(){
				var carousel = this;
				var page = carousel.getPage();
				that.move(page);

				// Resize display
				var currentHeight = $(itemsChildren[page - 1]).height();
				$viewer.find(".ch-mask").eq(0).height(currentHeight);
			}
		})

    /**
     * Collection of viewer's children.
     * @private
     * @name items
     * @type {Collection}
     * @memberOf ch.Viewer
     */
	var items = $content.children();
    /**
     * Amount of children.
     * @private
     * @name itemsAmount
     * @type {Number}
     * @memberOf ch.Viewer
     */
	var itemsAmount = items.length;
    /**
     * Collection of anchors finded on items collection.
     * @private
     * @name itemsAnchor
     * @type {Collection}
     * @memberOf ch.Viewer
     */
	var itemsAnchor = items.children("a");
    /**
     * Collection of references to HTMLIMGElements or HTMLObjectElements.
     * @private
     * @name itemsChildren
     * @type {Object}
     * @memberOf ch.Viewer
     */
	var itemsChildren = items.find("img, object");
	
	/**
	 * 	Zoom
	 */
	if( ch.utils.hasOwn(ch, "zoom") ) {

		var i = 0;
		
		// Initialize zoom on imgs loaded
		itemsChildren.filter("img").bind("load", function(){

			var _parentNode = this.parentNode;
			
			var component = {
				uid: that.uid + "#" + i,
				type: "zoom",
				element: _parentNode,
				$element: $(_parentNode)
			};
		
			var config = {
				context: $viewer,
				onShow: function(){
					var _rest = (ch.utils.body.outerWidth() - $viewer.outerWidth());
					var _zoomDisplayWidth = (conf.width < _rest)? conf.width : (_rest - 65 );
					this.width( _zoomDisplayWidth );
					this.height( $viewer.height() );
				}
			};

			that.children.push( ch.zoom.call(component, config) );

			i += 1;
		});

	};
	
	/**
	 * 	Thumbnails
	 */
    /**
     * Creates all thumbnails and configure it as a Carousel.
     * @private
     * @function
     * @name createThumbs
     * @memberOf ch.Viewer
     */
	var createThumbs = function(){
	
		var structure = $("<ul>").addClass("carousel");
		
		$.each(items, function(i, e){
			
			var thumb = $("<li>").bind("click", function(event){
				that.prevent(event);
				that.move(i + 1);
			});
			
			// Thumbnail
			if( $(e).children("link[rel=thumb]").length > 0 ) {
				$("<img>")
					.attr("src", $(e).children("link[rel=thumb]").attr("href"))
					.appendTo( thumb );
			
			// Google Map
			//} else if( ref.children("iframe").length > 0 ) {
				// Do something...
					
			// Video
			} else if( $(e).children("object").length > 0 || $(e).children("embed").length > 0 ) {
				$("<span>").html("Video").appendTo( thumb.addClass("ch-viewer-video") );
			};
			
			structure.append( thumb );
		});
		
		var self = {};
		
			self.children = structure.children();
			
			self.selected = 1;
		
			self.carousel = that.children[0] = $("<div>")
				.addClass("ch-viewer-triggers")
				.append( structure )
				.appendTo( $viewer )
				.carousel({ width: conf.width });
		
		return self;
	};
	
    /**
     * Moves the viewer's content.
     * @private
     * @function
     * @name move
     * @param {Number} item
     * @returns {Chico-UI Object} that
     * @memberOf ch.Viewer
     */
	var move = function(item){
		// Validation
		if(item > itemsAmount || item < 1 || isNaN(item)) return that;

		// Visual config
		$(thumbnails.children[thumbnails.selected - 1]).removeClass("ch-thumbnail-on"); // Disable thumbnail
		$(thumbnails.children[item - 1]).addClass("ch-thumbnail-on"); // Enable next thumbnail
		
		// Move Display carousel
		$display.goTo(item);
		
		// Move thumbnails carousel if item selected is in other page
		var nextThumbsPage = Math.ceil( item / thumbnails.carousel.getItemsPerPage() );
		if(thumbnails.carousel.getPage() != nextThumbsPage) thumbnails.carousel.goTo( nextThumbsPage );
		
		// Buttons behavior
		if(item > 1 && item < itemsAmount){
			arrows.prev.on();
			arrows.next.on();
		} else {
			if(item == 1){ arrows.prev.off(); arrows.next.on(); };
			if(item == itemsAmount){ arrows.next.off(); arrows.prev.on(); };
		};
		
		// Refresh selected thumb
		thumbnails.selected = item;
		
		// Callback
		that.callbacks("onMove");
	
		return that;
	};
	
    /**
     * Handles the visual behavior of arrows
     * @private
     * @name arrows
     * @type {Object}
     * @memberOf ch.Viewer
     */
 	var arrows = {};
	
	arrows.prev = {
		$element: $("<p>").addClass("ch-viewer-prev").bind("click", function(){ that.prev(); }),
		on: function(){ arrows.prev.$element.addClass("ch-viewer-prev-on") },
		off: function(){ arrows.prev.$element.removeClass("ch-viewer-prev-on") }
	};
	
	arrows.next = {
		$element: $("<p>").addClass("ch-viewer-next").bind("click", function(){ that.next(); }),
		on: function(){ arrows.next.$element.addClass("ch-viewer-next-on") },
		off: function(){ arrows.next.$element.removeClass("ch-viewer-next-on") }
	};

/**
 *  Protected Members
 */ 
	
	that.prev = function(){
		that.move( thumbnails.selected - 1 );
		
		return that;
	};
	
	that.next = function(){
		that.move( thumbnails.selected + 1 );
		
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
     * @memberOf ch.Viewer
     */
	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Viewer
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Viewer
     */
	that["public"].type = that.type;
    /**
     * Children instances associated to this controller.
     * @public
     * @name children
     * @type {Collection}
     * @memberOf ch.Viewer
     */
 	that["public"].children = that.children;
	
	// Full behavior
	if(itemsAmount > 1) {
        /**
         * Selects a specific viewer's child.
         * @public
         * @function
         * @name moveTo 
         * @param {Number} item Recieve a index to select a children.
         * @memberOf ch.Viewer
         */
        // TODO: This method should be called 'select'?
		that["public"].moveTo = function(item){ that.move(item); return that["public"]; };
        /**
         * Selects the next child available.
         * @public
         * @function
         * @name next
         * @memberOf ch.Viewer
         */
		that["public"].next = function(){ that.next(); return that["public"]; };
        /**
         * Selects the previous child available.
         * @public
         * @function
         * @name prev
         * @memberOf ch.Viewer
         */
		that["public"].prev = function(){ that.prev(); return that["public"]; };
        /**
         * Get the index of the selected child.
         * @public
         * @function
         * @name getSelected
         * @memberOf ch.Viewer
         */
		that["public"].getSelected = function(){ return thumbnails.selected; }; // Is this necesary???
		// ...

/**
 *  Default event delegation
 */
	
		// ...
		
		// Create thumbnails
		var thumbnails = createThumbs();
		
		// Create Viewer buttons
		$viewer.append( arrows.prev.$element ).append( arrows.next.$element );
		
		// Create movement method
		that.move = move;
		that.move(1); // Move to the first item without callback
		arrows.next.on();
	};

	$viewer.find(".ch-mask").eq(0).height( $(itemsChildren[0]).height() );

	ch.utils.avoidTextSelection(that.element);

	return that;
};

/**
 * Watcher is a validation engine for html forms elements.
 * @abstract
 * @name Watcher
 * @class Watcher
 * @augments ch.Object
 * @memberOf ch
 * @requires ch.Form
 * @requires ch.Positioner
 * @requires ch.Events
 * @param {Configuration Object} o Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Required
 * @see ch.String
 * @see ch.Number
 * @see ch.Custom
 */

ch.watcher = function(conf) {

// Private members

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Watcher
     */
	var that = this;
	conf = ch.clon(conf);
	that.conf = conf;	

    // Inheritance
    that = ch.object.call(that);
    that.parent = ch.clon(that);
	
	
    /**
     * Reference to a ch.form controller. If there isn't any, the Watcher instance will create one.
     * @private
     * @name controller
     * @type {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	var controller = (function() {
		if ( ch.utils.hasOwn(ch.instances, "form") && ch.instances.form.length > 0 ) {	
		  var i = 0, j = ch.instances.form.length; 
		  for (i; i < j; i ++) {
				if (ch.instances.form[i].element === that.$element.parents("form")[0]) {
					return ch.instances.form[i]; // Get my parent
				};
			};
		} else {
			that.$element.parents("form").form();
			var last = (ch.instances.form.length - 1);
			return ch.instances.form[last]; // Set my parent
		};
	})();
	
    
    /**
     * Search for instances of Watchers with the same trigger, and then merge it's properties with it.
     * @private
     * @function
     * @name checkInstance
     * @returns {Instance Object}
     * @memberOf ch.Watcher
     */	
	var checkInstance = function() {
        var instance = ch.instances.watcher;
        if ( instance && instance.length > 0 ) {
			for (var i = 0, j = instance.length; i < j; i ++) {
                if (instance[i].element !== that.element) continue;
        	    // Merge Conditions        	    
                $.merge(instance[i].conditions, that.conditions);
				return { 
				    exists: true, 
				    object: instance[i] 
			    };
			    
            };
        };
    };

    /**
     * Run all validations again and do form.checkStatus()
     * @private
     * @function
     * @name revalidate
     * @memberOf ch.Watcher
     */
	var revalidate = function() {		
		that.validate();
        controller.checkStatus();  // Check everthing?
	}; 
	
// Protected Members 

    /**
     * Active is a boolean property that let you know if there's a validation going on.
     */
	that.active = false;
	
    /**
     * Enabled is a boolean property that let you know if the watchers is enabled or not.
     */	
    that.enabled = true;
	
    /**
     * Reference is used to assign a context to the positioning preferences.
     */
 	that.reference = (function() {
        var reference;
        // CHECKBOX, RADIO
        if ( that.$element.hasClass("options") ) {
            // Helper reference from will be fired
            // H4
            if ( that.$element.find('h4').length > 0 ) {
                var h4 = that.$element.find('h4'); // Find h4
                    h4.wrapInner('<span>'); // Wrap content with inline element
                reference = h4.children(); // Inline element in h4 like helper reference	
            // Legend
            } else if ( that.$element.prev().prop('tagName') == 'LEGEND' ) {
                reference = that.$element.prev(); // Legend like helper reference
            }
        // INPUT, SELECT, TEXTAREA
        } else {
            reference = that.$element;
        }
        return reference;
    })();

	/**
     * Process conditions and creates a map with all configured conditions, it's messages and validations.
     */
    that.conditions = (function(){
        var c = []; // temp collection
        var i = 0;  // iteration
        var t = conf.conditions.length;
        for ( i; i < t; i++ ) {

            /**
             * Process conditions to find out which should be configured.
             * Add validations and messages to conditions object.
             */
            var condition = conf.conditions[i];
            
            // If condition exists in the Configuration Object
            if ( conf[condition.name] ) {
                
                // Sabe the value
                condition.value = conf[condition.name];
                
                // If there is a message defined for that condition
                if ( conf.messages[condition.name] ) {
                    condition.message = conf.messages[condition.name];
                }
                
                // Push it to the new conditions collection
                c.push(condition);
            }
        }
        
        // return all the configured conditions
        return c;
        
    })(); // Love this ;)

    /**
     * Return true is a required conditions is found on the condition collection.
     * @private
     * @function
     * @name isRequired
     * @memberOf ch.Watcher
     */
    that.isRequired = function(){
        var t = that.conditions.length;
        while ( t-- ) {   
            var condition = that.conditions[t];
            if ( condition.name === "required" && condition.value ) {
                return true;
            }
        }
        return false;
    };

    /**
     * Helper is a UI Component that shows the messages of active validations.
     * @name helper
     * @type {ch.Helper}
     * @memberOf ch.Watcher
     * @see ch.Helper
     */
    var helper = {};
        helper.uid = that.uid + "#0";
		helper.type = "helper";
		helper.element = that.element;
		helper.$element = that.$element;
		
    that.helper = ch.helper.call(helper, that);
    
    /**
     * Validate executes all configured validations.
     */
 	that.validate = function(event) {	
		
		// Pre-validation: Don't validate disabled or not required & empty elements
		if ( that.$element.attr('disabled') ) { return; }

        var isRequired = that.isRequired()

        // Avoid fields that aren't required when they are empty or de-activated
		if ( !isRequired && that.isEmpty() && that.active === false) { return; }
        
        if ( that.enabled && ( that.active === false || !that.isEmpty() || isRequired ) ) {
	
			that.callbacks('beforeValidate');

            var t = that.conditions.length;
            var value = that.$element.val();
            var gotError = false;
            
            while ( t-- ) {
                
            	var condition = that.conditions[t];
        
            	if ( that.isRequired() ) {
                    gotError = that.isEmpty();
            	}
            	
                if ( condition.patt ) {
                    gotError = !condition.patt.test(value);
                }
                
                if ( condition.expr ) {
                    gotError = !condition.expr( value, condition.value );
                }

                if ( condition.func) {
                    // Call validation function with 'this' as scope.
                    gotError = !condition.func.call(that["public"], value); 
                }
                
                if ( gotError ) {

                    that.callbacks('onError');
		
                	// Field error style
                	that.$element.addClass("error");
                
                	// Show helper with message
                	var text = ( condition.message ) ? condition.message : 
                		(ch.utils.hasOwn(controller, "messages")) ? controller.messages[condition.name] :
                		undefined;
                
                	that.helper.show( text );
                
                	that.active = true;
                
                	var event = (that.tag == 'OPTIONS' || that.tag == 'SELECT') ? "change" : "blur";
                
                	that.$element.one(event, function(event){ that.validate(event); }); // Add blur or change event only one time
                
                    return;
                }
            
            } // End for each validation
            
		} // End if Enabled
		
		// Status OK (with previous error)
		if ( that.active || !that.enabled ) {
		    // Remove field error style
			that.$element.removeClass("error"); 
            // Hide helper  
			that.helper.hide();
			// Public status OK
			//that.publish.status = that.status =  conf.status = true; // Status OK
			that.active = false;
			
			// If has an error, but complete the field and submit witout trigger blur event
			if (event) {
				var originalTarget = event.originalEvent.explicitOriginalTarget || document.activeElement; // Moderns Browsers || IE
				if (originalTarget.type == "submit") { controller.submit(); };
			};
			
			controller.checkStatus();
		};
        
        that.callbacks('afterValidate');
        
        return that;
	};
	
    /**
     * Reset all active validations messages.
     */
 	that.reset = function() {
		//that.publish.status = that.status = conf.status = true; // Public status OK
		that.active = false;
		that.$element.removeClass("error");
		that.helper.hide(); // Hide helper
		that.$element.unbind("blur change", that.validate); // Remove blur and change event
		
		that.callbacks("onReset");
		
		return that;
	};
	
    /**
     * isEmpty determine if the field has no value selected.
     */	
     that.isEmpty = function() {
		that.tag = ( that.$element.hasClass("options")) ? "OPTIONS" : that.element.tagName;
		switch (that.tag) {
			case 'OPTIONS':
				return that.$element.find('input:checked').length === 0;
			break;
			
			case 'SELECT':
			    var val = that.$element.val();
				return parseInt(val) === -1 || val === null;
			break;
			
			case 'INPUT':
			case 'TEXTAREA':
				return $.trim( that.$element.val() ).length === 0;
			break;
		};
				
	};

	
// Public Members
	
	/**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Watcher
     */ 
	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Watcher
     */
	that["public"].element = that.element;
	/**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Watcher
     */
	that["public"].type = "watcher"; // Everything is a "watcher" type, no matter what interface is used
    /**
     * Positioner reference.
     * @public
     * @name reference
     * @type {jQuery Object}
     * @memberOf ch.Watcher
     */
	that["public"].reference = that.reference;
    /**
     * Configured conditions.
     * @public
     * @name conditions
     * @type {Object Literal}
     * @memberOf ch.Watcher
     */
	that["public"].conditions = that.conditions;
    /**
     * Configured messages.
     * @public
     * @name messages
     * @type {Object Literal}
     * @memberOf ch.Watcher
     */
	that["public"].helper = that.helper["public"];
    /**
     * Active is a boolean property that let you know if there's a validation going on.
     * @public
     * @function
     * @name active
     * @returns {Boolean}
     * @memberOf ch.Watcher
     */
	that["public"].active = function() {
		return that.active;
	};
    /**
     * Let you concatenate methods.
     * @public
     * @function
     * @name and
     * @returns {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].and = function() {
		return that.$element;
	};
    /**
     * Reset al active validations.
     * @public
     * @function
     * @name reset
     * @returns {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].reset = function() {
		that.reset();
		
		return that["public"];
	};
    /**
     * Run all configured validations.
     * @public
     * @function
     * @name validate
     * @returns {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].validate = function() {
		that.validate();
		
		return that["public"];
	};
    /**
     * Turn on Watcher engine.
     * @public
     * @function
     * @name enable
     * @returns {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].enable = function() {
		that.enabled = true;
				
		return that["public"];			
	};
    /**
     * Turn off Watcher engine and reset its validation.
     * @public
     * @function
     * @name disable
     * @returns {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].disable = function() {
		that.enabled = false;
		that.reset();

		return that["public"];
	};
	/**
     * Recalculate Helper's positioning.
     * @public
     * @function
     * @name refresh
     * @returns {Chico-UI Object}
     * @memberOf ch.Watcher
     */
	that["public"].refresh = function() {
		that.helper.position("refresh");

		return that["public"];
    };



/**
 * Default event delegation
 * @ignore
 */	

    // Run the instances checker        
    // TODO: Maybe is better to check this on top to avoid all the process. 
    var check = checkInstance();
    // If a match exists
    if ( check ) {
        // Create a public object and save the existing object
        // in the public object to mantain compatibility
        var that = {};
            that["public"] = check; 
        // ;) repleace that object with the repeated instance
    } else {
        // this is a new instance: "Come to papa!"
        controller.children.push(that["public"]);
    };

	return that;
};

/**
 * Zoom UI-Component for images.
 * @name Zoom
 * @class Zoom
 * @augments ch.Floats
 * @requires ch.Positioner
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */

ch.zoom = function(conf) {

    /**
     * Reference to an internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var that = this;

	conf = ch.clon(conf);
	conf.width = conf.width || 300;
	conf.height = conf.height || 300;
	conf.fx = false;
	conf.position = {};
	conf.position.context = conf.context || that.$element;
	conf.position.offset = conf.offset || "20 0";
	conf.position.points = conf.points || "lt rt";
	conf.position.hold = true;

	that.conf = conf;

/**
 *	Inheritance
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);
    
/**
 *  Private Members
 */

    /**
     * Original image.
     * @private
     * @name original
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var original = {};
		original.img = that.$element.children();
		original["width"] = original.img.prop("width");
		original["height"] = original.img.prop("height");

    /**
     * Zoomed visual element.
     * @private
     * @name zoomed
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var zoomed = {};
		zoomed.img = conf.content = $("<img>");
	
	// Magnifying glass (enlarge)
	//var $lens = $("<div>").addClass("ch-lens ch-hide");
	
    /**
     * Seeker is the visual element that follows mouse movement for referencing to zoomable area into original image.
     * @private
     * @name seeker
     * @type {Object}
     * @memberOf ch.Zoom
     */
	var seeker = {};
		seeker.shape = $("<div>")
			.addClass("ch-seeker ch-hide")
			.bind("mousemove", function(event){ move(event); })
			// TODO: Calc relativity like in that.size (en lugar de la division por 3)
			.css({ width: conf.width / 3, height: conf.height / 3 });
    
    /**
     * Get the mouse position and moves the zoomed image.
     * @private
     * @function
     * @name move
     * @param {Mouse Event Object} event
     * @memberOf ch.Zoom
     */
	var move = function(event){
		var offset = original.img.offset();
		
		var x = event.pageX - offset.left;
		var y = event.pageY - offset.top;
		
		// Zoomed image
		zoomed.img.css({
			"left": -( ((zoomed["width"] * x) / original["width"]) - (conf.width / 2) ),
			"top": -( ((zoomed["height"] * y) / original["height"]) - (conf.height / 2) )
		});
		
		// Seeker shape
		seeker.shape.css({
			"left": x - seeker["width"],
			"top": y - seeker["height"]
		});
	};
	
/**
 *  Protected Members
 */
	
	that.$trigger = that.$element;
	
	that.show = function(event){
		that.prevent(event);

		zoomed.img.prop("src", that.element.href);

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

    /**
     * Opens the big picture.
     * @private
     * @function
     * @name enlarge
     * @memberOf ch.Layer
     */
	that.enlarge = function(event){
		that.prevent(event);
		
		// Open pop-up
	};
	
    /**
     * Getter and setter for size attributes.
     * @private
     * @function
     * @name size
     * @param {String} attr
     * @param {String} [data]
     * @memberOf ch.Layer
     */
	that.size = function(attr, data) {
		if (!data) return conf[attr]; // Getter

		// Configuration
		that.conf[attr] = data;
		
		// Container
		that.$container[attr](data);
		
		// Seeker
		var size = (original[attr] * data) / zoomed[attr]; // Shape size relative to zoomed image and zoomed area
		seeker.shape[attr](size); // Sets shape size
		seeker[attr] = size / 2; // Shape half size: for position it

		return that["public"];
	};

/**
 *  Public Members
 */
 
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Zoom
     */
   	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Zoom
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Zoom
     */
	that["public"].type = that.type;
    /**
     * The component's content.
     * @public
     * @name content
     * @type {String}
     * @memberOf ch.Zoom
     */
	that["public"].content = that.content;
    /**
     * Shows component's content.
     * @public
     * @name show
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Zoom
     */
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
    /**
     * Hides component's content.
     * @public
     * @name hide
     * @function
     * @returns {Chico-UI Object}
     * @memberOf ch.Zoom
     */
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};

    /**
     * Positioning configuration.
     * @public
     * @name position
     * @memberOf ch.Zoom
     * @example
     * // Change position.
     * $('input').zoom().position({ 
     *    offset: "0 10",
     *    points: "lt lb"
     * });
     */
	that["public"].position = that.position;
	
    /**
     * Gets and sets the width size.
     * @private
     * @name width
     * @param {Number} data Width value.
     * @memberOf ch.Zoom
     * @example
     * // Gets width of zoomed visual element.
     * foo.width();
     * @example
     * // Sets width of zoomed visual element and update the seeker size to keep these relation.
     * foo.width(500);
     */
	that["public"].width = function(data){ that.size("width", data); };
    /**
     * Gets and sets the height size.
     * @private
     * @name height
     * @param {Number} data Height value.
     * @memberOf ch.Zoom
     * @example
     * // Gets height of zoomed visual element.
     * foo.height();
     * @example
     * // Sets height of zoomed visual element and update the seeker size to keep these relation.
     * foo.height(500);
     */
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
			.css({"width": original["width"], "height": original["height"]})
			
			// Show
			.bind("mouseenter", that.show)
			
			// Hide
			.bind("mouseleave", that.hide)
			
			// Move
			.bind("mousemove", function(event){ move(event); })
			
			// Enlarge
			.bind("click", function(event){ that.enlarge(event); });
	},50);	

	// Preload zoomed image
	ch.utils.window.one("load", function(){
		zoomed.img.prop("src", that.element.href).one("load", function(){
			zoomed["width"] = zoomed.img.prop("width");
			zoomed["height"] = zoomed.img.prop("height");
		});
	});


	return that;
};
})($);