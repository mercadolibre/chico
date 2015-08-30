(function (ch) {
    'use strict';

    /**
     * Creates a container to show the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._configureContainer = function () {
        var parent = ch.util.parentElement(this.trigger);
        parent.insertAdjacentHTML('beforeend', '<div class="ch-validation-message ch-hide"></div>');
        this._container = parent.querySelector('.ch-validation-message');
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
        this._container.innerHTML = message;
        tiny.classList(this._container).remove('ch-hide');

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
        tiny.classList(this._container).add('ch-hide');

        return this;
    };

}(this.ch));