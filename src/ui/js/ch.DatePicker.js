(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Datepicker lets you select dates.
     * @name DatePicker
     * @class DatePicker
     * @augments ch.Controls
     * @requires ch.Calendar
     * @see ch.Controls
     * @see ch.Calendar
     * @memberOf ch
     * @param {Object} [conf] Object with configuration properties.
     * @param {String} [conf.format] Sets the date format. By default is "DD/MM/YYYY".
     * @param {String} [conf.selected] Sets a date that should be selected by default. By default is the date of today.
     * @param {String} [conf.from] Set a maximum selectable date.
     * @param {String} [conf.to] Set a minimum selectable date.
     * @param {String} [conf.points] Points to be positioned. See Positioner component. By default is "ct cb".
     * @param {Array} [conf.monthsNames] By default is ["Enero", ... , "Diciembre"].
     * @param {Array} [conf.weekdays] By default is ["Dom", ... , "Sab"].
     * @param {Boolean} [conf.closable] Defines if floated component will be closed when a date is selected or not. By default it's "true".
     * @returns itself
     * @factorized
     * @exampleDescription Create a new datePicker.
     * @example
     * var widget = $(".example").datePicker();
     * @exampleDescription Create a new Date Picker with configuration.
     * @example
     * var widget = $(".example").datePicker({
     *    "format": "MM/DD/YYYY",
     *    "selected": "2011/12/25",
     *    "from": "2010/12/25",
     *    "to": "2012/12/25",
     *    "monthsNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
     *    "weekdays": ["Su", "Mo", "Tu", "We", "Thu", "Fr", "Sa"]
     * });
     */
    function DatePicker($el, options) {

        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        this.init($el, options);

        /**
         * Triggers when the component is ready to use (Since 0.8.0).
         * @name ch.DatePicker#ready
         * @event
         * @public
         * @exampleDescription Following the first example, using <code>widget</code> as Date Picker's instance controller:
         * @example
         * widget.on("ready", function () {
         *   this.show();
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    /**
     *   Private Members
     */
    /**
     *   Inheritance
     */
    var parent = ch.util.inherits(DatePicker, ch.Widget),

    /**
     * Creates methods enable and disable into the prototype.
     */
        methods = ['enable', 'disable'],
        len = methods.length;

    function createMethods(method) {
        DatePicker.prototype[method] = function () {

            this._popover[method]();

            parent[method].call(this);

            return this;
        };
    }

    DatePicker.prototype.name = 'datePicker';

    DatePicker.prototype.constructor = DatePicker;

    DatePicker.prototype._defaults = {
        'format': 'DD/MM/YYYY',
        'side': 'bottom',
        'align': 'center',
        'close': 'pointers-only'
    };

    DatePicker.prototype.init = function ($el, options) {
        parent.init.call(this, $el, options);

        var that = this;

        this.$trigger = $('<i role="button" class="ch-datePicker-trigger ch-icon-calendar"></i>').insertAfter(this.el);

        /**
         * Reference to the Calendar component instance.
         * @protected
         * @type Object
         * @name ch.DatePicker#calendar
         */
        this._calendar = $('<div>').calendar(options);

        /**
         * Reference to the Float component instanced.
         * @protected
         * @type Object
         * @name ch.DatePicker#float
         */
        this._popover = this.$trigger.popover({
            'content': this._calendar.$el,
            'side': this._options.side,
            'align': this._options.align,
            'offsetX': -1,
            'offsetY': 8,
            'aria': {
                'role': 'tooltip'
            },
            '_className': 'ch-datePicker ch-cone',
            'open': 'click',
            'close': this._options.close
        });

        this._popover._$content.on(ch.events.pointer.TAP, function (event) {
            that._pick(event.target);
        });

        this.el.setAttribute('aria-describedby', 'ch-' + this.name + '-' + this._popover.uid);

        // Change type of input to "text"
        this.el.type = 'text';

        // Change value of input if there are a selected date
        this.el.value = (this._options.selected) ? this._calendar.select() : this.el.value;

        // Hide popover
        this.on('disable', this.hide);

        return this;
    };

    /**
     * Pick a date in the Calendar and updates the input data.
     * @protected
     * @function
     * @name ch.DatePicker#_pick
     */
    DatePicker.prototype._pick = function (target) {
        // Day selection
        if (target.nodeName !== 'TD' || target.className.indexOf('ch-calendar-disabled') !== -1 || target.className.indexOf('ch-calendar-other') !== -1) {
            return;
        }

        // Select the day and update input value with selected date

        this.el.value = this._calendar.selectDay(target.innerHTML);

        // Hide float
        if (this._options.close) {
            this._popover.hide();
        }

        /**
         * Callback function
         * @public
         * @name ch.DatePicker#select
         * @event
         */
        this.emit('select');
    };

    /**
     * Triggers the innerShow method and returns the public scope to keep method chaining.
     * @public
     * @name ch.DatePicker#show
     * @function
     * @returns itself
     * @exampleDescription Following the first example, using <code>widget</code> as modal's instance controller:
     * @example
     * widget.show();
     */
    DatePicker.prototype.show = function () {

        if (!this._enabled) {
            return this;
        }

        this._popover.show();

        /**
         * Callback function
         * @public
         * @name ch.DatePicker#show
         * @event
         */
        this.emit('show');

        return this;
    };

    /**
     * Triggers the innerHide method and returns the public scope to keep method chaining.
     * @public
     * @name ch.DatePicker#show
     * @function
     * @returns itself
     * @exampleDescription Following the first example, using <code>widget</code> as modal's instance controller:
     * @example
     * widget.hide();
     */
    DatePicker.prototype.hide = function () {
        this._popover.hide();

        /**
         * Callback function
         * @public
         * @name ch.DatePicker#hide
         * @event
         */
        this.emit('hide');

        return this;
    };

    /**
    * Select a specific date or returns the selected date.
    * @public
    * @since 0.9
    * @name ch.DatePicker#select
    * @function
    * @param {string} "YYYY/MM/DD".
    * @return itself
    */
    DatePicker.prototype.select = function (date) {
        // Select the day and update input value with selected date

        // Setter
        if (date) {
            this._calendar.select(date);
            this.el.value = this._calendar.select();

            return this;
        }

        // Getter
        return this._calendar.select();
    };

    /**
     * Returns date of today
     * @public
     * @since 0.9
     * @name ch.DatePicker#today
     * @function
     * @return date
     */
    DatePicker.prototype.today = function () {
        return this._calendar.today();
    };

    /**
     * Move to the next month or year. If it isn't specified, it will be moved to next month.
     * @public
     * @function
     * @name ch.DatePicker#next
     * @param {String} time A string that allows specify if it should move to next month or year.
     * @return itself
     * @default Next month
     */
    DatePicker.prototype.next = function (time) {
        this._calendar.next(time);

        /**
         * Callback function
         * @public
         * @name ch.DatePicker#next
         * @event
         */
        this.emit('next');

        return this;
    };

    /**
     * Move to the previous month or year. If it isn't specified, it will be moved to previous month.
     * @public
     * @function
     * @name ch.DatePicker#prev
     * @param {String} time A string that allows specify if it should move to previous month or year.
     * @return itself
     * @default Previous month
     */
    DatePicker.prototype.prev = function (time) {
        this._calendar.prev(time);

        /**
         * Callback function
         * @public
         * @name ch.DatePicker#next
         * @event
         */
        this.emit('prev');

        return this;
    };

    /**
     * Reset the Date Picker to date of today
     * @public
     * @name ch.DatePicker#reset
     * @function
     * @return itself
     */
    DatePicker.prototype.reset = function () {
        // Delete input value
        this.el.value = '';
        this._calendar.reset();

        /**
         * Callback function
         * @public
         * @name ch.DatePicker#next
         * @event
         */
        this.emit('reset');

        return this;
    };

    /**
     * Set a minimum selectable date.
     * @public
     * @name ch.DatePicker#from
     * @function
     * @param {string} "YYYY/MM/DD".
     * @return itself
     */
    DatePicker.prototype.from = function (date) {
        this._calendar.from(date);

        return this;
    };

    /**
     * Set a maximum selectable date.
     * @public
     * @name ch.DatePicker#to
     * @function
     * @param {string} "YYYY/MM/DD".
     * @return itself
     */
    DatePicker.prototype.to = function (date) {
        this._calendar.to(date);

        return this;
    };

    /**
     * Turn on DatePicker.
     * @public
     * @name ch.DatePicker#enable
     * @function
     * @returns itself
     * @see ch.Condition
     */

    /**
     * Turn off DatePicker.
     * @public
     * @name ch.DatePicker#disable
     * @function
     * @returns itself
     * @see ch.Condition
     */
    while (len) {
        createMethods(methods[len -= 1]);
    }

    ch.factory(DatePicker);

}(this, (this.jQuery || this.Zepto), this.ch));