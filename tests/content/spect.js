describe('Content', function () {
	var test = new ch.Content();

	beforeEach(function () {
		test.content.onmessage = function () {};
		test.content.onerror = function () {};
		test.content.set({'input': 'Content'});
	});

	it('Should be defined as a function', function () {
		expect(ch.util.hasOwn(ch, 'Content')).toBeTruthy();
		expect(typeof ch.Content).toEqual('function');
	});

	it('Should return a new instance of \'ch.Content()\'', function () {
		expect(test).toBeDefined();
		expect(test instanceof ch.Content).toBeTruthy();
	});

	it('Should has a ".content" property', function () {
		expect(ch.util.hasOwn(test, 'content')).toBeTruthy();
		expect(typeof test.content).toEqual('object');
	});

	describe('Methods of public instance', function () {
		var content = test.content,
			current;

		describe('.configure()', function () {

			it('Should be defined into public instance', function () {
				expect(ch.util.hasOwn(content, 'configure')).toBeTruthy();
			});

			it('Should configure the instance', function () {
				var options = {'input': 'Some text!'},
					options2 = {'input': 'Another text!'};

				content.configure(options);
				current = content.configure();

				expect(current.input).toEqual(options.input);

				content.configure(options2);
				current = content.configure();

				expect(current.input).toEqual(options2.input);
			});

		});

		describe('.set()', function () {

			it('Should be defined into public instance', function () {
				expect(ch.util.hasOwn(content, 'set')).toBeTruthy();
			});

			it('Should set a new plain text as content', function () {
				content.set({'input': 'Some text!'});
				current = content.get();

				expect(current).toEqual('Some text!');
			});

			it('Should set a new query Selector as content', function () {
				content.set({'input': $('#invisibleContent')});
				current = content.get();

				expect(current[0].nodeType).toEqual(1);
			});

			it('Should set a new AJAX as content', function () {
				var done = jasmine.createSpy('done');
				content.onmessage = function (data) {
					expect(typeof data).toEqual('string');
					expect(data).toMatch(/This is an example for AJAX calls./);
					done();
				};

				content.set({'input': 'http://ui.ml.com:3040/ajax'});

				waitsFor(function() {
					return done.callCount > 0;
				});
			});

			it('Should use ch.Cache to store the AJAX content', function () {
				var done = jasmine.createSpy('done');
				content.onmessage = function (data) {
					expect(data).toEqual(ch.cache.map['http://ui.ml.com:3040/ajax']);
					done();
				};

				content.set({'input': 'http://ui.ml.com:3040/ajax'});

				waitsFor(function() {
					return done.callCount > 0;
				});
			});

			it('Should set content from the ch.Cache if the input was cached', function () {
				// Gets the content form the cache
				content.set({'input': 'http://ui.ml.com:3040/ajax'});
				current = content.get();
				expect(ch.cache.map['http://ui.ml.com:3040/ajax']).toBeDefined();
				expect(current).toEqual(ch.cache.map['http://ui.ml.com:3040/ajax']);
			});

			it('Should set content always from AJAX when cache is false', function () {
				ch.cache.rem('http://ui.ml.com:3040/ajax');

				var done = jasmine.createSpy('done');

				content.onmessage = function (data) {
					expect(ch.cache.map['http://ui.ml.com:3040/ajax']).not.toBeDefined();
					expect(data).toMatch(/This is an example for AJAX calls./);
					done();
				};

				content.set({
					'input': 'http://ui.ml.com:3040/ajax',
					'cache': false
				});

				waitsFor(function() {
					return done.callCount > 0;
				});

			});

			it('Should set "<p>Error on ajax call.</p>" as content when AJAX request fail', function () {
				var fail = jasmine.createSpy('fail'),
					onError = jasmine.createSpy('onError');

				content.onmessage = function (data) {
					expect(typeof data).toEqual('string');
					expect(data).toMatch(/Error on ajax call./);
					fail();
				};

				content.onerror = function (data) {
					expect(typeof data).toEqual('object');

					expect(ch.util.hasOwn(data, 'jqXHR')).toBeTruthy();
					expect(data.jqXHR).toBeDefined();

					expect(ch.util.hasOwn(data, 'textStatus')).toBeTruthy();
					expect(data.textStatus).toBeDefined();

					expect(ch.util.hasOwn(data, 'errorThrown')).toBeTruthy();
					expect(data.errorThrown).toBeDefined();

					onError();
				};

				content.set({'input': 'http://ui.ml.com:3040/ajaxFail'});

				waitsFor(function() {
					return fail.callCount > 0;
				});

				waitsFor(function() {
					return onError.callCount > 0;
				});
			});

		});

		describe('.get()', function () {
			it('Should be defined into public instance', function () {
				expect(ch.util.hasOwn(content, 'get')).toBeTruthy();
			});

			it('Should be return the current content', function () {
				content.set({'input': 'Some text!'});
				current = content.get();
				expect(current).toEqual('Some text!');
			});
		});

	});
});