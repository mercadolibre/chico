(function (ch, $) {
    'use strict';

    /**
     * Creates a container to show the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._configureContainer = function () {
        this._container = $('<div class="ch-validation-message ch-hide">').appendTo(this.$trigger.parent());

        return this;
    };

    /**
     * Shows the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._showErrorMessage = function (message) {
        this._container
            .html(message)
            .removeClass('ch-hide');

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
        this._container.addClass('ch-hide');

        return this;
    };

}(this.ch, this.ch.$));