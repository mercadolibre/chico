ch.calendar = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Calendar
     */
    var that = this;

	conf = ch.clon(conf);
	that.conf = conf;

/**
 *	Inheritance
 */

	that = ch.controllers.call(that);
	that.parent = ch.clon(that);

/**
 *  Private Members
 */

	var _month_names = conf.month ||["Enero","Febero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

	var _short_weekdays_names = conf.weekdays || ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

	var _today = new Date();
	
	var _selected = conf.selected || _today;

	var _createMonth = function(date){

		var date = new Date(date);

		var _tableMonth = $("<table>").addClass("ch-calendar-month");

		var _currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);

		var _nameMonth = _month_names[_currentMonth.getMonth()] + " - " + _currentMonth.getFullYear();

		var _currentDay = new Date(date.getFullYear(), date.getMonth(), 1);

		var first_day_name = _currentMonth.getDay();

		// ver lo de hightperfomance de zakas
		var _weekdays = "<thead>";
		
		for (var i = 0; i < _short_weekdays_names.length; i += 1) {
			_weekdays += "<th>" + _short_weekdays_names[i] + "</th>";
		};
		
		_weekdays += "</thead>";


		var _weeks = "";
		
		do {

			_weeks += "<tr class=\"week\">";

			for (var i = 0; i < 7; i += 1) {

				if (_currentDay.getDate() == 1) {
					for (var i = 0; i < first_day_name; i += 1) {
						_weeks += "<td class=\"disable\"></td>";
					};
				};

				if (_currentDay.getDate() == _today.getDate() && _currentDay.getMonth() == _today.getMonth() && _currentDay.getFullYear() == _today.getFullYear()) {
					_weeks += "<td class=\"day today\">" + _currentDay.getDate() + "</td>";
				} else {
					_weeks += "<td class=\"day\">" + _currentDay.getDate() + " </td>";
				};
				
				_currentDay.setDate(_currentDay.getDate()+1);

				if ( _currentDay.getMonth() != _currentMonth.getMonth() ) {
					break;
				};

			};

			_weeks += "</tr>";
			
		} while (_currentDay.getMonth() == _currentMonth.getMonth());


		_tableMonth.append("<caption>"+_nameMonth+"</caption>").append(_weekdays).append(_weeks);

		$.each(_tableMonth.find(".day"), function(i, e){
			$(e).bind("click", function(){
				_selected = new Date(_currentMonth.getFullYear(), _currentMonth.getMonth(), this.innerHTML);
				console.log(_selected);
			});
		});

		return _tableMonth;
	};

	var _arrows = {
	
		$prev: $("<p>").addClass("ch-calendar-prev").bind("click", function(event){ that.prevent(event); _prevMonth(); }),
	
		$next: $("<p>").addClass("ch-calendar-next").bind("click", function(event){ that.prevent(event); _nextMonth(); })
	};

	var _createDropdown = function(){

		var _$trigger =	$("<div>").addClass("secondary");
		that.$element.wrap(_$trigger).after(that.$container);
		that.$trigger = that.$element.parent();

		// Dropdown context
		var drop = {};
			drop.uid = that.uid + "#" + 1;
			drop.type = "dropdown";
			drop.element = that.$trigger[0];
			drop.$element = that.$trigger;

		// Dropdown configuration
		var conf = {};
			conf.icon = false;

		that.children.push( ch.dropdown.call(drop, conf) );

		return;
	};

	var _createLayout = function(){

		that.$container = $("<div>").addClass("ch-calendar-container ch-hide");

		that.$content = $("<div>").addClass("ch-calendar-content");

		_createDropdown();
		
		that.$trigger.addClass("ch-calendar");
		
		//_createCarousel();

		return;
	};

	var _nextMonth = function(){
		that.currentDate = new Date(that.currentDate.getFullYear(),that.currentDate.getMonth()+1,1);
		that.$content.html(_createMonth(that.currentDate));

		return that;
	};
	
	var _prevMonth = function(){
		that.currentDate = new Date(that.currentDate.getFullYear(),that.currentDate.getMonth()-1,1);
		that.$content.html(_createMonth(that.currentDate));

		return that;
	};


	var _nextYear = function(){
		that.currentDate = new Date(that.currentDate.getFullYear()+1,that.currentDate.getMonth(),1);
		that.$content.html(_createMonth(that.currentDate));

		return that;
	};

	var _prevYear = function(){
		that.currentDate = new Date(that.currentDate.getFullYear()-1,that.currentDate.getMonth(),1);
		that.$content.html(_createMonth(that.currentDate));

		return that;
	};



/**
 *  Protected Members
 */
	that.currentDate = _today;


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

	that["public"].next = function(){
		_nextMonth();

		return that["public"];
	};

	that["public"].next = function(){
		_nextMonth();

		return that["public"];
	};

	that["public"].prev = function(){
		_prevMonth();

		return that["public"];
	};

	that["public"].nextYear = function(){
		_nextYear();

		return that["public"];
	};

	that["public"].prevYear = function(){
		_prevYear();

		return that["public"];
	};

/**
 *  Default event delegation
 */

	_createLayout();

	that.$content
		.html(_createMonth(_today))
		.appendTo(that.$container);

	that.$container.append( _arrows.$prev ).append( _arrows.$next )


	return that;
		
};
