/**
* Positioner lets you centralize and manage changes related to positioned elements. Positioner returns an utility that resolves positioning for all widget.
* @name Positioner
* @class Positioner
* @memberOf ch
* @param {Object} conf Configuration object with positioning properties.
* @param {String} conf.element Reference to the DOM Element to be positioned.
* @param {String} [conf.context] It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the viewport.
* @param {String} [conf.points] Points where element will be positioned, specified by configuration or center by default.
* @param {String} [conf.offset] Offset in pixels that element will be displaced from original position determined by points. It's specified by configuration or zero by default.
* @param {Boolean} [conf.reposition] Parameter that enables or disables reposition intelligence. It's disabled by default.
* @requires ch.Viewport
* @see ch.Viewport
* @returns {Function} The Positioner returns a Function that it works in 3 ways: as a setter, as a getter and with the "refresh" parameter refreshes the position.
* @exampleDescription
* Instance the Positioner It requires a little configuration.
* The default behavior place an element center into the Viewport.
*
* @example
* var positioned = ch.Positioner({
*     element: "#element1",
* });
* @exampleDescription 1. Getting the current configuration properties.
* @example
* var configuration = positioned()
* @exampleDescription 2. Updates the current position with <code>refresh</code> as a parameter.
* @example
* positioned("refresh");
* @exampleDescription 3. Define a new position
* @example
* positioned({
*     element: "#element2",
*     context: "#context2",
*     points: "lt rt"
* });
* @exampleDescription <strong>Offset</strong>: The Positioner could be configurated with an offset.
* This example show an element displaced horizontally by 10px of defined position.
* @example
* var positioned = ch.Positioner({
*     element: "#element3",
*     context: "#context3",
*     points: "lt rt",
*     offset: "10 0"
* });
* @exampleDescription <strong>Reposition</strong>: RePositioner feature moves the postioned element if it can be shown into the viewport.
* @example
* var positioned = ch.Positioner({
*     element: "#element4",
*     context: "#context4",
*     points: "lt rt",
*     reposition: true
* });
*/
(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    var $window = $(window),
        $html = $('html'),
        defaults = {
            'offsetX': 0,
            'offsetY': 0,
            'side': 'center',
            'align': 'center',
            'reference': ch.viewport,
            'position': 'fixed'
        };

    function Positioner() {
        var that = this;

        that.position = function (options) {

            if (options === undefined) {
                throw new window.Error('ch.Positioner: Expected options defined.');
            }

            that._options = $.extend(ch.util.clone(defaults), options);

            that._options.offsetX = parseInt(that._options.offsetX, 10);
            that._options.offsetY = parseInt(that._options.offsetY, 10);

            that.position._$target = that._options.target;

            // Default is the viewport
            that.position._$reference = that.position._reference = that._options.reference;

            if (that.position._reference !== ch.viewport) {
                that._options.position = 'absolute';
            }

            that.position._$target.css('position', that._options.position);
        };

        this.position.refresh = function (options) {

            if (options !== undefined) {
                that._options = $.extend(that._options, options);
                that._options.offsetX = parseInt(that._options.offsetX, 10);
                that._options.offsetY = parseInt(that._options.offsetY, 10);

                that.position._$target = options.target || that.position._$target;
                that.position._$reference = options.reference || that.position._$reference;
            }

            that.position._calculateTarget();

            if (that.position._reference !== ch.viewport) {
                that.position._calculateReference();
            }

            // the object that stores the top, left reference to set to the target
            that.position._setPoint();

            return that;
        };

        that.position._calculateTarget = function ($target) {
            if ($target !== undefined) {
                that.position._$target = $target;
            }

            var $target = that.position._$target.attr({
                    'data-side': that._options.side,
                    'data-align': that._options.align
                }),
                outer = ch.util.getOuterDimensions($target[0]);

            that.position._target = {
                'width': outer.width,
                'height': outer.height
            };

            return that;
        };

        that.position._calculateReference = function ($reference) {
            if ($reference !== undefined) {
                that.position._$reference = $reference;
            }

            var $reference = that.position._$reference.attr({
                    'data-side': that._options.side,
                    'data-align': that._options.align
                }),
                reference = $reference[0],
                outer = ch.util.getOuterDimensions(reference),
                offset = ch.util.getOffset(reference);

            that.position._reference = {
                'width': outer.width,
                'height': outer.height
            };

            if (reference.offsetParent === that.position._$target[0].offsetParent) {
                that.position._reference.left = reference.offsetLeft;
                that.position._reference.top = reference.offsetTop;
            } else {
                that.position._reference.left = offset.left;
                that.position._reference.top = offset.top;
            }
        };

        that.position._setPoint = function () {

            var side = that._options.side,
                oritentation = (side === 'top' || side === 'bottom') ? 'horizontal' : ((side === 'right' || side === 'left') ? 'vertical' : 'center'),
                coors,
                oritentationMap;

            // take the side and calculate the alignment and make the CSSpoint
            if (oritentation === 'center') {
                // calculates the coordinates related to the center side to locate the target
                coors = {
                    'top': (that.position._reference.top + (that.position._reference.height / 2 - that.position._target.height / 2)),
                    'left': (that.position._reference.left + (that.position._reference.width / 2 - that.position._target.width / 2))
                };

            } else if (oritentation === 'horizontal') {
                // calculates the coordinates related to the top or bottom side to locate the target
                oritentationMap = {
                    'left': that.position._reference.left,
                    'center': (that.position._reference.left + (that.position._reference.width / 2 - that.position._target.width / 2)),
                    'right': (that.position._reference.left + that.position._reference.width - that.position._target.width),
                    'top': that.position._reference.top - that.position._target.height,
                    'bottom': (that.position._reference.top + that.position._reference.height)
                };

                coors = {
                    'top': oritentationMap[side],
                    'left': oritentationMap[that._options.align]
                }

            } else {
                // calculates the coordinates related to the right or left side to locate the target
                oritentationMap = {
                    'top': that.position._reference.top,
                    'center': (that.position._reference.top + (that.position._reference.height / 2 - that.position._target.height / 2)),
                    'bottom': (that.position._reference.top + that.position._reference.height - that.position._target.height),
                    'right': (that.position._reference.left + that.position._reference.width),
                    'left': (that.position._reference.left - that.position._target.width)
                };

                coors = {
                    'top': oritentationMap[that._options.align],
                    'left': oritentationMap[side]
                }
            }

            coors.top += that._options.offsetY;
            coors.left += that._options.offsetX;

            that.position._$target.css(coors);

        };
    }

    ch.Positioner = Positioner;

}(this, (this.jQuery || this.Zepto), this.ch));