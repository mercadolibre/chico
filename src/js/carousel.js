/**
* Carousel is a large list of elements. Some elements will be shown in a preset area, and others will be hidden waiting for the user interaction to show it.
* @name Carousel
* @class Carousel
* @augments ch.Uiobject
* @memberOf ch

* @param page
* @param arrows
* @param fx
* @param pagination

* @returns itself
* @exampleDescription Create a Carousel with configuration parameters.
* @example
* var foo = $("#example").carousel({
*     "width": 500,
*     "pagination": true,
*     "arrows": "none"
* });
* @exampleDescription Create a Carousel without configuration.
* @example
* var foo = $("#example").carousel();
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

	// Efects configuration: boolean
	conf.fx = ch.utils.hasOwn(conf, "fx") ? conf.fx : true;
	// Arrows configuration: true, false or string: "outside" (default), "over" or "none"
	conf.arrows = ch.utils.hasOwn(conf, "arrows") ? conf.arrows : "outside";
	// Pagination configuration
	conf.pagination = ch.utils.hasOwn(conf, "pagination") ? conf.pagination : false;

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
	* List of items that should be loaded asynchronously on page movement.
	* @private
	* @name ch.Carousel#queue
	* @type Array
	*/
	var queue = conf.asyncData || [],
	
	/**
	* Element that denies the list overflow.
	* @private
	* @name ch.Carousel#$mask
	* @type jQuery Object
	*/
		$mask = $("<div class=\"ch-carousel-mask\" role=\"tabpanel\">"),

	/**
	* Element that moves across component (inside the mask).
	* @private
	* @name ch.Carousel#$list
	* @type jQuery Object
	*/
		$list = (function () {
			
			var l = that.$element.children().addClass("ch-carousel-list").attr("role", "list");
			
			var i = l.children();
			
			//l.css("width", (i.outerWidth() + (i.outerWidth() /2)) * i.length * 2);
			
			return l;
		}()),

	/**
	* 
	* @private
	* @name ch.Carousel#
	* @type Number
	*/
		listWidth,
	
	/**
	* Collection of each child of the list.
	* @private
	* @name ch.Carousel#$items
	* @type jQuery Object
	*/
		$items = $list.children().attr("role", "listitem"),
	
	/**
	* The width of each item, including paddings, margins and borders. Ideal for make calculations.
	* @private
	* @name ch.Carousel#itemWidth
	* @type Number
	*/
		itemWidth = $items.width(),
		
	/**
	* The width of each items, without paddings, margins and borders. Ideal for manipulate CSS width property.
	* @private
	* @name ch.Carousel#itemOuterWidth
	* @type Number
	*/
		itemOuterWidth = $items.outerWidth(),
	
	/**
	* 
	* @private
	* @name ch.Carousel#itemExtraWidth
	* @type Number
	*/
		itemExtraWidth,

	/**
	* The margin of all items. Updated in each redraw only if it's necessary.
	* @private
	* @name ch.Carousel#itemMargin
	* @type Number
	*/
		itemMargin,

	/**
	* Amount of items in only one page. Updated in each redraw.
	* @private
	* @name ch.Carousel#itemsPerPage
	* @type Number
	*/
		itemsPerPage,

	/**
	* Distance needed to move ONLY ONE page. Data updated in each redraw.
	* @private
	* @name ch.Carousel#pageWidth
	* @type Number
	*/
		pageWidth,

	/**
	* Size of the mask. Updated in each redraw.
	* @private
	* @name ch.Carousel#maskWidth
	* @type Number
	*/
		maskWidth,

	/**
	* Total amount of pages. Data updated in each redraw.
	* @private
	* @name ch.Carousel#pages
	* @type Number
	*/
		pages,

	/**
	* Page currently showed.
	* @private
	* @name ch.Carousel#currentPage
	* @type Number
	*/
		currentPage = 1,
	
	/**
	* Interval used to animate the component autamatically.
	* @private
	* @name ch.Carousel#timer
	* @type Object
	*/
		timer,

	/**
	* Calculates and set the free space between each item.
	* @private
	* @name ch.Carousel#2
	* @function
	*/
		updateItemMargin2 = function () {

			// Total space to use as margin into mask
			// It's the difference between mask width and total width of all items
			var freeSpace = maskWidth - (itemOuterWidth * itemsPerPage),
			
			// Amount of spaces to distribute the free space
			// When there are 6 items on a page, there are 5 spaces between them
			// Except when there are only one page that exists only one space
				spaces = (itemsPerPage > 1) ? itemsPerPage - 1 : itemsPerPage,

			// Free space for each space between items
			// Ceil to delete float numbers (not Floor, because next page is seen)
				margin = Math.ceil(freeSpace / spaces);

			// Update ONLY IF margin changed from last redraw
			if (itemMargin === margin) { return; }
			
			// Update element styles and itemMargin variable
			$items.css("margin-right", (itemMargin = margin));
		},
		
		
		updateItemMargin2 = function () {
			
			// Total space to use as margin into mask
			// It's the difference between mask width and total width of all items
			var freeSpace = maskWidth - (itemOuterWidth * itemsPerPage),
			
			//
				extraSpace = Math.ceil(freeSpace / itemsPerPage);
			
			// 
			$items.css("width", originalSize + extraSpace);
		},
		
		updateResponsiveness = function () {
			
			// Grabs if there are MORE THAN ONE item in a page or just one
			var moreThanOne = itemsPerPage > 1,
			
			// Total space to use as margin into mask
			// It's the difference between mask width and total width of all items
				freeSpace = maskWidth - (itemOuterWidth * itemsPerPage),
			
			// Amount of spaces to distribute the free space
			// When there are 6 items on a page, there are 5 spaces between them
			// Except when there are only one page that NO exist spaces
				spaces = moreThanOne ? itemsPerPage - 1 : 0,
				
			// Free space for each space between items
			// Ceil to delete float numbers (not Floor, because next page is seen)
			// There is no margin when there are only one item in a page
				margin = moreThanOne ? Math.ceil(freeSpace / spaces / 2) : 0,
			
			// Width to add to each item to get responsivity
			// When there are more than one item, get extra width for each one
			// When there are only one item, extraWidth must be just the freeSpace
				extraWidth = moreThanOne ? Math.ceil(freeSpace / itemsPerPage / 2) : Math.ceil(freeSpace);
			
			// Update ONLY IF margin changed from last redraw
			if (itemExtraWidth === extraWidth) { return; }
			
			// Update global values
			itemMargin = margin;
			itemExtraWidth = extraWidth;
			
			// Update distance needed to move ONLY ONE page
			// The width of all items on a page, plus the width of all margins of items
			pageWidth = (itemOuterWidth + extraWidth + margin) * itemsPerPage;
			
			// Update list width
			// Consider one more page to get an error margin
			$list.css("width", pageWidth * (pages + 1));
			
			// Update element styles
			$items.css({
				"width": itemWidth + extraWidth,
				"margin-right": margin
			});
		},

	/**
	* Trigger all recalculations to get the functionality measures.
	* @private
	* @name ch.Carousel#draw
	* @function
	*/
		draw = function () {

			// Avoid wrong calculations going to first page
			goToPage(1);

			// Trigger Draw event as deferred
			that.trigger("draw");

			// Trigger Draw event as configuration
			that.callbacks("onDraw");

			// Update the width of the mask
			maskWidth = $mask.outerWidth();

			// Update amount of items into a single page (from conf or auto calculations)
			itemsPerPage = (function () {
				// The width of each item into the width of the mask
				var i = ~~(maskWidth / itemOuterWidth);
				
				// Avoid zero items in a page
				if (i === 0) { return 1; }
				
				// Limit amount of items when user set a maxItems amount
				if (ch.utils.hasOwn(conf, "maxItems") && i > conf.maxItems) {
					return conf.maxItems;
				}
				
				// Default calculation
				return i;
			}());

			// Update amount of total pages
			// The ratio between total amount of items and items in each page
			totalPages = Math.ceil(($items.length + queue.length) / itemsPerPage);
			
			// Update only if pages amount changed from last redraw
			if (pages !== totalPages) {
				// Update value
				pages = totalPages;
				// Set WAI-ARIA properties to each item
				updateARIA();
				// Update arrows (when pages === 1, there is no arrows)
				updateArrows();
				// Update pagination
				updatePagination();
			}

			// Update the margin between items and its size
			if (!ch.utils.hasOwn(conf, "width")) {
				updateResponsiveness();
			}
		},

	/**
	* Defines the size behavior of Carousel. It can be elastic or fixed.
	* @private
	* @name ch.Carousel#setWidth
	* @function
	*/
		setWidth = function () {

			// Width by configuration
			if (ch.utils.hasOwn(conf, "width")) {
				return that.$element.css("width", conf.width);
			}

			// Elastic width
			// Flag to know when resize happens
			var resizing = false;

			// Change resize status on Window resize event
			ch.utils.window.on("resize", function () { resizing = true; });

			// Limit resize execution
			setInterval(function () {

				if (!resizing) { return; }

				resizing = false;
				draw();

			}, 250);
		},
		
	
	/**
	* Makes ready the component structure.
	* @private
	* @name ch.Carousel#createLayout
	* @function
	*/
		createLayout = function () {

			setWidth();
			
			$list.css("width", itemOuterWidth * ($items.length + queue.length));

			that.$element
			// Wrap the list with mask
				.wrapInner($mask)
			// Change overflow to translate that feature to mask
				.css("overflow", "hidden");

			// TODO: Get a better reference to rendered mask
			$mask = that.$element.children(".ch-carousel-mask");
			
			// If efects aren't needed, avoid transition on list
			if (!conf.fx) { $list.addClass("ch-carousel-nofx"); }
			
			// 
			if (!ch.features.transition) {
				$list.css({ "position": "absolute", "left": "0" });
			}
			
			$mask.height($items.outerHeight());
			
			// 
			arrowsFlow(conf.arrows);
			
			draw();
			
			loadAsyncItems();
			
			updateARIA();
			
			// 
			if (conf.pagination) { addPagination(); }
		},

	/**
	* DOM element of arrow that moves the Carousel to previous page.
	* @private
	* @name ch.Carousel#$prevArrow
	* @type jQuery Object
	*/
		$prevArrow = $("<p class=\"ch-carousel-prev ch-carousel-disabled\" role=\"button\" aria-hidden=\"true\"><span>Previous</span></p>"),

	/**
	* DOM element of arrow that moves the Carousel to next page.
	* @private
	* @name ch.Carousel#$nextArrow
	* @type jQuery Object
	*/
		$nextArrow = $("<p class=\"ch-carousel-next\" role=\"button\" aria-hidden=\"false\"><span>Next</span></p>"),

	/**
	* Flag to control when arrows were created before.
	* @private
	* @name ch.Carousel#arrowsCreated
	* @type Boolean
	*/
		arrowsCreated = false,

	/**
	* Add arrows to DOM, bind these event and change the flag "arrowsCreated".
	* @private
	* @name ch.Carousel#addArrows
	* @function
	*/
		addArrows = function () {

			// Check arrows existency
			if (arrowsCreated) { return; }
			
			// Add arrows to DOM and bind events
			// TODO: Bind only once when arrows are created
			$prevArrow.prependTo(that.$element).on("click", that.prev);
			$nextArrow.appendTo(that.$element).on("click", that.next);
			
			// Positions arrows vertically in middle of Carousel
			$prevArrow[0].style.top = $nextArrow[0].style.top = (that.$element.height() - $prevArrow.height()) / 2 + "px";

			// Avoid selection on the arrows
			ch.utils.avoidTextSelection($prevArrow, $nextArrow);

			// Check arrows as created
			arrowsCreated = true;
		},

	/**
	* Delete arrows from DOM, unbind these event and change the flag "arrowsCreated".
	* @private
	* @name ch.Carousel#removeArrows
	* @function
	*/
		removeArrows = function () {

			// Check arrows existency
			if (!arrowsCreated) { return; }
			
			// Delete arrows only from DOM and keep in variables and unbind events too
			// TODO: Bind only once when arrows are created
			$prevArrow.off("click", that.prev).detach();
			$nextArrow.off("click", that.next).detach();

			// Check arrows as deleted
			arrowsCreated = false;
		},

	/**
	* Check for arrows behavior on first, last and middle pages, and update class name and ARIA values.
	* @private
	* @name ch.Carousel#updateArrows
	* @function
	*/
		updateArrows = function () {

			// Check arrows existency
			if (!arrowsCreated) { return; }
			
			// Case 1: Disable both arrows if there are ony one page
			if (pages === 1) {
				$prevArrow.attr("aria-hidden", "true").addClass("ch-carousel-disabled");
				$nextArrow.attr("aria-hidden", "true").addClass("ch-carousel-disabled");
			// Case 2: "Previous" arrow hidden on first page
			} else if (currentPage === 1) {
				$prevArrow.attr("aria-hidden", "true").addClass("ch-carousel-disabled");
				$nextArrow.attr("aria-hidden", "false").removeClass("ch-carousel-disabled");
			// Case 3: "Next" arrow hidden on last page
			} else if (currentPage === pages) {
				$prevArrow.attr("aria-hidden", "false").removeClass("ch-carousel-disabled");
				$nextArrow.attr("aria-hidden", "true").addClass("ch-carousel-disabled");
			// Case 4: Enable both arrows on Carousel's middle
			} else {
				$prevArrow.attr("aria-hidden", "false").removeClass("ch-carousel-disabled");
				$nextArrow.attr("aria-hidden", "false").removeClass("ch-carousel-disabled");
			}
		},

	/**
	* Allow to render the arrows over the mask or not.
	* @private
	* @name ch.Carousel#arrowsFlow
	* @function
	* @param {String || Boolean} config Defines the arrows behavior. It can be "outside", "over", "none", true or false. By default it's "outside".
	*/
		arrowsFlow = function (config) {

			// Getter
			if (config === undefined) { return conf.arrows; }
			
			// Setter
			switch (conf.arrows = config) {
			// The arrows are on the sides of the mask
			case "outside":
			default:
				// Add the adaptive class to mask
				$mask.addClass("ch-carousel-adaptive");
				// Append arrows if previously were deleted
				addArrows();
				break;

			// The arrows are over the mask
			case "over":
			case true:
				// Remove the adaptive class to mask
				$mask.removeClass("ch-carousel-adaptive");
				// Append arrows if previously were deleted
				addArrows();
				break;

			// No arrows
			case "none":
			case false:
				// Remove the adaptive class to mask
				$mask.removeClass("ch-carousel-adaptive");
				// Detach arrows from DOM and continue to remove adaptive class
				removeArrows();
				break;
			}
		},
	
	/**
	* 
	* @private
	* @name ch.Carousel#
	* @function
	*/	
		$pagination = $("<p class=\"ch-carousel-pages\" role=\"tablist\">").on("click", function (event) {
			goToPage($(event.target).attr("data-page"));
		}),
	
	/**
	* Flag to control when pagination was created before.
	* @private
	* @name ch.Carousel#paginationCreated
	* @type Boolean
	*/
		paginationCreated = false,
	
	/**
	* 
	* @private
	* @name ch.Carousel#
	* @function
	*/
		switchPagination = function (from, to) {
			
			// Avoid to change something that not exists
			if (!paginationCreated) { return; }
			
			// 
			var children = $pagination.children();
			
			// 
			children.eq(from - 1).attr("aria-selected", "false").removeClass("ch-carousel-selected");
			
			// 
			children.eq(to - 1).attr("aria-selected", "true").addClass("ch-carousel-selected");
		},
	
	/**
	* 
	* @private
	* @name ch.Carousel#
	* @function
	*/
		updatePagination = function () {
			
			// Avoid to change something that not exists
			if (!paginationCreated) { return; }
			
			// Delete thumbnails
			removePagination();
			
			// Generate thumbnails
			addPagination();
		},
		
	/**
	* 
	* @private
	* @name ch.Carousel#
	* @function
	*/
		addPagination = function () {
			
			// 
			var thumbs = [];
			
			// 
			for (var i = 1, j = pages + 1; i < j; i += 1) {
				
				// 
				var isCurrentPage = (i === currentPage);
				
				// 
				thumbs.push(
					// Tag opening with ARIA role
					"<span role=\"tab\"",
					// Selection depends on current page
					" aria-selected=\"" + isCurrentPage + "\"",
					// WAI-ARIA reference to page that this thumbnail controls
					" aria-controls=\"page" + i + "\"",
					// JS reference to page that this thumbnail controls
					" data-page=\"" + i + "\"",
					// Class name to indicate when this thumbnail is selected or not
					" class=\"" + (isCurrentPage ? "ch-carousel-selected" : "") + "\"",
					// Friendly content and tag close
					">Page " + i + "</span>"
				);
			}
			
			// 
			$pagination
			//
				.html(thumbs.join(""))
			//
				.appendTo(that.$element);
			
			// Avoid selection on the pagination
			ch.utils.avoidTextSelection($pagination);
			
			// Check pagination as created
			paginationCreated = true;
		},
	
	/**
	* Delete pagingation from DOM and change the flag "paginationCreated".
	* @private
	* @name ch.Carousel#removePagination
	* @function
	*/
		removePagination = function () {
			
			// Avoid to change something that not exists
			if (!paginationCreated) { return; }
			
			// Delete thumbnails
			$pagination[0].innerHTML = "";
			
			// Check pagination as deleted
			paginationCreated = false;
		},
	
	/**
	* Set WAI-ARIA properties to each item depending on the page in which these are.
	* @private
	* @name ch.Carousel#updateARIA
	* @function
	*/
		updateARIA = function () {
			
			// Amount of items when ARIA is updated
			var total = $items.length + queue.length;
			
			// Update ARIA properties on all items
			$items.each(function (i, item) {
				
				// Update page where this item is in
				var page = getPage(i);
				
				// Update ARIA attributes
				$(item).attr({
					"aria-hidden": page !== currentPage,
					"aria-setsize": total,
					"aria-posinset": i + 1,
					"aria-label": "page" + page
				});
			});
		},
	
	/**
	* 
	* @private
	* @name ch.Carousel#
	* @function
	*/
		getPage = function (item) {
			return ~~(item / itemsPerPage) + 1;
		},
	
	/**
	* 
	* @private
	* @name ch.Carousel#translate
	* @function
	*/
		translate = (function () {
			
			var transform = "-" + ch.utils.VENDOR_PREFIX + "-transform";
			
			// Translate list using CSS translate transform
			function CSSMove(displacement) {
				$list.css(transform, "translateX(" + displacement + "px)");
			}
			
			// Translate using jQuery animation
			function jQueryMove(displacement) {
				$list.animate({"left": displacement});
			}
			
			// Translate without efects
			function directMove(displacement) {
				$list.css("left", displacement);
			}
			
			// Use CSS transition with JS animate to move as fallback
			return ch.features.transition ? CSSMove : (conf.fx ? jQueryMove : directMove);
		}()),
		
	/**
	* 
	* @private
	* @name ch.Carousel#goToPage
	* @function
	* @param {Number || String} page Reference of page to go. It can be specified as number or "first" or "last" string.
	*/
		goToPage = function (page) {

			// Page getter
			if (!page) { return currentPage; }

			// Page setter
			// Change to number the text pages ("first" and "last")
			if (page === "first") { page = 1; }
			else if (page === "last") { page = pages; }
			
			// Avoid strings from here
			page = parseInt(page);

			// Avoid to select:
			// - The same page that is selected yet
			// - A page less than 1
			// - A page greater than total amount of pages
			if (page === currentPage || page < 1 || page > pages) { return; }

			// Perform these tasks in the following order:
			// Task 1: Move the list!!!
			// Position from 0 (zero), to page to move (page number beginning in zero)
			translate(-pageWidth * (page - 1));
			
			// Task 2: Update selected thumbnail on pagination
			switchPagination(currentPage, page);
			
			// Task 3: Update value of current page
			currentPage = page;
			
			// Task 4: Check for arrows behavior on first, last and middle pages
			updateArrows();
			
			// Task 5: Get items from queue to the list, if it's necessary
			loadAsyncItems();
			
			// Task 6: Set WAI-ARIA properties to each item
			updateARIA();
			
			// Trigger Select event as configuration
			that.trigger("select");
			
			// Trigger Select event as deferred
			that.callbacks("onSelect");
		},
	
	/**
	* Move items from queue to collection.
	* @private
	* @name ch.Carousel#addItems
	* @function
	* @param {Number} amount Amount of items that will be added.
	*/
		addItems = function (amount) {
			
			// Take the sample from queue
			var sample = queue.splice(0, amount);
			
			// Replace sample items with Carousel item template)
			for (var i = 0; i < amount; i += 1) {
				// Replace sample item
				sample[i] = [
					// Open tag with ARIA role
					"<li role=\"listitem\"",
					// Add the same margin than all siblings items
					" style=\"width: " + (itemWidth + itemExtraWidth) + "px; margin-right: " + itemMargin + "px\"",
					// Add content (executing a template, if user specify it) and close the tag
					">" + (conf.asyncRender(sample[i]) || sample[i]) + "</li>"
				// Get it as string
				].join("");
			};
			
			// Add sample items to the list
			$list.append(sample.join(""));
			
			// Update items collection
			$items = $list.children();
			
			// Trigger item addition event as deferred
			that.trigger("itemsAdded");
			
			// Trigger item addition event as configuration
			that.callbacks("onItemsAdded");
		},
	
	/**
	* Analizes if next page needs to load items from queue and execute addItems() method.
	* @private
	* @name ch.Carousel#loadAsyncItems
	* @function
	*/
		loadAsyncItems = function () {

			// Load only when there are items in queue
			if (queue.length === 0) { return; }

			// Amount of items from the beginning to current page
			var total = currentPage * itemsPerPage,

			// How many items needs to add to items rendered to complete to this page
				amount = total - $items.length;
			
			// Load only when there are items to add
			if (amount < 1) { return; }
			
			// If next page needs less items than it support, then add that amount
			amount = (queue.length < amount) ? queue.length : amount;
			
			// Add these
			addItems(amount);
		};

