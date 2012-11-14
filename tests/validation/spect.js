describe('The ch.Validation', function () {
	var Validation = ch.Validation,
		form = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="validation{ID}" type="text"></div><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
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

	describe('constructor', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = new Validation(input, email);
		$('body').prepend(f);

		it('should be a function.', function () {
			expect(typeof Validation).toEqual('function');
		});

		describe('returns an object', function () {

			it('so it should be an object', function () {
				expect(typeof validation).toEqual('object');
			});

			describe('with property', function () {

				it('"element" that it should be a instanceof a HTMLElement.', function () {
					expect(validation.element).toBeDefined();
					expect(validation.element instanceof HTMLElement).toBeTruthy();
				});

				it('"float" that it should be an object', function () {
					expect(validation['float']).toBeDefined();
					expect(typeof validation['float']).toEqual('object');
				});

				it('"form" that it should be an object', function () {
					expect(validation.form).toBeDefined();
					expect(typeof validation.form).toEqual('object');
				});

				it('"helper" that it should be an object', function () {
					expect(validation.helper).toBeDefined();
					expect(typeof validation.helper).toEqual('object');
				});

				it('"type" that it should be a string', function () {
					expect(validation.type).toBeDefined();
					expect(typeof validation.type).toEqual('string');
					expect(validation.type).toEqual('validation');
				});

				it('"validator" that it should be an object', function () {
					expect(validation.validator).toBeDefined();
					expect(typeof validation.validator).toEqual('object');
				});

				it('"uid" that it should be a number', function () {
					expect(validation.uid).toBeDefined();
					expect(typeof validation.uid).toEqual('number');
				});
			});

			describe('with method', function () {

				it('"and" that it should return an object', function () {
					expect(validation.and).toBeDefined();
					expect(typeof validation.and).toEqual('function');
					expect(typeof validation.and()).toEqual('object');
				});

				it('"clear" that it should  return an object', function () {
					expect(validation.clear).toBeDefined();
					expect(typeof validation.clear).toEqual('function');
					expect(typeof validation.clear()).toEqual('object');
					// === validation
				});

				it('"disable" that it should return an object', function () {
					expect(validation.disable).toBeDefined();
					expect(typeof validation.disable).toEqual('function');
					expect(typeof validation.disable()).toEqual('object');
				});

				it('"enable" that it should return an object', function () {
					expect(validation.enable).toBeDefined();
					expect(typeof validation.enable).toEqual('function');
					expect(typeof validation.enable()).toEqual('object');
				});

				it('"hasError" that it should return a boolean value', function () {
					expect(validation.hasError).toBeDefined();
					expect(typeof validation.hasError).toEqual('function');
					expect(typeof validation.hasError()).toEqual('boolean');
				});

				it('"isActive" that it should return a boolean value', function () {
					expect(validation.isActive).toBeDefined();
					expect(typeof validation.isActive).toEqual('function');
					expect(typeof validation.isActive()).toEqual('boolean');
				});

				it('"message"', function () {
					expect(validation.message).toBeDefined();
					expect(typeof validation.message).toEqual('function');
				});

				it('"off" that it should return an object', function () {
					expect(validation.off).toBeDefined();
					expect(typeof validation.off).toEqual('function');
					expect(typeof validation.off('show', function(){})).toEqual('object');
				});

				it('"on" that it should return an object', function () {
					expect(validation.on).toBeDefined();
					expect(typeof validation.on).toEqual('function');
					expect(typeof validation.on('show', function(){})).toEqual('object');
				});

				it('"once" that it should return an object', function () {
					expect(validation.once).toBeDefined();
					expect(typeof validation.once).toEqual('function');
					expect(typeof validation.once('show', function(){})).toEqual('object');
				});

				it('"position"', function () {
					expect(validation.position).toBeDefined();
					expect(typeof validation.position).toEqual('function');
				});

				it('"toggleEnable" that it should return an object', function () {
					expect(validation.toggleEnable).toBeDefined();
					expect(typeof validation.toggleEnable).toEqual('function');
					expect(typeof validation.toggleEnable()).toEqual('object');
				});

				it('"trigger"', function () {
					expect(validation.trigger).toBeDefined();
					expect(typeof validation.trigger).toEqual('function');
				});

				it('"validate" that it should return an object', function () {
					expect(validation.validate).toBeDefined();
					expect(typeof validation.validate).toEqual('function');
					expect(typeof validation.validate()).toEqual('object');
				});

			});

		});

	});

	describe('method', function () {
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

		describe('message', function () {
			it('should return the original sent message by parameter', function () {
				var validation = input.email('Message');
				expect(validation.message('email')).toEqual('Message');
			});

			it('should change the message', function () {
				var validation = input.email('Message');
				expect(validation.message('email', 'New Message').message('email')).toEqual('New Message');
			});
		});

		describe('hasError', function () {
			it('should return an error', function () {
				var validation = input.email('Message');
				input.attr('value','1234');
				expect(validation.hasError()).toBeTruthy();
			});

			it('should be valid', function () {
				var validation = input.email('Message');
				input.attr('value','foo@bar.foo');
				expect(validation.hasError()).toBeFalsy();
			});
		});

		describe('disable', function () {
			it('should off the engine and it should not to return an error when the input has a valid value', function () {
				var validation = input.required();
				input.attr('value','12345');
				validation.disable();
				expect(validation.hasError()).toBeFalsy();
			});

			it('should off the engine and it should not to return an error when the input has an invalid value', function () {
				var validation = input.required();
				validation.disable();
				expect(validation.hasError()).toBeFalsy();
			});
		});

		describe('enable', function () {
			// review those tests, it are test in that way because we hadn't a way to test enable disable methods
			// those tests could be for hasError method
			it('should on the engine and it should not return an error when the input has a valid value', function () {
				var validation = input.required();
				input.attr('value','12345');
				validation.disable();
				validation.enable();
				expect(validation.hasError()).toBeFalsy();
			});

			it('should on the engine and it should return an error when the input has a invalid value', function () {
				var validation = input.required();
				validation.disable();
				validation.enable();
				expect(validation.hasError()).toBeTruthy();
			});
		});

		describe('toggleEnable', function () {
			it('should off the engine when it is on, and it should not return an error when the input is a invalid value', function () {
				var validation = input.required();
				validation.toggleEnable();
				expect(validation.hasError()).toBeFalsy();
			});

			it('should on the engine when it is off, and it should return an error when the input is a invalid value', function () {
				var validation = input.required();
				validation.disable();
				validation.toggleEnable();
				expect(validation.hasError()).toBeTruthy();
			});
		});

		describe('isActive', function () {
			it('should return false when the validation message is not visible', function () {
				var validation = input.required();
				expect(validation.isActive()).toBeFalsy();
			});

			it('should return true when the validation message is not visible', function () {
				var validation = input.required();
				validation.validate();
				expect(validation.isActive()).toBeTruthy();
			});

			it('should return false when the validation message is not visible after it was showed because it had an error', function () {
				var validation = input.required();
				validation.validate();
				input.attr('value','12345');
				validation.validate();
				expect(validation.isActive()).toBeFalsy();
			});
		});

		describe('and', function () {
			it('should return the same jQuery object that was used to instantiate the component', function () {
				var validation = input.required();
				var uid = validation.uid;
				var jQueryObject = validation.and();
				expect(jQueryObject.data().validation.uid).toEqual(uid);
			});
		});

	});

	describe('condition', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.required('Required').and().email('Message');
		f.insertAfter('#form' + (n-1));

		it('should be defined', function () {
			expect(validation.validator.conditions.required).toBeDefined('object');
			expect(typeof validation.validator.conditions.required).toEqual('object');

			expect(validation.validator.conditions.email).toBeDefined('object');
			expect(typeof validation.validator.conditions.email).toEqual('object');
		});

		it('should show the correct message to each condition', function () {
			expect(validation.validator.conditions.required.message).toEqual('Required');
			expect(validation.validator.conditions.email.message).toEqual('Message');
		});

	});

	describe('classes.', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.required('Required').and().email('Message');
		f.insertAfter('#form' + (n-1));

		it('"ch-points-ltrt" should be added to the input element', function () {
			expect( input.hasClass('ch-points-ltrt') ).toBeTruthy();
		});

		it('"ch-points-ltrt" and "ch-form-error" should be added to the input element', function () {
			validation.validate();
			expect( input.hasClass('ch-points-ltrt') &&  input.hasClass('ch-form-error') ).toBeTruthy();
		});

		it('"ch-points-ltrt", "ch-validation", "ch-box-error" and "ch-cone" classes should be added to the message element', function () {
			var message = $('#' + input.attr('aria-label'));
			expect(message.hasClass('ch-points-ltrt') && message.hasClass('ch-validation') && message.hasClass('ch-box-error') && message.hasClass('ch-cone')).toBeTruthy();
		});

	});

	describe('event', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.required();
		$('body').prepend(f);
		var readyCallback,
			beforeValidateCallback,
			afterValidateCallback,
			clearCallback,
			errorCallback;

		validation.on('ready', function(){ readyEvent(); });
		validation.on('beforeValidate', function(){ beforeValidateEvent(); });
		validation.on('afterValidate', function(){ afterValidateEvent(); });
		validation.on('clear', function(){ clearEvent(); });
		validation.on('error', function(){ errorEvent(); });

		beforeEach(function () {
			readyEvent = jasmine.createSpy('readyEvent');
			beforeValidateEvent = jasmine.createSpy('beforeValidateEvent');
			afterValidateEvent = jasmine.createSpy('afterValidateEvent');
			clearEvent = jasmine.createSpy('clearEvent');
			errorEvent = jasmine.createSpy('errorEvent');
		});

		it('ready', function () {
			waits(75);
			runs(function () {
				expect(readyEvent).toHaveBeenCalled();
			});
		});

		it('beforeValidate', function () {
			input.attr('value', 'foo');
			validation.validate();
			expect(beforeValidateEvent.callCount).toEqual(1);
			expect(beforeValidateEvent).toHaveBeenCalled();
		});

		it('afterValidate', function () {
			validation.validate();
			expect(afterValidateEvent.callCount).toEqual(1);
			expect(afterValidateEvent).toHaveBeenCalled();
		});

		it('clear', function () {
			validation.clear();
			expect(clearEvent.callCount).toEqual(1);
			expect(clearEvent).toHaveBeenCalled();
		});

		it('error', function () {
			input.attr('value', '');
			validation.validate();
			expect(errorEvent.callCount).toEqual(1);
			expect(errorEvent).toHaveBeenCalled();
		});
	});


	describe('callback', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var beforeValidateCallback,
			afterValidateCallback,
			clearCallback,
			errorCallback;
		var validation = input.required({
			'beforeValidate': function(){ beforeValidateCallback(); },
			'afterValidate': function(){ afterValidateCallback(); },
			'onClear': function(){ clearCallback(); },
			'onError': function(){ errorCallback(); }
		});
		$('body').prepend(f);


		beforeEach(function () {
			beforeValidateCallback = jasmine.createSpy('beforeValidateCallback');
			afterValidateCallback = jasmine.createSpy('afterValidateCallback');
			clearCallback = jasmine.createSpy('clearCallback');
			errorCallback = jasmine.createSpy('errorCallback');
		});

		it('beforeValidate', function () {
			input.attr('value', 'foo');
			validation.validate();
			expect(beforeValidateCallback.callCount).toEqual(1);
			expect(beforeValidateCallback).toHaveBeenCalled();
		});

		it('afterValidate', function () {
			validation.validate();
			expect(afterValidateCallback.callCount).toEqual(1);
			expect(afterValidateCallback).toHaveBeenCalled();
		});

		it('clear', function () {
			validation.clear();
			expect(clearCallback.callCount).toEqual(1);
			expect(clearCallback).toHaveBeenCalled();
		});

		it('error', function () {
			input.attr('value', '');
			validation.validate();
			expect(errorCallback.callCount).toEqual(1);
			expect(errorCallback).toHaveBeenCalled();
		});
	});


});