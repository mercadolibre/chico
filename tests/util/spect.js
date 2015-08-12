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
                util.avoidTextSelection(document.querySelector('.selector-test'));
            }).toThrow();

            expect(function () {
                util.avoidTextSelection(document.querySelector('.version'));
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

    describe('.zIndex property', function () {

        it('Should be defined and it should be a number', function () {
            expect(util.zIndex).toBeDefined();
            expect(typeof util.zIndex).toEqual('number');
            expect(util.zIndex).toEqual(1000);
        });

    });

});