var zoom = new ch.Zoom(document.getElementById('zoom')).show(),
    t = zoom.trigger,
    c = zoom.container,
    showed = false;

    zoom.on('show', function (){
        showed = true;
    });

describe('Zoom', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Zoom')).toBeTruthy();
        expect(typeof ch.Zoom).toEqual('function');
    });

    it('should return a new instance of Zoom', function () {
        expect(zoom instanceof ch.Zoom).toBeTruthy();
    });
});

describe('It should have a container with', function () {

    it('role tooltip', function () {
        expect(c.getAttribute('role')).toEqual('tooltip');
    });

    it('specific CSS class names', function () {
        expect(ch.util.classList(c).contains('ch-zoom')).toBeTruthy();
    });

    it('specific size', function () {
        expect(c.style.width).toEqual('300px');
        expect(c.style.height).toEqual('300px');
    });
});

describe('On show', function () {

    it('should have a visual feedback of zoomed area', function () {
        expect(t.querySelectorAll('.ch-zoom-seeker').length).toEqual(1);
    });

    waitsFor(function() { return showed; }, 'content added to the DOM', 500);

    it('should have the zoomed image within the container', function () {
        expect(c.querySelector('img').getAttribute('src')).toEqual(t.getAttribute('href'));
    });

});