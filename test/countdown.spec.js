describe('Countdown', function () {
    var container = document.createElement('div'),
        countdownHtml = [
            '<form id="form-countdown" action="/static/ajax.html" class="ch-form">',
                '<fieldset>',
                    '<div class="ch-form-row">',
                        '<label for="input_user">User:</label>',
                        '<input type="text" id="input_user" name="input_user" size="50">',
                    '</div>',
                    '<div class="ch-form-row">',
                        '<label for="input_location">Location:</label>',
                        '<input type="text" id="input_location" name="input_location" size="50">',
                    '</div>',
                '</fieldset>',
            '</form>'
        ].join(''),
        countdown,
        countdown2,
        readyEvent,
        exceedEvent,
        destroyEvent,
        layoutChangeEvent;

    before(function(){
        container.innerHTML = countdownHtml;
        document.body.appendChild(container);

        countdown = new ch.Countdown(document.getElementById('input_user'));
        countdown2 = new ch.Countdown(document.getElementById('input_location'), {'max': 10});
        readyEvent = chai.spy();
        exceedEvent = chai.spy();
        destroyEvent = chai.spy();
        layoutChangeEvent = chai.spy();

        countdown
            .once('ready', readyEvent);

        countdown2
            .on('exceed', exceedEvent)
            .on('destroy', destroyEvent);

        tiny.on(document, ch.onlayoutchange, layoutChangeEvent);
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Countdown).to.exist;
        expect(ch.Countdown).to.be.a('function');
    });

    it('should be return a new instance', function () {
        expect(countdown).to.be.an.instanceof(ch.Countdown);
    });

    it('should emit the "ready" event when it\'s created', function (done) {
        setTimeout(function(){
            expect(readyEvent).to.have.been.called();
            done();
        }, 50);
    });


    describe('It should have the following public properties:', function () {
        it('.trigger', function () {
            expect(countdown.trigger).to.exist;
            expect(countdown.trigger.nodeType).to.equal(1);
            expect(countdown.trigger).to.be.an.instanceof(HTMLElement);
        });

        it('.container', function () {
            expect(countdown.container).to.exist;
            expect(countdown.container.nodeType).to.equal(1);
            expect(countdown.container).to.be.an.instanceof(HTMLElement);
        });

        it('.name', function () {
            expect(countdown.name).to.exist;
            expect(countdown.name).to.be.a('string');
            expect(countdown.name).to.equal('countdown');
        });

        it('.constructor', function () {
            expect(countdown.constructor).to.exist;
            expect(countdown.constructor).to.be.a('function');
        });

        it('.uid', function () {
            expect(countdown.uid).to.exist;
            expect(countdown.uid).to.be.a('number');
        });
    });

    describe('It should have the following public methods:', function () {
        var methods = ['destroy', 'enable', 'disable'],
            i = 0,
            len = methods.length;

        for (i; i < len; i += 1) {
            (function (i){
                it('.' + methods[i] + '()', function () {
                    expect(countdown[methods[i]]).to.exist;
                    expect(countdown[methods[i]]).to.be.a('function');
                });
            }(i));
        }
    });

    describe('It should create a message container', function () {
        var container;

        before(function(){
            container = countdown.container;
        });

        it('should exists.', function () {
            expect(container).to.exist;
            expect(container.nodeType).to.equal(1);
        });

        it('should add "ch-form-hint" classname to the element', function () {
            expect(tiny.hasClass(container, 'ch-form-hint')).to.be.true;
        });

        it('should set this message by default: "500 characters left."', function () {
            expect(container.innerText).to.equal('500 characters left.');
        });
    });

    describe('It should update the number on the message', function () {
        var container;

        before(function(){
            container = countdown2.container;
        });

        it('if it exceeds the number should add errors classnames: "ch-countdown-exceeded" and "ch-validation-error"', function (done) {
            countdown2.trigger.setAttribute('value', '12345678901234567890');
            tiny.trigger(countdown2.trigger, 'keyup');

            setTimeout(function() {
                expect(container.innerText).to.equal('-10 characters left.');
                expect(tiny.hasClass(container, 'ch-countdown-exceeded')).to.be.true;
                expect(tiny.hasClass(countdown2.trigger, 'ch-validation-error')).to.be.true;
                done();
            }, 50);
        });

        it('and should emit the \'exceed\' event', function () {
            expect(exceedEvent).to.have.been.called();
        });

        it('if doesn\'t exceed the number should update the number to 0', function (done) {
            countdown2.trigger.setAttribute('value', '1234567890');
            tiny.trigger(countdown2.trigger, 'keyup');

            setTimeout(function(){
                expect(container.innerText).to.equal('0 characters left.');
                done();
            }, 50);
        });
    });

    describe('Its destroy() method', function () {
        it('should remove the container', function () {
            countdown2.destroy();
            expect(countdown2.container.parentNode).to.be.null;
        });

        it('should remove ".countdown" instance', function () {
            expect(ch.instances[countdown2.uid]).to.be.undefined;
        });

        it('should emit the "layoutchange" event', function () {
            expect(layoutChangeEvent).to.have.been.called();
        });

        it('should emit the "destroy" event', function () {
            expect(destroyEvent).to.have.been.called();
        });
    });

});
