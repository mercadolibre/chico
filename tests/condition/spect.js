var c = {
        'name': 'test',
        'message': 'Error',
        'fn': function (value) {
            return (value === 'Jasmine');
        }
    },
    condition = new ch.Condition(c);

describe('Condition', function () {
    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Condition')).toBeTruthy();
        expect(typeof ch.Condition).toEqual('function');
    });

    it('should be an object', function () {
        expect(typeof condition).toEqual('object');
    });

    it('should be return a new instance', function () {
        expect(condition instanceof ch.Condition).toBeTruthy();
    });
});

describe('It should have the following public properties:', function () {

    it('.name', function () {
        expect(condition.name).toBeDefined();
        expect(typeof condition.name).toEqual('string');
    });

    it('.message', function () {
        expect(condition.message).toBeDefined();
        expect(typeof condition.message).toEqual('string');
    });

    it('.fn', function () {
        expect(condition.fn).toBeDefined();
        expect(typeof condition.fn).toEqual('function');
    });
});

describe('It should have the following public methods:', function () {

    it('.test()', function () {
        expect(condition.test).toBeDefined();
        expect(typeof condition.test).toEqual('function');
    });

    it('.enable()', function () {
        expect(condition.enable).toBeDefined();
        expect(typeof condition.enable).toEqual('function');
    });

    it('.disable()', function () {
        expect(condition.disable).toBeDefined();
        expect(typeof condition.disable).toEqual('function');
    });
});

describe('Its .test() method:', function () {
    it('should return "false" when it has got error', function () {
        expect(condition.test('test')).toBeFalsy();
    });

    it('should return "true" when it hasn\'t got error', function () {
        expect(condition.test('Jasmine')).toBeTruthy();
    });
});