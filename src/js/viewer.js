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
		
		var lens = $("<div class=\"ch-lens\">").bind("click", function(){ viewerModal.show(); }).hide();
		
		var display = $viewer.children(":first").addClass("ch-viewer-content");
			display.find("img")
				.bind("mouseover", function(){ lens.fadeIn(); }) // Show magnifying glass
				.bind("mouseleave", function(){ lens.fadeOut(); }) // Hide magnifying glass
		
		var wrapper = $("<div>")
			.addClass("ch-viewer-display")
			.append( display )
			.append( lens ) // Magnifying glass
			.appendTo( $viewer );

		var self = {};
		
			self.items = display.children();
			self.itemsWidth = self.items.outerWidth();
			self.itemsAmount = self.items.length;
			self.itemsAnchor = self.items.children("a").bind("click", function(event){ that.prevent(event); viewerModal.show(); });
			
			// Set visual config of content
			self.display = display.css("width", (self.itemsAmount * self.itemsWidth) + (ch.utils.html.hasClass("ie6") ? self.itemsWidth : 0)); // Extra width
		
		// Position magnifying glass
		ch.positioner({
	        element: lens,
	        context: wrapper
		});
		
		// Structure validation
		if(self.items.find("link[rel=thumb][itemprop=thumb]").length == 0) alert("");
		
		return self;
	})();
	
	
	// Generic list creation
	var createList = function(type){
		var list = $("<ul>").addClass("carousel");
		
		$.each(showcase.items, function(i, e){
			var page = i + 1;
		
			var image = $("<img>").attr("src", (type == "thumb") ? $(e).children("link[rel=thumb]").attr("href") : bigImages[i]); // Thumbnails source vs. Big images source
			
			if(type == "thumb") {
				image.bind("click", function(event){
					that.prevent(event);
					that.move(page);
				});
			};
			
			$("<li>").append( image ).appendTo( list );
		});
				
		return list;
	};
		
	
	
	/**
	 * 	Thumbnails
	 */
	var createThumbs = function(){
	
		var structure = createList("thumb");
		
		var self = {};
		
			self.children = structure.children();
			
			self.selected = 1;
		
			self.carousel = that.children[0] = $("<div>")
				.addClass("ch-viewer-triggers")
				.append( structure )
				.appendTo( $viewer )
				.carousel({
					width: $viewer.width()
				});
		
		return self;
	};
		
	
	
	
	
	
	/**
	 * 	Modal
	 */
	var viewerModal = that.children[1] = $("<div>").modal({
		content: "<div class=\"ch-viewer-modal-content\"></div>",
		width:600,
		onShow: function(){ // TODO: Deberia cachear el contenido para evitar recalcular todo
		
			var modalContent = $(".ch-viewer-modal-content");
				modalContent.parents(".ch-modal").addClass("ch-viewer-modal");
		
			// Create list + reset position + append it
			createList("big").css("left", 0).appendTo( modalContent );
			
			// Full behavior
			if(showcase.itemsAmount > 1) {
				// Init carousel and move to position of item selected on thumbs
				that.children[2] = modalContent.carousel({ pager: true }).moveTo( thumbnails.selected );
				
			// Basic behavior
			} else {
				// Simulate carousel structure
				modalContent.wrapInner("<div class=\"ch-viewer-oneItem\">");
			};
			
			// Zoom process
			checkZoomImages(modalContent);
			
			// Refresh modal position
			this.position("refresh");
		},
		onHide: function(){
		
			// Reset modal content
			$(".ch-viewer-modal-content").html("").removeClass("ch-carousel");
		
			// Full behavior
			if(showcase.itemsAmount > 1) {
				// Thumbnails syncro (select thumb that was selected in modal)
				that.move( that.children[2].getPage() );
			
				// Delete modal instance // TODO pasar funcionalidad al object ("that.destroy"?)
				for(var i = 0, j = ch.instances.carousel.length; i < j; i += 1){
					if(ch.instances.carousel[i].element === that.children[2].element){
						ch.instances.carousel.splice(i, 1);
						return;
					};
				};
			};
		}
	});
	
	
	
	/**
	 * 	Zoom
	 */
	var checkZoomImages = function(modal){
		
		var zoomImages = [];
		
		$.each(showcase.items, function(i, e){
			
			// Zoom image source
			var src = $(e).children("link[rel=zoom]").attr("href");
			
			// If it has not zoom, continue
			if(!src) return;
			
			var image = $("<img>")
				.attr("src", src)
				.addClass("ch-viewer-zoomed")
				.bind("click", function(){ $(this).fadeOut(); }) // Fade Out
				.bind("mousemove", function(event){ zoomMove(event); }) // Movement
				.appendTo( (showcase.itemsAmount > 1) ? modal : modal.children() )
				.hide();
			
			var zoomMove = function(event){
				var offset = modal.offset();
				
				var diff = {
					x: image.outerWidth() / modal.outerWidth() - 1,
					y: image.outerHeight() / modal.outerHeight() - 1
				};
				
				image.css({
					left: -(event.pageX - offset.left) * diff.x + "px",
					top: -(event.pageY - offset.top) * diff.y + "px"
				});
			};
			
			// Create zoom functionality
			var zoomable = $("<a>")
				.attr("href", src)
				.addClass("ch-viewer-zoomable")
				.bind("click", function(event){
					that.prevent(event);
					zoomMove(event);
					image.fadeIn();
				}); // FadeIn
			
			// Append link to image in modal
			modal.find("img").eq(i).wrap( zoomable );
			
			// Add source to preload
			zoomImages.push(src);
		});
		
		// Preload if there are zoom images
		if(zoomImages.length > 0) ch.preload(zoomImages);
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
		var movement = { left: (-item + 1) * showcase.itemsWidth };
	
		// CSS3 Transitions vs jQuery magic
		if(ch.features.transition) showcase.display.css(movement); else showcase.display.animate(movement);
	
		// Move thumbnails carousel if item selected is on another page
		if(page != nextPage) thumbnails.carousel.moveTo(nextPage);

		// Refresh selected thumb
		thumbnails.selected = item;

		// Callback
		that.callbacks("onMove");
	
		return that;
	};

/**
 *  Protected Members
 */ 
	
	
	

/**
 *  Public Members
 */	

	that.public.uid = that.uid;
	that.public.element = that.element;
	that.public.type = that.type;
	that.public.children = that.children;
	
	// Full behavior
	if(showcase.itemsAmount > 1) {
		that.public.moveTo = function(page){ that.move(page); return that.public; };
		that.public.next = function(){ that.move( thumbnails.selected + 1 ); return that.public; };
		that.public.prev = function(){ that.move( thumbnails.selected - 1 ); return that.public; };
		that.public.getSelected = function(){ return thumbnails.selected; }; // Is this necesary???
	};

/**
 *  Default event delegation
 */	
	
	// Full behavior
	if(showcase.itemsAmount > 1) {
		var thumbnails = createThumbs();
		that.move = move;
		that.move(1); // Move to the first item and without callback
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
