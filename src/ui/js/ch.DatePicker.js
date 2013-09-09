(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Datepicker lets you select dates.
     * @memberof ch
     * @constructor
     * @augments ch.Widget
     * @requires ch.Calendar
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.DatePicker.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.format] Sets the date format. By default is "DD/MM/YYYY".
     * @param {String} [options.selected] Sets a date that should be selected by default. By default is the date of today.
     * @param {String} [options.from] Set a minimum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @param {String} [options.to] Set a maximum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @param {Array} [options.monthsNames] By default is ["Enero", ... , "Diciembre"].
     * @param {Array} [options.weekdays] By default is ["Dom", ... , "Sab"].
     * @param {Boolean} [conf.hiddenby] To be defined. By default is "pointers".
     * @param {(jQuerySelector | ZeptoSelector)} [options.context] It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: left, right, top, bottom or center.
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: left, right, top, bottom or center.
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horitontally.
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically.
     * @param {String} [options.positioned] The positioned option specifies the type of positioning used. Its value can be: absolute or fixed.
     * @returns {datePicker} Returns a new instance of DatePicker.
     * @example
     * // Create a new DatePicker without options.
     * var datepicker = $(selector).datePicker();
     * @example
     * // Create a new DatePicker with some options.
     * var datepicker = $(selector).datePicker({
     *     "format": "MM/DD/YYYY",
     *     "selected": "2011/12/25",
     *     "from": "2010/12/25",
     *     "to": "2012/12/25",
     *     "monthsNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
     *     "weekdays": ["Su", "Mo", "Tu", "We", "Thu", "Fr", "Sa"]
     * });
     */
    function DatePicker($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        /**
         * Event emitted when the widget is ready to use.
         * @event ch.DatePicker#ready
         * @example
         * // Subscribe to "ready" event.
         * datePicker.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(DatePicker, ch.Widget),
        // Creates methods enable and disable into the prototype.
        methods = ['enable', 'disable'],
        len = methods.length;

    function createMethods(method) {
        DatePicker.prototype[method] = function () {

            this._popover[method]();

            parent[method].call(this);

            return this;
        };
    }

    /**
     * The name of the widget.
     * @type {String}
     */
    DatePicker.prototype.name = 'datePicker';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.DatePicker.prototype
     * @function
     */
    DatePicker.prototype.constructor = DatePicker;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    DatePicker.prototype._defaults = {
        'format': 'DD/MM/YYYY',
        'side': 'bottom',
        'align': 'center',
        'hiddenby': 'pointers'
    };

    /**
     * Initialize a new instance of DatePicker and merge custom options with defaults options.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @private
     * @returns {datepicker}
     */
    DatePicker.prototype._init = function ($el, options) {
        // Call to its parent init method
        parent._init.call(this, $el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * The datepicker input field.
         * @type {HTMLElement}
         */
        this.field = this._el;

        /**
         * The datepicker trigger.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$trigger = $('<i role="button" class="ch-datePicker-trigger ch-icon-calendar"></i>').insertAfter(this.field);

        /**
         * Reference to the Calendar component instanced.
         * @type {ch.Calendar}
         * @private
         */
        this._calendar = $('<div>').calendar(options);

        /**
         * Reference to the Popover component instanced.
         * @type {ch.Popover}
         * @private
         */
        this._popover = this.$trigger.popover({
            '_className': 'ch-datePicker ch-cone',
            '_ariaRole': 'tooltip',
            'content': this._calendar.$container,
            'side': this._options.side,
            'align': this._options.align,
            'offsetX': 1,
            'offsetY': 10,
            'shownby': 'pointertap',
            'hiddenby': this._options.hiddenby
        });

        this._popover._$content.on(ch.onpointertap, function (event) {
            var el = event.target;

            // Day selection
            if (el.nodeName === 'TD' && el.className.indexOf('ch-calendar-disabled') === -1 && el.className.indexOf('ch-calendar-other') === -1) {
                that.pick(el.innerHTML);
            }

        });

        this.field.setAttribute('aria-describedby', 'ch-' + this.name + '-' + this._popover.uid);

        // Change type of input to "text"
        this.field.type = 'text';

        // Change value of input if there are a selected date
        this.field.value = (this._options.selected) ? this._calendar.select() : this.field.value;

        // Hide popover
        this.on('disable', this.hide);

        return this;
    };

    /**
     * Shows the datepicker.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Shows a datepicker.
     * datepicker.show();
     */
    DatePicker.prototype.show = function () {

        if (!this._enabled) {
            return this;
        }

        this._popover.show();

        /**
         * Event emitted when a datepicker is shown.
         * @event ch.DatePicker#show
         * @example
         * // Subscribe to "show" event.
         * datepicker.on('show', function () {
         *     // Some code here!
         * });
         */
        this.emit('show');

        return this;
    };

    /**
     * Hides the datepicker.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Shows a datepicker.
     * datepicker.hide();
     */
    DatePicker.prototype.hide = function () {
        this._popover.hide();

        /**
         * Event emitted when a datepicker is hidden.
         * @event ch.DatePicker#hide
         * @example
         * // Subscribe to "hide" event.
         * datepicker.on('hide', function () {
         *     // Some code here!
         * });
         */
        this.emit('hide');

        return this;
    };

    /**
     * Selects a specific day into current month and year.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @private
     * @param {(String | Number)} day A given day to select.
     * @returns {datepicker}
     * @example
     * // Select a specific day.
     * datepicker.pick(28);
     */
    DatePicker.prototype.pick = function (day) {

        // Select the day and update input value with selected date
        this.field.value = [this._calendar._dates.current.year, this._calendar._dates.current.month, day].join('/');

        // Hide float
        this._popover.hide();

        // Select a date
        this.select(this.field.value);

        return this;
    };

    /**
     * Selects a specific date or returns the selected date.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @param {String} [date] A given date to select. The format of the given date should be "YYYY/MM/DD".
     * @return {(datepicker | String)}
     * @example
     * // Returns the selected date.
     * datepicker.select();
     * @example
     * // Select a specific date.
     * datepicker.select('2014/05/28');
     */
    DatePicker.prototype.select = function (date) {

       // Setter
       // Select the day and update input value with selected date
        if (date) {
            this._calendar.select(date);
            this.field.value = this._calendar.select();

            /**
             * Event emitted when a date is selected.
             * @event ch.DatePicker#select
             * @example
             * // Subscribe to "select" event.
             * datepicker.on('select', function () {
             *     // Some code here!
             * });
             */
            this.emit('select');

            return this;
        }

        // Getter
        return this._calendar.select();
    };

    /**
     * Returns date of today
     * @memberof! ch.DatePicker.prototype
     * @function
     * @returns {String} The date of today
     * @example
     * // Get the date of today.
     * var today = datepicker.getToday();
     */
    DatePicker.prototype.getToday = function () {
        return this._calendar.getToday();
    };

    /**
     * Moves to the next month.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Moves to the next month.
     * datepicker.nextMonth();
     */
    DatePicker.prototype.nextMonth = function () {
        this._calendar.nextMonth();

        /**
         * Event emitted when a next month is shown.
         * @event ch.DatePicker#nextmonth
         * @example
         * // Subscribe to "nextmonth" event.
         * datepicker.on('nextmonth', function () {
         *     // Some code here!
         * });
         */
        this.emit('nextmonth');

        return this;
    };

    /**
     * Move to the previous month.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Moves to the prev month.
     * datepicker.prevMonth();
     */
    DatePicker.prototype.prevMonth = function () {

        this._calendar.prevMonth();

        /**
         * Event emitted when a previous month is shown.
         * @event ch.DatePicker#prevmonth
         * @example
         * // Subscribe to "prevmonth" event.
         * datepicker.on('prevmonth', function () {
         *     // Some code here!
         * });
         */
        this.emit('prevmonth');

        return this;
    };

    /**
     * Move to the next year.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Moves to the next year.
     * datepicker.nextYear();
     */
    DatePicker.prototype.nextYear = function () {

        this._calendar.nextYear();

        /**
         * Event emitted when a next year is shown.
         * @event ch.DatePicker#nextyear
         * @example
         * // Subscribe to "nextyear" event.
         * datepicker.on('nextyear', function () {
         *     // Some code here!
         * });
         */
        this.emit('nextyear');

        return this;
    };

    /**
     * Move to the previous year.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Moves to the prev year.
     * datepicker.prevYear();
     */
    DatePicker.prototype.prevYear = function () {

        this._calendar.prevYear();

        /**
         * Event emitted when a previous year is shown.
         * @event ch.DatePicker#prevyear
         * @example
         * // Subscribe to "prevyear" event.
         * datepicker.on('prevyear', function () {
         *     // Some code here!
         * });
         */
        this.emit('prevyear');

        return this;
    };

    /**
     * Reset the DatePicker to date of today
     * @memberof! ch.DatePicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Resset the datepicker
     * datepicker.reset();
     */
    DatePicker.prototype.reset = function () {

        // Delete input value
        this.field.value = '';
        this._calendar.reset();

        /**
         * Event emitter when the datepicker is reseted.
         * @event ch.DatePicker#reset
         * @example
         * // Subscribe to "reset" event.
         * datepicker.on('reset', function () {
         *     // Some code here!
         * });
         */
        this.emit('reset');

        return this;
    };

    /**
     * Set a minimum selectable date.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @param {String} date A given date to set as minimum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @returns {datepicker}
     * @example
     * // Set a minimum selectable date.
     * datepicker.setFrom('2010/05/28');
     */
    DatePicker.prototype.setFrom = function (date) {
        this._calendar.setFrom(date);

        return this;
    };

    /**
     * Set a maximum selectable date.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @param {String} date A given date to set as maximum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @returns {datepicker}
     * @example
     * // Set a maximum selectable date.
     * datepicker.setTo('2014/05/28');
     */
    DatePicker.prototype.setTo = function (date) {
        this._calendar.setTo(date);

        return this;
    };

    /**
     * Enables an instance of DatePicker.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @returns {datepicker} Returns an instance of DatePicker.
     * @expample
     * // Enabling an instance of DatePicker.
     * datepicker.enable();
     */

    /**
     * Disables an instance of DatePicker.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @returns {datepicker} Returns an instance of DatePicker.
     * @expample
     * // Disabling an instance of DatePicker.
     * datepicker.disable();
     */
    while (len) {
        createMethods(methods[len -= 1]);
    }

    /**
     * Destroys a DatePicker instance.
     * @memberof! ch.DatePicker.prototype
     * @function
     * @expample
     * // Destroying an instance of DatePicker.
     * datepicker.destroy();
     */
    DatePicker.prototype.destroy = function () {

        this._popover.destroy();

        this.$trigger.remove();

        this._el.removeAttribute('aria-describedby');
        this._el.type = 'date';

        parent.destroy.call(this);
    };

    // Factorize
    ch.factory(DatePicker);

}(this, this.ch.$, this.ch));