(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Calendar shows months, and lets you move across the months of the year. Calendar lets you set one or many dates as selected.
     * @name Calendar
     * @class Calendar
     * @augments ch.Widget
     * @see ch.Widget
     * @memberOf ch
     * @param {Object} [conf] Object with configuration properties.
     * @param {String} [conf.format] Sets the date format. By default is "DD/MM/YYYY".
     * @param {String} [conf.selected] Sets a date that should be selected by default. By default is the date of today.
     * @param {String} [conf.from] Set a maximum selectable date.
     * @param {String} [conf.to] Set a minimum selectable date.
     * @param {Array} [conf.monthsNames] By default is ["Enero", ... , "Diciembre"].
     * @param {Array} [conf.weekdays] By default is ["Dom", ... , "Sab"].
     * @returns itself
     * @factorized
     * @exampleDescription Create a new Calendar with a class name 'example'.
     * @example
     * var widget = $(".example").calendar();
     * @exampleDescription Create a new Calendar with configuration.
     * @example
     * var widget = $(".example").calendar({
     *    "format": "MM/DD/YYYY",
     *    "selected": "2011/12/25",
     *    "from": "2010/12/25",
     *    "to": "2012/12/25",
     *    "monthsNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
     *    "weekdays": ["Su", "Mo", "Tu", "We", "Thu", "Fr", "Sa"]
     * });
     */
    function Calendar($el, options) {
        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        this.init($el, options);

        /**
         * Triggers when the component is ready to use (Since 0.8.0).
         * @fires ch.Dropdown#ready
         * @since 0.8.0
         * @exampleDescription Following the first example, using <code>widget</code> as expandable's instance controller:
         * @example
         * widget.on('ready',function () {
         *  this.show();
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    /**
     * Private
     */

    /**
     * Completes with zero the numbers less than 10.
     * @private
     * @name ch.Calendar#addZero
     * @function
     * @param num Number
     * @returns String
     */
    var addZero = function (num) {
            return (parseInt(num, 10) < 10) ? '0' + num : num;
        },

        /**
         * Map of date formats.
         * @private
         * @name ch.Calendar#FORMAT_dates
         * @type Object
         */
        FORMAT_dates = {

            'YYYY/MM/DD': function (date) {
                return [date.year, addZero(date.month), addZero(date.day)].join('/');
            },

            'DD/MM/YYYY': function (date) {
                return [addZero(date.day), addZero(date.month), date.year].join('/');
            },

            'MM/DD/YYYY': function (date) {
                return [addZero(date.month), addZero(date.day), date.year].join('/');
            }
        },

        /**
         * Creates a JSON Object with reference to day, month and year, from a determinated date.
         * @private
         * @name ch.Calendar#createDateObject
         * @function
         * @param date
         * @returns Object
         */
        createDateObject = function (date) {

            if (!/^\d{4}\/((0?[1-9])|(1?[0-2]))\/([0-2]?[0-9]|3[0-1])$/.test(date) && date !== undefined) {
                throw new window.Error('The date "' + date + '" is not valid format. It must follow this format YYYY/MM/DD.');
            }
            // Uses date parameter or create a date from today
            date = date ? new Date(date) : new Date();

            return {
                /**
                 * Number of day.
                 * @private
                 * @name day
                 * @type Number
                 * @memberOf ch.Calendar#createDateObject
                 */
                'day': date.getDate(),

                /**
                 * Order of day in a week.
                 * @private
                 * @name order
                 * @type Number
                 * @memberOf ch.Calendar#createDateObject
                 */
                'order': date.getDay(),

                /**
                 * Number of month.
                 * @private
                 * @name month
                 * @type Number
                 * @memberOf ch.Calendar#createDateObject
                 */
                'month': date.getMonth() + 1,

                /**
                 * Number of full year.
                 * @private
                 * @name year
                 * @type Number
                 * @memberOf ch.Calendar#createDateObject
                 */
                'year': date.getFullYear()
            };
        },
        /**
         * Handles behavior of arrows to move around months.
         * @private
         * @name ch.Calendar#arrows
         * @type Object
         */
        arrows = {

            /**
             * Handles behavior of previous arrow to move back in months.
             * @private
             * @name prev
             * @memberOf ch.Calendar#arrows
             * @type Object
             */
            'prev': '<div class="ch-calendar-prev" role="button" aria-hidden="false"></div>',

            /**
             * Handles behavior of next arrow to move forward in months.
             * @private
             * @name next
             * @memberOf ch.Calendar#arrows
             * @type Object
             */
            'next': '<div class="ch-calendar-next" role="button" aria-hidden="false"></div>'
        },
        /**
         * Inheritance
         */
        parent = ch.util.inherits(Calendar, ch.Widget);

    Calendar.prototype.name = 'calendar';

    Calendar.prototype.constructor = Calendar;

    Calendar.prototype._defaults = {
        'monthsNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        'weekdays': ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        'format': 'DD/MM/YYYY'
    };

    Calendar.prototype.init = function ($el, options) {
        parent.init.call(this, $el, options);

        var that = this;


        /**
         * Object to mange the date and its ranges.
         * @private
         * @name ch.Calendar#date
         * @returns Object
         */
        this._dates = {
            'range': {}
        };

        this._dates.today = createDateObject();

        this._dates.current = this._dates.today;

        /**
         * Date of selected day.
         * @private
         * @name ch.Calendar-selected
         * @type Object
         */
        this._dates.selected = (function () {

            // Get date from configuration or input value, if configured could be an Array with multiple selections
            var selected = that._options.selected;

            // Do it only if there are a "selected" parameter
            if (!selected) { return selected; }

            // Simple date selection
            if (!ch.util.isArray(selected)) {

                if (selected !== 'today') {
                    // Return date object and update currentDate
                    selected = that._dates.current = createDateObject(selected);

                } else {
                    selected = that._dates.today;
                }

            // Multiple date selection
            } else {
                $.each(selected, function (i, e) {
                    // Simple date
                    if (!ch.util.isArray(e)) {
                        selected[i] = (selected[i] !== 'today') ? createDateObject(e) : that._dates.today;
                    // Range
                    } else {
                        selected[i][0] = (selected[i][0] !== 'today') ? createDateObject(e[0]) : that._dates.today;
                        selected[i][1] = (selected[i][1] !== 'today') ? createDateObject(e[1]) : that._dates.today;
                    }
                });
            }

            return selected;
        }());

        // Today's date object
        this._dates.today = createDateObject();

        // Minimum selectable date
        this._dates.range.from = (function () {

            // Only works when there are a "from" parameter on configuration
            if (that._options.from === undefined || !that._options.from) { return; }

            // Return date object
            return (that._options.from === 'today') ? that._dates.today : createDateObject(that._options.from);

        }());

        // Maximum selectable date
        this._dates.range.to = (function () {

            // Only works when there are a "to" parameter on configuration
            if (that._options.to === undefined || !that._options.to) { return; }

            // Return date object
            return (that._options.to === 'today') ? that._dates.today : createDateObject(that._options.to);

        }());

        // Show or hide arrows depending on "from" and "to" limits
        this._$prev = $(arrows.prev).attr('aria-controls', 'ch-calendar-grid-' + this.uid).on(ch.onpointertap + '.' + this.name, function (event) { ch.util.prevent(event); that.prevMonth(); });
        this._$next = $(arrows.next).attr('aria-controls', 'ch-calendar-grid-' + this.uid).on(ch.onpointertap + '.' + this.name, function (event) { ch.util.prevent(event); that.nextMonth(); });

        this.$el
            .addClass('ch-calendar')
            .prepend(this._$prev)
            .prepend(this._$next)
            .append(this._createTemplate(this._dates.current));

        this._updateControls();

        // Avoid selection on the component
        ch.util.avoidTextSelection(that.$el);

        /**
         * Triggers when the component is ready to use (Since 0.8.0).
         * @name ch.Calendar#ready
         * @event
         * @public
         * @since 0.8.0
         * @exampleDescription Following the first example, using <code>widget</code> as Calendar's instance controller:
         * @example
         * widget.on("ready", function () {
         *   this.show();
         * });
         */
        window.setTimeout(function () { that.emit('select'); }, 50);

    };

    /**
     * Checks if it has got a previous month to show depending on "from" limit.
     * @private
     * @name _hasPrevMonth
     * @memberOf ch.Calendar#_hasPrevMonth
     * @function
     */
    Calendar.prototype._hasPrevMonth = function () {
        return this._dates.range.from === undefined || !(this._dates.range.from.month >= this._dates.current.month && this._dates.range.from.year >= this._dates.current.year);
    };

    /**
     * Checks if it has got a next month to show depending on "to" limits.
     * @private
     * @name _hasNextMonth
     * @memberOf ch.Calendar#_hasNextMonth
     * @function
     */
    Calendar.prototype._hasNextMonth = function () {
        return this._dates.range.to === undefined || !(this._dates.range.to.month <= this._dates.current.month && this._dates.range.to.year <= this._dates.current.year);
    };

    /**
     * Refresh arrows visibility depending on "from" and "to" limits.
     * @private
     * @name update
     * @memberOf ch.Calendar#arrows
     * @function
     */
    Calendar.prototype._updateControls = function () {

        // Show previous arrow when it's out of limit
        if (this._hasPrevMonth()) {
            this._$prev.removeClass('ch-hide').attr('aria-hidden', 'false');

        // Hide previous arrow when it's out of limit
        } else {
            this._$prev.addClass('ch-hide').attr('aria-hidden', 'true');
        }

        // Show next arrow when it's out of limit
        if (this._hasNextMonth()) {
            this._$next.removeClass('ch-hide').attr('aria-hidden', 'false');

        // Hide next arrow when it's out of limit
        } else {
            this._$next.addClass('ch-hide').attr('aria-hidden', 'true');
        }

        return this;
    };

    /**
     * Refresh the structure of Calendar's table with a new date.
     * @private
     * @function
     * @name ch.Calendar#updateTable
     * @param date {String} Date to be selected.
     */
    Calendar.prototype._updateTemplate = function (date) {
        // Update "currentDate" object
        this._dates.current = (typeof date === 'string') ? createDateObject(date) : date;

        // Delete old table
        this.$el.children('table').remove();

        // Append new table to content
        this.$el.append(this._createTemplate(this._dates.current));

        // Refresh arrows
        this._updateControls();

        return this;
    };

    /**
     * Creates a complete month in a table.
     * @private
     * @function
     * @name ch.Calendar#createTable
     * @param date {Object} Date from will be created the entire month.
     * @return jQuery Object
     */
    Calendar.prototype._createTemplate = function (date) {
        var that = this,
            cell,
            positive,
            day,
            isSelected,
            thead = (function () {

                // Create thead structure
                var t = ['<thead><tr role="row">'],
                    day;

                // Add week names
                for (day = 0; day < 7; day += 1) {
                    t.push('<th role="columnheader">' + that._defaults.weekdays[day] + '</th>');
                }

                // Close thead structure
                t.push('</tr></thead>');

                // Join structure and return
                return t.join('');

            }()),

            table = [
                '<table class="ch-calendar-month" role="grid" id="ch-calendar-grid-' + that.uid + '">',
                '<caption>' + that._defaults.monthsNames[date.month - 1] + ' - ' + date.year + '</caption>',
                thead
            ],

        // Total amount of days into month
            cells = (function () {

                // Amount of days of current month
                var currentMonth = new Date(date.year, date.month, 0).getDate(),

                // Amount of days of previous month
                    prevMonth = new Date([date.year, date.month, '01'].join('/')).getDay(),

                // Merge amount of previous and current month
                    subtotal = prevMonth + currentMonth,

                // Amount of days into last week of month
                    latest = subtotal % 7,

                // Amount of days of next month
                    nextMonth = (latest > 0) ? 7 - latest : 0;

                return {
                    'previous': prevMonth,
                    'subtotal': subtotal,
                    'total': subtotal + nextMonth
                };

            }());

        table.push('<tbody><tr class="ch-calendar-week" role="row">');

        // Iteration of weekdays
        for (cell = 0; cell < cells.total; cell += 1) {

            // Push an empty cell on previous and next month
            if (cell < cells.previous || cell > cells.subtotal - 1) {
                table.push('<td role="gridcell" class="ch-calendar-other">X</td>');
            } else {

                // Positive number of iteration
                positive = cell + 1;

                // Day number
                day = positive - cells.previous;

                // Define if it's the day selected
                isSelected = this._isSelected(date.year, date.month, day);

                // Create cell
                table.push(
                    // Open cell structure including WAI-ARIA and classnames space opening
                    '<td role="gridcell"' + (isSelected ? ' aria-selected="true"' : '') + ' class="ch-calendar-day',

                    // Add Today classname if it's necesary
                    (date.year === that._dates.today.year && date.month === that._dates.today.month && day === that._dates.today.day) ? ' ch-calendar-today' : null,

                    // Add Selected classname if it's necesary
                    (isSelected ? ' ch-calendar-selected ' : null),

                    // From/to range. Disabling cells
                    (
                        // Disable cell if it's out of FROM range
                        (that._dates.range.from && day < that._dates.range.from.day && date.month === that._dates.range.from.month && date.year === that._dates.range.from.year) ||

                        // Disable cell if it's out of TO range
                        (that._dates.range.to && day > that._dates.range.to.day && date.month === that._dates.range.to.month && date.year === that._dates.range.to.year)

                    ) ? ' ch-calendar-disabled' : null,

                    // Close classnames attribute and print content closing cell structure
                    '">' + day + '</td>'
                );

                // Cut week if there are seven days
                if (positive % 7 === 0) {
                    table.push('</tr><tr class="ch-calendar-week" role="row">');
                }

            }

        }

        table.push('</tr></tbody></table>');

        // Return table object
        return table.join('');

    };

    /**
     * Indicates if an specific date is selected or not (including date ranges and simple dates).
     * @private
     * @name ch.Calendar#_isSelected
     * @function
     * @param year
     * @param month
     * @param day
     * @return Boolean
     */
    Calendar.prototype._isSelected = function (year, month, day) {
        var yepnope;

        if (!this._dates.selected) { return; }

        yepnope = false;

        // Simple selection
        if (!ch.util.isArray(this._dates.selected)) {
            if (year === this._dates.selected.year && month === this._dates.selected.month && day === this._dates.selected.day) {
                yepnope = true;
                return yepnope;
            }
        // Multiple selection (ranges)
        } else {
            $.each(this._dates.selected, function (i, e) {
                // Simple date
                if (!ch.util.isArray(e)) {
                    if (year === e.year && month === e.month && day === e.day) {
                        yepnope = true;
                        return yepnope;
                    }
                // Range
                } else {
                    if (
                        (year >= e[0].year && month >= e[0].month && day >= e[0].day) &&
                            (year <= e[1].year && month <= e[1].month && day <= e[1].day)
                    ) {
                        yepnope = true;
                        return yepnope;
                    }
                }
            });
        }

        return yepnope;
    };

/**
*  Public Members
*/

    /**
     * @borrows ch.Widget#uid as ch.Menu#uid
     * @borrows ch.Widget#el as ch.Menu#el
     * @borrows ch.Widget#type as ch.Menu#type
     */

    /**
     * Select a specific date or returns the selected date.
     * @public
     * @since 0.9
     * @name ch.Calendar#select
     * @function
     * @param {string} "YYYY/MM/DD".
     * @return itself
     */
    Calendar.prototype.select = function (date) {
        // Getter
        if (!date) {
            if (this._dates.selected === undefined) {
                return;
            }
            return FORMAT_dates[this._options.format](this._dates.selected);
        }

        // Setter
        // Update selected date
        this._dates.selected = (date === 'today') ? this._dates.today : createDateObject(date);

        // Create a new table of selected month
        this._updateTemplate(this._dates.selected);

        /**
         * It triggers a callback when a date is selected.
         * @public
         * @name ch.Calendar#select
         * @event
         * @exampleDescription
         * @example
         * widget.on("select",function(){
         *   widget.action();
         * });
         */
        this.emit('select');

        return this;

    };

    /**
     * Returns date of today
     * @public
     * @since 0.9
     * @name ch.Calendar#today
     * @function
     * @return date
     */
    Calendar.prototype.getToday = function () {
        return FORMAT_dates[this._options.format](this._dates.today);
    };

    /**
     * Move to the next month.
     * @public
     * @name ch.Calendar#nextMonth
     * @function
     * @return itself
     * @default Next month
     */
    Calendar.prototype.nextMonth = function () {
        if (!this._enabled || !this._hasNextMonth()) {
            return this;
        }

        // Next year
        if (this._dates.current.month === 12) {
            this._dates.current.month = 0;
            this._dates.current.year += 1;
        }

        // Create a new table of selected month
        this._updateTemplate([this._dates.current.year, this._dates.current.month + 1, '01'].join('/'));

        /**
         * It triggers a callback when a next month is shown.
         * @public
         * @name ch.Calendar#nextMonth
         * @event
         * @exampleDescription
         * @example
         * widget.on("nextMonth",function(){
         *   sowidget.action();
         * });
         */
        this.emit('nextmonth');

        return this;
    };

    /**
     * Move to the previous month.
     * @public
     * @function
     * @name ch.Calendar#prevMonth
     * @return itself
     * @default Previous month
     */
    Calendar.prototype.prevMonth = function () {

        if (!this._enabled || !this._hasPrevMonth()) {
            return this;
        }

        // Previous year
        if (this._dates.current.month === 1) {
            this._dates.current.month = 13;
            this._dates.current.year -= 1;
        }

        // Create a new table to the prev month
        this._updateTemplate([this._dates.current.year, this._dates.current.month - 1, '01'].join('/'));

        /**
         * It triggers a callback when a previous month is shown.
         * @public
         * @name ch.Calendar#prevMonth
         * @event
         * @exampleDescription
         * @example
         * widget.on("prevMonth",function(){
         *   sowidget.action();
         * });
         */
        this.emit('prevmonth');

        return this;
    };

    /**
     * Move to the next year.
     * @public
     * @name ch.Calendar#nextYear
     * @function
     * @return itself
     * @default Next month
     */
    Calendar.prototype.nextYear = function () {

        if (!this._enabled || !this._hasNextMonth()) {
            return this;
        }

        // Create a new table of selected month
        this._updateTemplate([this._dates.current.year + 1, this._dates.current.month, '01'].join('/'));

        /**
         * It triggers a callback when a next year is shown.
         * @public
         * @name ch.Calendar#nextYear
         * @event
         * @exampleDescription
         * @example
         * widget.on("nextYear",function(){
         *   sowidget.action();
         * });
         */
        this.emit('nextyear');

        return this;
    };

    /**
     * Move to the previous year.
     * @public
     * @function
     * @name ch.Calendar#prevYear
     * @return itself
     * @default Previous year
     */
    Calendar.prototype.prevYear = function () {

        if (!this._enabled || !this._hasPrevMonth()) {
            return this;
        }

        // Create a new table to the prev year
        this._updateTemplate([this._dates.current.year - 1, this._dates.current.month, '01'].join('/'));

        /**
         * It triggers a callback when a previous year is shown.
         * @public
         * @name ch.Calendar#prevYear
         * @event
         * @exampleDescription
         * @example
         * widget.on("prevYear",function(){
         *   sowidget.action();
         * });
         */
        this.emit('prevyear');

        return this;
    };

    /**
     * Set a minimum selectable date.
     * @public
     * @since 0.9
     * @name ch.Calendar#from
     * @function
     * @param {string} "YYYY/MM/DD".
     * @return itself
     */
    Calendar.prototype.setFrom = function (date) {
        // this from is a reference to the global form
        this._dates.range.from = (date === 'reset') ? undefined : createDateObject(date);
        this._updateTemplate(this._dates.current);

        return this;
    };

    /**
     * Set a maximum selectable date.
     * @public
     * @since 0.9
     * @name ch.Calendar#to
     * @function
     * @param {string} "YYYY/MM/DD".
     * @return itself
     */
    Calendar.prototype.setTo = function (date) {
        // this to is a reference to the global to
        this._dates.range.to = (date === 'reset') ? undefined : createDateObject(date);
        this._updateTemplate(this._dates.current);

        return this;
    };

    Calendar.prototype._normalizeOptions = function (options) {
        if (typeof options === 'string' || ch.util.isArray(options)) {
            options = {
                'selected': options
            };
        }
        return options;
    };

    /**
     * Factory
     */
    ch.factory(Calendar, Calendar.prototype._normalizeOptions);

}(this, this.ch.$, this.ch));
