function addZero(num) {
    return (parseInt(num, 10) < 10) ? "0" + num : num;
}

var datepicker1 = $("#datepicker-1").datepicker(),
    datepicker2 = $("#datepicker-2").datepicker(),
    readyEvent = jasmine.createSpy('readyEvent'),
    showEvent = jasmine.createSpy('showEvent'),
    hideEvent = jasmine.createSpy('hideEvent'),
    selectEvent = jasmine.createSpy('selectEvent'),
    nextmonthEvent = jasmine.createSpy('nextmonthEvent'),
    prevmonthEvent = jasmine.createSpy('prevmonthEvent'),
    nextyearEvent = jasmine.createSpy('nextYearEvent'),
    prevyearEvent = jasmine.createSpy('prevYearEvent'),
    destroyEvent = jasmine.createSpy('destroyEvent'),
    DATE = (function(){
        var date = new Date(),
            TODAY =  {
                'day': addZero(date.getDate()),
                'month': addZero((date.getMonth() + 1)),
                'year': date.getFullYear()
            },
            FORMAT = {
                'ddmmyyyy': [TODAY.day, TODAY.month, TODAY.year].join('/'),
                'yyyymmdd': [TODAY.year, TODAY.month, TODAY.day].join('/')
            };
        return {
            'TODAY': TODAY,
            'FORMAT': FORMAT
        }
    })();

describe('Datepicker', function () {
    datepicker1
        .on('ready', function () { readyEvent(); })
        .on('show', function () { showEvent(); })
        .on('hide', function () { hideEvent(); })
        .on('select', function () { selectEvent(); })
        .on('nextmonth', function () { nextmonthEvent(); })
        .on('prevmonth', function () { prevmonthEvent(); })
        .on('nextyear', function () { nextyearEvent(); })
        .on('prevyear', function () { prevyearEvent(); });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Datepicker')).toBeTruthy();
        expect(typeof ch.Datepicker).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('datepicker')).toBeTruthy();
        expect(typeof $.fn.datepicker).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(datepicker1 instanceof ch.Datepicker).toBeTruthy();
    });

    it('should emit the "ready" event when it\'s created', function () {
        waits(50);
        runs(function () {
            expect(readyEvent).toHaveBeenCalled();
        });
    });

    describe('should use the following abilities:', function () {
        it('EventEmitter', function () {
            expect(datepicker1.on).not.toEqual(undefined);
            expect(typeof datepicker1.on).toEqual('function');
        });
    });
});

describe('It should have the following public properties:', function () {

    it('.field', function () {
        expect(datepicker1.field).not.toEqual(undefined);
        expect(datepicker1.field.nodeType).toEqual(1);
    });

    it('.name', function () {
        expect(datepicker1.name).not.toEqual(undefined);
        expect(typeof datepicker1.name).toEqual('string');
        expect(datepicker1.name).toEqual('datepicker');
    });

    it('.constructor', function () {
        expect(datepicker1.constructor).not.toEqual(undefined);
        expect(typeof datepicker1.constructor).toEqual('function');
    });

    it('.uid', function () {
        expect(datepicker1.uid).not.toEqual(undefined);
        expect(typeof datepicker1.uid).toEqual('number');
    });

});

describe('It should have the following public methods:', function () {
    var methods = ['destroy', 'show', 'hide', 'pick', 'getToday', 'setFrom', 'setTo', 'nextMonth', 'nextYear', 'prevMonth', 'prevYear', 'select', 'reset', 'enable', 'disable'],
        i = 0,
        len = methods.length;

    for (i; i < len; i += 1) {
        (function (i){
            it('.' + methods[i] + '()', function () {
                expect(datepicker1[methods[i]]).not.toEqual(undefined);
                expect(typeof datepicker1[methods[i]]).toEqual('function');
            });
        }(i));
    }
});

describe('It should have a input field associated', function () {
    var field = datepicker1.field;

    it('its type attribute should be updated to "text"', function () {
        expect(field.type).toEqual('text');
    });

     it('should have got the WAI-ARIA attribute "aria-describedby"', function () {
        expect(field.getAttribute('aria-describedby')).toEqual('ch-popover-3');
    });
});

