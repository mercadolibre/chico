describe('Util', function () {
	var util = ch.util,
		toTest;

	it('Should be an object.', function () {
		expect(typeof util).toEqual('object');
	});

	describe('The hasOwn method', function () {

		it('Should be defined and it should be a function.', function () {
			expect(util.hasOwn).toBeDefined();
			expect(typeof util.hasOwn).toEqual('function');
		});

		it('The object has the property defined.', function () {
			toTest = util.hasOwn(ch, 'util');

			expect(toTest).toBeTruthy();
		});

		it('The object has not the property defined.', function () {
			toTest = util.hasOwn(ch, 'foo');

			expect(toTest).toBeFalsy();
		});

		it('The method must receive two parameters. The first parameter must be an object and the second one must be a string. Both are required.', function () {
			expect(function () {
				util.hasOwn();
			}).toThrow();

			expect(function () {
				util.hasOwn('ch');
			}).toThrow();

			expect(function () {
				util.hasOwn(ch);
			}).toThrow();

			expect(function () {
				util.hasOwn(ch, ch);
			}).toThrow();

			expect(function () {
				util.hasOwn(ch, 'foo');
			}).not.toThrow();
		});

	});

	describe('The isArray method', function () {

		it('Should be defined and it should be a function.', function () {
			expect(util.isArray).toBeDefined();
			expect(typeof util.isArray).toEqual('function');
		});

		it('The parameter is an Array.', function () {
			toTest = util.isArray([]);
			expect(toTest).toBeTruthy();
		});

		it('The parameter is not an Array.', function () {
			toTest = util.isArray('test');
			expect(toTest).toBeFalsy();
		});

	});

	describe('The inDom method', function () {

		it('Should be defined and it should be a function.', function () {
			expect(util.inDom).toBeDefined();
			expect(typeof util.inDom).toEqual('function');
		});

		it('The selector is not in the DOM.', function () {
			toTest = util.inDom('.inDomSelector');
			expect(toTest).toBeFalsy();
		});

		it('The selector is in the DOM.', function () {
			var $body = $('body');
			$body.addClass('inDomSelector');
			toTest = util.inDom('.inDomSelector');
			expect(toTest).toBeTruthy();
			$body.removeClass('inDomSelector');
		});

		it('The method must receive a parameter and it must be a string.', function () {
			expect(function () {
				util.inDom();
			}).toThrow();

			expect(function () {
				util.inDom([]);
			}).toThrow();

			expect(function () {
				util.inDom('');
			}).not.toThrow();
		});
	});

	describe('The isUrl method', function () {

		it('Should be defined and it should be a function.', function () {
			expect(util.isUrl).toBeDefined();
			expect(typeof util.isUrl).toEqual('function');
		});

		it('Should be a valid URL.', function () {

			expect(util.isUrl('http://www.mercadolibre.com')).toBeTruthy();
			expect(util.isUrl('http://mercadolibre.com/')).toBeTruthy();
			expect(util.isUrl('http://mercadolibre.com:8080?hola=')).toBeTruthy();
			expect(util.isUrl('http://mercadolibre.com/pepe')).toBeTruthy();
			expect(util.isUrl('http://localhost:2020')).toBeTruthy();
			expect(util.isUrl('http://192.168.1.1')).toBeTruthy();
			expect(util.isUrl('http://192.168.1.1:9090')).toBeTruthy();
			expect(util.isUrl('www.mercadolibre.com')).toBeTruthy();
			expect(util.isUrl('/mercadolibre')).toBeTruthy();
			expect(util.isUrl('/mercadolibre/mercado')).toBeTruthy();
			expect(util.isUrl('/tooltip?siteId=MLA&categId=1744&buyingMode=buy_it_now&listingTypeId=bronze')).toBeTruthy();
			expect(util.isUrl('./pepe')).toBeTruthy();
			expect(util.isUrl('../../mercado/')).toBeTruthy();
			expect(util.isUrl('www.mercadolibre.com?siteId=MLA&categId=1744&buyingMode=buy_it_now&listingTypeId=bronze')).toBeTruthy();
			expect(util.isUrl('www.mercado-libre.com')).toBeTruthy();
			expect(util.isUrl('http://ui.ml.com:8080/ajax.html')).toBeTruthy();

		});

		it('Should not be a valid URL.', function () {

			expect(util.isUrl('http://')).toBeFalsy();
			expect(util.isUrl('http://www&')).toBeFalsy();
			expect(util.isUrl('http://hola=')).toBeFalsy();
			expect(util.isUrl('/../../mercado/')).toBeFalsy();
			expect(util.isUrl('/mercado/../pepe')).toBeFalsy();
			expect(util.isUrl('mercadolibre.com')).toBeFalsy();
			expect(util.isUrl('mercado/mercado')).toBeFalsy();
			expect(util.isUrl('localhost:8080/mercadolibre')).toBeFalsy();
			expect(util.isUrl('pepe/../pepe.html')).toBeFalsy();
			expect(util.isUrl('192.168.1.1')).toBeFalsy();
			expect(util.isUrl('localhost:8080/pepe')).toBeFalsy();
			expect(util.isUrl('localhost:80-80')).toBeFalsy();
			expect(util.isUrl('www.mercadolibre.com?siteId=MLA&categId=1744&buyi ngMode=buy_it_now&listingTypeId=bronze')).toBeFalsy();
			expect(util.isUrl('`<asd src="www.mercadolibre.com">`')).toBeFalsy();
			expect(util.isUrl('Mercadolibre.................')).toBeFalsy();
			expect(util.isUrl('/laksjdlkasjd../')).toBeFalsy();
			expect(util.isUrl('/..pepe..')).toBeFalsy();
			expect(util.isUrl('/pepe..')).toBeFalsy();
			expect(util.isUrl('pepe:/')).toBeFalsy();
			expect(util.isUrl('/:pepe')).toBeFalsy();
			expect(util.isUrl('dadadas.pepe')).toBeFalsy();
			expect(util.isUrl('qdasdasda')).toBeFalsy();
			expect(util.isUrl('http://ui.ml.com:8080:8080/ajax.html')).toBeFalsy();

		});



	});


});












