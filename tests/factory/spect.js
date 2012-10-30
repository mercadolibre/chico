describe('Factory', function () {

	var widget,
		widget2;

	function WidgetTest ($el, options) {
		this.$el = $el;
		this.options = options;

		return this;
	}
	WidgetTest.prototype.name = 'widgetTest';
	WidgetTest.prototype.constructor = WidgetTest;

	ch.factory(WidgetTest);

	beforeEach(function () {
		widget = undefined;
	});

	it('Should be defined', function () {
		expect(ch.util.hasOwn(ch, 'factory')).toBeTruthy();
		expect(typeof ch.factory).toEqual('function');
	});

	it('Should export \'WidgetTest\' class into ch namespace', function () {
		expect(ch.util.hasOwn(ch, 'WidgetTest')).toBeTruthy();
	});

	it('Should attach \'.widgetTest()\' function property to the jQuery/Zepto object', function () {
		expect(ch.util.hasOwn($, 'widgetTest')).toBeTruthy();
	});

	it('Should add \'.widgetTest()\' function property to the $.fn object (create a plugin)', function () {
		expect(ch.util.hasOwn($.fn, 'widgetTest')).toBeTruthy();
	});

	it('Should create a new instance using new \'ch.WidgetTest\' method', function () {
		expect(widget).not.toBeDefined();

		expect(function () {
			widget = new ch.WidgetTest($('body'), {'foo': 'bar'});
		}).not.toThrow();

		expect(widget).toBeDefined();

		expect(widget instanceof WidgetTest).toBeTruthy();
	});

	it('Should create a new instance using \'$.widgetTest\' jQuery/Zepto method', function () {
		expect(widget).not.toBeDefined();

		expect(function () {
			widget = $.widgetTest($('body'), {'foo': 'bar'});
		}).not.toThrow();

		expect(widget).toBeDefined();

		expect(widget instanceof WidgetTest).toBeTruthy();
	});

	it('Should create a new instance using the jQuery/Zepto plugin', function () {
		expect(widget).not.toBeDefined();

		expect(function () {
			widget = $('body').widgetTest({'foo': 'bar'});
		}).not.toThrow();

		expect(widget).toBeDefined();

		expect(widget instanceof WidgetTest).toBeTruthy();
	});

	it('Should create a new instance for each query selector and return a collection of instances', function () {

		widget = $('body, div').widgetTest({'foo': 'bar'});

		expect(Array.isArray(widget)).toBeTruthy();
		expect(widget[0] instanceof WidgetTest).toBeTruthy();
		expect(widget[0] !== widget[1]).toBeTruthy();

	});

	it('Should return the same intance for the same DOMElement', function () {
		widget = $('body').widgetTest({'foo': 'bar'});
 		widget2 = $('body').widgetTest({'foo': 'bar'});

		expect(widget).toBeDefined();
		expect(widget2).toBeDefined();
		expect(widget === widget2).toBeTruthy();

	});

});