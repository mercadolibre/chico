/**
 * @todo "width" and "height" as parameter
 */
describe('Modal', function () {

	var $invisible = $('#invisibleContent'),
		modal1 = $('#modal1').modal(),
		modal2 = $('#modal2').modal({
			'classes': 'test',
			'content': $('#invisibleContent'),
			'closable': true
		}),
		modal3 = $('#modal3').modal({
			'content': '<p>foo</p>',
			'closable': false
		}),
		modal4 = $('#modal4').modal({
			'closable': 'button',
			'width': 500
		}),
		modal5 = $('#modal5').modal({
			'content': '/ajax',
			'event': 'click'
		});


	it('should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Modal')).toBeTruthy();
		expect(typeof ch.Modal).toEqual('function');
	});

	describe('Should have the following public properties:', function () {

		it('.element', function () {
			expect(ch.util.hasOwn(modal1, 'element')).toBeTruthy();
			expect(modal1.element.nodeType).toEqual(1);
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(modal1, 'type')).toBeTruthy();
			expect(typeof modal1.type).toEqual('string');
			expect(modal1.type).toEqual('modal');
		});

		/*it('.constructor', function () {
			expect(ch.util.hasOwn(tooltip, 'constructor')).toBeTruthy();
			expect(typeof tooltip.constructor).toEqual('function');
		});*/

		it('.uid', function () {
			expect(typeof modal1.uid).toEqual('number');
		});

		it('.content', function () {
			expect(ch.util.hasOwn(modal1, 'content')).toBeTruthy();
			expect(typeof modal1.content).toEqual('object');
		});
	});

	describe('Shold have the following public methods:', function () {

		it('.off()', function () {
			expect(ch.util.hasOwn(modal1, 'off')).toBeTruthy();
			expect(typeof modal1.off).toEqual('function');
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(modal1, 'on')).toBeTruthy();
			expect(typeof modal1.on).toEqual('function');
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(modal1, 'once')).toBeTruthy();
			expect(typeof modal1.once).toEqual('function');
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(modal1, 'trigger')).toBeTruthy();
			expect(typeof modal1.trigger).toEqual('function');
		});

		it('.closable()', function () {
			expect(ch.util.hasOwn(modal1, 'closable')).toBeTruthy();
			expect(typeof modal1.closable).toEqual('function');
		});

		it('.height()', function () {
			expect(ch.util.hasOwn(modal1, 'height')).toBeTruthy();
			expect(typeof modal1.height).toEqual('function');
		});

		it('.hide()', function () {
			expect(ch.util.hasOwn(modal1, 'hide')).toBeTruthy();
			expect(typeof modal1.hide).toEqual('function');
		});

		it('.isActive()', function () {
			expect(ch.util.hasOwn(modal1, 'isActive')).toBeTruthy();
			expect(typeof modal1.isActive).toEqual('function');
		});

		it('.position()', function () {
			expect(ch.util.hasOwn(modal1, 'position')).toBeTruthy();
			expect(typeof modal1.position).toEqual('function');
		});

		it('.show()', function () {
			expect(ch.util.hasOwn(modal1, 'show')).toBeTruthy();
			expect(typeof modal1.show).toEqual('function');
		});

		it('.width()', function () {
			expect(ch.util.hasOwn(modal1, 'width')).toBeTruthy();
			expect(typeof modal1.width).toEqual('function');
		});
	});

	describe('Should have the following WAI-ARIA roles and properties:', function () {
		it('aria-label', function () {
			expect($(modal1.element).attr("aria-label")).toEqual('ch-modal-1');
		});
	});

	describe('Show method', function () {

		describe('Should create an element at the bottom of body:', function () {

			var $content;

			beforeEach(function () {
				$content = $(document.body).children().last();
			});

			it('Should have the same ID than the "describedby" ARIA attribute', function () {

				expect($content.attr('id')).not.toEqual('ch-modal-1');

				modal1.show();

				expect($(document.body).children().last().attr('id')).toEqual('ch-modal-1');
			});

			it('Should have the ARIA role "dialog".', function () {
				expect($content.attr('role')).toEqual('dialog');
			});

			describe('Should have the following classnames:', function () {

				it('.ch-modal', function () {
					expect($content.hasClass('ch-modal')).toBeTruthy();
				});

				it('.ch-box', function () {
					expect($content.hasClass('ch-box')).toBeTruthy();
				});

				it('.ch-points-cmcm', function () {
					expect($content.hasClass('ch-points-cmcm')).toBeTruthy();
				});
			});

			describe('Should have a child as container of the widget content:', function () {

				var $child,
					text = 'This is a default tooltip';

				beforeEach(function () {
					$child = $content.children(':last');
				});

				it('Should have the "ch-modal-content" classname.', function () {
					expect($child.hasClass('ch-modal-content')).toBeTruthy();
				});

				it('Should contain the default content.', function () {
					expect($child.text()).toEqual('Chico Error: Content is not defined.');
				});
			});
		});

		describe('Public instance', function () {

			it('Should return the same instance than initialized widget', function () {
				expect(modal1.show()).toEqual(modal1);
			});
		});
	});

	describe('Hide method', function () {

		it('Should delete the element at the bottom of body.', function () {

			var flag = false;

			expect($(document.body).children().last().attr('id')).toEqual('ch-modal-1');

			modal1.hide();

			waits(500);

			runs(function () {
				expect($(document.body).children().last().attr('id')).not.toEqual('ch-modal-1');
			});
		});

		describe('Public instance', function () {

			it('Should return the same instance than initialized widget', function () {
				expect(modal1.hide()).toEqual(modal1);
			});
		});
	});

	describe('Position method', function () {


	});

	describe('isActive method', function () {

		it('Should return "true" when the widget is shown', function () {

			modal1.hide();

			expect(typeof modal1.isActive()).toEqual('boolean');
			expect(modal1.isActive()).not.toBeTruthy();
		});

		it('Should return "false" when the widget is hiden', function () {

			modal1.show();

			expect(typeof modal1.isActive()).toEqual('boolean');
			expect(modal1.isActive()).toBeTruthy();
		});
	});

	describe('Width method', function () {

		var $content;

		beforeEach(function () {
			modal1.show();

			$content = $(document.body).children().last();
		});

		it('As a getter', function () {
			expect(modal1.width()).toEqual($content.width());
		});

		it('As a setter', function () {

			var finalWidth = 123;

			expect(modal1.width()).not.toEqual(finalWidth);

			modal1.width(finalWidth);

			expect(modal1.width(finalWidth)).toEqual(modal1);

			expect(modal1.width()).toEqual(finalWidth);
		});
	});

	describe('Height method', function () {

		var $content;

		beforeEach(function () {
			modal1.show();

			$content = $(document.body).children().last();
		});

		it('As a getter', function () {
			expect(modal1.height()).toEqual($content.height());
		});

		it('As a setter', function () {

			var finalHeight = 55;

			expect(modal1.height()).not.toEqual(finalHeight);

			modal1.height(finalHeight);

			expect(modal1.height(finalHeight)).toEqual(modal1);

			expect(modal1.height()).toEqual(finalHeight);
		});
	});

	describe('Closable method', function () {

		var closable;

		it('When configuration says "true"', function () {

			closable = modal2.closable();

			expect(typeof closable).toEqual('boolean');
			expect(closable).toBeTruthy();
		});

		it('When configuration says "false"', function () {

			closable = modal3.closable();

			expect(typeof closable).toEqual('boolean');
			expect(closable).not.toBeTruthy();
		});

		it('When configuration says "button"', function () {

			closable = modal4.closable();

			expect(typeof closable).toEqual('string');
			expect(closable).toEqual('button');
		});
	});

	describe('Content configured to use', function () {

		it('an element from DOM', function () {

			modal2.content.set();

			expect(modal2.content.get()).toEqual($invisible);
		});

		it('plain text', function () {

			modal3.content.set();

			expect(modal3.content.get()).toEqual('<p>foo</p>');
		});

		it('an AJAX response', function () {

			modal5.content.set();

			expect(modal5.content.get()).toMatch(/This is an example for AJAX calls./);
		});
	});

	describe('Content method', function () {

		var current;

		describe('.configure()', function () {

			it('should configure the instance', function () {
				var options = {'input': 'Some text!'},
					options2 = {'input': 'Another text!'};

				modal1.content.configure(options);
				current = modal1.content.configure();

				expect(current.input).toEqual(options.input);

				modal1.content.configure(options2);
				current = modal1.content.configure();

				expect(current.input).toEqual(options2.input);
			});
		});

		describe('.set()', function () {

			it('Should be defined into public instance', function () {
				expect(ch.util.hasOwn(modal1.content, 'set')).toBeTruthy();
			});

			it('Should set a new plain text as content', function () {
				modal1.content.set({'input': 'Some text!'});
				current = modal1.content.get();

				expect(current).toEqual('Some text!');
			});

			it('Should set a new query Selector as content', function () {
				modal1.content.set({'input': $invisible});
				current = modal1.content.get();

				expect(current[0].nodeType).toEqual(1);
			});

			it('Should set a new AJAX as content', function () {
				var done = jasmine.createSpy('done');
				modal4.content.onmessage = function (data) {
					expect(typeof data).toEqual('string');
					expect(data).toMatch(/This is an example for AJAX calls./);
					done();
				};

				modal4.content.set({'input': 'http://ui.ml.com:3040/ajax'});

				waitsFor(function() {
					return done.callCount > 0;
				});
			});

			it('Should use ch.Cache to store the AJAX content', function () {
				var done = jasmine.createSpy('done');
				modal4.content.onmessage = function (data) {
					expect(data).toEqual(ch.cache.map['http://ui.ml.com:3040/ajax']);
					done();
				};

				modal4.content.set({'input': 'http://ui.ml.com:3040/ajax'});

				waitsFor(function() {
					return done.callCount > 0;
				});
			});

			it('Should set content from the ch.Cache if the input was cached', function () {
				// Gets the content form the cache
				modal4.content.set({'input': 'http://ui.ml.com:3040/ajax'});
				current = modal4.content.get();
				expect(ch.cache.map['http://ui.ml.com:3040/ajax']).toBeDefined();
				expect(current).toEqual(ch.cache.map['http://ui.ml.com:3040/ajax']);
			});

			it('Should set content always from AJAX when cache is false', function () {
				ch.cache.rem('http://ui.ml.com:3040/ajax');

				var done = jasmine.createSpy('done');

				modal4.content.onmessage = function (data) {
					expect(ch.cache.map['http://ui.ml.com:3040/ajax']).not.toBeDefined();
					expect(data).toMatch(/This is an example for AJAX calls./);
					done();
				};

				modal4.content.set({
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

				modal4.content.onmessage = function (data) {
					expect(typeof data).toEqual('string');
					expect(data).toMatch(/Error on ajax call./);
					fail();
				};

				modal4.content.onerror = function (data) {
					expect(typeof data).toEqual('object');

					expect(ch.util.hasOwn(data, 'jqXHR')).toBeTruthy();
					expect(data.jqXHR).toBeDefined();

					expect(ch.util.hasOwn(data, 'textStatus')).toBeTruthy();
					expect(data.textStatus).toBeDefined();

					expect(ch.util.hasOwn(data, 'errorThrown')).toBeTruthy();
					expect(data.errorThrown).toBeDefined();

					onError();
				};

				modal4.content.set({'input': 'http://ui.ml.com:3040/ajaxFail'});

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
				expect(ch.util.hasOwn(modal1.content, 'get')).toBeTruthy();
			});

			it('Should be return the current content', function () {
				modal1.content.set({'input': 'Some text!'});
				current = modal1.content.get();
				expect(current).toEqual('Some text!');
			});
		});
	});

	describe('An instance configured with custom classnames', function () {

		it('should contain the specified classname in its container element', function () {

			modal2.show();

			var $container = $(document.body).children().last();

			expect($container.hasClass('ch-box')).not.toBeTruthy();
			expect($container.hasClass('test')).toBeTruthy();
		});
	});

	describe('Position method', function () {

		describe('as a getter should return the current "position" configuration', function () {

			var result = modal1.position();

			it('as an object', function () {
				expect(typeof result).toEqual('object');
			});

			describe('with the following public properties:', function () {

				it('context should be the ch.viewport', function () {
					expect(ch.util.hasOwn(result, 'context')).toBeTruthy();
					// Exists in DOM
					expect(result.context).toEqual(ch.viewport.element);
				});

				it('element', function () {
					expect(ch.util.hasOwn(result, 'element')).toBeTruthy();
					// Exists in DOM
					expect(result.element[0].nodeType).toEqual(1);
				});

				it('offset', function () {
					expect(ch.util.hasOwn(result, 'offset')).toBeTruthy();
					expect(typeof result.offset).toEqual('string');
					expect(result.offset).toEqual('0 0');
				});

				it('points', function () {
					expect(ch.util.hasOwn(result, 'points')).toBeTruthy();
					expect(typeof result.points).toEqual('string');
					expect(result.points).toEqual('cm cm');
				});

				it('reposition', function () {
					expect(ch.util.hasOwn(result, 'reposition')).toBeTruthy();
					expect(typeof result.reposition).toEqual('boolean');
					expect(result.reposition).toBeFalsy();
				});
			});
		});

		describe('as a setter should replace the following properties:', function () {

			it('context', function () {

				var newID = 'modal2';

				expect(modal1.position().context[0].id).not.toEqual(newID);

				modal1.position({
					'context': $('#modal2')
				});

				expect(modal1.position().context[0].id).toEqual(newID);
			});

			it('offset', function () {

				var newOffset = '12 34';

				expect(modal1.position().offset).not.toEqual(newOffset);

				modal1.position({
					'offset': newOffset
				});

				expect(modal1.position().offset).toEqual(newOffset);
			});

			it('points', function () {

				var newPoints = 'cb cb';

				expect(modal1.position().points).not.toEqual(newPoints);

				modal1.position({
					'points': newPoints
				});

				expect(modal1.position().points).toEqual(newPoints);
			});

			it('reposition', function () {

				var newReposition = false;

				expect(modal1.position().reposition).not.toEqual(newReposition);

				modal1.position({
					'reposition': newReposition
				});

				expect(modal1.position().reposition).toEqual(newReposition);
			});
		});
	});
});