describe('ch.Required', function () {
	var form = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="validation{ID}" type="text"><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
		idGenerator = (function(){
			var count = 0;

			return function(){
				return count++;
			}
		}());

	describe('ch.Required global initialization and returned object.', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.required();
		$('body').prepend(f);

		it('ch.Required should be a function.', function () {
			expect(typeof ch.Required).toEqual('function');
		});

		it('ch.Required should return an object.', function () {
			expect(typeof validation).toEqual('object');
		});

	});

	describe('ch.Required working and configuration.', function () {
		var n = idGenerator();
		var message = 'This is a new test!.';
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.required(message);
		$('body').prepend(f);

		it('ch.Required should return an error when numbers are set.', function () {
			expect(validation.hasError()).toBeTruthy();
		});

		it('ch.Required should return the same text send as a parameter when it was initalized.', function () {
			expect(validation.validator.conditions.required.message).toEqual(message);
		});

		it('ch.Required should not return an error when string are set.', function () {
			input.attr('value', 11.5);
			expect(validation.hasError()).toBeFalsy();
		});

	});


});