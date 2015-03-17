var modal = new ch.Modal(document.getElementById('modal'), {
        'content': 'test',
        'fx': 'none'
    }).show(),
    t = modal.trigger,
    c = modal.container;

describe('Modal', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Modal')).toBeTruthy();
        expect(typeof ch.Modal).toEqual('function');
    });

    it('should return a new instance of Modal', function () {
        expect(modal instanceof ch.Modal).toBeTruthy();
    });
});

describe('It should have a container with', function () {

    it('role dialog', function () {
        expect(c.getAttribute('role')).toEqual('dialog');
    });

    it('specific CSS class names', function () {
        expect(ch.util.classList(c).contains('ch-modal')).toBeTruthy();
        expect(ch.util.classList(c).contains('ch-box-lite')).toBeTruthy();
    });

    it('specific width', function () {
        expect(c.style.width).toEqual('50%');
    });

    it('alignment', function () {
        expect(c.getAttribute('data-side')).toEqual('center');
        expect(c.getAttribute('data-align')).toEqual('center');
    });
});

describe('It should have an underlay', function () {

    it('that exists', function () {
        expect(document.querySelectorAll('.ch-underlay').length).toEqual(1);
    });

    it('with tabindex -1', function () {
        expect(document.querySelector('.ch-underlay').getAttribute('tabindex')).toEqual('-1');
    });

    it('that disappears when Modal closes', function () {
        modal.hide();
        expect(document.querySelectorAll('.ch-underlay').length).toEqual(0);
    });
});