/**
*  Protected Members
*/

	/**
	* Moves to the previous page.
	* @protected
	* @function
	*/
	that.prev = function () {
		
		goToPage(currentPage - 1);
		
		that.callbacks("onPrev");
		that.trigger("prev");
		
		return that;
	};
	
	/**
	* Moves to the next page.
	* @protected
	* @function
	*/
	that.next = function () {
		
		goToPage(currentPage + 1);
		
		that.callbacks("onPrev");
		that.trigger("prev");
		
		return that;
	};
	
	/**
	* Animates the Carousel automatically. (Since 0.10.6)
	* @protected
	* @since 0.10.6
	* @function
	* @param {Number} t Delay of transition between pages, expressed in milliseconds.
	*/
	that.play = (function () {
		
		// Set a default delay
		var delay = 3000;
		
		// Final function of play
		return function (t) {
			
			// User timing over the default
			if (t) { delay = t; }
			
			// Set the interval on private property
			timer = setInterval(function () {
				// Normal behavior: Move to next page
				if (currentPage < pages) { that.next(); }
				// On last page: Move to first page
				else { goToPage(1); }
			// Use the setted timing
			}, delay);
		};
	}());
	
	/**
	* Pause the Carousel automatic playing. (Since 0.10.6)
	* @protected
	* @since 0.10.6
	* @function
	*/
	that.pause = function () {
		clearInterval(timer);
	};


