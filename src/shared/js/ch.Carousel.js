(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Carousel is a large list of elements. Some elements will be shown in a preset area, and others will be hidden waiting for the user interaction to show it.
     * @memberof ch
     * @constructor
     * @augments ch.Widget
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Carousel.
     * @param {Object} [options] Options to customize an instance.
     * @param {Number} [options.async] Defines the number of future asynchronous items to add to the widget. By default, the async is 0.
     * @param {Boolean} [options.arrows] Defines if the arrow-buttons must be created or not at initialization. By default, the arrows will be created.
     * @param {Boolean} [options.pagination] Defines if a pagination must be created or not at initialization. By default, the pagination will not be created.
     * @param {Boolean} [options.fx] Enable or disable the slide effect. By default, the effects are enabled.
     * @param {Number} [options.limitPerPage] Set the maximum amount of items to show in each page.
     * @returns {carousel} Returns a new instance of ch.Carousel.
     * @example
     * // Create a new Carousel with defaults options.
     * var widget = $(selector).carousel();
     * @example
     * // Create a new Carousel with pagination enabled.
     * $(selector).carousel({
     *     'pagination': true
     * });
     * @example
     * // Create a new Carousel with fx disabled.
     * $(selector).carousel({
     *     'fx': false
     * });
     * @example
     * // Create a new Carousel with items asynchronously loaded.
     * $(selector).carousel({
     *     'async': 10
     * }).on('addeditems', function ($items) {
     *     // Inject content into the added <li> elements
     *     $.each($items, function (i, e) {
     *         e.innerHTML = 'Content into one of newly inserted <li> elements.';
     *     });
     * });
     */
    function Carousel($el, options) {
        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        this.init($el, options);

        /**
         * Emits the event 'ready' when the widget is ready to use.
         * @event ch.Carousel#ready
         * @example
         * // Subscribe to "ready" event.
         * carousel.on('ready', function () {
         *     this.select(3);
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    var pointertap = ch.onpointertap + '.carousel',
        Math = window.Math,
        setTimeout = window.setTimeout,
        // Inheritance
        parent = ch.util.inherits(Carousel, ch.Widget);

    /**
     * The name of the widget.
     * @type {String}
     */
    Carousel.prototype.name = 'carousel';

    /**
     * Returns a reference to the constructor function that created the instance.
     * @memberof! ch.Carousel.prototype
     * @function
     */
    Carousel.prototype.constructor = Carousel;

    /**
     * Configuration by default.
     * @private
     * @type {Object}
     */
    Carousel.prototype._defaults = {
        'async': 0,
        'arrows': true,
        'pagination': false,
        'fx': true
    };

    /**
     * Initialize a new instance of Carousel and merge custom options with defaults options.
     * @memberof! ch.Carousel.prototype
     * @function
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Carousel.
     * @param {Object} [options] Options to customize an instance.
     * @returns {carousel}
     */
    Carousel.prototype.init = function ($el, options) {
        // Call to its parents init method
        parent.init.call(this, $el, options);

        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        /**
         * The original and entire element and its state, before initialization.
         * @private
         * @type {HTMLDivElement}
         */
        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        /**
         * Element that moves (slides) across the widget (inside the mask).
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$list = this._$el.addClass('ch-carousel').children().addClass('ch-carousel-list');

        /**
         * Collection of each child of the slider list.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$items = this._$list.children().addClass('ch-carousel-item');

        /**
         * Element that wraps the list and denies its overflow.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$mask = $('<div class="ch-carousel-mask" role="tabpanel">').html(this._$list).appendTo(this._$el);

        /**
         * Size of the mask (width). Updated in each refresh.
         * @private
         * @type {Number}
         */
        this._maskWidth = ch.util.getOuterDimensions(this._$mask[0]).width;

        /**
         * The width of each item, including paddings, margins and borders. Ideal for make calculations.
         * @private
         * @type {Number}
         */
        this._itemWidth = this._$items.width();

        /**
         * The width of each item, without paddings, margins or borders. Ideal for manipulate CSS width property.
         * @private
         * @type {Number}
         */
        this._itemOuterWidth = ch.util.getOuterDimensions(this._$items[0]).width;

        /**
         * The size added to each item to make it elastic/responsive.
         * @private
         * @type {Number}
         */
        this._itemExtraWidth = 0;

        /**
         * The height of each item, including paddings, margins and borders. Ideal for make calculations.
         * @private
         * @type {Number}
         */
        this._itemHeight = this._$items.height();

        /**
         * The margin of all items. Updated in each refresh only if it's necessary.
         * @private
         * @type {Number}
         */
        this._itemMargin = 0;

        /**
         * Flag to control when arrows were created.
         * @private
         * @type {Boolean}
         */
        this._arrowsCreated = false;

        /**
         * Flag to control when pagination was created.
         * @private
         * @type {Boolean}
         */
        this._paginationCreated = false;

        /**
         * Amount of items in each page. Updated in each refresh.
         * @private
         * @type {Number}
         */
        this._limitPerPage = 0;

        /**
         * Page currently showed.
         * @private
         * @type {Number}
         */
        this._currentPage = 1;

        /**
         * Total amount of pages. Data updated in each refresh.
         * @private
         * @type {Number}
         */
        this._pages = 0;

        /**
         * Distance needed to move ONLY ONE PAGE. Data updated in each refresh.
         * @private
         * @type {Number}
         */
        this._pageWidth = 0;

        /**
         * List of items that should be loaded asynchronously on page movement.
         * @private
         * @type {Number}
         */
        this._async = this._options.async;

        /**
         * UI element of arrow that moves the Carousel to the previous page.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$prevArrow = $('<div class="ch-carousel-prev ch-carousel-disabled" role="button" aria-hidden="true">')
            .on(pointertap, function () { that.prev(); });

        /**
         * UI element of arrow that moves the Carousel to the next page.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        that._$nextArrow = $('<div class="ch-carousel-next" role="button" aria-hidden="false">')
            .on(pointertap, function () { that.next(); });

        /**
         * UI element that contains all the thumbnails for pagination.
         * @private
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this._$pagination = $('<div class="ch-carousel-pages" role="navigation">').on(pointertap, function (event) {
            // Get the page from the element
            var page = event.target.getAttribute('data-page');
            // Allow interactions from a valid page of pagination
            if (page !== null) { that.select(window.parseInt(page, 10)); }
        });

        // Refresh calculation when the viewport resizes
        ch.viewport.on('resize', function () { that.refresh(); });

        // If efects aren't needed, avoid transition on list
        if (!this._options.fx) { this._$list.addClass('ch-carousel-nofx'); }

        // Position absolutelly the list when CSS transitions aren't supported
        if (!ch.support.transition) { this._$list.css({'position': 'absolute', 'left': '0'}); }

        // If there are a parameter specifying a pagination, add it
        if (this._options.pagination !== undefined) { this._addPagination(); }

        // Allow to render the arrows
        if (this._options.arrows !== undefined && this._options.arrows !== false) { this._addArrows(); }

        // Set WAI-ARIA properties to each item depending on the page in which these are
        this._updateARIA();

        // Calculate items per page and calculate pages, only when the amount of items was changed
        this._updateLimitPerPage();

        // Update the margin between items and its size
        this._updateDistribution();
    };

    /**
     * Set accesibility properties to each item depending on the page in which these are.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._updateARIA = function () {
        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @type {Object}
         * @private
         */
        var that = this,
            // Amount of items when ARIA is updated
            total = this._$items.length + this._async,
            // Page where each item is in
            page;

        // Update WAI-ARIA properties on all items
        $.each(this._$items, function (i, item) {
            // Update page where this item is in
            page = Math.floor(i / that._limitPerPage) + 1;
            // Update ARIA attributes
            item.setAttribute('aria-hidden', (page !== that._currentPage));
            item.setAttribute('aria-setsize', total);
            item.setAttribute('aria-posinset', (i + 1));
            item.setAttribute('aria-label', 'page' + page);
        });
    };

    /**
     * Adds items when page/pages needs to load it asynchronously.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._loadAsyncItems = function () {

        // Load only when there are items to load
        if (this._async === 0) { return; }

        // Amount of items from the beginning to current page
        var total = this._currentPage * this._limitPerPage,
            // How many items needs to add to items rendered to complete to this page
            amount = total - this._$items.length,
            // The new width calculated from current width plus extraWidth
            width = (this._itemWidth + this._itemExtraWidth),
            // Get the height using new width and relation between width and height of item (ratio)
            height = (width * this._itemHeight) / this._itemWidth,
            // Generic <LI> HTML Element to be added to the Carousel
            item = [
                '<li',
                ' class="ch-carousel-item"',
                ' style="width:' + width + 'px;height:' + height + 'px;margin-right:' + this._itemMargin + 'px"',
                '></li>'
            ].join(''),
            // It stores <LI> that will be added to the DOM collection
            items = '',
            // Wrapped items
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

        // Wrap the string elements into jQuery/Zepto
        $items = $(items);

        // Add sample items to the list
        this._$list.append($items);

        // Update items collection
        this._$items = this._$list.children();

        // Update amount of items to add asynchronously
        this._async -= amount;

        /**
         * Emits the event 'addeditems' when the widget creates new asynchronous empty items.
         * @event ch.Carousel#addeditems
         * @example
         * // Create a new Carousel with items asynchronously loaded.
         * $(selector).carousel({
         *     'async': 10
         * }).on('addeditems', function ($items) {
         *     // Inject content into the added <li> elements
         *     $.each($items, function (i, e) {
         *         e.innerHTML = 'Content into one of newly inserted <li> elements.';
         *     });
         * });
         */
        this.emit('addeditems', $items);
    };

    /**
     * Creates the pagination of the widget.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._addPagination = function () {

        // Remove the current pagination if it's necessary to create again
        if (this._paginationCreated) {
            this._removePagination();
        }

        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @type {Object}
         * @private
         */
        var that = this,
            thumbs = [],
            page = that._pages,
            isSelected;

        // Generate a thumbnail for each page on Carousel
        while (page) {
            // Determine if this thumbnail is selected or not
            isSelected = (page === that._currentPage);
            // Add string to collection
            thumbs.unshift(
                '<span',
                ' role="button"',
                ' aria-selected="' + isSelected + '"',
                ' aria-controls="page' + page + '"',
                ' data-page="' + page + '"',
                ' class="' + (isSelected ? 'ch-carousel-selected' : '') + '"',
                '>' + page + '</span>'
            );

            page -= 1;
        }

        // Append thumbnails to pagination and append this to Carousel
        that._$pagination.html(thumbs.join('')).appendTo(that._$el);

        // Avoid selection on the pagination
        ch.util.avoidTextSelection(that._$pagination);

        // Check pagination as created
        that._paginationCreated = true;
    };

    /**
     * Deletes the pagination from the widget.
     * @memberof! ch.Carousel.prototype
     * @private
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
     * It stops the slide effect while the list moves.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     * @param {Function} callback A function to execute after disable the effects.
     */
    Carousel.prototype._standbyFX = function (callback) {

        /**
         * Reference to an internal widget instance, saves all the information and configuration properties.
         * @type {Object}
         * @private
         */
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
     * Calculates the correct items per page and calculate pages, only when the amount of items was changed.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
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
        this._addPagination();

        // Go to the current first item page
        this.select(Math.ceil(firstItemOnPage / limitPerPage));
    };

    /**
     * Calculates and set the size of the items and its margin to get an adaptive Carousel.
     * @memberof! ch.Carousel.prototype
     * @private
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

    /**
     * Adds arrows to the widget.
     * @memberof! ch.Carousel.prototype
     * @private
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
     * Set as disabled the arrows by adding a classname and a WAI-ARIA property.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     * @param {Boolean} prev Defines if the "previous" arrow must be disabled or not.
     * @param {Boolean} next Defines if the "next" arrow must be disabled or not.
     */
    Carousel.prototype._disableArrows = function (prev, next) {
        this._$prevArrow.attr('aria-disabled', prev)[prev ? 'addClass' : 'removeClass']('ch-carousel-disabled');
        this._$nextArrow.attr('aria-disabled', next)[next ? 'addClass' : 'removeClass']('ch-carousel-disabled');
    };

    /**
     * Check for arrows behavior on first, last and middle pages, and update class name and WAI-ARIA values.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._updateArrows = function () {
        // Check arrows existency
        if (!this._arrowsCreated) {
            return;
        }
        // Case 1: Disable both arrows if there are ony one page
        if (this._pages === 1) {
            this._disableArrows(true, true);
        // Case 2: "Previous" arrow hidden on first page
        } else if (this._currentPage === 1) {
            this._disableArrows(true, false);
        // Case 3: "Next" arrow hidden on last page
        } else if (this._currentPage === this._pages) {
            this._disableArrows(false, true);
        // Case 4: Enable both arrows on Carousel's middle
        } else {
            this._disableArrows(false, false);
        }
    };

    /**
     * Moves the list corresponding to specified displacement.
     * @memberof! ch.Carousel.prototype
     * @private
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
     * @memberof! ch.Carousel.prototype
     * @private
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
        children.eq(from - 1).attr('aria-selected', false).removeClass('ch-carousel-selected');
        // Select the new thumbnail
        children.eq(to - 1).attr('aria-selected', true).addClass('ch-carousel-selected');
    };

    /**
     * Triggers all the necessary recalculations to be up-to-date.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
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
             * Emits the event 'refresh' when the widget triggers all the necessary recalculations to be up-to-date.
             * @event ch.Carousel#refresh
             * @example
             * carousel.on('refresh', function () {
             *     alert('Carousel was refreshed.');
             * });
             */
            this.emit('refresh');
        }

        return this;
    };

    /**
     * Moves the list to the specified page.
     * @memberof! ch.Carousel.prototype
     * @function
     * @param {Number} page Reference of page where the list has to move.
     * @returns {carousel}
     */
    Carousel.prototype.select = function (page) {
        // Getter
        if (page === undefined) {
            return this._currentPage;
        }

        // Avoid to move if it's disabled
        // Avoid to select the same page that is selected yet
        // Avoid to move beyond first and last pages
        if (!this._enabled || page === this._currentPage || page < 1 || page > this._pages) {
            return this;
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

        /**
         * Emits the event 'select' when the widget moves to another page.
         * @event ch.Carousel#select
         * @example
         * carousel.on('select', function () {
         *     alert('Carousel has moved.');
         * });
         */
        this.emit('select');

        return this;
    };

    /**
     * Moves the list to the previous page.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.prev = function () {

        this.select(this._currentPage - 1);

        /**
         * Emits the event 'prev' when the widget moves to the previous page.
         * @event ch.Carousel#prev
         * @example
         * carousel.on('prev', function () {
         *     alert('Carousel has moved to the previous page.');
         * });
         */
        this.emit('prev');

        return this;
    };

    /**
     * Moves the list to the next page.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.next = function () {

        this.select(this._currentPage + 1);

        /**
         * Emits the event 'next' when the widget moves to the next page.
         * @event ch.Carousel#next
         * @example
         * carousel.on('next', function () {
         *     alert('Carousel has moved to the next page.');
         * });
         */
        this.emit('next');

        return this;
    };

    /**
     * Enables a Carousel instance.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.enable = function () {

        this._el.setAttribute('aria-disabled', false);

        this._disableArrows(false, false);

        parent.enable.call(this);

        return this;
    };

    /**
     * Disables a Carousel instance.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.disable = function () {

        this._el.setAttribute('aria-disabled', true);

        this._disableArrows(true, true);

        parent.disable.call(this);

        return this;
    };

    /**
     * Destroys a Carousel instance.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.destroy = function () {

        this._el.parentNode.replaceChild(this._snippet, this._el);

        $(window.document).trigger(ch.onchangelayout);

        parent.destroy.call(this);

        return this;
    };

    ch.factory(Carousel);

}(this, this.ch.$, this.ch));
