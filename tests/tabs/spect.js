describe('Tabs', function () {
	var tabs1 = $("#tabs-1").tabs(),
		tabs2 = $("#tabs-2").tabs({'selected': 2}),
		$el = $(tabs1.element),
		$tabList = $el.children(':first-child'),
		$triggers = $tabList.children().children(),
		$tabsContent = $el.children(':last-child'),
		$contents = $tabsContent.children();

	it('Should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Tabs')).toBeTruthy();
		expect(typeof ch.Tabs).toEqual('function');
	});

	describe('Shold have the following public properties:', function () {

		it('.element', function () {
			expect(ch.util.hasOwn(tabs1, 'element')).toBeTruthy();
			expect(tabs1.element.nodeType).toEqual(1);
		});

		it('.children', function () {
			expect(ch.util.hasOwn(tabs1, 'children')).toBeTruthy();
			expect(ch.util.isArray(tabs1.children)).toBeTruthy();
		});

		it('.type / .name', function () {
			expect(ch.util.hasOwn(tabs1, 'type')).toBeTruthy();
			expect(typeof tabs1.type).toEqual('string');
			expect(tabs1.type).toEqual('tabs');
		});

		it('.constructor', function () {
			expect(ch.util.hasOwn(tabs1, 'constructor')).toBeTruthy();
			expect(typeof tabs1.constructor).toEqual('function');
		});

		it('.uid', function () {
			expect(typeof tabs1.uid).toEqual('number');
		});

	});

	describe('Shold have the following public methods:', function () {

		it('.select()', function () {
			expect(ch.util.hasOwn(tabs1, 'select')).toBeTruthy();
			expect(typeof tabs1.select).toEqual('function');
		});

		it('.off()', function () {
			expect(ch.util.hasOwn(tabs1, 'off')).toBeTruthy();
			expect(typeof tabs1.off).toEqual('function');
		});

		it('.on()', function () {
			expect(ch.util.hasOwn(tabs1, 'on')).toBeTruthy();
			expect(typeof tabs1.on).toEqual('function');
		});

		it('.once()', function () {
			expect(ch.util.hasOwn(tabs1, 'once')).toBeTruthy();
			expect(typeof tabs1.once).toEqual('function');
		});

		it('.trigger()', function () {
			expect(ch.util.hasOwn(tabs1, 'trigger')).toBeTruthy();
			expect(typeof tabs1.trigger).toEqual('function');
		});
	});

	describe('Shold have the following ID and Classnames:', function () {
		it('.ch-tabs', function () {
			expect($el.hasClass('ch-tabs')).toBeTruthy();
		});

		it('.ch-tabs-triggers', function () {
			expect($tabList.hasClass('ch-tabs-triggers')).toBeTruthy();
		});

		it('.ch-tab-trigger', function () {
			expect($triggers.hasClass('ch-tab-trigger')).toBeTruthy();
		});

		it('.ch-box-lite', function () {
			expect($tabsContent.hasClass('ch-box-lite')).toBeTruthy();
		});

		it('.ch-tabs-content', function () {
			expect($tabsContent.hasClass('ch-tabs-content')).toBeTruthy();
		});

		it('.ch-box-lite', function () {
			expect($tabsContent.hasClass('ch-box-lite')).toBeTruthy();
		});

		it('#tab1-a', function () {
			expect($contents.eq(0)[0].id).toEqual('tab1-a');
		});
	});

	describe('Shold have the following ARIA attributes:', function () {
		it('role="tablist"', function () {
			expect($tabList.attr('role')).toEqual('tablist');
		});

		it('role="tab"', function () {
			expect($triggers.attr('role')).toEqual('tab');
		});

		it('arial-controls="tab1-a"', function () {
			expect($triggers.eq(0).attr('arial-controls')).toEqual('tab1-a');
		});

		it('role="presentation"', function () {
			expect($tabsContent.attr('role')).toEqual('presentation');
		});

		it('role="tabpanel"', function () {
			expect($contents.attr('role')).toEqual('tabpanel');
		});

		it('aria-hidden="false"', function () {
			expect($contents.attr('aria-hidden')).toEqual('false');
		});
	});

	describe('By defult', function () {
		it('Should have open the first tab', function () {
			expect($triggers.eq(0).hasClass('ch-tab-trigger-on')).toBeTruthy();
		});

		it('Shouldn\'t set a hash on location', function () {
			expect(window.location.hash).toEqual('');
		});
	});

	describe('Public methods', function () {
		it('.select()', function () {
			// Getter
			var selected = tabs1.select();
			expect(selected).toEqual(1);

			// Setter
			tabs1.select(2);
			selected = tabs1.select();
			expect(selected).toEqual(2);
			expect(window.location.hash).toEqual('#!/tab2-a');
		});
	});

	// Bug: Instance configured as selected tab doesn't work if the locations has a hash.
	describe('Could be instanced with a configuration', function () {
		it('It has selected any tab by default', function () {
			var selected = tabs2.select();
			expect(selected).toEqual(2);
			expect(window.location.hash).toEqual('#!/tab2-b');
		});
	});

	describe('Will load its content by ajax', function () {
		var tabs3 = $("#tabs-3").tabs({
				'onContentLoad': function () {
					var selected = tabs3.select();
					if (selected === 2) {
						expect(ch.cache.map['http://ui.ml.com:3040/ajax#ajax']).toBeDefined();
						expect(selected).toEqual(2);
						expect(window.location.hash).toEqual('#!/ajax');
						done();
					}
				}
			}),
			done = jasmine.createSpy('done'),
			$ajaxContent = $(tabs3.element).children(':last-child').children(':last-child');

		it('Should create a container', function () {
			expect($ajaxContent.attr('id')).toEqual('ajax');
			expect($ajaxContent.hasClass('ch-hide')).toBeTruthy();
			expect($ajaxContent.html()).toEqual('');
		});

		it('and should have ARIA attributes', function () {
			expect($ajaxContent.attr('role')).toEqual('tabpanel');
			expect($ajaxContent.attr('aria-hidden')).toEqual('true');
		});

		it('Should load its content by ajax async', function () {
			tabs3.select(2);
			waitsFor(function() {
				return done.callCount > 0;
			});
		});
	});
});