describe('ch.Price', function () {
	var form = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="validation{ID}" type="text"><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
		idGenerator = (function(){
			var count = 0;

			return function(){
				return count++;
			}
		}());

	describe('ch.Price global initialization and returned object.', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.price(5);
		$('body').prepend(f);

		it('ch.Price should be a function.', function () {
			expect(typeof ch.Price).toEqual('function');
		});

		it('ch.Price should return an object.', function () {
			expect(typeof validation).toEqual('object');
		});

	});

	describe('ch.Price working and configuration.', function () {
		var n = idGenerator();
		var message = 'This is a new test!.';
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.price(10,message);
		$('body').prepend(f);

		it('ch.Price should return an error when numbers are set.', function () {
			input.attr('value', 'a');
			expect(validation.hasError()).toBeTruthy();
		});

		it('ch.Price should return the same text send as a parameter when it was initalized.', function () {
			expect(validation.validator.conditions.price.message).toEqual(message);
		});

		it('ch.Price should not return an error when string are set.', function () {
			input.attr('value', 11.5);
			expect(validation.hasError()).toBeFalsy();
		});

	});


});