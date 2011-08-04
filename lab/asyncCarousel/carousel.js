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
	// TODO: Rolling is forced to be false.
	// Use this: conf.rolling = (ch.utils.hasOwn(conf, "rolling")) ? conf.rolling : true;
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
		that.prevArrow = $("<p class=\"ch-prev-arrow" + ((conf.rolling) ? "" : " ch-hide") + "\"><span>Previous</span></p>")[0];
		
		// Next arrow
		that.nextArrow = $("<p class=\"ch-next-arrow\"><span>Next</span></p>")[0];
		
		// Append arrows to carousel
		that.$element.prepend(that.prevArrow).append(that.nextArrow);
		
		// Positions arrows vertically inside carousel
		var arrowsPosition = (that.$element.outerHeight() - $(that.nextArrow).outerHeight()) / 2;
		$(that.prevArrow).css("top", arrowsPosition).bind("click", that.prev);
		$(that.nextArrow).css("top", arrowsPosition).bind("click", that.next);
	},
	
	/**
	* Manages arrows turning it on and off when non-continue carousel is on first or last page.
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
	* Creates carousel pagination.
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
	* Calculates items amount on each page.
	* @private
	* @function
	* @name ch.Carousel#getItemsPerPage
	* @returns {Number} Items amount on each page
	*/
	getItemsPerPage = function () {
		// Space to be distributed among all items
		var widthDiff = that.$element.outerWidth() - that.items.width;
		
		// If there are space to be distributed, calculate pages
		return (widthDiff > that.items.width) ? ~~(widthDiff / that.items.width) : 1;
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
		return Math.ceil((that.items.list.size() + that.items.queue.length) / that.itemsPerPage);
	},

	/**
	* Calculates all necesary data to draw carousel correctly.
	* @private
	* @function
	* @name ch.Carousel#draw
	*/
	draw = function () {
		
		// Reset size of carousel mask
		maskWidth = that.$container.outerWidth();

		// Recalculate items amount on each page
		that.itemsPerPage = getItemsPerPage();
		
		// Recalculate total amount of pages
		that.pages = getPages();
		
		// Calculate variable margin between each item
		that.items.margin = Math.ceil(((maskWidth - (that.items.width * that.itemsPerPage)) / that.itemsPerPage) / 2);
		
		// Modify sizes only if new items margin are positive numbers
		if (that.items.margin < 0) { return; }
		
		// Detach content from DOM for make a few changes
		that.$content.detach();
		
		// Move carousel to first page for reset initial position
		that.goTo(1);
		
		// Sets new margin to each item
		var i = that.items.list.size(),
			items = that.items.list.children;
		
		while (i) {
			items[i -= 1].style.marginLeft = items[i].style.marginRight = that.items.margin + "px";
		}
		
		// Change content size and append it to DOM again
		that.$content
			.css("width", (that.items.width + that.items.margin * 2) * that.items.list.size() + extraWidth)
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
	* Extra size calculated on content
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

	// Create carousel's mask
	that.$container = that.$element.children();
	
	that.$content = that.$container.children();
	
	/**
	* UL list of items.
	* @private
	* @name ch.Carousel#$collection
	* @type {Array}
	*/
	that.$collection = that.$content.children();
	
	/**
	* List Object created from items that previously exists on DOM.
	* @private
	* @name ch.Carousel#items
	* @type {Object}
	*/
	that.items = (function () {
		
		var items = that.$collection.children(),
			self = {};
		
		/**
		* Width and height of first item.
		* @private
		* @name ch.Carousel#itemSize
		* @type {Object}
		*/
		self.width = items.outerWidth();
		
		self.list = ch.list(items.toArray());
		
		/**
		* List of items that should be added on page movement.
		* @private
		* @name ch.Carousel#queue
		* @type {Object}
		*/
		self.queue = conf.asyncData || [];
		
		/**
		* CSS margin between each item.
		* @private
		* @name ch.Carousel#$collection
		* @type {Array}
		*/
		self.margin = 0;
		
		/**
		* Adds items from queue to List Object and renders these into collection
		* @private
		* @name ch.Carousel#addItems
		* @function
		*/
		self.add = function (amount) {
			
			// Take the sample from queue
			var sample = self.queue.splice(0, amount),
			
			// Amount of items previous to add from queue
				i = self.list.size(),
			
			// Amount of items next to add from queue
				j = i + sample.length;
				
			console.log("hay " + i + " items renderizados");
			console.log("hay que agregar " + amount + " items asincronicos");
			
			// Add to list
			self.list.add(sample);
			
			// Expand content width for include new items
			that.$content.css("width", (self.width + self.margin * 2) * j + extraWidth);
	
			// Create item using Render function or direct content
			var createItem = function (content) {
				return $("<li class=\"ch-carousel-item\" style=\"margin-left:" + self.margin + "px;margin-right:" + self.margin + "px;\">" + ((ch.utils.hasOwn(conf, "asyncRender")) ? conf.asyncRender(content) : content) + "</li>");
			};
			
			// Detach collection to add some items
			that.$collection.detach();
			
			// Append asynchronous items to collection
			for (; i < j; i += 1) {
				createItem(self.list.children[i]).appendTo(that.$collection);
			};
			
			// Append collection again
			that.$collection.appendTo(that.$content);
			
			
			console.log("ahora hay " + j + " items renderizados");
		};
		
		// Calculate extra width for content before draw carousel
		extraWidth = (ch.utils.html.hasClass("ie6")) ? self.width : 0;
		
		that.$container.css("height", items.outerHeight());
		
		return self;
		
	}());
	
	// Recalculate items amount on each page
	that.itemsPerPage = getItemsPerPage();
	
	
	
	
	/**
	* Page selected.
	* @private
	* @name ch.Carousel#currentPage
	* @type {Number}
	*/
	that.currentPage = 1;

	that.goTo = function (page) {
		
		// Validation of page parameter
		if (page === that.currentPage || page > that.pages || page < 1 || isNaN(page)) { return that; }
		
		// TODO: async functionality go here
		
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
			$itemsPagination
				.removeClass("ch-carousel-pages-on")
				.eq(page - 1)
				.addClass("ch-carousel-pages-on");
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
		
		// Asynchronous items loads when there are items in queue
		if (that.items.queue.length > 0) {
			// How many items needs to add for complete next page
			var amount = (that.currentPage + 1) * that.itemsPerPage % that.items.list.size(),
			
			// If isn't needed items to complete a page, then add an entire page
				sampleSize = (amount === 0) ? that.itemsPerPage : amount;
			
			// Add these
			that.items.add(sampleSize);
		}
		
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
	* Moves to a defined page.
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
	that["public"].goTo = function (page) {
		that.goTo(page);

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
}