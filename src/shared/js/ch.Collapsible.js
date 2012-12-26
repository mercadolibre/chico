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

	function Collapsible() {
		var that = this;

		/**
		 * Allows to manage the widgets collapsible status.
		 * @namespace
		 */
		that._collapsible = {};

		/**
		 * Shows component's container.
		 * @public
		 * @function
		 * @name that.collapsible#show
		 */
		that._collapsible.show = function () {

			that._active = true;

			if (that.$trigger) {
				that.$trigger.addClass('ch-' + that.name + '-trigger-on').attr('aria-expanded', 'true');
			}

			// TODO: The emit() method must be execute that.callbacks()
			// TODO: The events must be in lowercase
			// Animation
			if (that._options.fx) {
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

		/**
		 * Hides component's container.
		 * @public
		 * @function
		 * @name that.collapsible#hide
		 */
		that._collapsible.hide = function () {

			that._active = false;

			if (that.$trigger) {
				that.$trigger.removeClass('ch-' + that.name + '-trigger-on').attr('aria-expanded', 'false');
			}

			that.$container.addClass('ch-hide').attr('aria-hidden', 'true');

			// TODO: The emit() method must be execute that.callbacks()
			// TODO: The events must be in lowercase
			// Animation
			if (that._options.fx) {
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

}(this, (this.jQuery || this.Zepto), this.ch));