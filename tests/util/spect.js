describe('Util', function () {
	var util = ch.util,
		toTest;

	it('Should be an object', function () {
		expect(typeof util).toEqual('object');
	});

	describe('.hasOwn() method', function () {

		it('Should be defined and it should be a function', function () {
			expect(util.hasOwn).toBeDefined();
			expect(typeof util.hasOwn).toEqual('function');
		});

		it('The object has the property defined', function () {
			toTest = util.hasOwn(ch, 'util');

			expect(toTest).toBeTruthy();
		});

		it('The object has not the property defined', function () {
			toTest = util.hasOwn(ch, 'foo');

			expect(toTest).toBeFalsy();
		});

		it('The method must receive two parameters. The first parameter must be an object and the second one must be a string. Both are required', function () {
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

	describe('.isArray() method', function () {

		it('Should be defined and it should be a function', function () {
			expect(util.isArray).toBeDefined();
			expect(typeof util.isArray).toEqual('function');
		});

		it('The parameter is an Array', function () {
			toTest = util.isArray([]);
			expect(toTest).toBeTruthy();
		});

		it('The parameter is not an Array', function () {
			toTest = util.isArray('test');
			expect(toTest).toBeFalsy();
		});

	});

	describe('.inDom() method', function () {

		it('Should be defined and it should be a function', function () {
			expect(util.inDom).toBeDefined();
			expect(typeof util.inDom).toEqual('function');
		});

		it('The selector is not in the DOM'	, function () {
			toTest = util.inDom('.inDomSelector');
			expect(toTest).toBeFalsy();
		});

		it('The selector is in the DOM', function () {
			var $body = $('body');
			$body.addClass('inDomSelector');
			toTest = util.inDom('.inDomSelector');
			expect(toTest).toBeTruthy();
			$body.removeClass('inDomSelector');
		});

		it('The parameter is not a selector', function () {
			expect(util.inDom()).toBeFalsy();
			expect(util.inDom(undefined)).toBeFalsy();
			expect(util.inDom({})).toBeFalsy();
			expect(util.inDom([])).toBeFalsy();
		});
	});

	describe('.isUrl() method', function () {

		it('Should be defined and it should be a function', function () {
			expect(util.isUrl).toBeDefined();
			expect(typeof util.isUrl).toEqual('function');
		});

		it('Should be a valid URL', function () {

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
			//expect(util.isUrl('http://shipping-frontend.mercadolidesa.com.br:8080/envios/showShipments?status=handling%2Cready_to_ship&totalQuantity=&welcomeFlag=true')).toBeTruthy();

		});

		it('Should not be a valid URL', function () {

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

		it('The parameter is not an URL', function () {
			expect(util.isUrl()).toBeFalsy();
			expect(util.isUrl(undefined)).toBeFalsy();
			expect(util.isUrl({})).toBeFalsy();
			expect(util.isUrl([])).toBeFalsy();
		});

	});

	describe('.avoidTextSelection() method', function () {

		it('Should be defined and it should be a function', function () {
			expect(util.avoidTextSelection).toBeDefined();
			expect(typeof util.avoidTextSelection).toEqual('function');
		});

		it('The method must receive at least a parameter', function () {
			expect(function () {
				util.avoidTextSelection();
			}).toThrow();

			expect(function () {
				util.avoidTextSelection({});
			}).toThrow();

			expect(function () {
				util.avoidTextSelection({},'.selector-test');
			}).toThrow();

			expect(function () {
				util.avoidTextSelection('.selector-test');
			}).not.toThrow();

		});

	});

	describe('.getStyles() method', function () {

		it('Should be defined and it should be a function', function () {
			expect(util.getStyles).toBeDefined();
			expect(typeof util.getStyles).toEqual('function');
		});

		it('Should get 10px for the value of the body\'s margin-top property', function () {
			toTest = document.getElementsByTagName('body')[0];
			toTest.style.marginTop = '10px';
			toTest = util.getStyles(toTest, 'margin-top');

			expect(toTest).toEqual('10px');
		});

		it('The method must receive at least a parameter', function () {
			toTest = document.getElementsByTagName('body')[0];

			expect(function () {
				util.getStyles();
			}).toThrow();

			expect(function () {
				util.getStyles({});
			}).toThrow();

			expect(function () {
				util.getStyles(toTest, 'margin-top');
			}).not.toThrow();

		});

	});

	describe('.isTag() method', function () {

		it('Should be defined and it should be a function', function () {
			expect(util.isTag).toBeDefined();
			expect(typeof util.isTag).toEqual('function');
		});

		it('Should be a tag', function () {

			expect(util.isTag('<input type="text">')).toBeTruthy();
			expect(util.isTag('<div></div>')).toBeTruthy();
			expect(util.isTag('<div>foo</div>')).toBeTruthy();
			expect(util.isTag('<div id="foo"></div>')).toBeTruthy();
			expect(util.isTag('<div id="foo">foo</div>')).toBeTruthy();
			expect(util.isTag('<div id="foo"><span>foo</span></div>')).toBeTruthy();

		});

		it('Should not be a tag', function () {

			expect(util.isTag('<input type="text"')).toBeFalsy();
			expect(util.isTag('<div')).toBeFalsy();

		});

		it('The parameter is not a tag', function () {

			expect(util.isTag()).toBeFalsy();
			expect(util.isTag(undefined)).toBeFalsy();
			expect(util.isTag({})).toBeFalsy();
			expect(util.isTag([])).toBeFalsy();

		});

	});

	describe('.isSelector() method', function () {

		it('Should be defined and it should be a function', function () {
			expect(util.isSelector).toBeDefined();
			expect(typeof util.isSelector).toEqual('function');
		});

		it('The parameter is a valid selector', function () {

			expect(util.isSelector('.class')).toBeTruthy();
			expect(util.isSelector('.class tag')).toBeTruthy();
			expect(util.isSelector('.class #id')).toBeTruthy();

			expect(util.isSelector('tag')).toBeTruthy();
			expect(util.isSelector('tag .class')).toBeTruthy();
			expect(util.isSelector('tag #id')).toBeTruthy();

			expect(util.isSelector('#id')).toBeTruthy();
			expect(util.isSelector('#id .class')).toBeTruthy();
			expect(util.isSelector('#id tag')).toBeTruthy();


		});

		it('The parameter is not a selector', function () {

			expect(util.isSelector()).toBeFalsy();
			expect(util.isSelector(undefined)).toBeFalsy();
			expect(util.isSelector({})).toBeFalsy();
			expect(util.isSelector([])).toBeFalsy();

		});

	});

	describe('.clone() method', function () {

		it('Should be defined and it should be a function', function () {
			expect(util.clone).toBeDefined();
			expect(typeof util.clone).toEqual('function');
		});

		it('Should be clone an object', function () {
			toTest = {
				'name': 'test',
				'age': 1
			};

			var copy = util.clone(toTest);

			expect(copy.age).toEqual(toTest.age);

			copy.age = 2;

			expect(copy.age).not.toEqual(toTest.age);

		});

		it('The method must receive at least a parameter', function () {

			expect(function () {
				util.clone();
			}).toThrow();

			expect(function () {
				util.clone('foo');
			}).toThrow();

			expect(function () {
				util.clone({});
			}).not.toThrow();

		});

	});

	describe('.inherits() method', function () {
		var Foo,
			Bar;

		beforeEach(function () {
			Bar = function () {};
			Bar.prototype = {
				"foobar": "foobar"
			};
			Foo = function () {};
		});

		it('Should be defined and it should be a function', function () {
			expect(util.inherits).toBeDefined();
			expect(typeof util.inherits).toEqual('function');
		});

		it('The method must receive two constructors functions as parameters', function () {

			expect(function () {
				util.inherits();
			}).toThrow();

			expect(function () {
				util.inherits({});
			}).toThrow();

			expect(function () {
				util.inherits('foo', {});
			}).toThrow();

			expect(function () {
				util.inherits({}, 'foo');
			}).toThrow();

			expect(function () {
				util.inherits({}, {});
			}).toThrow();

			expect(function () {
				util.inherits(Foo, Bar);
			}).not.toThrow();

		});

		it('The first constructor must have a super property into prototype', function () {
			expect(Foo.prototype.super).not.toBeDefined();

			util.inherits(Foo, Bar);
			expect(Foo.prototype.super).toBeDefined();
			expect(Foo.prototype.super).toEqual(Bar.prototype);
			expect(Foo.prototype.super.foobar).toEqual(Bar.prototype.foobar);
		});

		it('The first constructor must have the properties of the second constructor into prototype', function () {
			expect(Foo.prototype.foobar).not.toBeDefined();

			util.inherits(Foo, Bar);
			expect(Foo.prototype.foobar).toBeDefined();

			Foo.prototype.foobar = "test"
			expect(Foo.prototype.foobar).not.toEqual(Bar.prototype.foobar);

		});

	});

	describe('.use() method', function () {

		var Foo,
			Bar,
			Foobar;

		beforeEach(function () {

			Bar = function () {
				this.bar = function () {};
			};

			Foobar = function () {
				this.foobar = "foobar";
			};

			Foo = function () {};
		});

		it('Should be defined and it should be a function', function () {
			expect(util.use).toBeDefined();
			expect(typeof util.use).toEqual('function');
		});

		it('The method must receive two parameters', function () {

			expect(function () {
				util.use();
			}).toThrow();

			expect(function () {
				util.use({});
			}).toThrow();

			expect(function () {
				util.use(Foo, Bar);
			}).not.toThrow();

			expect(function () {
				util.use(Foo, [Bar]);
			}).not.toThrow();

		});

		it('The first parameter must have the properties of the collection parameter into prototype', function () {
			expect(Foo.prototype.bar).not.toBeDefined();
			expect(Foo.prototype.foobar).not.toBeDefined();

			util.use(Foo, [Bar, Foobar]);
			expect(Foo.prototype.bar).toBeDefined();
			expect(Foo.prototype.foobar).toBeDefined();
		});

	});

	describe('.VENDOR_PREFIX property', function () {

		it('Should be defined and it should be a string', function () {
			expect(util.VENDOR_PREFIX).toBeDefined();
			expect(typeof util.VENDOR_PREFIX).toEqual('string');
		});

	});

	describe('.zIndex property', function () {

		it('Should be defined and it should be a number', function () {
			expect(util.zIndex).toBeDefined();
			expect(typeof util.zIndex).toEqual('number');
			expect(util.zIndex).toEqual(1000);
		});

	});

});