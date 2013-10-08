var custom = $('#input_user').custom('jasmine', function (value) { return value === 'jasmine'; }, 'Jasmine rules!');

describe('ch.Custom', function () {
    it('should be a function', function () {
        expect(typeof ch.Custom).toEqual('function');
    });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Custom')).toBeTruthy();
        expect(typeof ch.Custom).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('custom')).toBeTruthy();
        expect(typeof $.fn.custom).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(custom instanceof ch.Validation).toBeTruthy();
    });

    it('should return an error when the value is diferent to "jasmine"', function () {
        custom.$trigger.val('Test');
        expect(custom.hasError()).toBeTruthy();
    });

    it('should remove the error when the value is "jasmine"', function () {
        custom.$trigger.val('jasmine');
        expect(custom.hasError()).toBeFalsy();
    });

    it('should set an error message', function () {
        expect(custom.message('jasmine')).toEqual('Jasmine rules!');
    });
});