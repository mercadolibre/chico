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
     * @param {Number} [options.initialPage] (Since 0.10.6) Initialize the Carousel in a specified page.
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
    var pointertap = ch.onpointertap + '.carousel',
        Math = window.Math,
        setTimeout = window.setTimeout,
        setInterval = window.setInterval,
        parent = ch.util.inherits(Carousel, ch.Widget);

    Carousel.prototype.name = 'carousel';

    Carousel.prototype.constructor = Carousel;

    Carousel.prototype._defaults = {
        'pagination': false,
        'arrows': 'outside',
        'initialPage': 1,
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
        // Use .html().appendTo() instead wrapInner() to keep the reference to the mask element
        this._$mask = $('<div class="ch-carousel-mask" role="tabpanel" style="height:' + this._$items.outerHeight() + 'px">')
            .html(this._$list)
            .appendTo(this.$el);

        /**
         * Size of the mask. Updated in each refresh.
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
         * The margin of all items. Updated in each refresh only if it's necessary.
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
         * (Since 0.7.4) Amount of items in only one page. Updated in each refresh.
         * @private
         * @name ch.Carousel#_limitPerPage
         * @type Number
         * @since 0.7.4
         */
        this._limitPerPage = 0;

        /**
         * Page currently showed.
         * @private
         * @name ch.Carousel#currentPage
         * @type Number
         */
        this._currentPage = 1;

        /**
         * Total amount of pages. Data updated in each refresh.
         * @private
         * @name ch.Carousel#pages
         * @type Number
         */
        this._pages = 0;

        /**
         * Distance needed to move ONLY ONE page. Data updated in each refresh.
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
            // No queue
            if (that._options.asyncData === undefined) { return []; }

            var asyncData = that._options.asyncData,
                i = asyncData.length,
                queue = [];

            // Clean the user's asyncData to not contain undefined elements
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
        this._$prevArrow = $('<div class="ch-carousel-prev ch-carousel-disabled" role="button" aria-hidden="true">')
            .on(pointertap, function () { that.prev(); });

        /**
         * DOM element of arrow that moves the Carousel to the next page.
         * @private
         * @name ch.Carousel#$nextArrow
         * @type jQuery Object
         */
        that._$nextArrow = $('<div class="ch-carousel-next" role="button" aria-hidden="false">')
            .on(pointertap, function () { that.next(); });

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
            if (page !== null) { that.goTo(window.parseInt(page, 10)); }
        });

        // Width by configuration
        if (this._options.width !== undefined) {
            this.$el.css('width', this._options.width);
        } else {
            ch.viewport.on('resize', function () { that.refresh(); });
        }

        // If efects aren't needed, avoid transition on list
        if (!this._options.fx) { this._$list.addClass('ch-carousel-nofx'); }
        // Position absolutelly the list when CSS transitions aren't supported
        if (!ch.support.transition) { this._$list.css({'position': 'absolute', 'left': '0'}); }
        // If there are a parameter specifying a pagination, add it
        if (this._options.pagination !== undefined) { this._addPagination(); }

        // Allow to render the arrows over the mask or not
        this._arrowsFlow(this._options.arrows);

        // Trigger all calculations to get the functionality measures
        this._maskWidth = this._$mask.outerWidth();
        // Analizes if next page needs to load items from queue and execute addItems() method
        this._loadAsyncItems();
        // Set WAI-ARIA properties to each item depending on the page in which these are
        this._updateARIA();
        // Calculate items per page and calculate pages, only when the amount of items was changed
        this._updateItemsPerPage();
        // Update the margin between items and its size
        this._updateDistribution();

        // Put Carousel on specified page or at the beginning
        this.goTo(this._options.initialPage);
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
            var page = Math.floor(i / that._limitPerPage) + 1;
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
        that.emit('itemsdone');
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
        var total = this._currentPage * this._limitPerPage,
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
                '>' + i + '</span>'
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
     * Executed when total amount of pages change, this refresh the thumbnails.
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

    Carousel.prototype._standbyFX = function (callback) {

        var that = this;

        // Do it if is required
        if (this._options.fx) {
            // Delete efects on list to make changes instantly
            this._$list.addClass('ch-carousel-nofx');
            // Execute the custom method
            callback.call(this);
            // Restore efects to list
            // Use a setTimeout to be sure to do this AFTER changes
            setTimeout(function () { that._$list.removeClass('ch-carousel-nofx'); }, 0);

        // Avoid to add/remove classes if it hasn't effects
        } else {
            callback.call(this);
        }
    };


    /**
     *
     *
     */
    Carousel.prototype._updateItemsPerPage = function () {

        var max = this._options.maxItems,
            // Go to the current first item on the current page to restore if pages amount changes
            firstItemOnPage,
            // The width of each item into the width of the mask
            // Avoid zero items in a page
            itemsPerPage = Math.floor(this._maskWidth / this._itemOuterWidth) || 1;

        // Limit amount of items when user set a maxItems amount
        if (max !== undefined && itemsPerPage > max) { itemsPerPage = max; }

        // Set data and calculate pages, only when the amount of items was changed
        if (itemsPerPage === this._limitPerPage) { return; }

        // Restore if itemsPerPage is NOT the same after calculations (go to the current first item page)
        firstItemOnPage = ((this._currentPage - 1) * this._limitPerPage) + 1;
        // Update amount of items into a single page (from conf or auto calculations)
        this._limitPerPage = itemsPerPage;

        // Update the amount of total pages
        // The ratio between total amount of items and items in each page
        this._pages = Math.ceil((this._$items.length + this._queue.length) / itemsPerPage);

        // Set WAI-ARIA properties to each item
        this._updateARIA();
        // Update arrows (when pages === 1, there is no arrows)
        this._updateArrows();
        // Update pagination
        this._updatePagination();
        // Go to the current first item page
        this.goTo(Math.ceil(firstItemOnPage / itemsPerPage));
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
            moreThanOne = this._limitPerPage > 1,
            // Total space to use as margin into mask
            // It's the difference between mask width and total width of all items
            freeSpace = this._maskWidth - (this._itemOuterWidth * this._limitPerPage),
            // Width to add to each item to get responsivity
            // When there are more than one item, get extra width for each one
            // When there are only one item, extraWidth must be just the freeSpace
            extraWidth = moreThanOne ? Math.ceil(freeSpace / this._limitPerPage / 2) : Math.ceil(freeSpace),
            // Amount of spaces to distribute the free space
            spaces,
            // The new width calculated from current width plus extraWidth
            width;

        // Update ONLY IF margin changed from last refresh
        // If *new* and *old* extra width are 0, continue too
        if (extraWidth === this._itemExtraWidth && extraWidth > 0) { return; }

        // Update global value of width
        this._itemExtraWidth = extraWidth;

        // When there are 6 items on a page, there are 5 spaces between them
        // Except when there are only one page that NO exist spaces
        spaces = moreThanOne ? this._limitPerPage - 1 : 0;
        // The new width calculated from current width plus extraWidth
        width = this._itemWidth + extraWidth;

        // Free space for each space between items
        // Ceil to delete float numbers (not Floor, because next page is seen)
        // There is no margin when there are only one item in a page
        // Update global values
        this._itemMargin = moreThanOne ? Math.ceil(freeSpace / spaces / 2) : 0;
        // Update distance needed to move ONLY ONE page
        // The width of all items on a page, plus the width of all margins of items
        this._pageWidth = (this._itemOuterWidth + extraWidth + this._itemMargin) * this._limitPerPage;

        // Update the list width
        // Do it before item resizing to make space to all items
        // Delete efects on list to change width instantly
        this._standbyFX(function () {
            this._$list.css('width', this._pageWidth * this._pages);
        });

        // Update element styles
        // Get the height using new width and relation between width and height of item (ratio)
        this._$items.css({
            'width': width,
            'height': (width * this._itemHeight) / this._itemWidth,
            'margin-right': this._itemMargin
        });

        // Update the mask height with the list height
        this._$mask.css('height', this._$list.outerHeight());

        // Suit the page in place
        this._standbyFX(function () {
            this._translate(-this._pageWidth * (this._currentPage - 1));
        });
    };

    /*
     * Trigger all recalculations to get the functionality measures.
     * @public
     * @function
     * @name ch.Carousel#refresh
     * @returns Chico UI Object
     * @exampleDescription Refresh the Carousel.
     * @example
     * foo.refresh();
     */
    Carousel.prototype.refresh = function () {

        var maskWidth = this._$mask.outerWidth();

        // Check for changes on the width of mask, for the elastic carousel
        if (maskWidth !== this._maskWidth) {
            // Update the width of the mask
            this._maskWidth = maskWidth;
            // Calculate items per page and calculate pages, only when the amount of items was changed
            this._updateItemsPerPage();
            // Update the margin between items and its size
            this._updateDistribution();
            /**
             * Since 0.10.6: Triggers when component refreshs.
             * @name ch.Carousel#refresh
             * @event
             * @public
             * @since 0.10.6
             * @exampleDescription Using a callback when Carousel trigger a new refresh.
             * @example
             * example.on("refresh", function () {
             *    alert("Carousel was refreshed!");
             * });
             */
            this.emit('refresh');
        }

        return this;
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

        // Use JS to move
        // Ask for fx INTO the method because the "fx" is an instance property
        return function (displacement) {
            this._$list[(this._options.fx) ? 'animate' : 'css']({'left': displacement});
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
     *
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
    Carousel.prototype.goTo = function (page) {
        // Set an error when the page is out of range
        if (window.isNaN(page)) {
            throw new window.Error('Chico Carousel: Invalid parameter (' + page + ') received in goTo(). Provide a Number between 1 and ' + this._pages + '.');
        }
        // Avoid to select the same page that is selected yet
        if (page === this._currentPage || page < 1 || page > this._pages) {
            return;
        }
        // Perform these tasks in the following order:
        // Task 1: Move the list from 0 (zero), to page to move (page number beginning in zero)
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

        return this;
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
        this.goTo(this._currentPage - 1);
        this.emit('prev');
        return this;
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
        this.goTo(this._currentPage + 1);
        this.emit('next');
        return this;
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
                that.goTo(1);
            }
        // Use the setted timing
        }, this._delay);

        return this;
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
        return this;
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
        this.refresh();
        return this;
    };

    ch.factory(Carousel);

}(this, this.ch.$, this.ch));
