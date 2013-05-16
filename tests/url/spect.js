var url = $('#input_user').url('Some text.');

describe('ch.Url', function () {
    it('should be a function', function () {
        expect(typeof ch.Url).toEqual('function');
    });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Url')).toBeTruthy();
        expect(typeof ch.Url).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('url')).toBeTruthy();
        expect(typeof $.fn.url).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(url instanceof ch.Validation).toBeTruthy();
    });

    it('should have got an error when the value is not an url', function () {
        url.$el.val(2);
        expect(url.hasError()).toBeTruthy();
    });

    it('shouldn\'t have got an error when the value is an url', function () {
        url.$el.val('http://www.chico-ui.com.ar');
        expect(url.hasError()).toBeFalsy();
    });

    it('should set an error message', function () {
        expect(url.message('url')).toEqual('Some text.');
    });
});