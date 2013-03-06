/**
 * @todo "width" and "height" as parameter
 */
describe('Tooltip', function () {
	var $body = $('body'),
		tooltip1 = $('#tooltip1').tooltip(),
		tooltip2 = $('#tooltip2').tooltip({
			'classes': 'test',
			'content': 'Tooltip with a defined content.'
		}),
		tooltip3 = $('#tooltip3').tooltip(),
		tooltip4 = $('#tooltip4').tooltip();


	it('should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Tooltip')).toBeTruthy();
		expect(typeof ch.Tooltip).toEqual('function');
		expect(tooltip1 instanceof ch.Tooltip).toBeTruthy();
	});

	describe('Should have the following public properties:', function () {

		it('.el', function () {
			expect(tooltip1.el).not.toEqual(undefined);
			expect(tooltip1.el.nodeType).toEqual(1);
		});

		it('.name', function () {
			expect(tooltip1.name).not.toEqual(undefined);
			expect(typeof tooltip1.name).toEqual('string');
			expect(tooltip1.name).toEqual('tooltip');
		});

		it('.constructor', function () {
			expect(tooltip1.constructor).not.toEqual(undefined);
			expect(typeof tooltip1.constructor).toEqual('function');
		});

		it('.uid', function () {
			expect(tooltip1.uid).not.toEqual(undefined);
			expect(typeof tooltip1.uid).toEqual('number');
		});

		it('.content', function () {
			expect(tooltip1.content).not.toEqual(undefined);
			expect(typeof tooltip1.content).toEqual('function');
		});

        it('.position', function () {
            expect(tooltip1.position).not.toEqual(undefined);
            expect(typeof tooltip1.position).toEqual('object');
            expect(tooltip1.position instanceof ch.Positioner).toBeTruthy();
        });
	});

	describe('Should have the following public methods:', function () {

		it('.off()', function () {
			expect(tooltip1.off).not.toEqual(undefined);
			expect(typeof tooltip1.off).toEqual('function');
		});

		it('.on()', function () {
			expect(tooltip1.on).not.toEqual(undefined);
			expect(typeof tooltip1.on).toEqual('function');
		});

		it('.once()', function () {
			expect(tooltip1.once).not.toEqual(undefined);
			expect(typeof tooltip1.once).toEqual('function');
		});

		it('.emit()', function () {
			expect(tooltip1.emit).not.toEqual(undefined);
			expect(typeof tooltip1.emit).toEqual('function');
		});

		it('.height()', function () {
			expect(tooltip1.height).not.toEqual(undefined);
			expect(typeof tooltip1.height).toEqual('function');
		});

		it('.hide()', function () {
			expect(tooltip1.hide).not.toEqual(undefined);
			expect(typeof tooltip1.hide).toEqual('function');
		});

		it('.isActive()', function () {
			expect(tooltip1.isActive).not.toEqual(undefined);
			expect(typeof tooltip1.isActive).toEqual('function');
		});

		it('.show()', function () {
			expect(tooltip1.show).not.toEqual(undefined);
			expect(typeof tooltip1.show).toEqual('function');
		});

		it('.width()', function () {
			expect(tooltip1.width).not.toEqual(undefined);
			expect(typeof tooltip1.width).toEqual('function');
		});
	});

	describe('Should have the following WAI-ARIA roles and properties:', function () {
		it('aria-describedby', function () {
			expect(tooltip1.$el.attr("aria-describedby")).toEqual('ch-tooltip-1');
		});
	});

	it('Should have the datasets to position the container:', function () {
        expect(tooltip1.$el.attr('data-side')).toEqual('bottom');
		expect(tooltip1.$el.attr('data-align')).toEqual('right');
	});

	describe('Show method', function () {

		describe('Should create an element at the bottom of body:', function () {

			var $content;

			beforeEach(function () {
				$content = $body.children().last();
			});

			it('Should have the same ID than the "describedby" ARIA attribute', function () {

				expect($content.attr('id')).not.toEqual('ch-tooltip-1');

				tooltip1.show();

				expect($body.children().last().attr('id')).toEqual('ch-tooltip-1');
			});

			it('Should have the ARIA role "tooltip".', function () {
				expect($content.attr('role')).toEqual('tooltip');
			});

			describe('Should have the following classnames:', function () {

				it('.ch-tooltip', function () {
					expect($content.hasClass('ch-tooltip')).toBeTruthy();
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

				it('Should contain the content (DOM) of the "alt" attribute of the instantiation element.', function () {
					expect($child.text()).toEqual(text);
				});

				it('Should empty temporally the "alt" attribute of the instantiation element.', function () {
					expect(tooltip1.el.alt).toEqual('');
				});

				it('Should contain the content (via ch.Content) of the "alt" attribute of the instantiation element.', function () {
					expect(tooltip1.content.get()).toEqual(text);
				});
			});
		});

		describe('Public instance', function () {

			it('Should return the same instance than initialized widget', function () {
				expect(tooltip1.show()).toEqual(tooltip1);
			});
		});
	});

	describe('Hide method', function () {

		it('Should delete the element at the bottom of body.', function () {

			var flag = false;

			expect($body.children().last().attr('id')).toEqual('ch-tooltip-1');

			tooltip1.hide();

			waits(500);

			runs(function () {
				expect($body.children().last().attr('id')).not.toEqual('ch-tooltip-1');
			});
		});

		describe('Public instance', function () {

			it('Should return the same instance than initialized widget', function () {
				expect(tooltip1.hide()).toEqual(tooltip1);
			});
		});
	});

	describe('Position method', function () {


	});

	describe('isActive method', function () {

		it('Should return "true" when the widget is shown', function () {

			tooltip1.hide();

			expect(typeof tooltip1.isActive()).toEqual('boolean');
			expect(tooltip1.isActive()).not.toBeTruthy();
		});

		it('Should return "false" when the widget is hidden', function () {

			tooltip1.show();

			expect(typeof tooltip1.isActive()).toEqual('boolean');
			expect(tooltip1.isActive()).toBeTruthy();
		});
	});

	describe('Width method', function () {

		var $content;

		beforeEach(function () {
			tooltip1.show();

			$content = $body.children().last();
		});

		it('As a getter', function () {
			expect(tooltip1.width()).toEqual('auto');
		});

		it('As a setter', function () {

			var finalWidth = '123px';

			expect(tooltip1.width()).not.toEqual(finalWidth);

			tooltip1.width(finalWidth);

			expect(tooltip1.width(finalWidth)).toEqual(tooltip1);

			expect(tooltip1.width()).toEqual(finalWidth);
		});
	});

	describe('Height method', function () {

		var $content;

		beforeEach(function () {
			tooltip1.show();

			$content = $body.children().last();
		});

		it('As a getter', function () {
			expect(tooltip1.height()).toEqual('auto');
		});

		it('As a setter', function () {

			var finalHeight = '55px';

			expect(tooltip1.height()).not.toEqual(finalHeight);

			tooltip1.height(finalHeight);

			expect(tooltip1.height(finalHeight)).toEqual(tooltip1);

			expect(tooltip1.height()).toEqual(finalHeight);
		});
	});

	describe('Different configurations of content.', function () {

		describe('When a "content" parameter is defined into the configuration object.', function () {

			it('The content should be the same as configured', function () {

				tooltip2.content.set();

				expect(tooltip2.content.get()).toEqual('Tooltip with a defined content.');
			});
		});

		describe('When a "title" attribute is defined into the DOM element.', function () {

			it('The content should be the same as "title" attribute', function () {

				tooltip3.content.set();

				expect(tooltip3.content.get()).toEqual(tooltip3.el.title);
			});

			it('Should empty temporally the "title" attribute of the instantiation element at show().', function () {

				expect(tooltip3.el.title).not.toEqual('');

				tooltip3.show();

				expect(tooltip3.el.title).toEqual('');
			});
		});

		describe('When an "alt" AND a "title" attribute are defined into the DOM element.', function () {

			it('The content should be the same as "title" attribute and different form "alt" attribute.', function () {

				tooltip4.content.set();

				var content = tooltip4.content.get();

				expect(content).not.toEqual(tooltip4.el.alt);
				expect(content).toEqual(tooltip4.el.title);
			});

			it('Should empty temporally the "title" attribute of the instantiation element at show()', function () {

				expect(tooltip4.el.title).not.toEqual('');

				tooltip4.show();

				expect(tooltip4.el.title).toEqual('');
			});
		});
	});

	describe('Content methods', function () {

		var content = tooltip1.content,
			current;

		describe('.configure()', function () {

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

	describe('An instance configured with custom classnames', function () {

		it('should contain the specified classname in its container element', function () {

			tooltip2.show();

			var $container = $body.children().last();

			expect($container.hasClass('ch-box-lite')).not.toBeTruthy();
			expect($container.hasClass('test')).toBeTruthy();
		});
	});

	describe('Position method', function () {

		describe('as a getter should return the current "position" configuration', function () {

			var result = tooltip1.position();

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

				var newID = 'tooltip2';

				expect(tooltip1.position().context[0].id).not.toEqual(newID);

				tooltip1.position({
					'context': $('#tooltip2')
				});

				expect(tooltip1.position().context[0].id).toEqual(newID);
			});

			it('offset', function () {

				var newOffset = '12 34';

				expect(tooltip1.position().offset).not.toEqual(newOffset);

				tooltip1.position({
					'offset': newOffset
				});

				expect(tooltip1.position().offset).toEqual(newOffset);
			});

			it('points', function () {

				var newPoints = 'cb cb';

				expect(tooltip1.position().points).not.toEqual(newPoints);

				tooltip1.position({
					'points': newPoints
				});

				expect(tooltip1.position().points).toEqual(newPoints);
			});

			it('reposition', function () {

				var newReposition = false;

				expect(tooltip1.position().reposition).not.toEqual(newReposition);

				tooltip1.position({
					'reposition': newReposition
				});

				expect(tooltip1.position().reposition).toEqual(newReposition);
			});
		});
	});
});