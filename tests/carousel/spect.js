// The configuration object allows to calculate movements by having always the same amount of pages
var destroyEvent = jasmine.createSpy('destroyEvent'),
    selectEvent = jasmine.createSpy('selectEvent'),
    prevEvent = jasmine.createSpy('prevEvent'),
    nextEvent = jasmine.createSpy('nextEvent'),
    readyEvent = jasmine.createSpy('readyEvent'),
    itemsdoneEvent = jasmine.createSpy('itemsdoneEvent'),
    refreshEvent = jasmine.createSpy('refreshEvent'),
    emptyitemsEvent = jasmine.createSpy('emptyitemsEvent'),
    carousel1 = $('.carousel1').carousel({
        'limitPerPage': 4,
        'fx': false,
    }).on('select', function () { selectEvent(); })
        .on('prev', function () { prevEvent(); })
        .on('next', function () { nextEvent(); })
        .on('ready', function () { readyEvent(); })
        .on('itemsdone', function () { itemsdoneEvent(); })
        .on('refresh', function () { refreshEvent(); })
        .on('emptyitems', function () { emptyitemsEvent(); }),
    carousel2 = $('.carousel2').carousel({
        'limitPerPage': 4,
        'arrows': false,
        'pagination': true,
        'fx': false
    }),
    carousel3 = $('.carousel3').carousel({
        'limitPerPage': 2,
        'async': 5,
        'fx': false,
        'pagination': false
    }).on('itemsadd', function ($items) {
        $.each($items, function (i, e) {
            e.innerHTML = 'TESTING ASYNCHRONOUS ITEM Nº' + i;
        });
    }),
    carousel4 = $('.carousel4').carousel().on('destroy', function () { destroyEvent(); });

describe('Carousel', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Carousel')).toBeTruthy();
        expect(typeof ch.Carousel).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('carousel')).toBeTruthy();
        expect(typeof $.fn.carousel).toEqual('function');
    });

    it('should return a new instance', function () {
        expect(carousel1 instanceof ch.Carousel).toBeTruthy();
    });

    it('should emit the "ready" event when it\'s ready', function () {
        waits(50);
        runs(function () {
            expect(readyEvent).toHaveBeenCalled();
        });
    });
});

describe('It should have the following public properties:', function () {

    it('.name', function () {
        expect(carousel1.name).not.toEqual(undefined);
        expect(typeof carousel1.name).toEqual('string');
        expect(carousel1.name).toEqual('carousel');
    });

    it('.constructor', function () {
        expect(carousel1.constructor).not.toEqual(undefined);
        expect(typeof carousel1.constructor).toEqual('function');
    });

    it('.uid', function () {
        expect(carousel1.uid).not.toEqual(undefined);
        expect(typeof carousel1.uid).toEqual('number');
    });
});

describe('It should have the following public methods:', function () {

    var methods = ['destroy', 'select', 'prev', 'next', 'refresh', 'enable', 'disable'],
        i = 0,
        len = methods.length;

    for (i; i < len; i += 1) {
        (function (i){
            it('.' + methods[i] + '()', function () {
                expect(carousel1[methods[i]]).not.toEqual(undefined);
                expect(typeof carousel1[methods[i]]).toEqual('function');
            });
        }(i));
    }
});

