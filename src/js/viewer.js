
/**
* Viewer UI-Component for images, videos and maps.
* @name Viewer
* @class Viewer
* @augments ch.Controllers
* @requires ch.Carousel
* @requires ch.Zoom
* @memberOf ch
* @requires ch.onImagesLoads
* @param {object} conf Object with configuration properties
* @returns itself
*/

ch.viewer = function(conf){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Viewer#that
	* @type object
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
*	Private Members
*/

	/**
	* Reference to the viewer's visual object.
	* @private
	* @name ch.Viewer#$viewer
	* @type jQuery
	*/
	var $viewer = that.$element.addClass("ch-viewer");
	conf.width = $viewer.outerWidth();
	conf.height = $viewer.outerHeight();

	/**
	* Reference to the viewer's internal content.
	* @private
	* @name ch.Viewer#$content
	* @type jQuery
	*/
	var $content = $viewer.children().addClass("ch-viewer-content");

	/**
	* Reference to the viewer's display element.
	* @private
	* @name ch.Viewer#$display
	* @type jQuery
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
	* @name ch.Viewer#items
	* @type collection
	*/
	var items = $content.children();

	/**
	* Amount of children.
	* @private
	* @name ch.Viewer#itemsAmount
	* @type number
	*/
	var itemsAmount = items.length;

	/**
	* Collection of anchors finded on items collection.
	* @private
	* @name ch.Viewer#itemsAnchor
	* @type collection
	*/
	var itemsAnchor = items.children("a");

	/**
	* Collection of references to HTMLIMGElements or HTMLObjectElements.
	* @private
	* @name ch.Viewer#itemsChildren
	* @type object
	*/
	var itemsChildren = items.find("img, object");

	/**
	* Iniatilizes Zoom component on each anchor
	* @private
	* @name ch.Viewer#instanceZoom
	* @type object
	*/
	var instanceZoom = function() {

		var _size = {};
			_size.width = conf.zoomWidth || $viewer.width();
			
			if(_size.width === "auto"){
				_size.width = $viewer.parent().width() - $viewer.outerWidth() - 20; // 20px of Zoom default offset
			};

			_size.height = conf.zoomHeight || $viewer.height();

		itemsAnchor.each(function(i, e){

			// Initialize zoom on imgs loaded
			$(e).children("img").onImagesLoads(function(){
				var component = {
					uid: that.uid + "#" + i,
					type: "zoom",
					element: e,
					$element: $(e)
				};

				var configuration = {
					context: $viewer,
					onShow: function(){
						this.width( _size.width );
						this.height( _size.height );
					}
				};
	
				that.children.push( ch.zoom.call(component, configuration)["public"] );
			});

		});
	};

	/**
	* Creates all thumbnails and configure it as a Carousel.
	* @private
	* @function
	* @name ch.Viewer#createThumbs
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
	* @name ch.Viewer#move
	* @param {number} item
	* @returns itself
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

		/**
		* Callback function
		* @name ch.Viewer#onMove
		* @event
		*/
		that.callbacks("onMove");
		// new callback
		that.trigger("move");

		return that;
	};

	/**
	* Handles the visual behavior of arrows
	* @private
	* @name ch.Viewer#arrows
	* @type object
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
*	Protected Members
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
*	Public Members
*/

	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Viewer#uid
	* @type number
	*/

	/**
	* The element reference.
	* @public
	* @name ch.Viewer#element
	* @type HTMLElement
	*/

	/**
	* The component's type.
	* @public
	* @name ch.Viewer#type
	* @type string
	*/

	/**
	* Children instances associated to this controller.
	* @public
	* @name ch.Viewer#children
	* @type Collection
	*/
	that["public"].children = that.children;

	// Full behavior
	if(itemsAmount > 1) {
		/**
		* Selects a specific viewer's child.
		* @public
		* @function
		* @name ch.Viewer#moveTo 
		* @param {Number} item Recieve a index to select a children.
		*/
		// TODO: This method should be called 'select'?
		that["public"].moveTo = function(item){ that.move(item); return that["public"]; };

		/**
		* Selects the next child available.
		* @public
		* @function
		* @name ch.Viewer#next
		*/
		that["public"].next = function(){ that.next(); return that["public"]; };

		/**
		* Selects the previous child available.
		* @public
		* @function
		* @name ch.Viewer#prev
		*/
		that["public"].prev = function(){ that.prev(); return that["public"]; };

		/**
		* Get the index of the selected child.
		* @public
		* @function
		* @name ch.Viewer#getSelected
		*/
		that["public"].getSelected = function(){ return thumbnails.selected; }; // Is this necesary???

/**
*	Default event delegation
*/

		// Create thumbnails
		var thumbnails = createThumbs();
		
		// Create Viewer buttons
		$viewer.append( arrows.prev.$element ).append( arrows.next.$element );
		
		// Create movement method
		that.move = move;
		
		// Move to the first item without callback
		that.move(1);
		
		// Turn on Next arrow
		arrows.next.on();
	};

	$viewer.find(".ch-mask").eq(0).height( $(itemsChildren[0]).height() );

	// Initialize Zoom if there are anchors
	if( ch.utils.hasOwn(ch, "zoom") && itemsAnchor.length > 0) {
		instanceZoom();
	};

	ch.utils.avoidTextSelection(that.element);

	return that;
};
