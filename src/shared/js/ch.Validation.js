(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Validation is a engine for HTML forms elements.
     * @name Validation
     * @class Validation
     * @augments ch.Controls
     * @requires ch.Form
     * @requires ch.Condition
     * @requires ch.Required
     * @requires ch.String
     * @requires ch.Number
     * @requires ch.Custom
     * @memberOf ch
     * @param {Object} [conf] Object with configuration properties.
     * @param {String} [conf.content] Validation message.
     * @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
     * @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
     * @param {String} [conf.context] It's a reference to position the validation-bubble.
     * @returns itself
     * @factorized
     * @see ch.Controls
     * @see ch.Form
     * @see ch.Condition
     * @see ch.Required
     * @see ch.String
     * @see ch.Number
     * @see ch.Custom
     */
    function Validation($el, options) {
        /**
         * Reference to a internal component instance, saves all the information and configuration properties.
         * @protected
         * @name ch.Validation#that
         * @type itself
         */
        var that = this;

        this.init($el, options);

        /**
         * Triggers when the component is ready to use.
         * @name ch.Validation#ready
         * @event
         * @public
         * @exampleDescription Following the first example, using <code>widget</code> as modal's instance controller:
         * @example
         * widget.on("ready",function(){
         *   this.show();
         * });
         */
        window.setTimeout(function () { that.emit("ready"); }, 50);

        return this;

    }

    /**
     * Inheritance
     */
    var parent = ch.util.inherits(Validation, ch.Widget),

    /**
     * Creates methods enable and disable into the prototype.
     */
        methods = ['enable', 'disable'],
        len = methods.length;

    function createMethods(method) {
        Validation.prototype[method] = function (condition) {
            var key;

            // Turn off conditions
            if (condition !== undefined && this.conditions[condition] !== undefined) {
                // disable specific condition
                this.conditions[condition][method]();

            } else {

                for (key in this.conditions) {
                    if (this.conditions[key] !== undefined) {
                        this.conditions[key][method]();
                    }
                }

                // enable all
                parent[method].call(this);
            }

            return this;
        };
    }

    /**
     * This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
     * @public
     * @name ch.Validation#name
     * @type string
     */
    Validation.prototype.name = "validation"; // Everything is a "validation" type, no matter what interface is used

    Validation.prototype.constructor = Validation;

    Validation.prototype._defaults = {
        'offsetX': 10,
        'side': 'right',
        'align': 'top'
    };

    /**
     * Constructs a new Validation.
     * @public
     * @function
     */
    Validation.prototype.init = function ($el, options) {

        var that = this;

        parent.init.call(this, $el, options);

        this.conditions = {};
        this.conditions[options.condition.name] = new ch.Condition(options.condition);

        /**
         * Flag that let you know if there's a validation going on.
         * @private
         * @name ch.Validation#_active
         * @type {Boolean}
         */
        this._active = false;

        /**
         * Flag that let you know if the validations is enabled or not.
         * @private
         * @name ch.Validation#_enabled
         * @type {Boolean}
         */
        this._enabled = true;

        /**
         *
         * @public
         * @name ch.Validation#error
         * @type {Object}
         */
        this.error = null;

        this
            .on('exists', function (data) {

                var condition = {
                    'name': data.type
                };

                if (data.options !== undefined) {
                    if (data.options.content) {
                        condition.message = data.options.content;
                    }

                    if (data.options.num) {
                        condition.num = data.options.num;
                    }

                    if (data.options.fn) {
                        condition.fn = data.options.fn;
                    }
                }

                that.conditions[condition.name] = new ch.Condition(condition);

            })
            // Clean the validation if is active;
            .on('disable', this.clear);

        /**
         * Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
         * @public
         * @name ch.Validation#form
         * @type ch.Form
         * @see ch.Form
         */
        // Reference to a Form instance. If there isn't any, the Validation instance will create one.
        this.form = that.$el.parents('form').form()._validations.push(this);

        /**
         * Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
         * @public
         * @name ch.Validation#bubble
         * @type ch.Helper
         * @see ch.Floats
         */

        this.bubble = $.bubble({
            'reference': (function () {
                var reference,
                    $el = that.$el,
                    h4;
                // CHECKBOX, RADIO
                // TODO: when old forms be deprecated we must only support ch-list-options class
                if ($el.hasClass('ch-form-options') || $el.hasClass('ch-list-options')) {
                // Helper reference from will be fired
                // H4
                    if ($el.find('h4').length > 0) {
                        h4 = $el.find('h4'); // Find h4
                        h4.wrapInner('<span>'); // Wrap content with inline element
                        reference = h4.children(); // Inline element in h4 like helper reference
                    // Legend
                    } else if ($el.prev().prop('tagName') === 'LEGEND') {
                        reference = $el.prev(); // Legend like helper reference
                    } else {
                        reference = $($el.find('label')[0]);
                    }
                // INPUT, SELECT, TEXTAREA
                } else {
                    reference = $el;
                }

                return reference;
            }()),
            'align': that._options.align,
            'side': that._options.side,
            'offsetY': that._options.offsetY,
            'offsetX': that._options.offsetX
        });

        /**
         * Validation event
         * @private
         * @name ch.Validation#_validationEvent
         */
        this._validationEvent = (this.$el.hasClass('ch-form-options') || this.$el.hasClass('ch-list-options') || this.el.tagName === 'SELECT' || (this.el.tagName === 'INPUT' && this.el.type === 'range')) ? 'change' : 'blur';

        return this;
    };

    /**
     * Run all configured validations.
     * @public
     * @function
     * @name ch.Validation#validate
     * @returns {Boolean}
     */
    Validation.prototype.validate = function () {

        if (this.hasError()) {

            this._error();

        } else {

            this._success();
        }

        return this;
    };

    /**
     *
     * @private
     * @function
     * @name ch.Validation#_error
     * @returns boolean
     */
    Validation.prototype._error = function () {
        var that = this,
            previousValue;

        // It must happen only once.
        this.$el.on(this._validationEvent + '.validation', function () {
            if (previousValue !== this.value || that._validationEvent === 'change') {
                previousValue = this.value;
                that.validate();
            }
        });

        // Lazy Loading pattern
        this._error = function () {

            if (!that._previousError.condition || !that._active) {
                if (that.el.nodeName === 'INPUT' || that.el.nodeName === 'TEXTAREA') {
                    that.$el.addClass('ch-validation-error');
                }

                that.bubble.show(that.error.msg || 'Error');
            }

            if (that.error.condition !== that._previousError.condition) {
                that.bubble.content((that.error.msg || that.form._messages[that.error.condition] || 'Error'));
                // the aria-label attr should get the message element id, but is not public
                that.$el.attr('aria-label', 'ch-' + that.bubble.name + '-' + that.bubble.uid);
            }

            that._active = true;

            /**
             * Triggers when an error occurs on the validation process.
             * @name ch.Validation#error
             * @event
             * @public
             * @exampleDescription
             * @example
             * widget.on("error",function(event, condition){
             *  errorModal.show();
             * });
             */
            that.emit('error', that.error);

            return that;
        };

        this._error();

        return this;
    };

    /**
     *
     * @private
     * @function
     * @name ch.Validation#_success
     * @returns boolean
     */
    Validation.prototype._success = function () {

        // Status OK (with previous error) this._previousError
        if (this._active || !this._enabled) {
            // Public status OK
            this._active = false;
        }

        this.$el.removeClass('ch-validation-error')
            .removeAttr('aria-label');

        this.bubble.hide(); // uncoment when bubble were done

        this.emit('success');

        return this;
    };

    /**
     *
     * @private
     * @function
     * @name ch.Validation#hasError
     * @returns {Boolean}
     */
    Validation.prototype.hasError = function () {

        // Pre-validation: Don't validate disabled
        if (this.$el.attr('disabled') || !this._enabled) {
            return true;
        }

        var condition,
            val,
            required = this.conditions.required,
            value = this.el.value;

        /**
         * Stores the previous error object
         * @private
         * @type Object
         * @name ch.Validation#_previousError
         */
        this._previousError = ch.util.clone(this.error);

        // Avoid fields that aren't required when they are empty or de-activated
        if (!required && value === '' && this._active === false) {
            // Has got an error? Nop
            return false;
        }

        // for each condition
        for (condition in this.conditions) {

            if (this.conditions[condition] !== undefined) {

                val = ((condition === 'required') ? this.el : value.toLowerCase());
                // this is the validation

                // no value and no required don't validate the field
                if ((value === '' && condition === 'required') || !this.conditions[condition].test(val, this)) {

                    // Update the error object
                    this.error = {
                        'condition': condition,
                        'msg': this.conditions[condition].message
                    }

                    // Has got an error? Yeah
                    return true;
                }

            }

        }

        // Update the error object
        this.error = null;

        // Has got an error? Nop
        return false;
    }

    /**
     * Clear all active validations.
     * @public
     * @name ch.Validation#clear
     * @function
     * @returns itself
     */
    Validation.prototype.clear = function () {

        this.$el.removeClass('ch-validation-error');

        this.bubble.hide();

        this._active = false;

        /**
         * Triggers when al validations are cleared.
         * @name ch.Validation#clear
         * @event
         * @public
         * @exampleDescription Title
         * @example
         * widget.on("clear",function(){
         *  submitButton.enable();
         * });
         */
        this.emit('clear');

        return this;
    };

    /**
     * Let you keep chaining methods.
     * @public
     * @name ch.Validation#and
     * @function
     * @returns jQuery Object
     */
    Validation.prototype.and = function () {
        return this.$el;
    };

    /**
     * Turn off Validation and a specific condition.
     * @public
     * @name ch.Validation#isActive
     * @function
     * @returns boolean
     * @see ch.Condition
     */
    Validation.prototype.isActive = function () {
        return this._active;
    };

    /**
     * Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
     * @public
     * @since 0.10.4
     * @name ch.Validation#position
     * @function
     * @returns itself
     * @exampleDescription Change validaton bubble's position.
     * @example
     * validation.position({
     *    offsetY: -10,
     *    side: "top",
     *    align: "left"
     * });
     */
    Validation.prototype.position = function (options) {

        if (options === undefined) {
            return this.bubble.position;
        }

        this.bubble.position.refresh(options);

        return this;
    };

    /**
     * Sets or gets conditions messages
     * @public
     * @since 0.10.4
     * @name ch.Validation#message
     * @function
     * @returns itself
     * @exampleDescription Sets a new message
     * @example
     * validation.message("required", "New message for required validation");
     * @exampleDescription Gets a message from a condition
     * @example
     * validation.message("required");
     */
    Validation.prototype.message = function (condition, msg) {

        if (condition === undefined) {
            throw new Error("validation.message(condition, message): Please, give me a condition as parameter.");
        }

        // Get a new message from a condition
        if (msg === undefined) {
            return this.conditions[condition].message;
        }

        // Sets a new message
        this.conditions[condition].message = msg;

        if (this.isActive() && this.error.condition === condition) {
            this.bubble.content(msg);
        }

        return this;
    };


    /**
     * Turn on Validation and a specific condition.
     * @public
     * @name ch.Validation#enable
     * @function
     * @returns itself
     * @see ch.Condition
     */

    /**
     * Turn off Validation and a specific Condition.
     * @public
     * @name ch.Validation#disable
     * @function
     * @returns itself
     * @see ch.Condition
     */
     while (len) {
        createMethods(methods[len -= 1]);
     }

    /**
     * Turn on/off the Validation and Condition engine.
     * @public
     * @since 0.10.4
     * @name ch.Validation#toggleEnable
     * @function
     * @returns itself
     * @see ch.Condition
     */
    Validation.prototype.toggleEnable = function () {

        if (this._enabled) {
            this.disable();
        } else {
            this.enable();
        }

        return this;
    };

    ch.factory(Validation);

}(this, (this.jQuery || this.Zepto), this.ch));