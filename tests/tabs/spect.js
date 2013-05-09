var tabs1 = $('#tabs-1').tabs(),
    readyEvent = jasmine.createSpy('readyEvent'),
    showEvent = jasmine.createSpy('showEvent');

describe('Tabs', function () {
    tabs1.on('ready', function () { readyEvent(); });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Tabs')).toBeTruthy();
        expect(typeof ch.Tabs).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('tabs')).toBeTruthy();
        expect(typeof $.fn.tabs).toEqual('function');
    });

    it('should emit the "ready" event when it\'s created', function () {
        waits(50);
        runs(function () {
            expect(readyEvent).toHaveBeenCalled();
        });
    });

    it('with an ajax tab should create a tabpanel', function () {
        expect($('#ajax', tabs1.$container)[0].nodeType).toEqual(1);
    });
});

describe('It should have the following public properties:', function () {

    it('.el', function () {
        expect(tabs1.el).not.toEqual(undefined);
        expect(tabs1.el.nodeType).toEqual(1);
    });

    it('.$el', function () {
        expect(tabs1.$el).not.toEqual(undefined);
        expect(tabs1.$el instanceof $).toBeTruthy();
    });

    it('.name', function () {
        expect(tabs1.name).not.toEqual(undefined);
        expect(typeof tabs1.name).toEqual('string');
        expect(tabs1.name).toEqual('tabs');
    });

    it('.constructor', function () {
        expect(tabs1.constructor).not.toEqual(undefined);
        expect(typeof tabs1.constructor).toEqual('function');
    });

    it('.uid', function () {
        expect(tabs1.uid).not.toEqual(undefined);
        expect(typeof tabs1.uid).toEqual('number');
    });
});

describe('It should have the following public methods:', function () {
    var methods = ['init', 'destroy', 'show', 'getShown', 'enable', 'disable'],
        i = 0,
        len = methods.length;

    for (i; i < len; i += 1) {
        (function (i){
            it('.' + methods[i] + '()', function () {
                expect(tabs1[methods[i]]).not.toEqual(undefined);
                expect(typeof tabs1[methods[i]]).toEqual('function');
            });
        }(i));
    }
});

describe('It should have a wrapper and', function () {
    var $el = tabs1.$el;

    it('should exist', function () {
        expect($el).not.toEqual(undefined);
        expect($el[0].nodeType).toEqual(1);
        expect($el instanceof $).toBeTruthy();
    });

    it('should have the ".ch-tabs" class name', function () {
        expect($el.hasClass('ch-tabs')).toBeTruthy();
    });

});

describe('It should have a list of triggers and', function () {
    var $triggers = tabs1.$triggers,
        $trigger = $triggers.children(':first-child').children();

    it('should exist', function () {
        expect($triggers).not.toEqual(undefined);
        expect($triggers[0].nodeType).toEqual(1);
        expect($triggers instanceof $).toBeTruthy();
    });

    it('should have the WAI-ARIA role "tablist"', function () {
       expect($triggers.attr('role')).toEqual('tablist');
    });

    it('should have the "ch-tabs-triggers" class name', function () {
        expect($triggers.hasClass('ch-tabs-triggers')).toBeTruthy();
    });

    describe('its trigger', function () {
        it('should exist', function () {
            expect($trigger).not.toEqual(undefined);
            expect($trigger[0].nodeType).toEqual(1);
            expect($trigger instanceof $).toBeTruthy();
        });

        it('should have the WAI-ARIA role "tab"', function () {
            expect($trigger.attr('role')).toEqual('tab');
        });

        describe('should have the following class name:', function () {
            it('.ch-tab', function () {
                expect($trigger.hasClass('ch-tab')).toBeTruthy();
            });

            it('.ch-user-no-select', function () {
                expect($trigger.hasClass('ch-user-no-select')).toBeTruthy();
            });
        });
    });

});

describe('It should have a list of panels and', function () {
    var $container = tabs1.$container,
        $tabpanel = tabs1.$container.children(':first-child');

    it('should exist', function () {
        expect($container).not.toEqual(undefined);
        expect($container[0].nodeType).toEqual(1);
        expect($container instanceof $).toBeTruthy();
    });

    it('should have the WAI-ARIA role "presentation"', function () {
       expect($container.attr('role')).toEqual('presentation');
    });

    it('should have the "ch-tabs-container" class name', function () {
        expect($container.hasClass('ch-tabs-container')).toBeTruthy();
    });

    describe('its tabpanel', function () {

        it('should exist', function () {
            expect($tabpanel).not.toEqual(undefined);
            expect($tabpanel[0].nodeType).toEqual(1);
            expect($tabpanel instanceof $).toBeTruthy();
        });

        it('should have the WAI-ARIA role "tabpanel"', function () {
            expect($tabpanel.attr('role')).toEqual('tabpanel');
        });

        it('should have the "ch-tabpanel" class name', function () {
            expect($tabpanel.hasClass('ch-tabpanel')).toBeTruthy();
        });
    });

});

describe('Its show() method', function () {
    tabs1.on('show', function () { showEvent(); });
    tabs1.show(2);

    it('should set a hash on window location', function () {
        expect(window.location.hash).not.toEqual('');
    });

    it('should emit the "show" event', function () {
        expect(showEvent).toHaveBeenCalled();
    });
});

describe('Its getShown() method', function () {
    it('should return a number of current shown tab', function () {
        tabs1.show(1);
        expect(tabs1.getShown()).toEqual(jasmine.any(Number));
        expect(tabs1.getShown()).toEqual(1);
    });
});