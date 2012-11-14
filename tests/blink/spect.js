describe('Blink', function () {
	var $element = $('h1');

	it('Should be defined', function () {
		expect(ch.util.hasOwn(ch, 'blink')).toBeTruthy();
		expect(typeof ch.blink).toEqual('function');
	});

	it('Should return query selector Object', function () {
		var blink = $element.blink();
		expect(blink).toEqual($element);
	});

	it('Should have ".ch-blink" classname when it\'s active', function () {
		$element.blink();
		expect($element.hasClass('ch-blink')).toBeTruthy();

	});

	it('Should set ARIA attributes when it\'s active', function () {
		$element.blink();
		expect($element.attr('role')).toEqual('alert');
		expect($element.attr('aria-live')).toEqual('polite');
	});

	it('It should set background-color property to White when it was finished.', function () {
		$element.blink();
		waits(4000);
		runs(function () {
			expect($element.css('background-color')).toEqual('rgb(255, 255, 255)');
		});

	});
});