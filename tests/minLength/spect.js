var minLength = $('#input_user').minLength(30);

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
        minLength.$el.val('The string length is higher than minLength number.');
        expect(minLength.hasError()).toBeFalsy();
    });

    it('should return an error when the value is smaller than "minLength" number', function () {
        minLength.$el.val('The string length is smaller');
        expect(minLength.hasError()).toBeTruthy();
    });

});