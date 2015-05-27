var countdown = new ch.Countdown(document.getElementById('input_user')),
    countdown2 = new ch.Countdown(document.getElementById('input_location'), {'max': 10}),
    readyEvent = jasmine.createSpy('readyEvent'),
    exceedEvent = jasmine.createSpy('exceedEvent'),
    destroyEvent = jasmine.createSpy('destroyEvent'),
    layoutChangeEvent = jasmine.createSpy('layoutChangeEvent');

ch.Event.addListener(document, ch.onlayoutchange, layoutChangeEvent);

describe('Countdown', function () {
    countdown
        .once('ready', readyEvent);

    countdown2
        .on('exceed', exceedEvent)
        .on('destroy', destroyEvent);

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Countdown')).toBeTruthy();
        expect(typeof ch.Countdown).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(countdown instanceof ch.Countdown).toBeTruthy();
    });

    it('should emit the "ready" event when it\'s created', function () {
        waits(50);
        runs(function () {
            expect(readyEvent).toHaveBeenCalled();
        });
    });
});

describe('It should have the following public properties:', function () {

    it('.trigger', function () {
        expect(countdown.trigger).not.toEqual(undefined);
        expect(countdown.trigger.nodeType).toEqual(1);
        expect(countdown.trigger instanceof HTMLElement).toBeTruthy();
    });

    it('.container', function () {
        expect(countdown.container).not.toEqual(undefined);
        expect(countdown.container.nodeType).toEqual(1);
        expect(countdown.container instanceof HTMLElement).toBeTruthy();
    });

    it('.name', function () {
        expect(countdown.name).not.toEqual(undefined);
        expect(typeof countdown.name).toEqual('string');
        expect(countdown.name).toEqual('countdown');
    });

    it('.constructor', function () {
        expect(countdown.constructor).not.toEqual(undefined);
        expect(typeof countdown.constructor).toEqual('function');
    });

    it('.uid', function () {
        expect(countdown.uid).not.toEqual(undefined);
        expect(typeof countdown.uid).toEqual('number');
    });

});

describe('It should have the following public methods:', function () {
    var methods = ['destroy', 'enable', 'disable'],
        i = 0,
        len = methods.length;

    for (i; i < len; i += 1) {
        (function (i){
            it('.' + methods[i] + '()', function () {
                expect(countdown[methods[i]]).not.toEqual(undefined);
                expect(typeof countdown[methods[i]]).toEqual('function');
            });
        }(i));
    }
});

describe('It should create a container', function () {
    var container = countdown.container;

    it('should exists.', function () {
        expect(container).not.toEqual(undefined);
        expect(container.nodeType).toEqual(1);
    });

    it('should add "ch-form-hint" classname to the element', function () {
       expect(ch.util.classList(container).contains('ch-form-hint')).toBeTruthy();
    });

    it('should set this message by default: "500 characters left."', function () {
       expect(container.innerText).toEqual('500 characters left.');
    });
});

describe('It should create a message container', function () {
    var container = countdown.container;

    it('should exists.', function () {
        expect(container).not.toEqual(undefined);
        expect(container.nodeType).toEqual(1);
    });

    it('should add "ch-form-hint" classname to the element', function () {
       expect(ch.util.classList(container).contains('ch-form-hint')).toBeTruthy();
    });

    it('should set this message by default: "500 characters left."', function () {
       expect(container.innerText).toEqual('500 characters left.');
    });
});

describe('It should update the number on the message', function () {
    var container = countdown2.container;

    it('if it exceeds the number should add errors classnames: "ch-countdown-exceeded" and "ch-validation-error"', function () {
        countdown2.trigger.setAttribute('value', '12345678901234567890');
        ch.Event.dispatchEvent(countdown2.trigger, 'keyup');

        waits(50);
        runs(function(){
            expect(container.innerText).toEqual('-10 characters left.');
            expect(ch.util.classList(container).contains('ch-countdown-exceeded')).toBeTruthy();
            expect(ch.util.classList(countdown2.trigger).contains('ch-validation-error')).toBeTruthy();
        });
    });

    it('and should emit the \'exceed\' event', function () {
        expect(exceedEvent).toHaveBeenCalled();
    });


    it('if doesn\'t exceed the number should update the number to 0', function () {
        countdown2.trigger.setAttribute('value', '1234567890');
        ch.Event.dispatchEvent(countdown2.trigger, 'keyup');

        waits(50);
        runs(function(){
            expect(container.innerText).toEqual('0 characters left.');
        });
    });

});

describe('Its destroy() method', function () {

    it('should remove the container', function () {
        countdown2.destroy();
        expect(countdown2.container.parentNode === null).toBeTruthy();
    });

    it('should remove ".countdown" instance', function () {
        expect(ch.instances[countdown2.uid]).toBeUndefined();
    });

    it('should emit the "layoutchange" event', function () {
        expect(layoutChangeEvent).toHaveBeenCalled();
    });

    it('should emit the "destroy" event', function () {
        expect(destroyEvent).toHaveBeenCalled();
    });
});