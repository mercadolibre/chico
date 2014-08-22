(function (window, ch, Carousel) {
    'use strict';

    /**
     * rAF request Animation Frame
     * @private
     * @type Function()
     */
    var rAF = (function(){
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    }());

    Carousel.prototype.addTouchEvents = function () {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;
            
        /**
         * Element that wraps the list and denies its overflow.
         * @private
         */
        this.mask = this._$mask[0];

        /**
         * Element that moves (slides) across the component (inside the mask).
         * @private
         */
        this.list = this._$list[0];

        /**
         * The X position of the first touch.
         * @private
         * @type {Number}
         */
        this._startTouchX = 0;

        /**
         * The Y position of the first touch.
         * @private
         * @type {Number}
         */
        this._startTouchY = 0;
         
        /**
         * The X position of the final touch.
         * @private
         * @type {Number}
         */
        this._endTouchX = 0;

        /**
         * The X position of the last touch.
         * @private
         * @type {Number}
         */
        this._partialTouchX;

        /**
         * Set the minimum touch width to change page
         * @private
         * @type {Number}
         */
        this._minimumTouch = this._maskWidth/3;

        /**
         * Saved total displacement value
         * @private
         * @type {Number}
         */
        this._displacement = this._pageWidth * (this._currentPage - 1);

        /**
         * Flag to check the scroll state
         * @private
         * @type Boolean
         */
        this._disabledScrollY = false;


        // this._$mask.on(ch.onpointerdown, function(event) { 
        this._$mask.on('touchstart', function(event) { 
            var touchesList = event.touches || event.originalEvent.touches;
            that._handleStart(touchesList[0]); 
        });
        
        // this._$mask.on(ch.onpointerup, function(event) { 
        this._$mask.on('touchend', function(event) { 
            var touchesList = event.changedTouches || event.originalEvent.touches;
            that._handleEnd(touchesList[0]); 
        });

        // this._$mask.on(ch.onpointermove, function(event) { 
        this._$mask.on('touchmove', function(event) { 
            var touchesList = event.touches || event.originalEvent.touches;
            that._handleMove(touchesList[0]); 
        });

    };

    /**
     * this._animateCarousel()
     * Call the animation method and changes de flag value
     * @memberof! ch.Carousel.prototype
     * @private
     * @type Function()
     */
    Carousel.prototype._animateCarousel = function(x) {

        // call animation
        this._translate(x);

        // After animation, change de flag to allow the next animation 
        this._moved = false;

    };
    
    /**
     * this._captureMove()
     * @memberof! ch.Carousel.prototype
     * @private
     * @type Function()
     */
    Carousel.prototype._captureMove = function(x) {

        if (!this._moved) { // check if exists another animation executed

            var that = this;

            // set flag with true value, to prevent multiple animations
            this._moved = true;
            
            // call rAF with carousel animation method how params
            rAF(function() {
                that._animateCarousel(x);
            });

        }

    };

    /**
     * this._handleStart()
     * @memberof! ch.Carousel.prototype
     * @private
     * @type Function()
     * @param {Number} touchProperties all properies of currentTouch event
     */
    Carousel.prototype._handleStart = function(touchProperties) {

        // Delete efects on list to make changes instantly
        this._$list.addClass('ch-carousel-nofx');

        // Obtenemos la posición referente al eje X del primer toque
        this._startTouchX = touchProperties.clientX;
        this._startTouchY = touchProperties.clientY;
        this._partialTouchX = touchProperties.clientX;

    };

    /**
     * this._handleEnd()
     * Is evaluated based on the movement if done you have to go to the next or previous page of the carousel
     * @memberof! ch.Carousel.prototype
     * @private
     * @type Function()
     * @param {Number} touchProperties all properies of currentTouch event
     */
    Carousel.prototype._handleEnd = function(touchProperties) {

        // get the X position of last touch
        this._endTouchX = touchProperties.clientX;

        // calculate the total width of touch event
        var touchWidth = this._startTouchX - this._endTouchX,
            // force touchWidth to positive value (distance always is positive)
            touchDistance = Math.abs(touchWidth); 
        
        // Activate effects
        this._$list.removeClass('ch-carousel-nofx');

        if ( touchDistance >= this._minimumTouch ) {  // if the touch distance is higher that minimum touch width

            if (touchWidth > 0) { // if touch go from right to left

                if (this._currentPage === this._pages) { // if last page, don't get de next page
                    this._captureMove(-this._pageWidth * (this._currentPage - 1));
                } else {
                    this.next();
                }

            } else { // if touch go from left to right

                if (this._currentPage === 1) { // if fist page, don't get de previous page
                    this._captureMove(0);
                } else {
                    this.prev();
                }

            }

        } else { // if the touch distance is minnor that minimum touch width, 
            
            // back carousel to previus position
            this._captureMove(-this._pageWidth * (this._currentPage - 1));

        }

        // After touch end, available scroll again
        if (this._disabledScrollY) {
            document.body.style.overflow = 'initial';
            this._disabledScrollY = false;
        }

    };

    /**
     * this._handleMove()
     * @memberof! ch.Carousel.prototype
     * @private
     * @type Function()
     * @param {Number} touchProperties all properies of currentTouch event
     */
    Carousel.prototype._handleMove = function(touchProperties) {
        
        var currentTouchmove,
            touchmove;

        currentTouchmove = -(this._partialTouchX - touchProperties.clientX);
        touchmove = currentTouchmove + this._displacement;

        // If the movement is horizontal, disabled scroll pages
        if ( Math.abs(currentTouchmove) > 10 && !this._disabledScrollY) {
            event.preventDefault();
            document.body.style.overflow = 'hidden';
            // change de scroll status flag 
            this._disabledScrollY = true;
        } 

        // Update the partial touch (x) value 
        this._partialTouchX = touchProperties.clientX;

        // Call animation method
        this._captureMove(touchmove);

    };

    /**
     * Moves the list corresponding to specified displacement.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     * @param {Number} displacement Distance to move the list.
     */
    Carousel.prototype._translate = (function () {
        // CSS property written as string to use on CSS movement
        var transform = '-' + ch.util.VENDOR_PREFIX + '-transform';
        
        // Use CSS transform to move
        if (ch.support.transition) {
            return function (displacement) {
                this._$list.css(transform, 'translate3d(' + displacement + 'px,0,0)');
                this._displacement = displacement;
                // console.log('_translate():: displacement', displacement);
            };
        }

        // Use JS to move
        // Ask for fx INTO the method because the "fx" is an instance property
        return function (displacement) {
            this._$list[(this._options.fx) ? 'animate' : 'css']({'left': displacement});
            this._displacement = displacement;
        };
    }());

    /**
     * this._handleStart()
     * @private
     * @type Function()
     */
    Carousel.prototype.initialize = function() {

        this.addTouchEvents();

    };    

}(this, this.ch, this.ch.Carousel));
