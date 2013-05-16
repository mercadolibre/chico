var price = $('#input_user').price('Some text.');

describe('ch.Price', function () {
    it('should be a function', function () {
        expect(typeof ch.Price).toEqual('function');
    });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Price')).toBeTruthy();
        expect(typeof ch.Price).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('price')).toBeTruthy();
        expect(typeof $.fn.price).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(price instanceof ch.Validation).toBeTruthy();
    });

    it('should return an error when the value is not a price', function () {
        price.$el.val('Some text!');
        expect(price.hasError()).toBeTruthy();
    });

    it('shouldn\'t have got an error when the value is a price', function () {
        price.$el.val(2.5);
        expect(price.hasError()).toBeFalsy();
    });

    it('should set an error message', function () {
        expect(price.message('price')).toEqual('Some text.');
    });
});