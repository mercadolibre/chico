var max = $('#input_user').max(10);

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

    it('should return an error when the value is a number smaller than "max" number', function () {
        max.$el.val(22);
        expect(max.hasError()).toBeTruthy();
    });

    it('should return an error when the value is a number higher than "max" number', function () {
        max.$el.val(6);
        expect(max.hasError()).toBeFalsy();
    });
});