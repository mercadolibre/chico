/**
* Is a simple UI-Component for picking dates.
* @name Calendar
* @class Calendar
* @augments ch.Controllers
* @requires ch.Dropdown
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.format] Sets the date format. By default is "DD/MM/YYYY".
* @param {String} [conf.selected] Sets a date that should be selected by default. By default is the date of today.
* @param {String} [conf.from] Set a maximum selectable date.
* @param {String} [conf.to] Set a minimum selectable date.
* @param {Array} [conf.monthsNames] By default is ["Enero", ... , "Diciembre"].
* @param {Array} [conf.weekdays] By default is ["Dom", ... , "Sab"].
* @returns itself
* @see ch.Dropdown
* @example
* // Create a new calendar with configuration.
* var me = $(".example").calendar({
*     "format": "YYYY/MM/DD",
*     "selected": "2011/12/25",
*     "from": "2010/12/25",
*     "to": "2012/12/25",
*     "monthsNames": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
*     "weekdays": ["Su", "Mo", "Tu", "We", "Thu", "Fr", "Sa"]
* });
* @example
* // Create a new calendar with a class name 'example'.
* var me = $(".example").calendar();
*/

ch.calendar = function (conf) {
	
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Calendar#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);
	conf.format = conf.format || "DD/MM/YYYY";

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.controllers.call(that);
	that.parent = ch.clon(that);

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
	var MONTHS_NAMES = conf.monthsNames || ["Enero", "Febero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],

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
	* @name ch.Calendar#createDate
	* @function
	* @param date
	* @returns Object
	*/	
		createDate = function (date) {
			
			date = new Date(date);

			return {
				/**
				* Number of day.
				* @private
				* @name day
				* @type Number
				* @memberOf ch.Calendar#createDate
				*/
				"day": date.getDate(),
				
				/**
				* Order number of day in a week.
				* @private
				* @name order
				* @type Number
				* @memberOf ch.Calendar#createDate
				*/
				"order": date.getDay(),
				
				/**
				* Number of month.
				* @private
				* @name month
				* @type Number
				* @memberOf ch.Calendar#createDate
				*/
				"month": date.getMonth(),
				
				/**
				* Number of full year.
				* @private
				* @name year
				* @type Number
				* @memberOf ch.Calendar#createDate
				*/
				"year": date.getFullYear()
			};
			
		},

	/**
	* Today's date object.
	* @private
	* @name ch.Calendar#today
	* @type Object
	*/
		today = createDate(),

	/**
	* Minimum selectable date.
	* @private
	* @since 0.9
	* @name ch.Calendar#from
	* @type Object
	*/
		from = (ch.utils.hasOwn(conf, "from") && conf.from !== "today") ? createDate(conf.from) : undefined,

	/**
	* Maximum selectable date.
	* @private
	* @since 0.9
	* @name ch.Calendar#to
	* @type Object
	*/
		to = (ch.utils.hasOwn(conf, "to") && conf.to !== "today") ? createDate(conf.to) : undefined,

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
			var result;
			
			// Parse date
			switch (conf.format) {
			case "DD/MM/YYYY":
				result = value[2] + "/" + value[1] + "/" + value[0];
				break;
			case "MM/DD/YYYY":
				result = value[2] + "/" + value[0] + "/" + value[1];
				break;
			}
			
			return result;
		},

	/**
	* Date of selected day.
	* @private
	* @name ch.Calendar#selected
	* @type Object
	*/
		getSelected = function () {
			
			// Get date from configuration or input value
			var date = conf.selected || conf.msg || (that.element.value !== "" ? parseDate(that.element.value) : undefined);
			
			// Create date object only if there is a date to do
			return (date ? createDate(date) : undefined);
			
		},
	
	/**
	* Date of selected day.
	* @private
	* @name ch.Calendar#selected
	* @type Object
	*/
		selected = getSelected(),
	
	/**
	* The current date that should be shown on calendar.
	* @private
	* @name ch.Calendar#currentDate
	* @type Object
	*/
		currentDate = selected || today;
	
	/**
	* Gives main elements to create a table of a month.
	* @private
	* @name ch.Calendar#table
	* @type Object
	*/
		table = (function () {
			
			// Create thead structure
			var thead = ["<thead><tr role=\"row\">"];
			
			// Add week names
			for (var i = 0; i < 7; i += 1) {
				thead.push("<th role=\"columnheader\">" + DAYS_SHORTNAMES[i] + "</th>");
			};
			
			// Close thead structure
			thead.push("</tr></thead>");
	
			return {
				/**
				* Opening table tag, including classnames, ARIA and id.
				* @private
				* @name opening
				* @type String
				* @memberOf ch.Calendar#table
				*/
				"opening": "<table class=\"ch-calendar-month ch-datagrid\" role=\"grid\" id=\"ch-calendar-grid-" + that.uid + "\">",
				
				/**
				* Opening thead tag, including ARIA and cells with each weekday name.
				* @private
				* @name thead
				* @type String
				* @memberOf ch.Calendar#table
				*/
				"thead": thead.join(""),
				
				/**
				* Opening tr tag, including classnames and ARIA.
				* @private
				* @name row
				* @type String
				* @memberOf ch.Calendar#table
				*/
				"row": "<tr class=\"week\" role=\"row\">"
			};
	
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
				
				// Days of current month
				var days = new Date(date.year, date.month + 1, 0).getDate(),
				
				// Include previous month
					subtotal = days + date.order,
				
				// Days of next month
					remaining = subtotal % 7;

				return {
					"previous": date.order,
					"subtotal": subtotal,
					"total": subtotal + remaining
				};
			
			}()),

			// Final array with month table structure
				r = [
					table.opening,
					"<caption>" + MONTHS_NAMES[date.month] + " - " + date.year + "</caption>",
					table.thead,
					"<tbody>",
					table.row
				];
			
			// Iteration of weekdays
			for (var i = 0; i < cells.total; i += 1) {
				
				// Push an empty cell on previous and next month
				if (i < cells.previous || i > cells.subtotal) {
					r.push("<td role=\"gridcell\" class=\"otherMonth disabled\"></td>");
					continue;
				}
				
				// Positive number of iteration
				var positive = i + 1,
				
				// Day number
					day = positive - cells.previous,
				
				// Define if it's the day selected
					isSelected = selected && date.year === selected.year && date.month === selected.month && day === selected.day;
				
				// Create cell
				r.push(
					// Open cell structure including WAI-ARIA and classnames space opening
					"<td role=\"gridcell\"" + (isSelected ? " aria-selected=\"true\"" : "") + " class=\"day",
					
					// Add Today classname if it's necesary
					(date.year === today.year && date.month === today.month && day === today.day) ? " today" : null,
					
					// Add Selected classname if it's necesary
					(isSelected ? " selected" : null),
					
					// From/to range. Disabling cells
					/*(
						// Disable cell if it's out of FROM range
						(from && day < from.day && date.month === from.month && date.year === from.year) ||
						
						// Disable cell if it's out of TO range
						(to && day > to.day && date.month === to.month && date.year === to.year)
					
					) ? " disabled" : null,
					*/
					// Close classnames attribute and print content closing cell structure
					"\">" + day + "</td>"
				);
				
				// Cut week if there are seven days
				if (positive % 7 === 0) {
					r.push("</tr>" + table.row);
				}
				
			};
			
			// Return table object
			return $(r.join(""));
			
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
			$prev: $("<p class=\"ch-calendar-prev\" aria-controls=\"ch-calendar-grid-" + that.uid + "\"><span>Previous</span></p>").bind("click", function (event) { that.prevent(event); prevMonth(); }),
			
			/**
			* Handles behavior of next arrow to move forward in months.
			* @private
			* @name $next
			* @memberOf ch.Calendar#arrows
			* @type Object
			*/
			$next: $("<p class=\"ch-calendar-next\" aria-controls=\"ch-calendar-grid-" + that.uid + "\"><span>Next</span></p>").bind("click", function (event) { that.prevent(event); nextMonth(); })
		},

	
	
	/**
	* 
	* @private
	* @name ch.Calendar#
	* @type Object
	*/
		$content = $("<div class=\"ch-calendar-content\">")
			// Append table of current month
			.append(createTable(currentDate))
			// Add functionality
			.bind("click", function (event) {
				
				// Event
				event = event || window.event;
				
				// Source event
				var src = event.target || event.srcElement;
	
				/*if (src.nodeName !== "TD" || src.className.indexOf("day") === -1 || src.className.indexOf("disabled") !== -1) {
					that.prevent(event);
					return;
				}*/
				
				// Day selection
				if (src.nodeName === "TD" && src.className.indexOf("disabled") === -1) {
					select(currentDate.year + "/" + currentDate.month + "/" + src.innerHTML);
				}
	
				that["public"].hide();
			}),



	/**
	* Create the component layout.
	* @private
	* @function
	* @name ch.Calendar#createLayout
	*/
		createLayout = function () {
	
			that.float = $("<p class=\"ch-calendar\">Calendar</p>")
				
				// Append next to trigger
				.insertAfter(that.$element)
				
				// Initialize Layer component to be showed
				.layer({
					"event": "click",
					"content": $content
				
				// Show callback
				}).on("show", function () {
					// Old callback system
					that.callbacks.call(that, "onShow");
					// New callback
					that.trigger("show");
				
				// Hide callback
				}).on("hide", function () {
					// Old callback
					that.callbacks.call(that, "onHide");
					// New callback
					that.trigger("hide");
				});
			
			ch.utils.avoidTextSelection($content);
			
			//if (!from || (from.getMonth() <= currentDate.getMonth())) {
				//that.$container.prepend(arrows.$prev);
			//}
		
			//if (!to || (to.getMonth() >= currentDate.getMonth())) {
				//that.$container.prepend(arrows.$next);
			//}
	
		},
	
	
	// TODO: find best name
		normalize = function (num) {
			
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
				return date.year + "/" + normalize(date.month + 1) + "/" + normalize(date.day);
			},
			
			"DD/MM/YYYY": function (date) {
				return normalize(date.day) + "/" + normalize(date.month + 1) + "/" + date.year;
			},
			
			"MM/DD/YYYY": function (date) {
				return normalize(date.month + 1) + "/" + normalize(date.day) + "/" + date.year;
			}
			
		},

	/**
	* Selects an specific date to show.
	* @private
	* @function
	* @name ch.Calendar#select
	* @param date {Date} Date to be selected.
	* @return itself
	*/
		select = function (date) {

			selected = createDate(date);
			
			that.element.value = FORMAT_DATE[conf.format](selected);
			
			// Go to selected month if it's different
			if (selected.month !== currentDate.month || selected.year !== currentDate.year) {
				that.float.content(createTable(selected));
			}
	
			currentDate = selected;
			
			/**
			* Callback function
			* @public
			* @name ch.Calendar#onSelect
			* @event
			*/
			// Old callback system
			that.callbacks("onSelect");
			// New callback
			that.trigger("select");
	
			return that;
		},

	/**
	* Move to next month of calendar.
	* @private
	* @function
	* @name ch.Calendar#nextMonth
	* @return itself
	*/
	//TODO: crear una interfaz que resuleva donde moverse
		nextMonth = function () {
			currentDate = createDate(currentDate.year, currentDate.month + 1, 1);
			
			that.float.content(createTable(currentDate));
	
			//Refresh position
			//that.float.position("refresh");
			//that.$container.prepend(arrows.$prev);
	
			if (to && to.month <= currentDate.month && to.year === currentDate.year) {
				arrows.$next.detach();
			}
	
			// Callback
			that.callbacks("onNextMonth");
			// new callback
			that.trigger("onNextMonth");
			
			return that;
		},

	/**
	* Move to previous month of calendar.
	* @private
	* @function
	* @name ch.Calendar#prevMonth
	* @return itself
	*/
		prevMonth = function () {
	
			currentDate = createDate(currentDate.year, currentDate.month - 1, 1);
	
			that.float.content(createTable(currentDate));
	
			// Refresh position
			//that.float.position("refresh");
			//that.$container.prepend(arrows.$next);
	
			if (from && from.month >= currentDate.month && from.year === currentDate.year) {
				arrows.$prev.detach();
	
				return that;
			}
	
			// Callback
			that.callbacks("onPrevMonth");
			// new callback
			that.trigger("onPrevMonth");
			
			return that;
		},

	/**
	* Move to next year of calendar.
	* @private
	* @function
	* @name ch.Calendar#nextYear
	* @return itself
	*/
		nextYear = function () {
			currentDate = createDate(currentDate.year + 1, currentDate.month, 1);
			
			that.float.content(createTable(currentDate));
	
			return that;
		},

	/**
	* Move to previous year of calendar.
	* @private
	* @function
	* @name ch.Calendar#prevYear
	* @return itself
	*/
		prevYear = function () {
			currentDate = createDate(currentDate.year - 1, currentDate.month, 1);
			
			that.float.content(createTable(currentDate));
	
			return that;
		},

	/**
	* Restart selected date.
	* @private
	* @function
	* @name ch.Calendar#reset
	* @return itself
	*/
		reset = function () {
			
			selected = getSelected();
			
			currentDate = selected || today;
			
			that.element.value = "";
	
			that.float.content(createTable(currentDate));
	
			// Callback
			that.callbacks("onReset");
			// new callback
			that.trigger("onReset");
			
			return that;
		};


