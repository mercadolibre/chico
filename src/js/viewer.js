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
		$("ch-viewer-modal").remove(); // Remove carousel wrapper

		viewerModal.carouselStruct.css("left", "0"); // Reset left of carousel in modal
		
		for(var i = 0, j = ui.instances.carousel.length; i < j; i += 1){ // TODO pasar al object			
			if(ui.instances.carousel[i].element === viewerModal.carousel.element){
				ui.instances.carousel.splice(i, 1);
				return;
			} 
		};
		
				
	};
	that.children[1] = viewerModal.modal = $("<a>").modal({ //TODO iniciar componentes sin trigger
		content: "<div class=\"ch-viewer-modal-content\">",
		width:600,
		height:545,
		onShow: viewerModal.showContent,
		onHide: viewerModal.hideContent
	});
		
	
	/**
	 * 	Showcase
	 */
	var showcase = {};
	showcase.wrapper = $("<div>").addClass("ch-viewer-display");
	showcase.display = $(conf.element).children(":first");
	$viewer.append( showcase.wrapper.append( showcase.display ) );
	$viewer.append("<div class=\"ch-lens\">");
	
	showcase.children = showcase.display.find("a");
	showcase.itemWidth = $(showcase.children[0]).parent().outerWidth();
	
	showcase.lens = $viewer.find(".ch-lens") // Get magnifying glass
	ui.positioner({
        element: showcase.lens,
        context: showcase.wrapper
	});	
	showcase.lens.bind("click", function(event){
		viewerModal.modal.show();
	});

	// Show magnifying glass
	showcase.wrapper.bind("mouseover", function(){
		showcase.lens.fadeIn(400);
	});
	
	// Hide magnifying glass
	$viewer.bind("mouseleave", function(){
		showcase.lens.fadeOut(400);
	});
	
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
            move(i+1);
		 });
		 
	});
	// Inits carousel
	that.children[0] = thumbnails.carousel = thumbnails.wrapper.carousel();
		
	// Hide magnifying glass
	thumbnails.wrapper.bind("mouseenter", function(){
		showcase.lens.fadeOut(400);
	});
	
	/**
	 * 	Methods
	 */
	var move = function(item){
		// Validation
		if(item > showcase.children.length || item < 1 || isNaN(item)){
			alert("Error: Expected to find a number between 1 and " + showcase.children.length + ".");
			return conf.publish;
		};
		
		var visibles = thumbnails.carousel.getSteps(); // Items per page
		var page = thumbnails.carousel.getPage(); // Current page
		var nextPage = Math.ceil( item / visibles ); // Page of "item"

		// Visual config
		$(thumbnails.children[thumbnails.selected-1]).removeClass("ch-thumbnail-on"); // thumbnails.children[0] first children
		$(thumbnails.children[item-1]).addClass("ch-thumbnail-on");

		// Content movement
		var movement = { left: (-item+1) * showcase.itemWidth };
		if(ui.features.transition) { // Have CSS3 Transitions feature?
			showcase.display.css(movement);
		} else { // Ok, let JQuery do the magic...
			showcase.display.animate(movement);
		};
		
		// Trigger movement
		if(page != nextPage) thumbnails.carousel.moveTo(nextPage);

		// Selected
		thumbnails.selected = item;
		
		// Return public object
		return conf.publish;
	};
	
	// Create the publish object to be returned
    conf.publish = that.publish;
    
    /**
	 *  @ Public Properties
	 */
	conf.publish.uid = conf.uid;
	conf.publish.element = conf.element;
	conf.publish.type = conf.type;
	conf.publish.children = that.children;
	conf.publish.moveTo = function(i) {
		// Callback
		that.callbacks(conf, 'onMove');
		return move(i);
	};
	
	// Default behavior (Move to the first item and without callback)
	move(1);
	
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
	
	return conf.publish;
};
