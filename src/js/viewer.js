/**
 *	Viewer
 *	@author
 *	@Contructor
 *	@return An interface object
 */
ch.viewer = function(conf){

/**
 *  Constructor
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
	 * 	Viewer
	 */
	var $viewer = that.$element.addClass("ch-viewer");
	
	/**
	 * 	Showcase
	 */
	
	var showcase = (function(){
		
		var $content = $viewer.children(":first").addClass("ch-viewer-content");
		
		var $display = $("<div>")
			.addClass("ch-viewer-display")
			.append( $content )
			.appendTo( $viewer );

		var self = {};
		
			self.$content = $content;
			
			self.items = $content.children();
			self.itemsAmount = self.items.length;
			
			self.itemsAnchor = self.items.children("a")
				.bind("click", function(event){ that.prevent(event) });
			self.itemsImgs = self.itemsAnchor.children("img");
			self.itemsVideo = self.items.children("object");
			
			// Items width and height
			var itemFirst = self.itemsImgs[0] || self.itemsVideo[0];
			self.itemsWidth = parseInt(itemFirst.width, 10);
			self.itemsHeight = parseInt(itemFirst.height, 10);
			self.MAX_WIDTH = self.itemsWidth;

			// TODO: 
			$display.css({
				"width": self.itemsWidth,
				"height": self.itemsHeight
			});
			$viewer.width( self.itemsWidth );
			self.$content.width((self.itemsAmount * (self.itemsWidth)) + (ch.utils.html.hasClass("ie6") ? self.itemsWidth : 0)); // Extra width
			
			// TODO:
			self.draw = function(){
				
				if ( $viewer.parent().width() > self.MAX_WIDTH + 35 ) return;

				var newWidth;
				var oldItemsWidth = self.itemsWidth;
				var oldItemsHeight = self.itemsHeight;
				
				if( $viewer.parent().width() < self.MAX_WIDTH ){
					newWidth = self.MAX_WIDTH - (self.MAX_WIDTH - $viewer.parent().width());
				} else if ($viewer.parent().width() > self.MAX_WIDTH && $viewer.width() < self.MAX_WIDTH){
					newWidth = self.MAX_WIDTH;
				};
				
				self.itemsWidth = newWidth;
				self.itemsHeight = Math.ceil((self.itemsWidth * oldItemsHeight) / oldItemsWidth);
				
				for (var i = 0, j = self.itemsImgs.length; i < j; i += 1){
					self.itemsImgs[i].width = self.itemsWidth;
					self.itemsImgs[i].height = self.itemsHeight;
				};
								
				for (var i = 0, j = self.itemsVideo.length; i < j; i += 1){
					self.itemsVideo[i].width = self.itemsWidth;
					self.itemsVideo[i].height = self.itemsHeight;
				};

				$display.css({
					"width": self.itemsWidth,
					"height": self.itemsHeight
				});
				
				$viewer.width( newWidth );

				self.$content.css({
					"width": (self.itemsAmount * (self.itemsWidth)) + (ch.utils.html.hasClass("ie6") ? self.itemsWidth : 0), // Extra width
					"left": 0
				});

			};		

		return self;
	})();
	
	
	/**
	 * 	Thumbnails
	 */
	var createThumbs = function(){
	
		var structure = $("<ul>").addClass("carousel");
		
		$.each(showcase.items, function(i, e){
			
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
				//showcase.videos.push($(e).children("object"));
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
				.carousel();
				
			self.draw = function(){
				// TODO: 90 is thumbnails size hardcoded, this should be variable
				var w = (showcase.itemsWidth * 90) / showcase.MAX_WIDTH;
				var h = (showcase.itemsHeight * 90) / showcase.MAX_WIDTH;
				for (var i = 0, j = self.children.length; i < j; i += 1){
					$(self.children[i]).width(w).height(h);
					self.children.find("img").width(w).height(h);
				};
				
			};
		
		return self;
	};
	
	
	
	var move = function(item){

		// Validation
		if(item > showcase.itemsAmount || item < 1 || isNaN(item)) return that;
	
		var visibles = thumbnails.carousel.getSteps(); // Items per page
		var page = thumbnails.carousel.getPage(); // Current page
		var nextPage = Math.ceil( item / visibles ); // Page of "item"

		// Visual config
	
		$(thumbnails.children[thumbnails.selected - 1]).removeClass("ch-thumbnail-on"); // Disable thumbnail
		$(thumbnails.children[item - 1]).addClass("ch-thumbnail-on"); // Enable next thumbnail

		// Content movement

		var movement = { left: (-item + 1) * (showcase.itemsWidth) };

		// CSS3 Transitions vs jQuery magic
		if(ch.features.transition) showcase.$content.css(movement); else showcase.$content.animate(movement);
		
		// Move thumbnails carousel if item selected is on another page
		if(page != nextPage) thumbnails.carousel.moveTo(nextPage);

		// Refresh selected thumb
		thumbnails.selected = item;
		
		// Callback
		that.callbacks("onMove");
	
		return that;
	};
	
	var resize = false;

/**
 *  Protected Members
 */ 
	
	that.redraw = function(){
		
		showcase.draw();
		
		if ( thumbnails ) {
			
			thumbnails.draw();
			that.children[0].redraw();
			move(1);
		};
		

	};
	

/**
 *  Public Members
 */	

	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].children = that.children;
	
	// Full behavior
	if(showcase.itemsAmount > 1) {
		that["public"].moveTo = function(item){ that.move(item); return that["public"]; };
		that["public"].next = function(){ that.move( thumbnails.selected + 1 ); return that["public"]; };
		that["public"].prev = function(){ that.move( thumbnails.selected - 1 ); return that["public"]; };
		that["public"].getSelected = function(){ return thumbnails.selected; }; // Is this necesary???
		// ...

/**
 *  Default event delegation
 */	
	
		// ...
		var thumbnails = createThumbs();
		that.move = move;
		that.move(1); // Move to the first item without callback
		
		that.redraw();
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
	
	// Preload big images on document load
	var bigImages = [];
	
	$(function(){
		showcase.itemsAnchor.each(function(i, e){
			bigImages.push( $(e).attr("href") );
		});
		
		ch.preload(bigImages);
	});
	

	
	return that;
};
