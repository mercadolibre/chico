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
            UP_ARROW = ch.events.key.UP_ARROW + '.' + this.name, // UI
            DOWN_ARROW = ch.events.key.DOWN_ARROW + '.' + this.name, // UI
            ENTER = ch.events.key.ENTER + '.' + this.name,
            BACKSPACE = ch.events.key.BACKSPACE + '.' + this.name,
            MOUSEDOWN = ch.events.pointer.DOWN + '.' + this.name,
            MOUSEENTER = 'mouseover' + '.' + this.name,
            events;

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
            'addClass': 'ch-box-lite ch-autoComplete',
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
                that._originalQuery = that.el.value;

                that._popover.$container
                    .on(MOUSEDOWN, function (event) {

                        that._setQuery(event);

                    })
                    // no se lo puedo pasar a shortcuts por los nombres de los eventos que tenemos que standarizar
                    .on(MOUSEENTER, function (event) {
                        that._select(event);
                    });

                that.on('typing', function () { that.$el.addClass('ch-autoComplete-loading'); });

            })
            .on('blur.' + this.name, function (event) {

                that._popover.$container
                    .off(MOUSEDOWN)
                    .off(MOUSEENTER);

                that.hide();

            })
            .attr('autocomplete', 'off')
            .addClass('ch-' + this.name + '-trigger');

        events = {
            'BACKSPACE': function () {
            // hides and clear the list
                if (that.el.value.length <= 1) {
                    that._$suggestionsList.html('');
                    that._popover.hide();
                }
            },
            'ENTER': function (event) {
            // apply the highlighted item
                that._setQuery(event);
            },
            'ESC': function (event) {
            // back the value to the inputs previous value
                that.hide();
                that.el.value = that._originalQuery;
            },
            'INPUT': function (event) {
            // when the user writes
                window.clearTimeout(that._stopTyping);
                that._stopTyping = window.setTimeout(function () {
                    if (that.el.value !== '') {
                        that.emit('typing', that.el.value);
                    }
                }, 400);
            },
            'UP_ARROW': function (event) {
                that._select(event);
            },
            'DOWN_ARROW': function (event) {
                that._select(event);
            }
        };

        // add shortcuts to the input
        this._shortcuts = new ch.Shortcuts(this.$el, events);

        return this;
    };

    /**
     * It sets to the input the selected query. It emits a 'select' event.
     * @private
     * @function
     * @name ch.AutoComplete#_setQuery
     */
    AutoComplete.prototype._setQuery = function (event) {

        window.clearTimeout(this._stopTyping);

        if (!this._options.html) {
            this.el.value = this._suggestions[this._selected];
        }

        this._selected = null;

        this.emit('select', event);

        this.el.blur();

    };

    /**
     * It highlight items adding the 'ch-autoComplete-selected' to the class attribute.
     * @private
     * @function
     * @name ch.AutoComplete#_select
     */

    AutoComplete.prototype._select = function (event) {
        var type = event.type,
            $target = $(event.target),
            list = this._$suggestionsList.children(),
            listLength = list.length - 1,
            $item,
            previous = function (number) { return function () { return number; } }(this._selected);

            switch (type) {

            case 'up_arrow':

                if (this._selected > 0 && this._selected !== null) {
                    this._selected -= 1;
                } else {
                    this._selected = listLength;
                }

                break;
            case 'down_arrow':

                if (this._selected < listLength && this._selected !== null) {
                    this._selected += 1;
                } else {
                    this._selected = 0;
                }

                break;
            case 'mouseover':
                $item = $target.attr('aria-posinset') ? $target : $target.parents('li[aria-posinset]');

                if ($item[0] !== undefined) {

                    this._selected = (parseInt($item.attr('aria-posinset'), 10) - 1);

                }
                break;
            }

            if (previous() !== this._selected) {
                $(list[previous()]).removeClass('ch-autoComplete-selected');
                $(list[this._selected]).addClass('ch-autoComplete-selected');
            }

    }

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
            query = this.el.value.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1"),
            matchedRegExp = new RegExp('(' + query + ')', 'ig'),
            totalItems = 0;

        if (query === '') {
            return this;
        }

        if (!this._popover.isActive()) {
            this.show();
        }

        this.$el.removeClass('ch-autoComplete-loading');
        this._suggestions = suggestions;
        totalItems = this._suggestions.length;

        // if (this._options.afterSuggestions !== undefined) {
        //     afterOptions = this._options.afterSuggestions.find('.ch-autoComplete-item').splice(0);
        //     totalItems = totalItems + afterOptions.length - 1;
        //     // recorrer
        // }

        // if (this._options.beforeSuggestions !== undefined) {
        //     beforeOptions = this._options.beforeSuggestions.find('.ch-autoComplete-item').splice(0);
        //     totalItems = totalItems + beforeOptions.length - 1;
        // }

        this._suggestions.forEach(function (term, i) {

            if (!that._options.html) {
                term = term.replace(matchedRegExp, '<strong>$1</strong>');
            }

            items.push($('<li aria-setsize="' + totalItems + '" aria-posinset="' + (i + 1) + '" class="ch-autoComplete-item">' + term + '</li>'));
        });



        this._selected = null;
        this._$suggestionsList.html(items);

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

}(this, this.ch.$, this.ch));
