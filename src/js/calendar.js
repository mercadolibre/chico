/**
* Is a simple UI-Component for picking dates.
* @name Calendar
* @class Calendar
* @augments ch.Controllers
* @requires ch.Dropdown
* @memberOf ch
* @param {Object} conf Object with configuration properties
* @returns {itself}
*/
//TODO: Examples
ch.calendar = function(conf) {
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Calendar#that
	* @type {Object}
	*/
	var that = this;

	conf = ch.clon(conf);

	conf.format = conf.format || "DD/MM/YYYY";
		
	if (ch.utils.hasOwn(conf, "msg")) { conf.msg = ((conf.msg === "today")) ? new Date() : new Date(conf.msg); };
	if (ch.utils.hasOwn(conf, "selected")) { conf.selected = ((conf.selected === "today")) ? new Date() : new Date(conf.selected); };

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.controllers.call(that);
	that.parent = ch.clon(that);

/**
*  Private Members
*/

	/**
	* Collection of months names
	* @private
	* @name ch.Calendar#MONTHS_NAMES
	* @type {Array}
	*/
	//TODO: default in english and snnif browser language
	//TODO: cambiar a sintaxis de constante
	var MONTHS_NAMES = conf.monthsNames ||["Enero","Febero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

	/**
	* Collection of weekdays short names
	* @private
	* @name ch.Calendar#SHORT_WEEK_NAMES
	* @type {Array}
	*/
	//TODO: default in english and snnif browser language
	//TODO: cambiar a sintaxis de constante
	var SHORT_WEEK_NAMES = conf.weekdays || ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

	/**
	* Date of today
	* @private
	* @name ch.Calendar#today
	* @type {Date}
	*/
	var today = new Date();

	/**
	* Date of selected day
	* @private
	* @name ch.Calendar#selected
	* @type {Date}
	*/
	var selected = conf.selected || conf.msg;

	/**
	* Creates tag thead with short name of week days
	* @private
	* @name ch.Calendar#weekdays
	* @function
	* @return {String}
	*/
	//TODO: change to constant syntax
	//TODO: subfijo de render y cambiar el nombre para que sea mas especifico, thead
	var weekdays = (function(){
		
		var weekdaysTitle = "<thead>";
		
		for (var i = 0; i < SHORT_WEEK_NAMES.length; i += 1) {
			weekdaysTitle += "<th>" + SHORT_WEEK_NAMES[i] + "</th>";
		};
		
		return weekdaysTitle += "</thead>";

	}());

	/**
	* HTML Template to months
	* @private
	* @name ch.Calendar#templateMonth
	* @type {jQuery Object}
	*/
	var templateMonth = $("<table>")
		.addClass("ch-calendar-month")
		.append(weekdays)
		.bind("click", function(event){

			event = event || window.event;
			src = event.target || event.srcElement;

			if (src.nodeName !== "TD" || src.className.indexOf("day")) {
				that.prevent(event);
				return;
			};

			select( that.currentDate.getFullYear() + "/" + (that.currentDate.getMonth() + 1) + "/" + src.innerHTML );

		});


	/**
	* Creates a complete month and returns it in a table
	* @private
	* @name ch.Calendar#createMonth
	* @function
	* @return {String}
	*/
	var createMonth = function(date){

		var date = new Date(date);

		var tableMonth = templateMonth.clone(true);

		var currentMonth = {};
			currentMonth.fullDate = new Date(date.getFullYear(), date.getMonth(), 1);
			currentMonth.date = currentMonth.fullDate.getDate();
			currentMonth.day = currentMonth.fullDate.getDay();
			currentMonth.month = currentMonth.fullDate.getMonth();
			currentMonth.year = currentMonth.fullDate.getFullYear();


		var currentDate = {};
			currentDate.fullDate = new Date(date.getFullYear(), date.getMonth(), 1);
			currentDate.date = currentDate.fullDate.getDate();
			currentDate.day = currentDate.fullDate.getDay();
			currentDate.month = currentDate.fullDate.getMonth();
			currentDate.year = currentDate.fullDate.getFullYear();

		var firstWeekday = currentMonth.day;

		var weeks, classToday, classSelected;

		weeks = "<tbody>";

		do {
			
			weeks += "<tr class=\"week\">";

			for (var i = 0; i < 7; i += 1) {

				if (currentDate.date == 1) {
					for (var i = 0; i < firstWeekday; i += 1) {
						weeks += "<td class=\"disable\"></td>";
					};
				};
				
				classToday = (currentDate.date == today.getDate() && currentDate.month == today.getMonth() && currentDate.year == today.getFullYear()) ? " today" : "";

				classSelected = (selected && currentDate.date == selected.getDate() && currentDate.month == selected.getMonth() && currentDate.year == selected.getFullYear()) ? " selected" : "";
				
				weeks += "<td class=\"day" + classToday +  classSelected + "\">" + currentDate.date + "</td>";
				
				currentDate.fullDate.setDate(currentDate.date+1);
				currentDate.date = currentDate.fullDate.getDate();
				currentDate.day = currentDate.fullDate.getDay();
				currentDate.month = currentDate.fullDate.getMonth();
				currentDate.year = currentDate.fullDate.getFullYear();

				if ( currentDate.month != currentMonth.month ) { break; };

			};

			weeks += "</tr>";
			
		} while (currentDate.month == currentMonth.month);

		weeks += "</tbody>";

		tableMonth
			.prepend("<caption>"+MONTHS_NAMES[currentMonth.month] + " - " + currentMonth.year+"</caption>")
			.append(weeks);

		return tableMonth;
	};


	/**
	* Handles behavior of arrows
	* @private
	* @name ch.Calendar#arrows
	* @type {Object}
	*/
	var arrows = {
	
		$prev: $("<p class=\"ch-calendar-prev\">").bind("click", function(event){ that.prevent(event); prevMonth(); }),
	
		$next: $("<p class=\"ch-calendar-next\">").bind("click", function(event){ that.prevent(event); nextMonth(); })
	};

	/**
	* Creates an instance of Dropdown
	* @private
	* @name ch.Calendar#createDropdown
	* @function
	*/
	var createDropdown = function(){
		
		var dropdownTrigger = $("<strong>").html("Calendar");
		
		that.$trigger.append(dropdownTrigger).append(that.$container);

		that.children[0] = that.$trigger.dropdown({
			onShow: function(){
				// onShow callback
				// old callback system
				that.callbacks.call(that, "onShow");
				// new callback
				that.trigger("show");
			},
			onHide: function(){
				// onHide callback
				// old callback system
				that.callbacks.call(that, "onHide");
				// new callback
				that.trigger("hide");
			}
		});

		that.children[0].position({
			context: that.$element,
			points: "lt lb"
		});

	};

	/**
	* Create component's layout
	* @private
	* @name ch.Calendar#createLayout
	* @function
	*/
	var createLayout = function(){

		that.$trigger =	$("<div class=\"secondary ch-calendar\">");

		that.$container = $("<div class=\"ch-calendar-container ch-hide\">");

		that.$content = $("<div class=\"ch-calendar-content\">");

		that.$element.after(that.$trigger);

		createDropdown();

	};

	/**
	* Parse string to YY/MM/DD format date
	* @private
	* @name ch.Calendar#parseDate 	
	 * @function
	*/
	var parseDate = function(value){
		var date = value.split("/");
		
		switch (conf.format) {
			case "DD/MM/YYYY":
				return date[2] + "/" + date[1] + "/" + date[0];
			break;
			
			case "MM/DD/YYYY":
				return date[2] + "/" + date[0] + "/" + date[1];
			break;
		};
	};


	/**
	* Map of formart's date
	* @private
	* @name ch.Calendar#FORMAT_DATE
	* @type {Object}
	*/
	var FORMAT_DATE = {
		"YYYY/MM/DD": function(date){ return  date.getFullYear() + "/" + (parseInt(date.getMonth(), 10) + 1 < 10 ? '0' : '') + (parseInt(date.getMonth(), 10) + 1) + "/" + (parseInt(date.getDate(), 10) < 10 ? '0' : '') + date.getDate(); },
		"DD/MM/YYYY": function(date){ return (parseInt(date.getDate(), 10) < 10 ? '0' : '') + date.getDate() + "/" + (parseInt(date.getMonth(), 10) + 1 < 10 ? '0' : '') + (parseInt(date.getMonth(), 10) + 1) + "/" + date.getFullYear()},
		"MM/DD/YYYY": function(date){ return (parseInt(date.getMonth(), 10) + 1 < 10 ? '0' : '') + "/" + (parseInt(date.getMonth(), 10) + 1) + "/" + date.getFullYear()}
	};


	/**
	* Selects an specific date to show
	* @private
	* @name ch.Calendar#select
	* @function
	* @return {itself}
	*/
	var select = function(date){

		selected = new Date(date);

		that.currentDate = selected;
		
		that.$content.html(createMonth(selected));
		
		that.element.value = FORMAT_DATE[conf.format](selected);

		/**
		* Callback function
		* @public
		* @name ch.Calendar#onSelect
		* @event
		*/
		// old callback system
		that.callbacks("onSelect");
		// new callback
		that.trigger("select");

		return that;
	};

	/**
	* Move to next month of calendar
	* @private
	* @name ch.Calendar#nextMonth
	* @function
	* @return {itself}
	*/
	//TODO: crear una interfaz que resuleva donde moverse
	var nextMonth = function(){
		that.currentDate = new Date(that.currentDate.getFullYear(),that.currentDate.getMonth()+1,1);
		that.$content.html(createMonth(that.currentDate));

		// Callback
		that.callbacks("onNextMonth");
		// new callback
		that.trigger("onNextMonth");
		
		return that;
	};

	/**
	* Move to prev month of calendar
	* @private
	* @name ch.Calendar#prevMonth
	* @function
	* @return {itself}
	*/
	var prevMonth = function(){
		that.currentDate = new Date(that.currentDate.getFullYear(),that.currentDate.getMonth()-1,1);
		that.$content.html(createMonth(that.currentDate));

		// Callback
		that.callbacks("onPrevMonth");
		// new callback
		that.trigger("onPrevMonth");
		
		return that;
	};

	/**
	* Move to next year of calendar
	* @private
	* @name ch.Calendar#nextYear
	* @function
	* @return {itself}
	*/
	var nextYear = function(){
		that.currentDate = new Date(that.currentDate.getFullYear()+1,that.currentDate.getMonth(),1);
		that.$content.html(createMonth(that.currentDate));

		return that;
	};

	/**
	* Move to prev year of calendar
	* @private
	* @name ch.Calendar#prevYear
	* @function
	* @return {itself}
	*/
	var prevYear = function(){
		that.currentDate = new Date(that.currentDate.getFullYear()-1,that.currentDate.getMonth(),1);
		that.$content.html(createMonth(that.currentDate));

		return that;
	};

	/**
	* Move to prev year of calendar
	* @private
	* @name ch.Calendar#reset
	* @function
	* @return {itself}
	*/
	var reset = function(){
		selected = conf.selected;
		that.currentDate = selected || today;
		that.element.value = "";

		that.$content.html(createMonth(that.currentDate));

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
	* The current date that should show on calendar
	* @protected
	* @name ch.Calendar#currentDate
	* @type {Date}
	*/
	that.currentDate = selected || today;

/**
*  Public Members
*/
 
	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Calendar#uid
	* @type {Number}
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Calendar#element
	* @type {HTMLElement}
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Calendar#type
	* @type {String}
	*/


	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Calendar#show
	* @function
	* @returns {itself}
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/
	that["public"].show = function(){
		that.children[0].show();
		
		return that["public"];
	};

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Calendar#hide
	* @function
	* @returns {itself}
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/
	that["public"].hide = function(){
		that.children[0].hide();

		return that["public"];
	};

	/**
	* Select a specific date.
	* @public
	 * @name ch.Calendar#select
	* @function
	* @param {String} "YY/MM/DD".
	* @return {itself}
	* @TODO: Make select() method a get/set member
	*/
	that["public"].select = function(date){

		select(((date === "today")? today : parseDate(date)));

		return that["public"];
	};

	/**
	* Returns the selected date
	* @public
	* @name ch.Calendar#getSelected
	* @function
	* @return {itself}
	* @TODO: Unifiy with select() method.
	*/
	that["public"].getSelected = function(){
		return FORMAT_DATE[conf.format](selected);
	};

	/**
	* Returns date of today
	* @public
	* @name ch.Calendar#getToday
	* @function
	* @return {Date}
	*/
	that["public"].getToday = function(){
		return FORMAT_DATE[conf.format](today);
	};	

	/**
	* Move to the next month
	* @public
	* @name ch.Calendar#next
	* @function
	* @return {itself}
	*/
	that["public"].next = function(){
		nextMonth();

		return that["public"];
	};

	/**
	* Move to the prev month
	* @public
	* @name ch.Calendar#prev
	* @function
	* @return {itself}
	*/
	that["public"].prev = function(){
		prevMonth();

		return that["public"];
	};

	/**
	* Move to the next year
	* @public
	* @name ch.Calendar#nextYear
	* @function
	* @return {itself}
	*/
	that["public"].nextYear = function(){
		nextYear();

		return that["public"];
	};

	/**
	* Move to the prev year
	* @public
	* @name ch.Calendar#prevYear
	* @function
	* @return {itself}
	*/
	that["public"].prevYear = function(){
		prevYear();

		return that["public"];
	};

	/**
	* Reset the calendar to date of today
	* @public
	* @name ch.Calendar#reset
	* @function
	* @return {itself}
	*/
	that["public"].reset = function(){
		reset();

		return that["public"];
	};

/**
*  Default event delegation
*/

	that.element.type = "text";

	that.element.value = ((selected) ? FORMAT_DATE[conf.format](selected) : "");

	createLayout();

	that.$content
		.html(createMonth(that.currentDate))
		.appendTo(that.$container);

	that.$container.prepend(arrows.$prev).prepend(arrows.$next);

	return that;
		
};