describe('It should create a trigger and', function () {
    var $trigger = datepicker1.$trigger;

    it('should be defined', function () {
        expect(datepicker1.$trigger).not.toEqual(undefined);
        expect(datepicker1.$trigger[0].nodeType).toEqual(1);
        expect(datepicker1.$trigger instanceof $).toBeTruthy();
    });

    describe('should have the following class names:', function () {

        it('.ch-datepicker-trigger', function () {
            expect($trigger.hasClass('ch-datepicker-trigger')).toBeTruthy();
        });

        it('.ch-icon-calendar', function () {
            expect($trigger.hasClass('ch-icon-calendar')).toBeTruthy();
        });
    });
});

describe('Its show() method', function () {
    it('should show a calendar', function () {
        datepicker1.show();
        expect(datepicker1._popover.isShown()).toBeTruthy();
    });

    it('should emit the "show" event', function () {
        expect(showEvent).toHaveBeenCalled();
    });
});

describe('Its hide() method', function () {
    it('should hide a calendar', function () {
        datepicker1.hide();
        expect(datepicker1._popover.isShown()).toBeFalsy();
    });

    it('should emit the "hide" event', function () {
        expect(hideEvent).toHaveBeenCalled();
    });
});

describe('Its select() method', function () {
    it('should return "undefined" when it hasn\'t got a date selected', function () {
        expect(datepicker1.select()).not.toBeDefined();
    });

    it('should set a date as calendar.select(\'yyyy/mm/dd\')', function () {
        datepicker1.select(DATE.FORMAT['yyyymmdd']);
        expect(datepicker1.select()).toEqual(DATE.FORMAT['ddmmyyyy']);
    });

    it('should emit the "select" event', function () {
        expect(selectEvent).toHaveBeenCalled();
    });
});

describe('Its pick() method', function () {

    it('should emit the "select" event', function () {
        datepicker1.pick("24");
        expect(selectEvent).toHaveBeenCalled();
    });
});

describe('Its nextMonth() method', function(){
    var instance = datepicker1.nextMonth();

    it('should emit the "nextmonth" event', function () {
        expect(nextmonthEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(datepicker1);
    });
});

describe('Its prevMonth() method', function(){
    var instance = datepicker1.prevMonth();

    it('should emit the "prevmonth" event', function () {
        expect(prevmonthEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(datepicker1);
    });
});

describe('Its nextYear() method', function(){
    var instance = datepicker1.nextYear();

    it('should emit the "nextyear" event', function () {
        expect(nextyearEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(datepicker1);
    });
});

describe('Its prevYear() method', function(){
    var instance = datepicker1.prevYear();

    it('should emit the "prevyear" event', function () {
        expect(prevyearEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(datepicker1);
    });
});

describe('Its setFrom() method', function () {
    it('should return the same instance than initialized component', function () {
        expect(datepicker1.setFrom(DATE.FORMAT['yyyymmdd'])).toEqual(datepicker1);
    });
});

describe('Its setTo() method', function(){
    it('should return the same instance than initialized component', function () {
        expect(datepicker1.setTo(DATE.TODAY.year + 1 + '/' + DATE.TODAY.month + '/' + DATE.TODAY.day)).toEqual(datepicker1);
    });
});

describe('Its getToday() method', function(){
    it('should return the current date in the pre configured format DD/MM/YYYY or YYYY/MM/DD', function () {
        expect(datepicker1.getToday()).toEqual(DATE.FORMAT.ddmmyyyy);
    });
});

describe('Its destroy() method', function () {

    datepicker2.on('destroy', function () { destroyEvent(); });
    datepicker2.destroy();

    it('should update the field type attribute to "date"', function () {
        expect($('#datepicker-2')[0].type).toEqual('date');
    });

    it('should remove the calendar icon', function () {
        expect($('#datepicker-2 + i').length).toEqual(0);
    });

    it('should emit the "destroy" event', function () {
        expect(destroyEvent).toHaveBeenCalled();
    });
});