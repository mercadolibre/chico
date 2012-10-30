describe('Form', function () {
	var beforeSubmitCallback = jasmine.createSpy('beforeSubmitCallback'),
		submitCallback = jasmine.createSpy('submitCallback'),
		afterSubmitCallback = jasmine.createSpy('afterSubmitCallback'),

		beforeValidateCallback = jasmine.createSpy('beforeValidateCallback'),
		validateCallback = jasmine.createSpy('validateCallback'),
		afterValidateCallback = jasmine.createSpy('afterValidateCallback'),

		clearCallback = jasmine.createSpy('clearCallback'),
		resetCallback = jasmine.createSpy('resetCallback'),
		errorCallback = jasmine.createSpy('errorCallback'),

		readyEvent = jasmine.createSpy('readyEvent'),

		beforeSubmitEvent = jasmine.createSpy('beforeSubmitEvent'),
		submitEvent = jasmine.createSpy('submitEvent'),
		afterSubmitEvent = jasmine.createSpy('afterSubmitEvent'),

		beforeValidateEvent = jasmine.createSpy('beforeValidateEvent'),
		validateEvent = jasmine.createSpy('validateCallback'),
		afterValidateEvent = jasmine.createSpy('afterValidateEvent'),

		clearEvent = jasmine.createSpy('clearEvent'),
		resetEvent = jasmine.createSpy('resetEvent'),
		errorEvent = jasmine.createSpy('errorEvent'),

		form = $('#form-1').form({
			'messages': {
				'required': 'Form: this field is required.'
			},

			'beforeSubmit': function () { beforeSubmitCallback() },
			'onSubmit': function () { submitCallback() },
			'afterSubmit': function () { afterSubmitCallback() },

			'beforeValidate': function () { beforeValidateCallback() },
			'onValidate': function () { validateCallback() },
			'afterValidate': function () { afterValidateCallback() },

			'onClear': function () { clearCallback() },
			'onReset': function () { resetCallback() },
			'onError': function () { errorCallback() }
		}),
		validation = $('#input_user').required('This field is required.'),
		$input = $('#input_user');


	form
		.on('ready', function () {
			readyEvent();
		})
		.on('beforeSubmit', function () {
			beforeSubmitEvent();
		})
		.on('submit', function () {
			submitEvent();
		})
		.on('afterSubmit', function () {
			afterSubmitEvent();
		})
		.on('beforeValidate', function () {
			beforeValidateEvent();
		})
		.on('validate', function () {
			validateEvent();
		})
		.on('afterValidate', function () {
			afterValidateEvent();
		})
		.on('clear', function () {
			clearEvent();
		})
		.on('reset', function () {
			resetEvent();
		})
		.on('error', function () {
			errorEvent();
		});


	it('Should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Form')).toBeTruthy();
		expect(typeof ch.Form).toEqual('function');
	});

	describe('Shold have the following public properties:', function () {

		it('.children', function () {
			expect(ch.util.hasOwn(form, 'children')).toBeTruthy();
			expect(ch.util.isArray(form.children)).toBeTruthy();
		});

		it('.element', function () {
			expect(ch.util.hasOwn(form, 'element')).toBeTruthy();
			expect(form.element.nodeType).toEqual(1);
		});

		it('.messages', function () {
			expect(ch.util.hasOwn(form, 'messages')).toBeTruthy();
			expect(typeof form.messages).toBe('object');
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(form, 'type')).toBeTruthy();
			expect(typeof form.type).toEqual('string');
			expect(form.type).toEqual('form');
		});

		it('.constructor', function () {
			expect(ch.util.hasOwn(form, 'constructor')).toBeTruthy();
			expect(typeof form.constructor).toEqual('function');
		});

		it('.uid', function () {
			expect(typeof form.uid).toEqual('number');
		});

	});

	describe('Shold have the following public methods:', function () {

		it('.clear()', function () {
			expect(ch.util.hasOwn(form, 'clear')).toBeTruthy();
			expect(typeof form.clear).toEqual('function');
		});

		it('.isValidated()', function () {
			expect(ch.util.hasOwn(form, 'isValidated')).toBeTruthy();
			expect(typeof form.isValidated).toEqual('function');
		});

		it('.off()', function () {
			expect(ch.util.hasOwn(form, 'off')).toBeTruthy();
			expect(typeof form.off).toEqual('function');
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(form, 'on')).toBeTruthy();
			expect(typeof form.on).toEqual('function');
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(form, 'once')).toBeTruthy();
			expect(typeof form.once).toEqual('function');
		});

		it('.reset()', function () {
			expect(ch.util.hasOwn(form, 'reset')).toBeTruthy();
			expect(typeof form.reset).toEqual('function');
		});

		it('.submit()', function () {
			expect(ch.util.hasOwn(form, 'submit')).toBeTruthy();
			expect(typeof form.submit).toEqual('function');
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(form, 'trigger')).toBeTruthy();
			expect(typeof form.trigger).toEqual('function');
		});

		it('.validate()', function () {
			expect(ch.util.hasOwn(form, 'validate')).toBeTruthy();
			expect(typeof form.validate).toEqual('function');
		});
	});

	describe('Public methods', function () {
		it('.reset()', function () {
			$input.val('reset');
			expect($input.val()).toEqual('reset');
			form.reset();
			expect($input.val()).toEqual('');
		});

		it('.submit()', function () {
			$input.val('submit');
			form.submit();
			expect(submitEvent).toHaveBeenCalled();
		});

		it('.validate()', function () {
			form.reset();
			form.validate();
			expect(validateEvent).toHaveBeenCalled();
			expect(validation.isActive()).toBeTruthy();
		});

		it('.clear()', function () {
			$input.val('clear');
			form.clear();
			expect($input.val()).toEqual('clear');
			expect(validation.isActive()).toBeFalsy();
			form.reset();
		});

		it('.isValidated()', function () {
			form.validate();
			expect(form.isValidated()).toBeFalsy();
			$input.val('Validated!');
			form.validate();
			expect(form.isValidated()).toBeTruthy();
			form.clear();
		});
	});


	describe('Should execute the following callbacks:', function () {

		it('beforeSubmit', function () {
			form.submit();
			expect(beforeSubmitCallback).toHaveBeenCalled();
			form.clear();
		});

		it('submit', function () {
			$input.val('Submit!');
			form.submit();
			expect(submitCallback).toHaveBeenCalled();
			form.clear();
		});

		it('afterSubmit', function () {
			form.submit();
			expect(afterSubmitCallback).toHaveBeenCalled();
		});

		it('beforeValidate', function () {
			form.validate();
			expect(beforeValidateCallback).toHaveBeenCalled();
		});

		it('validate', function () {
			form.validate();
			expect(validateCallback).toHaveBeenCalled();
		});

		it('afterValidate', function () {
			form.validate();
			expect(afterValidateCallback).toHaveBeenCalled();
			form.reset();
		});

		it('error', function () {
			form.validate();
			expect(errorCallback).toHaveBeenCalled();
			form.clear();
		});

		it('clear', function () {
			form.clear();
			expect(clearCallback).toHaveBeenCalled();
		});

		it('reset', function () {
			form.reset();
			expect(resetCallback).toHaveBeenCalled();
		});

	});

	describe('Should emit the following events:', function () {

		it('ready', function () {
			waits(50);
			runs(function () {
				expect(readyEvent).toHaveBeenCalled();
			});
		});

		it('beforeSubmit', function () {
			form.submit();
			expect(beforeSubmitEvent).toHaveBeenCalled();
			form.clear();
		});

		it('submit', function () {
			form.submit();
			expect(submitEvent).toHaveBeenCalled();
			form.clear();
		});

		it('afterSubmit', function () {
			form.submit();
			expect(afterSubmitEvent).toHaveBeenCalled();
			form.clear();
		});

		it('beforeValidate', function () {
			form.validate();
			expect(beforeValidateEvent).toHaveBeenCalled();
			form.clear();
		});

		it('validate', function () {
			form.validate();
			expect(validateEvent).toHaveBeenCalled();
			form.clear();
		});

		it('afterValidate', function () {
			form.validate();
			expect(afterValidateEvent).toHaveBeenCalled();
			form.clear();
		});

		it('error', function () {
			form.validate();
			expect(errorEvent).toHaveBeenCalled();
			form.reset();
		});

		it('clear', function () {
			form.clear();
			expect(clearEvent).toHaveBeenCalled();
		});

		it('reset', function () {
			form.reset();
			expect(resetEvent).toHaveBeenCalled();
		});

	});

});