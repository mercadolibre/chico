var test = new ch.Expandable($('#demo')),
    current;

describe('Content', function () {

    it('should be defined as a function', function () {
        expect(ch.hasOwnProperty('Content')).toBeTruthy();
        expect(typeof ch.Content).toEqual('function');
    });

    it('should be into test component', function () {
        expect(test).toBeDefined();
        expect(test.hasOwnProperty('content')).toBeTruthy();
    });

     it('should return the current content', function () {
        current = test.content();
        expect(current).toEqual('Some text!');
    });

    describe('should set a new content', function () {

        it('like plain text', function () {
            test.content('Plain Text!');
            current = test.content();
            expect(current).toEqual('Plain Text!');
        });

        it('like jQuery/Zepto Selector', function () {
            test.content($('#invisible-content'));
            current = test.content();

            expect($(current)[0].nodeType).toEqual(1);
        });

    });
});

describe('If content is loaded async', function () {
    it('should load it successfully', function () {
        var waitEvent = jasmine.createSpy('waitEvent'),
            doneEvent = jasmine.createSpy('doneEvent');

        test.once('contentwaiting', function (event) {
            waitEvent();
            expect(waitEvent).toHaveBeenCalled();
        });

        test.once('contentdone', function (event) {
            expect(typeof event).toEqual('object');

            expect(typeof event.status).toEqual('string');
            expect(event.status).toEqual('done');

            expect(typeof event.response).toEqual('string');
            expect(event.response).toMatch(/This is an example for AJAX calls./);

            doneEvent();
        });

        test.content('http://localhost:3040/static/ajax.html');

        waitsFor(function() {
            return doneEvent.callCount > 0;
        });
    });

    it('should set "<p>Error on ajax call.</p>" when AJAX request fail', function () {
        var fail = jasmine.createSpy('fail');

        test.once('contenterror', function (event) {
            fail();

            expect(fail).toHaveBeenCalled();
            expect(typeof event).toEqual('object');

            expect(typeof event.status).toEqual('string');
            expect(event.status).toEqual('error');

            expect(typeof event.response).toEqual('string');
            expect(event.response).toMatch(/Error on ajax call./);

            expect(typeof event.data).toEqual('object');

        });

        test.content('http://localhost:3040/static/ajaxFail');

        waitsFor(function() {
            return fail.callCount > 0;
        });
    });

});

describe('Load content without cache', function () {
    it('should load on every show', function () {
        var doneCache = jasmine.createSpy('doneCache');

        test.on('contentdone', function () {
            doneCache();
        });

        test.content('http://localhost:3040/static/ajax.html', {'cache': false});

        waitsFor(function() {
            test.show().hide();

            return doneCache.callCount > 2;
        });
    });
});