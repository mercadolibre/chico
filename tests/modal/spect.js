var modal = $('#modal').modal({
        'content': 'test',
        'fx': 'none'
    }).show(),
    $t = modal.$trigger,
    $c = modal.$container;

describe('Modal', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Modal')).toBeTruthy();
        expect(typeof ch.Modal).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('modal')).toBeTruthy();
        expect(typeof $.fn.modal).toEqual('function');
    });

    it('should return a new instance of Modal', function () {
        expect(modal instanceof ch.Modal).toBeTruthy();
    });
});

describe('It should have a container with', function () {

    it('role dialog', function () {
        expect($c.attr('role')).toEqual('dialog');
    });

    it('specific CSS class names', function () {
        expect($c.hasClass('ch-modal')).toBeTruthy();
        expect($c.hasClass('ch-box-lite')).toBeTruthy();
    });

    it('specific width', function () {
        expect($c[0].style.width).toEqual('50%');
    });

    it('alignment', function () {
        expect($c.attr('data-side')).toEqual('center');
        expect($c.attr('data-align')).toEqual('center');
    });
});

describe('It should have an underlay', function () {

    it('that exists', function () {
        expect($('.ch-underlay').length).toEqual(1);
    });

    it('with tabindex -1', function () {
        expect($('.ch-underlay')[0].tabIndex).toEqual(-1);
    });

    it('that dissapears when Modal closes', function () {
        modal.hide();
        expect($('.ch-underlay').length).toEqual(0);
    });
});