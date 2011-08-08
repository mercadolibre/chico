/**
* Carousel is a UI-Component.
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
	conf.pagination = conf.pagination || false;
	
	// Configuration for continue carousel
	// TODO: Rolling is forced to be false. Use this: conf.rolling = (ch.utils.hasOwn(conf, "rolling")) ? conf.rolling : true;
	conf.rolling = false;
	
	// Configurable arrows
	conf.arrows = (ch.utils.hasOwn(conf, "arrows")) ? conf.arrows : true;
	
	// Configurable efects
	conf.fx = (ch.utils.hasOwn(conf, "fx")) ? conf.fx : true;
	
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
	* Creates Previous and Next arrows.
	* @private
	* @function
	* @name ch.Carousel#createArrows
	*/
	var createArrows = function () {
		
		// Previous arrow
		that.prevArrow = $("<p class=\"ch-prev-arrow" + (conf.rolling ? "" : " ch-hide") + "\"><span>Previous</span></p>")
			.bind("click", that.prev)
			.prependTo(that.$element)
			[0];
		
		// Next arrow
		that.nextArrow = $("<p class=\"ch-next-arrow\"><span>Next</span></p>")
			.bind("click", that.next)
			.appendTo(that.$element)
			[0];
		
		// Positions arrows vertically in middle of Carousel
		var position = (that.$element.outerHeight() - $(that.nextArrow).outerHeight()) / 2;
		
		that.prevArrow.style.top = that.nextArrow.style.top = position + "px";
	},
	
	/**
	* Manages arrows turning it on and off when non-continue Carousel is moving.
	* @private
	* @function
	* @name ch.Carousel#toggleArrows
	* @param {Number} page Page to be moved
	*/
	toggleArrows = function (page) {
		// Both arrows shown on carousel's middle
		if (page > 1 && page < that.pages) {
			that.prevArrow.className = "ch-prev-arrow";
			that.nextArrow.className = "ch-next-arrow";
		} else {
		// Previous arrow hidden on first page
			if (page === 1) {
				that.prevArrow.className = "ch-prev-arrow ch-hide";
				that.nextArrow.className = "ch-next-arrow";
		// Next arrow hidden on last page
			} else if (page === that.pages) {
				that.prevArrow.className = "ch-prev-arrow";
				that.nextArrow.className = "ch-next-arrow ch-hide";
			}
		}
	},
	
	/**
	* Creates Carousel pagination.
	* @private
	* @function
	* @name ch.Carousel#createPagination
	*/
	createPagination = function () {
		
		// Deletes pagination if already exists
		that.$element.find(".ch-carousel-pages").remove();
		
		// Create an list of elements for new pagination
		that.$pagination = $("<ul class=\"ch-carousel-pages\">");

		// Create each mini thumbnail
		for (var i = 1; i <= that.pages; i += 1) {
			// Thumbnail <li>
			var thumb = $("<li>" + i + "</li>");
			
			// Mark as actived if thumbnail is the same that current page
			if (i === that.currentPage) { thumb.addClass("ch-carousel-pages-on"); }
			
			// Append thumbnail to list
			that.$pagination.append(thumb);
		};

		// Bind each thumbnail behavior
		$.each(that.$pagination.children(), function (i, e) {
			$(e).bind("click", function () {
				that.goTo(i + 1);
			});
		});
		
		// Append list to carousel
		that.$element.append(that.$pagination);
		
		// Positions list
		that.$pagination.css("left", (that.$element.outerWidth() - that.$pagination.outerWidth()) / 2);
		
		// Save each generated thumb into an array
		$itemsPagination = that.$pagination.children();
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
		return Math.ceil((that.$collection.children().length + that.items.queue.length) / that.items.onEachPage);
	},

	/**
	* Calculates all necesary data to draw Carousel correctly.
	* @private
	* @function
	* @name ch.Carousel#draw
	*/
	draw = function () {
		
		// Reset size of carousel mask
		maskWidth = that.$container.outerWidth();
		
		// Recalculate items amount on each page
		that.items.getItemsPerPage();
		
		// Recalculate total amount of pages
		that.pages = getPages();
		
		// Calculate variable margin between each item
		that.items.margin = Math.ceil(((maskWidth - (that.items.width * that.items.onEachPage)) / that.items.onEachPage) / 2);
		
		// Modify sizes only if new items margin are positive numbers
		if (that.items.margin < 0) { return; }
		
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
			items[i -= 1].style.marginLeft = items[i].style.marginRight = that.items.margin + "px";
		}
		
		// Change content size and append it to DOM again
		// TODO: Use "width:-moz-max-content;" once instead .css("width"). Maybe add support to ch.features
		that.$content
			.css("width", (that.items.width + that.items.margin * 2) * items.length + extraWidth)
			.appendTo(that.$container);
		
		// Create pagination if there are more than one page on total amount of pages
		if (conf.pagination && that.pages > 1) { createPagination(); }
	},
	
	/**
	* Size of carousel mask.
	* @private
	* @name ch.Carousel#maskWidth
	* @type {Number}
	*/
	maskWidth,
	
	/**
	* List of pagination thumbnails.
	* @private
	* @name ch.Carousel#$itemsPagination
	* @type {Array}
	*/
	$itemsPagination,
	
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
	* Mask for deny overflow of content.
	* @protected
	* @name ch.Carousel#$container
	* @type jQuery Object
	*/
	that.$container = that.$element.children();
	
	/**
	* Element that will move for both directions.
	* @protected
	* @name ch.Carousel#$content
	* @type jQuery Object
	*/
	that.$content = that.$container.children();
	
	/**
	* List of items.
	* @protected
	* @name ch.Carousel#$collection
	* @type jQuery Object
	*/
	that.$collection = that.$content.children();
	
	/**
	* References to items attributes and manages internal queue for asynchronous item load.
	* @protected
	* @name ch.Carousel#items
	* @type Object
	*/
	that.items = (function () {
		
		// Items rendered
		var items = that.$collection.children(),
		
		// Create an object to be exposed
			self = {};
		
		/**
		* Reference to items size.
		* @protected
		* @name width
		* @type Number
		* @memberOf items
		*/
		self.width = items.outerWidth();
		
		/**
		* List of items that should be loaded on page movement.
		* @protected
		* @name queue
		* @type Array
		* @memberOf items
		*/
		self.queue = conf.asyncData || [];
		
		/**
		* CSS margin between each item.
		* @protected
		* @name margin
		* @type Number
		* @memberOf items
		*/
		self.margin = 0;
		
		/**
		* Adds items from queue to List Object and renders these into collection
		* @protected
		* @name add
		* @function
		* @memberOf items
		*/
		self.add = function (amount) {
			
			// Take the sample from queue
			var sample = self.queue.splice(0, amount);
			
			// Append asynchronous items to collection
			for (var i = 0, j = sample.length; i < j; i += 1) {
				sample[i] = "<li class=\"ch-carousel-item\" style=\"margin-left:" + self.margin + "px;margin-right:" + self.margin + "px;\">" + ((ch.utils.hasOwn(conf, "asyncRender")) ? conf.asyncRender(sample[i]) : sample[i]) + "</li>";
			};
			
			// Expand content width for include new items (item width and margin) * (total amount of items) + extra width
			// TODO: Use "width:-moz-max-content;" once instead .css("width"). Maybe add support to ch.features
			that.$content.css("width", (self.width + self.margin * 2) * (that.$collection.children().length + amount) + extraWidth);
			
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
		}
		
		/**
		* Calculates items amount on each page.
		* @protected
		* @name getItemsPerPage
		* @function
		* @memberOf items
		*/
		// TODO: Maybe widthDiff is the same that items.margin
		self.getItemsPerPage = function () {
			// Space to be distributed among all items
			var widthDiff = that.$element.outerWidth() - self.width;
			
			// If there are space to be distributed, calculate pages
			return self.onEachPage = (widthDiff > self.width) ? ~~(widthDiff / self.width) : 1;
		};
		
		/**
		* Items amount on each page.
		* @protected
		* @name onEachPage
		* @type Number
		* @memberOf items
		*/
		self.onEachPage = self.getItemsPerPage();
		
		// Calculate extra width for content
		extraWidth = (ch.utils.html.hasClass("ie6")) ? self.width : 0;
		
		// Set container size based on items size
		that.$container.css("height", items.outerHeight());
		
		// At the begin, add items from queue if page is incomplete
		if (items.length < self.onEachPage) {
			self.add(self.onEachPage - items.length);
		}
		
		// Asynchronous items load
		that["public"].on("next", function () {
			
			// Load only when there are items in queue
			if (self.queue.length === 0) { return; }
			
			// Amount of items from the beginning to current page
			var itemsHere = that.currentPage * self.onEachPage,
			
			// Items rendered
				itemsRendered = that.$collection.children().length;
			
			// Load only when there are more visible items than items rendered
			if (itemsHere < itemsRendered) { return; }
			
			// How many items needs to add for complete next page
			var amount = itemsHere % itemsRendered,
			
			// If isn't needed items to complete a page, then add an entire page
				sampleSize = (amount === 0) ? self.onEachPage : amount;
			
			// Add these
			self.add(sampleSize);
			
		});
		
		return self;
		
	}());
	
	// Calculate items amount on each page
	//that.itemsPerPage = getItemsPerPage();
		
	/**
	* The page that is selected.
	* @private
	* @name ch.Carousel#currentPage
	* @type {Number}
	*/
	that.currentPage = 1;

	that.goTo = function (page) {
		
		// Validation of page parameter
		if (page === that.currentPage || page > that.pages || page < 1 || isNaN(page)) { return that; }
		
		// Coordinates to next movement
		var movement = -(maskWidth * (page - 1));

		// TODO: review this conditional
		// Movement with CSS transition
		if (conf.fx && ch.features.transition) {
			that.$content.css("left", movement);
		// Movement with jQuery animate
		} else if (conf.fx) {
			that.$content.animate({ left: movement });
		// Movement without transition or jQuery
		} else {
			that.$content.css("left", movement);
		}

		// Manage arrows
		if (!conf.rolling && conf.arrows) { toggleArrows(page); }
		
		// Refresh selected page
		that.currentPage = page;
		
		// TODO: Use toggleClass() instead remove and add.
		// Select thumbnail on pagination
		if (conf.pagination) {
			$itemsPagination.removeClass("ch-carousel-pages-on").eq(page - 1).addClass("ch-carousel-pages-on");
		}
		
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
	that["public"].getItemsPerPage = function () { return that.items.onEachPage; };
	
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
	* @param {Number} page Page to be moved
	* @example
	* // Create a carousel
	* var foo = $("bar").carousel();
	* 
	* // Go to second page
	* foo.goTo(2);
	*/
	// TODO: Add support to goTo function on asynchronous item load.
	if (!ch.utils.hasOwn(conf, "asyncData")) {
		that["public"].goTo = function (page) {
			that.goTo(page);
	
			return that["public"];
		};
	}
	
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
	
	// Visual configuration
	if (ch.utils.hasOwn(conf, "width")) { that.$element.css("width", conf.width); }
	if (ch.utils.hasOwn(conf, "height")) { that.$element.css("height", conf.height); }
	if (!conf.fx && ch.features.transition) { that.$content.addClass("ch-carousel-nofx"); }

	// Calculates all necesary data to draw carousel correctly
	draw();

	// Creates Previous and Next arrows
	if (conf.arrows && that.pages > 1) { createArrows(); }

	// Default behavior	
	if (ch.utils.hasOwn(conf, "width")) { return that; }
	
	// Elastic behavior
	// Change resize status on Window resize event
	ch.utils.window.bind("resize", function () { resizing = true; });
	
	// Limit resize execution to a quarter of second
	setInterval(function () {
		
		if (!resizing) { return; }
		
		resizing = false;
		
		draw();
		
	}, 350);

	return that;
};