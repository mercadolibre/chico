/**
 * The Collapsible class gives to widgets the ability to shown or hidden its container.
 * @name Collapsible
 * @class Collapsible
 * @standalone
 * @memberOf ch
 */
(function (window, $, ch) {
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

            hasTrigger = (this.$trigger !== undefined),

            triggerClass = 'ch-' + this.name + '-trigger-on',

            fx = this._options.fx;


        function showCallback() {
            that.emit('show');
            that.$container.removeClass('ch-hide').attr('aria-hidden', 'false');
        }

        function hideCallback() {
            that.emit('hide');
            that.$container.addClass('ch-hide').attr('aria-hidden', 'true');
        }

		/**
		 * Shows component's container.
		 * @public
		 * @function
		 * @name that#_show
		 */
		that._show = function () {

			that._active = true;

			if (hasTrigger) {
				that.$trigger.addClass(triggerClass).attr('aria-expanded', 'true');
			}

			// Animate or not
			if (ch.support.fx && typeof fx === 'string') {
				that.$container[fx]('fast', showCallback);
			} else {
				showCallback();
			}
		};

		/**
		 * Hides component's container.
		 * @public
		 * @function
		 * @name that#_hide
		 */
		that._hide = function () {

			that._active = false;

			if (hasTrigger) {
				that.$trigger.removeClass(triggerClass).attr('aria-expanded', 'false');
			}

			// Animate or not
			if (ch.support.fx && typeof fx === 'string') {
				that.$container[toggle[fx]]('fast', hideCallback);
			} else {
				hideCallback();
			}
		};
	}

	ch.Collapsible = Collapsible;

}(this, (this.jQuery || this.Zepto), this.ch));