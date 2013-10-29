function addZero(num) {
    return (parseInt(num, 10) < 10) ? "0" + num : num;
}

var calendar1 = $("#calendar-1").calendar(),
    readyEvent = jasmine.createSpy('readyEvent'),
    selectEvent = jasmine.createSpy('selectEvent'),
    nextmonthEvent = jasmine.createSpy('nextmonthEvent'),
    prevmonthEvent = jasmine.createSpy('prevmonthEvent'),
    nextyearEvent = jasmine.createSpy('nextYearEvent'),
    prevyearEvent = jasmine.createSpy('prevYearEvent'),
    destroyEvent = jasmine.createSpy('destroyEvent'),
    layoutChangeEvent = jasmine.createSpy('layoutChangeEvent'),
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

$(window.document).on(ch.onlayoutchange, layoutChangeEvent);

describe('Calendar', function () {
    calendar1
        .on('ready', function () { readyEvent(); })
        .on('select', function () { selectEvent(); })
        .on('nextmonth', function () { nextmonthEvent(); })
        .on('prevmonth', function () { prevmonthEvent(); })
        .on('nextyear', function () { nextyearEvent(); })
        .on('prevyear', function () { prevyearEvent(); })
        .on('destroy', function () { destroyEvent(); });

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Calendar')).toBeTruthy();
        expect(typeof ch.Calendar).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('calendar')).toBeTruthy();
        expect(typeof $.fn.calendar).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(calendar1 instanceof ch.Calendar).toBeTruthy();
    });

    it('should emit the "ready" event when it\'s created', function () {
        waits(50);
        runs(function () {
            expect(readyEvent).toHaveBeenCalled();
        });
    });

    describe('should use the following abilities:', function () {
        it('EventEmitter', function () {
            expect(calendar1.on).not.toEqual(undefined);
            expect(typeof calendar1.on).toEqual('function');
        });
    });
});

describe('It should have the following public properties:', function () {

    it('.$container', function () {
        expect(calendar1.$container).not.toEqual(undefined);
        expect(calendar1.$container[0].nodeType).toEqual(1);
        expect(calendar1.$container instanceof $).toBeTruthy();
    });

    it('.name', function () {
        expect(calendar1.name).not.toEqual(undefined);
        expect(typeof calendar1.name).toEqual('string');
        expect(calendar1.name).toEqual('calendar');
    });

    it('.constructor', function () {
        expect(calendar1.constructor).not.toEqual(undefined);
        expect(typeof calendar1.constructor).toEqual('function');
    });

    it('.uid', function () {
        expect(calendar1.uid).not.toEqual(undefined);
        expect(typeof calendar1.uid).toEqual('number');
    });

});

describe('It should have the following public methods:', function () {
    var methods = ['destroy', 'setFrom', 'setTo', 'nextMonth', 'nextYear', 'prevMonth', 'prevYear', 'select', 'getToday', 'enable', 'disable'],
        i = 0,
        len = methods.length;

    for (i; i < len; i += 1) {
        (function (i){
            it('.' + methods[i] + '()', function () {
                expect(calendar1[methods[i]]).not.toEqual(undefined);
                expect(typeof calendar1[methods[i]]).toEqual('function');
            });
        }(i));
    }
});

describe('It should have an element/container and', function () {
    var $container = calendar1.$container;

    describe('should have the following class names:', function () {

        it('.ch-calenaar', function () {
            expect($container.hasClass('ch-calendar')).toBeTruthy();
        });

        it('.ch-user-no-select', function () {
            expect($container.hasClass('ch-user-no-select')).toBeTruthy();
        });
    });

    describe('should have got a next button', function () {
        var $month = $container.find('.ch-calendar-next');

        it('it should have got the ".ch-calendar-next" class name', function () {
            expect($month.length).toEqual(1);
        });

        it('it should have got the WAI-ARIA" role "button"', function () {
            expect($month.attr('role')).toEqual('button');
        });

        it('should have got the WAI-ARIA attribute "aria-hidden" in "false"', function () {
           expect($month.attr('aria-hidden')).toEqual('false');
        });

        it('should have got the WAI-ARIA attribute "aria-controls" in "ch-calendar-grid-1"', function () {
           expect($month.attr('aria-controls')).toEqual('ch-calendar-grid-1');
        });
    });

    describe('should have got a prev button', function () {
        var $month = $container.find('.ch-calendar-prev');

        it('it should have got the ".ch-calendar-prev" class name', function () {
            expect($month.length).toEqual(1);
        });

        it('it should have got the WAI-ARIA" role "button"', function () {
            expect($month.attr('role')).toEqual('button');
        });

        it('it should have got the WAI-ARIA attribute "aria-hidden" in "false"', function () {
           expect($month.attr('aria-hidden')).toEqual('false');
        });

        it('it should have got the WAI-ARIA attribute "aria-controls" in "ch-calendar-grid-1"', function () {
           expect($month.attr('aria-controls')).toEqual('ch-calendar-grid-1');
        });
    });

    describe('should have got a calendar table', function () {

        var $table = $container.find('.ch-calendar-month');

        it('it should have got the ".ch-calendar-prev" class name', function () {
            expect($table.length).toEqual(1);
        });

        it('it should have got the WAI-ARIA" role "grid"', function () {
            expect($table.attr('role')).toEqual('grid');
        });

        it('it should have got the weeks of the month', function () {
            var weeks = $table.find('tbody tr');
            weeks.each(function(i, week){
                expect( $(week).hasClass('ch-calendar-week') ).toBeTruthy();
            });
        });

        it('it should have got the days', function () {
            var days = $container.find('tbody td');
            days.each(function(i, day){
                var $day = $(day);
                var dayNum = parseInt($day.text());
                if( !isNaN(dayNum) && (dayNum >= 1 || dayNum <= 31)) {
                    expect($day.hasClass('ch-calendar-day')).toBeTruthy();
                }
            });
        });

        it('it should have got the day of today', function () {
            var date = new Date(),
                $todayElement = $('.ch-calendar-today', $container);
            expect($todayElement.length ).toEqual(1);
            expect(parseInt($todayElement.text())).toEqual(date.getDate());
        });

    });

});

