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
	$mask.width( moveTo ).height( conf.$htmlContent.children().outerHeight() + 2 ); // +2 for content with border
	//if(conf.arrows != false) $mask.css('marginLeft', margin);
	
	var prev = function(event) {
		if(status) return;//prevButton.css('display') === 'none' limit public movement
		
		var htmlContentPosition = conf.$htmlContent.position();
		
		status = true;
		
		conf.$htmlContent.animate({ left: htmlContentPosition.left + moveTo }, function(){
			htmlContentPosition = conf.$htmlContent.position();			
			if(htmlContentPosition.left >= 0) buttons.prev.hide();
			buttons.next.show();
			status = false;
		});
        
        page--;
        
        if (conf.pager) {
			$(".ch-pager li").removeClass("on");
			$(".ch-pager li:nth-child(" + page + ")").addClass("on");
		}
        
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
			if(htmlContentPosition.left + htmlContentWidth <= $mask.width()) buttons.next.hide();
			buttons.prev.show();
			status = false;
		});

		page++;
		
		if (conf.pager) {
			$(".ch-pager li").removeClass("on");
			$(".ch-pager li:nth-child(" + page + ")").addClass("on");
		}
		
        // return publish object
        return conf.publish;
	}
	
	
	
	// Create buttons
	var buttons = {};
	
	buttons.prev = {};
	
	buttons.prev.$element = $('<p class="prev">Previous</p>')
		.bind('click', function(){ buttons.prev.move(1) })
		.css('top', (conf.$trigger.outerHeight() - 22) / 2) // 22 = button height
	
	buttons.prev.show = function(){
		buttons.prev.$element
			.addClass("on")
			.bind('click', function(){ buttons.prev.move(1) })
	};
	
	buttons.prev.hide = function(){
		buttons.prev.$element
			.removeClass("on")
			.unbind('click')
	};
	
	buttons.prev.move = function(distance){
		if(status || conf.$htmlContent.position().left == 0) return;
		
		var htmlContentPosition = conf.$htmlContent.position();
		
		status = true;
		
		conf.$htmlContent.animate({ left: htmlContentPosition.left + (moveTo * distance) }, function(){
			htmlContentPosition = conf.$htmlContent.position();			
			if(htmlContentPosition.left >= 0) buttons.prev.hide();
			buttons.next.show();
			status = false;
		});
        
        page -= distance;
        
        if (conf.pager) {
			$(".ch-pager li").removeClass("on");
			$(".ch-pager li:nth-child(" + page + ")").addClass("on");
		}
		
		// Callback
		that.callbacks(conf, 'prev');
        
        // return publish object
        return conf.publish;
	};
	
	
	
	buttons.next = {};
	
	buttons.next.$element = $('<p class="next">Next</p>')
		.bind('click', function(){ buttons.next.move(1) })
		.css('top', (conf.$trigger.outerHeight() - 22) / 2) // 22 = button height
	
	buttons.next.show = function(){
		buttons.next.$element
			.addClass("on")
			.bind('click', function(){ buttons.next.move(1) })
	};
	
	buttons.next.hide = function(){
		buttons.next.$element
			.removeClass("on")
			.unbind('click')
	};
	
	buttons.next.move = function(distance){
		if(status || conf.$htmlContent.position().left + htmlContentWidth == $mask.width()) return;
		
		var htmlContentPosition = conf.$htmlContent.position(); // Position before moving
		
		status = true;
		
		conf.$htmlContent.animate({ left: htmlContentPosition.left - (moveTo * distance) }, function(){
			htmlContentPosition = conf.$htmlContent.position(); // Position after moving
			if(htmlContentPosition.left + htmlContentWidth <= $mask.width()) buttons.next.hide();
			buttons.prev.show();
			status = false;
		});

		page += distance;
		
		if (conf.pager) {
			$(".ch-pager li").removeClass("on");
			$(".ch-pager li:nth-child(" + page + ")").addClass("on");
		}
		
		// Callback
		that.callbacks(conf, 'next');
		
        // return publish object
        return conf.publish;
	};
	
	
		
	var select = function(item){
		var itemPage = ~~(item / steps) + 1; // Page of "item"
		
		// Move right
		if(itemPage > page){
			buttons.next.move(itemPage - page);
		// Move left
		}else if(itemPage < page){
	        buttons.prev.move(page - itemPage);
		};
		
		if (conf.pager) {
			$(".ch-pager li").removeClass("on");
			$(".ch-pager li:nth-child(" + page + ")").addClass("on");
		}
		
		// Callback
		that.callbacks(conf, 'select');
		
		// return publish object
	    return conf.publish;
	};
	
	
	
	/**
	 *	Buttons
	 */
	
	// Append prev and next
	conf.$trigger.prepend(buttons.prev.$element).append(buttons.next.$element);
	
	// Si el ancho del UL es mayor que el de la mascara, activa next
	if(htmlContentWidth > $mask.width()){
		buttons.next.show();
	}
	
	// Pager
	if (conf.pager) {
		var totalPages = Math.ceil(conf.$htmlContent.children().size() / steps); 
		var list = $("<ul class=\"ch-pager\">");
		var thumbs = [];
		
		// Create each mini thumb
		for(var i = 1, j = totalPages + 1; i < j; i += 1){
			thumbs.push( "<li>" + i + "</li>" );
		};
		list.append( thumbs.join("") );
		
		// Create pager
		conf.$trigger.append( list );
		
		// Position
		var pager = $(".ch-pager");
		var contextWidth = pager.parent().width();
		var pagerWidth = pager.outerWidth();
		
		pager.css('left', (contextWidth - pagerWidth) / 2);
		
		// Children functionality
		pager.children().each(function(i, e){
			$(e).bind("click", function(){
				select(i);
			});
		});
	}


    // Create the publish object to be returned
    conf.publish.uid = conf.id;
    conf.publish.element = conf.element;
    conf.publish.type = "carousel";
    conf.publish.getSteps = function() { return steps; };
    conf.publish.getPage = function() { return page; };
    conf.publish.select = function(item) { return select(item); };
    conf.publish.next = function(){ return buttons.next.move(1); };
    conf.publish.prev = function(){ return buttons.prev.move(1); };
    
    

	return conf.publish;
}
