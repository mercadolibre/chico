var zoom = $('#zoom').zoom().show(),
    $t = zoom.$trigger,
    $c = zoom.$container;

describe('Zoom', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Zoom')).toBeTruthy();
        expect(typeof ch.Zoom).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('zoom')).toBeTruthy();
        expect(typeof $.fn.zoom).toEqual('function');
    });

    it('should return a new instance of Zoom', function () {
        expect(zoom instanceof ch.Zoom).toBeTruthy();
    });
});

describe('It should have a container with', function () {

    it('role tooltip', function () {
        expect($c.attr('role')).toEqual('tooltip');
    });

    it('specific CSS class names', function () {
        expect($c.hasClass('ch-zoom')).toBeTruthy();
    });

    it('specific size', function () {
        expect($c[0].style.width).toEqual('300px');
        expect($c[0].style.height).toEqual('300px');
    });
});

describe('On show', function () {

    it('should have a visual feedback of zoomed area', function () {
        expect($t.children('.ch-zoom-seeker').length).toEqual(1);
    });

    it('should have the zoomed image within the container', function () {
        expect($c.children('img').attr('src')).toEqual($t.href);
    });
});