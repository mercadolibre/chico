describe('ch.MaxLength', function () {
	var form = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="validation{ID}" type="text"></div><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
		idGenerator = (function(){
			var count = 0;

			return function(){
				return count++;
			}
		}());

	describe('ch.MaxLength global initialization and returned object.', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.maxLength(5);
		$('body').prepend(f);

		it('ch.MaxLength should be a function.', function () {
			expect(typeof ch.MaxLength).toEqual('function');
		});

		it('ch.MaxLength should return an object.', function () {
			expect(typeof validation).toEqual('object');
		});

	});

	describe('ch.MaxLength working and configuration.', function () {
		var n = idGenerator();
		var message = 'This is a new test!.';
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.maxLength(4,message);
		$('body').prepend(f);

		it('ch.MaxLength should return an error when numbers are set.', function () {
			input.attr('value', 'abcde');
			expect(validation.hasError()).toBeTruthy();
		});

		it('ch.MaxLength should return the same text send as a parameter when it was initalized.', function () {
			expect(validation.validator.conditions.maxLength.message).toEqual(message);
		});

		it('ch.MaxLength should not return an error when string are set.', function () {
			input.attr('value', 'abc');
			expect(validation.hasError()).toBeFalsy();
		});

	});


});