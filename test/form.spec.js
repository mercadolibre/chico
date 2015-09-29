describe('Form', function () {
    var container = document.createElement('div'),
        formHtml = [
            '<form id="form-test" action="/static/ajax.html" class="ch-form">',
                '<fieldset>',
                    '<p class="ch-form-row">',
                        '<label for="input_user">User:</label>',
                        '<input type="text" id="input_user" name="input_user" size="50">',
                    '</p>',
                    '<p class="ch-form-row">',
                        '<label for="input_pass">Password:</label>',
                        '<input type="password" id="input_pass" name="input_pass" size="50">',
                    '</p>',
                    '<p class="ch-form-actions">',
                        '<input type="submit" name="confirmation" value="Login" class="ch-btn">',
                        '<a href="#">Cancel</a>',
                    '</p>',
                '</fieldset>',
            '</form>'
        ].join(''),
        form,
        readyEvent,
        beforevalidateEvent,
        successEvent,
        errorEvent,
        clearEvent,
        resetEvent,
        destroyEvent,
        input,
        validation;

    before(function(){
        container.innerHTML = formHtml;
        document.body.appendChild(container);

        form = new ch.Form(document.getElementById('form-test'));
        input = document.getElementById('input_user');
        validation = new ch.Validation(input, {
            'conditions': [{'name': 'required', 'message': 'This field is required.'}]
        });

        readyEvent = chai.spy();
        beforevalidateEvent = chai.spy();
        successEvent = chai.spy();
        errorEvent = chai.spy();
        clearEvent = chai.spy();
        resetEvent = chai.spy();
        destroyEvent = chai.spy();

        form
            .on('ready', readyEvent)
            .on('destroy', destroyEvent)
            .on('success', function (e) { e.preventDefault(); });

        tiny.on(document.getElementById('form-test'), 'submit', function (event) {
            event.preventDefault();
        });
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Form).to.exist;
        expect(ch.Form).to.be.a('function');
    });

    it('should be return a new instance', function () {
        expect(form).to.be.an.instanceof(ch.Form);
    });

    it('should have the "ch-form" classname', function () {
        expect(tiny.hasClass(form.container, 'ch-form')).to.be.true;
    });

    it('should disable HTML5 validations', function () {
        expect(form.container.getAttribute('novalidate')).to.equal('novalidate');
    });

    it('should emit the "ready" event when it\'s created', function (done) {
        setTimeout(function(){
            expect(readyEvent).to.have.been.called();
            done();
        },50);
    });

    describe('should use the following abilities:', function () {
        it('EventEmitter', function () {
            expect(form.on).to.exist;
            expect(form.on).to.be.a('function');
        });
    });

    describe('It should have the following public properties:', function () {
        it('.container', function () {
            expect(form.container).to.exist;
            expect(form.container.nodeType).to.equal(1);
            expect(form.container).to.be.an.instanceof(HTMLFormElement);
        });

        it('.name', function () {
            expect(form.name).to.exist;
            expect(form.name).to.be.a('string');
            expect(form.name).to.equal('form');
        });

        it('.constructor', function () {
            expect(form.constructor).to.exist;
            expect(form.constructor).to.be.a('function');
        });

        it('.uid', function () {
            expect(form.uid).to.exist;
            expect(form.uid).to.be.a('number');
        });

        it('.errors', function () {
            expect(form.errors).to.exist;
            expect(Array.isArray(form.errors)).to.be.true;
        });

        it('.validations', function () {
            expect(form.validations).to.exist;
            expect(Array.isArray(form.validations)).to.be.true;
        });

    });

    describe('It should have the following public methods:', function () {
        var methods = ['destroy', 'clear', 'hasError', 'reset', 'validate', 'enable', 'disable'],
            i = 0,
            len = methods.length;

        for (i; i < len; i += 1) {
            (function (i){
                it('.' + methods[i] + '()', function () {
                    expect(form[methods[i]]).to.exist;
                    expect(form[methods[i]]).to.be.a('function');
                });
            }(i));
        }
    });

    describe('When the form is submitted it', function () {
        before(function() {
            chai.spy.on(form, 'validate');
            tiny.trigger(form.container, 'submit');
        });

        it('should run "validate" method', function () {
            expect(form.validate).to.have.been.called();
        });
    });

    describe('Its validate() method', function () {
        before(function() {
            form
                .once('beforevalidate', beforevalidateEvent)
                .once('success', successEvent)
                .once('error', errorEvent);

            form.validate();
        });

        it('should emit "beforevalidate" event', function () {
            expect(beforevalidateEvent).to.have.been.called();
        });

        it('should update errors collection', function () {
            expect(form.errors.length).to.not.equal(0);
        });

        it('should emit "error" event when it has got errors', function () {
            expect(errorEvent).to.have.been.called.with(form.errors);
        });

        it('should set focus to the input that has got an error', function () {
            expect(document.activeElement).to.equal(form.errors[0].trigger);
        });

        it('should emit "success" event when it has not got errors', function () {
            input.setAttribute('value', 'success');

            tiny.trigger(form.container, 'submit');

            expect(successEvent).to.have.been.called();
            form.reset();
        });
    });

    describe('Its hasError() method', function () {

        it('should return "false" when it hasn\'t got', function () {
            input.setAttribute('value', 'test');
            expect(form.hasError()).to.be.false;

        });

        it('should return a boolean "true" when it has got errors', function () {
            input.setAttribute('value', '');
            expect(form.hasError()).to.be.true;
        });
    });

    describe('Its clear() method', function () {
        var instance;

        before(function() {
            form.once('clear', clearEvent);
            instance = form.clear();
        });

        it('should clear all validations', function () {
            expect(form.errors[0].isShown()).to.be.false;
        });

        it('should emit "clear" event', function () {
            expect(clearEvent).to.have.been.called();
        });

        it('should return the same instance as the initialized component', function () {
            expect(instance).to.eql(form);
        });
    });

    describe('Its reset() method', function () {
        var instance;

        before(function() {
            form.once('reset', resetEvent);
            instance = form.reset();
        });

        it('should emit "reset" event', function () {
            expect(resetEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(form);
        });
    });

    describe('Its disable() method', function () {
        var instance;

        it('should disable all validations', function () {
            instance = form.disable();
            expect(form.hasError()).to.be.false;
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.equal(form);
        });
    });

    describe('Its enable() method', function () {
        var instance;

        before(function(){
            instance = form.enable();
        });

        after(function(){
            form.reset();
        });

        it('should enable all validations', function () {
            expect(form.hasError()).to.be.true;
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(form);
        });

    });

    describe('Its destroy() method', function () {
        before(function(){
            form.destroy();
        });

        it('should reset the $container', function () {
            expect(form.container.getAttribute('novalidate')).to.be.null;
        });

        it('should destroy its validations', function () {
            expect(form.validations[0]._enabled).to.be.false;
        });

        it('should remove the instance from the element', function () {
            expect(ch.instances[form.uid]).to.be.undefined;
        });

        it('should emit the "destroy" event', function () {
            expect(destroyEvent).to.have.been.called();
        });
    });

});
