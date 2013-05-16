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

    it('should have got an error when the value is empty', function () {
        string.$el.val(2);
        expect(string.hasError()).toBeTruthy();
    });

    it('shouldn\'t have got an error when the value is set', function () {
        string.$el.val('Some value');
        expect(string.hasError()).toBeFalsy();
    });

    it('should set an error message', function () {
        expect(string.message('string')).toEqual('Some text.');
    });
});