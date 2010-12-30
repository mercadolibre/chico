/**
 *      DEPRECATED
 */

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
        [fixed]: false // default
        [draggable]: false // default
        
    } */
    
    // Initial configuration
	var element = $(o.element);
	var context;
    
	// Default parameters
	if(!o.points) o.points = "cm cm";    
    if(!o.offset) o.offset = "0 0";
    
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
	var getViewport = function() {
    	var viewport;
    	var width;
 		var height;
 		var left;
 		var top;
 				
	 	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
		if (typeof window.innerWidth != "undefined") {
			viewport = window;
			width = viewport.innerWidth;
			height = viewport.innerHeight;
			left = 0 + offset_left + viewport.pageXOffset;
			top = 0 + offset_top + viewport.pageYOffset;
			bottom = height + viewport.pageYOffset;
			right = width + viewport.pageXOffset;
		
		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
		// older versions of IE - viewport = document.getElementsByTagName('body')[0];
		} else if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
			viewport = document.documentElement;
			width = viewport.clientWidth;
			height = viewport.clientHeight;
			left = 0 + offset_left + viewport.scrollLeft;
			top = 0 + offset_top + viewport.scrollTop;
			bottom = height + viewport.scrollTop;
			right = width + viewport.scrollLeft; 
		}

		// Return viewport object
		return {
			element: viewport,			
			left: left,
			top: top,
			bottom: bottom,
			right: right,
			width: width,
			height: height
		}
    };
    
	// Calculate css left and top to element on context
	var getPosition = function(unitPoints) {		     
		// my_x and at_x values together
		var xReferences = {
			ll: context.left,
			lr: context.left + context.width,
			rr: context.left + context.width - element.outerWidth(),
			cc: context.left + context.width/2 - element.outerWidth()/2
			// TODO: lc, rl, rc, cl, cr
		}
		
		// my_y and at_y values together
		var yReferences = {
			tt: context.top,
			tb: context.top + context.height,
			bt: context.top - element.outerHeight(),
			mm: context.top + context.height/2 - element.outerHeight()/2
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
        
        // Check viewport limits
		var viewport = getViewport();
		
		// Down to top
		if ( ( points == "lt lb" ) && ( (styles.top + element.outerHeight()) > viewport.bottom) ) { // Element bottom > Viewport bottom
			unitPoints.my_y = "b";
			unitPoints.at_y = "t";
			
			// New styles
			styles = getPosition(unitPoints);
			styles.direction = "top";
			styles.top -= context.height; // TODO: Al recalcular toma al top del context como si fuese el bottom. (Solo en componentes. En los tests anda ok)
		};
		
		/*// Right to down
		if ( (styles.left + element.outerWidth()) > viewport.right ) { // Element right > Viewport right
			unitPoints.my_x = "l";
			unitPoints.my_y = "t";
			unitPoints.at_x = "l";
			unitPoints.my_y = "t";
			
			// New styles
			styles = getPosition(unitPoints);
			styles.direction = "down";
		};*/
		
		return styles;
	};
	
	
	// Set position to element on context
	var setPosition = function(points) {
		// Separate points config
        var splitted = points.split(" ");
        
        var unitPoints = {
        	my_x: splitted[0].slice(0,1),
        	my_y: splitted[0].slice(1,2),
        	at_x: splitted[1].slice(0,1),
        	at_y: splitted[1].slice(1,2)
        }
        
		var styles = calculatePoints(points, unitPoints);
		
		element
			.css({
				left: styles.left,
				top: styles.top
			})
			.removeClass( "ch-top ch-left ch-down ch-right" )
			.addClass( "ch-" + styles.direction );
	};	
	
	// Get context object and set element position
    var initPosition = function(){
    	// Context by parameter
    	if (o.context) {
    		
		    var contextOffset = o.context.offset();
		    context = {
		    	element: o.context,
				top: contextOffset.top + offset_top,
				left: contextOffset.left + offset_left,
				width: o.context.outerWidth(),
				height: o.context.outerHeight()
		    };
		    
		// Viewport as context
	    } else {
			context = getViewport();
	    };
	    
	    // Set element position	    
	    setPosition(o.points);
	    
    };
    
    // Init
    
    initPosition();    
   	ui.utils.window.bind("resize scroll", initPosition);
   	return $(element);
};
