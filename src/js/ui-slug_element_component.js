/**
* ui-slug_element Vanilla Javascript library
* @authors: ibarbieri
* @description: this library support all browsers and is developed almost all in vanilla javascrip.
*/

(function (win) {

	'use strict';

	// Component declarations and initial values
	var elementTopPosition,
		elementToFix,
		elementInitialTopPosition,
		lastElementTopPosition,
		scrolling = false,
		isFixed = false,
		cloned,
		hasClassUpAnimation = false,
		hasClassDownAnimation = false,
		elementCloned,
		on = (win.addEventListener !== undefined) ? 'addEventListener' : 'attachEvent',
        scrollEvent = (on === 'attachEvent') ? 'onscroll' : 'scroll',
		positionScrollBefore = (win.pageYOffset !== undefined) ? win.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
		positionScrollAfter,
		positionScrollNow,
		transitionProperty;


	// requestAnimationFrame cross browser
	var x,
		vendors = ['ms', 'moz', 'webkit', 'o'],
		vendorsLength = vendors.length,
		currTime,
		timeToCall,
		id,
		lastTime;

	for (x = 0; x < vendorsLength && !win.requestAnimationFrame; x += 1) {
		win.requestAnimationFrame = win[vendors[x]+'RequestAnimationFrame'];
	}


	// requestAnimationFrame fallback
	if (!win.requestAnimationFrame) {
		win.requestAnimationFrame = function (callback, element) {

			currTime = new Date().getTime(),
			timeToCall = Math.max(0, 16 - (currTime - lastTime)),
			id = win.setTimeout( function() {
				callback(currTime + timeToCall);
			}, timeToCall);


			lastTime = currTime + timeToCall;

			return id;
		};
	}


	/**
	 * Class constructor definition
	 * @param {String} string of the class element to fixed.
	 * @example
	 * new SlugElement('class-element-to-fix');
	 */
	function SlugElement(elementToFixClassName, transitionPropertyName, transitionStartValue, transitionEndValue) {

		var that = this;

		// Second parameter height as default becouse is optional
		if (transitionPropertyName == undefined) {
			transitionPropertyName = 'height';
		}

		elementToFix = document.getElementsByClassName(elementToFixClassName)[0],

		positionScrollAfter = (win.pageYOffset !== undefined) ? win.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

		// Plus win.pageYOffset to cover the case where the page is loaded with scrollY so the elemet to fix is not visible.
		// For this case always need to know the initial position of the element to fix.
		elementInitialTopPosition = elementToFix.getBoundingClientRect().top + positionScrollAfter,// Missing fallback to IE8

		cloned = elementToFix.cloneNode(true);
		cloned.className += ' se-cloned-element ';
		cloned.setAttribute('aria-hidden', 'true');

		elementToFix.parentNode.appendChild(cloned);

		// Get the cloned element
		elementCloned = document.querySelector('.se-cloned-element');


		// Set the transitions properties
		elementCloned.className += ' se-height-transition ';


		// Listen the scroll event
		win[on](scrollEvent, function (event) {

			if (!scrolling) {
				win.requestAnimationFrame(that.checkElementFixedState);
				scrolling = true;
			}

			if (positionScrollBefore > elementTopPosition) {

				positionScrollNow = win.pageYOffset;

				if (positionScrollNow > positionScrollBefore) {

					elementCloned.style.height = transitionStartValue +'px';

				} else {

					elementCloned.style.height = transitionEndValue +'px';

				}

				positionScrollBefore = positionScrollNow;

			};
		});

	}



	/**
	 * Check the state of the fixed element. If it is fixed or not. Show/hide the cloned element.
	 * @example
	 * this.checkElementFixedState();
	 */
	SlugElement.prototype.checkElementFixedState = function () {

		//Get the top positions of the element (top, right, bottom, left)
		elementTopPosition = elementToFix.getBoundingClientRect().top;

		if (!isFixed) {
			if (elementTopPosition < 0) {
				cloned.setAttribute('aria-hidden', 'false');
				isFixed = true;
			}

		} else {

			positionScrollAfter = (win.pageYOffset !== undefined) ? win.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

			lastElementTopPosition = cloned.getBoundingClientRect().top + positionScrollAfter;

			if (lastElementTopPosition <= elementInitialTopPosition) {
				cloned.setAttribute('aria-hidden', 'true');
				isFixed = false;
			}
		}

		scrolling = false;

	};



	// Expose the component
	 win.SlugElement = SlugElement;


})(this);