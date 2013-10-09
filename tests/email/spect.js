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
        email.$trigger.val('Test');
        expect(email.hasError()).toBeTruthy();
    });

    it('should remove the error when the value is a valid email', function () {
        email.$trigger.val('chico@mercadolibre.com');
        expect(email.hasError()).toBeFalsy();
    });

    it('should set an error message', function () {
        expect(email.message('email')).toEqual('Please, enter a valid email.');
    });
});

describe('The test of some values', function () {
    var condition = email.conditions.email;

    it('should be valid', function () {
        expect(condition.test('foo@foo.bar')).toBeTruthy();
        expect(condition.test('foo@foo.ba')).toBeTruthy();
        expect(condition.test('foo@fo.ba')).toBeTruthy();
        expect(condition.test('o@fo.ba')).toBeTruthy();
        expect(condition.test('o@o.r')).toBeTruthy();
        expect(condition.test('foo21bar@foo.bar')).toBeTruthy();
        expect(condition.test('foo21.bar@foo.bar')).toBeTruthy();
        expect(condition.test('21.bar@foo.bar')).toBeTruthy();
        expect(condition.test('foo.bar@foo.bar')).toBeTruthy();
        expect(condition.test('fo-o.bar@foo.bar')).toBeTruthy();
        expect(condition.test('foo.b-ar@foo.bar')).toBeTruthy();
        expect(condition.test('fo-o.b-ar@foo.bar')).toBeTruthy();
        expect(condition.test('foo-bar@foo.bar')).toBeTruthy();
        expect(condition.test('foo_bar@foo.bar')).toBeTruthy();
    });

    it('should be invalid', function () {
        expect(condition.test('@.foo')).toBeFalsy();
        expect(condition.test('foo@bar.')).toBeFalsy();
        expect(condition.test('.bar@')).toBeFalsy();
        expect(condition.test('@')).toBeFalsy();
    });
});