/**
*  Public Members
*/
	/**
	* @borrows ch.Object#uid as ch.Carousel#uid
	* @borrows ch.Object#element as ch.Carousel#element
	* @borrows ch.Object#type as ch.Carousel#type
	*/
	
	/**
	* Same as "select". Gets the current page or moves to a defined page (Since 0.7.4).
	* @public
	* @function
	* @name ch.Carousel#page
	* @returns Chico UI Object
	* @param {Number || String} page Reference of page to go. It can be specified as number or "first" or "last" string.
	* @since 0.7.4
	* @exampleDescription Go to second page.
	* @example
	* foo.page(2);
	* @exampleDescription Get the current page.
	* @example
	* foo.page();
	*/
	/**
	* Same as "page". Moves to a defined page (Since 0.7.5).
	* @public
	* @function
	* @name ch.Carousel#select
	* @returns Current page number or Chico UI Object
	* @param {Number || String} page Reference of page to go. It can be specified as number or "first" or "last" string.
	* @since 0.7.5
	* @exampleDescription Go to second page.
	* @example
	* foo.select(2);
	*/
	that["public"].page = that["public"].select = function (page) {
		return goToPage(page) || that["public"];
	};

	/**
	* Moves to the previous page.
	* @public
	* @function
	* @name ch.Carousel#prev
	* @returns Chico UI Object
	* @exampleDescription Go to previous page.
	* @example
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
	* @exampleDescription Go to next page.
	* @example
	* foo.next();
	*/
	that["public"].next = function () {
		that.next();
		return that["public"];
	};
	
	/**
	* Allow to manage or disable the "Next" and "Previous" buttons flow ("over" the mask, "outside" it or "none"). (Since 0.10.6).
	* @public
	* @function
	* @name ch.Carousel#arrows
	* @since 0.10.6
	* @returns Chico UI Object
	* @param {String || Boolean} config CSS transition properties. By default it's "outside".
	* @exampleDescription Put arrows outside the mask.
	* @example
	* foo.arrows("outside");
	* // or
	* foo.arrows(true);
	* @exampleDescription Put arrows over the mask.
	* @example
	* foo.arrows("over");
	* @exampleDescription Disable arrows.
	* @example
	* foo.arrows("none");
	* or
	* foo.arrows(false);
	*/
	that["public"].arrows = function (config) {
		arrowsFlow(config);
		draw();
		return that["public"];
	};
	
	/**
	* Trigger all recalculations to get the functionality measures.
	* @public
	* @function
	* @name ch.Carousel#redraw
	* @returns Chico UI Object
	* @exampleDescription Re-draw the Carousel.
	* @example
	* foo.redraw();
	*/
	that["public"].redraw = function () {
		draw();
		return that["public"];
	};
	
	/**
	* Animates the Carousel automatically.
	* @public
	* @function
	* @name ch.Carousel#play
	* @param {Number} t Delay of transition between pages, expressed in milliseconds.
	* @returns Chico UI Object
	* @exampleDescription Start automatic animation.
	* @example
	* foo.play();
	* @exampleDescription Start automatic animation with a 5 seconds delay between pages.
	* @example
	* foo.play(5000);
	*/
	that["public"].play = function (t) {
		that.play(t);
		return that["public"];
	};
	
	/**
	* Pause the Carousel automatic playing.
	* @public
	* @function
	* @name ch.Carousel#pause
	* @returns Chico UI Object
	* @exampleDescription Pause automatic animation.
	* @example
	* foo.pause();
	*/
	that["public"].pause = function () {
		that.pause();
		return that["public"];
	};
	

/**
*  Default event delegation
*/
	
	// Get ready the component structure.
	createLayout();
	
	// Put Carousel on specified page or at the beginning
	goToPage(conf.page || 1);
	
	// Shoot the ready event
	setTimeout(function () { that.trigger("ready"); }, 50);

	return that;
};

ch.factory("carousel");