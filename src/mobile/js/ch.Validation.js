(function (window, ch) {
    'use strict';

    ch.Validation.prototype._configureContainer = function () {
        this._container = $('<div class="ch-validation-message ch-hide">').appendTo(this.$trigger.parent());

        return this;
    }

    ch.Validation.prototype._showErrorMessage = function (message) {
        this._container
            .html(message)
            .removeClass('ch-hide');
    };

    ch.Validation.prototype._hideErrorMessage = function () {
        this._container.addClass('ch-hide');
    };

}(this, this.ch));