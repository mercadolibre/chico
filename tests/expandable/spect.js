var expandable1 = $("#expandable-1").expandable(),
    showEvent = jasmine.createSpy('showEvent'),
    hideEvent = jasmine.createSpy('hideEvent'),
    readyEvent = jasmine.createSpy('readyEvent'),
    expandable2 = $("#expandable-2").expandable({
        'container': $('#container-2')
    }),
    expandable3 = $("#expandable-3").expandable({
        'shown': true,
        'toggle': false
    });

describe('Expandable', function () {
    expandable1
        .on('ready', function () { readyEvent(); })
        .on('show', function () { showEvent(); })
        .on('hide', function () { hideEvent(); });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Expandable')).toBeTruthy();
        expect(typeof ch.Expandable).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('expandable')).toBeTruthy();
        expect(typeof $.fn.expandable).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(expandable1 instanceof ch.Expandable).toBeTruthy();
    });

    it('should emit the "ready" event when it\'s created', function () {
        waits(50);
        runs(function () {
            expect(readyEvent).toHaveBeenCalled();
        });
    });
});

describe('It should have the following public properties:', function () {

    it('.el', function () {
        expect(expandable1.el).not.toEqual(undefined);
        expect(expandable1.el.nodeType).toEqual(1);
    });

    it('.$el', function () {
        expect(expandable1.$el).not.toEqual(undefined);
        expect(expandable1.$el instanceof $).toBeTruthy();
    });

    it('.name', function () {
        expect(expandable1.name).not.toEqual(undefined);
        expect(typeof expandable1.name).toEqual('string');
        expect(expandable1.name).toEqual('expandable');
    });

    it('.constructor', function () {
        expect(expandable1.constructor).not.toEqual(undefined);
        expect(typeof expandable1.constructor).toEqual('function');
    });

    it('.uid', function () {
        expect(expandable1.uid).not.toEqual(undefined);
        expect(typeof expandable1.uid).toEqual('number');
    });

});

describe('It should have the following public methods:', function () {
    var methods = ['init', 'destroy', 'show', 'hide', 'isShown', 'enable', 'disable'],
        i = 0,
        len = methods.length;

    for (i; i < len; i += 1) {
        (function (i){
            it('.' + methods[i] + '()', function () {
                expect(expandable1[methods[i]]).not.toEqual(undefined);
                expect(typeof expandable1[methods[i]]).toEqual('function');
            });
        }(i));
    }
});

describe('It should use the following abilities:', function () {
    it('EventEmitter', function () {
        expect(expandable1.on).not.toEqual(undefined);
        expect(typeof expandable1.on).toEqual('function');
    });

    it('Content', function () {
        expect(expandable1.content).not.toEqual(undefined);
        expect(typeof expandable1.content).toEqual('function');
    });

    it('Collapsible', function () {
        expect(expandable1._show).not.toEqual(undefined);
        expect(typeof expandable1._show).toEqual('function');
    });
});

describe('It should have a trigger and', function () {
    var $trigger = expandable1.$trigger;

    it('should exist', function () {
        expect($trigger).not.toEqual(undefined);
        expect($trigger[0].nodeType).toEqual(1);
        expect($trigger instanceof $).toBeTruthy();
    });

    it('should have the WAI-ARIA attribute "aria-controls"', function () {
       expect($trigger.attr('aria-controls')).toEqual(expandable1.$container[0].id);
    });

    describe('should have the following class names:', function () {

        it('.ch-expandable-trigger', function () {
            expect($trigger.hasClass('ch-expandable-trigger')).toBeTruthy();
        });

        it('.ch-expandable-ico', function () {
            expect($trigger.hasClass('ch-expandable-ico')).toBeTruthy();
        });

        it('.ch-user-no-select', function () {
            expect($trigger.hasClass('ch-user-no-select')).toBeTruthy();
        });
    });

});

