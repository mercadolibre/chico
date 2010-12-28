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
	// Set content visual config
	conf.$htmlContent
		.css('width', that.children.length * itemWidth)
		.addClass("ch-viewer-content");
	// Content functionality
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
					content: "<img src=\"" + $(that.children[i]).find("img").attr("src").replace("v=V", "v=O") + "\">"
				})
		);
	};
	
	// Thumbnails wrapper
	var $wrapper = $("<div>").addClass("ch-viewer-triggers");
	// Clone image list
	var triggers = $(conf.element).children().clone().addClass("carousel");
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
	// Init carousel
	var thumbsCarousel = $(".ch-viewer-triggers").carousel(); // TODO: guardar el carrousel dentro del viewer
	
	// Methods
	// Show item modal
	var zoom = function(item){
		modals[item].show();
		
		return conf.publish; // Return public object
	};
	
	// Thumbnail functionality
	var selectedThumb; // Item selected previously
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