/**
 *	Viewer
 *	@author
 *	@Contructor
 *	@return An interface object
 */
ui.viewer = function(conf){
	var that = ui.controllers(); // Inheritance
	
	// Viewer container
	$(conf.element)
		// Add classname
		.addClass("ch-viewer")
		// Create magnifying glass
		.append( $("<div class=\"ch-lens\">") );
	// Get magnifying glass
	var lens = $(conf.element).find(".ch-lens");
	
	// Display
	conf.$htmlContent = $(conf.element).children(":first");
	// Children
	that.children = conf.$htmlContent.find("a");
	// Children width
	var itemWidth = $(that.children[0]).parent().outerWidth();

	
	// Thumbnails wrapper
	var $wrapper = $("<div>").addClass("ch-viewer-triggers");
	// Clone image list
	var triggers = $(conf.element).find("ul").clone().addClass("carousel");
	var modalCarousel = $(conf.element).find("ul").clone().addClass("carousel");

	// Content functionality
	var caro;
	var loadModalContent = function(){
		$(".ch-viewer-modal-content").parent().addClass("ch-viewer-modal");
		modalCarousel.find("img").each(function(i, e){
			$(e).attr("src", $(e).attr("src").replace("v=V", "v=O"));
			/*ui.positioner({ FUCK!
		        element: $(e),
		        context: $(e).parents("li")
			});*/
		});
		
		$(".ch-viewer-modal-content").html( modalCarousel );
		caro = $(".ch-viewer-modal-content").carousel({ pager: true });
		$(".ch-viewer-modal-content .ch-carousel-content").css("left",0); // Reset position
		caro.select(selectedThumb);
	};
	
	// Content functionality
	var hideModalContent = function(){		
		$("ch-viewer-modal").remove();
		for(var i = 0, j = ui.instances.carousel.length; i < j; i ++){			
			if(ui.instances.carousel[i].element === caro.element){
				ui.instances.carousel.splice(i,1);
				return;
			} 
		};		
	};
	
	var modals = [];
	
	for(var i = 0, j = that.children.length; i < j; i ++){
		modals.push(
			$(that.children[i])
				// Show magnifying glass
				.bind("mouseover", function(){
					lens.fadeIn(400);
				})
				// Hide magnifying glass
				.bind("mouseleave", function(){
					lens.fadeOut(400);
				})
				// Instance modal
				.modal({
					content: "<div class=\"ch-viewer-modal-content\">",
					callbacks: {
						show: loadModalContent,
						hide: hideModalContent
					}
				})
				
		);
		
	};

	// Set content visual config
	conf.$htmlContent
		.css('width', that.children.length * itemWidth)
		.addClass("ch-viewer-content");
	
	// Create carousel structure
	$(conf.element).append( $wrapper.append(triggers) );
	// Thumbnails
	var thumbnails = $wrapper.find("a");
	thumbnails.find("img").each(function(i, e){
		// Change image parameter (thumbnail size)
		$(e).attr("src", $(e).attr("src").replace("v=V", "v=M"));
		
		// Thumbnail link click
		$(e).parent().bind("click", function(event){
			that.prevent(event);
			select(i);
		});
	});
	// Inits carousel
	var thumbsCarousel = $(".ch-viewer-triggers").carousel(); // TODO: guardar el carrousel dentro del viewer
	
	// Methods
	// Show item modal
	var zoom = function(item){
		modals[item].show();
		
		return conf.publish; // Return public object
	};
	
	// Thumbnail functionality
	var selectedThumb = 0; // Item selected previously
	var select = function(item){
		// Validation
		if(item > that.children.length-1 || item < 0 || isNaN(item)){
			alert("Error: Expected to find a number between 0 and " + (that.children.length-1) + ".");
			return;
		};
		
		var visibles = thumbsCarousel.getSteps(); // Items per page
		var page = thumbsCarousel.getPage(); // Current page
		var nextPage = ~~(item / visibles) + 1; // Page of "item"
		
		// Visual config		
		$(thumbnails[selectedThumb]).removeClass("on");
		$(thumbnails[item]).addClass("on");
		
		// Content movement
		conf.$htmlContent.animate({ left: -item * itemWidth });// Reposition content
		// Trigger movement
		if (selectedThumb < visibles && item >= visibles && nextPage > page) {
			thumbsCarousel.next();
		}else if (selectedThumb >= visibles && item < visibles && nextPage < page ) {
			thumbsCarousel.prev();
		};
		
		// Selected
		selectedThumb = item;
		
		// Return public object
		return conf.publish;
	};
	
	
	// Public object
    conf.publish = {
		uid: conf.id,
		element: conf.element,
		type: "ui.viewer",
		children: that.children,
		select: function(i){ return select(i); },
		zoom: function(i){ return zoom(i); }
    }
	
	// Default behavior
	select(0);
	
	return conf.publish;
};