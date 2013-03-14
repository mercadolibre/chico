/**
* AutoComplete lets you suggest anything from an input element. Use a suggestion service or use a collection with the suggestions.
* @name AutoComplete
* @class AutoComplete
* @augments ch.Controls
* @see ch.Controls
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} conf.url The url pointing to the suggestions's service.
* @param {String} [conf.content] It represent the text when no options are shown.
* @param {Array} [conf.suggestions] The suggestions's collection. If a URL is set at conf.url parametter this will be omitted.
* @returns itself
* @factorized
* @exampleDescription Create a new autoComplete with configuration.
* @example
* var widget = $(".example").autoComplete({
*     "url": "http://site.com/mySuggestions?q=",
*     "message": "Write..."
* });
*/
(function (window, $, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    function AutoComplete($el, options) {

        /**
        * Reference to a internal component instance, saves all the information and configuration properties.
        * @private
        * @name ch.AutoComplete#that
        * @type object
        */
        var that = this;

        this.init($el, options);

        /**
         * Triggers when the component is ready to use (Since 0.8.0).
         * @name ch.AutoComplete#ready
         * @event
         * @public
         * @exampleDescription Following the first example, using <code>widget</code> as autoComplete's instance controller:
         * @example
         * widget.on("ready",function () {
         *   this.show();
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);

        return this;

    }

    /**
     * Inheritance
     */
    var $document = $(window.document),
        parent = ch.util.inherits(AutoComplete, ch.Widget);


    AutoComplete.prototype.name = 'autoComplete';

    AutoComplete.prototype.constructor = AutoComplete;

    AutoComplete.prototype._defaults = {
        'loadingClass': 'ch-autoComplete-loading',
        'side': 'bottom',
        'align': 'left',
        'keystrokesTime': 1000,
        'closable': 'pointers-only',
        'html': false
    };

    AutoComplete.prototype.init = function ($el, options) {
        var that = this,
            ESC = ch.events.key.ESC + '.' + this.name, // UI
            ENTER = ch.events.key.ENTER + '.' + this.name,
            UP_ARROW = ch.events.key.UP_ARROW + '.' + this.name, // UI
            DOWN_ARROW = ch.events.key.DOWN_ARROW + '.' + this.name, // UI
            BACKSPACE = ch.events.key.BACKSPACE + '.' + this.name,
            MOUSEDOWN = ch.events.pointer.DOWN + '.' + this.name,
            MOUSEENTER = 'mouseover' + '.' + this.name, // UI
            KEYUP = 'keyup.' + this.name,
            KEYDOWN = 'keydown.' + this.name;

        parent.init.call(this, $el, options);


        this._$suggestionsList = $('<ul class="ch-autoComplete-list"></ul>');

        /**
         * The component who shows the suggestions.
         * @public
         * @type Object
         * @name ch.AutoComplete#_popover
         */
        this._popover = $.popover({
            'reference': this.$el,
            'content': this._$suggestionsList,
            'side': this._options.side,
            'align': this._options.align,
            'classes': 'ch-box-lite ch-autoComplete',
            'close': this._options.closable,
            'width': (this.el.getBoundingClientRect().width - 22) + 'px'
        });

        /**
         * The number of the selected item.
         * @private
         * @type Number
         * @name ch.AutoComplete#_selected
         */
        this._selected = null; // null

        /**
         * Collection of suggestions to be shown.
         * @private
         * @type Array
         * @name ch.AutoComplete#_suggestions
         */
        this._suggestions = [];

        // adds the content before the list of suggestions
        if (this._options.beforeSuggestions !== undefined) {
            this._popover.$container.prepend(this._options.beforeSuggestions);
        }

        // adds the content after the list of suggestions
        if (this._options.afterSuggestions !== undefined) {
            this._popover.$container.append(this._options.afterSuggestions);
        }

        // the user can set an array with suggestions in the configuration object
        if (this._options.suggestions !== undefined && this._options.suggestions.length > 0) {
            this.suggest(this._options.suggestions);
        }

        /**
         * It stores the query that the user did.
         * @private
         * @type String
         * @name ch.AutoComplete#_query
         */
        this._originalQuery = this.el.value;

        // behavior binding
        this.$el
            .on('focus.' + this.name, function (event) {

                // ch.keyboard.on y ch.keyboard.off recibe como paramentro
                // this, que es el elmento de jQuery en este contexto
                // ch.keyboard.on(this) // this es el elemento de jQuery

                    // dentro del ch.keyboard.on y ch.keyboard.off el es lo que recibio
                    // como paramentro
                    // $(el).on('keydown', function () { // aca va lo que hace ch.keyboard() } )

                // ch.keyboard.off(this) // this es el elemento de jQuery






                that._originalQuery = that.el.value;

                that.$el.on(KEYUP, function (event) {

                    if (that._checkTyping(event)) {
                        that._stopTyping = window.setTimeout(function () {
                            that.emit('typing', that.el.value);
                        }, 400);
                    }

                });

                that.$el.on(KEYDOWN, function (event) {
                    window.clearInterval(that._stopTyping);
                });


                $document
                // back the value to the inputs previous value
                    .on(ESC, function (event) {

                        that.hide();
                        that.el.value = that._originalQuery;

                    })
                // apply the highlighted item
                    .on(ENTER, function (event) {

                        that.el.blur();

                        that._setQuery(event);

                    })
                // hides and clear the list
                    .on(BACKSPACE, function () {

                        if (that.el.value.length <= 1) {
                            that._$suggestionsList.html('');
                            that._popover.hide();
                        }

                    });

                that._popover.$container
                    .on(MOUSEDOWN, function (event) {

                        that._setQuery(event);

                    })
                    .on(MOUSEENTER, function (event) { that._highlightSuggestion(event); });

                that.on('typing', function () { that.$el.addClass('ch-autoComplete-loading'); });

            })
            .on('blur.' + this.name, function (event) {

                that.$el.off(KEYUP);

                that.$el.off(KEYDOWN);

                that._popover.$container
                    .off(MOUSEDOWN)
                    .off(MOUSEENTER);

                $document
                    .off(ESC)
                    .off(ENTER)
                    .off(BACKSPACE);

            })
            .attr('autocomplete', 'off')
            .addClass('ch-' + this.name + '-trigger');

        return this;
    };

    /**
     * It sets to the input the selected query. It emits a 'select' event.
     * @private
     * @function
     * @name ch.AutoComplete#_setQuery
     */
    AutoComplete.prototype._setQuery = function (event) {

        if (!this._options.html) {
            this.el.value = this._suggestions[this._selected];
        }

        this._selected = null;

        this.emit('select', event);

        this.hide();

    };

    /**
     * It highlight items adding the 'ch-autoComplete-selected' to the class attribute.
     * @private
     * @function
     * @name ch.AutoComplete#_highlightSuggestion
     */
    AutoComplete.prototype._highlightSuggestion = function (event) {
        var $target = $(event.target),
            item = $target.hasClass('ch-autoComplete-item') ? $target : $target.parents('li.ch-autoComplete-item'),
            current;

        if (item[0] !== undefined && item.length > 0) {

            current = parseInt(item.attr('data-suggestion'), 10);

            if (this._selected !== current) {

                if (this._selected !== null) {
                    $(this._$suggestionsList[0].children[this._selected]).removeClass('ch-autoComplete-selected');
                }

                item.addClass('ch-autoComplete-selected');

                this._selected = current;
            }

        }

    };

    /**
     * Check if the user is typing and it emits the 'typing' event.
     * @private
     * @function
     * @name ch.AutoComplete#_checkTyping
     */
    AutoComplete.prototype._checkTyping = function (event) {
        var keyCode = event.keyCode,
            inputValue = event.target.value;

        // si el chabon escribe a velocidad rápida no sugerir
        // entonces tengo que escuchar cuando se detiene de escribir
        // si el keyup se ejecuta muchas veces en x cantidad de tiempo disparar el evento
        // o sea medir la diferencia de tiempo entre keyups

        if (inputValue !== ''
                && keyCode !== 13 // ENTER event.keyCode
                && keyCode !== 16 //
                && keyCode !== 17 // CTRL
                && keyCode !== 18 // ALT
                && keyCode !== 20 //
                && keyCode !== 27 // ESC
                && keyCode !== 37 // left arrow
                && keyCode !== 38 // top arrow
                && keyCode !== 39 // right arrow
                && keyCode !== 40 // bottom arrow
                && keyCode !== 93) { // CMND >>> revisar en windows

            return true;

        }

        return false;

    };

    /**
    * Add suggestions to be shown.
    * @public
    * @name ch.AutoComplete#replace
    * @function
    * @returns itself
    */
    AutoComplete.prototype.suggest = function (suggestions) {

        var that = this,
            items = [],
            query = this.el.value,
            matchedRegExp = new RegExp('(' + query + ')', 'ig');

        if (query === '') {
            return this;
        }

        if (!this._popover.isActive()) {
            this.show();
        }

        this.$el.removeClass('ch-autoComplete-loading');
        this._suggestions = suggestions;

        this._suggestions.forEach(function (term, i) {

            if (!that._options.html) {
                term = term.replace(matchedRegExp, '<strong>$1</strong>');
            }

            items.push('<li data-suggestion="' + i + '" class="ch-autoComplete-item">' + term + '</li>');
        });

        this._$suggestionsList.html($(items.join('')));

        return this;
    };

    /**
     * Shows component's content.
     * @public
     * @name ch.AutoComplete-show
     * @function
     * @returns itself
     */
    AutoComplete.prototype.show = function () {

        this.emit('show');

        this._popover.show();

        return this;
    };

    /**
     * Hides component's content.
     * @public
     * @name ch.AutoComplete#hide
     * @function
     * @returns itself
     */
    AutoComplete.prototype.hide = function () {

        this.emit('hide');

        this._popover.hide();

        return this;
    };

    ch.factory(AutoComplete);

}(this, this.jQuery || this.Zepto, this.ch));