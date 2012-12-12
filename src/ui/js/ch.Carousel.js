/**
 * Carousel is a large list of elements. Some elements will be shown in a preset area, and others will be hidden waiting for the user interaction to show it.
 * @name Carousel
 * @class Carousel
 * @augments ch.Widget
 * @see ch.Widget
 * @memberOf ch
 * @factorized
 * @param {Object} [options] Object with configuration properties.
 * @param {Number || String} [options.width] Sets width property of the component's layout. By default, the width is elastic.
 * @param {Boolean} [options.pagination] Shows a pagination. By default, the value is false.
 * @param {Boolean} [options.arrows] Shows arrows icons over or outside the mask. By default, the value is 'outside'.
 * @param {Array} [options.asyncData] Defines the content of each item that will be load asnchronously as array.
 * @param {Function} [options.asyncRender] The function that receives asyncData content and must return a string with result of manipulate that content.
 * @param {Boolean} [options.fx] Enable or disable UI effects. By default, the effects are enabled.
 * @param {Number} [options.maxItems] (Since 0.10.6) Set the max amount of items to show in each page.
 * @param {Number} [options.page] (Since 0.10.6) Initialize the Carousel in a specified page.
 * @returns itself
 * @exampleDescription Create a Carousel without configuration.
 * @example
 * var foo = $('#example').carousel();
 * @exampleDescription Create a Carousel with configuration parameters.
 * @example
 * var foo = $('#example').carousel({
 *     'width': 500,
 *     'pagination': true,
 *     'arrows': 'over'
 * });
 * @exampleDescription Create a Carousel with items asynchronously loaded.
 * @example
 * var foo = $('#example').carousel({
 *     'asyncData': [
 *         {'src': 'a.png', 'alt': 'A'},
 *         {'src': 'b.png', 'alt': 'B'},
 *         {'src': 'c.png', 'alt': 'C'}
 *     ],
 *     'asyncRender': function (data) {
 *         return '<img src="' + data.src + '" alt="' + data.alt + '"/>';
 *     }
 * });
 */
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	var Math = window.Math,
		setTimeout = window.setTimeout,
		setInterval = window.setInterval,
		$html = $('html'),
		$window = $(window);

	function Carousel($el, options) {

		this.init($el, options);

		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @protected
		 * @name ch.Carousel#that
		 * @type Object
		 */
		var that = this;

		// Shoot the ready event
		setTimeout(function () { that.emitter.emit('ready'); }, 50);
	}

	/**
	 *	Inheritance
	 */
	ch.util.inherits(Carousel, ch.Widget);

	Carousel.prototype.name = 'carousel';

	Carousel.prototype.constructor = Carousel;

	Carousel.prototype.defaults = {
		'pagination': false,
		'arrows': 'outside',
		'page': 1,
		'fx': true
	};

	Carousel.prototype.init = function ($el, options) {

		this.uber.init.call(this, $el, options);

		this.element = this.el;
		var that = this;

		/**
		 * Element that moves across component (inside the mask).
		 * @private
		 * @name ch.Carousel#$list
		 * @type jQuery Object
		 */
		this.$list = this.$el.children().addClass('ch-carousel-list').attr('role', 'list');

		/**
		 * Collection of each child of the list.
		 * @private
		 * @name ch.Carousel#$items
		 * @type jQuery Object
		 */
		this.$items = this.$list.children().addClass('ch-carousel-item').attr('role', 'listitem');

		/**
		 * Element that denies the list overflow.
		 * @private
		 * @name ch.Carousel#$mask
		 * @type jQuery Object
		 */
		this.$mask = $('<div class="ch-carousel-mask" role="tabpanel" style="height:' + this.$items.outerHeight() + 'px">');

		/**
		 * The width of each item, without paddings, margins or borders. Ideal for manipulate CSS width property.
		 * @private
		 * @name ch.Carousel#itemOuterWidth
		 * @type Number
		 */
		this.itemOuterWidth = this.$items.outerWidth();

		/**
		 * The width of each item, including paddings, margins and borders. Ideal for make calculations.
		 * @private
		 * @name ch.Carousel#itemWidth
		 * @type Number
		 */
		this.itemWidth = this.$items.width();

		/**
		 * The height of each item, including paddings, margins and borders. Ideal for make calculations.
		 * @private
		 * @name ch.Carousel#itemHeight
		 * @type Number
		 */
		this.itemHeight = this.$items.height();

		/**
		 * List of items that should be loaded asynchronously on page movement.
		 * @private
		 * @name ch.Carousel#queue
		 * @type Array
		 */
		this.queue = (function () {
			// No queue
			if (!ch.util.hasOwn(that.options, 'asyncData')) { return []; }
			// Validated queue
			var q = [];
			// Validate each item in queue to be different to undefined
			$.each(that.options.asyncData, function (index, item) {
				if (item) { q.push(item); }
			});
			// Return validated queue
			return q;
		}());

		/**
		 * DOM element of arrow that moves the Carousel to the previous page.
		 * @private
		 * @name ch.Carousel#$prevArrow
		 * @type jQuery Object
		 */
		this.$prevArrow = $('<div class="ch-carousel-prev ch-carousel-disabled" role="button" aria-hidden="true">').on('click.carousel', function () { that.prev(); });

		/**
		 * DOM element of arrow that moves the Carousel to the next page.
		 * @private
		 * @name ch.Carousel#$nextArrow
		 * @type jQuery Object
		 */
		that.$nextArrow = $('<div class="ch-carousel-next" role="button" aria-hidden="false">').on('click.carousel', function () { that.next(); });

		/**
		 * HTML Element that contains all thumbnails for pagination.
		 * @private
		 * @name ch.Carousel#$pagination
		 * @jQuery Object
		 */
		this.$pagination = $('<div class="ch-carousel-pages" role="tablist">').on('click', function (event) {
			that.goToPage($(event.target).attr('data-page'));
		});

		// Defines the sizing behavior of Carousel. It can be elastic and responsive or fixed.
		(function setWidth() {
			// Width by configuration
			if (ch.util.hasOwn(that.options, 'width')) {
				return that.$el.css('width', that.options.width);
			}

			// Elastic width
			// Flag to know when resize happens
			var resizing = false;

			// Change resize status on Window resize event
			$window.on('resize', function () { resizing = true; });

			// Limit resize execution
			setInterval(function () {

				if (!resizing) { return; }

				resizing = false;
				that.redraw();

			}, 250);
		}());

		// Set initial width of the list, to make space to all items
		this.$list.css('width', this.itemOuterWidth * (this.$items.length + this.queue.length));
		// Wrap the list with mask and change overflow to translate that feature to mask
		this.$el.wrapInner(this.$mask).css('overflow', 'hidden');
		// TODO: Get a better reference to rendered mask
		this.$mask = this.$el.children('.ch-carousel-mask');
		// Update the mask height with the list height
		// Do it here because before, items are stacked
		this.$mask.css('height', this.$list.outerHeight());

		// If efects aren't needed, avoid transition on list
		if (!this.options.fx) { this.$list.addClass('ch-carousel-nofx'); }
		// Position absolutelly the list when CSS transitions aren't supported
		if (!ch.support.transition) { this.$list.css({'position': 'absolute', 'left': '0'}); }

		// Allow to render the arrows over the mask or not
		this.arrowsFlow(this.options.arrows);
		// Trigger all recalculations to get the functionality measures
		this.redraw();
		// Analizes if next page needs to load items from queue and execute addItems() method
		this.loadAsyncItems();
		// Set WAI-ARIA properties to each item depending on the page in which these are
		this.updateARIA();

		// If there are a parameter specifying a pagination, add it
		if (this.options.pagination) { this.addPagination(); }

		// Put Carousel on specified page or at the beginning
		this.goToPage(this.options.page);
	};

	/**
	 * Set WAI-ARIA properties to each item depending on the page in which these are.
	 * @private
	 * @name ch.Carousel#updateARIA
	 * @function
	 */
	Carousel.prototype.updateARIA = function () {

		var that = this,
			// Amount of items when ARIA is updated
			total = this.$items.length + this.queue.length;
		// Update ARIA properties on all items
		this.$items.each(function (i, item) {
			// Update page where this item is in
			var page = Math.floor(i / that.itemsPerPage) + 1;
			// Update ARIA attributes
			$(item).attr({
				'aria-hidden': page !== that.currentPage,
				'aria-setsize': total,
				'aria-posinset': i + 1,
				'aria-label': 'page' + page
			});
		});
	};

	/**
	 * Move items from queue to collection.
	 * @private
	 * @name ch.Carousel#addItems
	 * @function
	 * @param {Number} amount Amount of items that will be added.
	 */
	Carousel.prototype.addItems = function (amount) {

		var that = this,
			// Take the sample from queue
			sample = that.queue.splice(0, amount),
			// Function with content processing using asyncRender or not
			getContent = that.options.asyncRender || function (data) { return data; },
			// Index
			i = 0;

		// Replace sample items with Carousel item template)
		for (i; i < amount; i += 1) {
			// Replace sample item
			sample[i] = [
				// Open tag with ARIA role
				'<li role="listitem"',
				// Add classname to identify this as item
				' class="ch-carousel-item"',
				// Add the same margin than all siblings items
				' style="width:' + (that.itemWidth + that.itemExtraWidth) + 'px;margin-right:' + that.itemMargin + 'px"',
				// Add content (executing a template, if user specify it) and close the tag
				'>' + getContent(sample[i]) + '</li>'
			// Get it as string
			].join('');
		}

		// Add sample items to the list
		that.$list.append(sample.join(''));
		// Update items collection
		that.$items = that.$list.children();
		/**
		 * Triggers when component adds items asynchronously from queue.
		 * @name ch.Carousel#itemsAdded
		 * @event
		 * @public
		 * @exampleDescription Using a callback when Carousel add items asynchronously.
		 * @example
		 * example.on("itemsAdded", function () {
		 *	alert("Some asynchronous items was added.");
		 * });
		 */
		that.emitter.emit('itemsAdded');
	};

	/**
	 * Analizes if next page needs to load items from queue and execute addItems() method.
	 * @private
	 * @name ch.Carousel#loadAsyncItems
	 * @function
	 */
	Carousel.prototype.loadAsyncItems = function () {
		// Load only when there are items in queue
		if (this.queue.length === 0) { return; }

		// Amount of items from the beginning to current page
		var total = this.currentPage * this.itemsPerPage,
		// How many items needs to add to items rendered to complete to this page
			amount = total - this.$items.length;

		// Load only when there are items to add
		if (amount < 1) { return; }

		// If next page needs less items than it support, then add that amount
		amount = (this.queue.length < amount) ? this.queue.length : amount;
		// Add these
		this.addItems(amount);
	};

	/**
	 * Create the pagination on DOM and change the flag "paginationCreated".
	 * @private
	 * @name ch.Carousel#addPagination
	 * @function
	 */
	Carousel.prototype.addPagination = function () {

		var that = this,
			// Collection of thumbnails strings
			thumbs = [],
			// Index
			i = 1,
			j = that.pages + 1,
			isCurrentPage;

		// Generate a thumbnail for each page on Carousel
		for (i, j; i < j; i += 1) {
			// Determine if this thumbnail is selected or not
			isCurrentPage = (i === that.currentPage);
			// Add string to collection
			thumbs.push(
				// Tag opening with ARIA role
				'<span role="tab"',
				// Selection depends on current page
				' aria-selected="' + isCurrentPage + '"',
				// WAI-ARIA reference to page that this thumbnail controls
				' aria-controls="page' + i + '"',
				// JS reference to page that this thumbnail controls
				' data-page="' + i + '"',
				// Class name to indicate when this thumbnail is selected or not
				' class="' + (isCurrentPage ? 'ch-carousel-selected' : '') + '"',
				// Friendly content and tag close
				'>Page ' + i + '</span>'
			);
		}
		// Append thumbnails to pagination and append this to Carousel
		that.$pagination.html(thumbs.join('')).appendTo(that.$el);
		// Avoid selection on the pagination
		ch.util.avoidTextSelection(that.$pagination);
		// Check pagination as created
		that.paginationCreated = true;
	};

	/**
	 * Delete pagination from DOM and change the flag "paginationCreated".
	 * @private
	 * @name ch.Carousel#removePagination
	 * @function
	 */
	Carousel.prototype.removePagination = function () {
		// Avoid to change something that not exists
		if (!this.paginationCreated) { return; }
		// Delete thumbnails
		this.$pagination[0].innerHTML = '';
		// Check pagination as deleted
		this.paginationCreated = false;
	};

	/**
	 * Executed when total amount of pages change, this redraw the thumbnails.
	 * @private
	 * @name ch.Carousel#updatePagination
	 * @function
	 */
	Carousel.prototype.updatePagination = function () {
		// Avoid to change something that not exists
		if (!this.paginationCreated) { return; }
		// Delete thumbnails
		this.removePagination();
		// Generate thumbnails
		this.addPagination();
	};

	/**
	 * Calculates and set the size of items and its margin to get an adaptive Carousel.
	 * @private
	 * @name ch.Carousel#updateDistribution
	 * @function
	 */
	Carousel.prototype.updateDistribution = function () {

		var that = this,
			// Grabs if there are MORE THAN ONE item in a page or just one
			moreThanOne = this.itemsPerPage > 1,
			// Total space to use as margin into mask
			// It's the difference between mask width and total width of all items
			freeSpace = this.maskWidth - (this.itemOuterWidth * this.itemsPerPage),
			// Width to add to each item to get responsivity
			// When there are more than one item, get extra width for each one
			// When there are only one item, extraWidth must be just the freeSpace
			extraWidth = moreThanOne ? Math.ceil(freeSpace / this.itemsPerPage / 2) : Math.ceil(freeSpace);

		// Update ONLY IF margin changed from last redraw
		if (this.itemExtraWidth === extraWidth) { return; }

		// Amount of spaces to distribute the free space
		// When there are 6 items on a page, there are 5 spaces between them
		// Except when there are only one page that NO exist spaces
		var spaces = moreThanOne ? this.itemsPerPage - 1 : 0,
			// The new width calculated from current width plus extraWidth
			width = this.itemWidth + extraWidth;

		// Update global value of width
		this.itemExtraWidth = extraWidth;
		// Free space for each space between items
		// Ceil to delete float numbers (not Floor, because next page is seen)
		// There is no margin when there are only one item in a page
		// Update global values
		this.itemMargin = moreThanOne ? Math.ceil(freeSpace / spaces / 2) : 0;
		// Update distance needed to move ONLY ONE page
		// The width of all items on a page, plus the width of all margins of items
		this.pageWidth = (this.itemOuterWidth + extraWidth + this.itemMargin) * this.itemsPerPage;

		// Update the list width
		// Delete efects on list to change width instantly
		// Do it before item resizing to make space to all items
		this.$list.addClass('ch-carousel-nofx').css('width', this.pageWidth * this.pages);

		// Restore efects to list if it's required
		// Use a setTimeout to be sure to do this after width change
		if (this.options.fx) {
			setTimeout(function () { that.$list.removeClass('ch-carousel-nofx'); }, 0);
		}

		// Update element styles
		// Get the height using new width and relation between width and height of item (ratio)
		this.$items.css({
			'width': width,
			'height': (width * this.itemHeight) / this.itemWidth,
			'margin-right': this.itemMargin
		});

		// Update the mask height with the list height
		this.$mask.css('height', this.$list.outerHeight());
	};

	/*
	 * Trigger all recalculations to get the functionality measures.
	 * @public
	 * @function
	 * @name ch.Carousel#redraw
	 * @returns Chico UI Object
	 * @exampleDescription Re-draw the Carousel.
	 * @example
	 * foo.redraw();
	 */
	Carousel.prototype.redraw = function () {

		var that = this;

		// Avoid wrong calculations going to first page
		that.goToPage(1);
		/**
		 * Since 0.10.6: Triggers when component redraws.
		 * @name ch.Carousel#redraw
		 * @event
		 * @public
		 * @since 0.10.6
		 * @exampleDescription Using a callback when Carousel trigger a new redraw.
		 * @example
		 * example.on("redraw", function () {
		 *	alert("Carousel was redrawn!");
		 * });
		 */
		that.emitter.emit('draw');
		// Update the width of the mask
		that.maskWidth = that.$mask.outerWidth();
		/**
		 * Amount of items in only one page. Updated in each redraw.
		 * @private
		 * @name ch.Carousel#itemsPerPage
		 * @type Number
		 */
		// Update amount of items into a single page (from conf or auto calculations)
		that.itemsPerPage = (function () {
			// The width of each item into the width of the mask
			var i = Math.floor(that.maskWidth / that.itemOuterWidth);
			// Avoid zero items in a page
			if (i === 0) { return 1; }
			// Limit amount of items when user set a maxItems amount
			if (ch.util.hasOwn(that.options, 'maxItems') && i > that.options.maxItems) {
				return that.options.maxItems;
			}
			// Default calculation
			return i;
		}());

		// Update amount of total pages
		// The ratio between total amount of items and items in each page
		var totalPages = Math.ceil((that.$items.length + that.queue.length) / that.itemsPerPage);

		// Update only if pages amount changed from last redraw
		if (that.pages !== totalPages) {
			// Update value
			that.pages = totalPages;
			// Set WAI-ARIA properties to each item
			that.updateARIA();
			// Update arrows (when pages === 1, there is no arrows)
			that.updateArrows();
			// Update pagination
			that.updatePagination();
		}

		// Update the margin between items and its size
		that.updateDistribution();
	};

	/**
	 * Add arrows to DOM, bind these event and change the flag 'arrowsCreated'.
	 * @private
	 * @name ch.Carousel#addArrows
	 * @function
	 */
	Carousel.prototype.addArrows = function () {
		// Check arrows existency
		if (this.arrowsCreated) { return; }
		// Add arrows to DOM
		this.$el.prepend(this.$prevArrow).append(this.$nextArrow);
		// Positions arrows vertically in the middle of Carousel
		this.$prevArrow[0].style.top = this.$nextArrow[0].style.top = (this.$el.height() - this.$prevArrow.height()) / 2 + 'px';
		// Avoid selection on the arrows
		ch.util.avoidTextSelection(this.$prevArrow, this.$nextArrow);
		// Check arrows as created
		this.arrowsCreated = true;
	};

	/**
	 * Delete arrows from DOM, unbind these event and change the flag 'arrowsCreated'.
	 * @private
	 * @name ch.Carousel#removeArrows
	 * @function
	 */
	Carousel.prototype.removeArrows = function () {
		// Check arrows existency
		if (!this.arrowsCreated) { return; }
		// Delete arrows only from DOM and keep in variables and unbind events too
		// TODO: Bind only once when arrows are created
		this.$prevArrow.detach();
		this.$nextArrow.detach();
		// Check arrows as deleted
		this.arrowsCreated = false;
	};

	/**
	 * Allows to render the arrows over the mask or not.
	 * @private
	 * @name ch.Carousel#arrowsFlow
	 * @function
	 * @param {String || Boolean} config Defines the arrows behavior. It can be 'outside', 'over', 'none', true or false. By default it's 'outside'.
	 */
	Carousel.prototype.arrowsFlow = function (config) {
		// Getter
		if (config === undefined) { return this.options.arrows; }
		// Setter
		this.options.arrows = config;
		switch (config) {
		// The arrows are on the sides of the mask
		case 'outside':
		default:
			// Add the adaptive class to mask
			this.$mask.addClass('ch-carousel-adaptive');
			// Append arrows if previously were deleted
			this.addArrows();
			break;
		// The arrows are over the mask
		case 'over':
		case true:
			// Remove the adaptive class to mask
			this.$mask.removeClass('ch-carousel-adaptive');
			// Append arrows if previously were deleted
			this.addArrows();
			break;
		// No arrows
		case 'none':
		case false:
			// Remove the adaptive class to mask
			this.$mask.removeClass('ch-carousel-adaptive');
			// Detach arrows from DOM and continue to remove adaptive class
			this.removeArrows();
			break;
		}
	};

	/**
	 * Check for arrows behavior on first, last and middle pages, and update class name and ARIA values.
	 * @private
	 * @name ch.Carousel#updateArrows
	 * @function
	 */
	Carousel.prototype.updateArrows = function () {
		// Check arrows existency
		if (!this.arrowsCreated) { return; }
		// Case 1: Disable both arrows if there are ony one page
		if (this.pages === 1) {
			this.$prevArrow.attr('aria-hidden', 'true').addClass('ch-carousel-disabled');
			this.$nextArrow.attr('aria-hidden', 'true').addClass('ch-carousel-disabled');
		// Case 2: "Previous" arrow hidden on first page
		} else if (this.currentPage === 1) {
			this.$prevArrow.attr('aria-hidden', 'true').addClass('ch-carousel-disabled');
			this.$nextArrow.attr('aria-hidden', 'false').removeClass('ch-carousel-disabled');
		// Case 3: "Next" arrow hidden on last page
		} else if (this.currentPage === this.pages) {
			this.$prevArrow.attr('aria-hidden', 'false').removeClass('ch-carousel-disabled');
			this.$nextArrow.attr('aria-hidden', 'true').addClass('ch-carousel-disabled');
		// Case 4: Enable both arrows on Carousel's middle
		} else {
			this.$prevArrow.attr('aria-hidden', 'false').removeClass('ch-carousel-disabled');
			this.$nextArrow.attr('aria-hidden', 'false').removeClass('ch-carousel-disabled');
		}
	};

	/**
	 * Flag to control when arrows were created before.
	 * @private
	 * @name ch.Carousel#arrowsCreated
	 * @type Boolean
	 */
	Carousel.prototype.arrowsCreated = false;

	/**
	 * Flag to control if pagination was created before.
	 * @private
	 * @name ch.Carousel#paginationCreated
	 * @type Boolean
	 */
	Carousel.prototype.paginationCreated = false;

	/**
	 * Page currently showed.
	 * @private
	 * @name ch.Carousel#currentPage
	 * @type Number
	 */
	Carousel.prototype.currentPage = 1;

	/**
	 * Total amount of pages. Data updated in each redraw.
	 * @private
	 * @name ch.Carousel#pages
	 * @type Number
	 */
	Carousel.prototype.pages = 0;

	/**
	 * Distance needed to move ONLY ONE page. Data updated in each redraw.
	 * @private
	 * @name ch.Carousel#pageWidth
	 * @type Number
	 */
	Carousel.prototype.pageWidth = 0;

	/**
	 * Size of the mask. Updated in each redraw.
	 * @private
	 * @name ch.Carousel#maskWidth
	 * @type Number
	 */
	Carousel.prototype.maskWidth = 0;

	/**
	 * Size added to each item to make it responsive.
	 * @private
	 * @name ch.Carousel#itemExtraWidth
	 * @type Number
	 */
	Carousel.prototype.itemExtraWidth = 0;

	/**
	 * The margin of all items. Updated in each redraw only if it's necessary.
	 * @private
	 * @name ch.Carousel#itemMargin
	 * @type Number
	 */
	Carousel.prototype.itemMargin = 0,

	/**
	 * Moves the list corresponding to specified displacement.
	 * @private
	 * @name ch.Carousel#translate
	 * @function
	 * @param {Number} displacement Distance to move the list.
	 */
	Carousel.prototype.translate = (function () {
		// CSS property written as string to use on CSS movement
		var transform = '-' + ch.util.VENDOR_PREFIX + '-transform';

		// Translate list using CSS translate transform
		function CSSMove(displacement) {
			this.$list.css(transform, 'translateX(' + displacement + 'px)');
		}

		// Translate using jQuery animation
		function jQueryMove(displacement) {
			this.$list.animate({'left': displacement});
		}

		// Translate without efects
		function directMove(displacement) {
			this.$list.css('left', displacement);
		}

		// Use CSS transition with JS animate to move as fallback
		return (ch.support.transition) ? CSSMove : (that.options.fx ? jQueryMove : directMove);
	}());

	/**
	 * Updates the selected page on pagination.
	 * @private
	 * @name ch.Carousel#switchPagination
	 * @function
	 * @param {Number} from Page previously selected. It will be unselected.
	 * @param {Number} to Page to be selected.
	 */
	Carousel.prototype.switchPagination = function (from, to) {
		// Avoid to change something that not exists
		if (!this.paginationCreated) { return; }
		// Get all thumbnails of pagination element
		var children = this.$pagination.children();
		// Unselect the thumbnail previously selected
		children.eq(from - 1).attr('aria-selected', 'false').removeClass('ch-carousel-selected');
		// Select the new thumbnail
		children.eq(to - 1).attr('aria-selected', 'true').addClass('ch-carousel-selected');
	}

	/**
	 * Updates all necessary data to move to a specified page.
	 * @private
	 * @name ch.Carousel#goToPage
	 * @function
	 * @param {Number || String} page Reference of page to go. It can be specified as number or "first" or "last" string.
	 */
	Carousel.prototype.goToPage = function (page) {
		// Page getter
		if (!page) { return this.currentPage; }
		// Page setter
		// Change to number the text pages ("first" and "last")
		if (page === 'first') { page = 1; }
		else if (page === 'last') { page = this.pages; }
		// Avoid strings from here
		page = window.parseInt(page);
		// Avoid to select:
		// - The same page that is selected yet
		// - A page less than 1
		// - A page greater than total amount of pages
		if (page === this.currentPage || page < 1 || page > this.pages) { return; }
		// Perform these tasks in the following order:
		// Task 1: Move the list!!!
		// Position from 0 (zero), to page to move (page number beginning in zero)
		this.translate(-this.pageWidth * (page - 1));
		// Task 2: Update selected thumbnail on pagination
		this.switchPagination(this.currentPage, page);
		// Task 3: Update value of current page
		this.currentPage = page;
		// Task 4: Check for arrows behavior on first, last and middle pages
		this.updateArrows();
		// Task 5: Get items from queue to the list, if it's necessary
		this.loadAsyncItems();
		// Task 6: Set WAI-ARIA properties to each item
		this.updateARIA();
		/*
		 * Since 0.7.9: Triggers when component moves to next or previous page.
		 * @name ch.Carousel#select
		 * @event
		 * @public
		 * @since 0.7.9
		 * @example
		 * @exampleDescription Using a callback when Carousel moves to another page.
		 * example.on("select", function () {
		 *	alert("An item was selected!");
		 * });
		 */
		this.emitter.emit('select');
	};

	/**
	 * Triggers when component moves to previous page.
	 * @name ch.Carousel#prev
	 * @event
	 * @public
	 * @exampleDescription Using a callback when Carousel moves to the previous page.
	 * @example
	 * example.on("prev", function () {
	 *	alert("Previous!");
	 * });
	 */
	Carousel.prototype.prev = function () {
		this.goToPage(this.currentPage - 1);
		this.emitter.emit('prev');
	};

	/**
	 * Triggers when component moves to next page.
	 * @name ch.Carousel#next
	 * @event
	 * @public
	 * @exampleDescription Using a callback when Carousel moves to the next page.
	 * @example
	 * example.on('next', function () {
	 *	alert("Next!");
	 * });
	 */
	Carousel.prototype.next = function () {
		this.goToPage(this.currentPage + 1);
		this.emitter.emit('next');
	};

	/**
	 * Interval used to animate the component autamatically.
	 * @private
	 * @name ch.Carousel#timer
	 * @type Object
	 */
	Carousel.prototype.timer = null;

	/**
	 * Animates the Carousel automatically. (Since 0.10.6)
	 * @protected
	 * @since 0.10.6
	 * @function
	 * @param {Number} t Delay of transition between pages, expressed in milliseconds.
	 */
	Carousel.prototype.play = (function () {

		var delay = 3000;

		return function (t) {

			var that = this;
			// User timing over the default
			if (t) { delay = t; }
			// Clear the timer
			that.pause();
			// Set the interval on private property
			that.timer = setInterval(function () {
				// Normal behavior: Move to next page
				if (that.currentPage < that.pages) { that.next.call(that); }
				// On last page: Move to first page
				else { that.goToPage(1); }
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
	Carousel.prototype.pause = function () {
		window.clearInterval(this.timer);
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
	 * foo.arrows('outside');
	 * // or
	 * foo.arrows(true);
	 * @exampleDescription Put arrows over the mask.
	 * @example
	 * foo.arrows('over');
	 * @exampleDescription Disable arrows.
	 * @example
	 * foo.arrows('none');
	 * or
	 * foo.arrows(false);
	 */
	Carousel.prototype.arrows = function (config) {
		this.arrowsFlow(config);
		this.redraw();
	};

	/**
	 * Get the items amount of each page (Since 0.7.4).
	 * @public
	 * @since 0.7.4
	 * @name ch.Carousel#itemsPerPage
	 * @returns Number
	 */
	Carousel.prototype.itemsPerPage = function () {
		return this.itemsPerPage;
	};

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
	Carousel.prototype.page = Carousel.prototype.select = function (page) {
		return this.goToPage(page) || this;
	};















/* *************************************************************** */

	// /**
	//  *  Public Members
	//  */
	// 	/**
	// 	 * @borrows ch.Widget#uid as ch.Carousel#uid
	// 	 * @borrows ch.Widget#element as ch.Carousel#element
	// 	 * @borrows ch.Widget#type as ch.Carousel#type
	// 	 */










	//
	// 	that["public"].redraw = function () {
	// 		draw();
	// 		return that["public"];
	// 	};

	// 	/**
	// 	 * Animates the Carousel automatically.
	// 	 * @public
	// 	 * @function
	// 	 * @name ch.Carousel#play
	// 	 * @param {Number} t Delay of transition between pages, expressed in milliseconds.
	// 	 * @returns Chico UI Object
	// 	 * @exampleDescription Start automatic animation.
	// 	 * @example
	// 	 * foo.play();
	// 	 * @exampleDescription Start automatic animation with a 5 seconds delay between pages.
	// 	 * @example
	// 	 * foo.play(5000);
	// 	 */
	// 	that["public"].play = function (t) {
	// 		that.play(t);
	// 		return that["public"];
	// 	};

	// 	/**
	// 	 * Pause the Carousel automatic playing.
	// 	 * @public
	// 	 * @function
	// 	 * @name ch.Carousel#pause
	// 	 * @returns Chico UI Object
	// 	 * @exampleDescription Pause automatic animation.
	// 	 * @example
	// 	 * foo.pause();
	// 	 */
	// 	that["public"].pause = function () {
	// 		that.pause();
	// 		return that["public"];
	// 	};

	// 	/**
	// 	 * Get the items amount of each page (Since 0.7.4).
	// 	 * @public
	// 	 * @since 0.7.4
	// 	 * @name ch.Carousel#itemsPerPage
	// 	 * @returns Number
	// 	 */
	// 	that["public"].itemsPerPage = function () {
	// 		return itemsPerPage;
	// 	};

	// /**
	//  *  Default event delegation
	//  */
	// 	// Get ready the component structure.
	// 	createLayout();

	// 	// Put Carousel on specified page or at the beginning
	// 	this.goToPage(that.options.page || 1);

	// 	return that['public'];
	// }

	ch.factory(Carousel);

}(this, this.jQuery, this.ch));