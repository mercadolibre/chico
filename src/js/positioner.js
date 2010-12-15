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
			//alert( viewport.pageXOffset + ' ' + viewport.pageYOffset );
			left = 0 + offset_left + viewport.pageXOffset;
			top = 0 + offset_top + viewport.pageYOffset;
			
		
		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
		// older versions of IE - viewport = document.getElementsByTagName('body')[0];
		} else if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
			viewport = document.documentElement;
			width = viewport.clientWidth;
			height = viewport.clientHeight;
			//window.scrollLeft window.scrollTop
			//alert( viewport.scrollLeft + ' ' + viewport.scrollTop );
			left = 0 + offset_left + viewport.scrollLeft;
			top = 0 + offset_top + viewport.scrollTop; 
		}
		
		// Return viewport object
		return {
			element: viewport,			
			left: left,
			top: top,
			width: width,
			height: height
		}
    };
	
	// Calculate and set position to element on context
	var setPosition = function(points) {
		// Separate points config
        var splitted = points.split(" ");
        
        // Element points
        var my_x = splitted[0].slice(0,1);
        var my_y = splitted[0].slice(1,2);
        
        // Context points
        var at_x = splitted[1].slice(0,1);
        var at_y = splitted[1].slice(1,2);
        
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
		
		var classReferences = {
			"lt lb": "down",
			"lb lt": "top",
			"rt rb": "down",
			"rb rt": "top",
			"lt rt": "right"

		}
				
		
		// Check viewport limits
		/*var reverseReferences = {
			"l": "r",
			"r": "l",
			"t": "b",
			"b": "t"
		}*/
		var cssLeft = xReferences[my_x + at_x];
		var cssTop = yReferences[my_y + at_y];

		
		// Set element css position
		element
			.css({
				left: cssLeft,
				top: cssTop
			})
			.addClass( classReferences[points] );
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
   	ui.utils.window.bind("resize", initPosition);
   	if( o.fixed ) ui.utils.window.bind("scroll", initPosition);
   	return $(element);
};