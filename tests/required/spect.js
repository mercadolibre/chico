var required = $('#input_user').required('Some text.');

describe('ch.Required', function () {
    it('should be a function', function () {
        expect(typeof ch.Required).toEqual('function');
    });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Required')).toBeTruthy();
        expect(typeof ch.Required).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('required')).toBeTruthy();
        expect(typeof $.fn.required).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(required instanceof ch.Validation).toBeTruthy();
    });

    it('should have got an error when the value is empty', function () {
        expect(required.hasError()).toBeTruthy();
    });

    it('shouldn\'t have got an error when the value is set', function () {
        required.$trigger.val('Some value!');
        expect(required.hasError()).toBeFalsy();
    });

    it('should set an error message', function () {
        expect(required.message('required')).toEqual('Some text.');
    });
});