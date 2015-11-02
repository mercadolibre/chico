describe('Layer', function () {
    var container = document.createElement('div'),
        layerHtml = [
            '<button class="ch-btn" id="layer1">Trigger 1</button>',
            '<button class="ch-btn" id="layer2">Trigger 2</button>'
        ].join(''),
        layer1,
        t,
        c,
        layer2;

    before(function () {
        container.innerHTML = layerHtml;
        document.body.appendChild(container);

        layer1 = new ch.Layer(document.getElementById('layer1'), {
            'content': 'test',
            'fx': 'none'
        }).show();

        t = layer1.trigger;
        c = layer1.container;
        layer2 = new ch.Layer(document.getElementById('layer2'), {
            'content': 'test',
            'fx': 'none'
        });
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Layer).to.exist;
        expect(ch.Layer).to.be.a('function');
    });

    it('should return a new instance of Layer', function () {
        expect(layer1).to.be.an.instanceof(ch.Layer);
    });

    describe('It should have a container with', function () {
        it('role tooltip', function () {
            expect(c.getAttribute('role')).to.equal('tooltip');
        });

        it('specific CSS class names', function () {
            expect(tiny.hasClass(c, 'ch-layer')).to.be.true;
            expect(tiny.hasClass(c, 'ch-box-lite')).to.be.true;
            expect(tiny.hasClass(c, 'ch-cone')).to.be.true;
        });

        it('alignment', function () {
            expect(c.getAttribute('data-side')).to.equal('bottom');
            expect(c.getAttribute('data-align')).to.equal('left');
        });
    });

    describe('It should close', function () {

        it('when another Layer opens', function () {
            expect(layer1.isShown()).to.be.true;
            expect(layer2.isShown()).to.be.false;

            layer2.show();

            expect(layer1.isShown()).to.be.false;
            expect(layer2.isShown()).to.be.true;

            layer2.hide();

            expect(layer1.isShown()).to.false;
            expect(layer2.isShown()).to.be.false;
        });
    });

});
