var maxLength = $('#input_user').maxLength(10, 'Some text {#num#}.');

describe('ch.MaxLength', function () {
    it('should be a function', function () {
        expect(typeof ch.MaxLength).toEqual('function');
    });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('MaxLength')).toBeTruthy();
        expect(typeof ch.MaxLength).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('maxLength')).toBeTruthy();
        expect(typeof $.fn.maxLength).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(maxLength instanceof ch.Validation).toBeTruthy();
    });

    it('should return an error when the value is higher than "maxLength" number', function () {
        maxLength.$trigger.val('The string length is higher than maxLength number.');
        expect(maxLength.hasError()).toBeTruthy();
    });

    it('shouldn\'t have got an error when the value is smaller than "maxLength" number', function () {
        maxLength.$trigger.val('String');
        expect(maxLength.hasError()).toBeFalsy();
    });

    it('should set an error message', function () {
        expect(maxLength.message('maxLength')).toEqual('Some text 10.');
    });
});

describe('The test of some values', function () {
    var condition = maxLength.conditions.maxLength;

    it('should be valid', function () {
        expect(condition.test('012345')).toBeTruthy();
        expect(condition.test('0123 5')).toBeTruthy();
        expect(condition.test('012. 5')).toBeTruthy();
    });

    it('should be invalid', function () {
        expect(condition.test('012345678910')).toBeFalsy();
        expect(condition.test('0123456 8910')).toBeFalsy();
        expect(condition.test('012345. 8910')).toBeFalsy();
    });
});