describe('Expandable', function () {
    var expandable1 = $("#expandable-1").expandable(),
        showEvent = jasmine.createSpy('showEvent'),
        hideEvent = jasmine.createSpy('hideEvent'),
        readyEvent = jasmine.createSpy('readyEvent'),
        expandable2 = $("#expandable-2").expandable({
            'container': $('#container-2')
        }),
        expandable3 = $("#expandable-3").expandable({
            'open': true,
            'toggle': false
        });

    expandable1
        .on('ready', function () { readyEvent(); })
        .on('show', function () { showEvent(); })
        .on('hide', function () { hideEvent(); });

    it('Should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Expandable')).toBeTruthy();
        expect(typeof ch.Expandable).toEqual('function');
    });

    it('Should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('expandable')).toBeTruthy();
        expect(typeof $.fn.expandable).toEqual('function');
    });

    it('Should be return a new instance', function () {
        expect(expandable1 instanceof ch.Expandable).toBeTruthy();
    });

    it('Should emit the "ready" event when it\'s ready', function () {
        waits(50);
        runs(function () {
            expect(readyEvent).toHaveBeenCalled();
        });
    });

    describe('Should have the following public properties:', function () {

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

    describe('Shold have the following public methods:', function () {

        it('.show()', function () {
            expect(expandable1.show).not.toEqual(undefined);
            expect(typeof expandable1.show).toEqual('function');
        });

        it('.hide()', function () {
            expect(expandable1.hide).not.toEqual(undefined);
            expect(typeof expandable1.hide).toEqual('function');
        });

        it('.isShow()', function () {
            expect(expandable1.isShown).not.toEqual(undefined);
            expect(typeof expandable1.isShown).toEqual('function');
        });

        it('.on()', function () {
            expect(expandable1.on).not.toEqual(undefined);
            expect(typeof expandable1.on).toEqual('function');
        });

        it('.once()', function () {
            expect(expandable1.once).not.toEqual(undefined);
            expect(typeof expandable1.once).toEqual('function');
        });

        it('.off()', function () {
            expect(expandable1.off).not.toEqual(undefined);
            expect(typeof expandable1.off).toEqual('function');
        });

        it('.emit()', function () {
            expect(expandable1.emit).not.toEqual(undefined);
            expect(typeof expandable1.emit).toEqual('function');
        });

        it('.content()', function () {
            expect(expandable1.content).not.toEqual(undefined);
            expect(typeof expandable1.content).toEqual('function');
        });
    });

    describe('Should have a trigger:', function () {
        var $trigger = expandable1.$trigger;

        it('It should exist.', function () {
            expect($trigger).not.toEqual(undefined);
            expect($trigger[0].nodeType).toEqual(1);
            expect($trigger instanceof $).toBeTruthy();
        });

        it('It should have the WAI-ARIA attribute "aria-controls"', function () {
           expect($trigger.attr('aria-controls')).toEqual(expandable1.$container[0].id);
        });

        describe('It should have the following class names:', function () {

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

    describe('Should have a container:', function () {
        var $container = expandable1.$container;

        it('It should exist.', function () {
            expect($container).not.toEqual(undefined);
            expect($container[0].nodeType).toEqual(1);
            expect($container instanceof $).toBeTruthy();
        });

        it('It shold be hidden.', function () {
            expect($container.hasClass('ch-hide')).toBeTruthy();
        });

        it('It should have the WAI-ARIA role "region".', function () {
           expect($container.attr('role')).toEqual('region');
        });

        it('It should have the WAI-ARIA attribute "aria-expanded" in "false"', function () {
           expect($container.attr('aria-expanded')).toEqual('false');
        });

        describe('It should have the following class names:', function () {

            it('.ch-expandable-container', function () {
                expect($container.hasClass('ch-expandable-container')).toBeTruthy();
            });

        });
    });

    describe('Show method', function () {
        var $trigger = expandable1.$trigger,
            $container = expandable1.$container,
            show;

        it('Should add "ch-expandable-trigger-on" class name to trigger', function () {
            expect($trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
            show = expandable1.show();
            expect($trigger.hasClass('ch-expandable-trigger-on')).toBeTruthy();
        });

        it('Should remove "ch-hide" class name from container.', function () {
            expect($container.hasClass('ch-hide')).toBeFalsy();
        });

        it('Should update the WAI-ARIA attribute "aria-expanded" to "true" on container', function () {
            expect($container.attr('aria-expanded')).toEqual('true');
        });

        it('Should emit the "show" event', function () {
            expect(showEvent).toHaveBeenCalled();
        });

        describe('Public instance', function () {
            it('Should return the same instance than initialized widget', function () {
                expect(show).toEqual(expandable1);
            });
        });
    });

    describe('Hide method', function () {
        var $trigger = expandable1.$trigger,
            $container = expandable1.$container,
            hide;

        it('Should remove "ch-expandable-trigger-on" class name to trigger', function () {
            hide = expandable1.hide();
            expect($trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
        });

        it('Should add "ch-hide" class name to container', function () {
            expect($container.hasClass('ch-hide')).toBeTruthy();
        });

        it('Should update the WAI-ARIA attribute "aria-expanded" to "false" on container', function () {
            expect($container.attr('aria-expanded')).toEqual('false');
        });

        it('Should emit the "hide" event', function () {
            expect(showEvent).toHaveBeenCalled();
        });

        describe('Public instance', function () {
            it('Should return the same instance than initialized widget', function () {
                expect(hide).toEqual(expandable1);
            });
        });
    });

    describe('isShown method', function () {
        var isShown;

        it('Should return "true" when the widget is shown', function () {
            expandable1.show();
            isShown = expandable1.isShown();

            expect(typeof isShown).toEqual('boolean');
            expect(isShown).not.toBeTruthy();
        });

        it('Should return "false" when the widget is hiden', function () {
            expandable1.hide();
            isShown = expandable1.isShown();

            expect(typeof isShown).toEqual('boolean');
            expect(isShown).toBeTruthy();
        });

        expandable1.hide();
    });

    describe('An instance configured', function () {
        var $container = expandable2.$container;

        it('with custom container', function () {
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
});