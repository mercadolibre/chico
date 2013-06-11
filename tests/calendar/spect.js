function addZero(num) {
    return (parseInt(num, 10) < 10) ? "0" + num : num;
}

var calendar1 = $("#calendar-1").calendar(),
    showEvent = jasmine.createSpy('showEvent'),
    hideEvent = jasmine.createSpy('hideEvent'),
    readyEvent = jasmine.createSpy('readyEvent'),
    selectEvent = jasmine.createSpy('selectEvent'),
    nextEvent = jasmine.createSpy('nextEvent'),
    prevEvent = jasmine.createSpy('prevEvent'),
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

describe('Calendar', function () {
    calendar1
        .on('ready', function () { readyEvent(); })
        .on('select', function () { selectEvent(); });

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

    it('.el', function () {
        expect(calendar1.el).not.toEqual(undefined);
        expect(calendar1.el.nodeType).toEqual(1);
    });

    it('.$el', function () {
        expect(calendar1.$el).not.toEqual(undefined);
        expect(calendar1.$el instanceof $).toBeTruthy();
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
    var methods = ['init', 'destroy', 'from', 'to', 'next', 'prev', 'select', 'today', 'enable', 'disable'],
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
    var $el = calendar1.$el;

    it('should exist', function () {
        expect($el).not.toEqual(undefined);
        expect($el[0].nodeType).toEqual(1);
        expect($el instanceof $).toBeTruthy();
    });

    describe('should have the following class names:', function () {

        it('.ch-calenaar', function () {
            expect($el.hasClass('ch-calendar')).toBeTruthy();
        });

        it('.ch-user-no-select', function () {
            expect($el.hasClass('ch-user-no-select')).toBeTruthy();
        });
    });

    describe('should have got a next button', function () {
        var $month = $el.find('.ch-calendar-next');

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
        var $month = $el.find('.ch-calendar-prev');

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

        var $table = $el.find('.ch-calendar-month');

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
            var days = $el.find('tbody td');
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
                $todayElement = $('.ch-calendar-today', $el);
            expect($todayElement.length ).toEqual(1);
            expect(parseInt($todayElement.text())).toEqual(date.getDate());
        });

    });

});

describe('Its select() method', function () {

    it('should emit the "select" event', function () {
        calendar1.select();
        expect(selectEvent).toHaveBeenCalled();
    });

    it('should return "undefined" when it hasn\'t got a date selected', function () {
        expect(calendar1.select()).not.toBeDefined();
    });

    it('should set a date as calendar.select(\'2013/01/07\')', function () {
        calendar1.select(DATE.FORMAT['yyyymmdd']);
        expect(calendar1.select()).toEqual(DATE.FORMAT['ddmmyyyy']);
    });
});

describe('Its next() method', function(){
    var current = calendar1.$el.find('caption').text(),
        next;

    it('should show the next month', function () {
        calendar1.next('month');

        next = calendar1.$el.find('caption').text();
        expect(current).not.toEqual(next);
    });

    it('should show the next year', function () {

        calendar1.next('year');

        next = calendar1.$el.find('caption').text();
        expect(current).not.toEqual(next);
    });
});

describe('Its prev() method', function(){
    var current = calendar1.$el.find('caption').text(),
        prev;

    it('should show the previous month', function () {
        calendar1.prev('month');

        prev = calendar1.$el.find('caption').text();
        expect(current).not.toEqual(prev);
    });

    it('should show the previous year', function () {
        calendar1.prev('year');

        prev = calendar1.$el.find('caption').text();
        expect(current).toEqual(prev);
    });
});

describe('Its from() method', function () {
    it('should do dates unselectable with class "ch-calendar-disabled"', function () {
        calendar1.select('today');
        calendar1.from(DATE.FORMAT['yyyymmdd']);
        // This test fails because the is not refreshing the table after the from method is executed

        var days = calendar1.$el.find('tbody td');

        days.each(function (i, day) {
            var $day = $(day),
                dayNum = parseInt($day.text());

            if (dayNum < DATE.TODAY.day) {
                expect($day.hasClass('ch-calendar-disabled')).toBeTruthy();
            }
        });
    });

    it('should throw an error when date is set as a invalid format calendar.from(\'22/10/2012\').', function () {
        expect(function(){ calendar4.from('20/10/2012'); }).toThrow();
    });
});

describe('Its to() method', function(){
    it('should do dates unselectable with class "ch-calendar-disabled".', function () {

        // select the day of tody today
        calendar1.select('today');

        calendar1.to(DATE.TODAY.year + 1 + '/' + DATE.TODAY.month + '/' + DATE.TODAY.day);
        calendar1.next('year');
        // This test fails because the is not refreshing the table after the to method is executed

        var days = calendar1.$el.find('tbody td');

        days.each(function(i, day){
            var $day = $(day),
                dayNum = parseInt($day.text());

            if (dayNum > DATE.TODAY.day) {
                expect($day.hasClass('ch-calendar-disabled')).toBeTruthy();
            }

        });
    });

    it('should throw an error when date is set as a invalid format calendar.to(\'22/10/2012\').', function () {
        expect(function(){ calendar4.to('25/10/2012'); }).toThrow();
    });
});

describe('Its today() method', function(){
    it('should return the current date in the pre configured format DD/MM/YYYY or YYYY/MM/DD', function () {
        expect(calendar1.today()).toEqual(DATE.FORMAT.ddmmyyyy);
    });
});