describe('It should have two navigation controls:', function () {

    describe('Previous button', function () {

        var $btn = carousel1._$el.children(':first');

        it('should exist', function () {
            expect($btn[0].nodeType).toEqual(1);
        });

        describe('should have the following WAI-ARIA roles and properties:', function () {

            it('role: button', function () {
                expect($btn.attr('role')).toEqual('button');
            });

            it('aria-hidden: true in the first page', function () {
                expect($btn.attr('aria-hidden')).toBeTruthy();
            });
        });

        describe('should have the following ID and Classnames:', function () {

            it('.ch-carousel-prev', function () {
                expect($btn.hasClass('ch-carousel-prev')).toBeTruthy();
            });

            it('.ch-carousel-disabled in the first page', function () {
                expect($btn.hasClass('ch-carousel-disabled')).toBeTruthy();
            });

            it('.ch-user-no-select', function () {
                expect($btn.hasClass('ch-user-no-select')).toBeTruthy();
            });
        });
    });

    describe('Next button', function () {

        var $btn = carousel1._$el.children(':eq(2)');

        it('should exist', function () {
            expect($btn[0].nodeType).toEqual(1);
        });

        describe('should have the following WAI-ARIA roles and properties:', function () {

            it('role: button', function () {
                expect($btn.attr('role')).toEqual('button');
            });

            it('aria-hidden: false in the first page', function () {
                expect($btn.attr('aria-hidden')).toEqual('false');
            });
        });

        describe('should have the following ID and Classnames:', function () {

            it('.ch-carousel-next', function () {
                expect($btn.hasClass('ch-carousel-next')).toBeTruthy();
            });

            it('shouldn\'t have the .ch-carousel-disabled classname in the first page', function () {
                expect($btn.hasClass('ch-carousel-disabled')).toBeFalsy();
            });

            it('.ch-user-no-select', function () {
                expect($btn.hasClass('ch-user-no-select')).toBeTruthy();
            });
        });
    });
});

describe('It should have a Mask element that', function () {

    var $mask = carousel1._$el.children().eq(1);

    it('should exist', function () {
        expect($mask[0].nodeType).toEqual(1);
    });

    it('should have the WAI-ARIA role "tabpanel"', function () {
        expect($mask.attr('role')).toEqual('tabpanel');
    });

    it('should have the "ch-carousel-mask" classname:', function () {
        expect($mask.hasClass('ch-carousel-mask')).toBeTruthy();
    });

    describe('should have the initial list element that', function () {

        var $list = $mask.children();

        it('should exist', function () {
            expect($list[0].nodeType).toEqual(1);
        });

        it('should have the "ch-carousel-list" classname', function () {
            expect($list.hasClass('ch-carousel-list')).toBeTruthy();
        });

        describe('should have each individual item or element into the list:', function () {

            var $items = $list.children(),
                $firstItem = $items.eq(0),
                $lastItem = $items.eq(-1),
                total = $items.length.toString();

            describe('First element: Should have the following WAI-ARIA roles and properties:', function () {

                it('aria-hidden: false in the first page', function () {
                    expect($firstItem.attr('aria-hidden')).toEqual('false');
                });

                it('aria-setsize: The same amount than items into the list', function () {
                    expect($firstItem.attr('aria-setsize')).toEqual(total);
                });

                it('aria-posinset: 1, because it\s the first element', function () {
                    expect($firstItem.attr('aria-posinset')).toEqual('1');
                });

                it('aria-label: "page1", because it\s in the first page', function () {
                    expect($firstItem.attr('aria-label')).toEqual('page1');
                });
            });

            describe('Last element: Should have the following WAI-ARIA roles and properties:', function () {

                it('aria-hidden: true in the last page', function () {
                    expect($lastItem.attr('aria-hidden')).toBeTruthy();
                });

                it('aria-setsize: The same amount than items into the list', function () {
                    expect($lastItem.attr('aria-setsize')).toEqual(total);
                });

                it('aria-posinset: The same amount than items into the list, because it\s the last element', function () {
                    expect($lastItem.attr('aria-posinset')).toEqual(total);
                });

                it('aria-label: "page5", because it\s in the last page', function () {
                    expect($lastItem.attr('aria-label')).toEqual('page' + carousel1._pages);
                });
            });
        });
    });
});

describe('Its select() method', function () {

    it('should move to a specific page (4)', function () {

        expect(carousel1._currentPage).not.toEqual(4);

        carousel1.select(4);

        expect(carousel1._currentPage).toEqual(4);
    });

    it('should emit the "select" event when it\'s translated', function () {
        expect(selectEvent.callCount).toEqual(1);
    });
});

