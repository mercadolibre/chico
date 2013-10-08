var transition = $('#transition').transition({
        'fx': 'none'
    }).show(),
    $t = transition.$trigger,
    $c = transition.$container;

describe('Transition', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Transition')).toBeTruthy();
        expect(typeof ch.Transition).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('transition')).toBeTruthy();
        expect(typeof $.fn.transition).toEqual('function');
    });

    it('should return a new instance of Modal', function () {
        expect(transition instanceof ch.Modal).toBeTruthy();
    });
});

describe('It should have a container with', function () {

    it('role alert', function () {
        expect($c.attr('role')).toEqual('alert');
    });

    it('specific CSS class names', function () {
        expect($c.hasClass('ch-transition')).toBeTruthy();
        expect($c.hasClass('ch-box-lite')).toBeTruthy();
    });

    transition.hide();
});