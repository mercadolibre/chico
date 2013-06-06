var countdown = $('#input_user').countdown(),
    countdown2 = $('#input_location').countdown(10),
    readyEvent = jasmine.createSpy('readyEvent');

describe('Countdown', function () {
    countdown.once('ready', readyEvent);

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Countdown')).toBeTruthy();
        expect(typeof ch.Countdown).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('countdown')).toBeTruthy();
        expect(typeof $.fn.countdown).toEqual('function');
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

    it('.el', function () {
        expect(countdown.el).not.toEqual(undefined);
        expect(countdown.el.nodeType).toEqual(1);
    });

    it('.$el', function () {
        expect(countdown.$el).not.toEqual(undefined);
        expect(countdown.$el instanceof $).toBeTruthy();
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
    var methods = ['init', 'destroy', 'enable', 'disable'],
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

describe('It should create a message container', function () {
    var $message = $('.ch-form-hint').eq(0);

    it('should exists.', function () {
        expect($message).not.toEqual(undefined);
        expect($message[0].nodeType).toEqual(1);
    });

    it('should add "ch-form-hint" classname to the element', function () {
       expect($message.hasClass('ch-form-hint')).toBeTruthy();
    });

    it('should set this message by default: "500 characters left."', function () {
       expect($message.text()).toEqual('500 characters left.');
    });
});

describe('It should create a message container', function () {
    var $message = $('.ch-form-hint').eq(0);

    it('should exists.', function () {
        expect($message).not.toEqual(undefined);
        expect($message[0].nodeType).toEqual(1);
    });

    it('should add "ch-form-hint" classname to the element', function () {
       expect($message.hasClass('ch-form-hint')).toBeTruthy();
    });

    it('should set this message by default: "500 characters left."', function () {
       expect($message.text()).toEqual('500 characters left.');
    });
});

describe('It should update the number on the message', function () {
    var $message = $('.ch-form-hint').eq(1);

    it('if it exceeds the number should add errors classnames: "ch-countdown-exceeded" and "ch-validation-error"', function () {
        countdown2.$el.attr('value', '12345678901234567890').keyup();
        waits(50);
        runs(function(){
            expect($message.text()).toEqual('-10 characters left.');
            expect($message.hasClass('ch-countdown-exceeded')).toBeTruthy();
            expect(countdown2.$el.hasClass('ch-validation-error')).toBeTruthy();

        });
    });

    it('if doesn\'t exceed the number should update the number to 0', function () {
        countdown2.$el.attr('value', '1234567890').keyup();
        waits(50);
        runs(function(){
            expect($message.text()).toEqual('0 characters left.');
        });
    });

});