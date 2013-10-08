var tooltip = $('#tooltip').tooltip({
        'content': 'test',
        'fx': 'none'
    }).show(),
    $t = tooltip.$trigger,
    $c = tooltip.$container;

describe('Tooltip', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Tooltip')).toBeTruthy();
        expect(typeof ch.Tooltip).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('tooltip')).toBeTruthy();
        expect(typeof $.fn.tooltip).toEqual('function');
    });

    it('should return a new instance of Layer', function () {
        expect(tooltip instanceof ch.Layer).toBeTruthy();
    });
});

describe('It should have a container with', function () {

    it('role tooltip', function () {
        expect($c.attr('role')).toEqual('tooltip');
    });

    it('specific CSS class names', function () {
        expect($c.hasClass('ch-tooltip')).toBeTruthy();
        expect($c.hasClass('ch-cone')).toBeTruthy();
    });
});