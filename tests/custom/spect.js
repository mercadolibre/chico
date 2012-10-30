describe('ch.Custom', function () {
	var form = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="validation{ID}" type="text"></div><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
		idGenerator = (function(){
			var count = 0;

			return function(){
				return count++;
			}
		}());

	describe('ch.Custom global initialization and returned object.', function () {
		var n = idGenerator();
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.custom(function(){}, 'Foo');
		$('body').prepend(f);

		it('ch.Custom should be a function.', function () {
			expect(typeof ch.Custom).toEqual('function');
		});

		it('ch.Custom should return an object.', function () {
			expect(typeof validation).toEqual('object');
		});

	});

	describe('ch.Custom working and configuration.', function () {
		var n = idGenerator();
		var message = 'This is a new test!.';
		var f = $(form.replace(/{ID}/g, n));
		var input = f.find('#validation' + n);
		var validation = input.custom(function(value){
			if(typeof value !== 'string'){
				return false;
			}
			return (value.indexOf('a')>=0?true:false);
		}, message);
		$('body').prepend(f);

		it('ch.Custom should return an error when numbers are set.', function () {
			input.attr('value', 'foo');
			expect(validation.hasError()).toBeTruthy();
		});

		it('ch.Custom should return the same text send as a parameter when it was initalized.', function () {
			expect(validation.validator.conditions.custom.message).toEqual(message);
		});

		it('ch.Custom should not return an error when string are set.', function () {
			input.attr('value', 'bar');
			expect(validation.hasError()).toBeFalsy();
		});

	});


});