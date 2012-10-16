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
			expect(document.querySelector('#ch-expandable-1').nodeType).toEqual(1);
		});

		it('.ch-expandable', function () {
			expect(document.querySelector('.ch-expandable').nodeType).toEqual(1);
		});

		it('.ch-expandable-trigger', function () {
			expect(document.querySelector('.ch-expandable-trigger').nodeType).toEqual(1);
		});

		it('.ch-user-no-select', function () {
			expect(document.querySelector('.ch-expandable-trigger.ch-user-no-select').nodeType).toEqual(1);
		});

		it('.ch-expandable-content', function () {
			expect(document.querySelector('.ch-expandable-content').nodeType).toEqual(1);
		});

		it('.ch-expandable-ico', function () {
			expect(document.querySelector('.ch-expandable-trigger.ch-expandable-ico').nodeType).toEqual(1);
		});

		it('.ch-hide', function () {
			expect(document.querySelector('.ch-expandable-content.ch-hide').nodeType).toEqual(1);
		});
	});

	describe('By defult', function () {
		it('Shold have a icon', function () {
			expect(document.querySelector('.ch-expandable-trigger.ch-expandable-ico').nodeType).toEqual(1);
		});

		it('Shold be closed', function () {
			expect(document.querySelector('.ch-expandable-content.ch-hide').nodeType).toEqual(1);
		});
	});

	describe('Show method', function () {
		it('Show', function () {
			expect(document.querySelector('#expandable-1 .ch-expandable-trigger-on')).toBe(null);
			expandable[0].show();
			expect(document.querySelector('#expandable-1 .ch-expandable-trigger-on').nodeType).toEqual(1);
		});
	});

	describe('Hide method', function () {
		it('Hide', function () {
			expandable[0].hide();
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
	});

});