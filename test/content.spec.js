describe('Content', function () {
    var container = document.createElement('div'),
        contentHtml = [
            '<h1 id="demo">Content</h1>',
            '<div>Some text!</div>',
            '<div id="invisible-content" class="ch-hide">',
            '<h2>This content is invisible</h2>',
            '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet purus in sapien luctus sodales. Curabitur dui velit, cursus in sagittis aliquam, dictum at neque. Ut gravida scelerisque lorem non pulvinar. Pellentesque et urna vitae nisl porta imperdiet sed nec ipsum. Sed non sem velit. Cras id consectetur tellus.</p>',
            '</div>'
        ].join(''),
        test,
        current;

    before(function() {
        container.innerHTML = contentHtml;
        document.body.appendChild(container);
        test = new ch.Expandable(document.getElementById('demo'));
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined as a function', function () {
        expect(ch.Content).to.exist;
        expect(ch.Content).to.be.a('function');
    });

    it('should be into test component', function () {
        expect(test).to.not.be.undefined;
        expect(test.content).to.not.be.undefined;
    });

    it('should return the current content', function () {
        current = test.content();
        expect(current).to.equal('Some text!');
    });

    describe('should set a new content', function () {

        it('like plain text', function () {
            test.content('Plain Text!');
            current = test.content();
            expect(current).to.equal('Plain Text!');
        });

        it('like DOM Element', function () {
            var element = document.getElementById('invisible-content');
            test.content(element);
            current = test.content();

            expect(current).to.equal(element.outerHTML);
        });

    });

    describe('If content is loaded async', function () {
        it('should load it successfully', function (done) {
            function doneCallback(event) {
                expect(event).to.be.a('object');

                expect(event.status).to.be.a('string');
                expect(event.status).to.equal('done');

                expect(event.response).to.be.a('string');
                expect(event.response).to.match(/This is an example for AJAX calls./);

                expect(waitEvent).to.have.been.called();

                done();
            }

            var waitEvent = chai.spy(),
                doneEvent = chai.spy(doneCallback);

            test.once('contentwaiting', waitEvent);
            test.once('contentdone', doneEvent);

            test.content('http://localhost:9876/mock/ajax.html');
        });

        it('should set "<p>Error on ajax call.</p>" when AJAX request fail', function (done) {
            function failCallback(event) {
                expect(fail).to.have.been.called();
                expect(event).to.be.a('object');

                expect(event.status).to.be.a('string');
                expect(event.status).to.equal('error');

                expect(event.response).to.be.a('string');
                expect(event.response).to.match(/Error on ajax call/);

                expect(event.data).to.not.be.undefined;

                done();
            }
            var fail = chai.spy(failCallback);

            test.once('contenterror', fail);
            test.content('http://localhost:9876/mock/ajaxFail.html');
        });
    });

    describe('Load content without cache', function () {
        it('should load on every show', function (done) {
            function doneCallback(event) {
                expect(doneEvent).to.have.been.called();
                expect(event).to.be.an('object');

                done();
            }
            var doneEvent = chai.spy(doneCallback);

            test.on('contentdone', doneEvent);

            test.content('http://localhost:9876/mock/ajax.html', {'cache': false});
        });
    });

});
