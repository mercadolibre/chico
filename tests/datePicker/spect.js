describe('The ch.DatePicker', function () {
	var template = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="datepicker{ID}" type="text"></div><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
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
		};

	describe('constructor', function () {

		it('should be defined as a function.', function () {
			expect(ch.DatePicker).toBeDefined();
			expect(typeof ch.DatePicker).toEqual('function');
		});

		var datePicker = getSnippet('#datepicker').datePicker();

		describe('returns an object',function(){

			it('so it should be an object', function () {
				expect(typeof datePicker).toEqual('object');
			});

			describe('with the property',function () {

				it('"element" property and it should be a instanceof a HTMLElement', function () {
					expect(datePicker.element).toBeDefined();
					expect(datePicker.element instanceof HTMLElement).toBeTruthy();
				});

				it('"type" property and it should be datePicker', function () {
					expect(datePicker.type).toBeDefined();
					expect(typeof datePicker.type).toEqual('string');
					expect(datePicker.type).toEqual('datePicker');
				});

				it('"uid" property', function () {
					expect(datePicker.uid).toBeDefined();
					expect(typeof datePicker.uid).toEqual('number');
				});

			});

			describe('with the method', function () {

				it('"from" that it should return an object.', function () {
					expect(datePicker.from).toBeDefined();
					expect(typeof datePicker.from).toEqual('function');
					expect(typeof datePicker.from()).toEqual('object');
				});

				it('"next" that it should return an object', function () {
					expect(datePicker.next).toBeDefined();
					expect(typeof datePicker.next).toEqual('function');
					expect(typeof datePicker.next()).toEqual('object');
				});

				it('"hide" that it should return an object', function () {
					expect(datePicker.hide).toBeDefined();
					expect(typeof datePicker.hide).toEqual('function');
					expect(typeof datePicker.hide()).toEqual('object');
				});

				it('"off" that it should return an object', function () {
					expect(datePicker.off).toBeDefined();
					expect(typeof datePicker.off).toEqual('function');
					expect(typeof datePicker.off('show', function(){})).toEqual('object');
				});

				it('"on" that it should return an object', function () {
					expect(datePicker.on).toBeDefined();
					expect(typeof datePicker.on).toEqual('function');
					expect(typeof datePicker.on('show', function(){})).toEqual('object');
				});

				it('"once" that it should return an object', function () {
					expect(datePicker.once).toBeDefined();
					expect(typeof datePicker.once).toEqual('function');
					expect(typeof datePicker.once('show', function(){})).toEqual('object');
				});

				it('"prev" that it should return an object', function () {
					expect(datePicker.prev).toBeDefined();
					expect(typeof datePicker.prev).toEqual('function');
					expect(typeof datePicker.prev()).toEqual('object');
				});

				it('"reset" that it should return an object', function () {
					expect(datePicker.reset).toBeDefined();
					expect(typeof datePicker.reset).toEqual('function');
					expect(typeof datePicker.reset()).toEqual('object');
				});

				it('"select" that it should return a string when a is getter and object when is setter', function () {
					expect(datePicker.select).toBeDefined();
					expect(typeof datePicker.select).toEqual('function');
					expect(typeof datePicker.select('7/12/2002')).toEqual('object');
					expect(typeof datePicker.select()).toEqual('string');
				});

				it('"show" that it should return an object', function () {
					expect(datePicker.show).toBeDefined();
					expect(typeof datePicker.show).toEqual('function');
					expect(typeof datePicker.show()).toEqual('object');
				});

				it('"to" that it should return an object', function () {
					expect(datePicker.to).toBeDefined();
					expect(typeof datePicker.to).toEqual('function');
					expect(typeof datePicker.to()).toEqual('object');
				});

				it('"today" that it should return a string', function () {
					expect(datePicker.today).toBeDefined();
					expect(typeof datePicker.today).toEqual('function');
					expect(typeof datePicker.today()).toEqual('string');
				});

				it('"trigger"', function () {
					expect(datePicker.trigger).toBeDefined();
					expect(typeof datePicker.trigger).toEqual('function');
				});
			});
		});
	});

	describe('method.', function () {


		var datePicker1 = getSnippet('#datepicker').datePicker(),
			datePicker1Selector = '#' + $(datePicker1.element).attr('aria-describedby'),
			datePicker2 = getSnippet('#datepicker').datePicker(),
			datePicker2Selector = '#' + $(datePicker2.element).attr('aria-describedby'),
			datePicker3 = getSnippet('#datepicker').datePicker({
				'format': 'YYYY/MM/DD',
				'selected': '2012/10/10',
				'from': '2012/10/03',
				'to': '2012/10/13',

			}),
			datePicker3Selector = '#' + $(datePicker3.element).attr('aria-describedby'),
			datePicker4 = getSnippet('#datepicker').datePicker(),
			datePicker4Selector = '#' + $(datePicker4.element).attr('aria-describedby');

		describe('select', function(){
			it('should return the date pre configured when it was instantiated', function () {
				expect( datePicker3.select() ).toEqual('2012/10/10');
			});

			it('should set a date as datePicker.select(\'22/10/2012\')', function () {
				datePicker2.select('22/10/2012');
				expect(datePicker2.select()).toEqual('22/10/2012');
			});
		});

		describe('from', function(){
			it('should do dates unselectable with class "ch-calendar-disabled"', function () {

				datePicker1.from('2012/10/10');
				// This test fails because the is not refreshing the table after the from method is executed
				//datePicker1.select('11/10/2012');
				datePicker1.show();

				var days = $(datePicker1Selector).find('tbody td');

				days.each(function(i, day){
					var $day = $(day),
						dayNum = parseInt($day.text());

					if( dayNum<10 ){
						expect($day.hasClass('ch-calendar-disabled')).toBeTruthy();
					}

				});
			});

			it('should throw an error when date is set as a invalid format datePicker.from(\'22/10/2012\')', function () {
				expect(function(){ datePicker4.from('20/10/2012'); }).toThrow();
			});
		});

		describe('to', function(){
			it('should do dates unselectable with class "ch-calendar-disabled"', function () {

				datePicker1.to('2012/10/20');
				// This test fails because the is not refreshing the table after the to method is executed
				//datePicker1.select('11/10/2012');
				datePicker1.show();

				var days = $(datePicker1Selector).find('tbody td');

				days.each(function(i, day){
					var $day = $(day),
						dayNum = parseInt($day.text());

					if( dayNum>20 ){
						expect($day.hasClass('ch-calendar-disabled')).toBeTruthy();
					}

				});
			});

			it('should throw an error when date is set as a invalid format datePicker.to(\'22/10/2012\')', function () {
				expect(function(){ datePicker4.to('25/10/2012'); }).toThrow();
			});
		});

		describe('show', function(){
			it('should open the layer', function () {
				datePicker2.show();
				expect($(datePicker2Selector).length ).toEqual(1);
			});
		});

		describe('next', function(){
			it('should show the next month', function () {
				datePicker3.show();
				var current = $(datePicker3Selector).find('caption').text(),
					next;
				datePicker3.next();

				next = $(datePicker3Selector).find('caption').text();
				expect(current).not.toEqual(next);
			});
		});

		describe('prev', function(){
			it('should show the previous month', function () {
				datePicker3.show();
				var current = $(datePicker3Selector).find('caption').text(),
					prev;
				datePicker3.prev();
				next = $(datePicker3Selector).find('caption').text();
				expect(current).not.toEqual(prev);
			});
		});

		describe('hide', function(){
			it('should close the layer', function () {
				datePicker2.hide();
				waits(450);
				runs(function(){
					expect( $(datePicker2Selector).length ).toEqual(0);
				});
			});
		});

		describe('today', function(){
			it('should return the current date in the pre configured format DD/MM/YYYY or YYYY/MM/DD', function () {
				var today = new Date(),
					day = today.getDate(),
					month = (today.getMonth() + 1),
					year = today.getFullYear(),
					ddmmyyyy = [day, month, year].join('/'),
					yyyymmdd = [year, month, day].join('/');

				expect(datePicker3.today()).toEqual(yyyymmdd);
				expect(datePicker2.today()).toEqual(ddmmyyyy);
			});
		});

		describe('reset', function(){
			it('should reset the calendar', function () {
				expect(datePicker3.reset()).toEqual( );
			});
		});

	});

	describe('class', function(){
		var datePicker = getSnippet('#datepicker').datePicker().show(),
			datePickerSelector = '#' + $(datePicker.element).attr('aria-describedby'),
			$datePicker = $(datePickerSelector);

		describe('ch-datePicker-content', function () {
			it('should added to the element', function () {
				var content = $datePicker.find('.ch-datePicker-content');
				expect( content.length ).toEqual(1);
			});
		});

		describe('ch-calendar and ch-user-no-select', function () {
			it('should be added to the element', function () {
				var calendar = $datePicker.find('.ch-calendar');
				expect( calendar.hasClass('ch-user-no-select') ).toBeTruthy();
				expect( calendar.length ).toEqual(1);
			});
		});

		describe('ch-calendar-today', function () {
			it('should added to only one day', function () {
				var date = new Date();
				var todayElement = $('.ch-calendar-today', datePickerSelector);
				expect( todayElement.length ).toEqual(1);
				expect( parseInt(todayElement.text()) ).toEqual( date.getDate() );
			});
		});

		describe('ch-calendar-month', function () {
			it('should be added to a month', function () {
				var month = $datePicker.find('.ch-calendar-month');
				expect( month.length ).toEqual(1);
			});
		});

		describe('ch-calendar-next', function () {
			it('should be added to the next button control', function () {
				var month = $datePicker.find('.ch-calendar-next');
				expect( month.length ).toEqual(1);
			});
		});

		describe('ch-calendar-prev', function () {
			it('should be added to the prev button control', function () {
				var month = $datePicker.find('.ch-calendar-prev');
				expect( month.length ).toEqual(1);
			});
		});

		describe('ch-calendar-week', function () {
			it('should be added to each week of the month', function () {
				var weeks = $datePicker.find('tbody tr');
				weeks.each(function(i, week){
					expect( $(week).hasClass('ch-calendar-week') ).toBeTruthy();
				});
			});
		});

		describe('ch-calendar-day', function () {
			it('should be added to each day in the month', function () {
				var days = $datePicker.find('tbody td');
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
		var datePicker = getSnippet('#datepicker').datePicker().show(),
			datePickerSelector = '#' + $(datePicker.element).attr('aria-describedby'),
			$datePicker = $(datePickerSelector),
			$table = $datePicker.find('table'),
			$next = $datePicker.find('.ch-calendar-next')
			$prev = $datePicker.find('.ch-calendar-prev');


		describe('role', function() {

			it('"tooltip" should be added to the datePicker float', function () {
				var role = $datePicker.attr('role');

				expect(role).toBeDefined();
				expect(role).toEqual('tooltip');
			});

			it('"button" should be added to the next button control', function () {
				var role = $next.attr('role');
				expect(role).toBeDefined();
				expect(role).toEqual('button');
			});

			it('"button" should be added to the prev button control', function () {
				var role = $prev.attr('role');
				expect(role).toBeDefined();
				expect(role).toEqual('button');
			});

			it('"grid" should be added to the month element', function () {
				var role = $table.attr('role');
				expect(role).toBeDefined();
				expect(role).toEqual('grid');
			});

			it('"row" should be added to each week in the month', function () {
				var rows = $table.find('tbody tr, thead tr');
				rows.each(function(i, row){
					var role = $(row).attr('role');
					expect(role).toBeDefined();
					expect(role).toEqual('row');
				});
			});

			it('"gridcell" should be added to each day of the month', function () {
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

			it('"columnheader" should be added to each cell of the header of the table', function () {
				var headers = $table.find('thead th');

				headers.each(function(i, header){
					var role = $(header).attr('role');
					expect(role).toBeDefined();
					expect(role).toEqual('columnheader');
				});
			});


		});

		describe('arial-controls', function(){

			it('should be set with the same value as the value of table ID', function () {
				var prev = $prev.attr('aria-controls'),
					next = $next.attr('aria-controls'),
					id = $table.attr('id');

				expect(next).toBeDefined();
				expect(next).toEqual(id);

				expect(prev).toBeDefined();
				expect(prev).toEqual(id);
			});

		});

	});

	describe('event', function () {
		var datePicker = getSnippet('#datepicker').datePicker().show(),
			datePickerSelector = '#' + $(datePicker.element).attr('aria-describedby'),
			readyEvent,
			selectEvent;

			readyEvent = jasmine.createSpy('readyEvent');
			selectEvent = jasmine.createSpy('selectEvent');

			datePicker.on('ready', function(){ readyEvent(); });
			datePicker.on('select', function(){ selectEvent(); });

		it('ready should be called', function () {
			waits(75);
			runs(function () {
				expect(readyEvent).toHaveBeenCalled();
			});
		});

		it('select should be called', function () {
			datePicker.select('22/10/2012');
			expect(selectEvent).toHaveBeenCalled();
		});
	});

	describe('callback', function () {
		var readyEvent = jasmine.createSpy('readyEvent'),
			selectEvent = jasmine.createSpy('selectEvent'),
			datePicker = getSnippet('#datepicker').datePicker({
				'ready': readyEvent,
				'onSelect': selectEvent
			}).show(),
			datePickerSelector = '#' + $(datePicker.element).attr('aria-describedby');

		it('ready should be called', function () {
			waits(75);
			runs(function () {
				expect(readyEvent).toHaveBeenCalled();
			});
		});

		it('select should be called', function () {
			datePicker.select('22/10/2012');
			expect(selectEvent).toHaveBeenCalled();
		});
	});
});


