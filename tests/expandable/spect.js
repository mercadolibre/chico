describe('Expandable', function () {
	var expandable = [
		$("#expandable-1").expandable(),
		$("#expandable-2").expandable({'icon': false}),
		$("#expandable-3").expandable({'open': true })
	];

	it('Should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Expandable')).toBeTruthy();
		expect(typeof ch.Expandable).toEqual('function');
	});

	describe('Shold have the following public properties:', function () {

		it('.element', function () {
			expect(ch.util.hasOwn(expandable[0], 'element')).toBeTruthy();
			expect(expandable[0].element.nodeType).toEqual(1);
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(expandable[0], 'type')).toBeTruthy();
			expect(typeof expandable[0].type).toEqual('string');
			expect(expandable[0].type).toEqual('expandable');
		});

		it('.constructor', function () {
			expect(ch.util.hasOwn(expandable[0], 'constructor')).toBeTruthy();
			expect(typeof expandable[0].constructor).toEqual('function');
		});

		it('.uid', function () {
			expect(typeof expandable[0].uid).toEqual('number');
		});

	});

	describe('Shold have the following public methods:', function () {

		it('.hide()', function () {
			expect(ch.util.hasOwn(expandable[0], 'hide')).toBeTruthy();
		});

		it('.isActive()', function () {
			expect(ch.util.hasOwn(expandable[0], 'isActive')).toBeTruthy();
		});

		it('.off()', function () {
			expect(ch.util.hasOwn(expandable[0], 'off')).toBeTruthy();
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(expandable[0], 'on')).toBeTruthy();
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(expandable[0], 'once')).toBeTruthy();
		});

		it('.show()', function () {
			expect(ch.util.hasOwn(expandable[0], 'show')).toBeTruthy();
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(expandable[0], 'trigger')).toBeTruthy();
		});
	});

	describe('Shold have the following ID and Classnames:', function () {

		it('#ch-expandable-1', function () {
			expect($('#ch-expandable-1')[0].nodeType).toEqual(1);
		});

		it('.ch-expandable', function () {
			expect($('.ch-expandable')[0].nodeType).toEqual(1);
		});

		it('.ch-expandable-trigger', function () {
			expect($('.ch-expandable-trigger')[0].nodeType).toEqual(1);
		});

		it('.ch-user-no-select', function () {
			expect($('.ch-expandable-trigger.ch-user-no-select')[0].nodeType).toEqual(1);
		});

		it('.ch-expandable-content', function () {
			expect($('.ch-expandable-content')[0].nodeType).toEqual(1);
		});

		it('.ch-expandable-ico', function () {
			expect($('.ch-expandable-trigger.ch-expandable-ico')[0].nodeType).toEqual(1);
		});

		it('.ch-hide', function () {
			expect($('.ch-expandable-content.ch-hide')[0].nodeType).toEqual(1);
		});
	});

	describe('Shold have the following ARIA attributes:', function () {
		it('aria-expanded="false"', function () {
			expect($('.ch-expandable-trigger').attr("aria-expanded")).toEqual("false");
		});

		it('aria-hidden="true"', function () {
			expect($('.ch-expandable-content.ch-hide').attr("aria-hidden")).toEqual("true");
		});
	});

	describe('By defult', function () {
		it('Shold have a icon', function () {
			expect($('.ch-expandable-trigger.ch-expandable-ico')[0].nodeType).toEqual(1);
		});

		it('Shold be closed', function () {
			expect($('.ch-expandable-content.ch-hide')[0].nodeType).toEqual(1);
		});
	});

	describe('Public methods', function () {
		it('.show()', function () {
			expect($('#expandable-1 .ch-expandable-trigger-on')[0]).not.toBeDefined();
			var show = expandable[0].show();
			expect($('#expandable-1 .ch-expandable-trigger-on')[0].nodeType).toEqual(1);
			expect($('#expandable-1 .ch-expandable-trigger').attr("aria-expanded")).toEqual("true");
			expect(show).toEqual(expandable[0]);
		});

		it('.hide()', function () {
			var hide = expandable[0].hide();
			expect($('#expandable-1 .ch-expandable-trigger-on')[0]).not.toBeDefined();
			expect($('#expandable-1 .ch-expandable-content').attr("aria-hidden")).toEqual("true");
			expect(hide).toEqual(expandable[0]);
		});

		it('.isActive()', function () {
			var isActive = expandable[0].isActive();
			expect(isActive).toBeFalsy();

			expandable[0].show();
			isActive = expandable[0].isActive();
			expect(isActive).toBeTruthy();

			expandable[0].hide();
			isActive = expandable[0].isActive();
			expect(isActive).toBeFalsy();
		});
	});

	describe('A intance configured without icon', function () {
		it('Shouldn\'t have the icon classname', function () {
			expect($('#expandable-2 .ch-expandable-trigger.ch-expandable-ico')[0]).not.toBeDefined();
		});
	});

	describe('A instance configured open by default', function () {
		it('Should have the open classname', function () {
			expect($('#expandable-3 .ch-expandable-trigger-on')[0].nodeType).toEqual(1);
		});
	});

});