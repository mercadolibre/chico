var string = $('#input_user').string('Some text.');

describe('ch.String', function () {
    it('should be a function', function () {
        expect(typeof ch.String).toEqual('function');
    });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('String')).toBeTruthy();
        expect(typeof ch.String).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('string')).toBeTruthy();
        expect(typeof $.fn.string).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(string instanceof ch.Validation).toBeTruthy();
    });

    it('should have got an error when the value is not a string', function () {
        string.$trigger.val(2);
        expect(string.hasError()).toBeTruthy();
    });

    it('shouldn\'t have got an error when the value is a string', function () {
        string.$trigger.val('Some value');
        expect(string.hasError()).toBeFalsy();
    });

    it('should set an error message', function () {
        expect(string.message('string')).toEqual('Some text.');
    });
});

describe('The test of some values', function () {
    var condition = string.conditions.string;

    it('should be valid', function () {
        expect(condition.test('foo')).toBeTruthy();
        expect(condition.test('foo bar')).toBeTruthy();
    });

    it('should be invalid', function () {
        expect(condition.test('.foo')).toBeFalsy();
        expect(condition.test('foo bar.')).toBeFalsy();
        expect(condition.test('foo .bar')).toBeFalsy();
        expect(condition.test('foo@bar')).toBeFalsy();
        expect(condition.test('foo"bar')).toBeFalsy();
    });
});