var layer1 = $('#layer1').layer({
        'content': 'test',
        'fx': 'none'
    }).show(),
    $t = layer1.$trigger,
    $c = layer1.$container,
    layer2 = $('#layer2').layer({
        'content': 'test',
        'fx': 'none'
    });

describe('Layer', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Layer')).toBeTruthy();
        expect(typeof ch.Layer).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('layer')).toBeTruthy();
        expect(typeof $.fn.layer).toEqual('function');
    });

    it('should return a new instance of Layer', function () {
        expect(layer1 instanceof ch.Layer).toBeTruthy();
    });
});

describe('It should have a container with', function () {

    it('role tooltip', function () {
        expect($c.attr('role')).toEqual('tooltip');
    });

    it('specific CSS class names', function () {
        expect($c.hasClass('ch-layer')).toBeTruthy();
        expect($c.hasClass('ch-box-lite')).toBeTruthy();
        expect($c.hasClass('ch-cone')).toBeTruthy();
    });

    it('alignment', function () {
        expect($c.attr('data-side')).toEqual('bottom');
        expect($c.attr('data-align')).toEqual('left');
    });
});

describe('It should close', function () {

    it('when another Layer opens', function () {
        expect(layer1.isShown()).toBeTruthy();
        expect(layer2.isShown()).toBeFalsy();

        layer2.show();

        expect(layer1.isShown()).toBeFalsy();
        expect(layer2.isShown()).toBeTruthy();

        layer2.hide();
    });
});