var form = $('#form-test').form(),
    readyEvent = jasmine.createSpy('readyEvent'),
    beforevalidateEvent = jasmine.createSpy('beforevalidateEvent'),
    successEvent = jasmine.createSpy('successEvent'),
    errorEvent = jasmine.createSpy('errorEvent'),
    clearEvent = jasmine.createSpy('clearEvent'),
    resetEvent = jasmine.createSpy('resetEvent'),
    validation = $('#input_user').required('This field is required.'),
    $input = $('#input_user');

describe('Form', function () {
    form
        .on('ready', function () { readyEvent(); })
        .on('success', function (e) { e.preventDefault(); });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Form')).toBeTruthy();
        expect(typeof ch.Form).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('form')).toBeTruthy();
        expect(typeof $.fn.form).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(form instanceof ch.Form).toBeTruthy();
    });

    it('should have the "ch-form" classname', function () {
        expect(form.$el.hasClass('ch-form')).toBeTruthy();
    });

    it('should disable HTML5 validations', function () {
        expect(form.$el.attr('novalidate')).toEqual('novalidate');
    });

    it('should emit the "ready" event when it\'s created', function () {
        waits(50);
        runs(function () {
            expect(readyEvent).toHaveBeenCalled();
        });
    });

    describe('should use the following abilities:', function () {
        it('EventEmitter', function () {
            expect(form.on).not.toEqual(undefined);
            expect(typeof form.on).toEqual('function');
        });
    });
});

describe('It should have the following public properties:', function () {

    it('.el', function () {
        expect(form.el).not.toEqual(undefined);
        expect(form.el.nodeType).toEqual(1);
    });

    it('.$el', function () {
        expect(form.$el).not.toEqual(undefined);
        expect(form.$el instanceof $).toBeTruthy();
    });

    it('.name', function () {
        expect(form.name).not.toEqual(undefined);
        expect(typeof form.name).toEqual('string');
        expect(form.name).toEqual('form');
    });

    it('.constructor', function () {
        expect(form.constructor).not.toEqual(undefined);
        expect(typeof form.constructor).toEqual('function');
    });

    it('.uid', function () {
        expect(form.uid).not.toEqual(undefined);
        expect(typeof form.uid).toEqual('number');
    });

    it('.errors', function () {
        expect(form.errors).not.toEqual(undefined);
        expect(ch.util.isArray(form.errors)).toBeTruthy();
    });

    it('.validations', function () {
        expect(form.validations).not.toEqual(undefined);
        expect(ch.util.isArray(form.validations)).toBeTruthy();
    });

});

describe('It should have the following public methods:', function () {
    var methods = ['init', 'destroy', 'clear', 'hasError', 'reset', 'validate', 'enable', 'disable'],
        i = 0,
        len = methods.length;

    for (i; i < len; i += 1) {
        (function (i){
            it('.' + methods[i] + '()', function () {
                expect(form[methods[i]]).not.toEqual(undefined);
                expect(typeof form[methods[i]]).toEqual('function');
            });
        }(i));
    }
});

describe('When the form is submited it', function () {
    it('should run "validate" method', function () {
        spyOn(form, 'validate').andCallThrough();
        form.$el.submit();
        expect(form.validate).toHaveBeenCalled();
    });
});

describe('Its validation() method', function () {
    form
        .once('beforevalidate', beforevalidateEvent)
        .once('success', successEvent)
        .once('error', errorEvent);

    form.validate();

    it('should emit "beforevalidate" event', function () {
        expect(beforevalidateEvent).toHaveBeenCalled();
    });

    it('should update errors collection', function () {
        expect(form.errors.length).not.toEqual(0);
    });

    it('should emit "error" event when it has got errors', function () {
        expect(errorEvent).toHaveBeenCalledWith(form.errors);
    });

    it('should set focus to the input that has got an error', function () {
        expect(document.activeElement).toEqual(form.errors[0].$el[0]);
    });

    it('should emit "success" event when it has not got errors', function () {
        $input.val('success');
        form.$el.submit();
        expect(successEvent).toHaveBeenCalled();
        form.reset();
    });
});

