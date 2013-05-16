var maxLength = $('#input_user').maxLength(30);

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
        maxLength.$el.val('The string length is higher than maxLength number.');
        expect(maxLength.hasError()).toBeTruthy();
    });

    it('should return an error when the value is smaller than "maxLength" number', function () {
        maxLength.$el.val('The string length is smaller');
        expect(maxLength.hasError()).toBeFalsy();
    });

});