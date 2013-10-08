(function (window, $, ch) {
    'use strict';

    var $document = $(window.document);

    ch.Validation.prototype._configureContainer = function () {

        var that = this;

        /**
         * Is the little sign that popover showing the validation message. It's a Popover widget, so you can change it's content, width or height and change its visibility state.
         * @type {Bubble}
         * @see ch.Bubble
         */
        this.bubble = this._container = $.bubble({
            'reference': (function () {
                var reference,
                    $trigger = that.$trigger,
                    h4;
                // CHECKBOX, RADIO
                // TODO: when old forms be deprecated we must only support ch-list-options class
                if ($trigger.hasClass('ch-list-options')) {
                // Helper reference from will be fired
                // H4
                    if ($trigger.find('h4').length > 0) {
                        h4 = $trigger.find('h4'); // Find h4
                        h4.wrapInner('<span>'); // Wrap content with inline element
                        reference = h4.children(); // Inline element in h4 like helper reference
                    // Legend
                    } else if ($trigger.prev().prop('tagName') === 'LEGEND') {
                        reference = $trigger.prev(); // Legend like helper reference
                    } else {
                        reference = $($trigger.find('label')[0]);
                    }
                // INPUT, SELECT, TEXTAREA
                } else {
                    reference = $trigger;
                }

                return reference;
            }()),
            'align': that._options.align,
            'side': that._options.side,
            'offsetY': that._options.offsetY,
            'offsetX': that._options.offsetX
        });

    };

    ch.Validation.prototype._showErrorMessage = function (message) {
        this.bubble.show(message);
        this.$trigger.attr('aria-label', 'ch-' + this.bubble.name + '-' + this.bubble.uid);
    };

    ch.Validation.prototype._hideErrorMessage = function () {
        this.bubble.hide();
        this.$trigger.removeAttr('aria-label');
    };

    /**
     * Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {validation}
     * @example
     * // Change validaton bubble's position.
     * validation.refreshPosition({
     *     offsetY: -10,
     *     side: 'top',
     *     align: 'left'
     * });
     */
    ch.Validation.prototype.refreshPosition = function (options) {

        if (options === undefined) {
            return this.bubble._position;
        }

        this.bubble.refreshPosition(options);

        return this;
    };

}(this, this.ch.$, this.ch));