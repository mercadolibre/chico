var menu1 = $("#menu-1").menu({'fx': false}),
    readyEvent = jasmine.createSpy('readyEvent'),
    showEvent = jasmine.createSpy('showEvent'),
    hideEvent = jasmine.createSpy('hideEvent'),
    destroyEvent = jasmine.createSpy('destroyEvent'),
    changeLayoutEvent = jasmine.createSpy('changeLayoutEvent'),
    $container = menu1.$container,
    $children = menu1.$container.children(),
    $expandable = menu1.fold[0],
    $bellows = menu1.$container.children(':last-child');

$(window.document).on(ch.onchangelayout, changeLayoutEvent);

describe('Menu', function () {
    menu1
        .on('ready', function () { readyEvent(); })
        .on('destroy', function () { destroyEvent(); });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Menu')).toBeTruthy();
        expect(typeof ch.Menu).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('menu')).toBeTruthy();
        expect(typeof $.fn.menu).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(menu1 instanceof ch.Menu).toBeTruthy();
    });

    it('should emit the "ready" event when it\'s created', function () {
        waits(50);
        runs(function () {
            expect(readyEvent).toHaveBeenCalled();
        });
    });

    it('should use the EventEmitter ability', function () {
        expect(menu1.on).not.toEqual(undefined);
        expect(typeof menu1.on).toEqual('function');
    });
});

describe('It should have the following public properties:', function () {

    it('.$container', function () {
        expect($container).not.toEqual(undefined);
        expect($container[0].nodeType).toEqual(1);
        expect($container instanceof $).toBeTruthy();
    });

    it('.name', function () {
        expect(menu1.name).not.toEqual(undefined);
        expect(typeof menu1.name).toEqual('string');
        expect(menu1.name).toEqual('menu');
    });

    it('.constructor', function () {
        expect(menu1.constructor).not.toEqual(undefined);
        expect(typeof menu1.constructor).toEqual('function');
    });

    it('.uid', function () {
        expect(menu1.uid).not.toEqual(undefined);
        expect(typeof menu1.uid).toEqual('number');
    });

});

describe('It should have the following public methods:', function () {
    var methods = ['init', 'destroy', 'show', 'hide', 'content', 'enable', 'disable'],
        i = 0,
        len = methods.length;

    for (i; i < len; i += 1) {
        (function (i){
            it('.' + methods[i] + '()', function () {
                expect(menu1[methods[i]]).not.toEqual(undefined);
                expect(typeof menu1[methods[i]]).toEqual('function');
            });
        }(i));
    }
});

describe('It should have a container and', function () {

    it('should have the ".ch-menu" class name', function () {
        expect($container.hasClass('ch-menu')).toBeTruthy();
    });

    it('should have the WAI-ARIA role "navigation"', function () {
       expect($container.attr('role')).toEqual('navigation');
    });
});

describe('It should have children and it', function () {

    it('have a "ch-menu-fold" class name', function () {
        expect($children.hasClass('ch-menu-fold')).toBeTruthy();
    });

    describe('should be Expandables and', function () {
        it('should exist', function () {
            expect($expandable instanceof ch.Expandable).toBeTruthy();
        });

        it('its container should have the WAI-ARIA role "menu"', function () {
            expect($children.children(':last-child').attr('role')).toEqual('menu');
        });

        it('the links insid its container should have the WAI-ARIA role "menuitem"', function () {
            expect($children.children(':last-child').children().children().attr('role')).toEqual('menuitem');
        });

    });

    it('should have the WAI-ARIA role "presentation" if it\'s not expandables', function () {
        expect($bellows.attr('role')).toEqual('presentation');
    });

});

describe('Its show() method', function () {
    var instance;

    menu1.on('show', function () { showEvent(); })

    it('should be call with parameters', function () {
        instance = menu1.show(1);
        expect($children.eq(0).children(':last-child').hasClass('ch-hide')).toBeFalsy();
    });

    it('should emit the "show" event', function () {
        expect(showEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized widget', function () {
        expect(instance).toEqual(menu1);
    });
});

describe('Its hide() method', function () {
    var instance;

    menu1.on('hide', function () { hideEvent(); })

    it('should be call with parameters', function () {
        instance = menu1.hide(1);
        expect($children.eq(0).children(':last-child').hasClass('ch-hide')).toBeTruthy();
    });

    it('should emit the "hide" event', function () {
        expect(hideEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized widget', function () {
        expect(instance).toEqual(menu1);
    });
});

describe('An instance by default', function () {
    it('should has its containers hidden', function () {
        expect($children.eq(0).children(':last-child').hasClass('ch-hide')).toBeTruthy();
    });
});

describe('Its destroy() method', function () {

    it('should reset the $container', function () {
        menu1.destroy();
        expect(menu1.$container.parent().length === 0).toBeTruthy();
    });

    it('should remove the instance from the element', function () {
        expect(menu1._$el.data('menu')).toBeUndefined();
    });

    it('should emit the "changeLayout" event', function () {
        expect(changeLayoutEvent).toHaveBeenCalled();
    });

    it('should emit the "destroy" event', function () {
        expect(destroyEvent).toHaveBeenCalled();
    });
});