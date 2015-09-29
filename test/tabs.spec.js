describe('Tabs', function () {
    var container = document.createElement('div'),
        tabsHtml = [
            '<div id="tabs-1">',
                '<ul>',
                    '<li><a href="#tab1">Tab1</a></li>',
                    '<li><a href="#tab2">Tab2</a></li>',
                    '<li><a href="/mock/ajax.html#ajax">Ajax</a></li>',
                '</ul>',
                '<div>',
                    '<div id="tab1">',
                        '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet purus in sapien luctus sodales. Curabitur dui velit, cursus in sagittis aliquam, dictum at neque. Ut gravida scelerisque lorem non pulvinar. Pellentesque et urna vitae nisl porta imperdiet sed nec ipsum. Sed non sem velit. Cras id consectetur tellus.</p>',
                    '</div>',
                    '<div id="tab2">',
                        '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet purus in sapien luctus sodales. Curabitur dui velit, cursus in sagittis aliquam, dictum at neque. Ut gravida scelerisque lorem non pulvinar.</p>',
                    '</div>',
                '</div>',
            '</div>',

            '<div id="tabs-2">',
                '<ul>',
                    '<li><a href="#tab3">Tab3</a></li>',
                    '<li><a href="#tab4">Tab4</a></li>',
                '</ul>',
                '<div>',
                    '<div id="tab3">',
                        '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet purus in sapien luctus sodales. Curabitur dui velit, cursus in sagittis aliquam, dictum at neque. Ut gravida scelerisque lorem non pulvinar. Pellentesque et urna vitae nisl porta imperdiet sed nec ipsum. Sed non sem velit. Cras id consectetur tellus.</p>',
                    '</div>',
                    '<div id="tab4">',
                        '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet purus in sapien luctus sodales. Curabitur dui velit, cursus in sagittis aliquam, dictum at neque. Ut gravida scelerisque lorem non pulvinar.</p>',
                    '</div>',
                '</div>',
            '</div>'
        ].join(''),
        tabs1,
        tabs2,
        readyEvent,
        destroyEvent,
        layoutChangeEvent,
        showEvent;

    before(function () {
        container.innerHTML = tabsHtml;
        document.body.appendChild(container);

        readyEvent = chai.spy();
        destroyEvent = chai.spy();
        layoutChangeEvent = chai.spy();
        showEvent = chai.spy();

        tabs1 = new ch.Tabs(document.getElementById('tabs-1'));
        tabs2 = new ch.Tabs(document.getElementById('tabs-2'));

        tabs1.on('ready', readyEvent);

        tiny.on(document, ch.onlayoutchange, layoutChangeEvent);
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Tabs).to.exist;
        expect(ch.Tabs).to.be.a('function');
    });

    it('should emit the "ready" event when it\'s created', function () {
        setTimeout(function(){
            expect(readyEvent).to.have.been.called();
        }, 50);
    });

    it('with an ajax tab should create a tabpanel', function () {
        expect(document.getElementById('ajax').nodeType).to.equal(1);
    });

    describe('It should have the following public properties:', function () {
        it('.container', function () {
            expect(tabs1.container).to.exist;
            expect(tabs1.container.nodeType).to.equal(1);
            expect(tabs1.container).to.be.an.instanceof(HTMLElement);
        });

        it('.name', function () {
            expect(tabs1.name).to.exist;
            expect(tabs1.name).to.be.a('string');
            expect(tabs1.name).to.equal('tabs');
        });

        it('.constructor', function () {
            expect(tabs1.constructor).to.exist;
            expect(tabs1.constructor).to.be.a('function');
        });

        it('.uid', function () {
            expect(tabs1.uid).to.exist;
            expect(tabs1.uid).to.be.a('number');
        });
    });

    describe('It should have the following public methods:', function () {
        var methods = ['destroy', 'show', 'getShown', 'enable', 'disable'],
            i = 0,
            len = methods.length;

        for (i; i < len; i += 1) {
            (function (i){
                it('.' + methods[i] + '()', function () {
                    expect(tabs1[methods[i]]).to.exist;
                    expect(tabs1[methods[i]]).to.be.a('function');
                });
            }(i));
        }
    });

    describe('It should have a wrapper and', function () {
        var container;

        before(function(){
            container = tabs1.container;
        });

        it('should have the ".ch-tabs" class name', function () {
            expect(tiny.hasClass(container, 'ch-tabs')).to.be.true;
        });
    });

    describe('It should have a list of triggers and', function () {
        var triggers,
            trigger;

        before(function(){
            triggers = tabs1.triggers;
            trigger = triggers.children[0].children[0];
        });

        it('should exist', function () {
            expect(triggers).to.exist;
            expect(triggers.nodeType).to.equal(1);
            expect(triggers).to.be.an.instanceof(HTMLElement);
        });

        it('should have the WAI-ARIA role "tablist"', function () {
            expect(triggers.getAttribute('role')).to.equal('tablist');
        });

        it('should have the "ch-tabs-triggers" class name', function () {
            expect(tiny.hasClass(triggers, 'ch-tabs-triggers')).to.be.true;
        });

        describe('its trigger', function () {
            it('should exist', function () {
                expect(trigger).to.exist;
                expect(trigger.nodeType).to.equal(1);
                expect(trigger).to.be.an.instanceof(HTMLElement);
            });

            it('should have the WAI-ARIA role "tab"', function () {
                expect(trigger.getAttribute('role')).to.equal('tab');
            });

            describe('should have the following class name:', function () {
                it('.ch-tab', function () {
                    expect(tiny.hasClass(trigger, 'ch-tab')).to.be.true;
                });

                it('.ch-user-no-select', function () {
                    expect(tiny.hasClass(trigger, 'ch-user-no-select')).to.be.true;
                });
            });
        });

    });

    describe('It should have a list of panels and', function () {
        var panel,
            tabpanel;

        before(function(){
            panel = tabs1.panel;
            tabpanel = tabs1.panel.children[0];
        });

        it('should exist', function () {
            expect(panel).to.exist;
            expect(panel.nodeType).to.equal(1);
            expect(panel).to.be.an.instanceof(HTMLElement);
        });

        it('should have the WAI-ARIA role "presentation"', function () {
            expect(panel.getAttribute('role')).to.equal('presentation');
        });

        it('should have the "ch-tabs-panel" class name', function () {
            expect(tiny.hasClass(panel, 'ch-tabs-panel')).to.be.true;
        });

        describe('its tabpanel', function () {

            it('should exist', function () {
                expect(tabpanel).to.exist;
                expect(tabpanel.nodeType).to.equal(1);
                expect(tabpanel).to.be.an.instanceof(HTMLElement);
            });

            it('should have the WAI-ARIA role "tabpanel"', function () {
                expect(tabpanel.getAttribute('role')).to.equal('tabpanel');
            });

            it('should have the "ch-tabpanel" class name', function () {
                expect(tiny.hasClass(tabpanel, 'ch-tabpanel')).to.be.true;
            });
        });

    });

    describe('Its show() method', function () {
        var instance;

        before(function(){
            tabs1.on('show', showEvent);
            instance = tabs1.show(2);
        });

        it('should set a hash on window location', function () {
            expect(window.location.hash).not.to.equal('');
        });

        it('should emit the "show" event', function () {
            expect(showEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.equal(tabs1);
        });
    });

    describe('Its getShown() method', function () {
        it('should return a number of current shown tab', function () {
            tabs1.show(1);
            expect(tabs1.getShown()).to.equal(1);
        });
    });

    describe('Its disable() method', function () {
        var instance;

        it('should receive an optional tab to disable', function () {
            instance = tabs1.disable(3);
            tabs1.show(3);
            expect(tiny.hasClass(tabs1.tabpanels[2].trigger, 'ch-expandable-trigger-on')).to.be.false;
        });

        it('should prevent to show new tab panels', function () {
            instance = tabs1.disable();
            tabs1.show(2);
            expect(tiny.hasClass(tabs1.tabpanels[1].trigger, 'ch-expandable-trigger-on')).to.be.false;
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.equal(tabs1);
        });
    });

    describe('Its enable() method', function () {
        var instance;

        it('should receive an optional tab to enable', function () {
            instance = tabs1.enable(3);
            tabs1.show(3);
            expect(tiny.hasClass(tabs1.tabpanels[2].trigger, 'ch-expandable-trigger-on')).to.be.true;
        });

        it('should prevent to show its container', function () {
            instance = tabs1.enable();
            tabs1.show(2);
            expect(tiny.hasClass(tabs1.tabpanels[1].trigger, 'ch-expandable-trigger-on')).to.be.true;
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.equal(tabs1);
            tabs1.show(1);
        });
    });

    describe('Its destroy() method', function () {
        before(function(){
            tabs2.on('destroy', destroyEvent);
        });

        it('should reset the container', function () {
            tabs2.destroy();
            expect(tiny.parent(tabs2.container)).to.be.null;
        });

        it('should remove the instance from the element', function () {
            expect(ch.instances[tabs2.uid]).to.be.undefined;
        });

        it('should emit the "layoutchange" event', function () {
            expect(layoutChangeEvent).to.have.been.called();
        });

        it('should emit the "destroy" event', function () {
            expect(destroyEvent).to.have.been.called();
        });
    });
});
