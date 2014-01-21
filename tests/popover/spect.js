var beforeshowEvent = jasmine.createSpy('beforeshowEvent'),
    showEvent = jasmine.createSpy('showEvent'),
    beforehideEvent = jasmine.createSpy('beforehideEvent'),
    hideEvent = jasmine.createSpy('hideEvent'),
    readyEvent = jasmine.createSpy('readyEvent'),
    destroyEvent = jasmine.createSpy('destroyEvent'),
    popover1 = $('#popover1').popover()
        .on('beforeshow', function () { beforeshowEvent(); })
        .on('show', function () { showEvent(); })
        .on('beforehide', function () { beforehideEvent(); })
        .on('hide', function () { hideEvent(); })
        .on('ready', function () { readyEvent(); }),
    $trigger = popover1.$trigger,
    popover2 = $('#popover2').popover({
        'addClass': 'test',
        'closable': false,
        'shownby': 'pointerenter'
    }).on('destroy', function () { destroyEvent(); }),
    popover3 = $.popover();

describe('Popover', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Popover')).toBeTruthy();
        expect(typeof ch.Popover).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('popover')).toBeTruthy();
        expect(typeof $.fn.popover).toEqual('function');
    });

    it('should return a new instance', function () {
        expect(popover1 instanceof ch.Popover).toBeTruthy();
    });

    it('should emit the "ready" event when it\'s ready', function () {
        waits(50);
        runs(function () {
            expect(readyEvent).toHaveBeenCalled();
        });
    });

    describe('should use the following abilities:', function () {
        it('EventEmitter', function () {
            expect(popover1.on).not.toEqual(undefined);
            expect(typeof popover1.on).toEqual('function');
        });

        it('Content', function () {
            expect(popover1.content).not.toEqual(undefined);
            expect(typeof popover1.content).toEqual('function');
        });

        it('Collapsible', function () {
            expect(popover1._show).not.toEqual(undefined);
            expect(typeof popover1._show).toEqual('function');
        });
    });
});

describe('It should have the following public properties:', function () {

    it('.$trigger', function () {
        expect(popover1.$trigger).not.toEqual(undefined);
        expect(popover1.$trigger instanceof $).toBeTruthy();
    });

    it('.$container', function () {
        expect(popover1.$container).not.toEqual(undefined);
        expect(popover1.$container instanceof $).toBeTruthy();
    });

    it('.name', function () {
        expect(popover1.name).not.toEqual(undefined);
        expect(typeof popover1.name).toEqual('string');
        expect(popover1.name).toEqual('popover');
    });

    it('.constructor', function () {
        expect(popover1.constructor).not.toEqual(undefined);
        expect(typeof popover1.constructor).toEqual('function');
    });

    it('.uid', function () {
        expect(popover1.uid).not.toEqual(undefined);
        expect(typeof popover1.uid).toEqual('number');
    });
});

describe('It should have the following public methods:', function () {
    var methods = ['destroy', 'show', 'hide', 'isShown', 'enable', 'disable'],
        i = 0,
        len = methods.length;

    for (i; i < len; i += 1) {
        (function (i){
            it('.' + methods[i] + '()', function () {
                expect(popover1[methods[i]]).not.toEqual(undefined);
                expect(typeof popover1[methods[i]]).toEqual('function');
            });
        }(i));
    }
});

describe('It should have a trigger that', function () {

    it('should exist', function () {
        expect($trigger).not.toEqual(undefined);
        expect($trigger[0].nodeType).toEqual(1);
        expect($trigger instanceof $).toBeTruthy();
    });

    describe('should have the following WAI-ARIA roles and properties:', function () {

        it('aria-owns: the id of the popup element', function () {
            expect($trigger.attr('aria-owns')).toEqual('ch-popover-1');
        });

        it('haspopup: true', function () {
            expect($trigger.attr('aria-haspopup')).toEqual('true');
        });
    });
});


describe('Its show() method', function () {

    it('should add "ch-popover-trigger-on" class name to trigger', function () {

        expect($trigger.hasClass('ch-popover-trigger-on')).toBeFalsy();

        popover1.show();

        expect($trigger.hasClass('ch-popover-trigger-on')).toBeTruthy();

        popover1.hide();
    });

	describe('should create an element at the bottom of body that', function () {

		var $container = popover1.$container,
            $close = $container.children(':first');

		it('be the same than the $container property', function () {
            expect($(document.body).children().last().attr('id')).toEqual($container.attr('id'));
		});

		it('should have the same ID than the "aria-owns" attribute', function () {
			expect($container.attr('id')).toEqual($trigger.attr('aria-owns'));
		});

		it('should have the ARIA role "dialog"', function () {
			expect($container.attr('role')).toEqual('dialog');
		});

		it('should have the "ch-popover" classname', function () {
            expect($container.hasClass('ch-popover')).toBeTruthy();
		});

		it('should have a child with the "ch-popover-content" classname', function () {
			expect($container.children().eq(1).hasClass('ch-popover-content')).toBeTruthy();
		});

        describe('have a close button', function () {
            it('with the "ch-close" classname', function () {
                expect($close.hasClass('ch-close')).toBeTruthy();
            });

            it('with the role "button"', function () {
                expect($close.attr('role')).toEqual('button');
            });

            it('with the ARIA label "Close"', function () {
                expect($close.attr('aria-label')).toEqual('Close');
            });
        });
	});

    it('should emit the "beforeshow" and "show" events', function () {
        popover1.show();

        waits(500);

        runs(function () {
            expect(beforeshowEvent).toHaveBeenCalled();
            expect(showEvent).toHaveBeenCalled();
        });

        popover1.hide();
    });

    it('should return the same instance than initialized component', function () {
        expect(popover1.show()).toEqual(popover1);
    });
});

