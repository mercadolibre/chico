(function (window, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    var toggleEffects = {
        'slideDown': 'slideUp',
        'slideUp': 'slideDown',
        'fadeIn': 'fadeOut',
        'fadeOut': 'fadeIn'
    };

    /**
     * The Collapsible class gives to widgets the ability to shown or hidden its container.
     * @memberOf ch
     * @mixin
     * @returns {Function} Returns a private funciton.
     */
    function Collapsible() {

        var that = this,
            triggerClass = 'ch-' + this.name + '-trigger-on',
            fx = this._options.fx,
            useEffects = (ch.support.fx && fx !== 'none' && fx !== false);

        function showCallback() {
            that.$container.removeClass('ch-hide').attr('aria-hidden', 'false');

            /**
             * Event emitted when the widget container is shown.
             * @event ch.Collapsible#show
             * @example
             * // Subscribe to "show" event.
             * widget.on('show', function () {
             *  // Some code here!
             * });
             */
            that.emit('show');
        }

        function hideCallback() {
            that.$container.addClass('ch-hide').attr('aria-hidden', 'true');

            /**
             * Event emitted when the widget container.is hidden.
             * @event ch.Collapsible#hide
             * @example
             * // Subscribe to "hide" event.
             * widget.on('hide', function () {
             *  // Some code here!
             * });
             */
            that.emit('hide');
        }

        this._shown = false;

        /**
         * Shows the widget container.
         * @function
         * @private
         */
        this._show = function () {

            that._shown = true;

            if (that.$trigger !== undefined) {
                that.$trigger.addClass(triggerClass);
            }

            // Animate or not
            if (useEffects) {
                that.$container[fx]('fast', showCallback);
            } else {
                showCallback();
            }

            that.emit('_show');

            return that;
        };

        /**
         * Hides the widget container.
         * @function
         * @private
         */
        this._hide = function () {

            that._shown = false;

            if (that.$trigger !== undefined) {
                that.$trigger.removeClass(triggerClass);
            }

            // Animate or not
            if (useEffects) {
                that.$container[toggleEffects[fx]]('fast', hideCallback);
            } else {
                hideCallback();
            }

            return that;
        };

        /**
         * Shows or hides the widget container.
         * @function
         * @private
         */
        this._toggle = function () {

            if (that._shown) {
                that.hide();
            } else {
                that.show();
            }

            return that;
        };

        this.on('disable', this.hide);
    }

    ch.Collapsible = Collapsible;

}(this, this.ch));