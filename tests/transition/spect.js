var transition = new ch.Transition(document.getElementById('transition'), {
        'fx': 'none'
    }).show(),
    t = transition.trigger,
    c = transition.container;

describe('Transition', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Transition')).toBeTruthy();
        expect(typeof ch.Transition).toEqual('function');
    });

    it('should return a new instance of Modal', function () {
        expect(transition instanceof ch.Modal).toBeTruthy();
    });
});

describe('It should have a container with', function () {

    it('role alert', function () {
        expect(c.getAttribute('role')).toEqual('alert');
    });

    it('specific CSS class names', function () {
        expect(ch.util.classList(c).contains('ch-transition')).toBeTruthy();
        expect(ch.util.classList(c).contains('ch-box-lite')).toBeTruthy();
    });

    transition.hide();
});