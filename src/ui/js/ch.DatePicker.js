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
		$document = $(window.document);

	function DatePicker($el, conf) {

		/**
		* Reference to a internal component instance, saves all the information and configuration properties.
		* @private
		* @name ch.DatePicker#that
		* @type object
		*/
		var that = this;

		that.$element = $el;
		that.element = $el[0];
		that.type = 'datePicker';
		conf = conf || {};

		conf = ch.util.clone(conf);

		// Configuration by default
		conf.format = conf.format || "DD/MM/YYYY";
		conf.points = conf.points || "ct cb";
		conf.closable = ch.util.hasOwn(conf, "closable") ? conf.closable : true;

		that.conf = conf;

	/**
	*	Inheritance
	*/

		that = ch.Controls.call(that);
		that.parent = ch.util.clone(that);

	/**
	*	Private Members
	*/

	/**
	*	Protected Members
	*/

		/**
		* Pick a date in the Calendar and updates the input data.
		* @protected
		* @function
		* @name ch.DatePicker#process
		*/
		that.process = function (event) {

			// Day selection
			if (event.target.nodeName !== "TD" || event.target.className.indexOf("ch-calendar-disabled") !== -1 || event.target.className.indexOf("ch-calendar-other") !== -1) {
				return;
			}

			// Select the day and update input value with selected date

			that.element.value = that.calendar.selectDay(event.target.innerHTML);

			// Hide float
			if (conf.closable) { that["float"].innerHide(); }

			/**
			* Callback function
			* @public
			* @name ch.DatePicker#select
			* @event
			*/
			// Old callback system
			that.callbacks("onSelect");
			// New callback
			that.trigger("select");

		};


		/**
		* Reference to the Calendar component instance.
		* @protected
		* @type Object
		* @name ch.DatePicker#calendar
		*/
		that.calendar = $("<div>")
			// Add functionality for date selection
			.on("click", function (event) { that.process(event); })
			// Instance Calendar component
			.calendar({
				"format": conf.format,
				"from": conf.from,
				"to": conf.to,
				"selected": conf.selected,
				"monthsNames": conf.monthsNames,
				"weekdays": conf.weekdays
			});

		/**
		* Reference to the Float component instanced.
		* @protected
		* @type Object
		* @name ch.DatePicker#float
		*/
		that["float"] = that.createFloat({
			"$element": $("<i role=\"button\" class=\"ch-datePicker-trigger ch-icon-calendar\"></i>").insertAfter(that.element),
			"content": that.calendar.element,
			"points": conf.points,
			"offset": "-1 8",
			"aria": {
				"role": "tooltip",
				"identifier": "aria-describedby"
			},
			"closeButton": false,
			"cone": true
		});

	/**
	*  Public Members
	*/

		/**
		* @borrows ch.Object#uid as ch.Menu#uid
		*/

		/**
		* @borrows ch.Object#element as ch.Menu#element
		*/

		/**
		* @borrows ch.Object#type as ch.Menu#type
		*/

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
		that["public"].show = function () {

			that["float"].innerShow();

			return that["public"];
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
		that["public"].hide = function () {
			that["float"].innerHide();

			return that["public"];
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
		that["public"].select = function (date) {
			// Select the day and update input value with selected date
			// Setter
			if (date) {
				that.calendar.select(date);
				that.element.value = that.calendar.select();

				return that["public"];
			}

			// Getter
			return that.calendar.select();
		};

		/**
		* Returns date of today
		* @public
		* @since 0.9
		* @name ch.DatePicker#today
		* @function
		* @return date
		*/
		that["public"].today = function () {
			return that.calendar.today();
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
		that["public"].next = function (time) {
			that.calendar.next(time);

			return that["public"];
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
		that["public"].prev = function (time) {
			that.calendar.prev(time);

			return that["public"];
		};

		/**
		* Reset the Date Picker to date of today
		* @public
		* @name ch.DatePicker#reset
		* @function
		* @return itself
		*/
		that["public"].reset = function () {

			// Delete input value
			that.element.value = "";

			that.calendar.reset();

			return that["public"];
		};

		/**
		* Set a minimum selectable date.
		* @public
		* @name ch.DatePicker#from
		* @function
		* @param {string} "YYYY/MM/DD".
		* @return itself
		*/
		that["public"].from = function (date) {
			that.calendar.from(date);

			return that["public"];
		};

		/**
		* Set a maximum selectable date.
		* @public
		* @name ch.DatePicker#to
		* @function
		* @param {string} "YYYY/MM/DD".
		* @return itself
		*/
		that["public"].to = function (date) {
			that.calendar.to(date);

			return that["public"];
		};


	/**
	*	Default event delegation
	*/

		// Change type of input to "text"
		that.element.type = "text";

		// Change value of input if there are a selected date
		that.element.value = (conf.selected) ? that.calendar.select() : that.element.value;

		// Add show behaivor to float's trigger.
		that["float"].$element.on("click", function (event) {
			that["float"].innerShow(event);
		});

		/**
		* Triggers when the component is ready to use (Since 0.8.0).
		* @name ch.DatePicker#ready
		* @event
		* @public
		* @exampleDescription Following the first example, using <code>widget</code> as Date Picker's instance controller:
		* @example
		* widget.on("ready", function () {
		* 	this.show();
		* });
		*/
		setTimeout(function () { that.trigger("ready"); }, 50);

		return that['public'];
	}

	DatePicker.prototype.name = 'datePicker';
	DatePicker.prototype.constructor = DatePicker;

	ch.factory(DatePicker);

}(this, this.jQuery, this.ch));