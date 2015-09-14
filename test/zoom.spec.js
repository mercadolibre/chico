describe('Zoom', function () {
    var container = document.createElement('div'),
        zoomHtml = [
            '<a id="zoom" href="/mock/HTML5_Logo_512.png" target="_blank">',
                '<img src="/mock/HTML5_Logo_128.png" alt="HTML5"/>',
            '</a>'
        ].join(''),
        zoom,
        t,
        c;

    before(function () {
        container.innerHTML = zoomHtml;
        document.body.appendChild(container);

        zoom = new ch.Zoom(document.getElementById('zoom'));
        t = zoom.trigger;
        c = zoom.container;
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Zoom).to.exist;
        expect(ch.Zoom).to.be.a('function');
    });

    it('should return a new instance of Zoom', function () {
        expect(zoom).to.be.an.instanceof(ch.Zoom);
    });


    describe('It should have a container with', function () {
        it('role tooltip', function () {
            expect(c.getAttribute('role')).to.equal('tooltip');
        });

        it('specific CSS class names', function () {
            expect(tiny.hasClass(c, 'ch-zoom')).to.be.true;
        });

        it('specific size', function () {
            expect(c.style.width).to.equal('300px');
            expect(c.style.height).to.equal('300px');
        });
    });

    describe('On show', function () {
        it('should have a visual feedback of zoomed area', function () {
            expect(t.querySelectorAll('.ch-zoom-seeker').length).to.equal(1);
        });

        it('should have the zoomed image within the container', function (done) {
            zoom.on('show', function() {
                expect(c.querySelector('img').getAttribute('src')).to.match(new RegExp(t.getAttribute('href')+'$'));
                done();
            });
            zoom.show();
        });
    });
});
