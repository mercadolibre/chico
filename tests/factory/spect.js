var component,
    component2;

function ComponentTest (el, options) {
    this.el = el;
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

    it('should create a new instance using new \'ch.ComponentTest\' method', function () {
        expect(component).not.toBeDefined();

        expect(function () {
            component = new ch.ComponentTest(document.body, {'foo': 'bar'});
        }).not.toThrow();

        expect(component).toBeDefined();

        expect(component instanceof ComponentTest).toBeTruthy();
    });

    it('should return the same intance for the same DOMElement', function () {
        component = new ch.ComponentTest(document.body, {'foo': 'bar'});
        component2 = new ch.ComponentTest(document.body, {'foo': 'bar'});

        expect(component).toBeDefined();
        expect(component2).toBeDefined();
        expect(component).toEqual(component2);
    });
});