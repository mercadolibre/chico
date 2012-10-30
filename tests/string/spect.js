describe('ch.String', function () {
	var form = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="validation{ID}" type="text"></div><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
		idGenerator = (function(){
			var count = 0;

			return function(){
				return count++;
			}
		}());

	describe('String global initialization and returned object.', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.string();
		$('body').prepend(f);

		it('ch.String should be a function.', function () {
			expect(typeof ch.String).toEqual('function');
		});

		it('ch.String should return an object.', function () {
			expect(typeof validation).toEqual('object');
		});

	});

	describe('ch.Email working and configuration.', function () {
		var n = idGenerator();
		var message = 'This is a new test!.';
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.string(message);
		$('body').prepend(f);

		it('ch.String should return an error when numbers are set.', function () {
			input.attr('value', 1234);
			expect(validation.hasError()).toBeTruthy();
		});

		it('ch.String should return the same text send as a parameter when it was initalized.', function () {
			expect(validation.validator.conditions.string.message).toEqual(message);
		});

		it('String should not return an error when string are set.', function () {
			input.attr('value', 'abc');
			expect(validation.hasError()).toBeFalsy();
		});

	});


});