/**
* Anchors is a Javascript library to animate the transitions between anchors.
* @authors: ibarbieri
* @description: this library support all browsers and is code in vanilla javascrip.
*/

(function (win) {
    'use strict';

    var requestAnimationFrame = (function () {
            return win.requestAnimationFrame ||
                win.webkitRequestAnimationFrame ||
                win.mozRequestAnimationFrame ||
                function (callback) {
                    win.setTimeout(callback, 1000, 60);
                };
        }()),
        on = (win.addEventListener !== undefined) ? 'addEventListener' : 'attachEvent',
        scrollEvent = (on === 'attachEvent') ? 'onscroll' : 'scroll',
        clickEvent = (on === 'attachEvent') ? 'onclick' : 'click',
        scrolling = false,
        i,
        navControls = win.document.querySelectorAll('[data-section]'),
        sections = win.document.getElementsByTagName('section'),
        sectionsLength = sections.length,
        sectionsPositions = [],
        sectionSelected;


    // Save the offsetTop position plus the section height
    for (i = 0; i < sectionsLength; i += 1) {
        sectionsPositions.push((sections[i].offsetTop + (sections[i].offsetHeight)));
    }


    /**
    * Create the Anchors class constructor.
    */
    function Anchors(element) {

        var that = this,
            selected = element.querySelector('.nav-selected');

        // check if the the class 'nav-selected' dosen´t exist.
        if (selected === null) {
            this.selected = element.querySelector('[data-section]');
            this.selected.className += ' nav-selected';
        } else {
            // save the last selected. Probar que pasa si el implementador no pone selected
            this.selected = selected;
        }

        // listen de click event of all the element in de nav-sections
        element[on](clickEvent, function (event) {
            // 'that' is the 'this' before the addEventListener and 'event' is the event that pass to the function setSelected.
            // Becouse the this in the addEventListener is window and i need tha be the this in anchors.
            that.setSelected.call(that, event);
        });

        win[on](scrollEvent, function (event) {

            that.runSelectionFunction.call(that, event);

            // If the ScrollY is on the bottom of the page, select the last navControl
            if ((win.innerHeight + win.scrollY) >= win.document.body.offsetHeight) {

                sectionSelected = sectionsLength - 1;

                that.selectSectionOnScroll(sectionSelected);
            }
        });

    }


    /**
     * Animate the scrollY when an anchor is clicked.
     * @function
     * @param {Number} to The position of start
     * @param {Number} duration dsadsadas
     * @example
     * this.animateScroll(45, 0.5);
     */
    Anchors.prototype.animateScroll = function (to, duration) {

        // Use that becouse in this context the 'this' refers to the clicked element and i need the 'this' of the animateScroll.
        // So i save the 'this' in the var that.
        var that = this,

            start = (win.pageYOffset !== undefined) ? win.pageYOffset : (win.scrollTop - win.offsetTop),
            change = to - start,
            currentTime = 0,
            increment = 20,

            animationOfScroll = function () {
                currentTime += increment;
                var val = that.easeAnimation(currentTime, start, change, duration);

                win.scroll(start, val);

                if (currentTime < duration) {
                    win.setTimeout(animationOfScroll, increment);
                }
            };

        animationOfScroll();
    };


    /**
     * Ease the animation of the window
     * @function
     * @param {Number} t Current time.
     * @param {Number} b Star position (pageYOffset).
     * @param {Number} c Is the to position less the start position.
     * @param {Number} d Duration of the animation
     * @returns {Number}
     * @example
     * that.easeAnimation(0, 500, 150, 10000);
     */
    Anchors.prototype.easeAnimation = function (t, b, c, d) {
        t /= d / 2;

        if (t < 1) {
            return c / 2 * t * t + b;
        }

        t -= 1;

        return -c / 2 * (t * (t - 2) - 1) + b;
    };


    /**
     * Set a button selected when an anchor is clicked.
     * @function
     * @param {Event} event The click event into the nav-sections element
     * @returns {Nothig} Return nothing for cut the ejecution if the nodeName clicked is different yo <a>.
     * @example
     * this.setSelected(event);
     */
    Anchors.prototype.setSelected = function (event) {

        var target = event.target || event.srcElement;


        // Ask if the clicked element is diferent to <a>
        if (target.nodeName !== 'A') {
            return;
        }

        // Prevent de default event (click to anchor)
        event.preventDefault();

        // Get the id of the section that will animate
        var idElementClicked = target.getAttribute('data-section'),
            // Get the Y position of the corresponding sectionPosition
            sectionPosition = win.document.getElementById(idElementClicked).offsetTop;

        // Remove and set de button selected
        this.selected.className = this.selected.className.replace('nav-selected', '');
        target.className += ' nav-selected';
        this.selected = target;

        // Set de hash to the url
        if (win.history.pushState) {
            win.history.pushState(null, null, '#' + target.href.split('#')[1]);
        } else {
            win.location.hash = '#' + target.href.split('#')[1];
        }

        // Animate the window
        this.animateScroll(sectionPosition, 1000);

    };


    /**
     * Set a button selected when the user navigate scrolling the sections.
     * @function
     * @example
     * this.selectSectionOnScroll();
     */
    Anchors.prototype.selectSectionOnScroll = function (sectionSelected) {

        var j;

        for (i = 0; i < sectionsLength; i += 1) {

            if (win.scrollY < sectionsPositions[i]) {

                if (sectionSelected !== i) {

                    //Set the active section
                    sectionSelected = i;

                    // This is becouse when i less 1 to i, i is equal to -1 and in the -1 position of the array of section there isn't anything.
                    if (sectionSelected !== -1) {

                        //Remove all clases nav-selected
                        for (j = 0; j < sectionsLength; j += 1) {
                            navControls[j].className = navControls[j].className.replace(/\bnav-selected\b/, '');
                        }

                        //Set de navControl selected
                        navControls[sectionSelected].className += ' nav-selected';
                    }
                }
                break;
            }
        }

        scrolling = false;
    };


    /**
     * Listen when the scroll is active and call the function animation.
     * @function
     * @example
     * that.runSelectionFunction.call(that, event);
     */
    Anchors.prototype.runSelectionFunction = function () {
        // if scrolling is not false run de function. This is becouse scrolling start in false.
        if (!scrolling) {
            requestAnimationFrame(this.selectSectionOnScroll);
            scrolling = true;
        }
    };

    win.Anchors = Anchors;

}(this));