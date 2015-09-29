describe('Expandable', function () {
    var container = document.createElement('div'),
        expandableHtml = [
            '<h4 id="expandable-1">Lorem ipsum dolor sit amet.</h4>',
            '<div id="container-1">',
                '<p>ipsum dolor sit amet, consectetur adipiscing elit. Duis nec ipsum tellus, quis ultricies nunc. Vestibulum ornare porta nunc, vitae tincidunt massa ornare vel. Nam ut felis odio.</p>',
            '</div>',
            '<h4 id="expandable-2">Lorem ipsum dolor sit amet.</h4>',
            '<div><p>ipsum dolor sit amet, consectetur adipiscing elit. Duis nec ipsum tellus, quis ultricies nunc. Vestibulum ornare porta nunc, vitae tincidunt massa ornare vel. Nam ut felis odio.</p></div>',
            '<div id="container-2">',
                '<p>ipsum dolor sit amet, consectetur adipiscing elit. Duis nec ipsum tellus, quis ultricies nunc. Vestibulum ornare porta nunc, vitae tincidunt massa ornare vel. Nam ut felis odio.</p>',
            '</div>',

            '<h4 id="expandable-3">Lorem ipsum dolor sit amet.</h4>',
            '<div id="container-3">',
                '<p>ipsum dolor sit amet, consectetur adipiscing elit. Duis nec ipsum tellus, quis ultricies nunc. Vestibulum ornare porta nunc, vitae tincidunt massa ornare vel. Nam ut felis odio.</p>',
            '</div>'
        ].join(''),
        expandable1,
        expandable2,
        expandable3,
        beforeshowEvent,
        showEvent,
        beforehideEvent,
        hideEvent,
        readyEvent,
        destroyEvent,
        layoutChangeEvent;

    before(function () {
        container.innerHTML = expandableHtml;
        document.body.appendChild(container);

        beforeshowEvent = chai.spy();
        showEvent = chai.spy();
        beforehideEvent = chai.spy();
        hideEvent = chai.spy();
        readyEvent = chai.spy();
        destroyEvent = chai.spy();
        layoutChangeEvent = chai.spy();

        expandable1 = new ch.Expandable(document.getElementById('expandable-1'));
        expandable2 = new ch.Expandable(document.getElementById('expandable-2'), {
            'container': document.getElementById('container-2')
        });
        expandable3 = new ch.Expandable(document.getElementById('expandable-3'), {
            'toggle': false
        }).on('destroy', destroyEvent);

        expandable1
            .on('ready', readyEvent)
            .on('beforeshow', beforeshowEvent)
            .on('show', showEvent)
            .on('beforehide', beforehideEvent)
            .on('hide', hideEvent);

        tiny.on(document, ch.onlayoutchange, layoutChangeEvent);
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Expandable).to.exist;
        expect(ch.Expandable).to.be.a('function');
    });

    it('should be return a new instance', function () {
        expect(expandable1).to.be.an.instanceof(ch.Expandable);
    });

    it('should emit the "ready" event when it\'s created', function (done) {
        setTimeout(function(){
            expect(readyEvent).to.have.been.called();
            done();
        }, 50);
    });

    describe('should use the following abilities:', function () {
        it('EventEmitter', function () {
            expect(expandable1.on).to.exist;
            expect(expandable1.on).to.be.a('function');
        });

        it('Content', function () {
            expect(expandable1.content).to.exist;
            expect(expandable1.content).to.be.a('function');
        });

        it('Collapsible', function () {
            expect(expandable1._show).to.exist;
            expect(expandable1._show).to.be.a('function');
        });
    });


    describe('It should have the following public properties:', function () {

        it('.trigger', function () {
            expect(expandable1.trigger).to.exist;
            expect(expandable1.trigger.nodeType).to.equal(1);
            expect(expandable1.trigger).to.be.an.instanceof(HTMLElement);
        });

        it('.container', function () {
            expect(expandable1.container).to.exist;
            expect(expandable1.container.nodeType).to.equal(1);
            expect(expandable1.container).to.be.an.instanceof(HTMLElement);
        });

        it('.name', function () {
            expect(expandable1.name).to.exist;
            expect(expandable1.name).to.be.a('string');
            expect(expandable1.name).to.equal('expandable');
        });

        it('.constructor', function () {
            expect(expandable1.constructor).to.exist;
            expect(expandable1.constructor).to.be.a('function');
        });

        it('.uid', function () {
            expect(expandable1.uid).to.exist;
            expect(expandable1.uid).to.be.a('number');
        });

    });

    describe('It should have the following public methods:', function () {
        var methods = ['destroy', 'show', 'hide', 'isShown', 'enable', 'disable'],
            i = 0,
            len = methods.length;

        for (i; i < len; i += 1) {
            (function (i){
                it('.' + methods[i] + '()', function () {
                    expect(expandable1[methods[i]]).to.exist;
                    expect(expandable1[methods[i]]).to.be.a('function');
                });
            }(i));
        }
    });

    describe('It should have a trigger and', function () {
        var trigger;

        before(function(){
            trigger = expandable1.trigger;
        });

        it('should have the WAI-ARIA attribute "aria-controls"', function () {
            expect(trigger.getAttribute('aria-controls')).to.equal(expandable1.container.getAttribute('id'));
        });

        describe('should have the following class names:', function () {
            it('.ch-expandable-trigger', function () {
                expect(tiny.hasClass(trigger, 'ch-expandable-trigger')).to.be.true;
            });

            it('.ch-expandable-ico', function () {
                expect(tiny.hasClass(trigger, 'ch-expandable-ico')).to.be.true;
            });

            it('.ch-user-no-select', function () {
                expect(tiny.hasClass(trigger, 'ch-user-no-select')).to.be.true;
            });
        });

    });

    describe('It should have a container and', function () {
        var container;

        before(function(){
            container = expandable1.container;
        });

        it('shold be hidden', function () {
            expect(tiny.hasClass(container, 'ch-hide')).to.be.true;
        });

        it('should have the WAI-ARIA attribute "aria-expanded" in "false"', function () {
            expect(container.getAttribute('aria-expanded')).to.equal('false');
        });

        describe('Should have the following class names:', function () {

            it('.ch-expandable-container', function () {
                expect(tiny.hasClass(container, 'ch-expandable-container')).to.be.true;
            });

        });
    });

    describe('Its show() method', function () {
        var trigger,
            container,
            instance;

        before(function(){
            trigger = expandable1.trigger;
            container = expandable1.container;
        });

        it('should add "ch-expandable-trigger-on" class name to trigger', function () {
            expect(tiny.hasClass(trigger, 'ch-expandable-trigger-on')).to.be.false;
            instance = expandable1.show();
            expect(tiny.hasClass(trigger, 'ch-expandable-trigger-on')).to.be.true;
        });

        it('should remove "ch-hide" class name from container.', function () {
            expect(tiny.hasClass(container, 'ch-hide')).to.be.false;
        });

        it('should update the WAI-ARIA attribute "aria-expanded" to "true" on container', function () {
            expect(container.getAttribute('aria-expanded')).to.equal('true');
        });

        it('should emit the "beforeshow" and "show" events', function () {
            // expect(beforeshowEvent).to.have.been.called();
            expect(showEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(expandable1);
        });
    });

    describe('Its hide() method', function () {
        var trigger,
            container,
            instance;

        before(function(){
            trigger = expandable1.trigger;
            container = expandable1.container;
        });

        it('should remove "ch-expandable-trigger-on" class name to trigger', function () {
            instance = expandable1.hide();
            expect(tiny.hasClass(trigger, 'ch-expandable-trigger-on')).to.be.false;
        });

        it('should add "ch-hide" class name to container', function () {
            expect(tiny.hasClass(container, 'ch-hide')).to.be.true;
        });

        it('should update the WAI-ARIA attribute "aria-expanded" to "false" on container', function () {
            expect(container.getAttribute('aria-expanded')).to.equal('false');
        });

        it('should emit the "beforehide" and "hide" events', function () {
            expect(beforehideEvent).to.have.been.called();
            expect(hideEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(expandable1);
        });
    });

    describe('Its isShown() method', function () {
        var isShown;

        after(function(){
            expandable1.hide();
        });

        it('should return "true" when the component is shown', function () {
            expandable1.show();
            isShown = expandable1.isShown();

            expect(isShown).to.be.a('boolean');
            expect(isShown).to.be.true;
        });

        it('should return "false" when the component is hidden', function () {
            expandable1.hide();
            isShown = expandable1.isShown();

            expect(isShown).to.be.a('boolean');
            expect(isShown).to.be.false;
        });
    });

    describe('Its disable() method', function () {
        var instance;

        it('should prevent to show its container', function () {
            instance = expandable1.disable();
            expandable1.show();
            expect(tiny.hasClass(expandable1.trigger, 'ch-expandable-trigger-on')).to.be.false;
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(expandable1);
        });
    });

    describe('Its enable() method', function () {
        var instance;

        after(function(){
            expandable1.hide();
        });

        it('should prevent to show its container', function () {
            instance = expandable1.enable();
            expandable1.show();
            expect(tiny.hasClass(expandable1.trigger, 'ch-expandable-trigger-on')).to.be.true;
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(expandable1);
        });
    });

    describe('Instance an Expandable configured', function () {

        it('with custom container', function () {
            var container = expandable2.container;
            expect(container).to.exist;
            expect(container.nodeType).to.equal(1);
            expect(container).to.be.an.instanceof(HTMLElement);
            expect(container).to.equal(document.getElementById('container-2'));
        });

        it('without toggle', function () {
            expandable3.show();
            expect(tiny.hasClass(expandable3.trigger, 'ch-expandable-trigger-on')).to.be.true;

            expandable3.hide();
            expect(tiny.hasClass(expandable3.trigger, 'ch-expandable-trigger-on')).to.be.false;
        });
    });

    describe('Its destroy() method', function () {
        it('should reset the trigger', function () {
            expandable3.destroy();
            expect(tiny.hasClass(expandable3.trigger, 'ch-expandable-trigger')).to.be.false;
            expect(tiny.hasClass(expandable3.trigger, 'ch-user-no-select')).to.be.false;
            expect(tiny.hasClass(expandable3.trigger, 'ch-expandable-ico')).to.be.false;
            expect(tiny.hasClass(expandable3.trigger, 'ch-user-no-select')).to.be.false;
            expect(expandable3.trigger.getAttribute('aria-controls')).to.be.null;
        });

        it('should reset the container', function () {
            expect(tiny.hasClass(expandable3.container, 'ch-expandable-container')).to.be.false;
            expect(expandable3.container.getAttribute('aria-expanded')).to.be.null;
            expect(expandable3.container.getAttribute('aria-hidden')).to.be.null;
        });

        it('should remove the instance from the element', function () {
            expect(ch.instances[expandable3.uid]).to.be.undefined;
        });

        it('should emit the "layoutchange" event', function () {
            expect(layoutChangeEvent).to.have.been.called();
        });

        it('should emit the "destroy" event', function () {
            expect(destroyEvent).to.have.been.called();
        });
    });

});
