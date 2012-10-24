describe('ch.Validation', function () {
	var Validation = ch.Validation,
		form = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="validation{ID}" type="text"><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
		idGenerator = (function(){
			var count = 0;

			return function(){
				return count++;
			}
		}()),
		email = {
			// hacer array con la condition
			condition: {
				name: "email",
				message: 'Message'
			}
		},
		string = {
			condition: {
				name: "string",
				message: 'Message'
			}
		},
		required = {
			condition: {
				name: "required",
				message: 'Message'
			}
		};

	describe('ch.Validation global initialization and returned object.', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = new Validation(input, email);
		$('body').prepend(f);

		it('ch.Validation should be a function.', function () {
			expect(typeof Validation).toEqual('function');
		});

		it('ch.Validation should return an object.', function () {
			expect(typeof validation).toEqual('object');
		});

		it('Returned object has an "and" method and it should be a function and return an object.', function () {
			expect(validation.and).toBeDefined();
			expect(typeof validation.and).toEqual('function');
			expect(typeof validation.and()).toEqual('object');
		});

		it('Returned object has a "clear" method and it should be a function and return an object.', function () {
			expect(validation.clear).toBeDefined();
			expect(typeof validation.clear).toEqual('function');
			expect(typeof validation.clear()).toEqual('object');
		});

		it('Returned object has a "disable" method and it should be a function and return an object.', function () {
			expect(validation.disable).toBeDefined();
			expect(typeof validation.disable).toEqual('function');
			expect(typeof validation.disable()).toEqual('object');
		});

		it('Returned object has a "element" property and it should be a instanceof a HTMLElement.', function () {
			expect(validation.element).toBeDefined();
			expect(validation.element instanceof HTMLElement).toBeTruthy();
		});

		it('Returned object has a "enable" method and it should be a function and return an object.', function () {
			expect(validation.enable).toBeDefined();
			expect(typeof validation.enable).toEqual('function');
			expect(typeof validation.enable()).toEqual('object');
		});

		it('Returned object has a "float" object.', function () {
			expect(validation['float']).toBeDefined();
			expect(typeof validation['float']).toEqual('object');
		});

		it('Returned object has a "form" object.', function () {
			expect(validation.form).toBeDefined();
			expect(typeof validation.form).toEqual('object');
		});

		it('Returned object has a "hasError" method and it should be a function and return a boolean value.', function () {
			expect(validation.hasError).toBeDefined();
			expect(typeof validation.hasError).toEqual('function');
			expect(typeof validation.hasError()).toEqual('boolean');
		});

		it('Returned object has a "helper" object.', function () {
			expect(validation.helper).toBeDefined();
			expect(typeof validation.helper).toEqual('object');
		});

		it('Returned object has a "isActive" method and it should be a function and return a boolean value.', function () {
			expect(validation.isActive).toBeDefined();
			expect(typeof validation.isActive).toEqual('function');
			expect(typeof validation.isActive()).toEqual('boolean');
		});

		it('Returned object has a "message" method and it should be a function.', function () {
			expect(validation.message).toBeDefined();
			expect(typeof validation.message).toEqual('function');
		});

		it('Returned object has a "off" method and it should be a function.', function () {
			expect(validation.off).toBeDefined();
			expect(typeof validation.off).toEqual('function');
		});

		it('Returned object has a "on" method and it should be a function.', function () {
			expect(validation.on).toBeDefined();
			expect(typeof validation.on).toEqual('function');
		});

		it('Returned object has a "once" method and it should be a function.', function () {
			expect(validation.once).toBeDefined();
			expect(typeof validation.once).toEqual('function');
		});

		it('Returned object has a "position" method and it should be a function.', function () {
			expect(validation.position).toBeDefined();
			expect(typeof validation.position).toEqual('function');
		});

		it('Returned object has a "toggleEnable" method and it should be a function and return an object.', function () {
			expect(validation.toggleEnable).toBeDefined();
			expect(typeof validation.toggleEnable).toEqual('function');
			expect(typeof validation.toggleEnable()).toEqual('object');
		});

		it('Returned object has a "trigger" method and it should be a function.', function () {
			expect(validation.trigger).toBeDefined();
			expect(typeof validation.trigger).toEqual('function');
		});

		it('Returned object has a "type" property and it should be validation.', function () {
			expect(validation.type).toBeDefined();
			expect(typeof validation.type).toEqual('string');
			expect(validation.type).toEqual('validation');
		});

		it('Returned object has a "uid" property.', function () {
			expect(validation.uid).toBeDefined();
			expect(typeof validation.uid).toEqual('number');
		});

		it('Returned object has a "validate" method and it should be a function and return an object.', function () {
			expect(validation.validate).toBeDefined();
			expect(typeof validation.validate).toEqual('function');
			expect(typeof validation.validate()).toEqual('object');
		});

		it('Returned object has a "validator" object.', function () {
			expect(validation.validator).toBeDefined();
			expect(typeof validation.validator).toEqual('object');
		});

	});

	describe('Methods.', function () {
		var input;
		beforeEach(function() {
			var n = idGenerator();
			var f = $(form.replace(/{ID}/g, n));
			input = f.find('#validation' + n);
			f.insertAfter('#form' + (n-1));
		});

		afterEach(function() {
			input.removeAttr('value');
		});

		it('The "message()" method should return the original sent message by parameter.', function () {
			var validation = input.email('Message');
			expect(validation.message('email')).toEqual('Message');
		});

		it('The "message(\'New Message\')" method should change the message.', function () {
			var validation = input.email('Message');
			expect(validation.message('email', 'New Message').message('email')).toEqual('New Message');
		});

		it('The "hasError()" method should return an error.', function () {
			var validation = input.email('Message');
			input.attr('value','1234');
			expect(validation.hasError()).toBeTruthy();
		});

		it('The "hasError()" method should be valid.', function () {
			var validation = input.email('Message');
			input.attr('value','foo@bar.foo');
			expect(validation.hasError()).toBeFalsy();
		});

		it('After the "disable()" method is executed the "validation.hasError()" should not return an error when the input is a valid value.', function () {
			var validation = input.required();
			input.attr('value','12345');
			validation.disable();
			expect(validation.hasError()).toBeFalsy();
		});

		it('After the "disable()" method is executed the "validation.hasError()" should not return an error when the input is a invalid value.', function () {
			var validation = input.required();
			validation.disable();
			expect(validation.hasError()).toBeFalsy();
		});

		it('After the "enable()" method is executed the "validation.hasError()" should not return an error when the input is a valid value.', function () {
			var validation = input.required();
			input.attr('value','12345');
			validation.disable();
			validation.enable();
			expect(validation.hasError()).toBeFalsy();
		});

		it('After the "enable()" method is executed the "validation.hasError()" should return an error when the input is a invalid value.', function () {
			var validation = input.required();
			validation.disable();
			validation.enable();
			expect(validation.hasError()).toBeTruthy();
		});

		it('After the "toggleEnable()" method is executed the "validation.hasError()" should not return an error when the input is a invalid value.', function () {
			var validation = input.required();
			validation.toggleEnable();
			expect(validation.hasError()).toBeFalsy();
		});

		it('After the "toggleEnable()" method is executed the "validation.hasError()" should return an error when the input is a invalid value.', function () {
			var validation = input.required();
			validation.disable();
			validation.toggleEnable();
			expect(validation.hasError()).toBeTruthy();
		});

		it('The "isActive()" method should return false when the validation message is not visible.', function () {
			var validation = input.required();
			expect(validation.isActive()).toBeFalsy();
		});

		it('The "isActive()" method should return true when the validation message is not visible.', function () {
			var validation = input.required();
			validation.validate();
			expect(validation.isActive()).toBeTruthy();
		});

		it('The "isActive()" method should return false when the validation message is not visible after it was showed because it had an error.', function () {
			var validation = input.required();
			validation.validate();
			input.attr('value','12345');
			validation.validate();
			expect(validation.isActive()).toBeFalsy();
		});

		it('The "and()" method should return the same jQuery object that was used to instantiate the component.', function () {
			var validation = input.required();
			var uid = validation.uid;
			var jQueryObject = validation.and();
			expect(jQueryObject.data().validation.uid).toEqual(uid);
		});

	});

	describe('Conditions\'s merge.', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.required('Required').and().email('Message');
		f.insertAfter('#form' + (n-1));

		it('The conditions are defined.', function () {
			expect(validation.validator.conditions.required).toBeDefined('object');
			expect(typeof validation.validator.conditions.required).toEqual('object');

			expect(validation.validator.conditions.email).toBeDefined('object');
			expect(typeof validation.validator.conditions.email).toEqual('object');
		});

		it('The message are the right messages.', function () {
			expect(validation.validator.conditions.required.message).toEqual('Required');
			expect(validation.validator.conditions.email.message).toEqual('Message');
		});

	});

	describe('CSS classes.', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.required('Required').and().email('Message');
		f.insertAfter('#form' + (n-1));

		it('The input element should have the "ch-points-ltrt" class.', function () {
			expect( input.hasClass('ch-points-ltrt') ).toBeTruthy();
		});

		it('The input element should have the "ch-points-ltrt" and "ch-form-error".', function () {
			validation.validate();
			expect( input.hasClass('ch-points-ltrt') &&  input.hasClass('ch-form-error') ).toBeTruthy();
		});

		it('The message element should have the specific classes.', function () {
			var message = $('#' + input.attr('aria-label'));
			expect(message.hasClass('ch-points-ltrt') && message.hasClass('ch-validation') && message.hasClass('ch-box-error') && message.hasClass('ch-cone')).toBeTruthy();
		});

	});


});