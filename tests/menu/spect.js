describe('Menu', function () {
	var menu = [
		$("#menu-1").menu(),
		$("#menu-2").menu({'icon': false}),
		$("#menu-3").menu({'selected': '1#1'})
	];

	it('Should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Menu')).toBeTruthy();
		expect(typeof ch.Menu).toEqual('function');
	});

	describe('Shold have the following public properties:', function () {

		it('.element', function () {
			expect(ch.util.hasOwn(menu[0], 'element')).toBeTruthy();
			expect(menu[0].element.nodeType).toEqual(1);
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(menu[0], 'type')).toBeTruthy();
			expect(typeof menu[0].type).toEqual('string');
			expect(menu[0].type).toEqual('menu');
		});

		it('.constructor', function () {
			expect(ch.util.hasOwn(menu[0], 'constructor')).toBeTruthy();
			expect(typeof menu[0].constructor).toEqual('function');
		});

		it('.uid', function () {
			expect(typeof menu[0].uid).toEqual('number');
		});

	});

	describe('Shold have the following public methods:', function () {

		it('.select()', function () {
			expect(ch.util.hasOwn(menu[0], 'select')).toBeTruthy();
		});

		it('.off()', function () {
			expect(ch.util.hasOwn(menu[0], 'off')).toBeTruthy();
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(menu[0], 'on')).toBeTruthy();
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(menu[0], 'once')).toBeTruthy();
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(menu[0], 'trigger')).toBeTruthy();
		});
	});

	describe('Shold have the following ID and Classnames:', function () {
		it('.ch-menu', function () {
			expect($(menu[0].element).hasClass('ch-menu')).toBeTruthy();
		});

		it('.ch-expandable', function () {
			expect($(menu[0].element.children[0]).hasClass('ch-expandable')).toBeTruthy();
		});

		it('.ch-bellows', function () {
			expect($(menu[0].element.children[4]).hasClass('ch-bellows')).toBeTruthy();
		});
	});

	describe('Shold have the following ARIA attributes:', function () {
		it('role="navigation"', function () {
			expect($(menu[0].element).attr('role')).toEqual('navigation');
		});

		it('role="presentation"', function () {
			expect($(menu[0].element.children[4]).attr('role')).toEqual('presentation');
		});
	});

	describe('By defult', function () {
		it('Shold have a icon', function () {
			expect($(menu[0].element.children[0].children[0]).hasClass('ch-expandable-ico')).toBeTruthy();
		});

		it('Shold be closed', function () {
			expect($(menu[0].element.children[0].children[1]).hasClass('ch-hide')).toBeTruthy();
		});
	});

	describe('Public methods', function () {
		it('.select()', function () {
			var selected = menu[0].select();
			expect(selected).toEqual('');

			menu[0].select(1);
			selected = menu[0].select();

			expect(selected).toEqual(1);
		});
	});

	describe('A intance configured without icon', function () {
		it('Shouldn\'t have the icon classname', function () {
			expect($(menu[1].element.children[0].children[0]).hasClass('ch-expandable-ico')).toBeFalsy();
		});
	});

	describe('A instance configured open by default', function () {
		it('Should have the open classname', function () {
			expect($(menu[2].element.children[0].children[0]).hasClass('ch-expandable-trigger-on')).toBeTruthy();
			expect($(menu[2].element.children[0].children[1]).hasClass('ch-hide')).toBeFalsy();
		});
	});
});