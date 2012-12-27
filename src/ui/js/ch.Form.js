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
(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

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

        return that;
    }

    /**
     * Inheritance
     */
    var parent = ch.util.inherits(Form, ch.Widget);

    /**
     * Prototype
     */
    Form.prototype.name = 'form';

    Form.prototype.constructor = Form;

    Form.prototype._defaults = {};

    Form.prototype.init = function ($el, options) {
        parent.init.call(this, $el, options);

        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @private
         * @type {Object}
         */
        var that = this,
            $submit = that.$el.find('input:submit');

        /**
         * Preconditions
         */
        // Are there action and submit type?
        if ($submit.length === 0 || that.$el.attr('action') === '') {
            throw new Error('ch.Form: The <input type=submit> is missing, or need to define a action attribute on the form tag.');
        }

        /**
         * Private Members
         */

        /**
         * A Boolean property that indicates is exists errors in the form.
         * @private
         * @type {Boolean}
         */
        that._status = true;

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
        // patch exists because the components need a trigger
        if (ch.util.hasOwn(that._options, 'onSubmit')) {
            that.$el.on('submit.form', function (event) {
                ch.util.prevent(event);
            });

            // Delete all click handlers asociated to submit button >NATAN: Why?
            // Because if you want to do something on submit, you need that the trigger (submit button)
            // don't have events associates. You can add funcionality on onSubmit callback
            $submit.off('click.form');
        }

        that.$el
            // Disable HTML5 browser-native validations
            .attr('novalidate', 'novalidate')

            // Bind the submit
            .on('submit.form', function (event) {
                ch.util.prevent(event);
                that.submit();
            })

            // Bind the reset
            .find(':reset, .resetForm').on('click.form', function (event) {
                //ch.util.prevent(event);
                that.reset();
            });

        // Listen the event "validate" from validations
        // that.on('validate', function () {
        //     that._status = true;
        // });

        return that;
    };

    /**
     * This methods triggers the 'beforSubmit' callback, then will execute validate() method, and if is defined triggers 'onSubmit' callback, at the end will trigger the 'afterSubmit' callback.
     * @public
     * @function
     * @name ch.Form#submit
     * @returns {Object}
     */
    Form.prototype.submit = function (event) {
        var that = this;

        /**
         * Fired before the form's submition.
         * @name ch.Form#beforeSubmit
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on("beforeSubmit",function () {
         *  sowidget.action();
         * });
         */
        that.emit('beforesubmit');

        // Execute all validations
        // that.validate();

        that._status = false;

        // If an error occurs prevent default actions
        if (!that._status) {
            ch.util.prevent(event);
            if (event) {
                event.stopImmediatePropagation();
            }
        }

        /**
         * Fired when submits the form.
         * @name ch.Form#submit
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on("afterSubmit",function () {
         *  widget.action();
         * });
         */
        // * New callback system *
        // Check inside $.data if there's a handler for ch-submit event
        // if something found there, avoid submit.
        if (that._status && that.listeners('submit') !== undefined) {
            // Avoid default actions
            ch.util.prevent(event);
            that.emit('submit');
        }

        /**
         * Fired after the form's submition.
         * @name ch.Form#afterSubmit
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on("aftersubmit",function () {
         *  this.reset();
         * });
         */
        that.emit('aftersubmit');

        // Return that to chain methods
        return that;
    };

    /**
     * Executes all validations, if finds a error will trigger 'onError' callback, if no error is found will trigger 'onValidate' callback, and allways trigger 'afterValidate' callback.
     * @public
     * @function
     * @name ch.Form#validate
     * @returns {Object}
     */
    Form.prototype.validate = function () {
        var that = this,
            i = 0,
            j = that._validations.length,
            validationsError = [],
            child;

        /**
         * Fired before the validations engine start.
         * @name ch.Form#beforeValidate
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on("beforevalidate",function () {
         *  sowidget.action();
         * });
         */
        that.emit('beforevalidate');

        // Status OK (with previous error)
        if (!that._status) {
            that._status = true;
        }

        // Run validations
        for (i; i < j; i += 1) {
            child = that._validations[i];

            // Validate
            // Store validations with errors
            if (child.hasError()) {
                validationsError.push(child);
            }
        }

        // Is there's an error
        if (validationsError.length > 0) {
            that._status = false;
            // Issue UI-332: On validation must focus the first field with errors.
            // Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
            if (validationsError[0].el.tagName === 'DIV') {
                $(validationsError[0].el).find('input:first').focus();
            } else if (validationsError[0].el.type !== 'hidden') {
                validationsError[0].el.focus();
            }

        } else {
            that._status = true;
        }

        /**
         * Fired when the form validates.
         * @name ch.Form#validate
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on("validate",function () {
         *  sowidget.action();
         * });
         */
        if (that._status) {
            that.emit('validate');

        /**
         * Fired when the form fall on a error.
         * @name ch.Form#error
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on("error",function () {
         *  sowidget.action();
         * });
         */
        } else {
            that.emit('error');
        }

        /**
         * Fired when the validations end.
         * @name ch.Form#afterValidate
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on("aftervalidate",function () {
         *  sowidget.action();
         * });
         */
        that.emit('aftervalidate');

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

        that._status = true;

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

        that.clear();
        that.el.reset(); // Reset input

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
    Form.prototype.isValidated = function () {
        return this._status;
    };

    ch.factory(Form);

}(this, this.jQuery, this.ch));