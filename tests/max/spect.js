var max = $('#input_user').max(10, 'Some text {#num#}.');

describe('ch.Max', function () {
    it('should be a function', function () {
        expect(typeof ch.Max).toEqual('function');
    });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Max')).toBeTruthy();
        expect(typeof ch.Max).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('max')).toBeTruthy();
        expect(typeof $.fn.max).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(max instanceof ch.Validation).toBeTruthy();
    });

    it('should have got an error when the value is a number smaller than "max" number', function () {
        max.$trigger.val(22);
        expect(max.hasError()).toBeTruthy();
    });

    it('shouldn\'t have got an error an error when the value is a number higher than "max" number', function () {
        max.$trigger.val(6);
        expect(max.hasError()).toBeFalsy();
    });

    it('should set an error message', function () {
        expect(max.message('max')).toEqual('Some text 10.');
    });
});

describe('The test of some values', function () {
    var condition = max.conditions.max;

    it('should be valid', function () {
        expect(condition.test(5)).toBeTruthy();
        expect(condition.test('5')).toBeTruthy();
        expect(condition.test(-5)).toBeTruthy();
    });

    it('should be invalid', function () {
        expect(condition.test('11')).toBeFalsy();
        expect(condition.test(11)).toBeFalsy();
    });
});