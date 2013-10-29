var component,
    component2;

function ComponentTest ($el, options) {
    this.$el = $el;
    this.options = options;

    return this;
}
ComponentTest.prototype.name = 'componentTest';
ComponentTest.prototype.constructor = ComponentTest;

ch.factory(ComponentTest);

describe('Factory', function () {

    beforeEach(function () {
        component = undefined;
    });

    it('should be defined', function () {
        expect(ch.factory).toBeDefined();
        expect(typeof ch.factory).toEqual('function');
    });

    it('should export \'ComponentTest\' class into ch namespace', function () {
        expect(ch.ComponentTest).toBeDefined();
    });

    it('should attach \'.componentTest()\' function property to the $ object', function () {
        expect($.componentTest).toBeDefined();
    });

    it('should add \'.componentTest()\' function property to the $.fn object (create a plugin)', function () {
        expect($.fn.componentTest).toBeDefined();
    });

    it('should create a new instance using new \'ch.ComponentTest\' method', function () {
        expect(component).not.toBeDefined();

        expect(function () {
            component = new ch.ComponentTest($('body'), {'foo': 'bar'});
        }).not.toThrow();

        expect(component).toBeDefined();

        expect(component instanceof ComponentTest).toBeTruthy();
    });

    it('should create a new instance using \'$.componentTest\' jQuery/Zepto method', function () {
        expect(component).not.toBeDefined();

        expect(function () {
            component = $.componentTest($('body'), {'foo': 'bar'});
        }).not.toThrow();

        expect(component).toBeDefined();

        expect(component instanceof ComponentTest).toBeTruthy();
    });

    it('should create a new instance using the jQuery/Zepto plugin', function () {
        expect(component).not.toBeDefined();

        expect(function () {
            component = $('body').componentTest({'foo': 'bar'});
        }).not.toThrow();

        expect(component).toBeDefined();

        expect(component instanceof ComponentTest).toBeTruthy();
    });

    it('should create a new instance for each query selector and return a collection of instances', function () {

        component = $('body, div').componentTest({'foo': 'bar'});

        expect(Array.isArray(component)).toBeTruthy();
        expect(component[0] instanceof ComponentTest).toBeTruthy();
        expect(component[0] !== component[1]).toBeTruthy();

    });

    it('should return the same intance for the same DOMElement', function () {
        component = $('body').componentTest({'foo': 'bar'});
        component2 = $('body').componentTest({'foo': 'bar'});

        expect(component).toBeDefined();
        expect(component2).toBeDefined();
        expect(component).toEqual(component2);
    });

    it('should save the intance into the DOMElement', function () {
        component = $('body').componentTest();
        expect(component).toEqual($('body').data('componentTest'));
    });
});