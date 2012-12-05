/**
 * @todo "width" and "height" as parameter
 */
describe('Zoom widget', function () {

	var zoomedImg = 'http://www.w3.org/html/logo/downloads/HTML5_Logo_512.png',
		zoom1 = $('#zoom1').zoom(),
		zoom2 = $('#zoom2').zoom({
			'classes': 'test'
		});

	it('should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Zoom')).toBeTruthy();
		expect(typeof ch.Zoom).toEqual('function');
	});

	describe('should have the following public properties:', function () {

		it('.element', function () {
			expect(ch.util.hasOwn(zoom1, 'element')).toBeTruthy();
			expect(zoom1.element.nodeType).toEqual(1);
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(zoom1, 'type')).toBeTruthy();
			expect(typeof zoom1.type).toEqual('string');
			expect(zoom1.type).toEqual('zoom');
		});

		/*it('.constructor', function () {
			expect(ch.util.hasOwn(tooltip, 'constructor')).toBeTruthy();
			expect(typeof tooltip.constructor).toEqual('function');
		});*/

		it('.uid', function () {
			expect(typeof zoom1.uid).toEqual('number');
		});

		it('.content', function () {
			expect(ch.util.hasOwn(zoom1, 'content')).toBeTruthy();
			expect(typeof zoom1.content).toEqual('function');
		});
	});

	describe('should have the following public methods:', function () {

		it('.off()', function () {
			expect(ch.util.hasOwn(zoom1, 'off')).toBeTruthy();
			expect(typeof zoom1.off).toEqual('function');
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(zoom1, 'on')).toBeTruthy();
			expect(typeof zoom1.on).toEqual('function');
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(zoom1, 'once')).toBeTruthy();
			expect(typeof zoom1.once).toEqual('function');
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(zoom1, 'trigger')).toBeTruthy();
			expect(typeof zoom1.trigger).toEqual('function');
		});

		it('.closable()', function () {
			expect(ch.util.hasOwn(zoom1, 'closable')).toBeTruthy();
			expect(typeof zoom1.closable).toEqual('function');
		});

		it('.height()', function () {
			expect(ch.util.hasOwn(zoom1, 'height')).toBeTruthy();
			expect(typeof zoom1.height).toEqual('function');
		});

		it('.hide()', function () {
			expect(ch.util.hasOwn(zoom1, 'hide')).toBeTruthy();
			expect(typeof zoom1.hide).toEqual('function');
		});

		it('.isActive()', function () {
			expect(ch.util.hasOwn(zoom1, 'isActive')).toBeTruthy();
			expect(typeof zoom1.isActive).toEqual('function');
		});

		it('.position()', function () {
			expect(ch.util.hasOwn(zoom1, 'position')).toBeTruthy();
			expect(typeof zoom1.position).toEqual('function');
		});

		it('.show()', function () {
			expect(ch.util.hasOwn(zoom1, 'show')).toBeTruthy();
			expect(typeof zoom1.show).toEqual('function');
		});

		it('.width()', function () {
			expect(ch.util.hasOwn(zoom1, 'width')).toBeTruthy();
			expect(typeof zoom1.width).toEqual('function');
		});
	});

	it('trigger should have an "aria-describedby"', function () {
		expect($(zoom1.element).attr('aria-describedby')).toEqual('ch-zoom-1');
	});

	it('trigger should have the "ch-zoom-trigger" classname', function () {
		expect($(zoom1.element).hasClass('ch-zoom-trigger')).toBeTruthy();
	});

	describe('show method', function () {

		describe('should create an element at the bottom of body', function () {

			var $content;

			beforeEach(function () {
				$content = $(document.body).children().last();
			});

			it('with the same ID than the "describedby" ARIA attribute', function () {

				var flag;

				runs(function () {
					flag = false;
					setTimeout(function () { flag = true; }, 500);
				});

				waitsFor(function () { return flag; });

				runs(function () {
					zoom1.show();
					expect($(document.body).children().last().attr('id')).toEqual('ch-zoom-1');
				});

			    expect($content.attr('id')).not.toEqual('ch-zoom-1');
			});

			it('with the ARIA role "tooltip"', function () {
				expect($content.attr('role')).toEqual('tooltip');
			});

			describe('with the following classnames:', function () {

				it('.ch-zoom', function () {
					expect($content.hasClass('ch-zoom')).toBeTruthy();
				});

				it('.ch-points-ltrt', function () {
					expect($content.hasClass('ch-points-ltrt')).toBeTruthy();
				});
			});

			describe('with a child as container of the widget content', function () {

				var text = 'This is a default tooltip',
					$child;

				beforeEach(function () {
					$child = $content.children(':last');
				});

				it('with the "ch-zoom-content" classname', function () {
					expect($child.hasClass('ch-zoom-content')).toBeTruthy();
				});

				it('with an image tag referencing to the zoomed image (same as anchor href)', function () {

					var img = $child.children()[0];

					expect(img.nodeType).toEqual(1);
					expect(img.tagName).toEqual('IMG');
					expect(img.src).toEqual(zoomedImg);
				});
			});
		});

		describe('Public instance', function () {

			it('Should return the same instance than initialized widget', function () {
				expect(zoom1.show()).toEqual(zoom1);
			});
		});
	});

	describe('Hide method', function () {

		it('Should delete the element at the bottom of body.', function () {

			var flag = false;

			expect($(document.body).children().last().attr('id')).toEqual('ch-zoom-1');

			zoom1.hide();

			waits(500);

			runs(function () {
				expect($(document.body).children().last().attr('id')).not.toEqual('ch-modal-1');
			});
		});

		describe('Public instance', function () {

			it('Should return the same instance than initialized widget', function () {
				expect(zoom1.hide()).toEqual(zoom1);
			});
		});
	});

	describe('Position method', function () {


	});

	describe('isActive method', function () {

		it('Should return "true" when the widget is shown', function () {

			zoom1.hide();

			expect(typeof zoom1.isActive()).toEqual('boolean');
			expect(zoom1.isActive()).not.toBeTruthy();
		});

		it('Should return "false" when the widget is hiden', function () {

			zoom1.show();

			expect(typeof zoom1.isActive()).toEqual('boolean');
			expect(zoom1.isActive()).toBeTruthy();
		});
	});

	describe('Width method', function () {

		var $content;

		beforeEach(function () {
			zoom1.show();

			$content = $(document.body).children().last();
		});

		it('As a getter', function () {
			expect(zoom1.width()).toEqual($content.width());
		});

		it('As a setter', function () {

			var finalWidth = 123;

			expect(zoom1.width()).not.toEqual(finalWidth);

			zoom1.width(finalWidth);

			expect(zoom1.width(finalWidth)).toEqual(zoom1);

			expect(zoom1.width()).toEqual(finalWidth);
		});
	});

	describe('Height method', function () {

		var $content;

		beforeEach(function () {
			zoom1.show();

			$content = $(document.body).children().last();
		});

		it('As a getter', function () {
			expect(zoom1.height()).toEqual($content.height());
		});

		it('As a setter', function () {

			var finalHeight = 55;

			expect(zoom1.height()).not.toEqual(finalHeight);

			zoom1.height(finalHeight);

			expect(zoom1.height(finalHeight)).toEqual(zoom1);

			expect(zoom1.height()).toEqual(finalHeight);
		});
	});

	describe('An instance configured with custom classnames', function () {

		it('should contain the specified classname in its container element', function () {

			zoom2.show();

			var $container = $(document.body).children().last();

			expect($container.hasClass('ch-box')).toBeFalsy();
			expect($container.hasClass('test')).toBeTruthy();
		});
	});

	describe('Position method', function () {

		describe('as a getter should return the current "position" configuration', function () {

			var result = zoom1.position();

			it('as an object', function () {
				expect(typeof result).toEqual('object');
			});

			describe('with the following public properties:', function () {

				it('context should be the trigger', function () {
					expect(ch.util.hasOwn(result, 'context')).toBeTruthy();
					// Exists in DOM
					expect(result.context[0].id).toEqual('zoom1');
				});

				it('element', function () {
					expect(ch.util.hasOwn(result, 'element')).toBeTruthy();
					// Exists in DOM
					expect(result.element[0].nodeType).toEqual(1);
				});

				it('offset', function () {
					expect(ch.util.hasOwn(result, 'offset')).toBeTruthy();
					expect(typeof result.offset).toEqual('string');
					expect(result.offset).toEqual('20 0');
				});

				it('points', function () {
					expect(ch.util.hasOwn(result, 'points')).toBeTruthy();
					expect(typeof result.points).toEqual('string');
					expect(result.points).toEqual('lt rt');
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

				var newID = 'zoom1';

				expect(zoom2.position().context[0].id).not.toEqual(newID);

				zoom2.position({
					'context': $('#zoom1')
				});

				expect(zoom2.position().context[0].id).toEqual(newID);
			});

			it('offset', function () {

				var newOffset = '12 34';

				expect(zoom1.position().offset).not.toEqual(newOffset);

				zoom1.position({
					'offset': newOffset
				});

				expect(zoom1.position().offset).toEqual(newOffset);
			});

			it('points', function () {

				var newPoints = 'cb cb';

				expect(zoom1.position().points).not.toEqual(newPoints);

				zoom1.position({
					'points': newPoints
				});

				expect(zoom1.position().points).toEqual(newPoints);
			});

			it('reposition', function () {

				var newReposition = 'test';

				expect(zoom1.position().reposition).not.toEqual(newReposition);

				zoom1.position({
					'reposition': newReposition
				});

				expect(zoom1.position().reposition).toEqual('test');
			});
		});
	});
});