describe('Its select() method', function () {
    it('should return "undefined" when it hasn\'t got a date selected', function () {
        expect(calendar1.select()).not.toBeDefined();
    });

    it('should set a date as calendar.select(\'yyyy/mm/dd\')', function () {
        calendar1.select(DATE.FORMAT['yyyymmdd']);
        expect(calendar1.select()).toEqual(DATE.FORMAT['ddmmyyyy']);
    });

    it('should emit the "select" event', function () {
        calendar1.select('2012/05/28');
        expect(selectEvent).toHaveBeenCalled();
    });
});

describe('Its nextMonth() method', function(){
    var instance;

    it('should show the next month', function () {
        var month = calendar1._dates.current.month,
            next;

        instance = calendar1.nextMonth();
        next = calendar1._dates.current.month;

        expect(month + 1).toEqual(next);
    });

    it('should emit the "nextmonth" event', function () {
        expect(nextmonthEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(calendar1);
    });
});

describe('Its prevMonth() method', function(){
    var instance;

    it('should show the previous month', function () {
        var month = calendar1._dates.current.month,
            prev;

        instance = calendar1.prevMonth();
        prev = calendar1._dates.current.month;

        expect(month - 1).toEqual(prev);
    });

    it('should emit the "prevmonth" event', function () {
        expect(prevmonthEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(calendar1);
    });
});

describe('Its nextYear() method', function(){
    var instance;

    it('should show the next year', function () {
        var current = calendar1._dates.current.year,
            next;

        instance = calendar1.nextYear();
        next = calendar1._dates.current.year;

        expect(current + 1).toEqual(next);
    });

    it('should emit the "nextyear" event', function () {
        expect(nextyearEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(calendar1);
    });
});

describe('Its prevYear() method', function(){
    var instance;

    it('should show the previous month', function () {
        var current = calendar1._dates.current.year,
            prev;

        instance = calendar1.prevYear();
        prev = calendar1._dates.current.year;

        expect(current - 1).toEqual(prev);
    });

    it('should emit the "prevyear" event', function () {
        expect(prevyearEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(calendar1);
    });
});

describe('Its setFrom() method', function () {
    var instance;

    it('should do dates unselectable with class "ch-calendar-disabled"', function () {

        calendar1.select('today');

        instance = calendar1.setFrom(DATE.FORMAT['yyyymmdd']);

        // This test fails because the is not refreshing the table after the from method is executed
        var days = calendar1.$container.find('tbody td');

        days.each(function (i, day) {
            var $day = $(day),
                dayNum = parseInt($day.text());

            if (dayNum < DATE.TODAY.day) {
                expect($day.hasClass('ch-calendar-disabled')).toBeTruthy();
            }
        });
    });

    it('should remove the "from" date if receive \'auto\' as parameter', function () {
        calendar1.setFrom('auto');
        expect(calendar1._hasPrevMonth()).toBeTruthy();
    });

    it('should throw an error when date is set as a invalid format calendar.from(\'DD/MM/YYYY\').', function () {
        expect(function(){ calendar4.from('20/10/2012'); }).toThrow();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(calendar1);
    });
});

describe('Its setTo() method', function(){
    var instance;

    it('should do dates unselectable with class "ch-calendar-disabled".', function () {

        // select the day of tody today
        calendar1.select('today');

        instance = calendar1.setTo(DATE.TODAY.year + 1 + '/' + DATE.TODAY.month + '/' + DATE.TODAY.day);

        calendar1.nextYear();
        // This test fails because the is not refreshing the table after the to method is executed

        var days = calendar1.$container.find('tbody td');

        days.each(function(i, day){
            var $day = $(day),
                dayNum = parseInt($day.text());

            if (dayNum > DATE.TODAY.day) {
                expect($day.hasClass('ch-calendar-disabled')).toBeTruthy();
            }

        });
    });

    it('should remove the "to" date if receive \'auto\' as parameter', function () {
        calendar1.setTo('auto');
        expect(calendar1._hasNextMonth()).toBeTruthy();
    });

    it('should throw an error when date is set as a invalid format calendar.to(\'DD/MM/YYYY\').', function () {
        expect(function(){ calendar4.to('25/10/2012'); }).toThrow();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(calendar1);
    });
});

describe('Its getToday() method', function(){
    it('should return the current date in the pre configured format DD/MM/YYYY or YYYY/MM/DD', function () {
        expect(calendar1.getToday()).toEqual(DATE.FORMAT.ddmmyyyy);
    });
});

describe('Its destroy() method', function () {

    it('should reset the $container by the original snippet', function () {
        calendar1.destroy();
        expect(calendar1.$container.parent().length === 0).toBeTruthy();
    });

    it('should remove the instance from the element', function () {
        expect(calendar1._$el.data('calendar')).toBeUndefined();
    });

    it('should emit the "destroy" event', function () {
        expect(destroyEvent).toHaveBeenCalled();
    });
});