describe('Its hasError() method', function () {

    it('should return "false" when it doesn\'t have errors', function () {
        $input.val('test');
        expect(form.hasError()).toBeFalsy();

    });

    it('should return a boolean "true" when it has errors', function () {
        $input.val('');
        expect(form.hasError()).toBeTruthy();
    });
});

describe('Its clear() method', function () {
    form.once('clear', clearEvent);
    var instance = form.clear();

    it('should clear all validations', function () {
        expect(form.errors[0].isActive).toBeFalsy();
    });

    it('should emit "clear" event', function () {
        expect(clearEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized widget', function () {
        expect(instance).toEqual(form);
    });
});

describe('Its reset() method', function () {
    form.once('reset', resetEvent);
    var instance = form.reset();

    it('should emit "reset" event', function () {
        expect(resetEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized widget', function () {
        expect(instance).toEqual(form);
    });
});

describe('Its disable() method', function () {
    var instance;

    it('should disable all validations', function () {
        instance = form.disable();
        expect(form.hasError()).toBeFalsy();
    });

    it('should return the same instance than initialized widget', function () {
        expect(instance).toEqual(form);
    });
});

describe('Its enable() method', function () {
    var instance;

    it('should enable all validations', function () {
        instance = form.enable();
        expect(form.hasError()).toBeTruthy();
    });

    it('should return the same instance than initialized widget', function () {
        expect(instance).toEqual(form);
    });

    form.reset();

});

// describe('Form', function () {
//     describe('Public methods', function () {
//         it('.reset()', function () {
//             $input.val('reset');
//             expect($input.val()).toEqual('reset');
//             form.reset();
//             expect($input.val()).toEqual('');
//         });

//         it('.submit()', function () {
//             $input.val('submit');
//             form.submit();
//             expect(submitEvent).toHaveBeenCalled();
//         });

//         it('.validate()', function () {
//             form.reset();
//             form.validate();
//             expect(validateEvent).toHaveBeenCalled();
//             expect(validation.isActive()).toBeTruthy();
//         });

//         it('.clear()', function () {
//             $input.val('clear');
//             form.clear();
//             expect($input.val()).toEqual('clear');
//             expect(validation.isActive()).toBeFalsy();
//             form.reset();
//         });

//         it('.isValidated()', function () {
//             form.validate();
//             expect(form.isValidated()).toBeFalsy();
//             $input.val('Validated!');
//             form.validate();
//             expect(form.isValidated()).toBeTruthy();
//             form.clear();
//         });
//     });

//     describe('Should emit the following events:', function () {

//         it('ready', function () {
//             waits(50);
//             runs(function () {
//                 expect(readyEvent).toHaveBeenCalled();
//             });
//         });

//         it('beforeSubmit', function () {
//             form.submit();
//             expect(beforeSubmitEvent).toHaveBeenCalled();
//             form.clear();
//         });

//         it('submit', function () {
//             form.submit();
//             expect(submitEvent).toHaveBeenCalled();
//             form.clear();
//         });

//         it('afterSubmit', function () {
//             form.submit();
//             expect(afterSubmitEvent).toHaveBeenCalled();
//             form.clear();
//         });

//         it('beforeValidate', function () {
//             form.validate();
//             expect(beforeValidateEvent).toHaveBeenCalled();
//             form.clear();
//         });

//         it('validate', function () {
//             form.validate();
//             expect(validateEvent).toHaveBeenCalled();
//             form.clear();
//         });

//         it('afterValidate', function () {
//             form.validate();
//             expect(afterValidateEvent).toHaveBeenCalled();
//             form.clear();
//         });

//         it('error', function () {
//             form.validate();
//             expect(errorEvent).toHaveBeenCalled();
//             form.reset();
//         });

//         it('clear', function () {
//             form.clear();
//             expect(clearEvent).toHaveBeenCalled();
//         });

//         it('reset', function () {
//             form.reset();
//             expect(resetEvent).toHaveBeenCalled();
//         });

//     });

// });