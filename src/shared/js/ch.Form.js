(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Form is a controller of DOM's HTMLFormElement.
     * @memberof ch
     * @constructor
     * @augments ch.Widget
     * @requires ch.Validations
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Form.
     * @param {Object} [options] Options to customize an instance.
     * @param {Object} [options.messages] A collections of validations messages.
     * @param {String} [options.messages.required] A validation message.
     * @param {String} [options.messages.string] A validation message.
     * @param {String} [options.messages.url] A validation message.
     * @param {String} [options.messages.email] A validation message.
     * @param {String} [options.messages.maxLength] A validation message.
     * @param {String} [options.messages.minLength] A validation message.
     * @param {String} [options.messages.custom] A validation message.
     * @param {String} [options.messages.number] A validation message.
     * @param {String} [options.messages.min] A validation message.
     * @param {String} [options.messages.max] A validation message.
     * @param {String} [options.messages.price] A validation message.
     * @returns {form} Returns a new instance of ch.Form.
     * @example
     * // Create a new Form with defaults options.
     * var widget = $(selector).form();
     * @example
     * // Create a new Form with custom messages.
     * $(selector).form({
     *     'messages': {
     *          'required': 'Some message!',
     *          'email': 'Another message!'
     *      }
     * });
     */
    function Form($el, options) {

        /**
         * Reference to a internal widget instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        that.init($el, options);

        /**
         * Emits the event 'ready' when the widget is ready to use.
         * @event ch.Form#ready
         * @example
         * // Subscribe to "ready" event.
         * form.on('ready',function () {
         *    this.show();
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);

        return this;
    }

    /**
     * Inheritance
     */
    var parent = ch.util.inherits(Form, ch.Widget);

    /**
     * Prototype
     */

    /**
     * The name of the widget.
     * @type {String}
     */
    Form.prototype.name = 'form';

    /**
     * Returns a reference to the constructor function that created the instance.
     * @memberof! ch.Form.prototype
     * @function
     */
    Form.prototype.constructor = Form;

    /**
     * Initialize a new instance of Form and merge custom options with defaults options.
     * @memberof! ch.Form.prototype
     * @function
     * @returns {form}
     */
    Form.prototype.init = function ($el, options) {
        // Call to its parents init method
        parent.init.call(this, $el, options);

        /**
         * Reference to a internal widget instance, saves all the information and configuration properties.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * Private Members
         */

        /**
         * A collection of active errors.
         * @type {Array}
         */
        this.errors = [];

        /**
         * Collection of defined messages.
         * @type {Object}
         * @private
         */
        this._messages = this._options.messages || {};

        /**
         * A collection of validations instances.
         * @type {Array}
         */
        this.validations = [];

        /**
         * Default behavior
         */

        /**
         * The form container.
         * @type {(jQuerySelector | ZeptoSelector)}
         */
        this.$container = this._$el
            // Add classname
            .addClass('ch-form')
            // Disable HTML5 browser-native validations
            .attr('novalidate', 'novalidate')
            // Bind the submit
            .on('submit.form', function (event) {
                // Runs validations
                that.validate(event);
            });

        this.$container
            // Bind the reset
            .find('input[type="reset"]').on(ch.onpointertap + '.form', function (event) {
                ch.util.prevent(event);
                that.reset();
            });

        // Clean validations
        this.on('disable', this.clear);

        return this;
    };

    /**
     * Executes all validations.
     * @memberof! ch.Form.prototype
     * @function
     * @returns {form}
     */
    Form.prototype.validate = function (event) {

        if (!this._enabled) {
            return this;
        }

        /**
         * Emits when the form will be validated.
         * @event ch.Form#beforevalidate
         * @example
         * // Subscribe to "beforevalidate" event.
         * widget.on('beforevalidate', function () {
         *  // Some code here!
         * });
         */
        this.emit('beforevalidate');

        var that = this,
            i = 0,
            j = that.validations.length,
            validation,
            firstError,
            triggerError;

        this.errors.length = 0;

        // Run validations
        for (i; i < j; i += 1) {
            validation = that.validations[i];

            // Validate
            validation.validate();

            // Store validations with errors
            if (validation.isShown()) {
                that.errors.push(validation);
            }
        }

        // Is there's an error
        if (that.errors.length > 0) {
            firstError = that.errors[0];

            firstError.bubble.$container[0].scrollIntoView();

            // Issue UI-332: On validation must focus the first field with errors.
            // Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
            triggerError = firstError.$trigger[0];

            if (triggerError.tagName === 'DIV') {
                firstError.$trigger.find('input:first').focus();
            }

            if (triggerError.type !== 'hidden' || triggerError.tagName === 'SELECT') {
                triggerError.focus();
            }

            ch.util.prevent(event);

            /**
             * Emits when a form has got errors.
             * @event ch.Form#error
             * @example
             * // Subscribe to "error" event.
             * widget.on('error', function (errors) {
             *  console.log(errors.length);
             * });
             */
            this.emit('error', this.errors);

        } else {

            /**
             * Emits when a form is hasn't got errros.
             * @event ch.Form#success
             * @example
             * // Subscribe to "success" event.
             * form.on("submit",function () {
             *  // Some code here!
             * });
             * @example
             * // Subscribe to "success" event and prevent the submit event.
             * form.on("submit",function (event) {
             *  event.preventDefault();
             *  // Some code here!
             * });
             */
            this.emit('success', event);
        }

        return this;
    };

    /**
     * Checks if the form has got errors but it doesn't show bubbles.
     * @memberof! ch.Form.prototype
     * @function
     * @returns {Bollean}
     * @example
     * // Checks if a form has errors and do something.
     * if (form.hasError()) {
     *     // Some code here!
     * };
     */
    Form.prototype.hasError = function () {

        if (!this._enabled) {
            return false;
        }

        this.errors.length = 0;

        var i = 0,
            j = this.validations.length,
            validation;

        // Run hasError
        for (i; i < j; i += 1) {

            validation = this.validations[i];

            if (validation.hasError()) {
                this.errors.push(validation);
            }

        }

        if (this.errors.length > 0) {
            return true;
        }

        return false;
    };

    /**
     * Clear all active errors.
     * @memberof! ch.Form.prototype
     * @function
     * @returns {form}
     * @example
     * // Clear active errors.
     * form.clear();
     */
    Form.prototype.clear = function () {
        var i = 0,
            j = this.validations.length;

        for (i; i < j; i += 1) {
            this.validations[i].clear();
        }

        /**
         * Emits when a form clean its active errors.
         * @event ch.Form#clear
         * @example
         * // Subscribe to "clear" event.
         * form.on('clear', function () {
         *  // Some code here!
         * });
         */
        this.emit('clear');

        return this;
    };

    /**
     * Clear all active errors and executes the reset() native mehtod.
     * @memberof! ch.Form.prototype
     * @function
     * @returns {form}
     * @example
     * // Resets form fields and clears active errors.
     * form.reset();
     */
    Form.prototype.reset = function () {

        // Clears all shown validations
        this.clear();

        // Executes the native reset() method
        this._el.reset();

        /**
         * Emits when a form resets its fields.
         * @event ch.Form#reset
         * @example
         * // Subscribe to "reset" event.
         * form.on('reset', function () {
         *  // Some code here!
         * });
         */
        this.emit('reset');

        return this;
    };

    /**
     * Destroys a form instance.
     * @memberof! ch.Form.prototype
     * @function
     * @expample
     * // Destroying an instance of Form.
     * form.destroy();
     */
    Form.prototype.destroy = function () {

        this.$container
            .off('.form')
            .removeAttr('novalidate');

        $.each(this.validations, function (i, e) {
            e.destroy();
        });

        parent.destroy.call(this);
    };

    ch.factory(Form);

}(this, this.ch.$, this.ch));