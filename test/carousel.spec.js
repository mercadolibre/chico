describe('Carousel', function () {
    var container = document.createElement('div'),
        carouselHtml = [
            '<div class="carousel1 ch-carousel">',
                '<ul>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                '</ul>',
            '</div>',

            '<div class="carousel2 ch-carousel">',
                '<ul>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                '</ul>',
            '</div>',

            '<div class="carousel3 ch-carousel">',
                '<ul>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                '</ul>',
            '</div>',

            '<div class="carousel4 ch-carousel">',
                '<ul>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                    '<li><img src="/mock/ninja.png"></li>',
                '</ul>',
            '</div>'
        ].join(''),
        destroyEvent,
        selectEvent,
        prevEvent,
        nextEvent,
        readyEvent,
        itemsdoneEvent,
        emptyitemsEvent,
        carousel1,
        carousel2,
        carousel3,
        carousel4;

    before(function() {
        container.innerHTML = carouselHtml;
        document.body.appendChild(container);

        destroyEvent = chai.spy();
        selectEvent = chai.spy();
        prevEvent = chai.spy();
        nextEvent = chai.spy();
        readyEvent = chai.spy();
        itemsdoneEvent = chai.spy();
        emptyitemsEvent = chai.spy();
        carousel1 = new ch.Carousel(document.querySelector('.carousel1'), {
            'limitPerPage': 4,
            'fx': false,
        }).on('select', selectEvent)
            .on('prev', prevEvent)
            .on('next', nextEvent)
            .on('ready', readyEvent)
            .on('itemsdone', itemsdoneEvent)
            .on('emptyitems', emptyitemsEvent);
        carousel2 = new ch.Carousel(document.querySelector('.carousel2'), {
            'limitPerPage': 4,
            'arrows': false,
            'pagination': true,
            'fx': false
        });
        carousel3 = new ch.Carousel(document.querySelector('.carousel3'), {
            'limitPerPage': 2,
            'async': 5,
            'fx': false
        }).on('itemsadd', function (items) {
                items.forEach(function (e, i) {
                    e.innerHTML = 'TESTING ASYNCHRONOUS ITEM Nº' + i;
                });
            });
        carousel4 = new ch.Carousel(document.querySelector('.carousel4')).on('destroy', function () {
            destroyEvent();
        });
    });

    after(function () {
        document.body.removeChild(container);
    });

    it('should be defined on ch object', function () {
        expect(ch.Carousel).to.exist;
        expect(ch.Carousel).to.be.a('function');
    });

    it('should return a new instance', function () {
        expect(carousel1).to.be.an.instanceof(ch.Carousel);
    });

    it('should emit the "ready" event when it\'s ready', function (done) {
        setTimeout(function(){
            expect(readyEvent).to.have.been.called();
            done();
        }, 50);
    });


    describe('It should have the following public properties:', function () {
        it('.name', function () {
            expect(carousel1.name).to.not.be.undefined;
            expect(carousel1.name).to.be.a('string');
            expect(carousel1.name).to.equal('carousel');
        });

        it('.constructor', function () {
            expect(carousel1.constructor).to.not.be.undefined;
            expect(carousel1.constructor).to.be.a('function');
        });

        it('.uid', function () {
            expect(carousel1.uid).to.not.be.undefined;
            expect(carousel1.uid).to.be.a('number');
        });
    });

    describe('It should have the following public methods:', function () {
        var methods = ['destroy', 'select', 'prev', 'next', 'refresh', 'enable', 'disable'],
            i = 0,
            len = methods.length;

        for (i; i < len; i += 1) {
            (function (i){
                it('.' + methods[i] + '()', function () {
                    expect(carousel1[methods[i]]).to.not.be.undefine;
                    expect(carousel1[methods[i]]).to.be.a('function');
                });
            }(i));
        }
    });

    describe('It should have two navigation controls:', function () {

        describe('Previous button', function () {
            var btn;

            before(function(){
                btn = carousel1._el.children[0];
            });

            it('should exist', function () {
                expect(btn.nodeType).to.equal(1);
            });

            describe('should have the following WAI-ARIA roles and properties:', function () {

                it('role: button', function () {
                    expect(btn.getAttribute('role')).to.equal('button');
                });

                it('aria-hidden: true in the first page', function () {
                    expect(btn.getAttribute('aria-hidden')).to.equal('true');
                });
            });

            describe('should have the following ID and Classnames:', function () {

                it('.ch-carousel-prev', function () {
                    expect(tiny.hasClass(btn, 'ch-carousel-prev')).to.be.true;
                });

                it('.ch-carousel-disabled in the first page', function () {
                    expect(tiny.hasClass(btn, 'ch-carousel-disabled')).to.be.true;
                });

                it('.ch-user-no-select', function () {
                    expect(tiny.hasClass(btn, 'ch-user-no-select')).to.be.true;
                });
            });
        });

        describe('Next button', function () {
            var btn;

            before(function(){
                btn = carousel1._el.children[2];
            });

            it('should exist', function () {
                expect(btn.nodeType).to.equal(1);
            });

            describe('should have the following WAI-ARIA roles and properties:', function () {

                it('role: button', function () {
                    expect(btn.getAttribute('role')).to.equal('button');
                });

                it('aria-hidden: false in the first page', function () {
                    expect(btn.getAttribute('aria-hidden')).to.equal('false');
                });
            });

            describe('should have the following ID and Classnames:', function () {

                it('.ch-carousel-next', function () {
                    expect(tiny.hasClass(btn, 'ch-carousel-next')).to.be.true;
                });

                it('shouldn\'t have the .ch-carousel-disabled classname in the first page', function () {
                    expect(tiny.hasClass(btn, 'ch-carousel-disabled')).to.be.false;
                });

                it('.ch-user-no-select', function () {
                    expect(tiny.hasClass(btn, 'ch-user-no-select')).to.be.true;
                });
            });
        });
    });

    describe('It should have a Mask element that', function () {
        var mask;

        before(function(){
            mask = carousel1._el.children[1];
        });

        it('should exist', function () {
            expect(mask.nodeType).to.equal(1);
        });

        it('should have the WAI-ARIA role "tabpanel"', function () {
            expect(mask.getAttribute('role')).to.equal('tabpanel');
        });

        it('should have the "ch-carousel-mask" classname:', function () {
            expect(tiny.hasClass(mask, 'ch-carousel-mask')).to.be.true;
        });

        describe('should have the initial list element that', function () {
            var list;

            before(function(){
                list = mask.children[0];
            });

            it('should exist', function () {
                expect(list.nodeType).to.equal(1);
            });

            it('should have the "ch-carousel-list" classname', function () {
                expect(tiny.hasClass(list, 'ch-carousel-list')).to.be.true;
            });

            describe('should have each individual item or element into the list:', function () {
                var items,
                    firstItem,
                    lastItem,
                    total;

                before(function(){
                    items = list.children;
                    firstItem = items[0];
                    lastItem = items[items.length - 1];
                    total = items.length.toString();
                });

                describe('First element: Should have the following WAI-ARIA roles and properties:', function () {

                    it('aria-hidden: false in the first page', function () {
                        expect(firstItem.getAttribute('aria-hidden')).to.equal('false');
                    });

                    it('aria-setsize: The same amount than items into the list', function () {
                        expect(firstItem.getAttribute('aria-setsize')).to.equal(total);
                    });

                    it('aria-posinset: 1, because it\s the first element', function () {
                        expect(firstItem.getAttribute('aria-posinset')).to.equal('1');
                    });

                    it('aria-label: "page1", because it\s in the first page', function () {
                        expect(firstItem.getAttribute('aria-label')).to.equal('page1');
                    });
                });

                describe('Last element: Should have the following WAI-ARIA roles and properties:', function () {

                    it('aria-hidden: true in the last page', function () {
                        expect(lastItem.getAttribute('aria-hidden')).to.equal('true');
                    });

                    it('aria-setsize: The same amount than items into the list', function () {
                        expect(lastItem.getAttribute('aria-setsize')).to.equal(total);
                    });

                    it('aria-posinset: The same amount than items into the list, because it\s the last element', function () {
                        expect(lastItem.getAttribute('aria-posinset')).to.equal(total);
                    });

                    it('aria-label: "page5", because it\s in the last page', function () {
                        expect(lastItem.getAttribute('aria-label')).to.equal('page' + carousel1._pages);
                    });
                });
            });
        });
    });

    describe('Its select() method', function () {

        it('should move to a specific page (4)', function () {

            expect(carousel1._currentPage).to.not.equal(4);

            carousel1.select(4);

            expect(carousel1._currentPage).to.equal(4);
        });

        it('should emit the "select" event when it\'s translated', function () {
            expect(selectEvent).to.have.been.called.once;
        });
    });

    describe('Its prev() method', function () {

        it('should move one page at a time', function () {

            carousel1.prev();

            expect(carousel1._currentPage).to.equal(3);

            carousel1.prev();

            expect(carousel1._currentPage).to.equal(2);
        });

        it('should emit the "select" and "prev" events when it\'s translated', function () {
            expect(selectEvent).to.have.been.called.exactly(3);
            expect(prevEvent).to.have.been.called.exactly(2);
        });

        it('shouldn\'t move beyond the first page', function () {
            carousel1.select(1).prev();

            expect(carousel1._currentPage).to.equal(1);
        });
    });

    describe('Its next() method', function () {

        it('should move one page at a time', function () {
            carousel1.next();

            expect(carousel1._currentPage).to.equal(2);

            carousel1.next();

            expect(carousel1._currentPage).to.equal(3);
        });

        it('should emit the "select" and "next" events when it\'s translated', function () {
            expect(selectEvent).to.have.been.called.exactly(6);
            expect(nextEvent).to.have.been.called.exactly(2);
        });

        it('shouldn\'t move beyond the last page', function () {
            carousel1.select(carousel1._pages).next();

            expect(carousel1._currentPage).to.equal(carousel1._pages);
        });
    });

    describe('Its refresh() method', function () {

        it('should emit the "refresh" event when the public method "refresh" is executed and the amount of items changes', function () {
            var toRemove = carousel1._items[0],
                parentOfRemoved = toRemove.parentNode,
                refreshEvent = chai.spy();

            carousel1.on('refresh', refreshEvent);

            expect(refreshEvent).to.have.not.been.called();
            parentOfRemoved.removeChild(toRemove);
            carousel1.refresh();
            expect(refreshEvent).to.have.been.called.at.least(1);
        });
    });

    describe('Its movement should respect the buttons visibility and availability', function () {
        var prevButton,
            nextButton;

        before(function () {
            prevButton = carousel1._mask.previousElementSibling;
            nextButton = carousel1._mask.nextElementSibling;
        });

        it('in the middle page', function () {
            carousel1.select(3);

            expect(prevButton.getAttribute('aria-disabled')).to.equal('false');
            expect(tiny.hasClass(prevButton, 'ch-carousel-disabled')).to.be.false;

            expect(nextButton.getAttribute('aria-disabled')).to.equal('false');
            expect(tiny.hasClass(nextButton, 'ch-carousel-disabled')).to.be.false;
        });

        it('in the first page', function () {
            carousel1.select(1);

            expect(prevButton.getAttribute('aria-disabled')).to.equal('true');
            expect(tiny.hasClass(prevButton, 'ch-carousel-disabled')).to.be.true;

            expect(nextButton.getAttribute('aria-disabled')).to.equal('false');
            expect(tiny.hasClass(nextButton, 'ch-carousel-disabled')).to.be.false;
        });

        it('in the last page', function () {
            carousel1.select(carousel1._pages);

            expect(prevButton.getAttribute('aria-disabled')).to.equal('false');
            expect(tiny.hasClass(prevButton, 'ch-carousel-disabled')).to.be.false;

            expect(nextButton.getAttribute('aria-disabled')).to.equal('true');
            expect(tiny.hasClass(nextButton, 'ch-carousel-disabled')).to.be.true;
        });
    });

    describe('Its Next and Prev navigation controls', function () {
        it('shouldn\'t exist when it\'s specified by configuration', function () {
            expect(carousel2._el.querySelectorAll('.ch-carousel-prev').length).to.equal(0);
            expect(carousel2._el.querySelectorAll('.ch-carousel-next').length).to.equal(0);
        });
    });

    describe('Its pagination controls', function () {
        var pages,
            thumbs;

        before(function () {
            pages = carousel2._el.childNodes[carousel2._el.childNodes.length - 1];
            thumbs = pages.childNodes;
        });

        it('should exist when it\'s specified by configuration', function () {
            expect(pages.nodeType).to.equal(1);
        });

        it('should have the WAI-ARIA role "navigation"', function () {
            expect(pages.getAttribute('role')).to.equal('navigation');
        });

        describe('should have the following ID and Classnames:', function () {
            it('.ch-carousel-pages', function () {
                expect(tiny.hasClass(pages, 'ch-carousel-pages')).to.be.true;
            });

            it('.ch-user-no-select', function () {
                expect(tiny.hasClass(pages, 'ch-user-no-select')).to.be.true;
            });
        });

        describe('should have thumbnails:', function () {

            it('The same amount of thumbs than total amount of items in the Carousel', function () {
                expect(thumbs.length).to.equal(carousel2._pages);
            });

            describe('First thumb (a selected thumb)', function () {
                var thumb;

                before(function () {
                    thumb = thumbs[0];
                });

                it('should have the data-page attribute with the value "1"', function () {
                    expect(thumb.getAttribute('data-page')).to.equal('1');
                });

                it.skip('should have the "ch-carousel-selected" classname, because it\'s selected right now', function () {
                    expect(tiny.hasClass(thumb, 'ch-carousel-selected')).to.be.true;
                });

                describe('should have the following WAI-ARIA roles and properties:', function () {
                    it('role: button', function () {
                        expect(thumb.getAttribute('role')).to.equal('button');
                    });

                    it.skip('aria-selected: true in the first page', function () {
                        expect(thumb.getAttribute('aria-selected')).to.equal('true');
                    });

                    it('aria-controls: page1', function () {
                        expect(thumb.getAttribute('aria-controls')).to.equal('page1');
                    });
                });
            });

            describe('Last thumb (a non-selected thumb)', function () {
                var thumb;

                before(function () {
                    thumb = thumbs[thumbs.length - 1];
                });

                it('should have the data-page attribute with the value "20"', function () {
                    expect(thumb.getAttribute('data-page')).to.equal(carousel2._pages.toString());
                });

                it('shouldn\'t have the "ch-carousel-selected" classname, because it isn\'t selected right now', function () {
                    expect(tiny.hasClass(thumb, 'ch-carousel-selected')).to.be.false;
                });

                describe('should have the following WAI-ARIA roles and properties:', function () {
                    it('aria-selected: false in the last page', function () {
                        expect(tiny.hasClass(thumb, 'aria-selected')).to.be.false;
                    });
                });
            });

            it('should change when another page is selected', function () {

                carousel2.select(1);

                expect(tiny.hasClass(thumbs[0], 'ch-carousel-selected')).to.be.true;
                expect(tiny.hasClass(thumbs[2], 'ch-carousel-selected')).to.be.false;

                carousel2.select(3);

                expect(tiny.hasClass(thumbs[0], 'ch-carousel-selected')).to.be.false;
                expect(tiny.hasClass(thumbs[2], 'ch-carousel-selected')).to.be.true;
            });
        });
    });

    describe('Its asynchronous feature', function () {

        it('should add the next arrow', function () {
            expect(tiny.hasClass(carousel3._el.querySelector('.ch-carousel-next'), 'ch-carousel-disabled')).to.be.false;
        });

        it.skip('should add two items on next page', function () {
            var items = carousel3._items.length,
                expectedItems = items + carousel3._limitPerPage;

            carousel3.next();
            expect(carousel3._items.length).to.equal(expectedItems);
        });

        it.skip('should add multiple items on next 2 pages selection (through select() method or pagination)', function () {
            var move = 2, // Amount of pages to move
                items = carousel3._items.length,
                expectedItems = items + (carousel3._limitPerPage * move);

            carousel3.select(carousel3._currentPage + move);

            expect(carousel3._items.length).to.equal(expectedItems);
        });
    });

    describe('Its destroy() method', function () {
        var itemsAmount;

        before(function () {
            itemsAmount = document.querySelectorAll('.carousel4 li').length;
            carousel4.destroy();
        });

        it('should reset the _el', function () {
            expect(document.querySelectorAll('.carousel4 li').length).to.equal(itemsAmount);
        });

        it('should remove the instance from the element', function () {
            expect(ch.instances[carousel4.uid]).to.be.undefined;
        });

        it('should emit the "destroy" event', function () {
            expect(destroyEvent).to.have.been.called();
        });
    });

});