/**
*  Protected Members
*/

	

/**
*  Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Calendar#uid
	* @type number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Calendar#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Calendar#type
	* @type string
	*/


	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @function
	* @name ch.Calendar#show
	* @returns itself
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/
	that["public"].show = function () {
		that.float.show();
		
		return that["public"];
	};

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @function
	* @name ch.Calendar#hide
	* @returns itself
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/
	that["public"].hide = function () {
		that.float.hide();

		return that["public"];
	};

	/**
	* Select a specific date or returns the selected date.
	* @public
	* @since 0.9
	* @function
	* @name ch.Calendar#select
	* @param {string} "YYYY/MM/DD".
	* @return itself
	*/
	that["public"].select = function (date) {
		if (typeof date === "undefined") {
			return FORMAT_DATE[conf.format](selected);
		}

		select((date === "today") ? today : parseDate(date));
		
		return that["public"];

	};

	/**
	* Returns date of today
	* @public
	* @since 0.9
	* @function
	* @name ch.Calendar#today
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
	* @return {itself}
	* @default Next month
	*/
	that["public"].next = function (time) {
		
		switch (time) {
			case "month":
			case undefined:
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
	* @param {String} time A string that allows specify if it should move to previous month or year.
	* @return {itself}
	* @default Previous month
	*/
	that["public"].prev = function (time) {
		
		switch (time) {
			case "month":
			case undefined:
				prevMonth();
			break;
			case "year":
				prevYear();
			break;
		}

		return that["public"];
	};

	/**
	* Reset the calendar to date of today
	* @public
	* @function
	* @name ch.Calendar#reset
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
	* @function
	* @name ch.Calendar#from
	* @param {string} "YYYY/MM/DD".
	* @return itself
	*/
	that["public"].from = function (date) {
		from = createDate(date);
		return that["public"];
	};

	/**
	* Set a maximum selectable date.
	* @public
	* @since 0.9
	* @function
	* @name ch.Calendar#to
	* @param {string} "YYYY/MM/DD".
	* @return itself
	*/
	that["public"].to = function (date) {
		to = createDate(date);
		return that["public"];
	};

/**
*	Default event delegation
*/

	that.element.type = "text";

	that.element.value = (selected !== "") ? FORMAT_DATE[conf.format](selected) : "";

	createLayout();

	
	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Calendar#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as calendar's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function () { that.trigger("ready"); }, 50);

	return that;
};

ch.factory("calendar");