describe('Its hide() method', function () {

    it('should remove "ch-popover-trigger-on" class name to trigger', function () {
        popover1.show().hide();
        expect($trigger.hasClass('ch-popover-trigger-on')).toBeFalsy();
    });

	it('should delete the element at the bottom of body', function () {

		var flag = false;

		expect($(document.body).children().last().attr('id')).toEqual($trigger.attr('aria-owns'));

		popover1.hide();

		waits(500);

		runs(function () {
			expect($(document.body).children().last().attr('id')).not.toEqual($trigger.attr('aria-owns'));
		});
	});

    it('should emit the "beforehide" and "hide" events', function () {
        expect(beforehideEvent).toHaveBeenCalled();
        expect(hideEvent).toHaveBeenCalled();
    });

	it('should return the same instance than initialized component', function () {
		expect(popover1.hide()).toEqual(popover1);
	});
});

describe('Its isShown() method', function () {

    it('should return a boolean value', function () {
        expect(typeof popover1.isShown()).toEqual('boolean');
    });

    it('should return "true" when the component is shown', function () {
        expect(popover1.show().isShown()).toBeTruthy();
    });

    it('should return "false" when the component is hidden', function () {
        expect(popover1.hide().isShown()).toBeFalsy();
    });
});

describe('Its disable() method', function () {

    it('should return the same instance than initialized component', function () {
        expect(popover1.disable()).toEqual(popover1);
    });

    it('should prevent to show its container', function () {
        expect(popover1.disable().show().$trigger.hasClass('ch-popover-trigger-on')).toBeFalsy();
    });
});

describe('Its enable() method', function () {

    it('should return the same instance than initialized component', function () {
        expect(popover1.enable()).toEqual(popover1);
    });

    it('should allow to show its container', function () {
        expect(popover1.enable().show().$trigger.hasClass('ch-popover-trigger-on')).toBeTruthy();
    });
});

describe('Its width() method', function () {

	beforeEach(function () {
		popover1.show();
	});

	it('as a getter should return the width of the floated object', function () {
		expect(popover1.width()).toEqual(popover1.$container[0].style.width);
	});

	describe('as a setter', function () {

        it('should change the width of the floated object', function () {

    		var w = 123;

    		expect(popover1.width()).not.toEqual(w);

    		popover1.width(w);

            expect(popover1.width()).toEqual(w);
        });

        it('should return the same instance than initialized component', function () {
            expect(popover1.width(321)).toEqual(popover1);
        });
	});
});

describe('Its height() method', function () {

    beforeEach(function () {
        popover1.show();
    });

    it('as a getter should return the height of the floated object', function () {
        expect(popover1.height()).toEqual(popover1.$container[0].style.height);
    });

    describe('as a setter', function () {

        it('should change the height of the floated object', function () {

            var h = 55;

            expect(popover1.height()).not.toEqual(h);

            popover1.height(h);

            expect(popover1.height()).toEqual(h);
        });

        it('should return the same instance than initialized component', function () {
            expect(popover1.height(321)).toEqual(popover1);
        });
    });
});

describe('Instance a Popover configured', function () {

	it('with custom class names should contain the specified class names in its container', function () {
		expect(popover2.$container.hasClass('ch-popover')).toBeTruthy();
		expect(popover2.$container.hasClass('test')).toBeTruthy();
	});

	describe('with "shownby" preference:', function () {

        it('"pointertap" should give a pointer cursor to the trigger', function () {
            expect(popover1._$el.hasClass('ch-shownby-pointertap')).toBeTruthy();
            expect(popover1._$el.hasClass('ch-shownby-pointerenter')).toBeFalsy();
        });

        it('"pointerenter" should give a default cursor to the trigger', function () {
			expect(popover2._$el.hasClass('ch-shownby-pointerenter')).toBeTruthy();
            expect(popover2._$el.hasClass('ch-shownby-pointertap')).toBeFalsy();
		});
	});
});

describe('Instance a Popover without trigger', function () {

    it('should be defined on $ object', function () {
        expect($.hasOwnProperty('popover')).toBeTruthy();
        expect(typeof $.popover).toEqual('function');
    });

    it('should return a new instance', function () {
        expect(popover3 instanceof ch.Popover).toBeTruthy();
    });

    it('shouldn\'t have .$trigger', function () {
        expect(popover3.$trigger).toBeUndefined();
    });
});

describe('Its destroy() method', function () {

    beforeEach(function () {
        if (popover2) {
            popover2.destroy();
            popover2 = undefined;
        }
    });

    it('should reset the $trigger', function () {

        var $t = $('#popover2');

        expect($t.hasClass('ch-popover-trigger')).toBeFalsy();
        expect($t.attr('data-title')).toBeUndefined();
        expect($t.attr('aria-owns')).toBeUndefined();
        expect($t.attr('aria-haspopup')).toBeUndefined();
        expect($t.attr('data-side')).toBeUndefined();
        expect($t.attr('data-align')).toBeUndefined();
        expect($t.attr('role')).toBeUndefined();
    });

    it('should remove ".popover" events', function () {
        expect($._data($('#popover2')[0], 'events')).toBeUndefined();
    });

    it('should remove the instance from the element', function () {
        expect($('#popover2').data('popover')).toBeUndefined();
    });

    it('should emit the "destroy" event', function () {
        expect(destroyEvent).toHaveBeenCalled();
    });
});