describe('ch.Email', function () {
	var form = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="validation{ID}" type="text"><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
		idGenerator = (function(){
			var count = 0;

			return function(){
				return count++;
			}
		}());

	describe('ch.Email global initialization and returned object.', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.email();
		$('body').prepend(f);

		it('ch.Email should be a function.', function () {
			expect(typeof ch.Email).toEqual('function');
		});

		it('ch.Email should return an object.', function () {
			expect(typeof validation).toEqual('object');
		});

	});

	describe('ch.Email working and configuration.', function () {
		var n = idGenerator();
		var message = 'This is a new test!.';
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.email(message);
		$('body').prepend(f);

		it('ch.Email should return an error when numbers are set.', function () {
			input.attr('value', 1234);
			expect(validation.hasError()).toBeTruthy();
		});

		it('ch.Email should return the same text send as a parameter when it was initalized.', function () {
			expect(validation.validator.conditions.email.message).toEqual(message);
		});

		it('ch.Email should not return an error when string are set.', function () {
			input.attr('value', 'foo@foo.bar');
			expect(validation.hasError()).toBeFalsy();
		});

	});


});