describe('Its prev() method', function () {

    it('should move one page at a time', function () {

        carousel1.prev();

        expect(carousel1._currentPage).toEqual(3);

        carousel1.prev();

        expect(carousel1._currentPage).toEqual(2);
    });

    it('should emit the "select" and "prev" events when it\'s translated', function () {
        expect(selectEvent.callCount).toEqual(3);
        expect(prevEvent.callCount).toEqual(2);
    });

    it('shouldn\'t move beyond the first page', function () {

        carousel1.select(1).prev();

        expect(carousel1._currentPage).toEqual(1);
    });
});

describe('Its next() method', function () {

    it('should move one page at a time', function () {

        carousel1.next();

        expect(carousel1._currentPage).toEqual(2);

        carousel1.next();

        expect(carousel1._currentPage).toEqual(3);
    });

    it('should emit the "select" and "next" events when it\'s translated', function () {
        expect(selectEvent.callCount).toEqual(6);
        expect(nextEvent.callCount).toEqual(2);
    });

    it('shouldn\'t move beyond the last page', function () {

        carousel1.select(carousel1._pages).next();

        expect(carousel1._currentPage).toEqual(carousel1._pages);
    });
});

describe('Its refresh() method', function () {

    it('should emit the "refresh" event when the public method "refresh" is executed and the amount of items changes', function () {
        expect(refreshEvent.callCount).toEqual(0);
        carousel1._$items.eq(0).remove();
        carousel1.refresh();
        expect(refreshEvent.callCount).toEqual(1);
    });
});

describe('Its movement should respect the buttons visibility and abailability', function () {

    var $prevButton = carousel1._$mask.prev();
        $nextButton = carousel1._$mask.next();

    it('in the middle page', function () {

        carousel1.select(3);

        expect($prevButton.attr('aria-disabled')).toEqual('false');
        expect($prevButton.hasClass('ch-carousel-disabled')).toBeFalsy();

        expect($nextButton.attr('aria-disabled')).toEqual('false');
        expect($nextButton.hasClass('ch-carousel-disabled')).toBeFalsy();
    });

    it('in the first page', function () {

        carousel1.select(1);

        expect($prevButton.attr('aria-disabled')).toEqual('true');
        expect($prevButton.hasClass('ch-carousel-disabled')).toBeTruthy();

        expect($nextButton.attr('aria-disabled')).toEqual('false');
        expect($nextButton.hasClass('ch-carousel-disabled')).toBeFalsy();
    });

    it('in the last page', function () {

        carousel1.select(carousel1._pages);

        expect($prevButton.attr('aria-disabled')).toEqual('false');
        expect($prevButton.hasClass('ch-carousel-disabled')).toBeFalsy();

        expect($nextButton.attr('aria-disabled')).toEqual('true');
        expect($nextButton.hasClass('ch-carousel-disabled')).toBeTruthy();
    });
});

describe('Its Next and Prev navigation controls', function () {
    it('shouldn\'t exist when it\'s specified by configuration', function () {
        expect(carousel2._$el.find('.ch-carousel-prev').length).toEqual(0);
        expect(carousel2._$el.find('.ch-carousel-next').length).toEqual(0);
    });
});

