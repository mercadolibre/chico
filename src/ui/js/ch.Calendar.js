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

	var setTimeout = window.setTimeout,
		setInterval = window.setInterval,
		$html = $('html'),
		$document = $(window.document);

	function Calendar($el, conf) {

		/**
		* Reference to a internal component instance, saves all the information and configuration properties.
		* @private
		* @name ch.Calendar#that
		* @type object
		*/
		var that = this;

		that.$element = $el;
		that.element = $el[0];
		that.type = 'calendar';
		conf = conf || {};

		conf = ch.util.clone(conf);

		// Format by default
		conf.format = conf.format || "DD/MM/YYYY";

		that.conf = conf;

	/**
	*	Inheritance
	*/

		that = ch.Widget.call(that);
		that.parent = ch.util.clone(that);

	/**
	*	Private Members
	*/

		/**
		* Collection of months names.
		* @private
		* @name ch.Calendar#MONTHS_NAMES
		* @type Array
		*/
		//TODO: Default language should be English and then sniff browser language or something
		var MONTHS_NAMES = conf.monthsNames || ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],

		/**
		* Collection of weekdays (short names).
		* @private
		* @name ch.Calendar#DAYS_SHORTNAMES
		* @type Array
		*/
		//TODO: Default language should be English and then sniff browser language
			DAYS_SHORTNAMES = conf.weekdays || ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],

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

		// Today's date object
			today = createDateObject(),

		// Minimum selectable date
			from = (function () {

				// Only works when there are a "from" parameter on configuration
				if (!ch.util.hasOwn(conf, "from") || !conf.from) { return; }

				// Return date object
				return (conf.from === "today") ? today : createDateObject(conf.from);

			}()),

		// Maximum selectable date
			to = (function () {

				// Only works when there are a "to" parameter on configuration
				if (!ch.util.hasOwn(conf, "to") || !conf.to) { return; }

				// Return date object
				return (conf.to === "today") ? today : createDateObject(conf.to);

			}()),

		/**
		* Parse string to YYYY/MM/DD or DD/MM/YYYY format date.
		* @private
		* @function
		* @name ch.Calendar#parseDate
		* @param value {String} The date to be parsed.
		*/
			parseDate = function (value) {

				// Splitted string
				value = value.split("/");

				// Date to be returned
				var result = [];

				// Parse date
				switch (conf.format) {
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
		* The current date that should be shown on Calendar.
		* @private
		* @name ch.Calendar#currentDate
		* @type Object
		*/
			currentDate = today,

		/**
		* Sets the date object of selected day.
		* @private
		* @name ch.Calendar#setSelected
		* @type Object
		*/
			setSelected = function () {

				// Get date from configuration or input value
				var sel = conf.selected || conf.content;

				// Do it only if there are a "selected" parameter
				if (!sel) { return; }

				// Simple date selection
				if (!ch.util.isArray(sel)) {

					// Return date object and update currentDate
					return (sel !== "today") ? currentDate = createDateObject(sel) : today;

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
			},

		/**
		* Date of selected day.
		* @private
		* @name ch.Calendar-selected
		* @type Object
		*/
			selected = setSelected(),

		/**
		* Indicates if an specific date is selected or not (including date ranges and simple dates).
		* @private
		* @name ch.Calendar#isSelectable
		* @function
		* @param year
		* @param month
		* @param day
		* @return Boolean
		*/
			isSelectable = function (year, month, day) {

				if (!selected) { return; }

				var yepnope = false;

				// Simple selection
				if (!ch.util.isArray(selected)) {
					if (year === selected.year && month === selected.month && day === selected.day) {
						return yepnope = true;
					}
				// Multiple selection (ranges)
				} else {
					$.each(selected, function (i, e) {
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
			},

		/**
		* Thead tag, including ARIA and cells with each weekday nawidget.
		* @private
		* @name ch.Calendar#thead
		* @type String
		*/
			thead = (function () {

				// Create thead structure
				var t = ["<thead><tr role=\"row\">"];

				// Add week names
				for (var i = 0; i < 7; i += 1) {
					t.push("<th role=\"columnheader\">" + DAYS_SHORTNAMES[i] + "</th>");
				};

				// Close thead structure
				t.push("</tr></thead>");

				// Join structure and return
				return t.join("");

			}()),

		/**
		* Creates a complete month in a table.
		* @private
		* @function
		* @name ch.Calendar#createTable
		* @param date {Object} Date from will be created the entire month.
		* @return jQuery Object
		*/
			createTable = function (date) {
				// Total amount of days into month
				var cells = (function () {

					// Amount of days of current month
					var currentMonth = new Date(date.year, date.month, 0).getDate(),

					// Amount of days of previous month
						prevMonth = new Date([date.year, date.month, "01"].join("/")).getDay(),

					// Merge amount of previous and current month
						subtotal = prevMonth + currentMonth,

					// Amount of days into last week of month
						latest = subtotal % 7,

					// Amount of days of next month
						nextMonth = (latest > 0) ? 7 - latest : 0;

					return {
						"previous": prevMonth,
						"subtotal": subtotal,
						"total": subtotal + nextMonth
					};

				}()),

				// Final array with month table structure
					r = [
						"<table class=\"ch-calendar-month\" role=\"grid\" id=\"ch-calendar-grid-" + that.uid + "\">",
						"<caption>" + MONTHS_NAMES[date.month - 1] + " - " + date.year + "</caption>",
						thead,
						"<tbody>",
						"<tr class=\"ch-week\" role=\"row\">"
					];

				// Iteration of weekdays
				for (var i = 0; i < cells.total; i += 1) {

					// Push an empty cell on previous and next month
					if (i < cells.previous || i > cells.subtotal - 1) {
						r.push("<td role=\"gridcell\" class=\"ch-calendar-other\">X</td>");
					} else {

						// Positive number of iteration
						var positive = i + 1,

						// Day number
							day = positive - cells.previous,

						// Define if it's the day selected
							isSelected = isSelectable(date.year, date.month, day);

						// Create cell
						r.push(
							// Open cell structure including WAI-ARIA and classnames space opening
							"<td role=\"gridcell\"" + (isSelected ? " aria-selected=\"true\"" : "") + " class=\"ch-calendar-day",

							// Add Today classname if it's necesary
							(date.year === today.year && date.month === today.month && day === today.day) ? " ch-calendar-today" : null,

							// Add Selected classname if it's necesary
							(isSelected ? " ch-calendar-selected" : null),

							// From/to range. Disabling cells
							(
								// Disable cell if it's out of FROM range
								(from && day < from.day && date.month === from.month && date.year === from.year) ||

								// Disable cell if it's out of TO range
								(to && day > to.day && date.month === to.month && date.year === to.year)

							) ? " ch-calendar-disabled" : null,

							// Close classnames attribute and print content closing cell structure
							"\">" + day + "</td>"
						);

						// Cut week if there are seven days
						if (positive % 7 === 0) {
							r.push("</tr><tr class=\"ch-calendar-week\" role=\"row\">");
						}

					}

				};

				// Return table object
				return r.join("");

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
				* @name $prev
				* @memberOf ch.Calendar#arrows
				* @type Object
				*/
				"$prev": $("<p class=\"ch-calendar-prev\" role=\"button\" aria-controls=\"ch-calendar-grid-" + that.uid + "\" aria-hidden=\"false\">" + (($html.hasClass("lt-ie8")) ? "<span></span>" : "") + "</p>").bind("click", function (event) { ch.util.prevent(event); prevMonth(); }),

				/**
				* Handles behavior of next arrow to move forward in months.
				* @private
				* @name $next
				* @memberOf ch.Calendar#arrows
				* @type Object
				*/
				"$next": $("<p class=\"ch-calendar-next\" role=\"button\" aria-controls=\"ch-calendar-grid-" + that.uid + "\" aria-hidden=\"false\">" + (($html.hasClass("lt-ie8")) ? "<span></span>" : "") + "</p>").bind("click", function (event) { ch.util.prevent(event); nextMonth(); }),

				/**
				* Refresh arrows visibility depending on "from" and "to" limits.
				* @private
				* @name update
				* @memberOf ch.Calendar#arrows
				* @function
				*/
				"update": function () {

					// "From" limit
					if (from) {
						// Hide previous arrow when it's out of limit
						if (from.month >= currentDate.month && from.year >= currentDate.year) {
							arrows.$prev.addClass("ch-hide").attr("aria-hidden", "true");
						// Show previous arrow when it's out of limit
						} else {
							arrows.$prev.removeClass("ch-hide").attr("aria-hidden", "false");
						}
					}

					// "To" limit
					if (to) {
						// Hide next arrow when it's out of limit
						if (to.month <= currentDate.month && to.year <= currentDate.year) {
							arrows.$next.addClass("ch-hide").attr("aria-hidden", "true");
						// Show next arrow when it's out of limit
						} else {
							arrows.$next.removeClass("ch-hide").attr("aria-hidden", "false");
						}
					}
				}
			},

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

				"YYYY/MM/DD": function (date) {
					return [date.year, addZero(date.month), addZero(date.day)].join("/");
				},

				"DD/MM/YYYY": function (date) {
					return [addZero(date.day), addZero(date.month), date.year].join("/");
				},

				"MM/DD/YYYY": function (date) {
					return [addZero(date.month), addZero(date.day), date.year].join("/");
				}

			},

		/**
		* Refresh the structure of Calendar's table with a new date.
		* @private
		* @function
		* @name ch.Calendar#updateTable
		* @param date {String} Date to be selected.
		*/
			updateTable = function (date) {

				// Update "currentDate" object
				currentDate = (typeof date === "string") ? createDateObject(date) : date;

				// Delete old table
				that.$element.children("table").remove();

				// Append new table to content
				that.$element.append(createTable(currentDate));

				// Refresh arrows
				arrows.update();

			},

		/**
		* Selects an specific date to show.
		* @private
		* @function
		* @name ch.Calendar#select
		* @param date {Date} Date to be selected.
		* @return itself
		*/
		// TODO: Check "from" and "to" range
			select = function (date) {

				// Update selected date
				selected = date;

				// Create a new table of selected month
				updateTable(selected);

				/**
				* It triggers a callback when a date is selected.
				* @public
				* @name ch.Calendar#select
				* @event
				* @exampleDescription
				* @example
				* widget.on("select",function(){
				* 	sowidget.action();
				* });
				*/
				// Old callback system
				that.callbacks("onSelect");
				// New callback
				that.trigger("select");

				return that;
			},

		/**
		* Move to next month of Calendar.
		* @private
		* @function
		* @name ch.Calendar#nextMonth
		* @return itself
		*/
			nextMonth = function () {

				// Next year
				if (currentDate.month === 12) {
					currentDate.month = 0;
					currentDate.year += 1;
				}

				// Create a new table of selected month
				updateTable([currentDate.year, currentDate.month + 1, "01"].join("/"));

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
				// Callback
				that.callbacks("onNextMonth");
				// New callback
				that.trigger("nextMonth");

				return that;
			},

		/**
		* Move to previous month of Calendar.
		* @private
		* @function
		* @name ch.Calendar#prevMonth
		* @return itself
		*/
			prevMonth = function () {

				// Previous year
				if (currentDate.month === 1) {
					currentDate.month = 13;
					currentDate.year -= 1;
				}

				// Create a new table of selected month
				updateTable([currentDate.year, currentDate.month - 1, "01"].join("/"));

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
				// Callback
				that.callbacks("onPrevMonth");
				// New callback
				that.trigger("prevMonth");

				return that;
			},

		/**
		* Move to next year of Calendar.
		* @private
		* @function
		* @name ch.Calendar#nextYear
		* @return itself
		*/
			nextYear = function () {

				// Create a new table of selected month
				updateTable([currentDate.year + 1, currentDate.month, "01"].join("/"));

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
				// Callback
				that.callbacks("onNextYear");
				// New callback
				that.trigger("nextYear");

				return that;
			},

		/**
		* Move to previous year of Calendar.
		* @private
		* @function
		* @name ch.Calendar#prevYear
		* @return itself
		*/
			prevYear = function () {

				// Create a new table of selected month
				updateTable([currentDate.year - 1, currentDate.month, "01"].join("/"));

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
				// Callback
				that.callbacks("onPrevYear");
				// New callback
				that.trigger("prevYear");

				return that;
			};

	/**
	*  Public Members
	*/

		/**
		 * @borrows ch.Widget#uid as ch.Menu#uid
		 * @borrows ch.Widget#element as ch.Menu#element
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
		that["public"].select = function (date) {

			// Getter
			if (!date) { return FORMAT_DATE[conf.format](selected); }

			// Setter
			select((date === "today") ? today : createDateObject(parseDate(date)));

			return that["public"];

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
		that["public"].selectDay = function (day) {

			var date = createDateObject([currentDate.year, currentDate.month, day].join("/"));

			select(date);

			return FORMAT_DATE[conf.format](date);

		};

		/**
		* Returns date of today
		* @public
		* @since 0.9
		* @name ch.Calendar#today
		* @function
		* @return date
		*/
		that["public"].today = function () {
			return FORMAT_DATE[conf.format](today);
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
		that["public"].next = function (time) {

			switch (time) {
				case "month":
				case undefined:
				default:
					nextMonth();
					break;
				case "year":
					nextYear();
					break;
			}

			return that["public"];
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
		that["public"].prev = function (time) {

			switch (time) {
				case "month":
				case undefined:
				default:
					prevMonth();
					break;
				case "year":
					prevYear();
					break;
			}

			return that["public"];
		};

		/**
		* Reset the Calendar to date of today
		* @public
		* @name ch.Calendar#reset
		* @function
		* @return itself
		*/
		that["public"].reset = function () {
			reset();

			return that["public"];
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
		that["public"].from = function (date) {
			from = createDateObject(date);
			return that["public"];
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
		that["public"].to = function (date) {
			to = createDateObject(date);
			return that["public"];
		};

	/**
	*	Default event delegation
	*/

		// Show or hide arrows depending on "from" and "to" limits
		arrows.update();

		// General creation: classname + arrows + table of month
		that.$element
			.addClass("ch-calendar")
			.prepend(arrows.$prev)
			.prepend(arrows.$next)
			.append(createTable(currentDate));

		// Avoid selection on the component
		ch.util.avoidTextSelection(that.$element);

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
		setTimeout(function () { that.trigger("ready"); }, 50);

		return that['public'];
	}

	Calendar.prototype.name = 'calendar';
	Calendar.prototype.constructor = Calendar;

	ch.factory(Calendar);

}(this, this.jQuery, this.ch));