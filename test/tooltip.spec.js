describe('Tooltip', function () {
    var container = document.createElement('div'),
        tooltipHtml = [
            '<button class="ch-btn" id="tooltip">Trigger</button>'
        ].join(''),
        tooltip,
        t,
        c;

    before(function () {
        container.innerHTML = tooltipHtml;
        document.body.appendChild(container);

        tooltip = new ch.Tooltip(document.getElementById('tooltip'), {
            'content': 'test',
            'fx': 'none'
        }).show();
        c = tooltip.container;
        t = tooltip.trigger;
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Tooltip).to.exist;
        expect(ch.Tooltip).to.be.a('function');
    });

    it('should return a new instance of Layer', function () {
        expect(tooltip).to.be.an.instanceof(ch.Layer);
    });

    describe('It should have a container with', function () {
        it('role tooltip', function () {
            expect(c.getAttribute('role')).to.equal('tooltip');
        });

        it('specific CSS class names', function () {
            expect(tiny.hasClass(c, 'ch-tooltip')).to.be.true;
            expect(tiny.hasClass(c, 'ch-cone')).to.be.true;
        });
    });

});
