describe('ch.Condition', function () {
	var Condition = ch.Condition,
		toTest;

	it('Should be a function', function () {
		expect(typeof Condition).toEqual('function');
	});

	describe('The ch.Condition will return an object', function () {
		var c = {
			'name': 'string',
			'message': 'Error'
		},
		condition = new Condition(c);

		it('Should be an object.', function () {
			expect(typeof condition).toEqual('object');
		});

		it('Should have "name" and "message" properties and it must be set string values.', function () {
			expect(condition.name).toBeDefined();
			expect(typeof condition.name).toEqual('string');

			expect(condition.message).toBeDefined();
			expect(typeof condition.message).toEqual('string');
		});

		it('Should have "enable()", "disable()" and "test()" methods and thoses must be functions.', function () {
			expect(condition.enable).toBeDefined();
			expect(typeof condition.enable).toEqual('function');

			expect(condition.disable).toBeDefined();
			expect(typeof condition.disable).toEqual('function');

			expect(condition.test).toBeDefined();
			expect(typeof condition.test).toEqual('function');
		});

		it('The test method without value. It expected to throw.', function () {
			expect(function () {
				condition.test();
			}).toThrow();
		});

	});

	describe('The string Condition.', function () {
		var c = {
			'name': 'string',
			'message': 'Error'
		},
		condition = new Condition(c);

		it('Should be valid.', function () {
			expect(condition.test('foo')).toBeTruthy();
			expect(condition.test('foo bar')).toBeTruthy();
		});

		it('Should be invalid.', function () {
			expect(condition.test('.foo')).toBeFalsy();
			expect(condition.test('foo bar.')).toBeFalsy();
			expect(condition.test('foo .bar')).toBeFalsy();
			expect(condition.test('foo@bar')).toBeFalsy();
			expect(condition.test('foo"bar')).toBeFalsy();
		});

	});

	describe('The email Condition.', function () {
		var c = {
			'name': 'email',
			'message': 'Error'
		},
		condition = new Condition(c);

		it('Should be valid.', function () {
			expect(condition.test('foo@foo.bar')).toBeTruthy();
			expect(condition.test('foo@foo.ba')).toBeTruthy();
			expect(condition.test('foo@fo.ba')).toBeTruthy();
			expect(condition.test('o@fo.ba')).toBeTruthy();
			expect(condition.test('o@o.r')).toBeTruthy();
			expect(condition.test('foo21bar@foo.bar')).toBeTruthy();
			expect(condition.test('foo21.bar@foo.bar')).toBeTruthy();
			expect(condition.test('21.bar@foo.bar')).toBeTruthy();
			expect(condition.test('foo.bar@foo.bar')).toBeTruthy();
			expect(condition.test('fo-o.bar@foo.bar')).toBeTruthy();
			expect(condition.test('foo.b-ar@foo.bar')).toBeTruthy();
			expect(condition.test('fo-o.b-ar@foo.bar')).toBeTruthy();
			expect(condition.test('foo-bar@foo.bar')).toBeTruthy();
			expect(condition.test('foo_bar@foo.bar')).toBeTruthy();
		});

		it('Should be invalid.', function () {
			expect(condition.test('@.foo')).toBeFalsy();
			expect(condition.test('foo@bar.')).toBeFalsy();
			expect(condition.test('.bar@')).toBeFalsy();
			expect(condition.test('@')).toBeFalsy();
		});

	});

	describe('The url Condition.', function () {
		var c = {
			'name': 'url',
			'message': 'Error'
		},
		condition = new Condition(c);

		it('Should be valid.', function () {
			expect(condition.test('http://www.foo.bar')).toBeTruthy();
			expect(condition.test('http://www.foo.bar/foo')).toBeTruthy();
			expect(condition.test('http://www.foo.bar/foo?bar=foo')).toBeTruthy();
			expect(condition.test('http://www.foo.bar/foo?bar=foo&foo=bar')).toBeTruthy();
			expect(condition.test('http://www.foo.bar/foo?bar=foo&foo=%20bar')).toBeTruthy();

			expect(condition.test('ftp://www.foo.bar')).toBeTruthy();
			expect(condition.test('ftp://www.foo.bar/foo')).toBeTruthy();
			expect(condition.test('ftp://www.foo.bar/foo?bar=foo')).toBeTruthy();
			expect(condition.test('ftp://www.foo.bar/foo?bar=foo&foo=bar')).toBeTruthy();
			expect(condition.test('ftp://www.foo.bar/foo?bar=foo&foo=%20bar')).toBeTruthy();

			expect(condition.test('www.foo.bar')).toBeTruthy();
			expect(condition.test('www.foo.bar/foo')).toBeTruthy();
			expect(condition.test('www.foo.bar/foo?bar=foo')).toBeTruthy();
			expect(condition.test('www.foo.bar/foo?bar=foo&foo=bar')).toBeTruthy();
			expect(condition.test('www.foo.bar/foo?bar=foo&foo=%20bar')).toBeTruthy();

			expect(condition.test('foo.bar')).toBeTruthy();
			expect(condition.test('foo.bar/foo')).toBeTruthy();
			expect(condition.test('foo.bar/foo?bar=foo')).toBeTruthy();
			expect(condition.test('foo.bar/foo?bar=foo&foo=bar')).toBeTruthy();
			expect(condition.test('foo.bar/foo?bar=foo&foo=%20bar')).toBeTruthy();

			expect(condition.test('/foo.bar')).toBeTruthy();
			expect(condition.test('/foo.bar/foo')).toBeTruthy();
			expect(condition.test('/foo.bar/foo?bar=foo')).toBeTruthy();
			expect(condition.test('/foo.bar/foo?bar=foo&foo=bar')).toBeTruthy();
			expect(condition.test('/foo.bar/foo?bar=foo&foo=%20bar')).toBeTruthy();

			expect(condition.test('./foo.bar')).toBeTruthy();
			expect(condition.test('./foo.bar/foo')).toBeTruthy();
			expect(condition.test('./foo.bar/foo?bar=foo')).toBeTruthy();
			expect(condition.test('./foo.bar/foo?bar=foo&foo=bar')).toBeTruthy();
			expect(condition.test('./foo.bar/foo?bar=foo&foo=%20bar')).toBeTruthy();

			expect(condition.test('../foo.bar')).toBeTruthy();
			expect(condition.test('../foo.bar/foo')).toBeTruthy();
			expect(condition.test('../foo.bar/foo?bar=foo')).toBeTruthy();
			expect(condition.test('../foo.bar/foo?bar=foo&foo=bar')).toBeTruthy();
			expect(condition.test('../foo.bar/foo?bar=foo&foo=%20bar')).toBeTruthy();
		});

		it('Should be invalid.', function () {
			expect(condition.test('@.foo')).toBeFalsy();
			expect(condition.test('//wwww')).toBeFalsy();
			expect(condition.test('wwww//.com')).toBeFalsy();
		});

	});

	describe('The minLength Condition.', function () {
		var c = {
			'name': 'minLength',
			'message': 'Error',
			'num': 10
		},
		e = {
			'name': 'minLength',
			'message': 'Error'
		},
		condition = new Condition(c);

		it('Error handling. It expected to throw.', function () {
			expect(function () {
				new Condition(e);
			}).toThrow();
		});

		it('Should be valid.', function () {
			expect(condition.test('012345678910')).toBeTruthy();
			expect(condition.test('012345678 10')).toBeTruthy();
			expect(condition.test('01234567. 10')).toBeTruthy();
		});

		it('Should be invalid.', function () {
			expect(condition.test('012345678')).toBeFalsy();
			expect(condition.test('0123456 8')).toBeFalsy();
			expect(condition.test('012345. 8')).toBeFalsy();
		});

	});

	describe('The maxLength Condition.', function () {
		var c = {
			'name': 'maxLength',
			'message': 'Error',
			'num': 10
		},
		e = {
			'name': 'maxLength',
			'message': 'Error'
		},
		condition = new Condition(c);

		it('Error handling. It expected to throw.', function () {
			expect(function () {
				new Condition(e);
			}).toThrow();
		});

		it('Should be valid.', function () {
			expect(condition.test('012345')).toBeTruthy();
			expect(condition.test('0123 5')).toBeTruthy();
			expect(condition.test('012. 5')).toBeTruthy();
		});

		it('Should be invalid.', function () {
			expect(condition.test('012345678910')).toBeFalsy();
			expect(condition.test('0123456 8910')).toBeFalsy();
			expect(condition.test('012345. 8910')).toBeFalsy();
		});

	});

	describe('The number Condition.', function () {
		var c = {
			'name': 'number',
			'message': 'Error'
		},
		condition = new Condition(c);

		it('Should be valid.', function () {
			expect(condition.test(10)).toBeTruthy();
			expect(condition.test(0)).toBeTruthy();
			expect(condition.test(10.0)).toBeTruthy();
			expect(condition.test(-10)).toBeTruthy();
		});

		it('Should be invalid.', function () {
			expect(condition.test(false)).toBeFalsy();
			expect(condition.test({})).toBeFalsy();
			expect(condition.test([])).toBeFalsy();
		});

	});

	describe('The min Condition.', function () {
		var c = {
			'name': 'min',
			'message': 'Error',
			'num': 10
		},
		e = {
			'name': 'min',
			'message': 'Error'
		},
		condition = new Condition(c);

		it('Error handling. It expected to throw.', function () {
			expect(function () {
				new Condition(e);
			}).toThrow();
		});

		it('Should be valid.', function () {
			expect(condition.test(15)).toBeTruthy();
			expect(condition.test('15')).toBeTruthy();
		});

		it('Should be invalid.', function () {
			expect(condition.test(1)).toBeFalsy();
			expect(condition.test('1')).toBeFalsy();
			expect(condition.test(-1)).toBeFalsy();
		});

	});

	describe('The max Condition.', function () {
		var c = {
			'name': 'max',
			'message': 'Error',
			'num': 10
		},
		e = {
			'name': 'max',
			'message': 'Error'
		},
		condition = new Condition(c);

		it('Error handling. It expected to throw.', function () {
			expect(function () {
				new Condition(e);
			}).toThrow();
		});

		it('Should be valid.', function () {
			expect(condition.test(5)).toBeTruthy();
			expect(condition.test('5')).toBeTruthy();
			expect(condition.test(-5)).toBeTruthy();
		});

		it('Should be invalid.', function () {
			expect(condition.test('11')).toBeFalsy();
			expect(condition.test(11)).toBeFalsy();
		});

	});

	describe('The price Condition.', function () {
		var c = {
			'name': 'price',
			'message': 'Error'
		},
		condition = new Condition(c);

		it('Should be valid.', function () {
			expect(condition.test(5)).toBeTruthy();
			expect(condition.test('5')).toBeTruthy();

			expect(condition.test(5.30)).toBeTruthy();
			expect(condition.test('5.30')).toBeTruthy();
			expect(condition.test('5,30')).toBeTruthy();
		});

		it('Should be invalid.', function () {
			expect(condition.test('aa.bb')).toBeFalsy();
			expect(condition.test('aa,bb')).toBeFalsy();

			expect(condition.test('10.b9')).toBeFalsy();
			expect(condition.test('10,b9')).toBeFalsy();

			expect(condition.test('1b.09')).toBeFalsy();
			expect(condition.test('1b,09')).toBeFalsy();

			expect(condition.test('$10,09')).toBeFalsy();
			expect(condition.test('$10.09')).toBeFalsy();

			expect(condition.test('10,09.-')).toBeFalsy();
			expect(condition.test('10.09.-')).toBeFalsy();
		});

	});

	describe('The required Condition.', function () {
		var c = {
			'name': 'required',
			'message': 'Error'
		},
		condition = new Condition(c);

		var inputFull = inputEmpty = document.createElement('INPUT');
			inputFull.setAttribute('type','text');
			inputFull.setAttribute('value','1');

		var inputEmpty = document.createElement('INPUT');
			inputEmpty.setAttribute('type','text');

		it('Should be valid.', function () {
			expect(condition.test(inputFull)).toBeTruthy();
		});

		it('Should be invalid.', function () {
			expect(condition.test(inputEmpty)).toBeFalsy();
		});

	});


	describe('The custom Condition.', function () {
		var c = {
			'name': 'custom',
			'message': 'Error',
			'fn': function (value) {
				return (value>=0)?true:false;
			}
		},
		e = {
			'name': 'custom',
			'message': 'Error'
		},
		condition = new Condition(c);

		it('Error handling. It expected to throw.', function () {
			expect(function () {
				new Condition(e);
			}).toThrow();
		});

		it('Should be valid.', function () {
			expect(condition.test(2)).toBeTruthy();
		});

		it('Should be invalid.', function () {
			expect(condition.test(-2)).toBeFalsy();
		});



	});



});