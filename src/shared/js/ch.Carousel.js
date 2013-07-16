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
     * @param {Boolean} [options.pagination] Shows a pagination. By default, the value is false.
     * @param {Number} [options.async] Define the number of futures async items to add.
     * @param {Boolean} [options.fx] Enable or disable UI effects. By default, the effects are enabled.
     * @param {Number} [options.limitPerPage] (Since 0.10.6) Set the max amount of items to show in each page.
     * @param {Number} [options.initialPage] (Since 1.0) Initialize the Carousel in a specified page.
     * @returns itself
     * @exampleDescription Create a Carousel without configuration.
     * @example
     * var foo = $('#example').carousel();
     * @exampleDescription Create a Carousel with configuration parameters.
     * @example
     * var foo = $('#example').carousel({
     *     'pagination': true
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
        'async': 0,
        'arrows': true,
        'pagination': false,
        'initialPage': 1,
        'fx': true
    };

    Carousel.prototype.init = function ($el, options) {

        parent.init.call(this, $el, options);

        var that = this;

        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        /**
         * Element that moves across component (inside the mask).
         * @private
         * @name ch.Carousel#$list
         * @type jQuery Object
         */
        this._$list = this._$el.addClass('ch-carousel').children().addClass('ch-carousel-list');

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
        this._$mask = $('<div class="ch-carousel-mask" role="tabpanel">').html(this._$list).appendTo(this._$el);

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
        this._itemOuterWidth = ch.util.getOuterDimensions(this._$items[0]).width;

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
         * @name ch.Carousel#_async
         * @type Array
         */
        this._async = this._options.async;

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
            if (page !== null) { that.select(window.parseInt(page, 10)); }
        });

        ch.viewport.on('resize', function () { that.refresh(); });

        // If efects aren't needed, avoid transition on list
        if (!this._options.fx) { this._$list.addClass('ch-carousel-nofx'); }

        // Position absolutelly the list when CSS transitions aren't supported
        if (!ch.support.transition) { this._$list.css({'position': 'absolute', 'left': '0'}); }

        // If there are a parameter specifying a pagination, add it
        if (this._options.pagination !== undefined) { this._addPagination(); }

        // Allow to render the arrows
        if (this._options.arrows !== undefined && this._options.arrows !== false) { this._addArrows(); }

        // Trigger all calculations to get the functionality measures
        this._maskWidth = ch.util.getOuterDimensions(this._$mask[0]).width;

        // Set WAI-ARIA properties to each item depending on the page in which these are
        this._updateARIA();

        // Calculate items per page and calculate pages, only when the amount of items was changed
        this._updateLimitPerPage();

        // Update the margin between items and its size
        this._updateDistribution();

        // Put Carousel on specified page or at the beginning
        this.select(this._options.initialPage);
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
            total = this._$items.length + this._async,
            // Page where each item is in
            page;

        // Update ARIA properties on all items
        this._$items.each(function (i, item) {
            // Update page where this item is in
            page = Math.floor(i / that._limitPerPage) + 1;
            // Update ARIA attributes
            $(item).attr({
                'aria-hidden': (page !== that._currentPage),
                'aria-setsize': total,
                'aria-posinset': i + 1,
                'aria-label': 'page' + page
            });
        });
    };

    /**
     * Adds items when page/pages needs to load asynchronous items
     * @private
     * @name ch.Carousel#loadAsyncItems
     * @function
     */
    Carousel.prototype._loadAsyncItems = function () {

        // Load only when there are items to load
        if (this._async === 0) { return; }

        // Amount of items from the beginning to current page
        var total = this._currentPage * this._limitPerPage,
            // How many items needs to add to items rendered to complete to this page
            amount = total - this._$items.length,
            // Generic <LI> HTML Element to be added to the Carousel
            item = '<li class="ch-carousel-item" style="width:' + (this._itemWidth + this._itemExtraWidth) + 'px;margin-right:' + this._itemMargin + 'px"></li>',
            // It stores <LI> that will be added to the DOM collection
            items = '',
            // $ version of <LI> elements to give to the user
            $items;

        // Load only when there are items to add
        if (amount < 1) { return; }

        // If next page needs less items than it support, then add that amount
        amount = (this._async < amount) ? this._async : amount;

        // Add the necessary amount of items
        while (amount) {
            items += item;
            amount -= 1;
        }

        $items = $(items);

        // Add sample items to the list
        this._$list.append($items);

        // Update items collection
        this._$items = this._$list.children();

        // Update amount of items to add asynchronously
        this._async -= amount;

        /**
         * Triggers when component adds items asynchronously.
         * @name ch.Carousel#addeditems
         * @event
         * @public
         * @exampleDescription Using a callback when Carousel add items asynchronously.
         * @example
         * example.on("addeditems", function ($items) {
         *    alert("Some asynchronous items was added.");
         * });
         */
        this.emit('addeditems', $items);
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
        that._$pagination.html(thumbs.join('')).appendTo(that._$el);

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
    Carousel.prototype._updateLimitPerPage = function () {

        var max = this._options.limitPerPage,
            // Go to the current first item on the current page to restore if pages amount changes
            firstItemOnPage,
            // The width of each item into the width of the mask
            // Avoid zero items in a page
            limitPerPage = Math.floor(this._maskWidth / this._itemOuterWidth) || 1;

        // Limit amount of items when user set a limitPerPage amount
        if (max !== undefined && limitPerPage > max) { limitPerPage = max; }

        // Set data and calculate pages, only when the amount of items was changed
        if (limitPerPage === this._limitPerPage) { return; }

        // Restore if limitPerPage is NOT the same after calculations (go to the current first item page)
        firstItemOnPage = ((this._currentPage - 1) * this._limitPerPage) + 1;
        // Update amount of items into a single page (from conf or auto calculations)
        this._limitPerPage = limitPerPage;

        // Update the amount of total pages
        // The ratio between total amount of items and items in each page
        this._pages = Math.ceil((this._$items.length + this._async) / limitPerPage);

        // Add items to the list, if it's necessary
        this._loadAsyncItems();

        // Set WAI-ARIA properties to each item
        this._updateARIA();

        // Update arrows (when pages === 1, there is no arrows)
        this._updateArrows();

        // Update pagination
        this._updatePagination();

        // Go to the current first item page
        this.select(Math.ceil(firstItemOnPage / limitPerPage));
    };

    /**
     * Calculates and set the size of items and its margin to get an adaptive Carousel.
     * @private
     * @name ch.Carousel#updateDistribution
     * @function
     */
    Carousel.prototype._updateDistribution = function () {

        var moreThanOne = this._limitPerPage > 1,
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
        this._$mask[0].style.height = ch.util.getOuterDimensions(this._$items[0]).height;

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

        var maskWidth = ch.util.getOuterDimensions(this._$mask[0]).width;

        // Check for changes on the width of mask, for the elastic carousel
        if (maskWidth !== this._maskWidth) {
            // Update the width of the mask
            this._maskWidth = maskWidth;
            // Calculate items per page and calculate pages, only when the amount of items was changed
            this._updateLimitPerPage();
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
        // Avoid selection on the arrows
        ch.util.avoidTextSelection(this._$prevArrow, this._$nextArrow);
        // Add arrows to DOM
        this._$el.prepend(this._$prevArrow).append(this._$nextArrow);
        // Check arrows as created
        this._arrowsCreated = true;
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
     * @name ch.Carousel#select
     * @returns Chico UI Object
     * @param {Number || String} page Reference of page to go.
     * @since 1.0
     * @exampleDescription Go to second page.
     * @example
     * foo.select(2);
     * @exampleDescription Get the current page.
     * @example
     * foo.select();
     */
    Carousel.prototype.select = function (page) {

        if (page === undefined) {
            return this._currentPage;
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
        // Task 5: Add items to the list, if it's necessary
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
        this.select(this._currentPage - 1);
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
        this.select(this._currentPage + 1);
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
                that.select(1);
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
     * Destroys a Carousel instance.
     * @public
     * @function
     * @name ch.Carousel#destroy
     */
    Carousel.prototype.destroy = function () {

        this._el.parentNode.replaceChild(this._snippet, this._el);

        $(window.document).trigger(ch.onchangelayout);

        parent.destroy.call(this);
    };

    ch.factory(Carousel);

}(this, this.ch.$, this.ch));
