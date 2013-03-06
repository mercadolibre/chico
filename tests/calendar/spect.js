describe('The ch.Calendar', function () {
	var template = '<section><div id="calendar{ID}"></div></section>',
		idGenerator = (function(){
			var count = 0;

			return function(){
				return count++;
			}
		}()),
		getSnippet = function(selector){
			var n = idGenerator();
			var f = $(template.replace(/{ID}/g, n));
			var snippet = f.find(selector + n);
			$('body').prepend(f);
			return snippet;
		},
		addZero = function(num) {
			return (parseInt(num, 10) < 10) ? "0" + num : num;
		},
		DATE = (function(){
			var date = new Date(),
				TODAY =  {
					'day': addZero(date.getDate()),
					'month': addZero((date.getMonth() + 1)),
					'year': date.getFullYear()
				},
				FORMAT = {
					'ddmmyyyy': [TODAY.day, TODAY.month, TODAY.year].join('/'),
					'yyyymmdd': [TODAY.year, TODAY.month, TODAY.day].join('/')
				};
			return {
				'TODAY': TODAY,
				'FORMAT': FORMAT
			}
		})();



	describe('constructor', function () {

		it('should be defined as a function', function () {
			expect(ch.Calendar).toBeDefined();
			expect(typeof ch.Calendar).toEqual('function');
		});

		var calendar = getSnippet('#calendar').calendar();

		describe('returns an object',function(){

			it('so it should be an object.', function () {
				expect(typeof calendar).toEqual('object');
			});

			describe('with the property',function () {

				it('"el" that it should be a instanceof a HTMLElement', function () {
					expect(calendar.el).toBeDefined();
					expect(calendar.el instanceof HTMLElement).toBeTruthy();
				});

				it('"name" that it should be calendar', function () {
					expect(calendar.name).toBeDefined();
					expect(typeof calendar.name).toEqual('string');
					expect(calendar.name).toEqual('calendar');
				});

				it('"uid" that should be a number', function () {
					expect(calendar.uid).toBeDefined();
					expect(typeof calendar.uid).toEqual('number');
				});

			});

			describe('with the method', function () {

				it('"from" that it should return an object', function () {
					expect(calendar.from).toBeDefined();
					expect(typeof calendar.from).toEqual('function');
					expect(typeof calendar.from()).toEqual('object');
				});

				it('"next" that it should return an object', function () {
					expect(calendar.next).toBeDefined();
					expect(typeof calendar.next).toEqual('function');
					expect(typeof calendar.next()).toEqual('object');
				});

				it('"off" that it should return an object', function () {
					expect(calendar.off).toBeDefined();
					expect(typeof calendar.off).toEqual('function');
					expect(typeof calendar.off('show', function(){})).toEqual('object');
				});

				it('"on" that it should return an object', function () {
					expect(calendar.on).toBeDefined();
					expect(typeof calendar.on).toEqual('function');
					expect(typeof calendar.on('show', function(){})).toEqual('object');
				});

				it('"once" that it should return an object', function () {
					expect(calendar.once).toBeDefined();
					expect(typeof calendar.once).toEqual('function');
					expect(typeof calendar.once('show', function(){})).toEqual('object');
				});

				it('"prev" that it should return an object', function () {
					expect(calendar.prev).toBeDefined();
					expect(typeof calendar.prev).toEqual('function');
					expect(typeof calendar.prev()).toEqual('object');
				});

				it('"reset" that it should return an object', function () {
					expect(calendar.reset).toBeDefined();
					expect(typeof calendar.reset).toEqual('function');
					expect(typeof calendar.reset()).toEqual('object');
				});

				it('"select" that it should return a string when a is getter and object when is setter', function () {
					expect(calendar.select).toBeDefined();
					expect(typeof calendar.select).toEqual('function');
					expect(typeof calendar.select('2012/12/7')).toEqual('object');
					expect(typeof calendar.select()).toEqual('string');
				});

				it('"selectDay" that it return a string', function () {
					expect(calendar.selectDay).toBeDefined();
					expect(typeof calendar.selectDay).toEqual('function');
					expect(typeof calendar.selectDay(3)).toEqual('string');
				});

				it('"to" that it should return an object', function () {
					expect(calendar.to).toBeDefined();
					expect(typeof calendar.to).toEqual('function');
					expect(typeof calendar.to()).toEqual('object');
				});

				it('"today" method and it should return a string', function () {
					expect(calendar.today).toBeDefined();
					expect(typeof calendar.today).toEqual('function');
					expect(typeof calendar.today()).toEqual('string');
				});

				it('"emit"', function () {
					expect(calendar.emit).toBeDefined();
					expect(typeof calendar.emit).toEqual('function');
				});
			});


		});

	});


	describe('method', function () {

		var calendar1 = getSnippet('#calendar').calendar(),
			calendar1Selector = '#' + calendar1.el.id,
			calendar2 = getSnippet('#calendar').calendar(),
			calendar2Selector = '#' + calendar2.el.id,
			calendar3 = getSnippet('#calendar').calendar({
				'format': 'YYYY/MM/DD',
				'selected': '2012/10/08',
				'from': '2012/10/03',
				'to': '2012/10/13',

			}),
			calendar3Selector = '#' + calendar3.el.id,
			calendar4 = getSnippet('#calendar').calendar(),
			calendar4Selector = '#' + calendar4.el.id;

		describe('select', function(){
			it('should return the date pre configured when it was instantiated', function () {
				expect( calendar3.select() ).toEqual('2012/10/01');
			});

			it('should set a date as calendar.select(\'2013/01/07\')', function () {
				calendar2.select('2013/01/07');
				expect(calendar2.select()).toEqual('07/01/2013');
			});
		});

		describe('selectDay', function(){
			it('should set a date as calendar.select(\'22\'), it returns the complete date as a string', function () {
				expect(calendar2.selectDay('22')).toEqual(('22/' + DATE.TODAY.month + '/' + DATE.TODAY.year));
			});
		});

		describe('from', function(){
			it('should do dates unselectable with class "ch-calendar-disabled"', function () {

				var day = parseInt(DATE.TODAY.day, 10) - 1,
					dayFrom = (day > 0)?addZero(day):DATE.TODAY.day,
					dateFrom = [DATE.TODAY.year, DATE.TODAY.month, dayFrom ].join('/');

				calendar1.select('today');
				calendar1.from(dateFrom);
				// This test fails because the is not refreshing the table after the from method is executed

				var days = $(calendar1Selector).find('tbody td');

				days.each(function(i, day){
					var $day = $(day),
						dayNum = parseInt($day.text());

					if( dayNum<dayFrom ){
						expect($day.hasClass('ch-calendar-disabled')).toBeTruthy();
					}

				});
			});

			it('should throw an error when date is set as a invalid format calendar.from(\'22/10/2012\').', function () {
				expect(function(){ calendar4.from('20/10/2012'); }).toThrow();
			});
		});

		describe('to', function(){
			it('should do dates unselectable with class "ch-calendar-disabled".', function () {
				var day = parseInt(DATE.TODAY.day, 10) + 1,
					dayTo = (day > 28)?addZero(day):DATE.TODAY.day,
					dateTo = [DATE.TODAY.year, DATE.TODAY.month, dayTo ].join('/');

				// select the day of tody today
				calendar1.select('today');

				calendar1.to(dateTo);
				// This test fails because the is not refreshing the table after the to method is executed

				var days = $(calendar1Selector).find('tbody td');

				days.each(function(i, day){
					var $day = $(day),
						dayNum = parseInt($day.text());

					if( dayNum>dayTo ){
						expect($day.hasClass('ch-calendar-disabled')).toBeTruthy();
					}

				});
			});

			it('should throw an error when date is set as a invalid format calendar.to(\'22/10/2012\').', function () {
				expect(function(){ calendar4.to('25/10/2012'); }).toThrow();
			});
		});

		describe('next', function(){
			it('should show the next month.', function () {
				var current = $(calendar3Selector).find('caption').text(),
					next;
				calendar3.next();

				next = $(calendar3Selector).find('caption').text();
				expect(current).not.toEqual(next);
			});
		});

		describe('prev', function(){
			it('should show the previous month.', function () {
				var current = $(calendar3Selector).find('caption').text(),
					prev;
				calendar3.prev();
				next = $(calendar3Selector).find('caption').text();
				expect(current).not.toEqual(prev);
			});
		});

		describe('today', function(){
			it('should return the current date in the pre configured format DD/MM/YYYY or YYYY/MM/DD', function () {
				expect(calendar3.today()).toEqual(DATE.FORMAT.yyyymmdd);
				expect(calendar2.today()).toEqual(DATE.FORMAT.ddmmyyyy);
			});
		});

		describe('reset', function(){
			it('should reset the calendar', function () {
				expect(calendar3.reset()).toEqual( );
			});
		});

	});


	describe('class', function(){
		var calendar = getSnippet('#calendar').calendar(),
			calendarSelector = '#' + calendar.el.id,
			$calendar = $(calendarSelector);

		describe('ch-calendar', function () {
			it('should be added to the element', function () {
				expect( $calendar.hasClass('ch-calendar') ).toBeTruthy();
			});
		});

		describe('ch-calendar-today', function () {
			it('should be added to one cell', function () {
				var date = new Date();
				var todayElement = $('.ch-calendar-today', calendarSelector);
				expect( todayElement.length ).toEqual(1);
				expect( parseInt(todayElement.text()) ).toEqual( date.getDate() );
			});
		})

		describe('ch-calendar-month', function () {
			it('should be added to the table element', function () {
				var month = $calendar.find('.ch-calendar-month');
				expect( month.length ).toEqual(1);
			});
		});

		describe('ch-calendar-next', function () {
			it('should be added to the next button', function () {
				var month = $calendar.find('.ch-calendar-next');
				expect( month.length ).toEqual(1);
			});
		});

		describe('ch-calendar-prev', function () {
			it('should be added to the prev button', function () {
				var month = $calendar.find('.ch-calendar-prev');
				expect( month.length ).toEqual(1);
			});
		});

		describe('ch-calendar-week', function () {
			it('should be added to each week of the month', function () {
				var weeks = $calendar.find('tbody tr');
				weeks.each(function(i, week){
					expect( $(week).hasClass('ch-calendar-week') ).toBeTruthy();
				});
			});
		});

		describe('ch-calendar-day', function () {
			it('should be added to the days, but not empty one', function () {
				var days = $calendar.find('tbody td');
				days.each(function(i, day){
					var $day = $(day);
					var dayNum = parseInt($day.text());
					if( !isNaN(dayNum) && (dayNum >= 1 || dayNum <= 31)) {
						expect( $day.hasClass('ch-calendar-day') ).toBeTruthy();
					}
				});
			});
		});

	});


	describe('WAI-ARIA attribute', function(){
		var calendar = getSnippet('#calendar').calendar(),
			calendarSelector = '#' + calendar.el.id,
			$calendar = $(calendarSelector),
			$table = $calendar.find('table'),
			$next = $calendar.find('.ch-calendar-next'),
			$prev = $calendar.find('.ch-calendar-prev');

		describe('role should be set as', function(){

			it('"button" in the next button control', function () {
				var role = $next.attr('role');
				expect(role).toBeDefined();
				expect(role).toEqual('button');
			});

			it('"button" in the prev button control', function () {
				var role = $prev.attr('role');
				expect(role).toBeDefined();
				expect(role).toEqual('button');
			});

			it('"grid" in the table element', function () {
				var role = $table.attr('role');
				expect(role).toBeDefined();
				expect(role).toEqual('grid');
			});

			it('"row" in each row of the table', function () {
				var rows = $table.find('tbody tr, thead tr');
				rows.each(function(i, row){
					var role = $(row).attr('role');
					expect(role).toBeDefined();
					expect(role).toEqual('row');
				});
			});

			it('"gridcell" in each cell of days of the month', function () {
				var cells = $table.find('tbody td'),
					rows = $table.find('tbody tr'),
					quantity = 7 * rows.length,
					gridcell = 0;

				cells.each(function(i, cell){
					var role = $(cell).attr('role');
					expect(role).toBeDefined();
					expect(role).toEqual('gridcell');
					gridcell += 1;
				});

				expect(gridcell).toEqual(quantity);
			});

			it('"columnheader" in each cell of the header of the month', function () {
				var headers = $table.find('thead th');

				headers.each(function(i, header){
					var role = $(header).attr('role');
					expect(role).toBeDefined();
					expect(role).toEqual('columnheader');
				});
			});

		});

		describe('aria-controls', function () {
			it('should be set with the same value as the value of table ID', function () {
				var prev = $prev.attr('aria-controls'),
					next = $next.attr('aria-controls'),
					id = $table.attr('id');

				expect(prev).toBeDefined();
				expect(prev).toEqual(id);

				expect(next).toBeDefined();
				expect(next).toEqual(id);
			});
		});

	});

	describe('event', function () {
		var calendar = getSnippet('#calendar').calendar(),
			calendarSelector = '#' + calendar.el.id,
			readyEvent,
			selectEvent;

			readyEvent = jasmine.createSpy('readyEvent');
			selectEvent = jasmine.createSpy('selectEvent');

			calendar.on('ready', function(){ readyEvent(); });
			calendar.on('select', function(){ selectEvent(); });

		it('"ready" should been called', function () {
			waits(75);
			runs(function () {
				expect(readyEvent).toHaveBeenCalled();
			});
		});

		it('"select" should been called', function () {
			calendar.select('2013/01/07');
			expect(selectEvent).toHaveBeenCalled();
		});
	});

	describe('callback', function () {
		var readyEvent = jasmine.createSpy('readyEvent'),
			selectEvent = jasmine.createSpy('selectEvent'),
			calendar = getSnippet('#calendar').calendar({
				'ready': readyEvent,
				'onSelect': selectEvent
			}),
			calendarSelector = '#' + calendar.el.id;

		it('"ready" should been called', function () {
			waits(75);
			runs(function () {
				expect(readyEvent).toHaveBeenCalled();
			});
		});

		it('"select" should been called', function () {
			calendar.select('2013/01/07');
			expect(selectEvent).toHaveBeenCalled();
		});
	});

});


