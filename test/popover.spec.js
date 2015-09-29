describe('Popover', function () {
    var container = document.createElement('div'),
        popoverHtml = [
            '<p id="popover1">Popover 1</p>',
            '<p id="popover2">Popover 2</p>'
        ].join(''),
        beforeshowEvent,
        showEvent,
        beforehideEvent,
        hideEvent,
        readyEvent,
        destroyEvent,
        popover1,
        trigger,
        popover2,
        popover3;

    before(function () {
        container.innerHTML = popoverHtml;
        document.body.appendChild(container);

        beforeshowEvent = chai.spy();
        showEvent = chai.spy();
        beforehideEvent = chai.spy();
        hideEvent = chai.spy();
        readyEvent = chai.spy();
        destroyEvent = chai.spy();

        popover1 = new ch.Popover(document.getElementById('popover1'), {fx: false})
            .on('beforeshow', beforeshowEvent)
            .on('show', showEvent)
            .on('beforehide', beforehideEvent)
            .on('hide', hideEvent)
            .on('ready', readyEvent);
        trigger = popover1.trigger;
        popover2 = new ch.Popover(document.getElementById('popover2'), {
            'addClass': 'test',
            'closable': false,
            'shownby': 'pointerenter'
        }).on('destroy', destroyEvent);
        popover3 = new ch.Popover();
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Popover).to.exist;
        expect(ch.Popover).to.be.a('function');
    });

    it('should return a new instance', function () {
        expect(popover1).to.be.an.instanceof(ch.Popover);
    });

    it('should emit the "ready" event when it\'s ready', function (done) {
        setTimeout(function(){
            expect(readyEvent).to.have.been.called();
            done();
        }, 50);
    });

    describe('should use the following abilities:', function () {
        it('EventEmitter', function () {
            expect(popover1.on).to.exist;
            expect(popover1.on).to.be.a('function');
        });

        it('Content', function () {
            expect(popover1.content).to.exist;
            expect(popover1.content).to.be.a('function');
        });

        it('Collapsible', function () {
            expect(popover1._show).to.exist;
            expect(popover1._show).to.be.a('function');
        });
    });


    describe('It should have the following public properties:', function () {

        it('.$trigger', function () {
            expect(popover1.trigger).to.exist;
            expect(popover1.trigger).to.be.an.instanceof(HTMLElement);
        });

        it('.$container', function () {
            expect(popover1.container).to.exist;
            expect(popover1.container).to.be.an.instanceof(HTMLElement);
        });

        it('.name', function () {
            expect(popover1.name).to.exist;
            expect(popover1.name).to.be.a('string');
            expect(popover1.name).to.equal('popover');
        });

        it('.constructor', function () {
            expect(popover1.constructor).to.exist;
            expect(popover1.constructor).to.be.a('function');
        });

        it('.uid', function () {
            expect(popover1.uid).to.exist;
            expect(popover1.uid).to.be.a('number');
        });
    });

    describe('It should have the following public methods:', function () {
        var methods = ['destroy', 'show', 'hide', 'isShown', 'enable', 'disable'],
            i = 0,
            len = methods.length;

        for (i; i < len; i += 1) {
            (function (i){
                it('.' + methods[i] + '()', function () {
                    expect(popover1[methods[i]]).to.exist;
                    expect(popover1[methods[i]]).to.be.a('function');
                });
            }(i));
        }
    });

    describe('It should have a trigger that', function () {
        it('should exist', function () {
            expect(trigger).to.exist;
            expect(trigger.nodeType).to.equal(1);
            expect(trigger).to.be.an.instanceof(HTMLElement);
        });

        describe('should have the following WAI-ARIA roles and properties:', function () {

            it('aria-owns: the id of the popup element', function () {
                expect(trigger.getAttribute('aria-owns')).to.match(/^ch-popover-/);
            });

            it('haspopup: true', function () {
                expect(trigger.getAttribute('aria-haspopup')).to.equal('true');
            });
        });
    });


    describe('Its show() method', function () {

        it('should add "ch-popover-trigger-on" class name to trigger', function () {
            expect(tiny.hasClass(trigger, 'ch-popover-trigger-on')).to.be.false;

            popover1.show();

            expect(tiny.hasClass(trigger, 'ch-popover-trigger-on')).to.be.true;

            popover1.hide();

            expect(tiny.hasClass(trigger, 'ch-popover-trigger-on')).to.be.false;
        });

        describe('should create an element at the bottom of body that', function () {
            var container,
                close;

            before(function(){
                container = popover1.container;
                close = container.children[0];
            });

            it('should have the same ID than the "aria-owns" attribute', function () {
                expect(container.getAttribute('id')).to.equal(trigger.getAttribute('aria-owns'));
            });

            it('should have the ARIA role "dialog"', function () {
                expect(container.getAttribute('role')).to.equal('dialog');
            });

            it('should have the "ch-popover" classname', function () {
                expect(tiny.hasClass(container, 'ch-popover')).to.be.true;
            });

            it('should have a child with the "ch-popover-content" classname', function () {
                expect(tiny.hasClass(container.children[1], 'ch-popover-content')).to.be.true;
            });

            describe('have a close button', function () {
                it('with the "ch-close" classname', function () {
                    expect(tiny.hasClass(close, 'ch-close')).to.be.true;
                });

                it('with the role "button"', function () {
                    expect(close.getAttribute('role')).to.equal('button');
                });

                it('with the ARIA label "Close"', function () {
                    expect(close.getAttribute('aria-label')).to.equal('Close');
                });
            });
        });

        it('should emit the "beforeshow" and "show" events', function () {
            popover1.show();

            expect(beforeshowEvent).to.have.been.called();
            expect(showEvent).to.have.been.called();

            popover1.hide();
        });

        it('should return the same instance than initialized component', function () {
            expect(popover1.show()).to.equal(popover1);
        });
    });

    describe('Its hide() method', function () {

        it('should remove "ch-popover-trigger-on" class name to trigger', function () {
            popover1.show().hide();
            expect(tiny.hasClass(trigger, 'ch-popover-trigger-on')).to.be.false;
        });

        it('should delete the element from the DOM when it hidden', function () {

            var id = trigger.getAttribute('aria-owns');

            popover1.show();
            expect(document.getElementById(id)).to.not.be.null;
            popover1.hide();

            expect(document.getElementById(trigger.getAttribute('aria-owns'))).to.be.null;
        });

        it('should emit the "beforehide" and "hide" events', function () {
            expect(beforehideEvent).to.have.been.called();
            expect(hideEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(popover1.hide()).to.equal(popover1);
        });
    });

    describe('Its isShown() method', function () {

        it('should return a boolean value', function () {
            expect(popover1.isShown()).to.be.a('boolean');
        });

        it('should return "true" when the component is shown', function () {
            expect(popover1.show().isShown()).to.be.true;
        });

        it('should return "false" when the component is hidden', function () {
            expect(popover1.hide().isShown()).to.be.false;
        });
    });

    describe('Its disable() method', function () {

        it('should return the same instance than initialized component', function () {
            expect(popover1.disable()).to.equal(popover1);
        });

        it('should prevent to show its container', function () {
            popover1.disable().show();
            expect(tiny.hasClass(trigger, 'ch-popover-trigger-on')).to.be.false;
        });
    });

    describe('Its enable() method', function () {

        it('should return the same instance than initialized component', function () {
            expect(popover1.enable()).to.equal(popover1);
        });

        it('should allow to show its container', function () {
            popover1.enable().show()
            expect(tiny.hasClass(trigger, 'ch-popover-trigger-on')).to.be.true;
        });
    });

    describe('Its width() method', function () {
        beforeEach(function () {
            popover1.show();
        });

        it('as a getter should return the width of the floated object', function () {
            expect(popover1.width()).to.equal(popover1.container.style.width);
        });

        describe('as a setter', function () {

            it('should change the width of the floated object', function () {

                var w = 123;

                expect(popover1.width()).to.not.equal(w);

                popover1.width(w);

                expect(popover1.width()).to.equal(w);
            });

            it('should return the same instance than initialized component', function () {
                expect(popover1.width(321)).to.equal(popover1);
            });
        });
    });

    describe('Its height() method', function () {

        beforeEach(function () {
            popover1.show();
        });

        it('as a getter should return the height of the floated object', function () {
            expect(popover1.height()).to.equal(popover1.container.style.height);
        });

        describe('as a setter', function () {
            it('should change the height of the floated object', function () {

                var h = 55;

                expect(popover1.height()).to.not.equal(h);

                popover1.height(h);

                expect(popover1.height()).to.equal(h);
            });

            it('should return the same instance than initialized component', function () {
                expect(popover1.height(321)).to.equal(popover1);
            });
        });
    });

    describe('Instance a Popover configured', function () {
        it('with custom class names should contain the specified class names in its container', function () {
            expect(tiny.hasClass(popover2.container, 'ch-popover')).to.be.true;
            expect(tiny.hasClass(popover2.container, 'test')).to.be.true;
        });

        describe('with "shownby" preference:', function () {

            it('"pointertap" should give a pointer cursor to the trigger', function () {
                expect(tiny.hasClass(popover1._el, 'ch-shownby-pointertap')).to.be.true;
                expect(tiny.hasClass(popover1._el, 'ch-shownby-pointerenter')).to.be.false;
            });

            it('"pointerenter" should give a default cursor to the trigger', function () {
                expect(tiny.hasClass(popover2._el, 'ch-shownby-pointerenter')).to.be.true;
                expect(tiny.hasClass(popover2._el, 'ch-shownby-pointertap')).to.be.false;
            });
        });
    });

    describe('Instance a Popover without trigger', function () {
        it('shouldn\'t have .trigger', function () {
            expect(popover3.trigger).to.be.undefined;
        });
    });

    describe('Its destroy() method', function () {
        var uid,
            t;

        before(function () {
            uid = popover2.uid;
            popover2.destroy();
            popover2 = undefined;
            t = document.getElementById('popover2');
        });

        it('should reset the "trigger"', function () {
            expect(tiny.hasClass(t, 'ch-popover-trigger')).to.be.false;
            expect(t.getAttribute('data-title')).to.be.null;
            expect(t.getAttribute('aria-owns')).to.be.null;
            expect(t.getAttribute('aria-haspopup')).to.be.null;
            expect(t.getAttribute('data-side')).to.be.null;
            expect(t.getAttribute('data-align')).to.be.null;
            expect(t.getAttribute('role')).to.be.null;
        });

        it('should remove ".popover" events', function () {
            expect(ch.instances[uid]).to.be.undefined;
        });

        it('should emit the "destroy" event', function () {
            expect(destroyEvent).to.have.been.called();
        });
    });

});
