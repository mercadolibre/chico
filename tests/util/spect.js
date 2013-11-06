describe('Util', function () {
    var util = ch.util,
        toTest;

    it('Should be an object', function () {
        expect(typeof util).toEqual('object');
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
            expect(util.isUrl('http://localhost:3040/static/ajax.html')).toBeTruthy();
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
            expect(util.isUrl('http://localhost:3040:3040/static/ajax.html')).toBeFalsy();

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
                util.avoidTextSelection('.selector-test');
            }).toThrow();

            expect(function () {
                util.avoidTextSelection($('.version'));
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

        it('The first constructor must have the properties of the second constructor into prototype', function () {
            expect(Foo.prototype.foobar).not.toBeDefined();

            util.inherits(Foo, Bar);
            expect(Foo.prototype.foobar).toBeDefined();

            Foo.prototype.foobar = "test"
            expect(Foo.prototype.foobar).not.toEqual(Bar.prototype.foobar);

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