/**
* Plugin for Chico UI. Gallery for images, videos and maps.
* @name Gallery
* @class Gallery
* @memberOf ch
* @augments ch.Controllers
* @requires ch.Carousel
* @requires ch.onImagesLoads
* @requires ch.Zoom
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.event] "click", "hover". It defines the trigger event of thumbnails behavior. By default it's "hover".
* @param {Number} [conf.selected] Item selected on component load. By default it's 1.
* @param {String} [conf.zoom] "inner", "standard" or "none". Specify if it will instance a Zoom component and the type of that. By default it's "standard".
* @param {String} [conf.zoomMessage] This message will be shown when Zoom component needs to communicate that is in process of load. It's "Loading zoom..." by default.
* @param {Number} [conf.zoomWidth] Width of floated area of zoomed image. Example: 500, "500px", "50%". Default: same as gallery.
* @param {Number} [conf.zoomHeight] Height of floated area of zoomed image. Example: 500, "500px", "50%". Default: same as gallery.
* @returns itself
*/

ch.gallery = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Gallery#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);

	// Event to trigger thumbnail action ("click" or "hover")
	conf.event = conf.event || "hover";

	// Parameter to determine the type of Zoom ("none", "inner", or "standard")
	conf.zoom = conf.zoom || "standard";
	// Width calculated from free space between gallery and right side of layout (20px is the Zoom default offset)
	conf.zoomWidth = conf.zoomWidth || that.$element.parent().width() - that.$element.outerWidth() - 20;
	// Height is same as gallery
	conf.zoomHeight = conf.zoomHeight || that.$element.height();

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.controllers.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/

	/**
	* Reference to the list of items inside Gallery.
	* @private
	* @name ch.Gallery#items
	* @type Object
	*/
	var items = (function () {

		// Object to be exposed
		var self = {};

		/**
		* List element where initial list of images are located.
		* @private
		* @name list
		* @memberOf ch.Gallery#items
		* @type HTMLUlElement
		*/
		self.list = that.$element.children();

		/**
		* Collection of items inside HTML initial code of the Gallery.
		* @private
		* @name $elements
		* @memberOf ch.Gallery#items
		* @type Array
		*/
		self.$elements = self.list.children();

		/**
		* Amount of elements inside list of images.
		* @private
		* @name amount
		* @memberOf ch.Gallery#items
		* @type Number
		*/
		self.amount = self.$elements.length;

		/**
		* Collection of anchors. These are the references to augmented version of original images.
		* @private
		* @name $anchors
		* @memberOf ch.Gallery#items
		* @type Array
		*/
		self.$anchors = self.$elements.children("a");

		/**
		* Index of item selected and showed right now.
		* @private
		* @name selected
		* @memberOf ch.Gallery#items
		* @type Number
		*/
		self.selected = parseInt(conf.selected || conf.value || conf.msg || 1);

		// Expose items object
		return self;
	}()),


	/**
	* Creates the thumbnails Carousel element from original list of items, and sets a method for thumbnails selection.
	* @private
	* @name ch.Gallery#createThumbnails
	* @function
	*/
		createThumbnails = function () {	
			
			// Event of thumbnails behavior
			var thumbEvent = (conf.event === "hover") ? "mouseenter" : "mousedown",
			
			// HTML structure for generate the Carousel
				$structure = $("<div class=\"ch-gallery-thumbs ch-carousel\">"),
			
			// List of thumbnails
				$list = $("<ul>"),
			
			// Each thumbnail reference
				$thumbs,
			
			// Thumbnails Carousel component
				carousel;
			
			// Generate each thumbnail
			$.each(items.$elements, function (i, e) {
				
				// Classnames for thumbnail element and check if it's need css class for select it
				var classes = (i === items.selected - 1) ? ["ch-thumbnail-on"] : [],
				
				// Content to be append to thumbnail
					content = ["<span class=\"cone\"></span>"];
				
				// Video thumbnail
				if ($(e).children("object, embed, video").length > 0) {
					
					// Add classname
					classes.push("ch-thumb-video");
					
					// Update content
					content.push("<span class=\"ico\">Video</span>");
				
				// Video thumbnail
				} else {
					
					// Add classname
					classes.push("ch-thumb-zoomable loading small");
					
					// Thumbnail image Object
					content.push("<img src=\"" + $(e).find("img").attr("data-thumbnail") + "\" />");
										
					// Add magnifying glass when it's Zoom compatible
					if ($(e).children("a").length > 0) { content.push("<span class=\"ico\">(Zoomable)</span>"); }
					
				}
				
				// Thumbnail LI Element
				$("<li class=\"" + classes.join(" ") + "\">" + content.join("") + "</li>")
					.bind(thumbEvent, function () {
						// Select item. Timer is for prevent stack overflow
						setTimeout(function () { that.select(i + 1); }, 50);
					})
					.appendTo($list);
			});
			
			// Intance Carousel component
			carousel = $structure
				.append($list)
				.appendTo(that.$element)
				.carousel({
					"width": that.$element.width()
				});
			
			// Update thumbnails list with reference to List children
			$thumbs = $list.children();
			
			// Expose method for thumbnails selection
			that.thumbnails = function (item) {
				
				// Page of ordered item
				var page = Math.ceil(item / carousel.itemsPerPage());
				
				// Move thumbnails carousel if ordered item is in other page
				if (carousel.page() !== page) { carousel.select(page); }
				
				// Remove selected status from current selected thumbnail
				$thumbs.eq(items.selected - 1).removeClass("ch-thumbnail-on");
				
				// Add selected status to ordered item
				$thumbs.eq(item - 1).addClass("ch-thumbnail-on");
			};
			
		},
	
	/**
	* Creates the main Carousel from images of original HTML code.
	* @private
	* @name ch.Gallery#createDisplay
	* @function
	*/
		createDisplay = function () {
			
			that.display = $("<div class=\"ch-gallery-display ch-carousel\">")
				.append(items.list)
				.appendTo(that.$element)
				.carousel({
					"width": that.$element.width(),
					"arrows": false,
					"fx": false,
				})
				// Select thumbnail from main Carousel selection
				/*.on("select", function () {
					that.thumbnails(this.page());
				});*/
		},
	
	/**
	* Create Zoom from configuration parameters. It can instance a Standard Zoom (from Chico's Floats family), a Inner Zoom (for Enlarge) or simply not create anything.
	* @private
	* @name ch.Gallery#instanceZoom
	* @function
	*/
		instanceZoom = function () {
			
			// Types of Zoom:
			switch (conf.zoom) {
				
			// 1. No Zoom
			case "none": return; break;
			
			// 2. Standard Zoom (default)
			case "standard": default:
			
				// Instance Zoom Component only if it exists in Chico Framework and there are image anchors
				if (!ch.hasOwnProperty("zoom") || items.$anchors.length === 0) { return; }
				
				items.$anchors.each(function (i, e) {
					$(e).zoom({
						"context": that.$element,
						"message": conf.zoomMessage,
						"width": conf.zoomWidth,
						"height": conf.zoomHeight
					});
				});
				
			break;
			
			// 3. Inner Zoom
			case "inner":
				
				// TODO: create an inner zoom here
				
			break;
			
			}
		};

