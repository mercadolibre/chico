describe('Carousel', function () {
	// The configuration object allows to calculate movements by having always the same amount of pages
	var carousel1 = $(".carousel1").carousel({'itemsPerPage': 4}),
		carousel2 = $(".carousel2").carousel({
			'itemsPerPage': 4,
			'arrows': false,
			'pagination': true
		}),
		$el1 = $(carousel1.el),
		$el2 = $(carousel2.el);


	it('Should be defined', function () {
		expect(ch.util.hasOwn(ch, 'Carousel')).toBeTruthy();
		expect(typeof ch.Carousel).toEqual('function');
		expect(carousel1 instanceof ch.Carousel).toBeTruthy();
	});

	describe('Should have the following public properties:', function () {

		it('.el', function () {
			expect(carousel1.el).not.toEqual(undefined);
			expect(carousel1.el.nodeType).toEqual(1);
		});

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

		it('.itemsPerPage', function () {
			expect(carousel1.itemsPerPage).not.toEqual(undefined);
			expect(typeof carousel1.itemsPerPage).toEqual('number');
		});
	});

	describe('Shold have the following public methods:', function () {

		it('.arrows()', function () {
			expect(carousel1.arrows).not.toEqual(undefined);
			expect(typeof carousel1.arrows).toEqual('function');
		});

		it('.next()', function () {
			expect(carousel1.next).not.toEqual(undefined);
			expect(typeof carousel1.next).toEqual('function');
		});

		it('.page()', function () {
			expect(carousel1.page).not.toEqual(undefined);
			expect(typeof carousel1.page).toEqual('function');
		});

		it('.pause()', function () {
			expect(carousel1.pause).not.toEqual(undefined);
			expect(typeof carousel1.pause).toEqual('function');
		});

		it('.play()', function () {
			expect(carousel1.play).not.toEqual(undefined);
			expect(typeof carousel1.play).toEqual('function');
		});

		it('.prev()', function () {
			expect(carousel1.prev).not.toEqual(undefined);
			expect(typeof carousel1.prev).toEqual('function');
		});

		it('.redraw()', function () {
			expect(carousel1.redraw).not.toEqual(undefined);
			expect(typeof carousel1.redraw).toEqual('function');
		});

		it('.select()', function () {
			expect(carousel1.select).not.toEqual(undefined);
			expect(typeof carousel1.select).toEqual('function');
		});
	});

	describe('Should have two navigation controls:', function () {

		describe('Previous button', function () {

			var $btn = $el1.children(':first');

			it('Should exist.', function () {
				expect($btn[0].nodeType).toEqual(1);
			});

			describe('Should have the following WAI-ARIA roles and properties:', function () {

				it('role: button', function () {
					expect($btn.attr('role')).toEqual('button');
				});

				it('aria-hidden: true in the first page', function () {
					expect($btn.attr('aria-hidden')).toBeTruthy();
				});
			});

			describe('Should have the following ID and Classnames:', function () {

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

			var $btn = $el1.children(':last');

			it('Should exist.', function () {
				expect($btn[0].nodeType).toEqual(1);
			});

			describe('Should have the following WAI-ARIA roles and properties:', function () {

				it('role: button', function () {
					expect($btn.attr('role')).toEqual('button');
				});

				it('aria-hidden: false in the first page', function () {
					expect($btn.attr('aria-hidden')).toEqual('false');
				});
			});

			describe('Should have the following ID and Classnames:', function () {

				it('.ch-carousel-next', function () {
					expect($btn.hasClass('ch-carousel-next')).toBeTruthy();
				});

				it('Shouldn\'t have the .ch-carousel-disabled classname in the first page', function () {
					expect($btn.hasClass('ch-carousel-disabled')).not.toBeTruthy();
				});

				it('.ch-user-no-select', function () {
					expect($btn.hasClass('ch-user-no-select')).toBeTruthy();
				});
			});
		});
	});

	describe('Should have a mask element:', function () {

		var $mask = $el1.children().eq(1);

		it('Should exist.', function () {
			expect($mask[0].nodeType).toEqual(1);
		});

		it('Should have the WAI-ARIA role "tabpanel"', function () {
			expect($mask.attr("role")).toEqual('tabpanel');
		});

		describe('Should have the following ID and Classnames:', function () {

			it('.ch-carousel-mask', function () {
				expect($mask.hasClass('ch-carousel-mask')).toBeTruthy();
			});

			it('.ch-carousel-adaptive', function () {
				expect($mask.hasClass('ch-carousel-adaptive')).toBeTruthy();
			});
		});

		describe('Should have the initial List element.', function () {

			var $list = $mask.children();

			it('Should exist.', function () {
				expect($list[0].nodeType).toEqual(1);
			});

			it('Should have the WAI-ARIA role "list"', function () {
				expect($list.attr("role")).toEqual('list');
			});

			it('Should have the "ch-carousel-list" classname', function () {
				expect($list.hasClass('ch-carousel-list')).toBeTruthy();
			});

			describe('Should have each individual item or element into list.', function () {

				var $items = $list.children(),
					$firstItem = $items.eq(0),
					$lastItem = $items.eq(-1),
					total = $items.length.toString();

				it('Should exist (ask for first and last element)', function () {
					expect($firstItem[0].nodeType).toEqual(1);
					expect($lastItem[0].nodeType).toEqual(1);
				});

				describe('First element: Should have the following WAI-ARIA roles and properties:', function () {

					it('role: listitem', function () {
						expect($firstItem.attr('role')).toEqual('listitem');
					});

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

					it('role: listitem', function () {
						expect($lastItem.attr('role')).toEqual('listitem');
					});

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
						expect($lastItem.attr('aria-label')).toEqual('page5');
					});
				});
			});
		});
	});

	describe('page() method', function () {

		describe('As a getter', function () {

			it('Should return 2 after moving from page 1', function () {

				expect(carousel1.page()).toEqual(1);

				carousel1.next();

				expect(carousel1.page()).toEqual(2);
			});
		});

		describe('As a setter', function () {

			it('Should move to a specific page (3)', function () {

				expect(carousel1.page()).not.toEqual(3);

				carousel1.page(3);

				expect(carousel1.page()).toEqual(3);
			});

			it('Should move to the first page by specifying "first" as parameter', function () {

				expect(carousel1.page()).not.toEqual(1);

				carousel1.page('first');

				expect(carousel1.page()).toEqual(1);
			});

			it('Should move to the last page by specifying "last" as parameter', function () {

				expect(carousel1.page()).not.toEqual(5);

				carousel1.page('last');

				expect(carousel1.page()).toEqual(5);
			});
		});

		describe('select() method as alias', function () {

			it('Should be equals both methods', function () {
				expect(carousel1.page).toEqual(carousel1.select);
			});

		});
	});

	describe('prev() method', function () {

		it('Should move one page at a time', function () {

			carousel1.prev();

			expect(carousel1.page()).toEqual(4);

			carousel1.prev();

			expect(carousel1.page()).toEqual(3);
		});

		it('Shouldn\'t move beyond the first page', function () {

			carousel1.page('first').prev();

			expect(carousel1.page()).toEqual(1);
		});
	});

	describe('next() method', function () {

		it('Should move one page at a time', function () {

			carousel1.next();

			expect(carousel1.page()).toEqual(2);

			carousel1.next();

			expect(carousel1.page()).toEqual(3);
		});

		it('Shouldn\'t move beyond the last page', function () {

			carousel1.page('last').next();

			expect(carousel1.page()).toEqual(5);
		});
	});

	describe('itemsPerPage property', function () {

		it('Should return the same number of configuration object', function () {
			expect(carousel1.itemsPerPage).toEqual(4);
		});
	});

	describe('The Carousel movement should respect the buttons visibility and abailability', function () {

		var $prevButton = $el1.children(':first'),
			$nextButton = $el1.children(':last');

		it('In the middle page', function () {

			carousel1.page(3);

			expect($prevButton.attr('aria-hidden')).toEqual('false');
			expect($prevButton.hasClass('ch-carousel-disabled')).not.toBeTruthy();

			expect($nextButton.attr('aria-hidden')).toEqual('false');
			expect($nextButton.hasClass('ch-carousel-disabled')).not.toBeTruthy();
		});

		it('In the first page', function () {

			carousel1.page('first');

			expect($prevButton.attr('aria-hidden')).toEqual('true');
			expect($prevButton.hasClass('ch-carousel-disabled')).toBeTruthy();

			expect($nextButton.attr('aria-hidden')).toEqual('false');
			expect($nextButton.hasClass('ch-carousel-disabled')).not.toBeTruthy();
		});

		it('In the last page', function () {

			carousel1.page('last');

			expect($prevButton.attr('aria-hidden')).toEqual('false');
			expect($prevButton.hasClass('ch-carousel-disabled')).not.toBeTruthy();

			expect($nextButton.attr('aria-hidden')).toEqual('true');
			expect($nextButton.hasClass('ch-carousel-disabled')).toBeTruthy();
		});
	});

	describe('Shouldn\'t have the navigation controls when it is specified by configuration', function () {

		it('Shouldn\'t exists on DOM', function () {
			expect($el2.find('.ch-carousel-prev').length).toEqual(0);
			expect($el2.find('.ch-carousel-next').length).toEqual(0);
		});

		it('The mask shouldn\'t have the "ch-carousel-adaptive" classname', function () {
			expect($el2.children(':first').hasClass('ch-carousel-adaptive')).not.toBeTruthy();
		});
	});

	describe('Should have a navigation control per page when it is specified by configuration', function () {

		var $pages = $el2.children(':last'),
			$thumbs = $pages.children();

		it('Should exist on DOM', function () {
			expect($pages[0].nodeType).toEqual(1);
		});

		it('Should have the WAI-ARIA role "tablist"', function () {
			expect($pages.attr("role")).toEqual('tablist');
		});

		describe('Should have the following ID and Classnames:', function () {

			it('.ch-carousel-pages', function () {
				expect($pages.hasClass('ch-carousel-pages')).toBeTruthy();
			});

			it('.ch-user-no-select', function () {
				expect($pages.hasClass('ch-user-no-select')).toBeTruthy();
			});
		});

		describe('Thumbnails', function () {

			it('Should have the same amount of thumbs than total amount of items in the Carousel', function () {
				expect($thumbs.length).toEqual(5);
			});

			describe('First thumb (a selected thumb):', function () {

				var $thumb = $thumbs.eq(0);

				it('Should have the data-page attribute with the value "1".', function () {
					expect($thumb.attr('data-page')).toEqual('1');
				});

				it('Should have the "ch-carousel-selected" classname, because it\'s selected right now.', function () {
					expect($thumb.hasClass('ch-carousel-selected')).toBeTruthy();
				});

				describe('Should have the following WAI-ARIA roles and properties:', function () {

					it('role: tab', function () {
						expect($thumb.attr('role')).toEqual('tab');
					});

					it('aria-selected: true in the first page', function () {
						expect($thumb.attr('aria-selected')).toBeTruthy();
					});

					it('aria-controls: page1', function () {
						expect($thumb.attr('aria-controls')).toEqual('page1');
					});
				});
			});

			describe('Last thumb (a non-selected thumb):', function () {

				var $thumb = $thumbs.eq(-1);

				it('Should have the data-page attribute with the value "5".', function () {
					expect($thumb.attr('data-page')).toEqual('5');
				});

				it('Shouldn\'t have the "ch-carousel-selected" classname, because it isn\'t selected right now.', function () {
					expect($thumb.hasClass('ch-carousel-selected')).not.toBeTruthy();
				});

				describe('Should have the following WAI-ARIA roles and properties:', function () {

					it('role: tab', function () {
						expect($thumb.attr('role')).toEqual('tab');
					});

					it('aria-selected: false in the last page', function () {
						expect($thumb.attr('aria-selected')).toEqual('false');
					});

					it('aria-controls: page5', function () {
						expect($thumb.attr('aria-controls')).toEqual('page5');
					});
				});
			});

			it('Should change when another page is selected.', function () {

				carousel2.page(1);

				expect($thumbs.eq(0).hasClass('ch-carousel-selected')).toBeTruthy();
				expect($thumbs.eq(2).hasClass('ch-carousel-selected')).not.toBeTruthy();

				carousel2.page(3);

				expect($thumbs.eq(0).hasClass('ch-carousel-selected')).not.toBeTruthy();
				expect($thumbs.eq(2).hasClass('ch-carousel-selected')).toBeTruthy();
			});
		});
	});

	// Arrows configuration: true, false or string: "outside" (default), "over" or "none"
	describe('arrows() method', function () {

		it('Parameter "true" should create new buttons.', function () {

			expect($el2.children(':first').hasClass('ch-carousel-prev')).not.toBeTruthy();

			carousel2.arrows(true);

			expect($el2.children(':first').hasClass('ch-carousel-prev')).toBeTruthy();
		});

		it('Parameter "false" should delete the existing buttons.', function () {

			carousel2.arrows(true);

			expect($el2.children(':first').hasClass('ch-carousel-prev')).toBeTruthy();

			carousel2.arrows(false);

			expect($el2.children(':first').hasClass('ch-carousel-prev')).not.toBeTruthy();
		});

		it('Parameter "none" should delete the existing buttons.', function () {

			carousel2.arrows(true);

			expect($el2.children(':first').hasClass('ch-carousel-prev')).toBeTruthy();

			carousel2.arrows('none');

			expect($el2.children(':first').hasClass('ch-carousel-prev')).not.toBeTruthy();
		});

		it('Parameter "outside" should create new buttons and add the "adaptive" class to the mask.', function () {

			carousel2.arrows(false);

			// First child not to be a button
			expect($el2.children().eq(0).hasClass('ch-carousel-prev')).not.toBeTruthy();
			// First child is the mask, check for the classname
			expect($el2.children().eq(0).hasClass('ch-carousel-adaptive')).not.toBeTruthy();

			carousel2.arrows('outside');

			// First child to be a button
			expect($el2.children().eq(0).hasClass('ch-carousel-prev')).toBeTruthy();
			// Second child to be the mask, check for the classname
			expect($el2.children().eq(1).hasClass('ch-carousel-adaptive')).toBeTruthy();
		});

		it('Parameter "over" should create new buttons without adding the "adaptive" class to the mask.', function () {

			carousel2.arrows(false);

			// First child not to be a button
			expect($el2.children().eq(0).hasClass('ch-carousel-prev')).not.toBeTruthy();
			// First child is the mask, check for the classname
			expect($el2.children().eq(0).hasClass('ch-carousel-adaptive')).not.toBeTruthy();

			carousel2.arrows('over');

			// First child to be a button
			expect($el2.children().eq(0).hasClass('ch-carousel-prev')).toBeTruthy();
			// Second child to be the mask, check for the classname
			expect($el2.children().eq(1).hasClass('ch-carousel-adaptive')).not.toBeTruthy();
		});
	});
});