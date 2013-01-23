/**
* Validation is a engine for HTML forms elements.
* @name Validation
* @class Validation
* @augments ch.Controls
* @requires ch.Form
* @requires ch.Validator
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
* @see ch.Validator
* @see ch.Required
* @see ch.String
* @see ch.Number
* @see ch.Custom
*/

(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    var setTimeout = window.setTimeout;

    function Validation($el, options) {
        /**
        * Reference to a internal component instance, saves all the information and configuration properties.
        * @protected
        * @name ch.Validation#that
        * @type itself
        */
        var that = this;


        that.init($el, options);


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
        setTimeout(function(){ that.emit("ready")}, 50);

        return this;

    };

    /**
     * Inheritance
     */
    var parent = ch.util.inherits(Validation, ch.Widget);

    /**
    * Protected Members
    */
    Validation.prototype._defaults = {
        'offset': '10 0',
        'points': 'lt rt'
    }

    /**
     * Flag that let you know if there's a validation going on.
     * @private
     * @name ch.Validation#active
     * @type boolean
     */
    Validation.prototype._active = false;

    /**
     * Flag that let you know if the validations is enabled or not.
     * @private
     * @name ch.Validation#_enabled
     * @type boolean
     */
    Validation.prototype._enabled = true;

    /**
    * Public Members
    */
    /**
     * Constructs a new Validation.
     * @public
     * @function
     */
    Validation.prototype.init = function($el, options) {
        var that = this;
        parent.init.call(this, $el, options);

        that.conditions = {};
        that.conditions[options.condition.name] = new ch.Condition(options.condition);

        that.on('exists', function (e, data){

            var condition = {
                'name': data.type
            };

            if(data.options !== undefined){
                if(data.options.content){
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

        });

        /**
         * Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
         * @public
         * @name ch.Validation#form
         * @type ch.Form
         * @see ch.Form
         */
        // Reference to a Form instance. If there isn't any, the Validation instance will create one.
        that.form = (function() {

            if (ch.util.hasOwn(ch.instances, "form")) {
                for (var instance in ch.instances.form) {
                    if (ch.instances.form[instance].el === that.$el.parents("form")[0]) {
                        return ch.instances.form[instance]; // Get my parent
                    }
                }
            }

            var instance = that.$el.parents("form").form();

            for (var i in ch.instances.form) {
                if (ch.instances.form[i].el === instance.el) {

                    return ch.instances.form[i]; // Get my parent
                }
            }

        })();

        that.form._validations.push(that);

        /**
         * Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
         * @public
         * @name ch.Validation#bubble
         * @type ch.Helper
         * @see ch.Floats
         */
        that.bubble = $.validationBubble({
            'reference': (function() {
                var reference
                    $el = that.$el;
                // CHECKBOX, RADIO
                // TODO: when old forms be deprecated we must only support ch-list-options class
                if ($el.hasClass("ch-form-options") || $el.hasClass("ch-list-options")) {
                // Helper reference from will be fired
                // H4
                    if ($el.find("h4").length > 0) {
                        var h4 = $el.find("h4"); // Find h4
                        h4.wrapInner("<span>"); // Wrap content with inline element
                        reference = h4.children(); // Inline element in h4 like helper reference
                    // Legend
                    } else if ($el.prev().prop("tagName") == "LEGEND") {
                        reference = $el.prev(); // Legend like helper reference
                    } else {
                        reference = $($el.find("label")[0]);
                    }
                // INPUT, SELECT, TEXTAREA
                } else {
                    reference = $el;
                }

                return reference;
            })()
        });

        /**
         * Validation event
         * @private
         * @name ch.Validation#_validationEvent
         */
        that._validationEvent = (that.$el.hasClass("ch-form-options") || that.$el.hasClass("ch-list-options") || that.el.tagName == "SELECT" || ( that.el.tagName == "INPUT" && that.el.type === 'range') ) ? "change" : "blur";

        /**
         * Stores the error object
         * @private
         * @type Object
         * @name ch.Validation#error
         */
         that._error = {};

        return that;
    }

    /**
     * Run all configured validations.
     * @public
     * @function
     * @name ch.Validation#validate
     * @returns boolean
     */
    Validation.prototype.validate = function () {
        var that = this;

        // Pre-validation: Don't validate disabled
        if (that.$el.attr("disabled") || !that._enabled) { return false; }

        /**
         * Triggers before start validation process.
         * @name ch.Validation#beforeValidate
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on("beforeValidate",function(event) {
         *  submitButton.disable();
         * });
         */
        that.emit('beforevalidate');

        // Executes the validators engine with a specific value and returns an object.
        // Context is the validation
        var previousError = ch.util.clone(this._error);

        // Saves gotError
        that.hasError();

        // If has Error...
        if (that._error.status) {

            if (that.$el.prop("tagName") === "INPUT" || that.$el.prop("tagName") === "TEXTAREA") {
                // TODO: remove error class when deprecate old forms only ch-form error must be.
                that.$el.addClass("ch-form-error");
            }

            // to avoid reload the same content
            //if (!that.bubble.isActive() || !that._error.condition || that._error.condition !== previousError.condition) {
            if (!previousError.condition || that._error.condition !== previousError.condition) { // delete when bubble will be done

                //console.log(previousError);
                that.bubble.show((previousError.msg || that.form._messages[previousError.condition] || "Error"));
                // the aria-label attr should get the message element id, but is not public
                that.$el.attr('aria-label', 'ch-' + that.bubble.type + '-' + that.bubble.uid );
                //console.log( this._error.msg || form.messages[this._error.condition] || "Error" );
            }

            // Add blur or change event to the element or to the elements's group
            if(!$._data(that.el).events){
                that.$el.on(that._validationEvent + '.validation', function(){that.validate();});
            }

            /**
             * Triggers when an error occurs on the validation process.
             * @name ch.Validation#error
             * @event
             * @public
             * @exampleDescription
             * @example
             * widget.on("error",function(event, condition) {
             *  if (condition === "required") {
             *      errorModal.show();
             *  }
             * });
             */
            that.emit("error", previousError.condition);

        // else NOT Error!
        } else {
            that.$el.removeClass("ch-form-error");
            that.$el.removeAttr('aria-label');
            //that.bubble.innerHide(); // uncoment when bubble were done
            form.emit('validated');
        }

        /**
         * Triggers when the validation process ends.
         * @name ch.Validation#afterValidate
         * @event
         * @public
         * @exampleDescription
         * @example
         * widget.on("afterValidate",function(){
         *  submitButton.disable();
         * });
         */
        that.emit("aftervalidate");

        return that._error.status;

    };

    /**
    *   Public Members
    */

    /**
     * The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
     * @public
     * @name ch.Validation#uid
     * @type number
     */

    /**
     * Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
     * @public
     * @name ch.Validation#element
     * @type HTMLElement
     */

    /**
     * This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
     * @public
     * @name ch.Validation#type
     * @type string
     */
    Validation.prototype.type = "validation"; // Everything is a "validation" type, no matter what interface is used

    /**
     * Run all configured validations.
     * @public
     * @function
     * @name ch.Validation#hasError
     * @returns boolean
     */
    Validation.prototype.hasError = function(){
        var that = this;

        if (!that._enabled) { return true; }

        var condition,
            tested,
            empty,
            val,
            message,
            required = that.conditions['required'],
            value = that.el.value;

        // Avoid fields that aren't required when they are empty or de-activated
        if (!required && value === '' && that._active === false) { return {'status': false}; }

        if (that._enabled && (!that._active || value !== '' || required)) {

            // for each condition
            for (condition in that.conditions){

                val = ((condition === 'required') ? that.el : value.toLowerCase());
                // this is the validation

                // no value and no required don't validate the field
                if (value === '' && condition !== 'required') {

                    tested = true;

                } else {

                    tested = that.conditions[condition].test(val);

                    // return false if any test fails,
                    if (!tested) {

                        /**
                         * Triggers when an error occurs on the validation process.
                         * @name ch.Validator#error
                         * @event
                         * @public
                         * @exampleDescription
                         * @example
                         * widget.on("error",function(event, condition){
                         *  errorModal.show();
                         * });
                         */
                        that.emit('error', condition);

                        that._active = true;

                        // stops the proccess
                        this._error.status = true;
                        this._error.condition = condition;
                        this._error.msg = that.conditions[condition].message;

                        return this._error.status;
                    };
                };
            }
        }

        // Status OK (with previous error)
        if (that._active || !that._enabled) {
            // Public status OK
            that._active = false;
        }

        // It's all good ;)
        this._error.status = false;
        this._error.condition = undefined;
        this._error.msg = undefined;

        return this._error.status;
    }

    /**
     * Clear all active validations.
     * @public
     * @name ch.Validation#clear
     * @function
     * @returns itself
     */
    Validation.prototype.clear = function() {
        var that = this;

        that.$el.removeClass("ch-form-error");
        that.bubble.innerHide();

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
         that.emit('clear');

        return this;
    };

    /**
     * Let you keep chaining methods.
     * @public
     * @name ch.Validation#and
     * @function
     * @returns jQuery Object
     */
    Validation.prototype.and = function(){
        return this.$el;
    };

    /**
     * Turn on Validation and Validator engine or an specific condition.
     * @public
     * @name ch.Validation#enable
     * @function
     * @returns itself
     * @see ch.Validator
     */
    Validation.prototype.enable = function(condition){
        var that = this;

        if (condition && that.conditions[condition]){
            // Enable specific condition
            that.conditions[condition].enable();
        } else {
            // enable all
            that._enabled = true;
            for (condition in that.conditions){
                that.conditions[condition].enable();
            }
        }

        return this;
    };

    /**
     * Turn off Validation and Validator engine or an specific condition.
     * @public
     * @name ch.Validation#disable
     * @function
     * @returns itself
     * @see ch.Validator
     */
    Validation.prototype.disable = function (condition) {
        var that = this;
        // Clean the validation if is active;
        clear();

        // Turn off validator
        //validator.disable(condition);
        if (condition && that.conditions[condition]){
            // disable specific condition
            that.conditions[condition].disable();
        } else {
            // disable all
            that._enabled = false;
            for (condition in that.conditions){
                that.conditions[condition].disable();
            }
        }

        return this;
    };

    /**
     * Turn on/off the Validation and Validator engine.
     * @public
     * @since 0.10.4
     * @name ch.Validation#toggleEnable
     * @function
     * @returns itself
     * @see ch.Validator
     */
    Validation.prototype.toggleEnable = function () {
        var that = this;

        if (that._enabled) {
            that.disable();
        } else {
            that.enable();
        }

        return this;
    };

    /**
     * Turn off Validation and Validator engine or an specific condition.
     * @public
     * @name ch.Validation#isActive
     * @function
     * @returns boolean
     */
    Validation.prototype.isActive = function(){
        return this._active;
    };

    /**
     * Returns an object with the errors that the validation has.
     * @public
     * @name ch.Validation#getError
     * @function
     * @returns object
     */
    Validation.prototype.getError = function(){
        return this._error;
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
     *    offset: "0 10",
     *    points: "lt lb"
     * });
     */
    Validation.prototype.position = function (o) {
        var that = this;

        if (o === undefined) { return that.bubble.position(); }

        that.bubble.position(o);

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
        var that = this;

        if (condition === undefined) {
            throw "validation.message(condition, message): Please, give me a condition as parameter.";
        }

        // Get a new message from a condition
        if (msg === undefined) {
            return that.conditions[condition].message;
        }

        // Sets a new message
        that.conditions[condition].message = msg;

        if (that.isActive() && that._error.condition === condition) {
            //console.log( msg );
            that.bubble.content(msg);
        }

        return this;
    }

    Validation.prototype.name = 'validation';
    Validation.prototype.constructor = Validation;

    ch.factory(Validation);

}(this, this.jQuery, this.ch));