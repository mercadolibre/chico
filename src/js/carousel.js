/**
* Carousel is a large list of elements. Some elements will be shown in a preset area, and others will be hidden waiting for the user interaction to show it.
* @name Carousel
* @class Carousel
* @augments ch.Uiobject
* @requires ch.List
* @memberOf ch
* @param {Configuration Object} conf Object with configuration properties
* @returns Chico UI Object
*/

ch.carousel = function (conf) {
	
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @protected
	* @name ch.Carousel#that
	* @type Object
	*/
	var that = this;
	
	conf = ch.clon(conf);
	
	// Configurable pagination
	// TODO: Add support to goTo function on asynchronous item load.
	conf.pagination = (!ch.utils.hasOwn(conf, "asyncData") ? conf.pagination : false) || false;
	
	// Configuration for continue Carousel
	// TODO: Rolling is forced to be false. Use this: conf.rolling = (ch.utils.hasOwn(conf, "rolling")) ? conf.rolling : true;
	conf.rolling = false;
	
	// Configurable arrows
	conf.arrows = ch.utils.hasOwn(conf, "arrows") ? conf.arrows : true;
	
	// Configurable efects
	conf.fx = ch.utils.hasOwn(conf, "fx") ? conf.fx : true;
	
	that.conf = conf;
	
/**
*  Inheritance
*/

	that = ch.uiobject.call(that);
	that.parent = ch.clon(that);

/**
*  Private Members
*/
	
	/**
	* Does what is necessary to make ready the component structure.
	* @private
	* @name ch.Carousel#createLayout
	* @function
	*/
	var createLayout = function () {
		
		// Add class to component to support old HTML snippet
		that.$element.addClass("ch-carousel");
		
		// Calculate extra width for content
		extraWidth = (ch.utils.html.hasClass("ie6")) ? that.itemsWidth : 0;
		
		// Set width to Carousel if exists a width in configuration
		if (ch.utils.hasOwn(conf, "width")) { that.$element.css("width", conf.width); }
		
		// Set height to Carousel if exists a height in configuration
		if (ch.utils.hasOwn(conf, "height")) { that.$element.css("height", conf.height); }
		
		// Disable CSS transition if it's specified
		if (!conf.fx && ch.features.transition) { that.$content.addClass("ch-carousel-nofx"); }
		
		// Set container size based on items size
		that.$mask.css("height", that.$items.outerHeight());
		
		// WAI-ARIA for items
		$.each(that.$items, function (i, e) {
			
			// Page where this item is in
			var page = ~~(i / that.itemsPerPage) + 1;
			
			$(e).attr({
				"aria-hidden": page !== that.currentPage,
				"aria-setsize": that.itemsTotal,
				"aria-posinset": i + 1,
				"aria-label": "page" + page
			});
		});
		
		// Total amount of items (Widthout include queue items)
		var itemsAmount = that.$items.length;
		
		// At the begin, add items from queue if page is incomplete
		if (ch.utils.hasOwn(conf, "asyncData") && itemsAmount < that.itemsPerPage) {
			that.addItems(that.itemsPerPage - itemsAmount);
		}
	},
	
	/**
	* Creates Previous and Next arrows.
	* @private
	* @function
	* @name ch.Carousel#createArrows
	*/
		createArrows = function () {
			
			// Previous arrow
			var $prev = $("<p class=\"ch-prev-arrow" + (conf.rolling ? "" : " ch-hide") + "\" role=\"button\" aria-hidden=\"" + (!conf.rolling) + "\"><span>Previous</span></p>")
				.bind("click", that.prev)
				.prependTo(that.$element),
			
			// Next arrow
				$next = $("<p class=\"ch-next-arrow\" role=\"button\" aria-hidden=\"false\"><span>Next</span></p>")
				.bind("click", that.next)
				.appendTo(that.$element);
			
			// Positions arrows vertically in middle of Carousel
			$prev[0].style.top = $next[0].style.top = (that.$element.outerHeight() - $prev.outerHeight()) / 2 + "px";
			
			/**
			* Manages arrows turning it on and off when non-continue Carousel is moving.
			* @protected
			* @function
			* @name ch.Carousel#manageArrows
			* @param {Number} page Page to be moved.
			*/
			that.manageArrows = function (page) {
				// Case 1: Both arrows shown on Carousel's middle
				if (page > 1 && page < that.pages) {
					$prev.attr("aria-hidden", "false").removeClass("ch-hide");
					$next.attr("aria-hidden", "false").removeClass("ch-hide");
				} else {
				// Case 2: Previous arrow hidden on first page
					if (page === 1) {
						$prev.addClass("ch-hide").attr("aria-hidden", "true");
						$next.attr("aria-hidden", "false").removeClass("ch-hide");
				// Case 3: Next arrow hidden on last page
					} else if (page === that.pages) {
						$prev.attr("aria-hidden", "false").removeClass("ch-hide");
						$next.addClass("ch-hide").attr("aria-hidden", "true");
					}
				}
			};
		},
	
	/**
	* Creates Carousel pagination.
	* @private
	* @function
	* @name ch.Carousel#createPagination
	*/
	// TODO: Re-create pagination only if amount of pages change. Else, re-position it.
		createPagination = function () {
			
			// Create a element List for new pagination
			var $pagination = $("<ul class=\"ch-carousel-pages ch-hide\" role=\"tablist\">"),
			
			// Each page into list element
				$thumbnails;
	
			// Create each mini thumbnail an append to list
			for (var i = 1; i <= that.pages; i += 1) {
				
				// Mark as active if thumbnail is the same that current page
				var status = (i === that.currentPage) ? " class=\"ch-carousel-pages-on\" aria-selected=\"true\"" : " aria-selected=\"false\"",
				
				// Thumbnail with closure
					$thumb = $("<li" + status + " role=\"tab\" aria-controls=\"page" + i + "\">" + i + "</li>")
						.bind("click", function (i) {
							return function () {
								that.goTo(i);
							};
						}(i));
				
				$pagination.append($thumb);
			};
			
			// Append list to Carousel
			that.$element.append($pagination);
			
			// Positions list
			$pagination.css("left", (that.$element.outerWidth() - $pagination.outerWidth()) / 2).removeClass("ch-hide");
			
			// Set pagination children as thumbnails
			$thumbnails = $pagination.children();
			
			/**
			* Removes the active status classname of last selected page and adds it to the selected page.
			* @protected
			* @function
			* @name ch.Carousel#managePagination
			* @param {Number} page Page to be moved.
			*/
			that.managePagination = function (page) {
				$thumbnails.eq(that.currentPage - 1).removeClass("ch-carousel-pages-on").attr("aria-selected", "false");
				$thumbnails.eq(page - 1).addClass("ch-carousel-pages-on").attr("aria-selected", "true");
			};
		},
	
	/**
	* Calculates items amount on each page.
	* @protected
	* @function
	*/
		getItemsPerPage = function () {
			// Space to be distributed among all items
			var widthDiff = that.$mask.outerWidth() - that.itemsWidth;
			
			// If there are space to be distributed, calculate pages
			return that.itemsPerPage = (widthDiff > that.itemsWidth) ? ~~(widthDiff / that.itemsWidth) : 1;
		},
	
	/**
	* Calculates total amount of pages.
	* @private
	* @function
	* @name ch.Carousel#getPages
	* @returns {Number} Total amount of pages
	*/
		getPages = function () {
			// (Total amount of items) / (items amount on each page)
			// TODO: $coll.children =? that.$items.length
			return that.pages = Math.ceil(that.itemsTotal / that.itemsPerPage);
		},

	/**
	* Calculates all necesary data to draw Carousel correctly.
	* @private
	* @function
	* @name ch.Carousel#draw
	*/
		draw = function () {
			
			// Reset size of carousel mask
			maskWidth = that.$mask.outerWidth();
			
			// Recalculate items amount on each page
			getItemsPerPage();
			
			// Recalculate total amount of pages
			getPages();
			
			// Calculate variable margin between each item
			that.itemsMargin = Math.ceil(((maskWidth - (that.itemsWidth * that.itemsPerPage)) / that.itemsPerPage) / 2);
			
			// Modify sizes only if new items margin are positive numbers
			if (that.itemsMargin < 0) { return; }
			
			// Detach content from DOM for make a few changes
			that.$content.detach();
			
			// Move Carousel to first page for reset initial position
			that.goTo(1);
			
			// Save rendered items amount
			var i = that.$items.length;
			
			// Set new margin to all items
			while (i) {
				that.$items[i -= 1].style.marginLeft = that.$items[i].style.marginRight = that.itemsMargin + "px";
			}
			
			// Change content size and append it to DOM again
			// TODO: Use "width:-moz-max-content;" once instead .css("width"). Maybe add support to ch.features
			that.$content
				.css("width", (that.itemsWidth + that.itemsMargin * 2) * that.$items.length + extraWidth)
				.appendTo(that.$mask);
			
			// Manage Previous and Next arrows
			if (conf.arrows) {
				// Deletes pagination if already exists
				that.$element.find(".ch-prev-arrow, .ch-next-arrow").remove();
				
				// Creates updated pagination
				if (that.pages > 1) { createArrows(); }
			}
			
			// Manage pagination
			if (conf.pagination) {
				// Deletes pagination if already exists
				that.$element.find(".ch-carousel-pages").remove();
				
				// Creates updated pagination
				if (that.pages > 1) { createPagination(); }
			}
		},
	
	/**
	* Size of Carousel mask.
	* @private
	* @name ch.Carousel#maskWidth
	* @type Number
	*/
		maskWidth,
		
	/**
	* Extra size calculated on content. Fix issues of collection size in IE6.
	* @private
	* @name ch.Carousel#extraWidth
	* @type Number
	*/
		extraWidth,
	
	/**
	* Resize status of Window.
	* @private
	* @name ch.Carousel#resizing
	* @type Boolean
	*/
		resizing = false;

/**
*  Protected Members
*/

	/**
	* Element that will move for both directions.
	* @protected
	* @name ch.Carousel#$content
	* @type jQuery Object
	*/
	that.$content = $("<div class=\"ch-carousel-content\">");
	
	/**
	* HTMLLiElement with a list of items.
	* @protected
	* @name ch.Carousel#$collection
	* @type jQuery Object
	*/
	that.$collection = that.$element.children("ul").addClass("ch-carousel-list").attr("role", "list").appendTo(that.$content);
	
	/**
	* Each item into collection.
	* @protected
	* @name ch.Carousel#$items
	* @type jQuery Object
	*/
	that.$items = that.$collection.children().addClass("ch-carousel-item").attr("role", "listitem");
	
	/**
	* Mask that hides the overflow of content.
	* @protected
	* @name ch.Carousel#$mask
	* @type jQuery Object
	*/
	that.$mask = $("<div class=\"ch-carousel-mask\" role=\"tabpanel\"" + (conf.arrows ? " style=\"margin:0 50px;\"" : "") + ">").append(that.$content).appendTo(that.$element);
	
	/**
	* List of items that should be loaded asynchronously on page movement.
	* @protected
	* @name ch.Carousel#queue
	* @type Array
	*/
	that.queue = conf.asyncData || [];
	
	/**
	* Amount of items into collection and items on queue.
	* @protected
	* @name ch.Carousel#itemsTotal
	* @type Number
	*/
	that.itemsTotal = that.$items.length + that.queue.length;
	
	/**
	* Reference to items width.
	* @protected
	* @name ch.Carousel#itemsWidth
	* @type Number
	*/
	that.itemsWidth = that.$items.outerWidth();
	
	/**
	* CSS margin between each item.
	* @protected
	* @name ch.Carousel#itemsMargin
	* @type Number
	*/
	that.itemsMargin = 0;
	
	/**
	* Amount of items on each page.
	* @protected
	* @type Number
	*/
	// TODO: This is calculates on draw() method. Maybe it isn't necessary to execute here.
	that.itemsPerPage = getItemsPerPage();
	
	/**
	* Total amount of pages.
	* @protected
	* @name ch.Carousel#pages
	* @type Number
	*/
	// TODO: This is calculates on draw() method. Maybe it isn't necessary to execute here.
	that.pages = getPages();
	
	/**
	* The page that is selected.
	* @protected
	* @name ch.Carousel#currentPage
	* @type Number
	*/
	that.currentPage = 1;
	
	/**
	* Move items from queue to collection.
	* @protected
	* @name ch.Carousel#addItems
	* @function
	* @param {Number} amount Amount of items that will be added.
	*/
	that.addItems = function (amount) {
		
		// Take the sample from queue
		var sample = that.queue.splice(0, amount),
		
		// Condition if exists a render function on component configuration object
			hasRender = ch.utils.hasOwn(conf, "asyncRender"),
		
		// Position where new items will be added
			itemIndex = that.$items.length;
		
		// Append asynchronous items to collection
		// HTML Li Element with classname and styles and content from conf.async with or without render function
		for (var i = 0; i < amount; i += 1) {
			
			// Page where this item is in
			var page = ~~(itemIndex / that.itemsPerPage) + 1;
			
			sample[i] = "<li class=\"ch-carousel-item\" role=\"listitem\" aria-hidden=\"" + (page !== that.currentPage) + "\" aria-setsize=\"" + that.itemsTotal + "\" aria-posinset=\"" + (itemIndex += 1) + "\" aria-label=\"page" + page + "\" style=\"margin-right: " + that.itemsMargin + "px; margin-left: " + that.itemsMargin + "px;\">" + (hasRender ? conf.asyncRender(sample[i]) : sample[i]) + "</li>";
		};
		
		// Expand content width for include new items (item width and margin) * (total amount of items) + extra width
		// TODO: Use "width:-moz-max-content;" once instead .css("width"). Maybe add support to ch.features
		that.$content.css("width", (that.itemsWidth + that.itemsMargin * 2) * that.itemsTotal + extraWidth);
		
		// Append collection again
		that.$collection.append(sample.join(""));
		
		// Update items collection
		that.$items = that.$collection.children();
		
		that.callbacks("onItemsAdded");
		that.trigger("itemsAdded");
		
	};
	
	
	/**
	* Analizes if next page needs to load items from queue and execute addItems() method.
	* @protected
	* @name ch.Carousel#asyncItemsLoad
	* @function
	*/
	that.asyncItemsLoad = function () {
		
		// Load only when there are items in queue
		if (that.queue.length === 0) { return; }
		
		// Amount of items from the beginning to current page
		var itemsHere = that.currentPage * that.itemsPerPage,
		
		// Items rendered
			itemsRendered = that.$items.length;
		
		// Load only when there are more visible items than items rendered
		if (itemsHere < itemsRendered) { return; }
		
		// How many items needs to add for complete next page
		var amount = itemsHere % itemsRendered;
		
		// If isn't needed items to complete a page, then add an entire page
		amount = (amount === 0) ? that.itemsPerPage : amount;
		
		// If next page needs less items than it support, then add that amount
		amount = (that.queue.length < amount) ? that.queue.length : amount;
		
		// Add these
		that.addItems(amount);
		
	};
	
	// Moves to a defined page
	that.goTo = function (page) {
		
		// Validation of page parameter
		if (page === that.currentPage || page > that.pages || page < 1 || isNaN(page)) { return that; }
		
		// Manage arrows
		if (!conf.rolling && conf.arrows) { that.manageArrows(page); }
		
		// Select thumbnail on pagination
		if (conf.pagination) { that.managePagination(page); }
		
		// Coordinates of next movement
		var movement = -(maskWidth * (page - 1));

		// TODO: review this conditional
		// Case 1: Movement with CSS transition
		if (conf.fx && ch.features.transition) {
			that.$content.css("left", movement);
		// Case 2: Movement with jQuery animate
		} else if (conf.fx) {
			that.$content.animate({ left: movement });
		// Case 3: Movement without transition or jQuery
		} else {
			that.$content.css("left", movement);
		}
		
		// Refresh selected page
		that.currentPage = page;
		
		// WAI-ARIA to set items as "hide"
		$.each(that.$items, function (i, e) {
			$(e).attr("aria-hidden", ~~(i / that.itemsPerPage) + 1 !== page);
		});
		
		that.callbacks("onSelect");
		that.trigger("select");
		
		return that;
	};

	// Move to the previous page.
	that.prev = function () {
		
		that.goTo(that.currentPage - 1);

		that.callbacks("onPrev");
		that.trigger("prev");
		
		return that;
	};
	
	// Move to the next page.
	that.next = function () {
		
		that.goTo(that.currentPage + 1);
		
		// Asynchronous item load feature
		if (ch.utils.hasOwn(conf, "asyncData")) { that.asyncItemsLoad(); }
		
		that.callbacks("onNext");
		that.trigger("next");
		
		return that;
	};

/**
*  Public Members
*/
	
	/**
	* Triggers when component moves to next page.
	* @name ch.Carousel#next
	* @event
	* @public
	* @example
	* example.on("next", function () {
	*	alert("Next!");
	* });
	*/
	
	/**
	* Triggers when component moves to previous page.
	* @name ch.Carousel#prev
	* @event
	* @public
	* @example
	* example.on("prev", function () {
	*	alert("Previous!");
	* });
	*/
	
	/**
	* Deprecated: Triggers when component moves to next or previous page.
	* @name ch.Carousel#move
	* @event
	* @public
	* @deprecated
	* @example
	* example.on("move", function () {
	*	alert("I moved!");
	* });
	*/
	
	/**
	* Since 0.7.9: Triggers when component moves to next or previous page.
	* @name ch.Carousel#select
	* @event
	* @public
	* @since 0.7.9
	* @example
	* example.on("select", function () {
	*	alert("An item was selected!");
	* });
	*/
	
	/**
	* Triggers when component adds items asynchronously from queue.
	* @name ch.Carousel#itemsAdded
	* @event
	* @public
	* @example
	* example.on("itemsAdded", function () {
	*	alert("Some asynchronous items was added.");
	* });
	*/
	
	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Carousel#uid
	* @type Number
	*/
	
	/**
	* Public reference to element that was used to init the component.
	* @public
	* @name ch.Carousel#element
	* @type HTMLDivElement
	*/

	/**
	* The component's type.
	* @public
	* @name ch.Carousel#type
	* @type String
	*/

	/**
	* Deprecated - Get the items amount of each page.
	* @public
	* @deprecated
	* @name ch.Carousel#getItemsPerPage
	* @returns Number
	*/
	
	/**
	* Get the items amount of each page (Since 0.7.4).
	* @public
	* @since 0.7.4
	* @name ch.Carousel#itemsPerPage
	* @returns Number
	*/
	that["public"].itemsPerPage = function () { return that.itemsPerPage; };
	
	/**
	* Deprecated - Gets the current page.
	* @public
	* @deprecated
	* @function
	* @name ch.Carousel#getPage
	* @returns Number
	*/
	
	/**
	* Deprecated - Moves to a defined page. Only works when Carousel hasn't asynchronous item load.
	* @public
	* @function
	* @name ch.Carousel#goTo
	* @returns Chico UI Object
	* @param {Number} page Page to be moved.
	* @deprecated
	* @example
	* // Create a Carousel
	* var foo = $("bar").carousel();
	* 
	* // Go to second page
	* foo.goTo(2);
	*/
	
	/**
	* Moves to a defined page (Since 0.7.5).
	* @public
	* @function
	* @name ch.Carousel#select
	* @returns Chico UI Object
	* @param {Number} page Page to be moved.
	* @since 0.7.5
	* @example
	* // Create a Carousel
	* var foo = $("bar").carousel();
	* 
	* // Go to second page
	* foo.select(2);
	*/
	that["public"].select = function (data) {
		// TODO: Add support to goTo function on asynchronous item load.
		if (ch.utils.hasOwn(conf, "asyncData")) { return that["public"]; }
		
		that.goTo(data);

		return that["public"];
	};
	
	/**
	* Gets the current page or moves to a defined page (Since 0.7.4).
	* @public
	* @function
	* @name ch.Carousel#page
	* @returns Chico UI Object
	* @param {Number} page Page to be moved.
	* @since 0.7.4
	* @example
	* // Create a Carousel
	* var foo = $("bar").carousel();
	* 
	* // Go to second page
	* foo.page(2);
	* @example
	* // Get the current page
	* foo.page();
	*/
	that["public"].page = function (data) {
		// Getter
		if (!data) { return that.currentPage; }
		
		// Setter
		return that["public"].select(data);
	};
	
	/**
	* Moves to the previous page.
	* @public
	* @function
	* @name ch.Carousel#prev
	* @returns Chico UI Object
	* @example
	* // Create a Carousel
	* var foo = $("bar").carousel();
	* 
	* // Go to previous page
	* foo.prev();
	*/
	that["public"].prev = function () {
		that.prev();

		return that["public"];
	};
	
	/**
	* Moves to the next page.
	* @public
	* @function
	* @name ch.Carousel#next
	* @returns Chico UI Object
	* @example
	* // Create a carousel
	* var foo = $("bar").carousel();
	* 
	* // Go to next page
	* foo.next();
	*/
	that["public"].next = function () {
		that.next();

		return that["public"];
	};

	/**
	* Re-calculate positioning, sizing, paging, and re-draw.
	* @public
	* @function
	* @name ch.Carousel#redraw
	* @returns Chico UI Object
	* @example
	* // Create a Carousel
	* var foo = $("bar").carousel();
	* 
	* // Re-draw Carousel
	* foo.redraw();
	*/
	that["public"].redraw = function () {
		draw();
		
		return that["public"];
	};


/**
*  Default event delegation
*/
	
	// Does what is necessary to make ready the component structure
	createLayout();
	
	// Calculates all necesary data to draw Carousel correctly
	draw();
	
	// Default behavior	
	if (ch.utils.hasOwn(conf, "width")) { return that; }
	
	// Elastic behavior
	// Change resize status on Window resize event
	ch.utils.window.bind("resize", function () { resizing = true; });
	
	// Limit resize execution
	setInterval(function () {
		
		if (!resizing) { return; }
		
		resizing = false;
		
		draw();
		
	}, 350);

	return that;
};

ch.factory("carousel");
