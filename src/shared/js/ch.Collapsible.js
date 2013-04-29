/**
 * The Collapsible class gives to widgets the ability to shown or hidden its container.
 * @name Collapsible
 * @class Collapsible
 * @standalone
 * @memberOf ch
 */
(function (window, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    var toggle = {
        'slideDown': 'slideUp',
        'slideUp': 'slideDown',
        'fadeIn': 'fadeOut',
        'fadeOut': 'fadeIn'
    };

    function Collapsible() {

        var that = this,

            triggerClass = 'ch-' + this.name + '-trigger-on',

            fx = this._options.fx,

            canUseFx = (ch.support.fx && typeof fx === 'string');


        function showCallback() {
            that.$container.removeClass('ch-hide').attr('aria-hidden', 'false');
            that.emit('show');
        }

        function hideCallback() {
            that.$container.addClass('ch-hide').attr('aria-hidden', 'true');
            that.emit('hide');
        }

        this._shown = this._options.shown;

        /**
         * Shows component's container.
         * @public
         * @function
         * @name that#_show
         */
        this._show = function () {

            that._shown = true;

            if (that.$trigger !== undefined) {
                that.$trigger.addClass(triggerClass);
            }

            // Animate or not
            if (canUseFx) {
                that.$container[fx]('fast', showCallback);
            } else {
                showCallback();
            }

            return that;
        };

        /**
         * Hides component's container.
         * @public
         * @function
         * @name that#_hide
         */
        this._hide = function () {

            that._shown = false;

            if (that.$trigger !== undefined) {
                that.$trigger.removeClass(triggerClass);
            }

            // Animate or not
            if (canUseFx) {
                that.$container[toggle[fx]]('fast', hideCallback);
            } else {
                hideCallback();
            }

            return that;
        };

        this.on('disable', this.hide);
    }

    ch.Collapsible = Collapsible;

}(this, this.ch));