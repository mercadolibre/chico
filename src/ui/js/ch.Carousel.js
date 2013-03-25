(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

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
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    /**
     * Private members
     */
    var pointertap = ch.events.pointer.TAP + '.carousel',
        Math = window.Math,
        setTimeout = window.setTimeout,
        setInterval = window.setInterval,
        parent = ch.util.inherits(Carousel, ch.Widget);

    Carousel.prototype.name = 'carousel';

    Carousel.prototype.constructor = Carousel;

    Carousel.prototype._defaults = {
        'pagination': false,
        'arrows': 'outside',
        'page': 1,
        'fx': true
    };

    Carousel.prototype.init = function ($el, options) {

        parent.init.call(this, $el, options);

        var that = this;

        /**
         * Element that moves across component (inside the mask).
         * @private
         * @name ch.Carousel#$list
         * @type jQuery Object
         */
        this._$list = this.$el.children().addClass('ch-carousel-list');

        /**
         * Collection of each child of the list.
         * @private
         * @name ch.Carousel#$items
         * @type jQuery Object
         */
        this._$items = this._$list.children().addClass('ch-carousel-item');

        /**
         * Element that denies the list overflow.
         * @private
         * @name ch.Carousel#$mask
         * @type jQuery Object
         */
        this._$mask = $('<div class="ch-carousel-mask" role="tabpanel" style="height:' + this._$items.outerHeight() + 'px">');

        /**
         * Size of the mask. Updated in each redraw.
         * @private
         * @name ch.Carousel#maskWidth
         * @type Number
         */
        this._maskWidth = 0;

        /**
         * The width of each item, including paddings, margins and borders. Ideal for make calculations.
         * @private
         * @name ch.Carousel#itemWidth
         * @type Number
         */
        this._itemWidth = this._$items.width();

        /**
         * The width of each item, without paddings, margins or borders. Ideal for manipulate CSS width property.
         * @private
         * @name ch.Carousel#itemOuterWidth
         * @type Number
         */
        this._itemOuterWidth = this._$items.outerWidth();

        /**
         * Size added to each item to make it responsive.
         * @private
         * @name ch.Carousel#itemExtraWidth
         * @type Number
         */
        this._itemExtraWidth = 0;

        /**
         * The height of each item, including paddings, margins and borders. Ideal for make calculations.
         * @private
         * @name ch.Carousel#itemHeight
         * @type Number
         */
        this._itemHeight = this._$items.height();

        /**
         * The margin of all items. Updated in each redraw only if it's necessary.
         * @private
         * @name ch.Carousel#itemMargin
         * @type Number
         */
        this._itemMargin = 0;

        /**
         * Flag to control when arrows were created before.
         * @private
         * @name ch.Carousel#arrowsCreated
         * @type Boolean
         */
        this._arrowsCreated = false;

        /**
         * Flag to control if pagination was created before.
         * @private
         * @name ch.Carousel#paginationCreated
         * @type Boolean
         */
        this._paginationCreated = false;

        /**
         * Page currently showed.
         * @private
         * @name ch.Carousel#currentPage
         * @type Number
         */
        this._currentPage = 1;

        /**
         * Total amount of pages. Data updated in each redraw.
         * @private
         * @name ch.Carousel#pages
         * @type Number
         */
        this._pages = 0;

        /**
         * Distance needed to move ONLY ONE page. Data updated in each redraw.
         * @private
         * @name ch.Carousel#pageWidth
         * @type Number
         */
        this._pageWidth = 0;

        /**
         * Interval used to animate the component autamatically.
         * @private
         * @name ch.Carousel#timer
         * @type Object
         */
        this._timer = null;

        /**
         *
         */
        this._delay = 3000;

        /**
         * List of items that should be loaded asynchronously on page movement.
         * @private
         * @name ch.Carousel#queue
         * @type Array
         */
        this._queue = (function () {

            var asyncData = that._options.asyncData,
                queue = [],
                i;

            // No queue
            if (asyncData === undefined) { return []; }

            i = asyncData.length;

            // Clean the user's asyncData to not contain 'undefined'
            while (i) {
                if (asyncData[i -= 1] !== undefined) {
                    queue.unshift(asyncData[i]);
                }
            }

            return queue;
        }());

        /**
         * DOM element of arrow that moves the Carousel to the previous page.
         * @private
         * @name ch.Carousel#$prevArrow
         * @type jQuery Object
         */
        this._$prevArrow = $('<div class="ch-carousel-prev ch-carousel-disabled" role="button" aria-hidden="true">').on(pointertap, function () { that.prev(); });

        /**
         * DOM element of arrow that moves the Carousel to the next page.
         * @private
         * @name ch.Carousel#$nextArrow
         * @type jQuery Object
         */
        that._$nextArrow = $('<div class="ch-carousel-next" role="button" aria-hidden="false">').on(pointertap, function () { that.next(); });

        /**
         * HTML Element that contains all thumbnails for pagination.
         * @private
         * @name ch.Carousel#$pagination
         * @jQuery Object
         */
        this._$pagination = $('<div class="ch-carousel-pages" role="navigation">').on(pointertap, function (event) {
            // Get the page from the element
            var page = event.target.getAttribute('data-page');
            // Allow interactions from a valid page of pagination
            if (page !== null) { that._goToPage(page); }
        });

        // Width by configuration
        if (this._options.width !== undefined) {
            this.$el.css('width', this._options.width);
        } else {
            ch.viewport.on('resize', function () { that.redraw(); });
        }

        // Set initial width of the list, to make space to all items
        //this._$list.css('width', this._itemOuterWidth * (this._$items.length + this._queue.length));
        // Wrap the list with mask and change overflow to translate that feature to mask
        this.$el.wrapInner(this._$mask).css('overflow', 'hidden');
        // TODO: Get a better reference to rendered mask
        this._$mask = this.$el.children('.ch-carousel-mask');
        // Update the mask height with the list height
        // Do it here because before, items are stacked
        this._$mask.css('height', this._$list.outerHeight());

        // If efects aren't needed, avoid transition on list
        if (!this._options.fx) { this._$list.addClass('ch-carousel-nofx'); }
        // Position absolutelly the list when CSS transitions aren't supported
        if (!ch.support.transition) { this._$list.css({'position': 'absolute', 'left': '0'}); }

        // Allow to render the arrows over the mask or not
        this._arrowsFlow(this._options.arrows);
        // Trigger all recalculations to get the functionality measures
        this.redraw();
        // Analizes if next page needs to load items from queue and execute addItems() method
        this._loadAsyncItems();
        // Set WAI-ARIA properties to each item depending on the page in which these are
        this._updateARIA();

        // If there are a parameter specifying a pagination, add it
        if (this._options.pagination) { this._addPagination(); }

        // Put Carousel on specified page or at the beginning
        this._goToPage(this._options.page);
    };

    /**
     * Set WAI-ARIA properties to each item depending on the page in which these are.
     * @private
     * @name ch.Carousel#updateARIA
     * @function
     */
    Carousel.prototype._updateARIA = function () {

        var that = this,
            // Amount of items when ARIA is updated
            total = this._$items.length + this._queue.length;
        // Update ARIA properties on all items
        this._$items.each(function (i, item) {
            // Update page where this item is in
            var page = Math.floor(i / that._itemsPerPage) + 1;
            // Update ARIA attributes
            $(item).attr({
                'aria-hidden': page !== that._currentPage,
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
    Carousel.prototype._addItems = function (amount) {

        var that = this,
            // Take the sample from queue
            sample = that._queue.splice(0, amount),
            // Function with content processing using asyncRender or not
            hasTemplate = (that._options.asyncRender !== undefined),
            // Index
            i = 0;

        // Replace sample items with Carousel item template)
        for (i; i < amount; i += 1) {
            // Replace sample item
            // Add the same margin than all siblings items
            // Add content (executing a template, if user specify it) and close the tag
            sample[i] = [
                '<li',
                ' class="ch-carousel-item"',
                ' style="width:' + (that._itemWidth + that._itemExtraWidth) + 'px;margin-right:' + that._itemMargin + 'px"',
                '>' + (hasTemplate ? that._options.asyncRender(sample[i]) : sample[i]) + '</li>'
            ].join('');
        }

        // Add sample items to the list
        that._$list.append(sample.join(''));
        // Update items collection
        that._$items = that._$list.children();
        /**
         * Triggers when component adds items asynchronously from queue.
         * @name ch.Carousel#itemsAdded
         * @event
         * @public
         * @exampleDescription Using a callback when Carousel add items asynchronously.
         * @example
         * example.on("itemsAdded", function () {
         *    alert("Some asynchronous items was added.");
         * });
         */
        that.emit('itemsAdded');
    };

    /**
     * Analizes if next page needs to load items from queue and execute addItems() method.
     * @private
     * @name ch.Carousel#loadAsyncItems
     * @function
     */
    Carousel.prototype._loadAsyncItems = function () {
        // Load only when there are items in queue
        if (this._queue.length === 0) { return; }

        // Amount of items from the beginning to current page
        var total = this._currentPage * this._itemsPerPage,
        // How many items needs to add to items rendered to complete to this page
            amount = total - this._$items.length;

        // Load only when there are items to add
        if (amount < 1) { return; }

        // If next page needs less items than it support, then add that amount
        amount = (this._queue.length < amount) ? this._queue.length : amount;
        // Add these
        this._addItems(amount);
    };

    /**
     * Create the pagination on DOM and change the flag "paginationCreated".
     * @private
     * @name ch.Carousel#addPagination
     * @function
     */
    Carousel.prototype._addPagination = function () {

        var that = this,
            // Collection of thumbnails strings
            thumbs = [],
            // Index
            i = 1,
            j = that._pages + 1,
            isCurrentPage;

        // Generate a thumbnail for each page on Carousel
        for (i, j; i < j; i += 1) {
            // Determine if this thumbnail is selected or not
            isCurrentPage = (i === that._currentPage);
            // Add string to collection
            thumbs.push(
                // Tag opening with ARIA role
                '<span role="button"',
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
        that._$pagination.html(thumbs.join('')).appendTo(that.$el);
        // Avoid selection on the pagination
        ch.util.avoidTextSelection(that._$pagination);
        // Check pagination as created
        that._paginationCreated = true;
    };

    /**
     * Delete pagination from DOM and change the flag "paginationCreated".
     * @private
     * @name ch.Carousel#removePagination
     * @function
     */
    Carousel.prototype._removePagination = function () {
        // Avoid to change something that not exists
        if (!this._paginationCreated) { return; }
        // Delete thumbnails
        this._$pagination[0].innerHTML = '';
        // Check pagination as deleted
        this._paginationCreated = false;
    };

    /**
     * Executed when total amount of pages change, this redraw the thumbnails.
     * @private
     * @name ch.Carousel#updatePagination
     * @function
     */
    Carousel.prototype._updatePagination = function () {
        // Avoid to change something that not exists
        if (!this._paginationCreated) { return; }
        // Delete thumbnails
        this._removePagination();
        // Generate thumbnails
        this._addPagination();
    };

    /**
     * Calculates and set the size of items and its margin to get an adaptive Carousel.
     * @private
     * @name ch.Carousel#updateDistribution
     * @function
     */
    Carousel.prototype._updateDistribution = function () {

        var that = this,
            // Grabs if there are MORE THAN ONE item in a page or just one
            moreThanOne = this._itemsPerPage > 1,
            // Total space to use as margin into mask
            // It's the difference between mask width and total width of all items
            freeSpace = this._maskWidth - (this._itemOuterWidth * this._itemsPerPage),
            // Width to add to each item to get responsivity
            // When there are more than one item, get extra width for each one
            // When there are only one item, extraWidth must be just the freeSpace
            extraWidth = moreThanOne ? Math.ceil(freeSpace / this._itemsPerPage / 2) : Math.ceil(freeSpace),
            // Amount of spaces to distribute the free space
            spaces,
            // The new width calculated from current width plus extraWidth
            width;

        // Update ONLY IF margin changed from last redraw
        if (this._itemExtraWidth === extraWidth) { return; }

        // When there are 6 items on a page, there are 5 spaces between them
        // Except when there are only one page that NO exist spaces
        spaces = moreThanOne ? this._itemsPerPage - 1 : 0;
        // The new width calculated from current width plus extraWidth
        width = this._itemWidth + extraWidth;

        // Update global value of width
        this._itemExtraWidth = extraWidth;
        // Free space for each space between items
        // Ceil to delete float numbers (not Floor, because next page is seen)
        // There is no margin when there are only one item in a page
        // Update global values
        this._itemMargin = moreThanOne ? Math.ceil(freeSpace / spaces / 2) : 0;
        // Update distance needed to move ONLY ONE page
        // The width of all items on a page, plus the width of all margins of items
        this._pageWidth = (this._itemOuterWidth + extraWidth + this._itemMargin) * this._itemsPerPage;

        // Update the list width
        // Delete efects on list to change width instantly
        // Do it before item resizing to make space to all items
        if (this._$list.outerWidth() <= this._pageWidth) {
            this._$list.addClass('ch-carousel-nofx').css('width', this._pageWidth * this._pages);
        }

        // Restore efects to list if it's required
        // Use a setTimeout to be sure to do this after width change
        if (this._options.fx) {
            setTimeout(function () { that._$list.removeClass('ch-carousel-nofx'); }, 0);
        }

        // Update element styles
        // Get the height using new width and relation between width and height of item (ratio)
        this._$items.css({
            'width': width,
            'height': (width * this._itemHeight) / this._itemWidth,
            'margin-right': this._itemMargin
        });

        // Update the mask height with the list height
        this._$mask.css('height', this._$list.outerHeight());
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

        var that = this,
            totalPages;

        // Avoid wrong calculations going to first page
        this._goToPage(1);
        /**
         * Since 0.10.6: Triggers when component redraws.
         * @name ch.Carousel#redraw
         * @event
         * @public
         * @since 0.10.6
         * @exampleDescription Using a callback when Carousel trigger a new redraw.
         * @example
         * example.on("redraw", function () {
         *    alert("Carousel was redrawn!");
         * });
         */
        this.emit('draw');
        // Update the width of the mask
        this._maskWidth = this._$mask.outerWidth();
        /**
         * (Since 0.7.4) Amount of items in only one page. Updated in each redraw.
         * @private
         * @name ch.Carousel#itemsPerPage
         * @type Number
         * @since 0.7.4
         */
        // Update amount of items into a single page (from conf or auto calculations)
        this._itemsPerPage = (function () {
            // The width of each item into the width of the mask
            var i = Math.floor(that._maskWidth / that._itemOuterWidth);
            // Avoid zero items in a page
            if (i === 0) { return 1; }
            // Limit amount of items when user set a maxItems amount
            if (that._options.maxItems !== undefined && i > that._options.maxItems) {
                return that._options.maxItems;
            }
            // Default calculation
            return i;
        }());

        // Update amount of total pages
        // The ratio between total amount of items and items in each page
        totalPages = Math.ceil((this._$items.length + this._queue.length) / this._itemsPerPage);

        // Update only if pages amount changed from last redraw
        if (this._pages !== totalPages) {
            // Update value
            this._pages = totalPages;
            // Set WAI-ARIA properties to each item
            this._updateARIA();
            // Update arrows (when pages === 1, there is no arrows)
            this._updateArrows();
            // Update pagination
            this._updatePagination();
        }

        // Update the margin between items and its size
        this._updateDistribution();
    };

    /**
     * Add arrows to DOM, bind these event and change the flag 'arrowsCreated'.
     * @private
     * @name ch.Carousel#addArrows
     * @function
     */
    Carousel.prototype._addArrows = function () {
        // Check arrows existency
        if (this._arrowsCreated) { return; }
        // Add arrows to DOM
        this.$el.prepend(this._$prevArrow).append(this._$nextArrow);
        // Avoid selection on the arrows
        ch.util.avoidTextSelection(this._$prevArrow, this._$nextArrow);
        // Check arrows as created
        this._arrowsCreated = true;
    };

    /**
     * Delete arrows from DOM, unbind these event and change the flag 'arrowsCreated'.
     * @private
     * @name ch.Carousel#removeArrows
     * @function
     */
    Carousel.prototype._removeArrows = function () {
        // Check arrows existency
        if (!this._arrowsCreated) { return; }
        // Delete arrows only from DOM and keep in variables and unbind events too
        this._$prevArrow.detach();
        this._$nextArrow.detach();
        // Check arrows as deleted
        this._arrowsCreated = false;
    };

    /**
     * Allows to render the arrows over the mask or not.
     * @private
     * @name ch.Carousel#arrowsFlow
     * @function
     * @param {String || Boolean} config Defines the arrows behavior. It can be 'outside', 'over', 'none', true or false. By default it's 'outside'.
     */
    Carousel.prototype._arrowsFlow = function (config) {
        // Getter
        if (config === undefined) { return this._options.arrows; }

        // Setter
        this._options.arrows = config;

        switch (config) {
        // The arrows are on the sides of the mask
        case 'outside':
            // Add the adaptive class to mask
            this._$mask.addClass('ch-carousel-adaptive');
            // Append arrows if previously were deleted
            this._addArrows();
            break;
        // The arrows are over the mask
        case 'over':
        case true:
            // Remove the adaptive class to mask
            this._$mask.removeClass('ch-carousel-adaptive');
            // Append arrows if previously were deleted
            this._addArrows();
            break;
        // No arrows
        case 'none':
        case false:
            // Remove the adaptive class to mask
            this._$mask.removeClass('ch-carousel-adaptive');
            // Detach arrows from DOM and continue to remove adaptive class
            this._removeArrows();
            break;
        }
    };

    /**
     * Check for arrows behavior on first, last and middle pages, and update class name and ARIA values.
     * @private
     * @name ch.Carousel#updateArrows
     * @function
     */
    Carousel.prototype._updateArrows = function () {
        // Check arrows existency
        if (!this._arrowsCreated) { return; }
        // Case 1: Disable both arrows if there are ony one page
        if (this._pages === 1) {
            this._$prevArrow.attr('aria-hidden', 'true').addClass('ch-carousel-disabled');
            this._$nextArrow.attr('aria-hidden', 'true').addClass('ch-carousel-disabled');
        // Case 2: "Previous" arrow hidden on first page
        } else if (this._currentPage === 1) {
            this._$prevArrow.attr('aria-hidden', 'true').addClass('ch-carousel-disabled');
            this._$nextArrow.attr('aria-hidden', 'false').removeClass('ch-carousel-disabled');
        // Case 3: "Next" arrow hidden on last page
        } else if (this._currentPage === this._pages) {
            this._$prevArrow.attr('aria-hidden', 'false').removeClass('ch-carousel-disabled');
            this._$nextArrow.attr('aria-hidden', 'true').addClass('ch-carousel-disabled');
        // Case 4: Enable both arrows on Carousel's middle
        } else {
            this._$prevArrow.attr('aria-hidden', 'false').removeClass('ch-carousel-disabled');
            this._$nextArrow.attr('aria-hidden', 'false').removeClass('ch-carousel-disabled');
        }
    };

    /**
     * Moves the list corresponding to specified displacement.
     * @private
     * @name ch.Carousel#translate
     * @function
     * @param {Number} displacement Distance to move the list.
     */
    Carousel.prototype._translate = (function () {
        // CSS property written as string to use on CSS movement
        var transform = '-' + ch.util.VENDOR_PREFIX + '-transform';

        // Use CSS transform to move
        if (ch.support.transition) {
            return function (displacement) {
                this._$list.css(transform, 'translateX(' + displacement + 'px)');
            };
        }

        // Use jQuery animate to move
        if (this._options.fx) {
            return function (displacement) {
                this._$list.animate({'left': displacement});
            };
        }

        // Use plain javascript to move
        return function (displacement) {
            this._$list.css('left', displacement);
        };
    }());

    /**
     * Updates the selected page on pagination.
     * @private
     * @name ch.Carousel#switchPagination
     * @function
     * @param {Number} from Page previously selected. It will be unselected.
     * @param {Number} to Page to be selected.
     */
    Carousel.prototype._switchPagination = function (from, to) {
        // Avoid to change something that not exists
        if (!this._paginationCreated) { return; }
        // Get all thumbnails of pagination element
        var children = this._$pagination.children();
        // Unselect the thumbnail previously selected
        children.eq(from - 1).attr('aria-selected', 'false').removeClass('ch-carousel-selected');
        // Select the new thumbnail
        children.eq(to - 1).attr('aria-selected', 'true').addClass('ch-carousel-selected');
    };

    /**
     * Updates all necessary data to move to a specified page.
     * @private
     * @name ch.Carousel#goToPage
     * @function
     * @param {Number || String} page Reference of page to go. It can be specified as number or "first" or "last" string.
     */
    Carousel.prototype._goToPage = function (page) {
        // Avoid to select the same page that is selected yet
        if (page === this._currentPage) {
            return;
        }
        // Set an error when the page is out of range
        if (page < 1 || page > this._pages || window.isNaN(page)) {
            throw new window.Error('Chico Carousel: Invalid parameter (' + page + ') received in _goToPage(). Provide a number between 1 and '  + this._pages + '.');
        }
        // Perform these tasks in the following order:
        // Task 1: Move the list!!!
        // Position from 0 (zero), to page to move (page number beginning in zero)
        this._translate(-this._pageWidth * (page - 1));
        // Task 2: Update selected thumbnail on pagination
        this._switchPagination(this._currentPage, page);
        // Task 3: Update value of current page
        this._currentPage = page;
        // Task 4: Check for arrows behavior on first, last and middle pages
        this._updateArrows();
        // Task 5: Get items from queue to the list, if it's necessary
        this._loadAsyncItems();
        // Task 6: Set WAI-ARIA properties to each item
        this._updateARIA();
        /*
         * Since 0.7.9: Triggers when component moves to next or previous page.
         * @name ch.Carousel#select
         * @event
         * @public
         * @since 0.7.9
         * @example
         * @exampleDescription Using a callback when Carousel moves to another page.
         * example.on("select", function () {
         *    alert("An item was selected!");
         * });
         */
        this.emit('select');
    };

    /**
     * Triggers when component moves to previous page.
     * @name ch.Carousel#prev
     * @event
     * @public
     * @exampleDescription Using a callback when Carousel moves to the previous page.
     * @example
     * example.on("prev", function () {
     *    alert("Previous!");
     * });
     */
    Carousel.prototype.prev = function () {
        this._goToPage(this._currentPage - 1);
        this.emit('prev');
    };

    /**
     * Triggers when component moves to next page.
     * @name ch.Carousel#next
     * @event
     * @public
     * @exampleDescription Using a callback when Carousel moves to the next page.
     * @example
     * example.on('next', function () {
     *    alert("Next!");
     * });
     */
    Carousel.prototype.next = function () {
        this._goToPage(this._currentPage + 1);
        this.emit('next');
    };

    /**
     * Animates the Carousel automatically. (Since 0.10.6)
     * @since 0.10.6
     * @function
     * @param {Number} t Delay of transition between pages, expressed in milliseconds.
     * @public
     * @name ch.Carousel#play
     * @returns Chico UI Object
     * @exampleDescription Start automatic animation.
     * @example
     * foo.play();
     * @exampleDescription Start automatic animation with a 5 seconds delay between pages.
     * @example
     * foo.play(5000);
     */
    Carousel.prototype.play = function (delay) {

        var that = this;

        // User timing over the default
        if (delay) { this._delay = delay; }

        // Clear the timer
        this.pause();

        // Set the interval on private property
        this._timer = setInterval(function () {
            // Normal behavior: Move to next page
            if (that._currentPage < that._pages) {
                that.next();
            // On last page: Move to first page
            } else {
                that._goToPage(1);
            }
        // Use the setted timing
        }, this._delay);
    };

    /**
     * Pause the Carousel automatic playing. (Since 0.10.6)
     * @since 0.10.6
     * @function
     * @public
     * @name ch.Carousel#pause
     * @returns Chico UI Object
     * @exampleDescription Pause automatic animation.
     * @example
     * foo.pause();
     */
    Carousel.prototype.pause = function () {
        window.clearInterval(this._timer);
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
        this._arrowsFlow(config);
        this.redraw();
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
        // Getter
        if (page === undefined) {
            return this._currentPage;
        }
        // Setter
        switch (page) {
        case 'first':
            this._goToPage(1);
            break;
        case 'last':
            this._goToPage(this._pages);
            break;
        default:
            this._goToPage(window.parseInt(page));
            break;
        }

        return this;
    };

    ch.factory(Carousel);

}(this, this.jQuery, this.ch));