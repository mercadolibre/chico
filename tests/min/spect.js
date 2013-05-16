var min = $('#input_user').min(10, 'Some text {#num#}.');

describe('ch.Min', function () {
    it('should be a function', function () {
        expect(typeof ch.Min).toEqual('function');
    });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Min')).toBeTruthy();
        expect(typeof ch.Min).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('min')).toBeTruthy();
        expect(typeof $.fn.min).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(min instanceof ch.Validation).toBeTruthy();
    });

    it('should return an error when the value is a number smaller than "min" number', function () {
        min.$el.val(6);
        expect(min.hasError()).toBeTruthy();
    });

    it('shouldn\'t have got an error when the value is a number higher than "min" number', function () {
        min.$el.val(22);
        expect(min.hasError()).toBeFalsy();
    });

    it('should set an error message', function () {
        expect(min.message('min')).toEqual('Some text 10.');
    });
});