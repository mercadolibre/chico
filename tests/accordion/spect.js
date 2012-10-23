describe('Accordion', function () {
	var accordion1 = $("#accordion-1").accordion(),
		accordion2 = $("#accordion-2").accordion({'icon': false}),
		accordion3 = $("#accordion-3").accordion({'selected': '1#1'}),
		accordion4 = $("#accordion-4").menu({
			'onSelect': function () { listener(); }
		}),
		$el = $(accordion1.element),
		$children = $el.children(),
		$bellows = $el.children(':last-child'),
		$trigger = $el.children().children(':first-child').eq(0),
		$content = $el.children().children(':last-child').eq(0),
		readyListener = jasmine.createSpy('readyListener'),
		listener;

	accordion4
		.on('ready', function () { readyListener(); })
		.on('select', function () { listener(); });

	it('Should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Accordion')).toBeTruthy();
		expect(typeof ch.Accordion).toEqual('function');
	});

	describe('Shold have the following public properties:', function () {

		it('.element', function () {
			expect(ch.util.hasOwn(accordion1, 'element')).toBeTruthy();
			expect(accordion1.element.nodeType).toEqual(1);
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(accordion1, 'type')).toBeTruthy();
			expect(typeof accordion1.type).toEqual('string');
			expect(accordion1.type).toEqual('accordion');
		});

		it('.constructor', function () {
			expect(ch.util.hasOwn(accordion1, 'constructor')).toBeTruthy();
			expect(typeof accordion1.constructor).toEqual('function');
		});

		it('.uid', function () {
			expect(typeof accordion1.uid).toEqual('number');
		});

	});

	describe('Shold have the following public methods:', function () {

		it('.select()', function () {
			expect(ch.util.hasOwn(accordion1, 'select')).toBeTruthy();
			expect(typeof accordion1.select).toEqual('function');
		});

		it('.off()', function () {
			expect(ch.util.hasOwn(accordion1, 'off')).toBeTruthy();
			expect(typeof accordion1.off).toEqual('function');
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(accordion1, 'on')).toBeTruthy();
			expect(typeof accordion1.on).toEqual('function');
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(accordion1, 'once')).toBeTruthy();
			expect(typeof accordion1.once).toEqual('function');
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(accordion1, 'trigger')).toBeTruthy();
			expect(typeof accordion1.trigger).toEqual('function');
		});
	});

	describe('Shold have the following ID and Classnames:', function () {
		it('.ch-accordion', function () {
			expect($el.hasClass('ch-accordion')).toBeTruthy();
		});

		it('.ch-expandable', function () {
			expect($children.hasClass('ch-expandable')).toBeTruthy();
		});

		it('.ch-bellows', function () {
			expect($bellows.hasClass('ch-bellows')).toBeTruthy();
		});
	});

	describe('Shold have the following ARIA attributes:', function () {
		it('role="presentation"', function () {
			expect($bellows.attr('role')).toEqual('presentation');
		});
	});

	describe('By defult', function () {
		it('Shold have a icon', function () {
			expect($trigger.hasClass('ch-expandable-ico')).toBeTruthy();
		});

		it('Shold be closed', function () {
			expect($content.hasClass('ch-hide')).toBeTruthy();
		});
	});

	describe('Public methods', function () {
		it('.select()', function () {
			// Getter
			var selected = accordion1.select();
			expect(selected).toEqual('');

			// Setter
			accordion1.select(1);
			selected = accordion1.select();
			expect(selected).toEqual(1);

			expect($trigger.hasClass('ch-expandable-trigger-on')).toBeTruthy();
			expect($content.hasClass('ch-hide')).toBeFalsy();

			accordion1.select(2);
			expect($trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
			expect($content.hasClass('ch-hide')).toBeTruthy();

			expect($children.eq(1).children(':first-child').hasClass('ch-expandable-trigger-on')).toBeTruthy();
			expect($children.eq(1).children(':last-child').hasClass('ch-hide')).toBeFalsy();
		});
	});

	describe('A intance configured without icon', function () {
		it('Shouldn\'t have the icon classname', function () {
			expect($(accordion2.element).children(':first-child').children(':first-child').hasClass('ch-expandable-ico')).toBeFalsy();
		});
	});

	describe('A instance configured open by default', function () {
		it('Should have the open classname', function () {
			expect($(accordion3.element).children(':first-child').children(':first-child').hasClass('ch-expandable-trigger-on')).toBeTruthy();
			expect($(accordion3.element).children(':first-child').children(':last-child').hasClass('ch-hide')).toBeFalsy();
		});
	});

	describe('Should execute the following callbacks:', function () {
		beforeEach(function () {
			listener = jasmine.createSpy('listener');
		});

		it('select', function () {
			accordion4.select(1);
			waits(500)
			runs(function () {
				expect(listener).toHaveBeenCalled();
				accordion4.select(1);
			});

		});

	});

	describe('Should execute the following events:', function () {

		beforeEach(function () {
			listener = jasmine.createSpy('listener');
		});

		it('ready', function () {
			waits(50);
			runs(function () {
				expect(readyListener).toHaveBeenCalled();
			});

		});

		it('select', function () {
			accordion4.select(1);
			waits(500)
			runs(function () {
				expect(listener).toHaveBeenCalled();
			});
		});
	});
});