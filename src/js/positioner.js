// @arg o == configuration
ui.positioner = function( o ) {
/*   References
     points: x, y 
         x values: center, left, right
         y values: middle, top, bottom
         
     examples:
         "cm" = center middle
         "tl" = top left
         "tr" = top right
         "bl" = bottom left
         "br" = bottom right

    example configuration:
    {
        element: $element
        [context]: $element | viewport
        [offset]: "x y" 
        [points]: "cm cm" // default
        [hold]: false // default
        [draggable]: false // default
        
    } */
    
    // Initial configuration
	var element = $(o.element);
	var context;
	var viewport;
	var parentRelative;
    
	// Default parameters 
    o.points = o.points || "cm cm";
    o.offset = o.offset || "0 0";

    // Class names
    var classReferences = {
		"lt lb": "down",
		"lb lt": "top",
		"rt rb": "down",
		"rb rt": "top",
		"lt rt": "right",
		"cm cm": "center"
	};

	// Offset parameter
    var splittedOffset = o.offset.split(" ");
   	var offset_left = parseInt(splittedOffset[0]);
	var offset_top = parseInt(splittedOffset[1]);

    // Get viewport with your configuration - Crossbrowser
    //Conditional Advance Loading method
	var getViewport = (typeof window.innerWidth != "undefined") ?
		// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight 	
		function getViewport() {
			var viewport, width, height, left, top, pageX, pageY;							
			
			viewport = window;
			width = viewport.innerWidth;
			height = viewport.innerHeight;
			pageX = viewport.pageXOffset;
			pageY = viewport.pageYOffset;

			// Return viewport object
			return {
				element: viewport,			
				left: 0 + offset_left + pageX,
				top: 0 + offset_top + pageY,
				bottom: height + pageY,
				right: width + pageX,
				width: width,
				height: height
			}
		}:		
		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
		// older versions of IE - viewport = document.getElementsByTagName('body')[0];
		function getViewport(){
			var viewport, width, height, left, top, pageX, pageY;
			
			viewport = document.documentElement;
			width = viewport.clientWidth;
			height = viewport.clientHeight;
			pageX = viewport.scrollLeft;
			pageY = viewport.scrollTop;
			
			// Return viewport object
			return {
				element: viewport,			
				left: 0 + offset_left + pageX,
				top: 0 + offset_top + pageY,
				bottom: height + pageY,
				right: width + pageX,
				width: width,
				height: height
			}
		};
	
 	
	// Calculate css left and top to element on context
	var getPosition = function(unitPoints) {		     
		// my_x and at_x values together
		// cache properties 
		var contextLeft = context.left;
		var contextTop = context.top;
		var contextWidth = context.width;
		var contextHeight = context.height;
		var elementWidth = element.outerWidth();
		var elementHeight = element.outerHeight();
		
		
		var xReferences = {
			ll: contextLeft,
			lr: contextLeft + contextWidth,
			rr: contextLeft + contextWidth - elementWidth,
			cc: contextLeft + contextWidth/2 - elementWidth/2
			// TODO: lc, rl, rc, cl, cr
		}
		
		// my_y and at_y values together
		var yReferences = {
			tt: contextTop,
			tb: contextTop + contextHeight,
			bt: contextTop - elementHeight,
			mm: contextTop + contextHeight/2 - elementHeight/2
			// TODO: tm, bb, bm, mt, mb
		}
		
		var axis = {
			left: xReferences[unitPoints.my_x + unitPoints.at_x],
			top: yReferences[unitPoints.my_y + unitPoints.at_y]	
		} 

		return axis;
	};
	
	// Evaluate viewport spaces and set points
	var calculatePoints = function(points, unitPoints){					
		// Default styles
        var styles = getPosition(unitPoints);
        	styles.direction = classReferences[points];
		
		// Hold behavior
		if (o.hold) return styles;

        // Check viewport limits	
		// Down to top
		console.log(parentRelative.top);
		if ( (points == "lt lb") && ((styles.top + parentRelative.top + element.outerHeight()) > viewport.bottom) ) { // Element bottom > Viewport bottom
			unitPoints.my_y = "b";
			unitPoints.at_y = "t";
			
			//store old styles
			stylesDown = styles;
			
			// New styles		 
			styles = getPosition(unitPoints);
			styles.direction = "top";
			styles.top -= (2 * offset_top);
		
			// Top to Down - Default again 
			if(styles.top + parentRelative.top < viewport.top){
				unitPoints.my_y = "t";
				unitPoints.at_y = "b";
				styles = stylesDown;
				styles.direction = "down";
			};
		};
		
		// Left to right
		if ( (styles.left + parentRelative.left + element.outerWidth()) > viewport.right ) { // Element right > Viewport right
			unitPoints.my_x = "r";
			unitPoints.at_x = "r";
			
			// New styles
			var current = styles.direction;
			styles = getPosition(unitPoints);
			styles.direction = current + "-right";						
			styles.left -= (2 * offset_left);
			if(current == "top") styles.top -= (2 * offset_top);
		};
		
		
		
		return styles;
	};
	
	
	// Set position to element on context
	var setPosition = function() {
		// Separate points config
        var splitted = o.points.split(" ");
        
        var unitPoints = {
        	my_x: splitted[0].slice(0,1),
        	my_y: splitted[0].slice(1,2),
        	at_x: splitted[1].slice(0,1),
        	at_y: splitted[1].slice(1,2)
        }
        
		var styles = calculatePoints(o.points, unitPoints);
		
		element
			.css({
				left: styles.left,
				top: styles.top
			})
			.removeClass( "ch-top ch-left ch-down ch-right ch-down-right ch-top-right" )
			.addClass( "ch-" + styles.direction );
				
		if ( context.hasOwnProperty("element") ){
			context.element
				.removeClass( "ch-top ch-left ch-down ch-right ch-down-right ch-top-right" )
				.addClass( "ch-" + styles.direction );
		};

	};	

	// Get context	
	//Conditional Advance Loading method
	var getContext = (o.context) ?		
		function getContext(){
			
			var contextOffset = o.context.offset();
		
		    context = {
		    	element: o.context,
				top: contextOffset.top + offset_top - parentRelative.top,
				left: contextOffset.left + offset_left - parentRelative.left,
				width: o.context.outerWidth(),
				height: o.context.outerHeight()
		    };
		    
		    return context;
		}:
		function getContext(){
			return viewport;
		};
	
	
	var getParentRelative = function(){
		var relative = {};
			relative.left = 0;
			relative.top = 0;
		
		element.parents().each(function(i, e){
			if ( $(e).css("position") != "relative" ) return;
		
			var borderLeft = ($(e).outerWidth() - $(e).width() - ( parseInt($(e).css("padding-left")) * 2 )) / 2;
			
			relative = $(e).offset();
			relative.left -= offset_left - borderLeft;
			relative.top -= offset_top;
			
			return false;
		});
		
		return {
			left: relative.left,
			top: relative.top
		};
	};
	

	// Set element position on resize
	
    var initPosition = function(){
    	// Hidden behavior
		if( element.css("display") === "none" ) return; 	
		
	    viewport = getViewport();
	    parentRelative = getParentRelative();
	    context = getContext();
	    setPosition();
    };

	// Init	
	initPosition();
	
	// Scroll and resize events
	// Tested on IE = Magic, no lag!! 
	var scrolled = false;	
	
	ui.utils.window.bind("resize scroll", function() {
		scrolled = true;
	});
	
	setInterval(function() {
	    if( !scrolled ) return;
		scrolled = false;	
		initPosition();
	    
	}, 250);
	

	return $(element);
};
