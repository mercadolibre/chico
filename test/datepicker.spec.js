describe('Datepicker', function () {
    function addZero(num) {
        return (parseInt(num, 10) < 10) ? "0" + num : num;
    }

    var container = document.createElement('div'),
        datepickerHtml = [
            '<form action="/mock/ajax.html" class="YOUR_SELECTOR_FormDatepicker ch-form">',
                '<p class="ch-form-row">',
                    '<label for="datepicker-1">Date: </label>',
                    '<input type="date" id="datepicker-1" placeholder="DD/MM/YYYY">',
                '</p>',
                '<p class="ch-form-row">',
                    '<label for="datepicker-2">Date:</label>',
                    '<input type="date" id="datepicker-2" placeholder="DD/MM/YYYY">',
                '</p>',
            '</form>'
        ].join(''),
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
        })(),
        datepicker1,
        datepicker2,
        readyEvent,
        showEvent,
        hideEvent,
        selectEvent,
        nextmonthEvent,
        prevmonthEvent,
        nextyearEvent,
        prevyearEvent,
        destroyEvent;

    before(function () {
        container.innerHTML = datepickerHtml;
        document.body.appendChild(container);

        datepicker1 = new ch.Datepicker(document.getElementById('datepicker-1'));
        datepicker2 = new ch.Datepicker(document.getElementById('datepicker-2'));
        readyEvent = chai.spy();
        showEvent = chai.spy();
        hideEvent = chai.spy();
        selectEvent = chai.spy();
        nextmonthEvent = chai.spy();
        prevmonthEvent = chai.spy();
        nextyearEvent = chai.spy();
        prevyearEvent = chai.spy();
        destroyEvent = chai.spy();

        datepicker1
            .on('ready', readyEvent)
            .on('show', showEvent)
            .on('hide', hideEvent)
            .on('select', selectEvent)
            .on('nextmonth', nextmonthEvent)
            .on('prevmonth', prevmonthEvent)
            .on('nextyear', nextyearEvent)
            .on('prevyear', prevyearEvent);
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Datepicker).to.exist;
        expect(ch.Datepicker).to.be.a('function');
    });

    it('should be return a new instance', function () {
        expect(datepicker1).to.be.an.instanceof(ch.Datepicker);
    });

    it('should emit the "ready" event when it\'s created', function (done) {
        setTimeout(function(){
            expect(readyEvent).to.have.been.called();
            done();
        },50);
    });

    describe('should use the following abilities:', function () {
        it('EventEmitter', function () {
            expect(datepicker1.on).to.exist;
            expect(datepicker1.on).to.be.a('function');
        });
    });

    describe('It should have the following public properties:', function () {
        it('.field', function () {
            expect(datepicker1.field).to.exist;
            expect(datepicker1.field.nodeType).to.equal(1);
        });

        it('.name', function () {
            expect(datepicker1.name).to.exist;
            expect(datepicker1.name).to.be.a('string');
            expect(datepicker1.name).to.equal('datepicker');
        });

        it('.constructor', function () {
            expect(datepicker1.constructor).to.exist;
            expect(datepicker1.constructor).to.be.a('function');
        });

        it('.uid', function () {
            expect(datepicker1.uid).to.exist;
            expect(datepicker1.uid).to.be.a('number');
        });
    });

    describe('It should have the following public methods:', function () {
        var methods = ['destroy', 'show', 'hide', 'pick', 'getToday', 'setFrom', 'setTo', 'nextMonth', 'nextYear', 'prevMonth', 'prevYear', 'select', 'reset', 'enable', 'disable'],
            i = 0,
            len = methods.length;

        for (i; i < len; i += 1) {
            (function (i){
                it('.' + methods[i] + '()', function () {
                    expect(datepicker1[methods[i]]).to.exist;
                    expect(datepicker1[methods[i]]).to.be.a('function');
                });
            }(i));
        }
    });

    describe('It should have a input field associated', function () {
        var field;

        before(function(){
            field = datepicker1.field;
        });

        it('its type attribute should be updated to "text"', function () {
            expect(field.type).to.equal('text');
        });

        it('should have got the WAI-ARIA attribute "aria-describedby"', function () {
            expect(field.getAttribute('aria-describedby')).to.match(/^ch-popover-/);
        });
    });

    describe('It should create a trigger and', function () {
        var trigger;

        before(function(){
            trigger = datepicker1.trigger;
        });

        it('should be defined', function () {
            expect(datepicker1.trigger).to.exist;
            expect(datepicker1.trigger.nodeType).to.equal(1);
            expect(datepicker1.trigger).to.be.an.instanceof(HTMLElement);
        });

        describe('should have the following class names:', function () {
            it('.ch-datepicker-trigger', function () {
                expect(tiny.hasClass(trigger, 'ch-datepicker-trigger')).to.be.true;
            });

            it('.ch-icon-calendar', function () {
                expect(tiny.hasClass(trigger, 'ch-icon-calendar')).to.be.true;
            });
        });
    });

    describe('Its show() method', function () {
        it('should show a calendar', function () {
            datepicker1.show();
            expect(datepicker1._popover.isShown()).to.be.true;
        });

        it('should emit the "show" event', function () {
            expect(showEvent).to.have.been.called();
        });
    });

    describe('Its hide() method', function () {
        it('should hide a calendar', function () {
            datepicker1.hide();
            expect(datepicker1._popover.isShown()).to.be.false;
        });

        it('should emit the "hide" event', function () {
            expect(hideEvent).to.have.been.called();
        });
    });

    describe('Its select() method', function () {
        it('should return "undefined" when it hasn\'t got a date selected', function () {
            expect(datepicker1.select()).to.be.undefined;
        });

        it('should set a date as calendar.select(\'yyyy/mm/dd\')', function () {
            datepicker1.select(DATE.FORMAT['yyyymmdd']);
            expect(datepicker1.select()).to.equal(DATE.FORMAT['ddmmyyyy']);
        });

        it('should emit the "select" event', function () {
            expect(selectEvent).to.have.been.called();
        });
    });

    describe('Its pick() method', function () {
        it('should emit the "select" event', function () {
            datepicker1.pick("24");
            expect(selectEvent).to.have.been.called();
        });
    });

    describe('Its nextMonth() method', function(){
        var instance;

        before(function() {
            instance = datepicker1.nextMonth();
        });

        it('should emit the "nextmonth" event', function () {
            expect(nextmonthEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(datepicker1);
        });
    });

    describe('Its prevMonth() method', function(){
        var instance;

        before(function() {
            instance = datepicker1.prevMonth();
        });

        it('should emit the "prevmonth" event', function () {
            expect(prevmonthEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(datepicker1);
        });
    });

    describe('Its nextYear() method', function(){
        var instance;

        before(function() {
            instance = datepicker1.nextYear();
        });

        it('should emit the "nextyear" event', function () {
            expect(nextyearEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(datepicker1);
        });
    });

    describe('Its prevYear() method', function(){
        var instance;

        before(function() {
            instance = datepicker1.prevYear();
        });

        it('should emit the "prevyear" event', function () {
            expect(prevyearEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(datepicker1);
        });
    });

    describe('Its setFrom() method', function () {
        it('should return the same instance than initialized component', function () {
            expect(datepicker1.setFrom(DATE.FORMAT['yyyymmdd'])).to.equal(datepicker1);
        });
    });

    describe('Its setTo() method', function(){
        it('should return the same instance than initialized component', function () {
            expect(datepicker1.setTo(DATE.TODAY.year + 1 + '/' + DATE.TODAY.month + '/' + DATE.TODAY.day)).to.equal(datepicker1);
        });
    });

    describe('Its getToday() method', function(){
        it('should return the current date in the pre configured format DD/MM/YYYY or YYYY/MM/DD', function () {
            expect(datepicker1.getToday()).to.equal(DATE.FORMAT.ddmmyyyy);
        });
    });

    describe('Its destroy() method', function () {
        before(function(){
            datepicker2.on('destroy', function () { destroyEvent(); });
            datepicker2.destroy();
        });

        // TODO: Review this behaviour in PhantomJS v2.x and IE, skipped for now
        it.skip('should update the field type attribute to "date"', function () {
            expect(document.getElementById('datepicker-2').type).to.equal('date');
        });

        it('should remove the ARIA label', function () {
            expect(document.getElementById('datepicker-2').getAttribute('aria-describedby')).to.be.null;
        });

        it('should remove the calendar icon', function () {
            expect(datepicker2.field.nextElementSibling).to.be.null;
        });

        it('should emit the "destroy" event', function () {
            expect(destroyEvent).to.have.been.called();
        });
    });

});
