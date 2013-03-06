(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Forms is a Controller of DOM's HTMLFormElement.
     * @name Form
     * @class Form
     * @augments ch.Widget
     * @memberOf ch
     * @param {Object} [options] Object with configuration properties.
     * @param {Object} [options.messages]
     * @see ch.Validation
     * @see ch.Widget
     * @returns itself
     * @factorized
     * @exampleDescription Create a new Form.
     * @example
     * var widget = $(".example").form();
     * @exampleDescription Create a new Form with some messages that will be use the validation engine.
     * @example
     * var widget = $(".example").form({
     *  "messages": {
     *      "required": "Error message for all required fields.",
     *      "email": "Show this message on email format error."
     *  }
     * });
     */
    function Form($el, options) {
        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        that.init($el, options);

        /**
         * Triggers when the component is ready to use (Since 0.8.0).
         * @fires ch.Form#ready
         * @since 0.8.0
         * @exampleDescription Following the first example, using <code>widget</code> as form's instance controller:
         * @example
         * widget.on('ready',function () {
         *  this.show();
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
     * The name of the widget. All instances are saved into a 'map', grouped by its name. You can reach for any or all of the components from a specific name with 'ch.instances'.
     * @public
     * @type {String}
     */
    Form.prototype.name = 'form';

    /**
     * Returns a reference to the Constructor function that created the instance's prototype.
     * @public
     * @function
     */
    Form.prototype.constructor = Form;

    /**
     * Configuration by default.
     * @private
     * @type {Object}
     */
    Form.prototype._defaults = {};

    /**
     * Constructs a new Form.
     * @public
     * @function
     */
    Form.prototype.init = function ($el, options) {
        parent.init.call(this, $el, options);

        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this;

        /**
         * Private Members
         */

        /**
         * A Boolean property that indicates is exists errors in the form.
         * @private
         * @type {Boolean}
         */
        that._hasError = false;

        /**
         * Collection of messages defined.
         * @private
         * @name ch.Form#_messages
         * @type {String}
         */
        that._messages = that._options.messages || {};

        /**
         * Collection of validators.
         * @private
         * @name ch.Form#_validations
         * @type {Array}
         */
        that._validations = [];

        /**
         * Default behavior
         */

        that.$el
            // Disable HTML5 browser-native validations
            .attr('novalidate', 'novalidate')
            // Bind the submit
            .on('submit.form', function (event) {
                that._submit(event);
            })
            // Bind the reset
            .find('input[type="reset"]').on(ch.events.pointer.TAP + '.form', function (event) {
                ch.util.prevent(event);
                that.reset();
            });

        return that;
    };

    /**
     * This methods execute validate() method, and if is defined triggers 'onSubmit' callback.
     * @public
     * @function
     * @name ch.Form#submit
     * @returns {Object}
     */
    Form.prototype._submit = function (event) {
        var that = this;

        // Runs validations
        that.validate();

        // Stops submit event only when it has errors
        if (that._hasError) {
            ch.util.prevent(event);

            /**
             * Fired when the form fall on a error.
             * @name ch.Form#error
             * @event
             * @public
             * @exampleDescription
             * @example
             * widget.on("error",function (chicoEvent, data) {
             *    console.log(data.errors.length);
             * });
             */
            that.emit('error', that._validationsError);

        } else {
            /**
             * Fired when submits the form.
             * @name ch.Form#submit
             * @event
             * @public
             * @exampleDescription
             * @example
             * widget.on("submit",function (chicoEvent, event) {
             *  this.action();
             * });
             * @exampleDescription
             * @example
             * widget.on("submit",function (chicoEvent, event) {
             *  event.preventDefault();
             *  this.action();
             * });
             */
            that.emit('success', event);

        }

        return that;
    };

    /**
     * Executes all validations, if finds a error will trigger 'onerror' callback, if no error is found will trigger 'onsuccess' callback.
     * @public
     * @function
     * @name ch.Form#validate
     * @returns {Object}
     */
    Form.prototype.validate = function () {
        var that = this,
            i = 0,
            j = that._validations.length,
            child;

        that._validationsError = [];

        // Status OK (with previous error)
        if (that._hasError) {
            that._hasError = false;
        }

        // Run validations
        for (i; i < j; i += 1) {
            child = that._validations[i];

            // Validate
            // Store validations with errors
            if (child.validate() === false) {
                that._validationsError.push(child);
            }
        }

        // Is there's an error
        if (that._validationsError.length > 0) {
            var firstError = that._validationsError[0];

            that._hasError = true;

            firstError.bubble.$container[0].scrollIntoView();

            // Issue UI-332: On validation must focus the first field with errors.
            // Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
            if (firstError.el.tagName === 'DIV') {
                firstError.$el.find('input:first').focus();
            }

            if (firstError.el.type !== 'hidden' || firstError.el.tagName === 'SELECT') {
                firstError.el.focus();
            }

        } else {
            that._hasError = false;
        }

        return that;
    };

    /**
     * Use this method to clear al validations.
     * @public
     * @function
     * @name ch.Form#clear
     * @returns {Object}
     */
    Form.prototype.clear = function () {
        var that = this,
            i = 0,
            j = that._validations.length;

        for (i; i < j; i += 1) {
            that._validations[i].clear();
        }

        that._hasError = false;

        /**
         * Fired when clean the form's data.
         * @name ch.Form#clear
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on("clear",function () {
         *  this.reset();
         * });
         */
        that.emit('clear');

        return that;
    };

    /**
     * Use this method to clear al validations.
     * @public
     * @function
     * @name ch.Form#reset
     * @returns {Object}
     */
    Form.prototype.reset = function () {
        var that = this;

        // Clears all active validations
        that.clear();

        // Executes the native reset() method
        that.el.reset();

        /**
         * Fired when resets the form.
         * @name ch.Form#reset
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on("reset",function () {
         *   sowidget.action();
         * });
         */
        that.emit('reset');

        return that;
    };

    /**
    * Returns the status value of the form.
    * @public
    * @function
    * @name ch.Form#isValidated
    * @returns {Boolean}
    */
    Form.prototype.hasError = function () {
        return this._hasError;
    };

    ch.factory(Form);

}(this, this.jQuery, this.ch));