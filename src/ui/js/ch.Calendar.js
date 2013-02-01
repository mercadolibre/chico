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
*	 "format": "MM/DD/YYYY",
*	 "selected": "2011/12/25",
*	 "from": "2010/12/25",
*	 "to": "2012/12/25",
*	 "monthsNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
*	 "weekdays": ["Su", "Mo", "Tu", "We", "Thu", "Fr", "Sa"]
* });
*/
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	/**
	 * Inheritance
	 */
	var setTimeout = window.setTimeout,

		/**
		* Completes with zero the numbers less than 10.
		* @private
		* @name ch.Calendar#addZero
		* @function
		* @param num Number
		* @returns String
		*/
		addZero = function (num) {
			return (parseInt(num, 10) < 10) ? "0" + num : num;
		},

		/**
		* Map of date formats.
		* @private
		* @name ch.Calendar#FORMAT_DATE
		* @type Object
		*/
		FORMAT_DATE = {

			'YYYY/MM/DD': function (date) {
				return [date.year, addZero(date.month), addZero(date.day)].join("/");
			},

			'DD/MM/YYYY': function (date) {
				return [addZero(date.day), addZero(date.month), date.year].join("/");
			},

			'MM/DD/YYYY': function (date) {
				return [addZero(date.month), addZero(date.day), date.year].join("/");
			}

		},
		/**
		* Parse string to YYYY/MM/DD or DD/MM/YYYY format date.
		* @private
		* @function
		* @name ch.Calendar#parseDate
		* @param value {String} The date to be parsed.
		*/
		parseDate = function (value, format) {

			// Splitted string
			value = value.split("/");

			// Date to be returned
			var result = [];

			// Parse date
			switch (format) {
				case "DD/MM/YYYY":
					result.push(value[2], value[1], value[0]);
					break;
				case "MM/DD/YYYY":
					result.push(value[2], value[0], value[1]);
					break;
			}

			return result.join("/");
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

			if(!/^\d{4}\/((0?[1-9])|(1?[0-2]))\/([0-2]?[0-9]|3[0-1])$/.test(date) && date !== undefined){
				throw new window.Error('The date "'+date+'" is not valid format. It must follow this format YYYY/MM/DD.');
			}
			// Uses date parameter or create a date from today
			date = (date) ? new Date(date) : new Date();

			return {
				/**
				* Number of day.
				* @private
				* @name day
				* @type Number
				* @memberOf ch.Calendar#createDateObject
				*/
				"day": date.getDate(),

				/**
				* Order of day in a week.
				* @private
				* @name order
				* @type Number
				* @memberOf ch.Calendar#createDateObject
				*/
				"order": date.getDay(),

				/**
				* Number of month.
				* @private
				* @name month
				* @type Number
				* @memberOf ch.Calendar#createDateObject
				*/
				"month": date.getMonth() + 1,

				/**
				* Number of full year.
				* @private
				* @name year
				* @type Number
				* @memberOf ch.Calendar#createDateObject
				*/
				"year": date.getFullYear()
			};
		},
		template = {

			/**
			* Handles behavior of arrows to move around months.
			* @private
			* @name ch.Calendar#arrows
			* @type Object
			*/
			'arrows': {

				/**
				* Handles behavior of previous arrow to move back in months.
				* @private
				* @name prev
				* @memberOf ch.Calendar#arrows
				* @type Object
				*/
				'prev': '<div class="ch-calendar-prev" role="button" aria-controls="ch-calendar-grid-$uid$" aria-hidden="false"></div>',

				/**
				* Handles behavior of next arrow to move forward in months.
				* @private
				* @name next
				* @memberOf ch.Calendar#arrows
				* @type Object
				*/
				'next': '<div class="ch-calendar-next" role="button" aria-controls="ch-calendar-grid-$uid$" aria-hidden="false"></div>'
			},
			/**
			* Refresh the structure of Calendar's table with a new date.
			* @private
			* @function
			* @name ch.Calendar#updateTable
			* @param date {String} Date to be selected.
			*/
			'update': function (date) {
				var that = this;

				// Update "currentDate" object
				that._date.current = (typeof date === 'string') ? createDateObject(date) : date;

				// Delete old table
				that.$el.children('table').remove();

				// Append new table to content
				that.$el.append(template.create.call(that, that._date.current));

				// Refresh arrows
				that._updateControls();

			},
			/**
			* Creates a complete month in a table.
			* @private
			* @function
			* @name ch.Calendar#createTable
			* @param date {Object} Date from will be created the entire month.
			* @return jQuery Object
			*/
			'create': function (date) {
				var that = this;

				var thead = (function () {

						// Create thead structure
						var t = ["<thead><tr role=\"row\">"];

						// Add week names
						for (var i = 0; i < 7; i += 1) {
							t.push("<th role=\"columnheader\">" + that._defaults.weekdays[i] + "</th>");
						};

						// Close thead structure
						t.push("</tr></thead>");

						// Join structure and return
						return t.join("");

					}());

				var table = [
					'<table class="ch-calendar-month" role="grid" id="ch-calendar-grid-'+ that.uid +'">',
					'<caption>' + that._defaults.monthsNames[date.month - 1] + ' - ' + date.year + '</caption>',
					thead
					];



				// Total amount of days into month
				var cells = (function () {

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
				for (var i = 0; i < cells.total; i += 1) {

					// Push an empty cell on previous and next month
					if (i < cells.previous || i > cells.subtotal - 1) {
						table.push('<td role="gridcell" class="ch-calendar-other">X</td>');
					} else {

						// Positive number of iteration
						var positive = i + 1,

						// Day number
							day = positive - cells.previous,

						// Define if it's the day selected
							isSelected = that._date.isSelected(date.year, date.month, day);

						// Create cell
						table.push(
							// Open cell structure including WAI-ARIA and classnames space opening
							'<td role="gridcell"' + (isSelected ? ' aria-selected="true"' : '') + ' class="ch-calendar-day',

							// Add Today classname if it's necesary
							(date.year === that._date.today.year && date.month === that._date.today.month && day === that._date.today.day) ? ' ch-calendar-today' : null,

							// Add Selected classname if it's necesary
							(isSelected ? ' ch-calendar-selected ': null),

							// From/to range. Disabling cells
							(
								// Disable cell if it's out of FROM range
								(that._date.range.from && day < that._date.range.from.day && date.month === that._date.range.from.month && date.year === that._date.range.from.year) ||

								// Disable cell if it's out of TO range
								(that._date.range.to && day > that._date.range.to.day && date.month === that._date.range.to.month && date.year === that._date.range.to.year)

							) ? ' ch-calendar-disabled': null,

							// Close classnames attribute and print content closing cell structure
							'">' + day + '</td>'
						);

						// Cut week if there are seven days
						if (positive % 7 === 0) {
							table.push('</tr><tr class="ch-calendar-week" role="row">');
						}

					}

				};

				table.push('</tr></tbody></table>');

				// Return table object
				return table.join('');

			}
		};



	function Calendar($el, options) {
		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @type {Object}
		 */
		var that = this;

		that.init($el, options);

		/**
		 * Triggers when the component is ready to use (Since 0.8.0).
		 * @fires ch.Dropdown#ready
		 * @since 0.8.0
		 * @exampleDescription Following the first example, using <code>widget</code> as expandable's instance controller:
		 * @example
		 * widget.on('ready',function () {
		 *	this.show();
		 * });
		 */
		window.setTimeout(function () { that.emit('ready'); }, 50);
	}

	/**
	 * Inheritance
	 */
	var parent = ch.util.inherits(Calendar, ch.Widget);

	Calendar.prototype._defaults = {
		'monthsNames': ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
		'weekdays': ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
		'format': 'DD/MM/YYYY'
	};

	Calendar.prototype.init = function ($el, options) {
		parent.init.call(this, $el, options);

		var that = this,
			options = that._options;

		that._date.today = createDateObject();

		that._date.current = that._date.today;

		/**
		* Date of selected day.
		* @private
		* @name ch.Calendar-selected
		* @type Object
		*/
		that._date.selected = (function () {

				// Get date from configuration or input value
				var sel = that._options.selected || that._options.content;

				// Do it only if there are a "selected" parameter
				if (!sel) { return sel; }

				// Simple date selection
				if (!ch.util.isArray(sel)) {

					// Return date object and update currentDate
					return (sel !== "today") ? that._date.current = createDateObject(sel) : today;

				// Multiple date selection
				} else {
					$.each(sel, function (i, e) {
						// Simple date
						if (!ch.util.isArray(e)) {
							sel[i] = (sel[i] !== "today") ? createDateObject(e) : today;
						// Range
						} else {
							sel[i][0] = (sel[i][0] !== "today") ? createDateObject(e[0]) : today;
							sel[i][1] = (sel[i][1] !== "today") ? createDateObject(e[1]) : today;
						}
					});

					return sel;
				}
			})();

		// Today's date object
		that._date.today = createDateObject();

		// Minimum selectable date
		that._date.range.from = (function () {

			// Only works when there are a "from" parameter on configuration
			if (!ch.util.hasOwn(options, "from") || !options.from) { return; }

			// Return date object
			return (options.from === "today") ? that._date.today : createDateObject(options.from);

		}());

		// Maximum selectable date
		that._date.range.to = (function () {

			// Only works when there are a "to" parameter on configuration
			if (!ch.util.hasOwn(options, "to") || !options.to) { return; }

			// Return date object
			return (options.to === "today") ? today : createDateObject(options.to);

		}());

		// Show or hide arrows depending on "from" and "to" limits

		that._$prev = $(template.arrows.prev.replace('$uid$', that.uid)).bind('click', function (event) { ch.util.prevent(event); that.prev('month'); });
		that._$next = $(template.arrows.next.replace('$uid$', that.uid)).bind('click', function (event) { ch.util.prevent(event); that.next('month'); });

		that.$el
			.addClass("ch-calendar")
			.prepend(that._$prev)
			.prepend(that._$next)
			.append(template.create.call(that, that._date.current));

		that._updateControls(that);

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
		* 	this.show();
		* });
		*/
		setTimeout(function () { that.emit('select'); }, 50);

	}


	/**
	* Refresh arrows visibility depending on "from" and "to" limits.
	* @private
	* @name update
	* @memberOf ch.Calendar#arrows
	* @function
	*/
	Calendar.prototype._updateControls = function () {
		var that = this;

		// "From" limit
		if (that._date.range.from) {
			// Hide previous arrow when it's out of limit
			if (that._date.range.from.month >= that._date.current.month && that._date.range.from.year >= that._date.current.year) {
				that._$prev.addClass('ch-hide').attr('aria-hidden', 'true');
			// Show previous arrow when it's out of limit
			} else {
				that._$prev.removeClass('ch-hide').attr('aria-hidden', 'false');
			}
		}

		// "To" limit
		if (that._date.range.to) {
			// Hide next arrow when it's out of limit
			if (that._date.range.to.month <= that._date.current.month && that._date.range.to.year <= that._date.current.year) {
				that._$next.addClass('ch-hide').attr('aria-hidden', 'true');
			// Show next arrow when it's out of limit
			} else {
				that._$next.removeClass('ch-hide').attr('aria-hidden', 'false');
			}
		}

		return this;
	}


	/**
	* Object to mange the date and its ranges.
	* @private
	* @name ch.Calendar#date
	* @returns Object
	*/
	Calendar.prototype._date = {
		'range': {}
	};

	/**
	* Indicates if an specific date is selected or not (including date ranges and simple dates).
	* @private
	* @name ch.Calendar#isSelected
	* @function
	* @param year
	* @param month
	* @param day
	* @return Boolean
	*/
	Calendar.prototype._date.isSelected = function (year, month, day) {
		var that = this;

		if (!that.selected) { return; }

		var yepnope = false;

		// Simple selection
		if (!ch.util.isArray(that.selected)) {
			if (year === that.selected.year && month === that.selected.month && day === that.selected.day) {
				return yepnope = true;
			}
		// Multiple selection (ranges)
		} else {
			$.each(that.selected, function (i, e) {
				// Simple date
				if (!ch.util.isArray(e)) {
					if (year === e.year && month === e.month && day === e.day) {
						return yepnope = true;
					}
				// Range
				} else {
					if (
						(year >= e[0].year && month >= e[0].month && day >= e[0].day) &&
						(year <= e[1].year && month <= e[1].month && day <= e[1].day)
					) {
						return yepnope = true;
					}
				}
			});
		}

		return yepnope;
	}

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
		var that = this;

		// Getter
		if (!date) {
			if(that._date.selected === undefined) {
				return;
			}
			return FORMAT_DATE[that._options.format](that._date.selected);
		}

		// Setter
		// Update selected date
		that._date.selected = (date === "today") ? that._date.today : createDateObject(date);

		// Create a new table of selected month
		template.update.call(that, that._date.selected);

		/**
		* It triggers a callback when a date is selected.
		* @public
		* @name ch.Calendar#select
		* @event
		* @exampleDescription
		* @example
		* widget.on("select",function(){
		* 	widget.action();
		* });
		*/
		that.emit('select');

		return that;

	};

	/**
	* Select a specific day into current month and year.
	* @public
	* @since 0.10.1
	* @name ch.Calendar#selectDay
	* @function
	* @param {string || number}
	* @return {string} New selected date.
	*/
	Calendar.prototype.selectDay = function (day) {

		if(!day){
			throw new window.Error('ch.Calendar.selectDay(day): day parameter is required and must be a number or string.');
		}

		var that = this,
			date = [that._date.current.year, that._date.current.month, day].join("/");

		that.select(date);

		return FORMAT_DATE[that._options.format](createDateObject(date));

	};

	/**
	* Returns date of today
	* @public
	* @since 0.9
	* @name ch.Calendar#today
	* @function
	* @return date
	*/
	Calendar.prototype.today = function () {
		return FORMAT_DATE[this._options.format](this._date.today);
	};

	/**
	* Move to the next month or year. If it isn't specified, it will be moved to next month.
	* @public
	* @name ch.Calendar#next
	* @function
	* @param {String} time A string that allows specify if it should move to next month or year.
	* @return itself
	* @default Next month
	*/
	Calendar.prototype.next = function (time) {
		var that = this;

		switch (time) {
			case "month":
			case undefined:
			default:
				// Next year
				if (that._date.current.month === 12) {
					that._date.current.month = 0;
					that._date.current.year += 1;
				}

				// Create a new table of selected month
				template.update.call(that, [that._date.current.year, that._date.current.month + 1, "01"].join("/"));

				/**
				* It triggers a callback when a next month is shown.
				* @public
				* @name ch.Calendar#nextMonth
				* @event
				* @exampleDescription
				* @example
				* widget.on("nextMonth",function(){
				* 	sowidget.action();
				* });
				*/
				that.emit('nextMonth');
				break;
			case "year":
				// Create a new table of selected month
				template.update.call(that, [that._date.current.year + 1, that._date.current.month, "01"].join("/"));

				/**
				* It triggers a callback when a next year is shown.
				* @public
				* @name ch.Calendar#nextYear
				* @event
				* @exampleDescription
				* @example
				* widget.on("nextYear",function(){
				* 	sowidget.action();
				* });
				*/
				that.emit('nextYear');
				break;
		}

		return that;
	};

	/**
	* Move to the previous month or year. If it isn't specified, it will be moved to previous month.
	* @public
	* @function
	* @name ch.Calendar#prev
	* @param {String} time A string that allows specify if it should move to previous month or year.
	* @return itself
	* @default Previous month
	*/
	Calendar.prototype.prev = function (time) {
		var that = this;

		switch (time) {
			case "month":
			case undefined:
			default:


				// Previous year
				if (that._date.current.month === 1) {
					that._date.current.month = 13;
					that._date.current.year -= 1;
				}

				// Create a new table of selected month
				template.update.call(that, [that._date.current.year, that._date.current.month - 1, "01"].join("/"));

				/**
				* It triggers a callback when a previous month is shown.
				* @public
				* @name ch.Calendar#prevMonth
				* @event
				* @exampleDescription
				* @example
				* widget.on("prevMonth",function(){
				* 	sowidget.action();
				* });
				*/
				that.emit('prevMonth');
				break;

			case "year":
				// Create a new table of selected month
				template.update.call(that, [that._date.current.year - 1, that._date.current.month, "01"].join("/"));

				/**
				* It triggers a callback when a previous year is shown.
				* @public
				* @name ch.Calendar#prevYear
				* @event
				* @exampleDescription
				* @example
				* widget.on("prevYear",function(){
				* 	sowidget.action();
				* });
				*/
				that.emit('prevYear');
				break;
		}

		return this;
	};

	/**
	* Reset the Calendar to date of today
	* @public
	* @name ch.Calendar#reset
	* @function
	* @return itself
	*/
	Calendar.prototype.reset = function () {
		reset();

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
	Calendar.prototype.from = function (date) {
		var that = this;
		// this from is a reference to the global form
		that._date.range.from = createDateObject(date);
		template.update.call(that, that._date.current);

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
	Calendar.prototype.to = function (date) {
		var that = this;
		// this to is a reference to the global to
		that._date.range.to = createDateObject(date);
		template.update.call(that, that._date.current);

		return this;
	};


	Calendar.prototype.name = 'calendar';
	Calendar.prototype.constructor = Calendar;

	ch.factory(Calendar);

}(this, (this.jQuery || this.Zepto), this.ch));