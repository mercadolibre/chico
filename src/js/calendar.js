/**
 * Calendar UI-Component for static and dinamic content.
 * @name Calendar
 * @class Calendar
 * @augments ch.Controllers
 * @requires ch.Dropdown
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 */
//TODO: Examples
ch.calendar = function(conf) {
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Calendar
     */
    var that = this;

	conf = ch.clon(conf);

	conf.format = conf.format || "DD/MM/YYYY";
		
	if (ch.utils.hasOwn(conf, "msg")) { conf.selected = ((conf.msg === "today")) ? new Date() : new Date(conf.msg); };
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
     * @name _monthsNames
     * @type {Array}
     * @memberOf ch.Calendar
     */
	//TODO: default in english and snnif browser language
	//TODO: cambiar a sintaxis de constante
	var _monthsNames = conf.monthsNames ||["Enero","Febero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

    /**
     * Collection of weekdays short names
     * @private
     * @name _shortWeekdaysNames
     * @type {Array}
     * @memberOf ch.Calendar
     */
	//TODO: default in english and snnif browser language
	//TODO: cambiar a sintaxis de constante
	var _shortWeekdaysNames = conf.weekdays || ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

    /**
     * Date of today
     * @private
     * @name _today
     * @type {Date}
     * @memberOf ch.Calendar
     */
	var _today = new Date();

    /**
     * Date of selected day
     * @private
     * @name _selected
     * @type {Date}
     * @memberOf ch.Calendar
     */
	var _selected = conf.selected;

    /**
     * Creates tag thead with short name of week days
     * @private
     * @function 
     * @name name _weekdays
     * @memberOf ch.Calendar
     */
	//TODO: change to constant syntax
	//TODO: subfijo de render y cambiar el nombre para que sea mas especifico, thead
	var _weekdays = (function(){
		
		var _weekdaysTitle = "<thead>";
		
		for (var i = 0; i < _shortWeekdaysNames.length; i += 1) {
			_weekdaysTitle += "<th>" + _shortWeekdaysNames[i] + "</th>";
		};
		
		return _weekdaysTitle += "</thead>";

	}());

	/**
     * HTML Template to months
     * @private
     * @name _templateMonth
	 * @type {jQuery Object}
     * @memberOf ch.Calendar
     */
	var _templateMonth = $("<table>")
		.addClass("ch-calendar-month")
		.append(_weekdays)
		.bind("click", function(event){

			event = event || window.event;
			src = event.target || event.srcElement;

			if (src.nodeName !== "TD" || src.className.indexOf("day")) {
				that.prevent(event);
				return;
			};

			_select( that.currentDate.getFullYear() + "/" + (that.currentDate.getMonth() + 1) + "/" + src.innerHTML );

		});


    /**
     * Creates a complete month and returns it in a table
     * @private
     * @function 
     * @name name _createMonth
     * @memberOf ch.Calendar
     */
	var _createMonth = function(date){

		var date = new Date(date);

		var _tableMonth = _templateMonth.clone(true);

		var _currentMonth = {};
			_currentMonth.fullDate = new Date(date.getFullYear(), date.getMonth(), 1);
			_currentMonth.date = _currentMonth.fullDate.getDate();
			_currentMonth.day = _currentMonth.fullDate.getDay();
			_currentMonth.month = _currentMonth.fullDate.getMonth();
			_currentMonth.year = _currentMonth.fullDate.getFullYear();


		var _currentDate = {};
			_currentDate.fullDate = new Date(date.getFullYear(), date.getMonth(), 1);
			_currentDate.date = _currentDate.fullDate.getDate();
			_currentDate.day = _currentDate.fullDate.getDay();
			_currentDate.month = _currentDate.fullDate.getMonth();
			_currentDate.year = _currentDate.fullDate.getFullYear();

		var first_weekday = _currentMonth.day;

		var _weeks, _classToday, _classSelected;

		_weeks = "<tbody>";

		do {
			
			_weeks += "<tr class=\"week\">";

			for (var i = 0; i < 7; i += 1) {

				if (_currentDate.date == 1) {
					for (var i = 0; i < first_weekday; i += 1) {
						_weeks += "<td class=\"disable\"></td>";
					};
				};
				
				_classToday = (_currentDate.date == _today.getDate() && _currentDate.month == _today.getMonth() && _currentDate.year == _today.getFullYear()) ? " today" : "";

				_classSelected = (_selected && _currentDate.date == _selected.getDate() && _currentDate.month == _selected.getMonth() && _currentDate.year == _selected.getFullYear()) ? " selected" : "";
				
				_weeks += "<td class=\"day" + _classToday +  _classSelected + "\">" + _currentDate.date + "</td>";
				
				_currentDate.fullDate.setDate(_currentDate.date+1);
				_currentDate.date = _currentDate.fullDate.getDate();
				_currentDate.day = _currentDate.fullDate.getDay();
				_currentDate.month = _currentDate.fullDate.getMonth();
				_currentDate.year = _currentDate.fullDate.getFullYear();

				if ( _currentDate.month != _currentMonth.month ) { break; };

			};

			_weeks += "</tr>";
			
		} while (_currentDate.month == _currentMonth.month);

		_weeks += "</tbody>";

		_tableMonth
			.prepend("<caption>"+_monthsNames[_currentMonth.month] + " - " + _currentMonth.year+"</caption>")
			.append(_weeks);

		return _tableMonth;
	};


    /**
     * Handles behavior of arrows
     * @private
     * @name _arrows
     * @type {Object}
     * @memberOf ch.Calendar
     */
	var _arrows = {
	
		$prev: $("<p class=\"ch-calendar-prev\">").bind("click", function(event){ that.prevent(event); _prevMonth(); }),
	
		$next: $("<p class=\"ch-calendar-next\">").bind("click", function(event){ that.prevent(event); _nextMonth(); })
	};

    /**
     * Creates an instance of Dropdown
     * @private
     * @function 
     * @name name _createDropdown
     * @memberOf ch.Calendar
     */
	var _createDropdown = function(){
		
		var _dropdownTrigger = $("<strong>").html("Calendar");
		
		that.$trigger.append(_dropdownTrigger).append(that.$container);

		that.children[0] = that.$trigger.dropdown({
			onShow: function(){
				// onShow callback
				that.callbacks.call(that, "onShow");
			},
			onHide: function(){
				// onHide callback
				that.callbacks.call(that, "onHide");
			}
		});

		that.children[0].position({
			context: that.$element,
			points: "lt lb"
		});

		return;
	};

     /**
     * Create component's layout
     * @private
	 * @function
     * @name _createLayout
     * @memberOf ch.Calendar
     */
	var _createLayout = function(){

		that.$trigger =	$("<div class=\"secondary ch-calendar\">");

		that.$container = $("<div class=\"ch-calendar-container ch-hide\">");

		that.$content = $("<div class=\"ch-calendar-content\">");

		that.$element.after(that.$trigger);

		_createDropdown();

		return;
	};

     /**
     * Parse string to YY/MM/DD format date
     * @private
	 * @function
     * @name _parseDate
     * @memberOf ch.Calendar
     */
	var _parseDate = function(value){
		var _date = value.split("/");
		
		switch (conf.format) {
			case "DD/MM/YYYY":
				return _date[2] + "/" + _date[1] + "/" + _date[0];
			break;
			
			case "MM/DD/YYYY":
				return _date[2] + "/" + _date[0] + "/" + _date[1];
			break;
		};
	};


    /**
     * Map of formart's date
     * @private
     * @name _FORMAT_DATE
     * @memberOf ch.Calendar
     */
	var _FORMAT_DATE = {
		"YYYY/MM/DD": function(date){ return  date.getFullYear() + "/" + (parseInt(date.getMonth(), 10) + 1 < 10 ? '0' : '') + (parseInt(date.getMonth(), 10) + 1) + "/" + (parseInt(date.getDate(), 10) < 10 ? '0' : '') + date.getDate(); },
		"DD/MM/YYYY": function(date){ return (parseInt(date.getDate(), 10) < 10 ? '0' : '') + date.getDate() + "/" + (parseInt(date.getMonth(), 10) + 1 < 10 ? '0' : '') + (parseInt(date.getMonth(), 10) + 1) + "/" + date.getFullYear()},
		"MM/DD/YYYY": function(date){ return (parseInt(date.getMonth(), 10) + 1 < 10 ? '0' : '') + "/" + (parseInt(date.getMonth(), 10) + 1) + "/" + date.getFullYear()}
	};


    /**
     * Selects an specific date to show
     * @private
	 * @function
     * @name _select
     * @memberOf ch.Calendar
     */
	var _select = function(date){

		_selected = new Date(date);

		that.currentDate = _selected;
		
		that.$content.html(_createMonth(_selected));
		
		that.element.value = _FORMAT_DATE[conf.format](_selected);

       /**
        * Callback function
        * @name onSelect
        * @type {Function}
        * @memberOf ch.Calendar
        */

		that.callbacks("onSelect");

		return that;
	};

     /**
     * Move to next month of calendar
     * @private
	 * @function
     * @name _nextMonth
     * @memberOf ch.Calendar
     */
    //TODO: crear una interfaz que resuleva donde moverse
	var _nextMonth = function(){
		that.currentDate = new Date(that.currentDate.getFullYear(),that.currentDate.getMonth()+1,1);
		that.$content.html(_createMonth(that.currentDate));

		// Callback
		that.callbacks("onNextMonth");

		return that;
	};

     /**
     * Move to prev month of calendar
     * @private
	 * @function
     * @name _prevMonth
     * @memberOf ch.Calendar
     */
	var _prevMonth = function(){
		that.currentDate = new Date(that.currentDate.getFullYear(),that.currentDate.getMonth()-1,1);
		that.$content.html(_createMonth(that.currentDate));

		// Callback
		that.callbacks("onPrevMonth");

		return that;
	};

     /**
     * Move to next year of calendar
     * @private
	 * @function
     * @name _nextYear
     * @memberOf ch.Calendar
     */
	var _nextYear = function(){
		that.currentDate = new Date(that.currentDate.getFullYear()+1,that.currentDate.getMonth(),1);
		that.$content.html(_createMonth(that.currentDate));

		return that;
	};

     /**
     * Move to prev year of calendar
     * @private
	 * @function
     * @name _prevYear
     * @memberOf ch.Calendar
     */
	var _prevYear = function(){
		that.currentDate = new Date(that.currentDate.getFullYear()-1,that.currentDate.getMonth(),1);
		that.$content.html(_createMonth(that.currentDate));

		return that;
	};

     /**
     * Move to prev year of calendar
     * @private
	 * @function
     * @name _reset
     * @memberOf ch.Calendar
     */
	var _reset = function(){
		_selected = conf.selected;
		that.currentDate = _selected || _today;
		that.element.value = "";

		that.$content.html(_createMonth(that.currentDate));

		// Callback
		that.callbacks("onReset");

		return that;
	};


/**
 *  Protected Members
 */

    /**
     * The current date that should show on calendar
     * @private
     * @name currentDate
     * @type {Date}
     * @memberOf ch.Calendar
     */
	that.currentDate = _selected || _today;

/**
 *  Public Members
 */
 
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Calendar
     */
   	that["public"].uid = that.uid;
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Calendar
     */
	that["public"].element = that.element;
    
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Calendar
     */	
	that["public"].type = that.type;

    /**
     * Open calendar
     * @public
     * @function
     * @name show
     * @memberOf ch.Calendar
     */
	that["public"].show = function(){
		that.children[0].show();
		
		return that["public"];
	};

    /**
     * Open calendar
     * @public
     * @function
     * @name hide
     * @memberOf ch.Calendar
     */
	that["public"].hide = function(){
		that.children[0].hide();

		return that["public"];
	};

    /**
     * Select a specific date.
     * @public
     * @function
     * @name select
     * @param {String} "YY/MM/DD".
     * @memberOf ch.Calendar
     */
	that["public"].select = function(date){

		_select(((date === "today")? _today : _parseDate(date)));

		return that["public"];
	};

    /**
     * Returns the selected date
     * @public
     * @function
     * @name getSelected
     * @memberOf ch.Calendar
     */
	that["public"].getSelected = function(){
		return _FORMAT_DATE[conf.format](_selected);
	};

    /**
     * Returns date of today
     * @public
     * @function
     * @name getToday
     * @memberOf ch.Calendar
     */
	that["public"].getToday = function(){
		return _FORMAT_DATE[conf.format](_today);
	};	

    /**
     * Move to the next month
     * @public
     * @function
     * @name next
     * @memberOf ch.Calendar
     */
	that["public"].next = function(){
		_nextMonth();

		return that["public"];
	};

    /**
     * Move to the prev month
     * @public
     * @function
     * @name prev
     * @memberOf ch.Calendar
     */
	that["public"].prev = function(){
		_prevMonth();

		return that["public"];
	};

    /**
     * Move to the next year
     * @public
     * @function
     * @name nextYear
     * @memberOf ch.Calendar
     */
	that["public"].nextYear = function(){
		_nextYear();

		return that["public"];
	};

    /**
     * Move to the prev year
     * @public
     * @function
     * @name prevYear
     * @memberOf ch.Calendar
     */
	that["public"].prevYear = function(){
		_prevYear();

		return that["public"];
	};

    /**
     * Reset the calendar to date of today
     * @public
     * @function
     * @name reset
     * @memberOf ch.Calendar
     */
	that["public"].reset = function(){
		_reset();

		return that["public"];
	};

/**
 *  Default event delegation
 */

	that.element.type = "text";
	that.element.value = _FORMAT_DATE[conf.format](conf.selected) || "";

	_createLayout();

	that.$content
		.html(_createMonth(that.currentDate))
		.appendTo(that.$container);

	that.$container.prepend(_arrows.$prev).prepend(_arrows.$next);

	return that;
		
};