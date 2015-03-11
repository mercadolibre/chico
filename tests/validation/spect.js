var validation1 = $('#input_user').validation({
        'conditions': [
              {
                  'name': 'required',
                  'message': 'This field is required.'
              },
              {
                  'name': 'jasmine',
                  'fn': function (value) { return value === 'Jasmine'; },
                  'message': 'Jasmine Test!'
              }
          ]
    }),
    validation2 = $('#input_pass').validation({
        'conditions': [
              {
                  'name': 'required',
                  'message': 'This field is required.'
              }
          ]
    }),
    readyEvent = jasmine.createSpy('readyEvent'),
    destroyEvent = jasmine.createSpy('destroyEvent'),
    successEvent = jasmine.createSpy('successEvent'),
    errorEvent = jasmine.createSpy('errorEvent'),
    clearEvent = jasmine.createSpy('clearEvent');

describe('Validation', function () {
    validation1.once('ready', readyEvent);
    validation2.once('destroy', destroyEvent);

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Validation')).toBeTruthy();
        expect(typeof ch.Validation).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('validation')).toBeTruthy();
        expect(typeof $.fn.validation).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(validation1 instanceof ch.Validation).toBeTruthy();
    });

    it('should emit the "ready" event when it\'s created', function () {
        waits(50);
        runs(function () {
            expect(readyEvent).toHaveBeenCalled();
        });
    });
});

describe('It should have the following public properties:', function () {

    it('.$trigger', function () {
        expect(validation1.$trigger).not.toEqual(undefined);
        expect(validation1.$trigger[0].nodeType).toEqual(1);
        expect(validation1.$trigger instanceof $).toBeTruthy();
    });

    it('.name', function () {
        expect(validation1.name).not.toEqual(undefined);
        expect(typeof validation1.name).toEqual('string');
        expect(validation1.name).toEqual('validation');
    });

    it('.constructor', function () {
        expect(validation1.constructor).not.toEqual(undefined);
        expect(typeof validation1.constructor).toEqual('function');
    });

    it('.uid', function () {
        expect(validation1.uid).not.toEqual(undefined);
        expect(typeof validation1.uid).toEqual('number');
    });

    it('.bubble', function () {
        console.log(validation1.bubble);
        expect(validation1.bubble).not.toEqual(undefined);
        expect(validation1.bubble instanceof ch.Bubble).toBeTruthy();
    });

    it('.conditions', function () {
        expect(validation1.conditions).not.toEqual(undefined);
        expect(typeof validation1.conditions).toEqual('object');
        expect(validation1.conditions['required'] instanceof ch.Condition).toBeTruthy();
        expect(validation1.conditions['jasmine'] instanceof ch.Condition).toBeTruthy();
    });

    it('.error', function () {
        expect(validation1.error).not.toEqual(undefined);
    });

    it('.form', function () {
        expect(validation1.form).not.toEqual(undefined);
        expect(typeof validation1.form).toEqual('object');
    });

});

describe('It should have the following public methods:', function () {
    var methods = ['destroy', 'and', 'clear', 'hasError', 'isShown', 'refreshPosition', 'validate', 'message', 'enable', 'disable'],
        i = 0,
        len = methods.length;

    for (i; i < len; i += 1) {
        (function (i){
            it('.' + methods[i] + '()', function () {
                expect(validation1[methods[i]]).not.toEqual(undefined);
                expect(typeof validation1[methods[i]]).toEqual('function');
            });
        }(i));
    }
});

describe('Its and() method', function () {
    it('shoud return the input element', function () {
        expect(validation1.and()).toEqual(validation1.$trigger);
    });
});

describe('Its hasError() method', function () {

    it('should return "false" when it hasn\'t got error', function () {
        validation1.$trigger.val('Jasmine');
        expect(validation1.hasError()).toBeFalsy();

    });

    it('should return a boolean "true" when it has got error', function () {
        validation1.$trigger.val('');
        expect(validation1.hasError()).toBeTruthy();
    });
});