describe('It should have a container and', function () {
    var $container = expandable1.$container;

    it('should exist', function () {
        expect($container).not.toEqual(undefined);
        expect($container[0].nodeType).toEqual(1);
        expect($container instanceof $).toBeTruthy();
    });

    it('shold be hidden', function () {
        expect($container.hasClass('ch-hide')).toBeTruthy();
    });

    it('should have the WAI-ARIA attribute "aria-expanded" in "false"', function () {
       expect($container.attr('aria-expanded')).toEqual('false');
    });

    describe('Should have the following class names:', function () {

        it('.ch-expandable-container', function () {
            expect($container.hasClass('ch-expandable-container')).toBeTruthy();
        });

    });
});

describe('Its show() method', function () {
    var $trigger = expandable1.$trigger,
        $container = expandable1.$container,
        show;

    it('should add "ch-expandable-trigger-on" class name to trigger', function () {
        expect($trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
        show = expandable1.show();
        expect($trigger.hasClass('ch-expandable-trigger-on')).toBeTruthy();
    });

    it('should remove "ch-hide" class name from container.', function () {
        expect($container.hasClass('ch-hide')).toBeFalsy();
    });

    it('should update the WAI-ARIA attribute "aria-expanded" to "true" on container', function () {
        expect($container.attr('aria-expanded')).toEqual('true');
    });

    it('should emit the "show" event', function () {
        expect(showEvent).toHaveBeenCalled();
    });

    describe('Public instance', function () {
        it('should return the same instance than initialized widget', function () {
            expect(show).toEqual(expandable1);
        });
    });
});

describe('Its hide() method', function () {
    var $trigger = expandable1.$trigger,
        $container = expandable1.$container,
        hide;

    it('should remove "ch-expandable-trigger-on" class name to trigger', function () {
        hide = expandable1.hide();
        expect($trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
    });

    it('should add "ch-hide" class name to container', function () {
        expect($container.hasClass('ch-hide')).toBeTruthy();
    });

    it('should update the WAI-ARIA attribute "aria-expanded" to "false" on container', function () {
        expect($container.attr('aria-expanded')).toEqual('false');
    });

    it('should emit the "hide" event', function () {
        expect(showEvent).toHaveBeenCalled();
    });

    describe('Public instance', function () {
        it('should return the same instance than initialized widget', function () {
            expect(hide).toEqual(expandable1);
        });
    });
});

describe('Its isShown() method', function () {
    var isShown;

    it('should return "true" when the widget is shown', function () {
        expandable1.show();
        isShown = expandable1.isShown();

        expect(typeof isShown).toEqual('boolean');
        expect(isShown).toBeTruthy();
    });

    it('should return "false" when the widget is hidden', function () {
        expandable1.hide();
        isShown = expandable1.isShown();

        expect(typeof isShown).toEqual('boolean');
        expect(isShown).toBeFalsy();
    });

    expandable1.hide();
});

describe('Its disable() method', function () {
    it('should prevent to show its container', function () {
        expandable1.disable();
        expandable1.show();
        expect(expandable1.$trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
    });
});

describe('Its enable() method', function () {
    it('should prevent to show its container', function () {
        expandable1.enable();
        expandable1.show();
        expect(expandable1.$trigger.hasClass('ch-expandable-trigger-on')).toBeTruthy();
    });
    expandable1.hide();
});

describe('Instance an Expandable configured', function () {

    it('with custom container', function () {
        var $container = expandable2.$container;
        expect($container).not.toEqual(undefined);
        expect($container[0].nodeType).toEqual(1);
        expect($container instanceof $).toBeTruthy();
        expect($container).toEqual($('#container-2'));
    });

    it('shown by default', function () {
        expect(expandable3.$trigger.hasClass('ch-expandable-trigger-on')).toBeTruthy();
    });

    it('without toggle', function () {
        expandable3.show();
        expect(expandable3.$trigger.hasClass('ch-expandable-trigger-on')).toBeTruthy();

        expandable3.hide();
        expect(expandable3.$trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
    });
});