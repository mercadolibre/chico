/**
 *	Viewer
 *	@author
 *	@Contructor
 *	@return An interface object
 */
ui.viewer = function(conf){

/**
 *  Constructor
 */
	var that = this;

	conf = ui.clon(conf);
	that.conf = conf;

/**
 *  Inheritance
 */

    that = ui.controllers.call(that);
    that.parent = ui.clon(that);
	
	
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
	var showcase = {};
	
		showcase.wrapper = $("<div>").addClass("ch-viewer-display");
		showcase.display = $viewer.children(":first").addClass("ch-viewer-content");
		
		showcase.items = showcase.display.children();
		showcase.itemWidth = showcase.items.outerWidth();
		showcase.children = showcase.display.find("a");
		
		showcase.lens = $("<div class=\"ch-lens\">").bind("click", function(){ that.children[1].show() }).hide();
		
		showcase.wrapper
			.append( showcase.display )
			.append( showcase.lens ) // Magnifying glass
			.bind("mouseover", function(){ showcase.lens.fadeIn(400); }) // Show magnifying glass
			.bind("mouseleave", function(){ showcase.lens.fadeOut(400); }) // Hide magnifying glass			
			.appendTo( $viewer );
		
		// Position magnifying glass
		ui.positioner({
	        element: showcase.lens,
	        context: showcase.wrapper
		});
		
		// Set visual config of content
		var extraWidth = (ui.utils.html.hasClass("ie6")) ? showcase.itemWidth : 0;
		showcase.display.css("width", (showcase.children.length * showcase.itemWidth) + extraWidth );
			
		// Showcase functionality
		showcase.children.bind("click", function(event){
			that.prevent(event);
			that.children[1].show();
		});

	
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
	var thumbnails = {};
	
		thumbnails.structure = createList("thumb");
		thumbnails.children = thumbnails.structure.children();
		thumbnails.selected = 1;
		
		thumbnails.wrapper = $("<div>")
			.addClass("ch-viewer-triggers")
			.bind("mouseenter", function(){
				showcase.lens.fadeOut(400); // It hides magnifying glass
			})
			.append( thumbnails.structure )
			.appendTo( $viewer );
		
		thumbnails.carousel = that.children[0] = thumbnails.wrapper.carousel();
		
	
	
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
				.appendTo( modal )
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
		if(zoomImages.length > 0) ui.preload(zoomImages);
	};
	
	
	/**
	 * 	Modal
	 */
	that.children[1] = $("<div>").modal({
		content: "<div class=\"ch-viewer-modal\"></div>",
		width:600,
		onShow: function(){ // TODO: Deberia cachear el contenido para evitar recalcular todo
		
			var modalContent = $(".ch-viewer-modal");
		
			// Create list + reset position + append it
			createList("big").css("left", 0).appendTo( modalContent );
			
			// Zoom process
			checkZoomImages(modalContent);
		
			// Init carousel and move to position of item selected on thumbs
			that.children[2] = modalContent.carousel({ pager: true }).moveTo( thumbnails.selected );
			
			// Refresh modal position
			this.position("refresh");
		},
		onHide: function(){
		
			// Reset modal content
			$(".ch-viewer-modal").html("").removeClass("ch-carousel");
		
			// Thumbnails syncro (select thumb that was selected in modal)
			that.move( that.children[2].getPage() );
			
			// Delete modal instance // TODO pasar funcionalidad al object ("that.destroy"?)
			for(var i = 0, j = ui.instances.carousel.length; i < j; i += 1){
				if(ui.instances.carousel[i].element === that.children[2].element){
					ui.instances.carousel.splice(i, 1);
					return;
				};
			};
		}
	});


/**
 *  Protected Members
 */ 

	that.move = function(item){

		// Validation
		if(item > showcase.children.length || item < 1 || isNaN(item)) return that;
		
		var visibles = thumbnails.carousel.getSteps(); // Items per page
		var page = thumbnails.carousel.getPage(); // Current page
		var nextPage = Math.ceil( item / visibles ); // Page of "item"

		// Visual config
		$(thumbnails.children[thumbnails.selected - 1]).removeClass("ch-thumbnail-on"); // Disable thumbnail
		$(thumbnails.children[item - 1]).addClass("ch-thumbnail-on"); // Enable next thumbnail

		// Content movement
		var movement = { left: (-item + 1) * showcase.itemWidth };
		
		// CSS3 Transitions vs jQuery magic
		if(ui.features.transition) showcase.display.css(movement); else showcase.display.animate(movement);
		
		// Move thumbnails carousel if item selected is on another page
		if(page != nextPage) thumbnails.carousel.moveTo(nextPage);

		// Refresh selected thumb
		thumbnails.selected = item;

		// Callback
		that.callbacks("onMove");
		
		return that;
	};
	

/**
 *  Public Members
 */	

	that.public.uid = that.uid;
	that.public.element = that.element;
	that.public.type = that.type;
	that.public.children = that.children;
	that.public.moveTo = function(page){
		that.move(page);
		
		return that.public;
	};
	that.public.next = function(){
		that.move( thumbnails.selected + 1 );
		
		return that.public;
	};
	that.public.prev = function(){
		that.move( thumbnails.selected - 1 );
		
		return that.public;
	};
	
	that.public.getSelected = function(){ // Is this necesary???
		return thumbnails.selected;
	};


/**
 *  Default event delegation
 */	
	
	// Default behavior (Move to the first item and without callback)
	that.move(1);
	
	// Preload big images on document load
	var bigImages = [];
	ui.utils.window.load(function(){
		//setTimeout(function(){
			showcase.children.each(function(i, e){
				bigImages.push( $(e).attr("href") ); // Image source change
			});
			ui.preload(bigImages);
		//},250);
	});

	
	return that;
};
