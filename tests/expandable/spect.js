describe('Expandable', function () {
	var expandable1 = $("#expandable-1").expandable(),
		expandable2 = $("#expandable-2").expandable({'icon': false}),
		expandable3 = $("#expandable-3").expandable({'open': true }),
		expandable4 = $("#expandable-4").expandable({
			'onShow': function () { listener(); },
			'onHide': function () { listener(); }
		}),
		$el = $(expandable1.element),
		$trigger = $el.children(':first-child'),
		$content = $el.children(':last-child'),
		listener;

	expandable4
		.on('ready', function () { listener(); })
		.on('show', function () { listener(); })
		.on('hide', function () { listener(); });

	it('Should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Expandable')).toBeTruthy();
		expect(typeof ch.Expandable).toEqual('function');
	});

	describe('Shold have the following public properties:', function () {

		it('.element', function () {
			expect(ch.util.hasOwn(expandable1, 'element')).toBeTruthy();
			expect(expandable1.element.nodeType).toEqual(1);
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(expandable1, 'type')).toBeTruthy();
			expect(typeof expandable1.type).toEqual('string');
			expect(expandable1.type).toEqual('expandable');
		});

		it('.constructor', function () {
			expect(ch.util.hasOwn(expandable1, 'constructor')).toBeTruthy();
			expect(typeof expandable1.constructor).toEqual('function');
		});

		it('.uid', function () {
			expect(typeof expandable1.uid).toEqual('number');
		});

	});

	describe('Shold have the following public methods:', function () {

		it('.hide()', function () {
			expect(ch.util.hasOwn(expandable1, 'hide')).toBeTruthy();
			expect(typeof expandable1.hide).toEqual('function');
		});

		it('.isActive()', function () {
			expect(ch.util.hasOwn(expandable1, 'isActive')).toBeTruthy();
			expect(typeof expandable1.isActive).toEqual('function');
		});

		it('.off()', function () {
			expect(ch.util.hasOwn(expandable1, 'off')).toBeTruthy();
			expect(typeof expandable1.off).toEqual('function');
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(expandable1, 'on')).toBeTruthy();
			expect(typeof expandable1.on).toEqual('function');
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(expandable1, 'once')).toBeTruthy();
			expect(typeof expandable1.once).toEqual('function');
		});

		it('.show()', function () {
			expect(ch.util.hasOwn(expandable1, 'show')).toBeTruthy();
			expect(typeof expandable1.show).toEqual('function');
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(expandable1, 'trigger')).toBeTruthy();
			expect(typeof expandable1.trigger).toEqual('function');
		});
	});

	describe('Shold have the following ID and Classnames:', function () {

		it('#ch-expandable-1', function () {
			expect(expandable1.element.children[1].id).toBeTruthy();
		});

		it('.ch-expandable', function () {
			expect($el.hasClass('ch-expandable')).toBeTruthy();
		});

		it('.ch-expandable-trigger', function () {
			expect($trigger.hasClass('ch-expandable-trigger')).toBeTruthy();
		});

		it('.ch-user-no-select', function () {
			expect($trigger.hasClass('ch-user-no-select')).toBeTruthy();
		});

		it('.ch-expandable-ico', function () {
			expect($trigger.hasClass('ch-expandable-ico')).toBeTruthy();
		});

		it('.ch-expandable-content', function () {
			expect($content.hasClass('ch-expandable-content')).toBeTruthy();
		});

		it('.ch-hide', function () {
			expect($content.hasClass('ch-hide')).toBeTruthy();
		});
	});

	describe('Shold have the following ARIA attributes:', function () {
		it('aria-expanded="false"', function () {
			expect($trigger.attr('aria-expanded')).toEqual('false');
		});

		it('aria-hidden="true"', function () {
			expect($content.attr('aria-hidden')).toEqual('true');
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
		it('.show()', function () {
			expect($trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
			var show = expandable1.show();
			expect($trigger.hasClass('ch-expandable-trigger-on')).toBeTruthy();
			expect($content.attr("aria-hidden")).toEqual("false");
			expect(show).toEqual(expandable1);
		});

		it('.hide()', function () {
			var hide = expandable1.hide();
			expect($trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
			expect($content.attr("aria-hidden")).toEqual("true");
			expect(hide).toEqual(expandable1);
		});

		it('.isActive()', function () {
			var isActive = expandable1.isActive();
			expect(isActive).toBeFalsy();

			expandable1.show();
			isActive = expandable1.isActive();
			expect(isActive).toBeTruthy();

			expandable1.hide();
			isActive = expandable1.isActive();
			expect(isActive).toBeFalsy();
		});
	});

	describe('A intance configured without icon', function () {
		it('Shouldn\'t have the icon classname', function () {
			expect($(expandable2.element).children(':first-child').hasClass('ch-expandable-ico')).toBeFalsy();
		});
	});

	describe('A instance configured open by default', function () {
		it('Should have the open classname', function () {
			expect($(expandable3.element).children(':first-child').hasClass('ch-expandable-trigger-on')).toBeTruthy();
			expect($(expandable3.element).children(':last-child').hasClass('ch-hide')).toBeFalsy();
		});
	});

	describe('Should execute the following callbacks:', function () {
		beforeEach(function () {
			listener = jasmine.createSpy('listener');
		});

		it('show', function () {
			expandable4.show();
			expect(listener).toHaveBeenCalled();
		});

		it('hide', function () {
			expandable4.hide();
			expect(listener).toHaveBeenCalled();
		});
	});

	describe('Should execute the following events:', function () {

		beforeEach(function () {
			listener = jasmine.createSpy('listener');
		});

		it('ready', function () {
			waits(75);
			runs(function () {
				expect(listener).toHaveBeenCalled();
			});

		});

		it('show', function () {
			expandable4.show();
			expect(listener).toHaveBeenCalled();
		});

		it('hide', function () {
			expandable4.hide();
			expect(listener).toHaveBeenCalled();
		});
	});
});