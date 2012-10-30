describe('Dropdown', function () {
	var dropdown1 = $("#dropdown-1").dropdown(),
		dropdown2 = $("#dropdown-2").dropdown({'icon': false}),
		dropdown3 = $("#dropdown-3").dropdown({'open': true }),
		$el = $(dropdown1.element),
		$trigger = $el.children(':first-child'),
		$content = $el.children(':last-child'),

		showCallback = jasmine.createSpy('showCallback'),
		showEvent = jasmine.createSpy('showEvent'),
		hideCallback = jasmine.createSpy('hideCallback'),
		hideEvent = jasmine.createSpy('hideEvent'),
		readyEvent = jasmine.createSpy('readyEvent'),

		dropdown4 = $("#dropdown-4").dropdown({
			'onShow': function () { showCallback(); },
			'onHide': function () { hideCallback(); }
		});

	dropdown4
		.on('ready', function () { readyEvent(); })
		.on('show', function () { showEvent(); })
		.on('hide', function () { hideEvent(); });

	it('Should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Dropdown')).toBeTruthy();
		expect(typeof ch.Dropdown).toEqual('function');
	});

	describe('Shold have the following public properties:', function () {

		it('.element', function () {
			expect(ch.util.hasOwn(dropdown1, 'element')).toBeTruthy();
			expect(dropdown1.element.nodeType).toEqual(1);
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(dropdown1, 'type')).toBeTruthy();
			expect(typeof dropdown1.type).toEqual('string');
			expect(dropdown1.type).toEqual('dropdown');
		});

		it('.constructor', function () {
			expect(ch.util.hasOwn(dropdown1, 'constructor')).toBeTruthy();
			expect(typeof dropdown1.constructor).toEqual('function');
		});

		it('.uid', function () {
			expect(typeof dropdown1.uid).toEqual('number');
		});

	});

	describe('Shold have the following public methods:', function () {

		it('.hide()', function () {
			expect(ch.util.hasOwn(dropdown1, 'hide')).toBeTruthy();
			expect(typeof dropdown1.hide).toEqual('function');
		});

		it('.isActive()', function () {
			expect(ch.util.hasOwn(dropdown1, 'isActive')).toBeTruthy();
			expect(typeof dropdown1.isActive).toEqual('function');
		});

		it('.off()', function () {
			expect(ch.util.hasOwn(dropdown1, 'off')).toBeTruthy();
			expect(typeof dropdown1.off).toEqual('function');
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(dropdown1, 'on')).toBeTruthy();
			expect(typeof dropdown1.on).toEqual('function');
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(dropdown1, 'once')).toBeTruthy();
			expect(typeof dropdown1.once).toEqual('function');
		});

		it('.show()', function () {
			expect(ch.util.hasOwn(dropdown1, 'show')).toBeTruthy();
			expect(typeof dropdown1.show).toEqual('function');
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(dropdown1, 'trigger')).toBeTruthy();
			expect(typeof dropdown1.trigger).toEqual('function');
		});

		it('.position()', function () {
			expect(ch.util.hasOwn(dropdown1, 'position')).toBeTruthy();
			expect(typeof dropdown1.position).toEqual('function');
		});
	});

	describe('Shold have the following Classnames:', function () {

		it('.ch-dropdown', function () {
			expect($el.hasClass('ch-dropdown')).toBeTruthy();
		});

		it('.ch-dropdown-trigger', function () {
			expect($trigger.hasClass('ch-dropdown-trigger')).toBeTruthy();
		});

		it('.ch-btn-skin', function () {
			expect($trigger.hasClass('ch-btn-skin')).toBeTruthy();
		});

		it('.ch-btn-small', function () {
			expect($trigger.hasClass('ch-btn-small')).toBeTruthy();
		});

		it('.ch-user-no-select', function () {
			expect($trigger.hasClass('ch-user-no-select')).toBeTruthy();
		});

		it('.ch-dropdown-ico', function () {
			expect($trigger.hasClass('ch-dropdown-ico')).toBeTruthy();
		});

		it('.ch-dropdown-content', function () {
			expect($content.hasClass('ch-dropdown-content')).toBeTruthy();
		});

		it('.ch-hide', function () {
			expect($content.hasClass('ch-hide')).toBeTruthy();
		});
	});

	describe('Shold have the following ARIA attributes:', function () {
		it('role="menu"', function () {
			expect($content.attr('role')).toEqual('menu');
		});

		it('aria-hidden="true"', function () {
			expect($content.attr('aria-hidden')).toEqual('true');
		});
	});

	describe('By defult', function () {
		it('Shold have a icon', function () {
			expect($trigger.hasClass('ch-dropdown-ico')).toBeTruthy();
		});

		it('Shold be closed', function () {
			expect($content.hasClass('ch-hide')).toBeTruthy();
		});
	});

	describe('A intance configured without icon', function () {
		it('Shouldn\'t have the icon classname', function () {
			expect($(dropdown2.element).children(':first-child').hasClass('ch-dropdown-ico')).toBeFalsy();
		});
	});

	describe('A instance configured open by default', function () {
		it('Should have the open classname', function () {
			expect($(dropdown3.element).children(':first-child').hasClass('ch-dropdown-trigger-on')).toBeTruthy();
			expect($(dropdown3.element).children(':last-child').hasClass('ch-hide')).toBeFalsy();
		});
	});

	describe('Public methods', function () {

		it('.show()', function () {
			expect($trigger.hasClass('ch-dropdown-trigger-on')).toBeFalsy();
			var show = dropdown1.show();
			expect($trigger.hasClass('ch-dropdown-trigger-on')).toBeTruthy();
			expect($content.attr("aria-hidden")).toEqual("false");
			expect(show).toEqual(dropdown1);
		});

		it('.hide()', function () {
			var hide = dropdown1.hide();
			expect($trigger.hasClass('ch-dropdown-trigger-on')).toBeFalsy();
			expect($content.attr("aria-hidden")).toEqual("true");
			expect(hide).toEqual(dropdown1);
		});

		it('.isActive()', function () {
			var isActive = dropdown1.isActive();
			expect(isActive).toBeFalsy();

			dropdown1.show();
			isActive = dropdown1.isActive();
			expect(isActive).toBeTruthy();

			dropdown1.hide();
			isActive = dropdown1.isActive();
			expect(isActive).toBeFalsy();
		});
	});

	describe('Should execute the following callbacks:', function () {

		it('show', function () {
			dropdown4.show();
			expect(showCallback).toHaveBeenCalled();
		});

		it('hide', function () {
			dropdown4.hide();
			expect(hideCallback).toHaveBeenCalled();
		});
	});

	describe('Should execute the following events:', function () {

		it('ready', function () {
			waits(50);
			runs(function () {
				expect(readyEvent).toHaveBeenCalled();
			});
		});

		it('show', function () {
			dropdown4.show();
			expect(showEvent).toHaveBeenCalled();
		});

		it('hide', function () {
			dropdown4.hide();
			expect(hideEvent).toHaveBeenCalled();
		});
	});

});