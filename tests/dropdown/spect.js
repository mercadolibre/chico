describe('Dropdown', function () {
	var dropdown = [
		$('#dropdown-1').dropdown(),
		$('#dropdown-2').dropdown({'icon': false}),
		$('#dropdown-3').dropdown({'open': true})
	];

	it('Should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Dropdown')).toBeTruthy();
		expect(typeof ch.Dropdown).toEqual('function');
	});

	describe('Shold have the following public properties:', function () {

		it('.element', function () {
			expect(ch.util.hasOwn(dropdown[0], 'element')).toBeTruthy();
			expect(dropdown[0].element.nodeType).toEqual(1);
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(dropdown[0], 'type')).toBeTruthy();
			expect(typeof dropdown[0].type).toEqual('string');
			expect(dropdown[0].type).toEqual('dropdown');
		});

		it('.constructor', function () {
			expect(ch.util.hasOwn(dropdown[0], 'constructor')).toBeTruthy();
			expect(typeof dropdown[0].constructor).toEqual('function');
		});

		it('.uid', function () {
			expect(typeof dropdown[0].uid).toEqual('number');
		});

	});

	describe('Shold have the following public methods:', function () {

		it('.hide()', function () {
			expect(ch.util.hasOwn(dropdown[0], 'hide')).toBeTruthy();
		});

		it('.isActive()', function () {
			expect(ch.util.hasOwn(dropdown[0], 'isActive')).toBeTruthy();
		});

		it('.off()', function () {
			expect(ch.util.hasOwn(dropdown[0], 'off')).toBeTruthy();
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(dropdown[0], 'on')).toBeTruthy();
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(dropdown[0], 'once')).toBeTruthy();
		});

		it('.show()', function () {
			expect(ch.util.hasOwn(dropdown[0], 'show')).toBeTruthy();
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(dropdown[0], 'trigger')).toBeTruthy();
		});

		it('.position()', function () {
			expect(ch.util.hasOwn(dropdown[0], 'position')).toBeTruthy();
		});
	});

	describe('Shold have the following Classnames:', function () {

		it('.ch-dropdown', function () {
			expect($(dropdown[0].element).hasClass('ch-dropdown')).toBeTruthy();
		});

		it('.ch-dropdown-trigger', function () {
			expect($(dropdown[0].element.children[0]).hasClass('ch-dropdown-trigger')).toBeTruthy();
		});

		it('.ch-btn-skin', function () {
			expect($(dropdown[0].element.children[0]).hasClass('ch-btn-skin')).toBeTruthy();
		});

		it('.ch-btn-small', function () {
			expect($(dropdown[0].element.children[0]).hasClass('ch-btn-small')).toBeTruthy();
		});

		it('.ch-user-no-select', function () {
			expect($(dropdown[0].element.children[0]).hasClass('ch-user-no-select')).toBeTruthy();
		});

		it('.ch-dropdown-ico', function () {
			expect($(dropdown[0].element.children[0]).hasClass('ch-dropdown-ico')).toBeTruthy();
		});

		it('.ch-dropdown-content', function () {
			expect($(dropdown[0].element.children[1]).hasClass('ch-dropdown-content')).toBeTruthy();
		});

		it('.ch-hide', function () {
			expect($(dropdown[0].element.children[1]).hasClass('ch-hide')).toBeTruthy();
		});
	});

	describe('Shold have the following ARIA attributes:', function () {
		it('role="menu"', function () {
			expect($(dropdown[0].element.children[1]).attr('role')).toEqual('menu');
		});

		it('aria-hidden="true"', function () {
			expect($(dropdown[0].element.children[1]).attr('aria-hidden')).toEqual('true');
		});
	});

	describe('By defult', function () {
		it('Shold have a icon', function () {
			expect($(dropdown[0].element.children[0]).hasClass('ch-dropdown-ico')).toBeTruthy();
		});

		it('Shold be closed', function () {
			expect($(dropdown[0].element.children[1]).hasClass('ch-hide')).toBeTruthy();
		});
	});

	describe('A intance configured without icon', function () {
		it('Shouldn\'t have the icon classname', function () {
			expect($(dropdown[1].element.children[0]).hasClass('ch-dropdown-ico')).toBeFalsy();
		});
	});

	describe('A instance configured open by default', function () {
		it('Should have the open classname', function () {
			expect($(dropdown[2].element.children[0]).hasClass('ch-dropdown-trigger-on')).toBeTruthy();
			expect($(dropdown[2].element.children[1]).hasClass('ch-hide')).toBeFalsy();
		});
	});

	describe('Public methods', function () {

		it('.show()', function () {
			expect($(dropdown[0].element.children[0]).hasClass('ch-dropdown-trigger-on')).toBeFalsy();
			var show = dropdown[0].show();
			expect($(dropdown[0].element.children[0]).hasClass('ch-dropdown-trigger-on')).toBeTruthy();
			expect($(dropdown[0].element.children[1]).attr("aria-hidden")).toEqual("false");
			expect(show).toEqual(dropdown[0]);
		});

		it('.hide()', function () {
			var hide = dropdown[0].hide();
			expect($(dropdown[0].element.children[0]).hasClass('ch-dropdown-trigger-on')).toBeFalsy();
			expect($(dropdown[0].element.children[1]).attr("aria-hidden")).toEqual("true");
			expect(hide).toEqual(dropdown[0]);
		});

		it('.isActive()', function () {
			var isActive = dropdown[0].isActive();
			expect(isActive).toBeFalsy();

			dropdown[0].show();
			isActive = dropdown[0].isActive();
			expect(isActive).toBeTruthy();

			dropdown[0].hide();
			isActive = dropdown[0].isActive();
			expect(isActive).toBeFalsy();
		});
	});

});