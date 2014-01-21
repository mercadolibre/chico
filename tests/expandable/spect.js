var expandable1 = $("#expandable-1").expandable(),
    beforeshowEvent = jasmine.createSpy('beforeshowEvent'),
    showEvent = jasmine.createSpy('showEvent'),
    beforehideEvent = jasmine.createSpy('beforehideEvent'),
    hideEvent = jasmine.createSpy('hideEvent'),
    readyEvent = jasmine.createSpy('readyEvent'),
    destroyEvent = jasmine.createSpy('destroyEvent'),
    layoutChangeEvent = jasmine.createSpy('layoutChangeEvent'),
    expandable2 = $("#expandable-2").expandable({
        'container': $('#container-2')
    }),
    expandable3 = $("#expandable-3").expandable({
            'toggle': false
        })
        .on('destroy', destroyEvent);

$(window.document).on(ch.onlayoutchange, layoutChangeEvent);

describe('Expandable', function () {
    expandable1
        .on('ready', function () { readyEvent(); })
        .on('beforeshow', function () { beforeshowEvent(); })
        .on('show', function () { showEvent(); })
        .on('beforehide', function () { beforehideEvent(); })
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

    describe('should use the following abilities:', function () {
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
});

describe('It should have the following public properties:', function () {

    it('.$trigger', function () {
        expect(expandable1.$trigger).not.toEqual(undefined);
        expect(expandable1.$trigger[0].nodeType).toEqual(1);
        expect(expandable1.$trigger instanceof $).toBeTruthy();
    });

    it('.$container', function () {
        expect(expandable1.$container).not.toEqual(undefined);
        expect(expandable1.$container[0].nodeType).toEqual(1);
        expect(expandable1.$container instanceof $).toBeTruthy();
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
    var methods = ['destroy', 'show', 'hide', 'isShown', 'enable', 'disable'],
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

describe('It should have a trigger and', function () {
    var $trigger = expandable1.$trigger;

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
        instance;

    it('should add "ch-expandable-trigger-on" class name to trigger', function () {
        expect($trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
        instance = expandable1.show();
        expect($trigger.hasClass('ch-expandable-trigger-on')).toBeTruthy();
    });

    it('should remove "ch-hide" class name from container.', function () {
        expect($container.hasClass('ch-hide')).toBeFalsy();
    });

    it('should update the WAI-ARIA attribute "aria-expanded" to "true" on container', function () {
        expect($container.attr('aria-expanded')).toEqual('true');
    });

    it('should emit the "beforeshow" and "show" events', function () {
        // expect(beforeshowEvent).toHaveBeenCalled();
        expect(showEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(expandable1);
    });
});

describe('Its hide() method', function () {
    var $trigger = expandable1.$trigger,
        $container = expandable1.$container,
        instance;

    it('should remove "ch-expandable-trigger-on" class name to trigger', function () {
        instance = expandable1.hide();
        expect($trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
    });

    it('should add "ch-hide" class name to container', function () {
        expect($container.hasClass('ch-hide')).toBeTruthy();
    });

    it('should update the WAI-ARIA attribute "aria-expanded" to "false" on container', function () {
        expect($container.attr('aria-expanded')).toEqual('false');
    });

    it('should emit the "beforehide" and "hide" events', function () {
        expect(beforehideEvent).toHaveBeenCalled();
        expect(hideEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(expandable1);
    });
});

describe('Its isShown() method', function () {
    var isShown;

    it('should return "true" when the component is shown', function () {
        expandable1.show();
        isShown = expandable1.isShown();

        expect(typeof isShown).toEqual('boolean');
        expect(isShown).toBeTruthy();
    });

    it('should return "false" when the component is hidden', function () {
        expandable1.hide();
        isShown = expandable1.isShown();

        expect(typeof isShown).toEqual('boolean');
        expect(isShown).toBeFalsy();
    });

    expandable1.hide();
});

describe('Its disable() method', function () {
    var instance;

    it('should prevent to show its container', function () {
        instance = expandable1.disable();
        expandable1.show();
        expect(expandable1.$trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(expandable1);
    });
});

describe('Its enable() method', function () {
    var instance;

    it('should prevent to show its container', function () {
        instance = expandable1.enable();
        expandable1.show();
        expect(expandable1.$trigger.hasClass('ch-expandable-trigger-on')).toBeTruthy();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(expandable1);
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

    it('without toggle', function () {
        expandable3.show();
        expect(expandable3.$trigger.hasClass('ch-expandable-trigger-on')).toBeTruthy();

        expandable3.hide();
        expect(expandable3.$trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
    });
});

describe('Its destroy() method', function () {

    it('should reset the $trigger', function () {
        expandable3.destroy();
        expect(expandable3.$trigger.hasClass('ch-expandable-trigger ch-expandable-ico ch-user-no-select')).toBeFalsy();
        expect(expandable3.$trigger.attr('aria-controls')).toBeUndefined();
    });

    it('should reset the $container', function () {
        expect(expandable3.$container.hasClass('ch-expandable-container')).toBeFalsy();
        expect(expandable3.$container.attr('aria-expanded')).toBeUndefined();
        expect(expandable3.$container.attr('aria-hidden')).toBeUndefined();
    });

    it('should remove ".expandable" events', function () {
        expect($._data(expandable3.$trigger[0], 'events')).toBeUndefined();
    });

    it('should remove the instance from the element', function () {
        expect(expandable3._$el.data('expandable')).toBeUndefined();
    });

    it('should emit the "layoutchange" event', function () {
        expect(layoutChangeEvent).toHaveBeenCalled();
    });

    it('should emit the "destroy" event', function () {
        expect(destroyEvent).toHaveBeenCalled();
    });
});