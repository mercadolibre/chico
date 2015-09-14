describe('Transition', function () {
    var container = document.createElement('div'),
        transitionHtml = [
            '<button class="ch-btn" id="transition">Trigger</button>'
        ].join(''),
        transition,
        t,
        c;

    before(function () {
        container.innerHTML = transitionHtml;
        document.body.appendChild(container);

        transition = new ch.Transition(document.getElementById('transition'), {
            'fx': 'none'
        }).show();
        c = transition.container;
        t = transition.trigger;
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Transition).to.exist;
        expect(ch.Transition).to.be.a('function');
    });

    it('should return a new instance of Modal', function () {
        expect(transition).to.be.an.instanceof(ch.Modal);
    });

    describe('It should have a container with', function () {
        after(function () {
            transition.hide();
        });

        it('role alert', function () {
            expect(c.getAttribute('role')).to.equal('alert');
        });

        it('specific CSS class names', function () {
            expect(tiny.hasClass(c, 'ch-transition')).to.be.true;
            expect(tiny.hasClass(c, 'ch-box-lite')).to.be.true;
        });
    });

});
