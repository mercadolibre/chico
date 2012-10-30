describe('ch.AutoComplete', function () {
	var template = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="autoComplete{ID}" type="text"></div><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
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

	describe('Constructor.', function () {

		it('ch.AutoComplete should be defined as a function.', function () {
			expect(ch.AutoComplete).toBeDefined();
			expect(typeof ch.AutoComplete).toEqual('function');
		});

		describe('Returned Object',function(){
			var input = getSnippet('#autoComplete'),
				aCallBack = function(options){ autoComplete.suggest(options); };

			window.autoComplete = input.autoComplete({
				'url': 'http://www.chico-ui.com.ar/suggest?q=',
				'jsonpCallback': 'aCallBack'
			});

			window.aCallBack = aCallBack;

			it('should be an object.', function () {
				expect(typeof autoComplete).toEqual('object');
			});

			it('has a "element" property and it should be a instanceof a HTMLElement.', function () {
				expect(autoComplete.element).toBeDefined();
				expect(autoComplete.element instanceof HTMLElement).toBeTruthy();
			});

			it('has a "hide" method and it should be a function and return an object.', function () {
				expect(autoComplete.hide).toBeDefined();
				expect(typeof autoComplete.hide).toEqual('function');
				expect(typeof autoComplete.hide()).toEqual('object');
			});

			it('has a "off" method and it should be a function and return an object.', function () {
				expect(autoComplete.off).toBeDefined();
				expect(typeof autoComplete.off).toEqual('function');
				expect(typeof autoComplete.off('show', function(){})).toEqual('object');
			});

			it('has a "on" method and it should be a function and return an object.', function () {
				expect(autoComplete.on).toBeDefined();
				expect(typeof autoComplete.on).toEqual('function');
				expect(typeof autoComplete.on('show', function(){})).toEqual('object');
			});

			it('has a "once" method and it should be a function and return an object.', function () {
				expect(autoComplete.once).toBeDefined();
				expect(typeof autoComplete.once).toEqual('function');
				expect(typeof autoComplete.once('show', function(){})).toEqual('object');
			});

			it('has a "show" method and it should be a function and return an object.', function () {
				expect(autoComplete.show).toBeDefined();
				expect(typeof autoComplete.show).toEqual('function');
				expect(typeof autoComplete.show()).toEqual('object');
			});

			it('has a "suggest" method and it should be a function and return an object.', function () {
				expect(autoComplete.suggest).toBeDefined();
				expect(typeof autoComplete.suggest).toEqual('function');
				expect(typeof autoComplete.suggest([])).toEqual('object');
			});

			it('has a "type" property and it should be autoComplete.', function () {
				expect(autoComplete.type).toBeDefined();
				expect(typeof autoComplete.type).toEqual('string');
				expect(autoComplete.type).toEqual('autoComplete');
			});

			it('has a "uid" property.', function () {
				expect(autoComplete.uid).toBeDefined();
				expect(typeof autoComplete.uid).toEqual('number');
			});

		});

	});

	describe('The list of suggestions',function(){
		var input = getSnippet('#autoComplete'),
			aCallBack = function(options){ autoComplete2.suggest(options); };

		window.autoComplete2 = input.autoComplete({
			'url': 'http://www.chico-ui.com.ar/suggest?q=',
			'jsonpCallback': "aCallBack2"
		});

		window.aCallBack2 = aCallBack;


		input.attr('value', 'ar').focus();

		it('of the first component must not be in the DOM.', function () {
			var list = $('#' + $(window.autoComplete.element).attr('aria-describedby'));
			 expect(list.length).toEqual(0);
		});

		it('of the second component must be in the DOM.', function () {
			var container = $('#' + $(autoComplete2.element).attr('aria-describedby'));
			var list = container.find('.ch-autoComplete-list');
			var item = list.find('li');

			 expect(list.length).toEqual(1);
			 expect(item.length).toEqual(3);
			 expect(container.length).toEqual(1);
		});

		it('must have the correct classes.', function () {
			var list = $('#' + $(autoComplete2.element).attr('aria-describedby'));
			 expect(list.hasClass('ch-autoComplete ch-points-ltlb')).toBeTruthy();
		});

	});

	describe('Methods:', function(){
		var input = getSnippet('#autoComplete'),
			aCallBack = function(options){ autoComplete3.suggest(options); };

		window.autoComplete3 = input.autoComplete({
			'url': 'http://www.chico-ui.com.ar/suggest?q=',
			'jsonpCallback': 'aCallBack'
		});
		window.aCallBack3 = aCallBack;

		it('show', function () {

			autoComplete.show();
			var list = $('#' + $(autoComplete3.element).attr('aria-describedby'));
			expect(list.length).toEqual(1);

		});

		it('hide', function () {
			autoComplete2.hide();
			waits(475);
			runs(function () {
				var list = $('#' + $(autoComplete3.element).attr('aria-describedby'));
				expect(list.length).toEqual(0);
			});
		});

		it('suggest', function () {
			autoComplete2.suggest(['a','b','c']);
			var container = $('#' + $(autoComplete3.element).attr('aria-describedby'));
			var items = container.find('li');
			expect(items.length).toEqual(3);
		});

	});


	describe('Should execute the following events:', function(){
		var input = getSnippet('#autoComplete'),
			aCallBack = function(options){ autoComplete4.suggest(options); },
			readyEvent,
			showEvent,
			hideEvent;

		window.autoComplete4 = input.autoComplete({
			'url': 'http://www.chico-ui.com.ar/suggest?q=',
			'jsonpCallback': 'aCallBack'
		});
		window.aCallBack4 = aCallBack;

		beforeEach(function () {
			readyEvent = jasmine.createSpy('readyEvent');
			showEvent = jasmine.createSpy('showEvent');
			hideEvent = jasmine.createSpy('hideEvent');
		});

		autoComplete4.on('ready', function () { readyEvent(); });
		autoComplete4.on('show', function () { showEvent(); });
		autoComplete4.on('hide', function () { hideEvent(); });

		it('ready', function () {
			waits(75);
			runs(function () {
				expect(readyEvent).toHaveBeenCalled();
			});
		});

		it('show', function () {
			autoComplete.show();
			expect(showEvent.callCount).toEqual(1);
			expect(showEvent).toHaveBeenCalled();
		});

		it('hide', function () {
			autoComplete.hide();
			expect(hideEvent.callCount).toEqual(1);
			expect(hideEvent).toHaveBeenCalled();
		});
	});



});