describe('Its validate() method', function () {
    validation1
        .once('success', successEvent)
        .once('error', errorEvent);

    describe('if it has got error', function () {
        validation1.validate();

        it('should update error object', function () {
            expect(validation1.error).not.toEqual(undefined);
        });

        it('should add "ch-validation-error" to the element', function () {
            expect(validation1.$trigger.hasClass('ch-validation-error')).toBeTruthy();
        });

        it('should add the ARIA attribute "aria-label" to the element', function () {
            expect(validation1.$trigger.attr('aria-label')).toEqual('ch-bubble-' + validation1.bubble.uid);
        });

        it('should show a message', function () {
            expect(validation1.bubble.isShown()).toBeTruthy();
            expect(validation1.bubble.content()).toEqual('This field is required.');
        });

        it('should be active', function () {
            expect(validation1.isShown()).toBeTruthy();
        });

        it('should emit "error" event', function () {
            expect(errorEvent).toHaveBeenCalledWith(validation1.error);
        });
    });

    describe('if it hasn\'t got error', function () {
        beforeEach(function () {
            validation1.$trigger.val('Jasmine');
            validation1.validate();
        });

        it('should update error object', function () {
            expect(validation1.error).toEqual(null);
        });

        it('should remove "ch-validation-error" from the element', function () {
            expect(validation1.$trigger.hasClass('ch-validation-error')).toBeFalsy();
        });

        it('should remove the ARIA attribute "aria-label" to the element', function () {
            expect(validation1.$trigger.attr('aria-label')).toEqual(undefined);
        });

        it('should hide a message', function () {
            expect(validation1.bubble.isShown()).toBeFalsy();
        });

        it('should be inactive', function () {
            expect(validation1.isShown()).toBeFalsy();
        });

        it('should emit "success" event', function () {
            expect(successEvent).toHaveBeenCalled();
            validation1.clear();
        });
    });
});

describe('Its clear() method', function () {
    var instance;

    it('should clear the error bubble', function () {
        validation1.once('clear', clearEvent);
        instance = validation1.clear();
        expect(validation1.isShown()).toBeFalsy();
    });

    it('should update error object', function () {
        expect(validation1.error).toEqual(null);
    });

    it('should remove "ch-validation-error" from the element', function () {
        expect(validation1.$trigger.hasClass('ch-validation-error')).toBeFalsy();
    });

    it('should remove the ARIA attribute "aria-label" to the element', function () {
        expect(validation1.$trigger.attr('aria-label')).toEqual(undefined);
    });

    it('should hide a message', function () {
        expect(validation1.bubble.isShown()).toBeFalsy();
    });

    it('should emit "clear" event', function () {
        expect(clearEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(validation1);
    });
});

describe('Its isShown() method', function () {

    it('should return "false" when it hasn\'t got error', function () {
        validation1.$trigger.val('Jasmine');
        expect(validation1.hasError()).toBeFalsy();

    });

    it('should return a boolean "true" when it has got error', function () {
        validation1.$trigger.val('');
        expect(validation1.hasError()).toBeTruthy();
    });
});

describe('Its message() method', function () {
    var instance,
        msg;

    it('should set a new message to the given condition', function () {
        instance = validation1.message('required', 'New message!');
        validation1.validate();

        expect(validation1.bubble.content()).toEqual('New message!');
    });

    it('should get the message from the given condition', function () {
        msg = validation1.message('required');
        validation1.validate();

        expect(validation1.bubble.content()).toEqual(msg);
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(validation1);
    });
});

describe('Its disable() method', function () {
    var instance;

    it('should disable alidation', function () {
        instance = validation1.disable();
        expect(validation1.hasError()).toBeFalsy();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(validation1);
    });
});

describe('Its enable() method', function () {
    var instance;

    it('should enable validation', function () {
        instance = validation1.enable();
        expect(validation1.hasError()).toBeTruthy();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(validation1);
    });

});

describe('Its destroy() method', function () {

    it('should reset the $trigger', function () {
        validation2.destroy();
        expect($._data(validation2.$trigger[0], 'events')).toBeUndefined();
        expect(validation2.$trigger.attr('data-side')).toBeUndefined();
        expect(validation2.$trigger.attr('data-align')).toBeUndefined();
    });

    it('should remove ".validation" events', function () {
        expect($._data(validation2.$trigger[0], 'events')).toBeUndefined();
    });

    it('should remove the instance from the element', function () {
        expect(validation2._$el.data('validation')).toBeUndefined();
    });

    it('should emit the "destroy" event', function () {
        expect(destroyEvent).toHaveBeenCalled();
    });
});