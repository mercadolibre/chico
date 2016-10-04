describe('Modal', function () {
    var container = document.createElement('div'),
        modalHtml = [
            '<button class="ch-btn" id="modal">Trigger</button>'
        ].join(''),
        modal,
        t,
        c,
        showEvent,
        hideEvent;

    before(function() {
        container.innerHTML = modalHtml;
        document.body.appendChild(container);

        readyEvent = chai.spy();
        showEvent = chai.spy();
        hideEvent = chai.spy();

        modal = new ch.Modal(document.getElementById('modal'), {
            'content': 'test',
            'fx': 'none'
        })
            .on('ready', readyEvent)
            .on('show', showEvent)
            .on('hide', hideEvent);

        t = modal.trigger;
        c = modal.container;
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Modal).to.exist;
        expect(ch.Modal).to.be.a('function');
    });

    it('should return a new instance of Modal', function () {
        expect(modal).to.be.an.instanceof(ch.Modal);
    });

    describe('It should emit', function() {
        it('the "ready" event', function (done) {
            setTimeout(function() {
                expect(readyEvent).to.have.been.called.once;
                done();
            }, 50);
        });

        it('the "show" event', function () {
            modal.show();

            expect(showEvent).to.have.been.called.once;
        });

        it('the "hide" event', function () {
            modal.hide();

            expect(hideEvent).to.have.been.called.once;
        });
    });

    describe('It should have a container with', function () {
        it('role dialog', function () {
            expect(c.getAttribute('role')).to.equal('dialog');
        });

        it('specific CSS class names', function () {
            expect(tiny.hasClass(c, 'ch-modal')).to.be.true;
            expect(tiny.hasClass(c, 'ch-box-lite')).to.be.true;
        });

        it('specific width', function () {
            expect(c.style.width).to.equal('50%');
        });

        it('alignment', function () {
            expect(c.getAttribute('data-side')).to.equal('center');
            expect(c.getAttribute('data-align')).to.equal('center');
        });
    });

    describe('It should have an underlay', function () {
        it('that exists', function () {
            modal.show();
            expect(document.querySelectorAll('.ch-underlay').length).to.equal(1);
        });

        it('with tabindex -1', function () {
            expect(document.querySelector('.ch-underlay').getAttribute('tabindex')).to.equal('-1');
        });

        it('that disappears when Modal closes', function () {
            modal.hide();
            expect(document.querySelectorAll('.ch-underlay').length).to.equal(0);
        });
    });
});
