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
	 * 	Modal of Viewer
	 */
	var viewerModal = {};
		viewerModal.carouselStruct = $viewer.find("ul").clone().addClass("carousel");	
		
		viewerModal.carouselStruct.find("img").each(function(i, e){
			$(e).attr("src", "") // Image source change
				.unwrap(); // Link deletion
		});
		
		viewerModal.showContent = function(){
			$(".ch-viewer-modal-content").parent().addClass("ch-viewer-modal");
			$(".ch-viewer-modal-content").html( viewerModal.carouselStruct );
			$(".ch-viewer-modal-content img").each(function(i,e){
				$(e).attr("src", bigImgs[i]);
			});

			that.children[2] = viewerModal.carousel = $(".ch-viewer-modal-content").carousel({ pager: true });
	
			$(".ch-viewer-modal-content .ch-carousel-content").css("left",0); // Reset position
			viewerModal.carousel.moveTo( thumbnails.selected );
			viewerModal.modal.position();
		};
		
		viewerModal.hideContent = function(){
			
			// Thumbnails syncro
			that.move(viewerModal.carousel.getPage());
			
			// Remove carousel wrapper
			$("ch-viewer-modal").remove();
	
			// Reset left of carousel in modal
			viewerModal.carouselStruct.css("left", "0");
			
			// Delete modal instance // TODO pasar al object
			for(var i = 0, j = ui.instances.carousel.length; i < j; i += 1){
				if(ui.instances.carousel[i].element === viewerModal.carousel.element){
					ui.instances.carousel.splice(i, 1);
					return;
				};
			};
					
		};


	/**
	 * 	Showcase
	 */
	var showcase = {};
		showcase.wrapper = $("<div>").addClass("ch-viewer-display");
		showcase.display = $viewer.children(":first");
		
		$viewer
			.append( showcase.wrapper.append( showcase.display ) )
			.append("<div class=\"ch-lens\">");
		
		// Magnifying glass
		showcase.wrapper.append("<div class=\"ch-lens\">");
		showcase.lens = showcase.wrapper.find(".ch-lens");
		
		ui.positioner({
	        element: showcase.lens,
	        context: showcase.wrapper
		});
		
		showcase.lens
			.hide()			
			.bind("click", function(){ viewerModal.modal.show() });
		
		showcase.wrapper
			.bind("mouseover", function(){ showcase.lens.fadeIn(400); }) // Show magnifying glass
			.bind("mouseleave", function(){ showcase.lens.fadeOut(400); }); // Hide magnifying glass			

		showcase.children = showcase.display.find("a");
		showcase.itemWidth = $(showcase.children[0]).parent().outerWidth();
		
		// Set content visual config
		var extraWidth = (ui.utils.html.hasClass("ie6")) ? showcase.itemWidth : 0;
		showcase.display
			.css('width', (showcase.children.length * showcase.itemWidth) + extraWidth )
			.addClass("ch-viewer-content")
			
		
		// Showcase functionality
		showcase.children.bind("click", function(event){
			that.prevent(event);
			viewerModal.modal.show();
		});


	/**
	 * 	Thumbnails
	 */
	var thumbnails = {};
		thumbnails.selected = 1;
		thumbnails.wrapper = $("<div>").addClass("ch-viewer-triggers");
		
		// Create carousel structure
		$viewer.append( thumbnails.wrapper.append( $viewer.find("ul").clone().addClass("carousel") ) );
		 
		thumbnails.children = thumbnails.wrapper.find("img");
		
		// Thumbnails behavior
		thumbnails.children.each(function(i, e){
			// Change image parameter (thumbnail size)
			$(e)
			    .attr("src", $(e).attr("src").replace("v=V", "v=M"))
			    .unwrap()
			    // Thumbnail link click
			    .bind("click", function(event){
		            that.prevent(event);
		            that.move(i+1);
			 });
			 
		});
		
		// Inits carousel
		that.children[0] = thumbnails.carousel = thumbnails.wrapper.carousel();
			
		// Hide magnifying glass
		thumbnails.wrapper.bind("mouseenter", function(){
			showcase.lens.fadeOut(400);
		});

		
 
/**
 *  Protected Members
 */ 

	that.children[1] = viewerModal.modal = $("<a>").modal({
		content: "<div class=\"ch-viewer-modal-content\">",
		width:600,
		height:545,
		onShow: viewerModal.showContent,
		onHide: viewerModal.hideContent
	});
	
	that.move = function(item){

		// Validation
		if(item > showcase.children.length || item < 1 || isNaN(item)) return that;
		
		var visibles = thumbnails.carousel.getSteps(); // Items per page
		var page = thumbnails.carousel.getPage(); // Current page
		var nextPage = Math.ceil( item / visibles ); // Page of "item"

		// Visual config
		$(thumbnails.children[thumbnails.selected-1]).removeClass("ch-thumbnail-on"); // thumbnails.children[0] first children
		$(thumbnails.children[item-1]).addClass("ch-thumbnail-on");

		// Content movement
		var movement = { left: (-item+1) * showcase.itemWidth };
		
		// Have CSS3 Transitions feature?
		if(ui.features.transition) {
			showcase.display.css(movement);
		
		// Why not!!! Ok, ok.. let JQuery do the magic...
		} else {
			showcase.display.animate(movement);
		};
		
		// Trigger movement
		if(page != nextPage) thumbnails.carousel.moveTo(nextPage);

		// Selected
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
	
	// Preload big imgs on document loaded
	var bigImgs = [];
	ui.utils.window.load(function(){
		setTimeout(function(){			
			showcase.children.each(function(i, e){
				bigImgs.push( $(e).attr("href") ); // Image source change
			});
			ui.preload(bigImgs);
		},250);
	});

	
	return that;
};
