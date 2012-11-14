describe('Menu', function () {
	var menu1 = $("#menu-1").menu(),
		menu2 = $("#menu-2").menu({'icon': false}),
		menu3 = $("#menu-3").menu({'selected': '1#1'}),

		$el = $(menu1.element),
		$children = $el.children(),
		$bellows = $el.children(':last-child'),
		$trigger = $el.children().children(':first-child').eq(0),
		$content = $el.children().children(':last-child').eq(0),

		selectCallback = jasmine.createSpy('selectCallback'),
		selectEvent = jasmine.createSpy('selectEvent'),
		readyEvent = jasmine.createSpy('readyEvent'),

		menu4 = $("#menu-4").menu({
			'onSelect': function () { selectCallback(); }
		});

	menu4
		.on('ready', function () { readyEvent(); })
		.on('select', function () { selectEvent(); });

	it('Should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Menu')).toBeTruthy();
		expect(typeof ch.Menu).toEqual('function');
	});

	describe('Shold have the following public properties:', function () {

		it('.element', function () {
			expect(ch.util.hasOwn(menu1, 'element')).toBeTruthy();
			expect(menu1.element.nodeType).toEqual(1);
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(menu1, 'type')).toBeTruthy();
			expect(typeof menu1.type).toEqual('string');
			expect(menu1.type).toEqual('menu');
		});

		it('.constructor', function () {
			expect(ch.util.hasOwn(menu1, 'constructor')).toBeTruthy();
			expect(typeof menu1.constructor).toEqual('function');
		});

		it('.uid', function () {
			expect(typeof menu1.uid).toEqual('number');
		});

	});

	describe('Shold have the following public methods:', function () {

		it('.select()', function () {
			expect(ch.util.hasOwn(menu1, 'select')).toBeTruthy();
			expect(typeof menu1.select).toEqual('function');
		});

		it('.off()', function () {
			expect(ch.util.hasOwn(menu1, 'off')).toBeTruthy();
			expect(typeof menu1.off).toEqual('function');
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(menu1, 'on')).toBeTruthy();
			expect(typeof menu1.on).toEqual('function');
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(menu1, 'once')).toBeTruthy();
			expect(typeof menu1.once).toEqual('function');
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(menu1, 'trigger')).toBeTruthy();
			expect(typeof menu1.trigger).toEqual('function');
		});
	});

	describe('Shold have the following ID and Classnames:', function () {
		it('.ch-menu', function () {
			expect($el.hasClass('ch-menu')).toBeTruthy();
		});

		it('.ch-expandable', function () {
			expect($children.hasClass('ch-expandable')).toBeTruthy();
		});

		it('.ch-bellows', function () {
			expect($bellows.hasClass('ch-bellows')).toBeTruthy();
		});
	});

	describe('Shold have the following ARIA attributes:', function () {
		it('role="navigation"', function () {
			expect($el.attr('role')).toEqual('navigation');
		});

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
			var selected = menu1.select();
			expect(selected).toEqual('');

			// Setter
			menu1.select(1);
			selected = menu1.select();
			expect(selected).toEqual(1);

			expect($trigger.hasClass('ch-expandable-trigger-on')).toBeTruthy();
			expect($content.hasClass('ch-hide')).toBeFalsy();

			menu1.select(2);
			expect($children.eq(1).children(':first-child').hasClass('ch-expandable-trigger-on')).toBeTruthy();
			expect($children.eq(1).children(':last-child').hasClass('ch-hide')).toBeFalsy();
		});
	});

	describe('A intance configured without icon', function () {
		it('Shouldn\'t have the icon classname', function () {
			expect($(menu2.element).children(':first-child').children(':first-child').hasClass('ch-expandable-ico')).toBeFalsy();
		});
	});

	describe('A instance configured open by default', function () {
		it('Should have the open classname', function () {
			expect($(menu3.element).children(':first-child').children(':first-child').hasClass('ch-expandable-trigger-on')).toBeTruthy();
			expect($(menu3.element).children(':first-child').children(':last-child').hasClass('ch-hide')).toBeFalsy();
		});
	});

	describe('Should execute the following callbacks:', function () {
		beforeEach(function () {
			listener = jasmine.createSpy('listener');
		});

		it('select', function () {
			menu4.select(1);
			waits(500)
			runs(function () {
				expect(selectCallback).toHaveBeenCalled();
				menu4.select(1);
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
				expect(readyEvent).toHaveBeenCalled();
			});

		});

		it('select', function () {
			menu4.select(1);
			waits(500)
			runs(function () {
				expect(selectEvent).toHaveBeenCalled();
			});
		});
	});
});