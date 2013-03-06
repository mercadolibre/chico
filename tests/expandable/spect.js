describe('Expandable', function () {
    var expandable1 = $("#expandable-1").expandable(),
        expandable2 = $("#expandable-2").expandable(),
        expandable3 = $("#expandable-3").expandable({'open': true }),
        $el = $(expandable1.el),
        $trigger = $el.children(':first-child'),
        $container = $el.children(':last-child'),

        showCallback = jasmine.createSpy('showCallback'),
        showEvent = jasmine.createSpy('showEvent'),
        hideCallback = jasmine.createSpy('hideCallback'),
        hideEvent = jasmine.createSpy('hideEvent'),
        readyEvent = jasmine.createSpy('readyEvent'),

        expandable4 = $("#expandable-4").expandable({
            'onshow': function () { showCallback(); },
            'onhide': function () { hideCallback(); }
        });

    expandable4
        .on('ready', function () { readyEvent(); })
        .on('show', function () { showEvent(); })
        .on('hide', function () { hideEvent(); });

    it('Should be defined', function () {
        expect(ch.util.hasOwn(ch, 'Expandable')).toBeTruthy();
        expect(typeof ch.Expandable).toEqual('function');
        expect(expandable1 instanceof ch.Expandable).toBeTruthy();
    });

    describe('Shold have the following public properties:', function () {
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

        it('.el', function () {
            expect(ch.util.hasOwn(expandable1, 'el')).toBeTruthy();
            expect(expandable1.el.nodeType).toEqual(1);
        });

        it('.$el', function () {
            expect(ch.util.hasOwn(expandable1, '$el')).toBeTruthy();
            expect(expandable1.$el instanceof $).toBeTruthy();
        });

        it('.$trigger', function () {
            expect(ch.util.hasOwn(expandable1, '$trigger')).toBeTruthy();
            expect(expandable1.$trigger instanceof $).toBeTruthy();
        });


        it('.$container', function () {
            expect(ch.util.hasOwn(expandable1, '$el')).toBeTruthy();
            expect(expandable1.$el instanceof $).toBeTruthy();
        });

    });

    describe('Shold have the following private properties:', function () {
        it('._options', function () {
            expect(expandable1.name).not.toEqual(undefined);
            expect(typeof expandable1.name).toEqual('string');
            expect(expandable1.name).toEqual('expandable');
        });

        it('._snippet', function () {
            expect(expandable1.name).not.toEqual(undefined);
            expect(typeof expandable1.name).toEqual('string');
            expect(expandable1.name).toEqual('expandable');
        });

        it('._defaults', function () {
            expect(expandable1.name).not.toEqual(undefined);
            expect(typeof expandable1.name).toEqual('string');
            expect(expandable1.name).toEqual('expandable');
        });
    });

    describe('Shold have the following public methods:', function () {

        it('.hide()', function () {
            expect(expandable1.hide).not.toEqual(undefined);
            expect(typeof expandable1.hide).toEqual('function');
        });

        it('.isActive()', function () {
            expect(expandable1.isActive).not.toEqual(undefined);
            expect(typeof expandable1.isActive).toEqual('function');
        });

        it('.off()', function () {
            expect(expandable1.off).not.toEqual(undefined);
            expect(typeof expandable1.off).toEqual('function');
        });

        it('.on()', function () {
            expect(expandable1.on).not.toEqual(undefined);
            expect(typeof expandable1.on).toEqual('function');
        });

        it('.once()', function () {
            expect(expandable1.once).not.toEqual(undefined);
            expect(typeof expandable1.once).toEqual('function');
        });

        it('.show()', function () {
            expect(expandable1.show).not.toEqual(undefined);
            expect(typeof expandable1.show).toEqual('function');
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

    describe('Shold have the following ID and Classnames:', function () {

        it('#ch-expandable-1', function () {
            expect(expandable1.el.children[1].id).toBeTruthy();
        });

        it('.ch-expandable', function () {
            expect($el.hasClass('ch-expandable')).toBeTruthy();
        });

        it('.ch-expandable-trigger', function () {
            expect($trigger.hasClass('ch-expandable-trigger')).toBeTruthy();
        });

        it('.ch-user-no-select', function () {
            expect($trigger.hasClass('ch-user-no-select')).toBeTruthy();
        });

        it('.ch-expandable-ico', function () {
            expect($trigger.hasClass('ch-expandable-ico')).toBeTruthy();
        });

        it('.ch-expandable-container', function () {

            expect($container.hasClass('ch-expandable-container')).toBeTruthy();
        });

        it('.ch-hide', function () {
            expect($container.hasClass('ch-hide')).toBeTruthy();
        });
    });

    describe('Shold have the following ARIA attributes:', function () {
        it('aria-expanded="false"', function () {
            expect($trigger.attr('aria-expanded')).toEqual('false');
        });

        it('aria-hidden="true"', function () {
            expect($container.attr('aria-hidden')).toEqual('true');
        });
    });

    describe('By defult', function () {
        it('Shold have a icon', function () {
            expect($trigger.hasClass('ch-expandable-ico')).toBeTruthy();
        });

        it('Shold be closed', function () {
            expect($container.hasClass('ch-hide')).toBeTruthy();
        });
    });

    describe('Public methods', function () {
        it('.show()', function () {
            expect($trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
            var show = expandable1.show();
            expect($trigger.hasClass('ch-expandable-trigger-on')).toBeTruthy();
            expect($container.attr("aria-hidden")).toEqual("false");
            expect(show).toEqual(expandable1);
            // active
            expect(expandable1.isActive()).toBeTruthy();
            expect(expandable1._active).toBeTruthy();
        });

        it('.hide()', function () {
            var hide = expandable1.hide();
            expect($trigger.hasClass('ch-expandable-trigger-on')).toBeFalsy();
            expect($container.attr("aria-hidden")).toEqual("true");
            expect(hide).toEqual(expandable1);
            // active
            expect(expandable1.isActive()).toBeFalsy();
            expect(expandable1._active).toBeFalsy();
        });

        it('.isActive()', function () {
            var isActive = expandable1.isActive();
            expect(isActive).toBeFalsy();

            expandable1.show();
            isActive = expandable1.isActive();
            expect(isActive).toBeTruthy();

            expandable1.hide();
            isActive = expandable1.isActive();
            expect(isActive).toBeFalsy();
        });
    });

    describe('A instance configured open by default', function () {
        it('Should have the open classname', function () {
            expect($(expandable3.el).children(':first-child').hasClass('ch-expandable-trigger-on')).toBeTruthy();
            expect($(expandable3.el).children(':last-child').hasClass('ch-hide')).toBeFalsy();
        });
    });

    describe('Should execute the following callbacks:', function () {
        it('show', function () {
            expandable4.show();
            expect(showCallback).toHaveBeenCalled();
        });

        it('hide', function () {
            expandable4.hide();
            expect(hideCallback).toHaveBeenCalled();
        });
    });

    describe('Should execute the following events:', function () {

        it('ready', function () {
            waits(50);
            runs(function () {
                expect(readyEvent).toHaveBeenCalled();
            });
        });

        it('show', function () {
            expandable4.show();
            expect(showEvent).toHaveBeenCalled();
        });

        it('hide', function () {
            expandable4.hide();
            expect(hideEvent).toHaveBeenCalled();
        });
    });
});