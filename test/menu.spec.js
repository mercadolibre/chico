describe('Menu', function () {
    var container = document.createElement('div'),
        menuHtml = [
            '<ul id="menu-1">',
                '<li>',
                    '<span>Item</span>',
                    '<ul>',
                        '<li><a href="#">Link 1</a></li>',
                        '<li><a href="#">Link 2</a></li>',
                        '<li><a href="#">Link 3</a></li>',
                    '</ul>',
                '</li>',
                '<li>',
                    '<span>Item</span>',
                    '<ul>',
                        '<li><a href="#">Link 1</a></li>',
                        '<li><a href="#">Link 2</a></li>',
                        '<li><a href="#">Link 3</a></li>',
                    '</ul>',
                '</li>',
                '<li>',
                    '<span>Item</span>',
                    '<ul>',
                        '<li><a href="#">Link 1</a></li>',
                        '<li><a href="#">Link 2</a></li>',
                        '<li><a href="#">Link 3</a></li>',
                    '</ul>',
                '</li>',
                '<li>',
                    '<span>Item</span>',
                    '<ul>',
                        '<li><a href="#">Link 1</a></li>',
                        '<li><a href="#">Link 2</a></li>',
                        '<li><a href="#">Link 3</a></li>',
                    '</ul>',
                '</li>',
                '<li>',
                    '<a href="#">Link</a>',
                '</li>',
                '<li>',
                    '<a href="#">Link</a>',
                '</li>',
            '</ul>',
            '<ul id="menu-2">',
                '<li>',
                    '<span>Item</span>',
                    '<ul>',
                        '<li><a href="#">Link 1</a></li>',
                        '<li><a href="#">Link 2</a></li>',
                        '<li><a href="#">Link 3</a></li>',
                    '</ul>',
                '</li>',
                '<li>',
                    '<span>Item</span>',
                    '<ul>',
                        '<li><a href="#">Link 1</a></li>',
                        '<li><a href="#">Link 2</a></li>',
                        '<li><a href="#">Link 3</a></li>',
                    '</ul>',
                '</li>',
            '</ul>'
        ].join(''),
        menu1,
        menu2,
        readyEvent,
        showEvent,
        hideEvent,
        destroyEvent,
        layoutChangeEvent,
        menuContainer,
        children,
        expandable,
        bellows;

    before(function () {
        container.innerHTML = menuHtml;
        document.body.appendChild(container);

        readyEvent = chai.spy();
        showEvent = chai.spy();
        hideEvent = chai.spy();
        destroyEvent = chai.spy();
        layoutChangeEvent = chai.spy();

        menu1 = new ch.Menu(document.getElementById('menu-1'), {'fx': false}).on('ready', readyEvent);;
        menu2 = new ch.Menu(document.getElementById('menu-2'));
        menuContainer = menu1.container;
        children = menu1.container.children;
        expandable = menu1.folds[0];
        bellows = menu1.container.lastElementChild;

        tiny.on(document, ch.onlayoutchange, layoutChangeEvent);
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Menu).to.exist;
        expect(ch.Menu).to.be.a('function');
    });

    it('should be return a new instance', function () {
        expect(menu1).to.be.an.instanceof(ch.Menu);
    });

    it('should emit the "ready" event when it\'s created', function (done) {
        setTimeout(function() {
            expect(readyEvent).to.have.been.called();
            done();
        }, 50);
    });

    it('should use the EventEmitter ability', function () {
        expect(menu1.on).to.exist;
        expect(menu1.on).to.be.a('function');
    });

    describe('It should have the following public properties:', function () {

        it('.$container', function () {
            expect(menuContainer).to.exist;
            expect(menuContainer.nodeType).to.equal(1);
            expect(menuContainer).to.be.an.instanceof(HTMLElement);
        });

        it('.name', function () {
            expect(menu1.name).to.exist;
            expect(menu1.name).to.be.a('string');
            expect(menu1.name).to.equal('menu');
        });

        it('.constructor', function () {
            expect(menu1.constructor).to.exist;
            expect(menu1.constructor).to.be.a('function');
        });

        it('.uid', function () {
            expect(menu1.uid).to.exist;
            expect(menu1.uid).to.be.a('number');
        });

    });

    describe('It should have the following public methods:', function () {
        var methods = ['destroy', 'show', 'hide', 'content', 'enable', 'disable'],
            i = 0,
            len = methods.length;

        for (i; i < len; i += 1) {
            (function (i){
                it('.' + methods[i] + '()', function () {
                    expect(menu1[methods[i]]).to.exist;
                    expect(menu1[methods[i]]).to.be.a('function');
                });
            }(i));
        }
    });

    describe('It should have a container and', function () {

        it('should have the ".ch-menu" class name', function () {
            expect(tiny.hasClass(menuContainer, 'ch-menu')).to.be.true;
        });

        it('should have the WAI-ARIA role "navigation"', function () {
            expect(menuContainer.getAttribute('role')).to.equal('navigation');
        });
    });

    describe('It should have children and it', function () {

        it('have a "ch-menu-fold" class name', function () {
            expect(tiny.hasClass(children[0], 'ch-menu-fold')).to.be.true;
        });

        describe('should be Expandables and', function () {
            it('should exist', function () {
                expect(expandable).to.be.an.instanceof(ch.Expandable);
            });

            it('its container should have the WAI-ARIA role "menu"', function () {
                expect(children[0].children[children[0].children.length - 1].getAttribute('role')).to.equal('menu');
            });

            it('the links inside its container should have the WAI-ARIA role "menuitem"', function () {
                expect(children[0].children[children[0].children.length - 1].children[0].children[0].getAttribute('role')).to.equal('menuitem');
            });

        });

        it('should have the WAI-ARIA role "presentation" if it\'s not expandables', function () {
            expect(bellows.getAttribute('role')).to.equal('presentation');
        });

    });

    describe('Its show() method', function () {
        var instance;

        before(function() {
            menu1.on('show', showEvent);
            instance = menu1.show(1);
        });

        it('should be call with parameters', function () {
            expect(tiny.hasClass(children[0].children[children[0].children.length - 1], 'ch-hide')).to.be.false;
        });

        it('should emit the "show" event', function () {
            expect(showEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(menu1);
        });
    });

    describe('Its hide() method', function () {
        var instance;

        before(function(){
            menu1.on('hide', hideEvent);
        });

        it('should be call with parameters', function () {
            instance = menu1.hide(1);
            expect(tiny.hasClass(children[0].children[children[0].children.length - 1], 'ch-hide')).to.be.true;
        });

        it('should emit the "hide" event', function () {
            expect(hideEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(menu1);
        });
    });

    describe('An instance by default', function () {
        it('should has its containers hidden', function () {
            expect(tiny.hasClass(children[0].children[children[0].children.length - 1], 'ch-hide') ).to.be.true;
        });
    });

    describe('Its disable() method', function () {
        var instance;

        it('should receive an optional fold to disable', function () {
            instance = menu1.disable(1);
            menu1.show(1);
            expect(tiny.hasClass(menu1.folds[0].trigger, 'ch-expandable-trigger-on')).to.be.false;
        });

        it('should prevent to show new folds', function () {
            instance = menu1.disable();
            menu1.show(2);
            expect(tiny.hasClass(menu1.folds[1].trigger, 'ch-expandable-trigger-on')).to.be.false;
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(menu1);
        });
    });

    describe('Its enable() method', function () {
        var instance;

        it('should receive an optional fold to enable', function () {
            instance = menu1.enable(1);
            menu1.show(1);
            expect(tiny.hasClass(menu1.folds[0].trigger, 'ch-expandable-trigger-on')).to.be.true;
        });

        it('should prevent to show its container', function () {
            instance = menu1.enable();
            menu1.show(2);
            expect(tiny.hasClass(menu1.folds[1].trigger, 'ch-expandable-trigger-on')).to.be.true;
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(menu1);
            menu1.show(1);
        });

    });

    describe('Its destroy() method', function () {
        before(function(){
            menu2.on('destroy', destroyEvent);
            menu2.destroy();
        });

        it('should reset the container', function () {
            expect(tiny.parent(menu2.container)).to.be.null;
        });

        it('should remove the instance from the element', function () {
            expect(ch.instances[menu2.uid]).to.be.undefined;
        });

        it('should emit the "layoutchange" event', function () {
            expect(layoutChangeEvent).to.have.been.called();
        });

        it('should emit the "destroy" event', function () {
            expect(destroyEvent).to.have.been.called();
        });
    });
});
