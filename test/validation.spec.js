describe('Validation', function () {
    var container = document.createElement('div'),
        validationHtml = [
            '<form id="form-validations" action="/static/ajax.html" class="ch-form">',
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
        validation1,
        validation2,
        readyEvent,
        destroyEvent,
        successEvent,
        errorEvent,
        clearEvent;

    before(function () {
        container.innerHTML = validationHtml;
        document.body.appendChild(container);

        validation1 = new ch.Validation(document.getElementById('input_user'), {
            'conditions': [
                {
                    'name': 'required',
                    'message': 'This field is required.'
                },
                {
                    'name': 'mocha',
                    'fn': function (value) {
                        return value === 'Mocha';
                    },
                    'message': 'Mocha Test!'
                }
            ]
        });
        validation2 = new ch.Validation(document.getElementById('input_pass'), {
            'conditions': [
                {
                    'name': 'required',
                    'message': 'This field is required.'
                }
            ]
        });

        readyEvent = chai.spy();
        destroyEvent = chai.spy();
        successEvent = chai.spy();
        errorEvent = chai.spy();
        clearEvent = chai.spy();

        validation1.once('ready', readyEvent);
        validation2.once('destroy', destroyEvent);
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Validation).to.exist;
        expect(ch.Validation).to.be.a('function');
    });

    it('should be return a new instance', function () {
        expect(validation1).to.be.an.instanceof(ch.Validation);
    });

    it('should emit the "ready" event when it\'s created', function (done) {
        setTimeout(function(){
            expect(readyEvent).to.have.been.called();
            done();
        }, 50);
    });

    describe('It should have the following public properties:', function () {
        it('.trigger', function () {
            expect(validation1.trigger).to.exist;
            expect(validation1.trigger.nodeType).to.equal(1);
            expect(validation1.trigger).to.be.an.instanceof(HTMLElement);
        });

        it('.name', function () {
            expect(validation1.name).to.exist;
            expect(validation1.name).to.be.a('string');
            expect(validation1.name).to.equal('validation');
        });

        it('.constructor', function () {
            expect(validation1.constructor).to.exist;
            expect(validation1.constructor).to.be.a('function');
        });

        it('.uid', function () {
            expect(validation1.uid).to.exist;
            expect(validation1.uid).to.be.a('number');
        });

        it('.bubble', function () {
            expect(validation1.bubble).to.exist;
            expect(validation1.bubble).to.be.an.instanceof(ch.Bubble);
        });

        it('.conditions', function () {
            expect(validation1.conditions).to.exist;
            expect(validation1.conditions).to.be.an('object');
            expect(validation1.conditions['required']).to.be.an.instanceof(ch.Condition);
            expect(validation1.conditions['mocha']).to.be.an.instanceof(ch.Condition);
        });

        it('.error', function () {
            expect(validation1.error).to.not.be.undefined;
        });

        it('.form', function () {
            expect(validation1.form).to.exist;
            expect(validation1.form).to.be.an('object');
        });

    });

    describe('It should have the following public methods:', function () {
        var methods = ['destroy', 'clear', 'hasError', 'isShown', 'refreshPosition', 'validate', 'message', 'enable', 'disable'],
            i = 0,
            len = methods.length;

        for (i; i < len; i += 1) {
            (function (i){
                it('.' + methods[i] + '()', function () {
                    expect(validation1[methods[i]]).to.exist;
                    expect(validation1[methods[i]]).to.be.a('function');
                });
            }(i));
        }
    });

    describe('Its hasError() method', function () {
        it('should return "false" when it hasn\'t got error', function () {
            validation1.trigger.setAttribute('value', 'Mocha');
            expect(validation1.hasError()).to.be.false;
        });

        it('should return a boolean "true" when it has got error', function () {
            validation1.trigger.setAttribute('value', '');
            expect(validation1.hasError()).to.be.true;
        });
    });

    describe('Its validate() method', function () {
        before(function(){
            validation1
                .once('success', successEvent)
                .once('error', errorEvent);
        });

        describe('if it has got error', function () {
            before(function(){
                validation1.validate();
            });

            it('should update error object', function () {
                expect(validation1.error).to.exist;
            });

            it('should add "ch-validation-error" to the element', function () {
                expect(tiny.hasClass(validation1.trigger, 'ch-validation-error')).to.be.true;
            });

            it('should add the ARIA attribute "aria-label" to the element', function () {
                expect(validation1.trigger.getAttribute('aria-label')).to.equal('ch-bubble-' + validation1.bubble.uid);
            });

            it('should show a message', function () {
                expect(validation1.bubble.isShown()).to.be.true;
                expect(validation1.bubble.content()).to.equal('This field is required.');
            });

            it('should be active', function () {
                expect(validation1.isShown()).to.be.true;
            });

            it('should emit "error" event', function () {
                expect(errorEvent).to.have.been.called.with(validation1.error);
            });
        });

        describe('if it hasn\'t got error', function () {
            before(function () {
                validation1.trigger.setAttribute('value', 'Mocha');
                validation1.validate();
            });

            it('should update error object', function () {
                expect(validation1.error).to.be.null;
            });

            it('should remove "ch-validation-error" from the element', function () {
                expect(tiny.hasClass(validation1.trigger, 'ch-validation-error')).to.be.false;
            });

            it('should remove the ARIA attribute "aria-label" to the element', function () {
                expect(validation1.trigger.getAttribute('aria-label')).to.be.null;
            });

            it('should hide a message', function () {
                expect(validation1.bubble.isShown()).to.be.false;
            });

            it('should be inactive', function () {
                expect(validation1.isShown()).to.be.false;
            });

            it('should emit "success" event', function () {
                expect(successEvent).to.have.been.called();
                validation1.clear();
            });
        });
    });

    describe('Its clear() method', function () {
        var instance;

        it('should clear the error bubble', function () {
            validation1.once('clear', clearEvent);
            instance = validation1.clear();
            expect(validation1.isShown()).to.be.false;
        });

        it('should update error object', function () {
            expect(validation1.error).to.be.null;
        });

        it('should remove "ch-validation-error" from the element', function () {
            expect(tiny.hasClass(validation1.trigger, 'ch-validation-error')).to.be.false;
        });

        it('should remove the ARIA attribute "aria-label" to the element', function () {
            expect(validation1.trigger.getAttribute('aria-label')).to.be.null;
        });

        it('should hide a message', function () {
            expect(validation1.bubble.isShown()).to.be.false;
        });

        it('should emit "clear" event', function () {
            expect(clearEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(validation1);
        });
    });

    describe('Its isShown() method', function () {

        it('should return "false" when it hasn\'t got error', function () {
            validation1.trigger.setAttribute('value', 'Mocha');
            expect(validation1.hasError()).to.be.false;

        });

        it('should return a boolean "true" when it has got error', function () {
            validation1.trigger.setAttribute('value', '');
            expect(validation1.hasError()).to.be.true;
        });
    });

    describe('Its message() method', function () {
        var instance,
            msg;

        it('should set a new message to the given condition', function () {
            instance = validation1.message('required', 'New message!');
            validation1.validate();

            expect(validation1.bubble.content()).to.equal('New message!');
        });

        it('should get the message from the given condition', function () {
            msg = validation1.message('required');
            validation1.validate();

            expect(validation1.bubble.content()).to.equal(msg);
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(validation1);
        });
    });

    describe('Its disable() method', function () {
        var instance;

        it('should disable alidation', function () {
            instance = validation1.disable();
            expect(validation1.hasError()).to.be.false;
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(validation1);
        });
    });

    describe('Its enable() method', function () {
        var instance;

        it('should enable validation', function () {
            instance = validation1.enable();
            expect(validation1.hasError()).to.be.true;
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(validation1);
        });
    });

    describe('Its destroy() method', function () {
        it('should reset the $trigger', function () {
            validation2.destroy();
            expect(validation2.trigger.getAttribute('data-side')).to.be.null;
            expect(validation2.trigger.getAttribute('data-align')).to.be.null;
        });

        it('should remove the instance from the element', function () {
            expect(ch.instances[validation2.uid]).to.be.undefined;
        });

        it('should emit the "destroy" event', function () {
            expect(destroyEvent).to.have.been.called();
        });
    });

});
