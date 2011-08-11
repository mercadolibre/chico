/**
* Carousel is a large list of elements. Some elements will be shown in a preset area, and others will be hidden waiting for the user interaction to show it.
* @name Carousel
* @class Carousel
* @augments ch.Object
* @requires ch.List
* @memberOf ch
* @param {Configuration Object} conf Object with configuration properties
* @returns {Chico-UI Object}
*/

ch.carousel = function (conf) {
	
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @protected
	* @name ch.Carousel#that
	* @type {Object}
	*/
	var that = this;
	
	conf = ch.clon(conf);
	
	// Configurable pagination
	// TODO: Add support to goTo function on asynchronous item load.
	conf.pagination = (!ch.utils.hasOwn(conf, "asyncData") ? conf.pagination : false) || false;
	
	// Configuration for continue carousel
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

	that = ch.object.call(that);
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
		
		// Calculate extra width for content
		extraWidth = (ch.utils.html.hasClass("ie6")) ? that.itemsWidth : 0;
		
		// Set width to Carousel if exists a width in configuration
		if (ch.utils.hasOwn(conf, "width")) { that.$component.css("width", conf.width); }
		
		// Set height to Carousel if exists a height in configuration
		if (ch.utils.hasOwn(conf, "height")) { that.$component.css("height", conf.height); }
		
		// Disable CSS transition if it's specified
		if (!conf.fx && ch.features.transition) { that.$content.addClass("ch-carousel-nofx"); }
		
		// Set container size based on items size
		that.$mask.css("height", that.$items.outerHeight());
		
		// At the begin, add items from queue if page is incomplete
		if (that.$items.length < that.itemsPerPage) {
			that.addItems(that.itemsPerPage - that.$items.length);
		}
		
		// Bind asynchronous item load feature to "next" internal event
		if (ch.utils.hasOwn(conf, "asyncData")) { that["public"].on("next", that.asyncItemsLoad); }
		
	},
	
	/**
	* Creates Previous and Next arrows.
	* @private
	* @function
	* @name ch.Carousel#createArrows
	*/
		createArrows = function () {
			
			// Previous arrow
			var $prev = $("<p class=\"ch-prev-arrow" + (conf.rolling ? "" : " ch-hide") + "\"><span>Previous</span></p>")
				.bind("click", that.prev)
				.prependTo(that.$component),
			
			// Next arrow
				$next = $("<p class=\"ch-next-arrow\"><span>Next</span></p>")
				.bind("click", that.next)
				.appendTo(that.$component);
			
			// Positions arrows vertically in middle of Carousel
			$prev[0].style.top = $next[0].style.top = (that.$component.outerHeight() - $prev.outerHeight()) / 2 + "px";
			
			/**
			* Manages arrows turning it on and off when non-continue Carousel is moving.
			* @protected
			* @function
			* @name ch.Carousel#manageArrows
			* @param {Number} page Page to be moved.
			*/
			that.manageArrows = function (page) {
				// Case 1: Both arrows shown on carousel's middle
				if (page > 1 && page < that.pages) {
					$prev.removeClass("ch-hide");
					$next.removeClass("ch-hide");
				} else {
				// Case 2: Previous arrow hidden on first page
					if (page === 1) {
						$prev.addClass("ch-hide");
						$next.removeClass("ch-hide");
				// Case 3: Next arrow hidden on last page
					} else if (page === that.pages) {
						$prev.removeClass("ch-hide");
						$next.addClass("ch-hide");
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
			var $pagination = $("<ul class=\"ch-carousel-pages ch-hide\">"),
			
			// Each page into list element
				$thumbnails;
	
			// Create each mini thumbnail an append to list
			for (var i = 1; i <= that.pages; i += 1) {
				
				// Mark as active if thumbnail is the same that current page
				var status = (i === that.currentPage) ? " class=\"ch-carousel-pages-on\"" : "",
				
				// Thumbnail with closure
					$thumb = $("<li" + status + ">" + i + "</li>").bind("click", function (i) {
						return function () {
							that.goTo(i);
						};
					}(i));
				
				$pagination.append($thumb);
			};
			
			// Append list to carousel
			that.$component.append($pagination);
			
			// Positions list
			$pagination.css("left", (that.$component.outerWidth() - $pagination.outerWidth()) / 2).removeClass("ch-hide");
			
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
				$thumbnails.eq(that.currentPage - 1).removeClass("ch-carousel-pages-on");
				$thumbnails.eq(page - 1).addClass("ch-carousel-pages-on");
			};
		},
	
	/**
	* Calculates items amount on each page.
	* @protected
	* @name ch.Carousel#getItemsPerPage
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
			return that.pages = Math.ceil((that.$collection.children().length + that.queue.length) / that.itemsPerPage);
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
			
			// Get all rendered items
			var items = that.$collection.children(),
			
			// Save rendered items amount
				i = items.length;
			
			// Set new margin to all items
			while (i) {
				items[i -= 1].style.marginLeft = items[i].style.marginRight = that.itemsMargin + "px";
			}
			
			// Change content size and append it to DOM again
			// TODO: Use "width:-moz-max-content;" once instead .css("width"). Maybe add support to ch.features
			that.$content
				.css("width", (that.itemsWidth + that.itemsMargin * 2) * items.length + extraWidth)
				.appendTo(that.$mask);
			
			// Manage Previous and Next arrows
			if (conf.arrows) {
				// Deletes pagination if already exists
				that.$component.find(".ch-prev-arrow, .ch-next-arrow").remove();
				
				// Creates updated pagination
				if (that.pages > 1) { createArrows(); }
			}
			
			// Manage pagination
			if (conf.pagination) {
				// Deletes pagination if already exists
				that.$component.find(".ch-carousel-pages").remove();
				
				// Creates updated pagination
				if (that.pages > 1) { createPagination(); }
			}
		},
	
	/**
	* Size of carousel mask.
	* @private
	* @name ch.Carousel#maskWidth
	* @type {Number}
	*/
		maskWidth,
		
	/**
	* Extra size calculated on content. Fix some IE6 issues.
	* @private
	* @name ch.Carousel#extraWidth
	* @type {Number}
	*/
		extraWidth,
	
	/**
	* Resize status of Window.
	* @private
	* @name ch.Carousel#resizing
	* @type {Boolean}
	*/
		resizing = false;

/**
*  Protected Members
*/
	
	/**
	* Element that wraps all HTML structure, like buttons, mask and pagination.
	* @protected
	* @name ch.Carousel#$mask
	* @type jQuery Object
	*/
	that.$component = $("<div class=\"ch-carousel\">").insertBefore(that.$element);
	
	/**
	* Mask that hides the overflow of content.
	* @protected
	* @name ch.Carousel#$mask
	* @type jQuery Object
	*/
	that.$mask = that.$element.addClass("ch-carousel-mask").appendTo(that.$component);
	
	/**
	* Element that will move for both directions.
	* @protected
	* @name ch.Carousel#$content
	* @type jQuery Object
	*/
	that.$content = $("<div class=\"ch-carousel-content\">").appendTo(that.$mask);
	
	/**
	* List of items.
	* @protected
	* @name ch.Carousel#$collection
	* @type jQuery Object
	*/
	that.$collection = that.$mask.children("ul").addClass("ch-carousel-list").appendTo(that.$content);
	
	/**
	* Each item into collection.
	* @protected
	* @name ch.Carousel#$items
	* @type jQuery Object
	*/
	that.$items = that.$collection.children().addClass("ch-carousel-item");
	
	/**
	* List of items that should be loaded asynchronously on page movement.
	* @protected
	* @name ch.Carousel#queue
	* @type Array
	*/
	that.queue = conf.asyncData || [];
	
	/**
	* Reference to items width.
	* @protected
	* @name ch.Carousel#itemWidth
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
	* @name ch.Carousel#itemsPerPage
	* @type Number
	*/
	// TODO: This is calculates on draw() method. Maybe it isn't necessary to execute here.
	that.itemsPerPage = getItemsPerPage();
	
	/**
	* Amount of pages.
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
		var sample = that.queue.splice(0, amount);
		
		// Append asynchronous items to collection
		// HTML Li Element with classname and styles and content from conf.async with or without render function
		// TODO: use amount +1 (or -1) instead sample.length
		for (var i = 0, j = sample.length; i < j; i += 1) {
			sample[i] = "<li class=\"ch-carousel-item\" style=\"margin-left:" + that.itemsMargin + "px;margin-right:" + that.itemsMargin + "px;\">" + (ch.utils.hasOwn(conf, "asyncRender") ? conf.asyncRender(sample[i]) : sample[i]) + "</li>";
		};
		
		// Expand content width for include new items (item width and margin) * (total amount of items) + extra width
		// TODO: Use "width:-moz-max-content;" once instead .css("width"). Maybe add support to ch.features
		// TODO: that.$collection.children().length =? that.$items.length
		that.$content.css("width", (that.itemsWidth + that.itemsMargin * 2) * (that.$collection.children().length + amount) + extraWidth);
		
		// Append collection again
		that.$collection.append(sample.join(""));
		
		/**
		* Callback function
		* @name ch.Carousel#onItemsAdded
		* @type {Function}
		*/
		that.callbacks("onItemsAdded");
		// new callback
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
		// TODO: that.$collection.children().length =? that.$items.length
			itemsRendered = that.$collection.children().length;
		
		// Load only when there are more visible items than items rendered
		if (itemsHere < itemsRendered) { return; }
		
		// How many items needs to add for complete next page
		var amount = itemsHere % itemsRendered,
		
		// If isn't needed items to complete a page, then add an entire page
			sampleSize = (amount === 0) ? that.itemsPerPage : amount;
		
		// Add these
		that.addItems(sampleSize);
		
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
		
		/**
		* Callback function
		* @name ch.Carousel#onMove
		* @type {Function}
		*/
		that.callbacks("onMove");
		// new callback
		that.trigger("move");
		
		return that;
	};

	// Move to the previous page.
	that.prev = function () {
		
		that.goTo(that.currentPage - 1);

		/**
		* Callback function
		* @name ch.Carousel#onPrev
		* @type {Function}
		*/
		that.callbacks("onPrev");
		// new callback
		that.trigger("prev");
		
		return that;
	};
	
	// Move to the next page.
	that.next = function () {
		
		that.goTo(that.currentPage + 1);

		/**
		* Callback function
		* @name ch.Carousel#onNext
		* @type {Function}
		*/
		that.callbacks("onNext");
		// new callback
		that.trigger("next");
		
		return that;
	};

/**
*  Public Members
*/

	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Carousel#uid
	* @type {Number}
	*/
	
	/**
	* The element reference.
	* @public
	* @name ch.Carousel#element
	* @type {HTMLElement}
	*/

	/**
	* The component's type.
	* @public
	* @name ch.Carousel#type
	* @type {String}
	*/

	/**
	* Get the items amount of each page.
	* @public
	* @name ch.Carousel#getItemsPerPage
	* @returns {Number}
	*/
	that["public"].getItemsPerPage = function () { return that.itemsPerPage; };
	
	/**
	* Get the total amount of pages.
	* @public
	* @name ch.Carousel#getPage
	* @returns {Number}
	*/
	that["public"].getPage = function () { return that.currentPage; };
	
	/**
	* Moves to a defined page. Only works when Carousel hasn't asynchronous item load.
	* @public
	* @function
	* @name ch.Carousel#goTo
	* @returns {Chico-UI Object}
	* @param {Number} page Page to be moved.
	* @example
	* // Create a carousel
	* var foo = $("bar").carousel();
	* 
	* // Go to second page
	* foo.goTo(2);
	*/
	that["public"].goTo = function (page) {
		// TODO: Add support to goTo function on asynchronous item load.
		if (!ch.utils.hasOwn(conf, "asyncData")) { return that["public"]; }
		
		that.goTo(page);

		return that["public"];
	};
	
	/**
	* Moves to the previous page.
	* @public
	* @name ch.Carousel#prev
	* @returns {Chico-UI Object}
	* @example
	* // Create a carousel
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
	* @name ch.Carousel#next
	* @returns {Chico-UI Object}
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
	* @name ch.Carousel#redraw
	* @returns {Chico-UI Object}
	* @example
	* // Create a carousel
	* var foo = $("bar").carousel();
	* 
	* // Re-draw carousel
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
	
	// Calculates all necesary data to draw carousel correctly
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