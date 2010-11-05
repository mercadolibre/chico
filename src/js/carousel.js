/**
 *	Carousel
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.Carousel = function(conf){
	var that = ui.Sliders(); // Inheritance

	// Global configuration
	conf.$trigger = $(conf.trigger).addClass('uiCarousel');
	conf.$htmlContent = $(conf.trigger).find('.carousel').addClass('uiContent');

	// UL Width calculator
	var htmlContentWidth = conf.$htmlContent.children().size() * (conf.$htmlContent.children().outerWidth() + 20);

	// UL configuration
	conf.$htmlContent
		.wrap($('<div>').addClass('mask'))
		.css('width', htmlContentWidth);


	// Mask Object	
	var $mask = conf.$trigger.find('.mask');

	// Steps
	var steps = ~~((conf.$trigger.width() - 100) / (conf.$htmlContent.children().outerWidth() + 20));

	// Move to... (steps in pixels)
	var moveTo = (conf.$htmlContent.children().outerWidth() + 20) * steps;

	// Mask width
	$mask.width( moveTo );

	// Create buttons
	var prev = $('<p>')
		.html('Previous')
		.addClass('prev')
		//.css('top', conf.$htmlContent.offset().top)
		.bind('click', function(event){
			//alert('prev to ' + steps + ' more');
			conf.$htmlContent.animate({left: (parseInt(conf.$htmlContent.css('left')) + moveTo) });			
		})
		//.hide();

	var next = $('<p>')
		.html('Next')
		.addClass('next')
		.bind('click', function(event){
			//alert('next to ' + steps + ' more');
			conf.$htmlContent.animate({left: (parseInt(conf.$htmlContent.css('left')) - moveTo) });
		})
		//.hide();

	// Append buttons
	conf.$trigger
		.prepend(prev)
		.append(next);

	// 1. Init buttons
	// Si el ancho del UL es mayor que el de la mascara, muestra next
	if(htmlContentWidth > $mask.width()) next.show();


	/* Si la posicion del UL mas el ancho del UL
	   (menos un cierto margen que es la mitad de un item)
	   es menor al lado derecho de la mascara entonces oculto el boton
 					if (parseInt(list.css('left'))+list.width()-(e.unitWidth/2)<parseInt($('.mask').css('left'))+$('.mask').width()) {
	*/

	//return { prev: function(event){ that.prev(event, conf); }, next: function(event){ that.next(event, conf); } }
	return that;
};