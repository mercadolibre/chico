(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Collapsible() {
		var that = this;

		/**
		 * Allows to manage the widgets collapsible status.
		 * @namespace
		 */
		that.collapsible = {};

		that.collapsible.show = function () {

			that.active = true;

			if (that.$trigger) {
				that.$trigger.addClass('ch-' + that.name + '-trigger-on').attr('aria-expanded', 'true');
			}

			// TODO: The emit() method must be execute that.callbacks()
			// TODO: The events must be in lowercase
			// Animation
			if (that.options.fx) {
				that.$container.slideDown('fast', function () {
					that.callbacks('onShow');
					that.emit('show');
				});

			} else {
				that.callbacks('onShow');
				that.emit('show');
			}

			that.$container.removeClass('ch-hide').attr('aria-hidden', 'false');
		};

		that.collapsible.hide = function () {

			that.active = false;

			if (that.$trigger) {
				that.$trigger.removeClass('ch-' + that.name + '-trigger-on').attr('aria-expanded', 'false');
			}

			that.$container.addClass('ch-hide').attr('aria-hidden', 'true');

			// TODO: The emit() method must be execute that.callbacks()
			// TODO: The events must be in lowercase

			// Animation
			if (that.options.fx) {
				that.$container.slideUp('fast', function () {
					that.callbacks('onHide');
					// new callbacks
					that.emit('hide');
				});
			} else {
				// new callbacks
				that.emit('hide');
				// old callback system
				that.callbacks('onHide');
			}

		}
	}

	ch.Collapsible = Collapsible;

}(this, this.jQuery, this.ch));