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

describe('Factory', function () {

    beforeEach(function () {
        widget = undefined;
    });

    it('should be defined', function () {
        expect(ch.factory).toBeDefined();
        expect(typeof ch.factory).toEqual('function');
    });

    it('should export \'WidgetTest\' class into ch namespace', function () {
        expect(ch.WidgetTest).toBeDefined();
    });

    it('should attach \'.widgetTest()\' function property to the $ object', function () {
        expect($.widgetTest).toBeDefined();
    });

    it('should add \'.widgetTest()\' function property to the $.fn object (create a plugin)', function () {
        expect($.fn.widgetTest).toBeDefined();
    });

    it('should create a new instance using new \'ch.WidgetTest\' method', function () {
        expect(widget).not.toBeDefined();

        expect(function () {
            widget = new ch.WidgetTest($('body'), {'foo': 'bar'});
        }).not.toThrow();

        expect(widget).toBeDefined();

        expect(widget instanceof WidgetTest).toBeTruthy();
    });

    it('should create a new instance using \'$.widgetTest\' jQuery/Zepto method', function () {
        expect(widget).not.toBeDefined();

        expect(function () {
            widget = $.widgetTest($('body'), {'foo': 'bar'});
        }).not.toThrow();

        expect(widget).toBeDefined();

        expect(widget instanceof WidgetTest).toBeTruthy();
    });

    it('should create a new instance using the jQuery/Zepto plugin', function () {
        expect(widget).not.toBeDefined();

        expect(function () {
            widget = $('body').widgetTest({'foo': 'bar'});
        }).not.toThrow();

        expect(widget).toBeDefined();

        expect(widget instanceof WidgetTest).toBeTruthy();
    });

    it('should create a new instance for each query selector and return a collection of instances', function () {

        widget = $('body, div').widgetTest({'foo': 'bar'});

        expect(Array.isArray(widget)).toBeTruthy();
        expect(widget[0] instanceof WidgetTest).toBeTruthy();
        expect(widget[0] !== widget[1]).toBeTruthy();

    });

    it('should return the same intance for the same DOMElement', function () {
        widget = $('body').widgetTest({'foo': 'bar'});
        widget2 = $('body').widgetTest({'foo': 'bar'});

        expect(widget).toBeDefined();
        expect(widget2).toBeDefined();
        expect(widget).toEqual(widget2);
    });

    it('should save the intance into the DOMElement', function () {
        widget = $('body').widgetTest();
        expect(widget).toEqual($('body').data('widgetTest'));
    });
});