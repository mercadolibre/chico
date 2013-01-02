/**
 * @todo "width" and "height" as parameter
 */
describe('Layer', function () {

	var $invisible = $('#invisibleContent'),
		layer1 = $('#layer1').layer(),
		layer2 = $('#layer2').layer({
			'classes': 'test',
			'content': $('#invisibleContent'),
			'closable': true
		}),
		layer3 = $('#layer3').layer({
			'content': '<p>foo</p>',
			'closable': false
		}),
		layer4 = $('#layer4').layer({
			'closable': 'button',
			'width': 500
		}),
		layer5 = $('#layer5').layer({
			'content': '/ajax',
			'event': 'click'
		});


	it('should be defined', function () {
        expect(ch.util.hasOwn(ch, 'Layer')).toBeTruthy();
        expect(typeof ch.Layer).toEqual('function');
        expect(layer1 instanceof ch.Layer).toBeTruthy();
    });

	describe('Should have the following public properties:', function () {

        it('.el', function () {
            expect(layer1.el).not.toEqual(undefined);
            expect(layer1.el.nodeType).toEqual(1);
        });

        it('.name', function () {
            expect(layer1.name).not.toEqual(undefined);
            expect(typeof layer1.name).toEqual('string');
            expect(layer1.name).toEqual('layer');
        });

        it('.constructor', function () {
            expect(layer1.constructor).not.toEqual(undefined);
            expect(typeof layer1.constructor).toEqual('function');
        });

        it('.uid', function () {
            expect(layer1.uid).not.toEqual(undefined);
            expect(typeof layer1.uid).toEqual('number');
        });

        it('.content', function () {
            expect(layer1.content).not.toEqual(undefined);
            expect(typeof layer1.content).toEqual('function');
        });

        it('.position', function () {
            expect(layer1.position).not.toEqual(undefined);
            expect(typeof layer1.position).toEqual('object');
            expect(layer1.position instanceof ch.Positioner).toBeTruthy();
        });
    });

	describe('Should have the following public methods:', function () {

        it('.off()', function () {
            expect(layer1.off).not.toEqual(undefined);
            expect(typeof layer1.off).toEqual('function');
        });

        it('.on()', function () {
            expect(layer1.on).not.toEqual(undefined);
            expect(typeof layer1.on).toEqual('function');
        });

        it('.once()', function () {
            expect(layer1.once).not.toEqual(undefined);
            expect(typeof layer1.once).toEqual('function');
        });

        it('.emit()', function () {
            expect(layer1.emit).not.toEqual(undefined);
            expect(typeof layer1.emit).toEqual('function');
        });

        it('.height()', function () {
            expect(layer1.height).not.toEqual(undefined);
            expect(typeof layer1.height).toEqual('function');
        });

        it('.hide()', function () {
            expect(layer1.hide).not.toEqual(undefined);
            expect(typeof layer1.hide).toEqual('function');
        });

        it('.isActive()', function () {
            expect(layer1.isActive).not.toEqual(undefined);
            expect(typeof layer1.isActive).toEqual('function');
        });

        it('.show()', function () {
            expect(layer1.show).not.toEqual(undefined);
            expect(typeof layer1.show).toEqual('function');
        });

        it('.width()', function () {
            expect(layer1.width).not.toEqual(undefined);
            expect(typeof layer1.width).toEqual('function');
        });
    });

	describe('Should have the following WAI-ARIA roles and properties:', function () {
        it('aria-describedby', function () {
            expect(layer1.$el.attr('aria-describedby')).toEqual('ch-layer-1');
        });
    });

	it('Should have the datasets to position the container:', function () {
        expect(layer1.$el.attr('data-side')).toEqual('bottom');
        expect(layer1.$el.attr('data-align')).toEqual('right');
    });

	describe('Show method', function () {

		describe('Should create an element at the bottom of body:', function () {

			var $content;

			beforeEach(function () {
				$content = $(document.body).children().last();
			});

			it('Should have the same ID than the "describedby" ARIA attribute', function () {

				expect($content.attr('id')).not.toEqual('ch-layer-1');

				layer1.show();

				expect($(document.body).children().last().attr('id')).toEqual('ch-layer-1');
			});

			it('Should have the ARIA role "tooltip".', function () {
				expect($content.attr('role')).toEqual('tooltip');
			});

			describe('Should have the following classnames:', function () {

				it('.ch-layer', function () {
					expect($content.hasClass('ch-layer')).toBeTruthy();
				});

				it('.ch-box-lite', function () {
					expect($content.hasClass('ch-box-lite')).toBeTruthy();
				});

				it('.ch-cone', function () {
					expect($content.hasClass('ch-cone')).toBeTruthy();
				});
			});

			describe('Should have a child as container of the widget content:', function () {

				var $child,
					text = 'This is a default tooltip';

				beforeEach(function () {
					$child = $content.children(':first');
				});

				it('Should have the "ch-tooltip-content" classname.', function () {
					expect($child.hasClass('ch-tooltip-content')).toBeTruthy();
				});

				it('Should contain the default content.', function () {
					expect($child.text()).toEqual('Chico Error: Content is not defined.');
				});
			});
		});

		describe('Public instance', function () {

			it('Should return the same instance than initialized widget', function () {
				expect(layer1.show()).toEqual(layer1);
			});
		});
	});

	describe('Hide method', function () {

		it('Should delete the element at the bottom of body.', function () {

			var flag = false;

			expect($(document.body).children().last().attr('id')).toEqual('ch-layer-1');

			layer1.hide();

			waits(500);

			runs(function () {
				expect($(document.body).children().last().attr('id')).not.toEqual('ch-layer-1');
			});
		});

		describe('Public instance', function () {

			it('Should return the same instance than initialized widget', function () {
				expect(layer1.hide()).toEqual(layer1);
			});
		});
	});

	describe('Position method', function () {


	});

	describe('isActive method', function () {

		it('Should return "true" when the widget is shown', function () {

			layer1.hide();

			expect(typeof layer1.isActive()).toEqual('boolean');
			expect(layer1.isActive()).not.toBeTruthy();
		});

		it('Should return "false" when the widget is hiden', function () {

			layer1.show();

			expect(typeof layer1.isActive()).toEqual('boolean');
			expect(layer1.isActive()).toBeTruthy();
		});
	});

	describe('Width method', function () {

		var $content;

		beforeEach(function () {
			layer1.show();

			$content = $(document.body).children().last();
		});

		it('As a getter', function () {
			expect(layer1.width()).toEqual($content.width());
		});

		it('As a setter', function () {

			var finalWidth = 123;

			expect(layer1.width()).not.toEqual(finalWidth);

			layer1.width(finalWidth);

			expect(layer1.width(finalWidth)).toEqual(layer1);

			expect(layer1.width()).toEqual(finalWidth);
		});
	});

	describe('Height method', function () {

		var $content;

		beforeEach(function () {
			layer1.show();

			$content = $(document.body).children().last();
		});

		it('As a getter', function () {
			expect(layer1.height()).toEqual($content.height());
		});

		it('As a setter', function () {

			var finalHeight = 55;

			expect(layer1.height()).not.toEqual(finalHeight);

			layer1.height(finalHeight);

			expect(layer1.height(finalHeight)).toEqual(layer1);

			expect(layer1.height()).toEqual(finalHeight);
		});
	});

	describe('Closable method', function () {

		var closable;

		it('When configuration says "true"', function () {

			closable = layer2.closable();

			expect(typeof closable).toEqual('boolean');
			expect(closable).toBeTruthy();
		});

		it('When configuration says "false"', function () {

			closable = layer3.closable();

			expect(typeof closable).toEqual('boolean');
			expect(closable).not.toBeTruthy();
		});

		it('When configuration says "button"', function () {

			closable = layer4.closable();

			expect(typeof closable).toEqual('string');
			expect(closable).toEqual('button');
		});
	});

	describe('Content configured to use', function () {

		it('an element from DOM', function () {

			layer2.content.set();

			expect(layer2.content.get()).toEqual($invisible);
		});

		it('plain text', function () {

			layer3.content.set();

			expect(layer3.content.get()).toEqual('<p>foo</p>');
		});

		it('an AJAX response', function () {

			layer5.content.set();

			expect(layer5.content.get()).toMatch(/This is an example for AJAX calls./);
		});
	});

	describe('Content method', function () {

		var current;

		describe('.configure()', function () {

			it('should configure the instance', function () {
				var options = {'input': 'Some text!'},
					options2 = {'input': 'Another text!'};

				layer1.content.configure(options);
				current = layer1.content.configure();

				expect(current.input).toEqual(options.input);

				layer1.content.configure(options2);
				current = layer1.content.configure();

				expect(current.input).toEqual(options2.input);
			});
		});

		describe('.set()', function () {

			it('Should be defined into public instance', function () {
				expect(ch.util.hasOwn(layer1.content, 'set')).toBeTruthy();
			});

			it('Should set a new plain text as content', function () {
				layer1.content.set({'input': 'Some text!'});
				current = layer1.content.get();

				expect(current).toEqual('Some text!');
			});

			it('Should set a new query Selector as content', function () {
				layer1.content.set({'input': $invisible});
				current = layer1.content.get();

				expect(current[0].nodeType).toEqual(1);
			});

			it('Should set a new AJAX as content', function () {
				var done = jasmine.createSpy('done');
				layer4.content.onmessage = function (data) {
					expect(typeof data).toEqual('string');
					expect(data).toMatch(/This is an example for AJAX calls./);
					done();
				};

				layer4.content.set({'input': 'http://ui.ml.com:3040/ajax'});

				waitsFor(function() {
					return done.callCount > 0;
				});
			});

			it('Should use ch.Cache to store the AJAX content', function () {
				var done = jasmine.createSpy('done');
				layer4.content.onmessage = function (data) {
					expect(data).toEqual(ch.cache.map['http://ui.ml.com:3040/ajax']);
					done();
				};

				layer4.content.set({'input': 'http://ui.ml.com:3040/ajax'});

				waitsFor(function() {
					return done.callCount > 0;
				});
			});

			it('Should set content from the ch.Cache if the input was cached', function () {
				// Gets the content form the cache
				layer4.content.set({'input': 'http://ui.ml.com:3040/ajax'});
				current = layer4.content.get();
				expect(ch.cache.map['http://ui.ml.com:3040/ajax']).toBeDefined();
				expect(current).toEqual(ch.cache.map['http://ui.ml.com:3040/ajax']);
			});

			it('Should set content always from AJAX when cache is false', function () {
				ch.cache.rem('http://ui.ml.com:3040/ajax');

				var done = jasmine.createSpy('done');

				layer4.content.onmessage = function (data) {
					expect(ch.cache.map['http://ui.ml.com:3040/ajax']).not.toBeDefined();
					expect(data).toMatch(/This is an example for AJAX calls./);
					done();
				};

				layer4.content.set({
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

				layer4.content.onmessage = function (data) {
					expect(typeof data).toEqual('string');
					expect(data).toMatch(/Error on ajax call./);
					fail();
				};

				layer4.content.onerror = function (data) {
					expect(typeof data).toEqual('object');

					expect(ch.util.hasOwn(data, 'jqXHR')).toBeTruthy();
					expect(data.jqXHR).toBeDefined();

					expect(ch.util.hasOwn(data, 'textStatus')).toBeTruthy();
					expect(data.textStatus).toBeDefined();

					expect(ch.util.hasOwn(data, 'errorThrown')).toBeTruthy();
					expect(data.errorThrown).toBeDefined();

					onError();
				};

				layer4.content.set({'input': 'http://ui.ml.com:3040/ajaxFail'});

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
				expect(ch.util.hasOwn(layer1.content, 'get')).toBeTruthy();
			});

			it('Should be return the current content', function () {
				layer1.content.set({'input': 'Some text!'});
				current = layer1.content.get();
				expect(current).toEqual('Some text!');
			});
		});
	});

	describe('An instance configured with custom classnames', function () {

		it('should contain the specified classname in its container element', function () {

			layer2.show();

			var $container = $(document.body).children().last();

			expect($container.hasClass('ch-box-lite')).not.toBeTruthy();
			expect($container.hasClass('test')).toBeTruthy();
		});
	});

	describe('Position method', function () {

		describe('as a getter should return the current "position" configuration', function () {

			var result = layer1.position();

			it('as an object', function () {
				expect(typeof result).toEqual('object');
			});

			describe('with the following public properties:', function () {

				it('context', function () {
					expect(ch.util.hasOwn(result, 'context')).toBeTruthy();
					// Exists in DOM
					expect(result.context[0].nodeType).toEqual(1);
				});

				it('element', function () {
					expect(ch.util.hasOwn(result, 'element')).toBeTruthy();
					// Exists in DOM
					expect(result.element[0].nodeType).toEqual(1);
				});

				it('offset', function () {
					expect(ch.util.hasOwn(result, 'offset')).toBeTruthy();
					expect(typeof result.offset).toEqual('string');
					expect(result.offset).toEqual('0 10');
				});

				it('points', function () {
					expect(ch.util.hasOwn(result, 'points')).toBeTruthy();
					expect(typeof result.points).toEqual('string');
					expect(result.points).toEqual('lt lb');
				});

				it('reposition', function () {
					expect(ch.util.hasOwn(result, 'reposition')).toBeTruthy();
					expect(typeof result.reposition).toEqual('boolean');
					expect(result.reposition).toBeTruthy();
				});
			});
		});

		describe('as a setter should replace the following properties:', function () {

			it('context', function () {

				var newID = 'layer2';

				expect(layer1.position().context[0].id).not.toEqual(newID);

				layer1.position({
					'context': $('#layer2')
				});

				expect(layer1.position().context[0].id).toEqual(newID);
			});

			it('offset', function () {

				var newOffset = '12 34';

				expect(layer1.position().offset).not.toEqual(newOffset);

				layer1.position({
					'offset': newOffset
				});

				expect(layer1.position().offset).toEqual(newOffset);
			});

			it('points', function () {

				var newPoints = 'cb cb';

				expect(layer1.position().points).not.toEqual(newPoints);

				layer1.position({
					'points': newPoints
				});

				expect(layer1.position().points).toEqual(newPoints);
			});

			it('reposition', function () {

				var newReposition = false;

				expect(layer1.position().reposition).not.toEqual(newReposition);

				layer1.position({
					'reposition': newReposition
				});

				expect(layer1.position().reposition).toEqual(newReposition);
			});
		});
	});

	describe('An instance configured with hover-to-show interaction (conf.event=hover)', function () {

		it('gives a default cursor to the trigger', function () {
			expect(layer1.element.style.cursor).toEqual('default');
		});

		it('shouldn\'t contain a close button', function () {

			layer1.show();

			expect($('#ch-layer-1').children(':first')).not.toEqual('A');
		});
	});

	describe('An instance configured with click-to-show interaction (conf.event=click)', function () {

		it('gives a pointer cursor to the trigger', function () {
			expect(layer5.element.style.cursor).toEqual('pointer');
		});

		describe('should contain a close button', function () {

			var $btn;

			beforeEach(function () {
				layer5.show();

				$btn = $('#ch-layer-5').children(':first');
			});

			it('<a> element', function () {
				expect($btn[0].tagName).toEqual('A');
			});

			it('with the "ch-close" classname', function () {
				expect($btn.hasClass('ch-close')).toBeTruthy();
			});

			it('with the ARIA role "button"', function () {
				expect($btn.attr('role')).toEqual('button');
			});
		});
	});
});