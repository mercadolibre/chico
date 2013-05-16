var email = $('#input_user').email('Please, enter a valid email.');

describe('ch.Email', function () {
    it('should be a function', function () {
        expect(typeof ch.Email).toEqual('function');
    });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Email')).toBeTruthy();
        expect(typeof ch.Email).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('email')).toBeTruthy();
        expect(typeof $.fn.email).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(email instanceof ch.Validation).toBeTruthy();
    });

    it('should return an error when the value is diferent to a valid email', function () {
        email.$el.val('Test');
        expect(email.hasError()).toBeTruthy();
    });

    it('should remove the error when the value is a valid email', function () {
        email.$el.val('chico@mercadolibre.com');
        expect(email.hasError()).toBeFalsy();
    });

    it('should set an error message', function () {
        expect(email.message('email')).toEqual('Please, enter a valid email.');
    });
});