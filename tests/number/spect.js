var number = $('#input_user').number('Some text.');

describe('ch.Number', function () {
    it('should be a function', function () {
        expect(typeof ch.Number).toEqual('function');
    });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Number')).toBeTruthy();
        expect(typeof ch.Number).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('number')).toBeTruthy();
        expect(typeof $.fn.number).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(number instanceof ch.Validation).toBeTruthy();
    });

    it('should return an error when the value is not a number', function () {
        number.$trigger.val('Some text!');
        expect(number.hasError()).toBeTruthy();
    });

    it('shouldn\'t have got an error when the value is a number', function () {
        number.$trigger.val(2);
        expect(number.hasError()).toBeFalsy();
    });

    it('should set an error message', function () {
        expect(number.message('number')).toEqual('Some text.');
    });
});

describe('The test of some values', function () {
    var condition = number.conditions.number;

    it('should be valid', function () {
        expect(condition.test(10)).toBeTruthy();
        expect(condition.test(0)).toBeTruthy();
        expect(condition.test(10.0)).toBeTruthy();
        expect(condition.test(-10)).toBeTruthy();
    });

    it('should be invalid', function () {
        expect(condition.test(false)).toBeFalsy();
        expect(condition.test({})).toBeFalsy();
        expect(condition.test([])).toBeFalsy();
    });
});