describe('ch.Countdown', function () {
	var template = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="countdown{ID}" type="text"></div><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
		idGenerator = (function(){
			var count = 0;

			return function(){
				return count++;
			}
		}()),
		getSnippet = function(selector){
			var n = idGenerator();
			var f = $(template.replace(/{ID}/g, n));
			var snippet = f.find(selector + n);
			$('body').prepend(f);
			return snippet;
		};

	describe('Constructor.', function () {

		it('ch.Countdown should be defined as a function.', function () {
			expect(ch.Countdown).toBeDefined();
			expect(typeof ch.Countdown).toEqual('function');
		});

		var countdown1 = getSnippet('#countdown').countdown(),
		countdown2 = getSnippet('#countdown').countdown(20);

		describe('Returned Object',function(){

			it('should be an object.', function () {
				expect(typeof countdown1).toEqual('object');
			});

			it('has a "element" property and it should be a instanceof a HTMLElement.', function () {
				expect(countdown1.element).toBeDefined();
				expect(countdown1.element instanceof HTMLElement).toBeTruthy();
			});

			it('has a "type" property and it should be autoComplete.', function () {
				expect(countdown1.type).toBeDefined();
				expect(typeof countdown1.type).toEqual('string');
				expect(countdown1.type).toEqual('countdown');
			});

			it('has a "uid" property.', function () {
				expect(countdown1.uid).toBeDefined();
				expect(typeof countdown1.uid).toEqual('number');
			});

			it('should show, by default, the text "500 characters left." at ".ch-form-hint".', function () {
				var text = $(countdown1.element).next().text();
				expect(text).toEqual('500 characters left.');
			});

		});

		describe('Working',function(){

			it('should add an HTMLElement with class ".ch-form-hint".', function () {
				var p = $('.ch-form-hint');
				expect(p.length === 2).toBeTruthy();
			});

			it('should show the text "20 characters left." at ".ch-form-hint".', function () {
				var text = $(countdown2.element).next().text();
				expect(text).toEqual('20 characters left.');
			});

			it('should show the text "0 characters left." at ".ch-form-hint". when 20 characters were added.', function () {
				$(countdown2.element).attr('value', '12345678901234567890').keyup();
				waits(50);
				runs(function(){
					var text = $(countdown2.element).next().text();
					expect(text).toEqual('0 characters left.');
				});
			});

			it('should show the text "0 characters left." at ".ch-form-hint". when more than 20 characters were added.', function () {
				$(countdown2.element).attr('value', '123456789012345678901234567890').keyup();
				waits(50);
				runs(function(){
					var text = $(countdown2.element).next().text();
					expect(text).toEqual('0 characters left.');
				});
			});

		});

	});

});


