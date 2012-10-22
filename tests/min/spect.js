describe('ch.Min', function () {
	var form = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="validation{ID}" type="text"><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
		idGenerator = (function(){
			var count = 0;

			return function(){
				return count++;
			}
		}());

	describe('ch.Min global initialization and returned object.', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.min(5);
		$('body').prepend(f);

		it('ch.Min should be a function.', function () {
			expect(typeof ch.Min).toEqual('function');
		});

		it('ch.Min should return an object.', function () {
			expect(typeof validation).toEqual('object');
		});

	});

	describe('ch.Min working and configuration.', function () {
		var n = idGenerator();
		var message = 'This is a new test!.';
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.min(10,message);
		$('body').prepend(f);

		it('ch.Min should return an error when numbers are set.', function () {
			input.attr('value', 9);
			expect(validation.hasError()).toBeTruthy();
		});

		it('ch.Min should return the same text send as a parameter when it was initalized.', function () {
			expect(validation.validator.conditions.min.message).toEqual(message);
		});

		it('ch.Min should not return an error when string are set.', function () {
			input.attr('value', 20);
			expect(validation.hasError()).toBeFalsy();
		});

	});


});