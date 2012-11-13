/**
 * @todo "width" and "height" as parameter
 */
describe('Transition', function () {

	var transition1 = $('#transition1').transition(),
		transition2 = $('#transition2').transition('Some text!');


	it('should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Transition')).toBeTruthy();
		expect(typeof ch.Transition).toEqual('function');
	});

	describe('Should have the following public properties:', function () {

		it('.element', function () {
			expect(ch.util.hasOwn(transition1, 'element')).toBeTruthy();
			expect(transition1.element.nodeType).toEqual(1);
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(transition1, 'type')).toBeTruthy();
			expect(typeof transition1.type).toEqual('string');
			expect(transition1.type).toEqual('modal');
		});

		/*it('.constructor', function () {
			expect(ch.util.hasOwn(tooltip, 'constructor')).toBeTruthy();
			expect(typeof tooltip.constructor).toEqual('function');
		});*/

		it('.uid', function () {
			expect(typeof transition1.uid).toEqual('number');
		});

		it('.content', function () {
			expect(ch.util.hasOwn(transition1, 'content')).toBeTruthy();
			expect(typeof transition1.content).toEqual('object');
		});
	});

	describe('Shold have the following public methods:', function () {

		it('.off()', function () {
			expect(ch.util.hasOwn(transition1, 'off')).toBeTruthy();
			expect(typeof transition1.off).toEqual('function');
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(transition1, 'on')).toBeTruthy();
			expect(typeof transition1.on).toEqual('function');
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(transition1, 'once')).toBeTruthy();
			expect(typeof transition1.once).toEqual('function');
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(transition1, 'trigger')).toBeTruthy();
			expect(typeof transition1.trigger).toEqual('function');
		});

		it('.closable()', function () {
			expect(ch.util.hasOwn(transition1, 'closable')).toBeTruthy();
			expect(typeof transition1.closable).toEqual('function');
		});

		it('.height()', function () {
			expect(ch.util.hasOwn(transition1, 'height')).toBeTruthy();
			expect(typeof transition1.height).toEqual('function');
		});

		it('.hide()', function () {
			expect(ch.util.hasOwn(transition1, 'hide')).toBeTruthy();
			expect(typeof transition1.hide).toEqual('function');
		});

		it('.isActive()', function () {
			expect(ch.util.hasOwn(transition1, 'isActive')).toBeTruthy();
			expect(typeof transition1.isActive).toEqual('function');
		});

		it('.position()', function () {
			expect(ch.util.hasOwn(transition1, 'position')).toBeTruthy();
			expect(typeof transition1.position).toEqual('function');
		});

		it('.show()', function () {
			expect(ch.util.hasOwn(transition1, 'show')).toBeTruthy();
			expect(typeof transition1.show).toEqual('function');
		});

		it('.width()', function () {
			expect(ch.util.hasOwn(transition1, 'width')).toBeTruthy();
			expect(typeof transition1.width).toEqual('function');
		});
	});

	describe('Should have the following WAI-ARIA roles and properties:', function () {
		it('aria-label', function () {
			expect($(transition1.element).attr("aria-label")).toEqual('ch-modal-1');
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

				transition1.show();

				expect($(document.body).children().last().attr('id')).toEqual('ch-modal-1');
			});

			it('Should have the ARIA role "dialog".', function () {
				expect($content.attr('role')).toEqual('dialog');
			});

			describe('Should have the following classnames:', function () {

				it('.ch-transition', function () {
					expect($content.hasClass('ch-transition')).toBeTruthy();
				});

				it('.ch-modal', function () {
					expect($content.hasClass('ch-modal')).toBeTruthy();
				});

				it('.ch-box', function () {
					expect($content.hasClass('ch-box-lite')).toBeTruthy();
				});

				it('.ch-points-cmcm', function () {
					expect($content.hasClass('ch-points-cmcm')).toBeTruthy();
				});
			});

			describe('Should have a child as container of the widget content:', function () {

				var $child;

				beforeEach(function () {
					$child = $content.children(':last');
				});

				it('Should have the "ch-modal-content" classname.', function () {
					expect($child.hasClass('ch-modal-content')).toBeTruthy();
				});

				it('Should contain the default content.', function () {
					expect($child.text()).toEqual('Please wait...');
				});
			});
		});

		describe('Public instance', function () {

			it('Should return the same instance than initialized widget', function () {
				expect(transition1.show()).toEqual(transition1);
			});
		});
	});

	describe('Hide method', function () {

		it('Should delete the element at the bottom of body.', function () {

			var flag = false;

			expect($(document.body).children().last().attr('id')).toEqual('ch-modal-1');

			transition1.hide();

			waits(500);

			runs(function () {
				expect($(document.body).children().last().attr('id')).not.toEqual('ch-modal-1');
			});
		});

		describe('Public instance', function () {

			it('Should return the same instance than initialized widget', function () {
				expect(transition1.hide()).toEqual(transition1);
			});
		});
	});

	describe('Position method', function () {


	});

	describe('isActive method', function () {

		it('Should return "true" when the widget is shown', function () {

			transition1.hide();

			expect(typeof transition1.isActive()).toEqual('boolean');
			expect(transition1.isActive()).not.toBeTruthy();
		});

		it('Should return "false" when the widget is hiden', function () {

			transition1.show();

			expect(typeof transition1.isActive()).toEqual('boolean');
			expect(transition1.isActive()).toBeTruthy();
		});
	});

	describe('Width method', function () {

		var $content;

		beforeEach(function () {
			transition1.show();

			$content = $(document.body).children().last();
		});

		it('As a getter', function () {
			expect(transition1.width()).toEqual($content.width());
		});

		it('As a setter', function () {

			var finalWidth = 123;

			expect(transition1.width()).not.toEqual(finalWidth);

			transition1.width(finalWidth);

			expect(transition1.width(finalWidth)).toEqual(transition1);

			expect(transition1.width()).toEqual(finalWidth);
		});
	});

	describe('Height method', function () {

		var $content;

		beforeEach(function () {
			transition1.show();

			$content = $(document.body).children().last();
		});

		it('As a getter', function () {
			expect(transition1.height()).toEqual($content.height());
		});

		it('As a setter', function () {

			var finalHeight = 55;

			expect(transition1.height()).not.toEqual(finalHeight);

			transition1.height(finalHeight);

			expect(transition1.height(finalHeight)).toEqual(transition1);

			expect(transition1.height()).toEqual(finalHeight);
		});
	});

	describe('Closable method', function () {

		var closable = transition1.closable();

		expect(typeof closable).toEqual('boolean');
		expect(closable).toBeFalsy();
	});

	describe('Content', function () {

		it('configuration parameter should have a custom message', function () {

			transition2.content.set();

			var $content = transition2.content.get();

			expect($content instanceof $).toBeTruthy();
			expect($content.text()).toMatch(/Some text!/);
		});

		describe('method', function () {

			var current;

			describe('.configure()', function () {

				it('should configure the instance', function () {
					var options = {'input': 'Some text!'},
						options2 = {'input': 'Another text!'};

					transition1.content.configure(options);
					current = transition1.content.configure();

					expect(current.input).toEqual(options.input);

					transition1.content.configure(options2);
					current = transition1.content.configure();

					expect(current.input).toEqual(options2.input);
				});
			});

			describe('.set()', function () {

				it('Should be defined into public instance', function () {
					expect(ch.util.hasOwn(transition1.content, 'set')).toBeTruthy();
				});

				it('Should set a new plain text as content', function () {
					transition1.content.set({'input': 'Some text!'});
					current = transition1.content.get();

					expect(current).toMatch(/Some text!/);
				});
			});

			describe('.get()', function () {
				it('Should be defined into public instance', function () {
					expect(ch.util.hasOwn(transition1.content, 'get')).toBeTruthy();
				});

				it('Should be return the current content', function () {
					transition1.content.set({'input': 'Some text!'});
					current = transition1.content.get();
					expect(current).toEqual('Some text!');
				});
			});
		});
	});
});