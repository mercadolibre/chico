describe('Form', function () {
	var form = $('#form-1').form({
					'messages': {
						'required': 'Form: this field is required.'
					}
				})
				.on('submit', function () {
					listener();
				})
				.on('afterValidate', function () {
					listener();
				}),
		validation = $('#input_user').required('This field is required.'),
		listener = jasmine.createSpy('listener'),
		input = $('#input_user');


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
		});

		it('.isValidated()', function () {
			expect(ch.util.hasOwn(form, 'isValidated')).toBeTruthy();
		});

		it('.off()', function () {
			expect(ch.util.hasOwn(form, 'off')).toBeTruthy();
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(form, 'on')).toBeTruthy();
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(form, 'once')).toBeTruthy();
		});

		it('.reset()', function () {
			expect(ch.util.hasOwn(form, 'reset')).toBeTruthy();
		});

		it('.submit()', function () {
			expect(ch.util.hasOwn(form, 'submit')).toBeTruthy();
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(form, 'trigger')).toBeTruthy();
		});

		it('.validate()', function () {
			expect(ch.util.hasOwn(form, 'validate')).toBeTruthy();
		});
	});

	describe('Public methods', function () {
		it('.reset()', function () {
			input.val('reset');
			expect(input.val()).toEqual('reset');
			form.reset();
			expect(input.val()).toEqual('');
		});

		it('.submit()', function () {
			form.submit();

			expect(listener).toHaveBeenCalled();
		});

		it('.validate()', function () {
			form.validate();

			expect(listener).toHaveBeenCalled();
			expect(validation.isActive()).toBeTruthy();
		});

		it('.clear()', function () {
			input.val('clear');
			form.clear();
			expect(input.val()).toEqual('clear');
			expect(validation.isActive()).toBeFalsy();
			form.reset();
		});

		it('.isValidated()', function () {
			form.validate();
			expect(form.isValidated()).toBeFalsy();
			input.val('Validated!');
			form.validate();
			expect(form.isValidated()).toBeTruthy();
		});
	});
});