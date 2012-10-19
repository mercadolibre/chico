describe('Tooltip', function () {
	var tooltip = $("#tooltip").tooltip();

	it('Should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Tooltip')).toBeTruthy();
		expect(typeof ch.Tooltip).toEqual('function');
	});

	describe('Should have the following public properties:', function () {

		it('.element', function () {
			expect(ch.util.hasOwn(tooltip, 'element')).toBeTruthy();
			expect(tooltip.element.nodeType).toEqual(1);
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(tooltip, 'type')).toBeTruthy();
			expect(typeof tooltip.type).toEqual('string');
			expect(tooltip.type).toEqual('tooltip');
		});

		it('.constructor', function () {
			expect(ch.util.hasOwn(tooltip, 'constructor')).toBeTruthy();
			expect(typeof tooltip.constructor).toEqual('function');
		});

		it('.uid', function () {
			expect(typeof tooltip.uid).toEqual('number');
		});
	});

	describe('Shold have the following public methods:', function () {

		it('.content()', function () {
			expect(ch.util.hasOwn(tooltip, 'content')).toBeTruthy();
		});

		it('.height()', function () {
			expect(ch.util.hasOwn(tooltip, 'height')).toBeTruthy();
		});

		it('.hide()', function () {
			expect(ch.util.hasOwn(tooltip, 'hide')).toBeTruthy();
		});

		it('.isActive()', function () {
			expect(ch.util.hasOwn(tooltip, 'isActive')).toBeTruthy();
		});

		it('.position()', function () {
			expect(ch.util.hasOwn(tooltip, 'position')).toBeTruthy();
		});

		it('.show()', function () {
			expect(ch.util.hasOwn(tooltip, 'show')).toBeTruthy();
		});

		it('.width()', function () {
			expect(ch.util.hasOwn(tooltip, 'width')).toBeTruthy();
		});
	});

	describe('Should have the following WAI-ARIA roles and properties:', function () {
		it('aria-describedby', function () {
			expect($(tooltip.element).attr("aria-describedby")).toEqual('ch-tooltip-1');
		});
	});

	describe('Should have the following ID and Classnames:', function () {

		it('#ch-tooltip-1', function () {
			expect(tooltip.element.id).toEqual('tooltip');
		});

		it('.ch-points-ltlb', function () {
			expect($(tooltip.element).hasClass('ch-points-ltlb')).toBeTruthy();
		});
	});

	describe('Show method', function () {

		describe('Should create an element at bottom of the body:', function () {

			it('Should have the same ID than the "describedby" ARIA attribute', function () {

				var $content = $(document.body).children().last();

				expect($content.attr('id')).not.toEqual('ch-tooltip-1');

				tooltip.show();

				$content = $(document.body).children().last();

				expect($content.attr('id')).toEqual('ch-tooltip-1');
			});

			it('Should have the ARIA role "tooltip".', function () {
				expect($content.attr('role')).toEqual('tooltip');
			});

			describe('Should have the following class names:', function () {

				it('.ch-tooltip', function () {
					console.log("algo");
					expect($content.hasClass('ch-tooltip')).toBeTruthy();
				});

				it('.ch-box-lite', function () {
					expect($content.hasClass('ch-box-lite')).toBeTruthy();
				});

				it('.ch-cone', function () {
					expect($content.hasClass('ch-cone')).toBeTruthy();
				});

				it('.ch-points-ltlb', function () {
					expect($content.hasClass('ch-points-ltlb')).toBeTruthy();
				});
			});

			describe('Should have a child as container of the widget content:', function () {

				var $child = $content.children(':first');

				it('Should have the "ch-tooltip-content" classname.', function () {
					expect($child.hasClass('ch-tooltip-content')).toBeTruthy();
				});

				it('Should contain the same content (DOM) of the attribute "alt" of the instantiation element.', function () {
					expect($child.text()).toEqual(tooltip.element.alt);
				});

				it('Should contain the same content (via ch.Content) of the attribute "alt" of the instantiation element.', function () {
					expect(tooltip.content.get()).toEqual(tooltip.element.alt);
				});
			});
		});
	});

	/*describe('Hide method', function () {
		it('Hide', function () {
			//tooltip.hide();
			expect(document.querySelector('#expandable-1 .ch-expandable-trigger-on')).toBe(null);
		});
	});

	describe('A intance configured without icon', function () {
		it('Shouldn\'t have the icon classname', function () {
			expect(document.querySelector('#expandable-2 .ch-expandable-trigger.ch-expandable-ico')).toBe(null);
		});
	});

	describe('A instance configured open by default', function () {
		it('Should have the open classname', function () {
			expect(document.querySelector('#expandable-3 .ch-expandable-trigger-on').nodeType).toEqual(1);
		});
	});*/

});