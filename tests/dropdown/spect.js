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
			expect($('.ch-dropdown')[0].nodeType).toEqual(1);
		});

		it('.ch-dropdown-trigger', function () {
			expect($('.ch-dropdown-trigger')[0].nodeType).toEqual(1);
		});

		it('.ch-btn-skin.ch-btn-small', function () {
			expect($('.ch-dropdown-trigger.ch-btn-skin.ch-btn-small')[0].nodeType).toEqual(1);
		});

		it('.ch-user-no-select', function () {
			expect($('.ch-dropdown-trigger.ch-user-no-select')[0].nodeType).toEqual(1);
		});

		it('.ch-dropdown-ico', function () {
			expect($('.ch-dropdown-trigger.ch-dropdown-ico')[0].nodeType).toEqual(1);
		});

		it('.ch-hide', function () {
			expect($('.ch-dropdown-content.ch-hide')[0].nodeType).toEqual(1);
		});
	});

	describe('Shold have the following ARIA attributes:', function () {
		it('role="menu"', function () {
			expect($('.ch-dropdown-content.ch-hide').attr("role")).toEqual("menu");
		});

		it('aria-hidden="true"', function () {
			expect($('.ch-dropdown-content.ch-hide').attr("aria-hidden")).toEqual("true");
		});
	});

	describe('By defult', function () {
		it('Shold have a icon', function () {
			expect($('.ch-dropdown-trigger.ch-dropdown-ico')[0].nodeType).toEqual(1);
		});

		it('Shold be closed', function () {
			expect($('.ch-dropdown-content.ch-hide')[0].nodeType).toEqual(1);
		});
	});

	describe('A intance configured without icon', function () {
		it('Shouldn\'t have the icon classname', function () {
			expect($('#dropdown-2 .ch-dropdown-trigger.ch-dropdown-ico')[0]).not.toBeDefined();
		});
	});

	describe('A instance configured open by default', function () {
		it('Should have the open classname', function () {
			expect($('#dropdown-3 .ch-dropdown-trigger-on')[0].nodeType).toEqual(1);
		});
	});

	describe('Public methods', function () {

		it('.show()', function () {
			expect($('#dropdown-1 .ch-dropdown-trigger-on')[0]).not.toBeDefined();
			var show = dropdown[0].show();
			expect($('#dropdown-1 .ch-dropdown-trigger-on')[0].nodeType).toEqual(1);
			expect($('#dropdown-1 .ch-dropdown-content').attr("aria-hidden")).toEqual("false");
			expect(show).toEqual(dropdown[0]);
		});

		it('.hide()', function () {
			var hide = dropdown[0].hide();
			expect($('#dropdown-1 .ch-dropdown-trigger-on')[0]).not.toBeDefined();
			expect($('#dropdown-1 .ch-dropdown-content').attr("aria-hidden")).toEqual("true");
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