describe('ch.MinLength', function () {
	var form = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="validation{ID}" type="text"><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
		idGenerator = (function(){
			var count = 0;

			return function(){
				return count++;
			}
		}());

	describe('ch.MinLength global initialization and returned object.', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.minLength(5);
		$('body').prepend(f);

		it('ch.MinLength should be a function.', function () {
			expect(typeof ch.MinLength).toEqual('function');
		});

		it('ch.MinLength should return an object.', function () {
			expect(typeof validation).toEqual('object');
		});

	});

	describe('ch.MinLength working and configuration.', function () {
		var n = idGenerator();
		var message = 'This is a new test!.';
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.minLength(4,message);
		$('body').prepend(f);

		it('ch.MinLength should return an error when numbers are set.', function () {
			input.attr('value', 'abc');
			expect(validation.hasError()).toBeTruthy();
		});

		it('ch.MinLength should return the same text send as a parameter when it was initalized.', function () {
			expect(validation.validator.conditions.minLength.message).toEqual(message);
		});

		it('ch.MinLength should not return an error when string are set.', function () {
			input.attr('value', 'abcde');
			expect(validation.hasError()).toBeFalsy();
		});

	});


});