describe('Its pagination controls', function () {

    var $pages = carousel2._$el.children(':last'),
        $pagesCarousel1 = carousel1._$el.children(':last'),
        $pagesCarousel3 = carousel3._$el.children(':last'),
        $thumbs = $pages.children();

    it('shouldn\'t exist by default', function () {
        expect($pagesCarousel1.hasClass('ch-carousel-pages')).not.toBeTruthy();
    });

    it('should exist when it\'s specified by configuration', function () {
        expect($pages[0].nodeType).toEqual(1);
    });

    it('shouldn\'t exist when it\'s specified by configuration', function () {
        expect($pagesCarousel3.hasClass('ch-carousel-pages')).not.toBeTruthy();
    });

    it('should have the WAI-ARIA role "navigation"', function () {
        expect($pages.attr('role')).toEqual('navigation');
    });

    describe('should have the following ID and Classnames:', function () {

        it('.ch-carousel-pages', function () {
            expect($pages.hasClass('ch-carousel-pages')).toBeTruthy();
        });

        it('.ch-user-no-select', function () {
            expect($pages.hasClass('ch-user-no-select')).toBeTruthy();
        });
    });

    describe('should have thumbnails:', function () {

        it('The same amount of thumbs than total amount of items in the Carousel', function () {
            expect($thumbs.length).toEqual(carousel1._pages);
        });

        describe('First thumb (a selected thumb)', function () {

            var $thumb = $thumbs.eq(0);

            it('should have the data-page attribute with the value "1"', function () {
                expect($thumb.attr('data-page')).toEqual('1');
            });

            it('should have the "ch-carousel-selected" classname, because it\'s selected right now', function () {
                expect($thumb.hasClass('ch-carousel-selected')).toBeTruthy();
            });

            describe('should have the following WAI-ARIA roles and properties:', function () {

                it('role: button', function () {
                    expect($thumb.attr('role')).toEqual('button');
                });

                it('aria-selected: true in the first page', function () {
                    expect($thumb.attr('aria-selected')).toBeTruthy();
                });

                it('aria-controls: page1', function () {
                    expect($thumb.attr('aria-controls')).toEqual('page1');
                });
            });
        });

        describe('Last thumb (a non-selected thumb)', function () {

            var $thumb = $thumbs.eq(-1);

            it('should have the data-page attribute with the value "5"', function () {
                expect($thumb.attr('data-page')).toEqual(carousel1._pages.toString());
            });

            it('shouldn\'t have the "ch-carousel-selected" classname, because it isn\'t selected right now', function () {
                expect($thumb.hasClass('ch-carousel-selected')).toBeFalsy();
            });

            describe('should have the following WAI-ARIA roles and properties:', function () {
                it('aria-selected: false in the last page', function () {
                    expect($thumb.attr('aria-selected')).toEqual('false');
                });
            });
        });

        it('should change when another page is selected', function () {

            carousel2.select(1);

            expect($thumbs.eq(0).hasClass('ch-carousel-selected')).toBeTruthy();
            expect($thumbs.eq(2).hasClass('ch-carousel-selected')).toBeFalsy();

            carousel2.select(3);

            expect($thumbs.eq(0).hasClass('ch-carousel-selected')).toBeFalsy();
            expect($thumbs.eq(2).hasClass('ch-carousel-selected')).toBeTruthy();
        });
    });
});

describe('Its asynchronous feature', function () {

    it('should add the next arrow', function () {
        expect(carousel3._$el.children('.ch-carousel-next').hasClass('ch-carousel-disabled')).toBeFalsy();
    });

    it('should add two items on next page', function () {

        var items = carousel3._$items.length,
            expectedItems = items + carousel3._limitPerPage;

        carousel3.next();

        expect(carousel3._$items.length).toEqual(expectedItems);
    });

    it('should add multiple items on next 2 pages selection (through select() method or pagination)', function () {

        var move = 2, // Amount of pages to move
            items = carousel3._$items.length,
            expectedItems = items + (carousel3._limitPerPage * move);

        carousel3.select(carousel3._currentPage + move);

        expect(carousel3._$items.length).toEqual(expectedItems);
    });
});

describe('Its destroy() method', function () {

    var itemsAmount = $('.carousel4 li').length;

    carousel4.destroy();

    it('should reset the _$el', function () {
        expect($('.carousel4 li').length).toEqual(itemsAmount);
    });

    it('should remove ".carousel" events', function () {
        expect($._data($('.carousel4')[0], 'events')).toBeUndefined();
    });

    it('should remove the instance from the element', function () {
        expect($('.carousel4').data('carousel')).toBeUndefined();
    });

    it('should emit the "destroy" event', function () {
        expect(destroyEvent).toHaveBeenCalled();
    });
});