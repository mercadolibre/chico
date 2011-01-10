/**
 *	Viewer
 *	@author
 *	@Contructor
 *	@return An interface object
 */
ui.viewer = function(conf){
	var that = ui.controllers(); // Inheritance
	
	/**
	 * 	Viewer
	 */
	var $viewer = $(conf.element);
	$viewer.addClass("ch-viewer"); // Create magnifying glass

	/**
	 * 	Modal of Viewer
	 */
	var viewerModal = {};
	viewerModal.carouselStruct = $(conf.element).find("ul").clone().addClass("carousel");	
	viewerModal.carouselStruct.find("img").each(function(i, e){
		$(e).attr("src", $(e).parent().attr("href")) // Image source change
			.unwrap(); // Link deletion
	});
	viewerModal.showContent = function(){
		$(".ch-viewer-modal-content").parent().addClass("ch-viewer-modal");
		$(".ch-viewer-modal-content").html( viewerModal.carouselStruct );
		that.children[2] = viewerModal.carousel = $(".ch-viewer-modal-content").carousel({ pager: true });
		$(".ch-viewer-modal-content .ch-carousel-content").css("left",0); // Reset position
		viewerModal.carousel.select(thumbnails.selected);
		viewerModal.modal.position();
		viewerModal.carouselStruct.find("a").each(function(i, e){			
		});
		
	};
	viewerModal.hideContent = function(){		
		$("ch-viewer-modal").remove();
		for(var i = 0, j = ui.instances.carousel.length; i < j; i ++){ // TODO pasar al object			
			if(ui.instances.carousel[i].element === viewerModal.carousel.element){
				ui.instances.carousel.splice(i,1);
				return;
			} 
		};		
	};
	that.children[1] = viewerModal.modal = $("<a>").modal({ //TODO iniciar componentes sin trigger
		content: "<div class=\"ch-viewer-modal-content\">",
		callbacks: {
			show: viewerModal.showContent,
			hide: viewerModal.hideContent
		}
	});
		
	
	/**
	 * 	Showcase
	 */
	var showcase = {};
	showcase.wrapper = $("<div>").addClass("ch-viewer-display");
	showcase.display = $(conf.element).children(":first");
	$viewer.append( showcase.wrapper.append( showcase.display ).append("<div class=\"ch-lens\">") );
	
	showcase.children = showcase.display.find("a");
	showcase.itemWidth = $(showcase.children[0]).parent().outerWidth();
	
	showcase.lens = $viewer.find(".ch-lens") // Get magnifying glass
	ui.positioner({
        element: $(showcase.lens),
        context: $(".ch-viewer li"),
        offset: "-20px 0"
	});	
	showcase.lens.bind("click", function(event){
		viewerModal.modal.show();
	});
	
	showcase.wrapper
		// Show magnifying glass
		.bind("mouseover", function(){
			showcase.lens.fadeIn(400);
		})
		// Hide magnifying glass
		.bind("mouseleave", function(){
			showcase.lens.fadeOut(400);
		});
	
	// Set content visual config
	showcase.display
		.css('width', showcase.children.length * showcase.itemWidth)
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
	thumbnails.selected = 0;
	thumbnails.wrapper = $("<div>").addClass("ch-viewer-triggers");
	
	// Create carousel structure
	$viewer.append( thumbnails.wrapper.append( $viewer.find("ul").clone().addClass("carousel") ) );
		 
	thumbnails.children = thumbnails.wrapper.find("a");
	
	// Thumbnails behavior
	thumbnails.children.find("img").each(function(i, e){
		// Change image parameter (thumbnail size)
		$(e).attr("src", $(e).attr("src").replace("v=V", "v=M"));
		
		// Thumbnail link click
		$(e).parent().bind("click", function(event){
			that.prevent(event);
			select(i);
		});
	});
	// Inits carousel
	that.children[0] = thumbnails.carousel = thumbnails.wrapper.carousel();
	
	
	/**
	 * 	Methods
	 */
	var select = function(item){
		// Validation
		if(item > showcase.children.length-1 || item < 0 || isNaN(item)){
			alert("Error: Expected to find a number between 0 and " + (showcase.children.length - 1) + ".");
			return conf.publish;
		};
		
		var visibles = thumbnails.carousel.getSteps(); // Items per page
		var page = thumbnails.carousel.getPage(); // Current page
		var nextPage = ~~(item / visibles) + 1; // Page of "item"
		
		// Visual config		
		$(thumbnails.children[thumbnails.selected]).removeClass("on");
		$(thumbnails.children[item]).addClass("on");
		
		// Content movement
		showcase.display.animate({ left: -item * showcase.itemWidth });// Reposition content
		// Trigger movement
		if (thumbnails.selected < visibles && item >= visibles && nextPage > page) {
			thumbnails.carousel.next();
		}else if (thumbnails.selected >= visibles && item < visibles && nextPage < page ) {
			thumbnails.carousel.prev();
		};
		
		// Selected
		thumbnails.selected = item;
		
		// Return public object
		return conf.publish;
	};
	
	
	// Public object
    conf.publish = {
		uid: conf.id,
		element: conf.element,
		type: "viewer",
		children: that.children,
		select: function(i){
			// Callback
			that.callbacks(conf, 'select');
			
			return select(i);
		}
    }
	
	// Default behavior (Select first item and without callback)
	select(0);
	
	return conf.publish;
};
