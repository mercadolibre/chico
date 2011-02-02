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
	var htmlElementMargin = (ui.utils.html.hasClass("ie6")) ? 21 : 20; // IE needs 1px more
	var extraWidth = (ui.utils.html.hasClass("ie6")) ? conf.$htmlContent.children().outerWidth() : 0;
	var htmlContentWidth = conf.$htmlContent.children().size() * (conf.$htmlContent.children().outerWidth() + htmlElementMargin) + extraWidth;
	
	// UL configuration
	conf.$htmlContent
		.wrap($('<div>').addClass('ch-mask'))//gracias al que esta abajo puedo leer el $mask.width()
		.css('width', htmlContentWidth);
		
	// Mask Object	
	var $mask = conf.$trigger.find('.ch-mask');

	// Steps = (width - marginMask / elementWidth + elementMargin) 70 = total margin (see css)
	var steps = ~~( (conf.$trigger.width() - 70) / (conf.$htmlContent.children().outerWidth() + 20));
		steps = (steps == 0) ? 1 : steps;	
	var totalPages = Math.ceil(conf.$htmlContent.children().size() / steps);

	// Move to... (steps in pixels)
	var moveTo = (conf.$htmlContent.children().outerWidth() + 20) * steps;
	// Mask configuration
	var margin = ($mask.width()-moveTo) / 2;
	$mask.width( moveTo ).height( conf.$htmlContent.children().outerHeight() + 2 ); // +2 for content with border
	//if(conf.arrows != false) $mask.css('marginLeft', margin);
	
	//En IE6 al htmlContentWidth por algun motivo se le suma el doble del width de un elemento (li) y calcula mal el next()
	if($.browser.msie && $.browser.version == '6.0') htmlContentWidth = htmlContentWidth - (conf.$htmlContent.children().outerWidth()*2);
	
	
	// Buttons
	var buttons = {
		prev: {
			$element: $('<p class="ch-prev">Previous</p>').bind('click', function(){ move("prev", 1) }).css('top', (conf.$trigger.outerHeight() - 22) / 2), // 22 = button height
			on: function(){ buttons.prev.$element.addClass("ch-prev-on") },
			off: function(){ buttons.prev.$element.removeClass("ch-prev-on") }
		},
		next: {
			$element: $('<p class="ch-next">Next</p>').bind('click', function(){ move("next", 1) }).css('top', (conf.$trigger.outerHeight() - 22) / 2), // 22 = button height
			on: function(){ buttons.next.$element.addClass("ch-next-on") },
			off: function(){ buttons.next.$element.removeClass("ch-next-on") }
		}
	};
	
	// Buttons behavior
	conf.$trigger.prepend( buttons.prev.$element ).append( buttons.next.$element ); // Append prev and next buttons
	if (htmlContentWidth > $mask.width()) buttons.next.on(); // Activate Next button if items amount is over carousel size
	
	
	var move = function(direction, distance){
		var movement;
		
		switch(direction){
			case "prev":
				// Validation
				if(status || (page - distance) <= 0) return;
				
				// Next move
				page -= distance;
				
				// Css object
				movement = conf.$htmlContent.position().left + (moveTo * distance);
				
				// Buttons behavior
				if(page == 1) buttons.prev.off();
				buttons.next.on();
			break;
			case "next":
				// Validation
				if(status || (page + distance) > totalPages) return;
				
				// Next move
				page += distance;
				
				// Css object
				movement = conf.$htmlContent.position().left - (moveTo * distance);
				
				// Buttons behavior
				if(page == totalPages) buttons.next.off();
				buttons.prev.on();
			break;
		};
				
		// Status moving
		status = true;
		
		// Function executed after movement
		var afterMove = function(){
			status = false;
			
			// Pager behavior
			if (conf.pager) {
				$(".ch-pager li").removeClass("ch-pager-on");
				$(".ch-pager li:nth-child(" + page + ")").addClass("ch-pager-on");
			};

			// Callbacks
			that.callbacks(conf, "onMove");
		};
		
		// Have CSS3 Transitions feature?
		if (ui.features.transition) {
			
			// Css movement
			conf.$htmlContent.css({ left: movement });
			
			// Callback
			afterMove();
			
		// Ok, let JQuery do the magic...
		} else {
			conf.$htmlContent.animate({ left: movement }, afterMove);
		};
		
		// Returns publish object
		return conf.publish;
	};
	
	
	var select = function(item){
		var itemPage = ~~(item / steps) + 1; // Page of "item"
		
		// Move right
		if(itemPage > page){
			move("next", itemPage - page);
		// Move left
		}else if(itemPage < page){
	        move("prev", page - itemPage);
		};
		
		if (conf.pager) {
			$(".ch-pager li").removeClass("ch-pager-on");
			$(".ch-pager li:nth-child(" + page + ")").addClass("ch-pager-on");
		}
			
		// return publish object
	    return conf.publish;
	};
	
	
	var pager = function(){
		var list = $("<ul class=\"ch-pager\">");
		var thumbs = [];
		
		// Create each mini thumb
		for(var i = 1, j = totalPages + 1; i < j; i += 1){
			thumbs.push("<li>");
			thumbs.push(i);
			thumbs.push("</li>");
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
	};
	
	// Create pager if it was configured
	if (conf.pager) pager();
	
	
    // Create the publish object to be returned
    conf.publish.uid = conf.id;
    conf.publish.element = conf.element;
    conf.publish.type = "carousel";
    conf.publish.getSteps = function() { return steps; };
    conf.publish.getPage = function() { return page; };
    conf.publish.moveTo = function(item) { return select(item); };
    conf.publish.next = function(){ return move("next", 1); };
    conf.publish.prev = function(){ return move("prev", 1); };
 
	return conf.publish;
}
