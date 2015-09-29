describe('Factory', function () {
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

    beforeEach(function () {
        component = undefined;
    });

    it('should be defined', function () {
        expect(ch.factory).to.exist;
        expect(ch.factory).to.be.a('function');
    });

    it('should export \'ComponentTest\' class into ch namespace', function () {
        expect(ch.ComponentTest).to.exist;
    });

    it('should create a new instance using new \'ch.ComponentTest\' method', function () {
        expect(component).to.be.undefined;

        expect(function () {
            component = new ch.ComponentTest(document.body, {'foo': 'bar'});
        }).to.not.throw();

        expect(component).to.exist;

        expect(component).to.be.an.instanceof(ComponentTest);
    });

    it('should return the same intance for the same DOMElement', function () {
        component = new ch.ComponentTest(document.body, {'foo': 'bar'});
        component2 = new ch.ComponentTest(document.body, {'foo': 'bar'});

        expect(component).to.exist;
        expect(component2).to.exist;
        expect(component).to.eql(component2);
    });
});
