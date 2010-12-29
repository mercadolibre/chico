/**
 *	Carousel
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.carousel = function(conf){
	var that = ui.object(); // Inheritance
	var status = false;
	var page = 1;

	// Global configuration
	conf.$trigger = $(conf.element).addClass('ch-carousel');
	conf.$htmlContent = $(conf.element).find('.carousel').addClass('ch-carousel-content'); // TODO: wrappear el contenido para que los botones se posicionen con respecto a su contenedor
    conf.publish = that.publish;

	// UL Width calculator
	var htmlElementMargin = ($.browser.msie && $.browser.version == '6.0') ? 21 : 20;//IE necesita 1px de más
	var htmlContentWidth = conf.$htmlContent.children().size() * (conf.$htmlContent.children().outerWidth() + htmlElementMargin);
	
	// UL configuration
	conf.$htmlContent
		.wrap($('<div>').addClass('mask'))//gracias al que esta abajo puedo leer el $mask.width()
		.css('width', htmlContentWidth);
		
	// Mask Object	
	var $mask = conf.$trigger.find('.mask');

	// Steps = (width - marginMask / elementWidth + elementMargin)
	var steps = ~~( (conf.$trigger.width() - 70) / (conf.$htmlContent.children().outerWidth() + 20));
		steps = (steps == 0) ? 1 : steps;	

	// Move to... (steps in pixels)
	var moveTo = (conf.$htmlContent.children().outerWidth() + 20) * steps;

	// Mask configuration
	var margin = ($mask.width()-moveTo) / 2;
	$mask.width( moveTo ).height( conf.$htmlContent.children().outerHeight() );
	//if(conf.arrows != false) $mask.css('marginLeft', margin);
	
	var prev = function(event) {
		if(status) return;//prevButton.css('display') === 'none' limit public movement
		
		var htmlContentPosition = conf.$htmlContent.position();
		
		status = true;
		
		conf.$htmlContent.animate({ left: htmlContentPosition.left + moveTo }, function(){
			htmlContentPosition = conf.$htmlContent.position();			
			if(htmlContentPosition.left >= 0) prevButton.hide();
			nextButton.show();
			status = false;
		});
        
        page--;
        
        // return publish object
        return conf.publish;
	}
	
	//En IE6 al htmlContentWidth por algun motivo se le suma el doble del width de un elemento (li) y calcula mal el next()
	if($.browser.msie && $.browser.version == '6.0') htmlContentWidth = htmlContentWidth - (conf.$htmlContent.children().outerWidth()*2);
	
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

		page++;
		
        // return publish object
        return conf.publish;
	}
	
	// Create buttons
	var prevButton = $('<p>')
		.html('Previous')
		.addClass('prev')
		.bind('click', prev)
		.hide()
		.css('top', (conf.$htmlContent.children().outerHeight() - 57) / 2 + 10); // 57 = button height | 10 = box padding top

	var nextButton = $('<p>')
		.html('Next')
		.addClass('next')
		.bind('click', next)
		.hide()
		.css('top', (conf.$htmlContent.children().outerHeight() - 57) / 2 + 10); // 57 = button height | 10 = box padding top
	
	
	//TODO: refactorizar todo este metodo que se encarga de avanzar por páginas
	var select = function(item){
		var itemPage = ~~(item / steps) + 1; // Page of "item"

		if(itemPage > page){
			var distance = itemPage - page; 
			
			if(status) return;//nextButton.css('display') === 'none' limit public movement
			
			var htmlContentPosition = conf.$htmlContent.position(); // Position before moving
			
			status = true;
			
			conf.$htmlContent.animate({ left: htmlContentPosition.left - (moveTo * distance) }, function(){
				htmlContentPosition = conf.$htmlContent.position(); // Position after moving
				if(htmlContentPosition.left + htmlContentWidth <= $mask.width()) nextButton.hide();
				prevButton.show();
				status = false;
			});
	
			page += distance;
			
		}else if (itemPage < page){
			var distance = page - itemPage;
			
			if(status) return;//prevButton.css('display') === 'none' limit public movement
		
			var htmlContentPosition = conf.$htmlContent.position();
			
			status = true;
			
			conf.$htmlContent.animate({ left: htmlContentPosition.left + (moveTo * distance) }, function(){
				htmlContentPosition = conf.$htmlContent.position();			
				if(htmlContentPosition.left >= 0) prevButton.hide();
				nextButton.show();
				status = false;
			});
	        
	        page -= distance;
		}
		
		// return publish object
	    return conf.publish;
	};
	
	if (conf.arrows != false) {
		// Append buttons
		conf.$trigger.prepend(prevButton).append(nextButton);
		// Si el ancho del UL es mayor que el de la mascara, muestra next
		if(htmlContentWidth > $mask.width()){ nextButton.show();}
	};
	
	// Pager
	if (conf.pager) {
		var totalPages = (conf.$htmlContent.children().size() / steps); 
		var pager = $("<ul class=\"ch-pager\">")
		
		// Create each mini page
		var circle = [];
		for(var i = 1, j = totalPages + 1; i < j; i += 1){
			circle.push( "<li>" + i + "</li>");
		};
		
		pager.append(circle.join(""));
		
		conf.$trigger.append( pager );
		
		$(".ch-pager").children().each(function(i, e){
			$(e).bind("click", function(){ select(i) });
		});
	}

    // create the publish object to be returned

        conf.publish.uid = conf.id;
        conf.publish.element = conf.element;
        conf.publish.type = "ui.carousel";
        conf.publish.getSteps = function() { return steps; };
        conf.publish.getPage = function() { return page; };
        conf.publish.select = function(item) { return select(item) };
        conf.publish.next = function(){ return next($.Event()); };
        conf.publish.prev = function(){ return prev($.Event()); };

	return conf.publish;
}
