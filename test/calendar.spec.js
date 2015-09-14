function addZero(num) {
    return (parseInt(num, 10) < 10) ? "0" + num : num;
}

describe('Calendar', function () {
    var calContainer = document.createElement('div');
    calContainer.innerHTML = '<div id="calendar-1"></div>';

    var calendar1,
        readyEvent = chai.spy(),
        selectEvent = chai.spy(),
        nextmonthEvent = chai.spy(),
        prevmonthEvent = chai.spy(),
        nextyearEvent = chai.spy(),
        prevyearEvent = chai.spy(),
        destroyEvent = chai.spy(),
        layoutChangeEvent = chai.spy(),
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


    before(function () {
        document.body.appendChild(calContainer);
        calendar1 = new ch.Calendar(document.querySelector('#calendar-1'));

        calendar1
            .on('ready', readyEvent)
            .on('select', selectEvent)
            .on('nextmonth', nextmonthEvent)
            .on('prevmonth', prevmonthEvent)
            .on('nextyear', nextyearEvent)
            .on('prevyear', prevyearEvent)
            .on('destroy', destroyEvent);

        tiny.on(document, ch.onlayoutchange, layoutChangeEvent);
    });

    after(function () {
        document.body.removeChild(calContainer);
    });

    it('should be defined on ch object', function () {
        expect(ch.Calendar).to.exist;
        expect(ch.Calendar).to.be.a('function');
    });

    it('should be return a new instance', function () {
        expect(calendar1).to.be.an.instanceof(ch.Calendar);
    });

    it('should emit the "ready" event when it\'s created', function (done) {
        setTimeout(function(){
            expect(readyEvent).to.have.been.called();
            done();
        },50);
    });

    describe('should use the following abilities:', function () {
        it('EventEmitter', function () {
            expect(calendar1.on).to.not.be.undefined;
            expect(calendar1.on).to.be.a('function');
        });
    });

    describe('It should have the following public properties:', function () {
        it('.$container', function () {
            expect(calendar1.container).to.not.be.undefined;
            expect(calendar1.container.nodeType).to.equal(1);
            expect(calendar1.container).to.be.an.instanceof(HTMLDivElement);
        });

        it('.name', function () {
            expect(calendar1.name).to.not.be.undefined;
            expect(calendar1.name).to.be.a('string');
            expect(calendar1.name).to.equal('calendar');
        });

        it('.constructor', function () {
            expect(calendar1.constructor).to.not.be.undefined;
            expect(calendar1.constructor).to.be.a('function');
        });

        it('.uid', function () {
            expect(calendar1.uid).to.not.be.undefined;
            expect(calendar1.uid).to.be.a('number');
        });
    });

    describe('It should have the following public methods:', function () {
        var methods = ['destroy', 'setFrom', 'setTo', 'nextMonth', 'nextYear', 'prevMonth', 'prevYear', 'select', 'getToday', 'enable', 'disable'],
            i = 0,
            len = methods.length;

        for (; i < len; i += 1) {
            (function (i){
                it('.' + methods[i] + '()', function () {
                    expect(calendar1[methods[i]]).to.not.be.undefined;
                    expect(calendar1[methods[i]]).to.be.a('function');
                });
            }(i));
        }
    });

    describe('It should have an element/container and', function () {
        var container,
            uid;

        before(function(){
            container = calendar1.container;
            uid = calendar1.uid;
        });

        describe('should have the following class names:', function () {

            it('.ch-calenaar', function () {
                expect(tiny.hasClass(container, 'ch-calendar')).to.be.true;
            });

            it('.ch-user-no-select', function () {
                expect(tiny.hasClass(container, 'ch-user-no-select')).to.be.true;
            });
        });

        describe('should have got a next button', function () {
            var month;

            before(function(){
                month = container.querySelectorAll('.ch-calendar-next');
            });

            it('it should have got the ".ch-calendar-next" class name', function () {
                expect(month.length).to.equal(1);
            });

            it('it should have got the WAI-ARIA" role "button"', function () {
                expect(month[0].getAttribute('role')).to.equal('button');
            });

            it('should have got the WAI-ARIA attribute "aria-hidden" in "false"', function () {
                expect(month[0].getAttribute('aria-hidden')).to.equal('false');
            });

            it('should have got the WAI-ARIA attribute "aria-controls" in "ch-calendar-grid-'+uid+'"', function () {
                expect(month[0].getAttribute('aria-controls')).to.equal('ch-calendar-grid-'+uid);
            });
        });

        describe('should have got a prev button', function () {
            var month;

            before(function(){
                month = container.querySelectorAll('.ch-calendar-prev');
            });

            it('it should have got the ".ch-calendar-prev" class name', function () {
                expect(month.length).to.equal(1);
            });

            it('it should have got the WAI-ARIA" role "button"', function () {
                expect(month[0].getAttribute('role')).to.equal('button');
            });

            it('it should have got the WAI-ARIA attribute "aria-hidden" in "false"', function () {
                expect(month[0].getAttribute('aria-hidden')).to.equal('false');
            });

            it('it should have got the WAI-ARIA attribute "aria-controls" in "ch-calendar-grid-'+uid+'"', function () {
                expect(month[0].getAttribute('aria-controls')).to.equal('ch-calendar-grid-'+uid);
            });
        });

        describe('should have got a calendar table', function () {
            var table;

            before(function(){
                table = container.querySelectorAll('.ch-calendar-month');
            })

            it('it should have got the ".ch-calendar-prev" class name', function () {
                expect(table.length).to.equal(1);
            });

            it('it should have got the WAI-ARIA" role "grid"', function () {
                expect(table[0].getAttribute('role')).to.equal('grid');
            });

            it('it should have got the weeks of the month', function () {
                var weeks = table[0].querySelectorAll('tbody tr');

                [].forEach.call(weeks, function(week){
                    expect(tiny.hasClass(week, 'ch-calendar-week')).to.be.true;
                });
            });

            it('it should have got the days', function () {
                var days = container.querySelectorAll('tbody td');

                Array.prototype.forEach.call(days, function(day, i){
                    var dayNum = parseInt(day.innerText);
                    if(!isNaN(dayNum) && (dayNum >= 1 || dayNum <= 31)) {
                        expect(tiny.hasClass(day, 'ch-calendar-day')).to.be.true;
                    }
                });

            });

            it('it should have got the day of today', function () {
                var date = new Date(),
                    todayElement = container.querySelectorAll('.ch-calendar-today');

                expect(todayElement.length).to.equal(1);
                expect(parseInt(todayElement[0].innerText)).to.equal(date.getDate());
            });

        });

    });

    describe('Its select() method', function () {
        it('should return "undefined" when it hasn\'t got a date selected', function () {
            expect(calendar1.select()).to.be.undefined;
        });

        it('should set a date as calendar.select(\'yyyy/mm/dd\')', function () {
            calendar1.select(DATE.FORMAT['yyyymmdd']);
            expect(calendar1.select()).to.equal(DATE.FORMAT['ddmmyyyy']);
        });

        it('should emit the "select" event', function () {
            calendar1.select('2012/05/28');
            expect(selectEvent).to.have.been.called();
        });
    });

    describe('Its nextMonth() method', function(){
        var instance;

        it('should show the next month', function () {
            var month = calendar1._dates.current.month,
                next;

            instance = calendar1.nextMonth();
            next = calendar1._dates.current.month;

            expect(month + 1).to.equal(next);
        });

        it('should emit the "nextmonth" event', function () {
            expect(nextmonthEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(calendar1);
        });
    });

    describe('Its prevMonth() method', function(){
        var instance;

        it('should show the previous month', function () {
            var month = calendar1._dates.current.month,
                prev;

            instance = calendar1.prevMonth();
            prev = calendar1._dates.current.month;

            expect(month - 1).to.equal(prev);
        });

        it('should emit the "prevmonth" event', function () {
            expect(prevmonthEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(calendar1);
        });
    });

    describe('Its nextYear() method', function(){
        var instance;

        it('should show the next year', function () {
            var current = calendar1._dates.current.year,
                next;

            instance = calendar1.nextYear();
            next = calendar1._dates.current.year;

            expect(current + 1).to.equal(next);
        });

        it('should emit the "nextyear" event', function () {
            expect(nextyearEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(calendar1);
        });
    });

    describe('Its prevYear() method', function(){
        var instance;

        it('should show the previous month', function () {
            var current = calendar1._dates.current.year,
                prev;

            instance = calendar1.prevYear();
            prev = calendar1._dates.current.year;

            expect(current - 1).to.equal(prev);
        });

        it('should emit the "prevyear" event', function () {
            expect(prevyearEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(calendar1);
        });
    });

    describe('Its setFrom() method', function () {
        var instance;

        it('should do dates unselectable with class "ch-calendar-disabled"', function () {

            calendar1.select('today');

            instance = calendar1.setFrom(DATE.FORMAT['yyyymmdd']);

            // This test fails because the is not refreshing the table after the from method is executed
            var days = calendar1.container.querySelectorAll('tbody td');

            [].forEach.call(days, function (day) {
                var dayNum = parseInt(day.innerText);

                if (dayNum < DATE.TODAY.day) {
                    expect(tiny.hasClass(day, 'ch-calendar-disabled')).to.be.true;
                }
            });
        });

        it('should remove the "from" date if receive \'auto\' as parameter', function () {
            calendar1.setFrom('auto');
            expect(calendar1._hasPrevMonth()).to.be.true;
        });

        it('should throw an error when date is set as a invalid format calendar.from(\'DD/MM/YYYY\').', function () {
            expect(function(){ calendar4.from('20/10/2012'); }).to.throw(Error);
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(calendar1);
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

            var days = calendar1.container.querySelectorAll('tbody td');

            [].forEach.call(days, function(day){
                var dayNum = parseInt(day.innerText);

                if (dayNum > DATE.TODAY.day) {
                    expect(tiny.hasClass(day, 'ch-calendar-disabled')).to.be.true;
                }
            });
        });

        it('should remove the "to" date if receive \'auto\' as parameter', function () {
            calendar1.setTo('auto');
            expect(calendar1._hasNextMonth()).to.be.true;
        });

        it('should throw an error when date is set as a invalid format calendar.to(\'DD/MM/YYYY\').', function () {
            expect(function(){ calendar4.to('25/10/2012'); }).to.throw(Error);
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(calendar1);
        });
    });

    describe('Its getToday() method', function(){
        it('should return the current date in the pre configured format DD/MM/YYYY or YYYY/MM/DD', function () {
            expect(calendar1.getToday()).to.equal(DATE.FORMAT.ddmmyyyy);
        });
    });

    describe('Its destroy() method', function () {

        it('should reset the container by the original snippet', function () {
            calendar1.destroy();
            expect(calendar1.container.parentNode === null).to.be.true;
        });

        it('should remove the instance from the element', function () {

            expect(ch.instances[calendar1.uid]).to.be.undefined;
        });

        it('should emit the "destroy" event', function () {
            expect(destroyEvent).to.have.been.called();
        });
    });
});
