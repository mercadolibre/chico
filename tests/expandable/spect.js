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

	describe('By defult', function () {
		it('Shold have a icon', function () {
			expect(document.querySelector('.ch-expandable-trigger.ch-expandable-ico').nodeType).toEqual(1);
		});

		it('Shold be closed', function () {
			expect(document.querySelector('.ch-expandable-content.ch-hide').nodeType).toEqual(1);
		});
	});

	describe('Shold have the following public properties:', function () {
		var widget = expandable[0];

		it('.element', function () {
			expect(ch.util.hasOwn(widget, 'element')).toBeTruthy();
			expect(widget.element.nodeType).toEqual(1);
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(widget, 'type')).toBeTruthy();
			expect(typeof widget.type).toEqual('string');
			expect(widget.type).toEqual('expandable');
		});

		it('.constructor', function () {
			expect(ch.util.hasOwn(widget, 'constructor')).toBeTruthy();
			expect(typeof widget.constructor).toEqual('function');
		});

		it('.uid', function () {
			expect(typeof widget.uid).toEqual('number');
		});

	});

	describe('Shold have the following public methods:', function () {
		var widget = expandable[0];

		it('.hide()', function () {
			expect(ch.util.hasOwn(widget, 'hide')).toBeTruthy();
		});

		it('.isActive()', function () {
			expect(ch.util.hasOwn(widget, 'isActive')).toBeTruthy();
		});

		it('.off()', function () {
			expect(ch.util.hasOwn(widget, 'off')).toBeTruthy();
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(widget, 'on')).toBeTruthy();
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(widget, 'once')).toBeTruthy();
		});

		it('.show()', function () {
			expect(ch.util.hasOwn(widget, 'show')).toBeTruthy();
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(widget, 'trigger')).toBeTruthy();
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

});