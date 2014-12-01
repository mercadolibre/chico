var layer1 = new ch.Layer(document.getElementById('layer1'), {
        'content': 'test',
        'fx': 'none'
    }).show(),
    t = layer1.trigger,
    c = layer1.container,
    layer2 = new ch.Layer(document.getElementById('layer2'), {
        'content': 'test',
        'fx': 'none'
    });

describe('Layer', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Layer')).toBeTruthy();
        expect(typeof ch.Layer).toEqual('function');
    });

    it('should return a new instance of Layer', function () {
        expect(layer1 instanceof ch.Layer).toBeTruthy();
    });
});

describe('It should have a container with', function () {

    it('role tooltip', function () {
        expect(c.getAttribute('role')).toEqual('tooltip');
    });

    it('specific CSS class names', function () {
        expect(ch.util.classList(c).contains('ch-layer')).toBeTruthy();
        expect(ch.util.classList(c).contains('ch-box-lite')).toBeTruthy();
        expect(ch.util.classList(c).contains('ch-cone')).toBeTruthy();
    });

    it('alignment', function () {
        expect(c.getAttribute('data-side')).toEqual('bottom');
        expect(c.getAttribute('data-align')).toEqual('left');
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