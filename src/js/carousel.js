/**
 *	Carousel
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.Carousel = function(conf){
	var that = ui.PowerConstructor(); // Inheritance
	var status = false;

	// Global configuration
	conf.$trigger = $(conf.element).addClass('uiCarousel');
	conf.$htmlContent = $(conf.element).find('.carousel').addClass('uiContent'); // TODO: wrappear el contenido para que los botones se posicionen con respecto a su contenedor

	// UL Width calculator
	var htmlElementMargin = ($.browser.msie && $.browser.version == '6.0') ? 40 : 20;
	var htmlContentWidth = conf.$htmlContent.children().size() * (conf.$htmlContent.children().outerWidth() + htmlElementMargin);

	// UL configuration
	conf.$htmlContent
		.wrap($('<div>').addClass('mask'))//gracias al que esta abajo puedo leer el $mask.width()
		.css('width', htmlContentWidth);
		
	// Mask Object	
	var $mask = conf.$trigger.find('.mask');

	// Steps = (width - marginMask / elementWidth + elementMargin)
	var steps = ~~( $mask.width() / (conf.$htmlContent.children().outerWidth() + 20));
	steps = (steps==0) ? 1 : steps;
	
	// Move to... (steps in pixels)
	var moveTo = (conf.$htmlContent.children().outerWidth() + 20) * steps;

	// Mask configuration
	var margin = ($mask.width()-moveTo)/2 +35;
	$mask.width( moveTo ).height( conf.$htmlContent.outerHeight() ); 
	if(conf.arrows != false) $mask.css('marginLeft', margin);
	
	var prev = function(event){
		if(status) return;//prevButton.css('display') === 'none' limit public movement
		
		var htmlContentPosition = conf.$htmlContent.position();
		
		status = true;
		
		conf.$htmlContent.animate({ left: htmlContentPosition.left + moveTo }, function(){
			htmlContentPosition = conf.$htmlContent.position();			
			if(htmlContentPosition.left >= 0) prevButton.hide();
			nextButton.show();
			status = false;
		});
	};
	
	var next = function(event){
		if(status) return;//nextButton.css('display') === 'none' limit public movement
		
		var htmlContentPosition = conf.$htmlContent.position(); // Position before moving
		
		status = true;
		
		conf.$htmlContent.animate({ left: htmlContentPosition.left - moveTo }, function(){
			htmlContentPosition = conf.$htmlContent.position(); // Position after moving
			if(htmlContentPosition.left + htmlContentWidth <= $mask.width()) nextButton.hide();
			prevButton.show();
			status = false;
		});		
	};
	
	// Create buttons
	var prevButton = $('<p>')
		.html('Previous')
		.addClass('prev')
		.bind('click', prev)
		.hide()
		.css('top', (conf.$htmlContent.outerHeight() - 57) / 2 + 10); // 57 = button height | 10 = box padding top

	var nextButton = $('<p>')
		.html('Next')
		.addClass('next')
		.bind('click', next)
		.hide()
		.css('top', (conf.$htmlContent.outerHeight() - 57) / 2 + 10); // 57 = button height | 10 = box padding top
	
	
	
	if(conf.arrows != false) {
		// Append buttons
		conf.$trigger.prepend(prevButton).append(nextButton);
		// Si el ancho del UL es mayor que el de la mascara, muestra next
		if(htmlContentWidth > $mask.width()){ nextButton.show();}
	};

	return { nxt: function(event){ next(event)}, prv: function(event){ prev(event)} }
};