/**
*	Protected Members
*/ 
	
	that.select = function (item) {
		
		// Valid item number
		if(item === items.selected || item < 1 || item > items.amount || isNaN(item)) { return that; }
		
		// Select Display item
		that.display.select(item);
		
		// Select specific thumbnail
		that.thumbnails(item);
		
		// Refresh selected item
		items.selected = item;

		// Callback
		that.trigger("select");
		
		// Return protected scope
		return that;
	};

/**
*	Public Members
*/

	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Gallery#uid
	* @type number
	*/

	/**
	* The element reference.
	* @public
	* @name ch.Gallery#element
	* @type HTMLElement
	*/

	/**
	* The component's type.
	* @public
	* @name ch.Gallery#type
	* @type string
	*/

	// Full behavior
	if (items.amount > 1) {
		
		/**
		* Moves to a defined item of Gallery.
		* @public
		* @function
		* @name ch.Gallery#select
		* @returns Chico UI Object
		* @param {Number} item Item to be selected.
		* @example
		* // Create a Gallery
		* var foo = $("bar").gallery();
		* 
		* // Go to second image
		* foo.select(2);
		*/
		that["public"].select = function (item) {
			// Getter
			if (!item) { return items.selected; }
			
			// Setter
			that.select(item);
			
			return that["public"];
		};

		/**
		* Moves to the previous page.
		* @public
		* @function
		* @name ch.Gallery#prev
		* @returns Chico UI Object
		* @example
		* // Create a Gallery
		* var foo = $("bar").gallery();
		* 
		* // Go to previous page
		* foo.prev();
		*/
		that["public"].prev = function () {
			that.select(items.selected - 1);
			
			return that["public"];
		};
		
		/**
		* Moves to the next page.
		* @public
		* @function
		* @name ch.Gallery#next
		* @returns Chico UI Object
		* @example
		* // Create a Gallery
		* var foo = $("bar").gallery();
		* 
		* // Go to next page
		* foo.next();
		*/
		that["public"].next = function () {
			that.select(items.selected + 1);
			
			return that["public"];
		};

/**
*	Default event delegation
*/
		// Create thumbnails Carousel
		createThumbnails();
		
		// Create display Carousel (main)
		createDisplay();
	}
	
	// Create Zoom from configuration parameters
	instanceZoom();
	
	// Avoid user selection
	ch.utils.avoidTextSelection(that.element);
	
	/**
	* Triggers when the component is ready to use.
	* @name ch.Zoom#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.on("ready",function () {
	*     this.show();
	* });
	*/
	setTimeout(function () { that.trigger("ready"); }, 50);
	
	return that;
};

ch.factory("gallery");
