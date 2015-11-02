describe('ch.Bubble', function () {
    var container = document.createElement('div'),
        bubble,
        c;

    before(function () {
        container.innerHTML = '<span id="bubble">Bubble &raquo;</span>';
        document.body.appendChild(container);

        bubble = new ch.Bubble(document.querySelector('#bubble')).show();
        c = bubble.container;
    });

    after(function () {
        document.body.removeChild(container);
    });


    describe('Bubble', function () {

        it('should be defined on ch object', function () {
            expect(ch.Bubble).to.exist;
            expect(ch.Bubble).to.be.a('function');
        });

        it('should return a new instance of Bubble', function () {
            expect(bubble).to.be.an.instanceof(ch.Bubble);
        });
    });

    describe('It should have a container with', function () {

        it('role alert', function () {
            expect(c.getAttribute('role')).to.equal('alert');
        });

        it('specific CSS class names', function () {
            expect(tiny.hasClass(bubble.container, 'ch-bubble')).to.be.true;
            expect(tiny.hasClass(bubble.container, 'ch-box-error')).to.be.true;
            expect(tiny.hasClass(bubble.container, 'ch-cone')).to.be.true;
        });

        it('alignment', function () {
            expect(c.getAttribute('data-side')).to.equal('right');
            expect(c.getAttribute('data-align')).to.equal('center');
        });
    });

    describe('Its destroy() method', function () {
        before(function () {
            bubble.hide();
            bubble.destroy();
        });

        it('should remove the WAI-ARIA attributes from the element', function () {
            expect(bubble.trigger.getAttribute('aria-haspopup')).to.be.null;
        });

        it('should remove the instance', function () {
            expect(ch.instances[bubble.uid]).to.be.undefined;
        });
    });

});
