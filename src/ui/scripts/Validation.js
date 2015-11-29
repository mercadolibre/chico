(function (ch) {
    'use strict';

    /**
     * Creates a bubble to show the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._configureContainer = function () {

        var that = this;

        /**
         * Is the little sign that popover showing the validation message. It's a Popover component, so you can change it's content, width or height and change its visibility state.
         * @type {Bubble}
         * @see ch.Bubble
         */
        this.bubble = this._container = new ch.Bubble({
            'reference': that._options.reference || (function () {
                var reference,
                    trigger = that.trigger,
                    h4,
                    span;
                // CHECKBOX, RADIO
                // TODO: when old forms be deprecated we must only support ch-form-options class
                if (tiny.hasClass(trigger, 'ch-form-options')) {
                // Helper reference from will be fired
                    if (trigger.querySelectorAll('h4').length > 0) {
                        // Wrap content with inline element
                        h4 = trigger.querySelector('h4'); // Find h4
                        span = document.createElement('span');
                        span.insertAdjacentHTML('beforeend', h4.innerHTML);
                        h4.innerHTML = '';
                        h4.insertBefore(span, h4.firstChild);
                        reference = h4.children[0]; // Inline element in h4 like helper reference
                    // Legend
                    } else if (trigger.previousElementSibling && trigger.previousElementSibling.tagName === 'LEGEND') {
                        reference = trigger.previousElementSibling; // Legend like helper reference
                    } else {
                        reference = trigger.querySelector('label');
                    }
                // INPUT, SELECT, TEXTAREA
                } else {
                    reference = trigger;
                }

                return reference;
            }()),
            'align': that._options.align,
            'side': that._options.side,
            'offsetY': that._options.offsetY,
            'offsetX': that._options.offsetX
            // 'position': that._options.position
        });

    };

    /**
     * Shows the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._showErrorMessage = function (message) {
        this.bubble.content(message).show();
        this.trigger.setAttribute('aria-label', 'ch-' + this.bubble.name + '-' + this.bubble.uid);

        return this;
    };

    /**
     * Hides the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._hideErrorMessage = function () {
        this.bubble.hide();
        this.trigger.removeAttribute('aria-label');

        return this;
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

}(this.ch));
