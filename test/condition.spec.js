describe('Condition', function () {
    var c,
        condition;

    before(function () {
        c = {
            'name': 'test',
            'message': 'Error',
            'fn': function (value) {
                return (value === 'Mocha');
            }
        };
        condition = new ch.Condition(c);
    });

    it('should be defined on ch object', function () {
        expect(ch.Condition).to.exist;
        expect(ch.Condition).to.be.a('function');
    });

    it('should be an object', function () {
        expect(condition).to.be.an('object');
    });

    it('should be return a new instance', function () {
        expect(condition).to.be.an.instanceof(ch.Condition);
    });


    describe('It should have the following public properties:', function () {
        it('.name', function () {
            expect(condition.name).to.exist;
            expect(condition.name).to.be.a('string');
        });

        it('.message', function () {
            expect(condition.message).to.exist;
            expect(condition.message).to.be.a('string');
        });

        it('.fn', function () {
            expect(condition.fn).to.exist;
            expect(condition.fn).to.be.a('function');
        });
    });

    describe('It should have the following public methods:', function () {
        it('.test()', function () {
            expect(condition.test).to.exist;
            expect(condition.test).to.be.a('function');
        });

        it('.enable()', function () {
            expect(condition.enable).to.exist;
            expect(condition.enable).to.be.a('function');
        });

        it('.disable()', function () {
            expect(condition.disable).to.exist;
            expect(condition.disable).to.be.a('function');
        });
    });

    describe('Its .test() method:', function () {
        it('should return "false" when it has got error', function () {
            expect(condition.test('test')).to.be.false;
        });

        it('should return "true" when it hasn\'t got error', function () {
            expect(condition.test('Mocha')).to.be.true;
        });
    });

});
