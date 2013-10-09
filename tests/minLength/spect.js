var minLength = $('#input_user').minLength(10, 'Some text {#num#}.');

describe('ch.MinLength', function () {
    it('should be a function', function () {
        expect(typeof ch.MinLength).toEqual('function');
    });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('MinLength')).toBeTruthy();
        expect(typeof ch.MinLength).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('minLength')).toBeTruthy();
        expect(typeof $.fn.minLength).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(minLength instanceof ch.Validation).toBeTruthy();
    });

    it('should return an error when the value is higher than "minLength" number', function () {
        minLength.$trigger.val('The string length is higher than minLength number.');
        expect(minLength.hasError()).toBeFalsy();
    });

    it('shouldn\'t have got an error when the value is smaller than "minLength" number', function () {
        minLength.$trigger.val('String');
        expect(minLength.hasError()).toBeTruthy();
    });

    it('should set an error message', function () {
        expect(minLength.message('minLength')).toEqual('Some text 10.');
    });

});

describe('The test of some values', function () {
    var condition = minLength.conditions.minLength;

    it('should be valid', function () {
        expect(condition.test('012345678910')).toBeTruthy();
        expect(condition.test('012345678 10')).toBeTruthy();
        expect(condition.test('01234567. 10')).toBeTruthy();
    });

    it('should be invalid', function () {
        expect(condition.test('012345678')).toBeFalsy();
        expect(condition.test('0123456 8')).toBeFalsy();
        expect(condition.test('012345. 8')).toBeFalsy();
    });
});