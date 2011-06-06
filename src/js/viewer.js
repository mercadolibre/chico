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
