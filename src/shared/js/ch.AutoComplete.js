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
        'closable': 'none',
        'html': false
    };

    AutoComplete.prototype.init = function ($el, options) {
        var that = this,
            ESC = ch.onkeyesc + '.' + this.name, // UI
            UP_ARROW = ch.onkeyuparrow + '.' + this.name, // UI
            DOWN_ARROW = ch.onkeydownarrow + '.' + this.name, // UI
            ENTER = ch.onkeyenter + '.' + this.name,
            BACKSPACE = ch.onkeybackspace + '.' + this.name,
            MOUSEDOWN = ch.onpointertap + '.' + this.name,
            MOUSEDOWN = 'mousedown' + '.' + this.name,
            MOUSEENTER = 'mouseover' + '.' + this.name,
            keyboard = {};

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

        this.$container = this._popover.$container;

        /**
         * The number of the selected item.
         * @private
         * @type Number
         * @name ch.AutoComplete#_selected
         */
        this._selected = null;

        /**
         * Collection of suggestions to be shown.
         * @private
         * @type Array
         * @name ch.AutoComplete#_suggestions
         */
        this._suggestions = [];

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
        this._originalQuery = this._currentQuery = this.el.value;

        ch.shortcuts.add(ch.onkeybackspace, this.uid, function () {
            // hides and clear the list
            if (that.el.value.length <= 1) {
                that._$suggestionsList[0].innerHTML = '';
                that._popover.hide();
            }
        });

        ch.shortcuts.add(ch.onkeyenter, this.uid, function (event) {
        // apply the highlighted item
            that._setQuery(event);
        });

        ch.shortcuts.add(ch.onkeyesc, this.uid, function (event) {
        // back the value to the inputs previous value
            that.hide();
            that.el.value = that._originalQuery;
        });

        ch.shortcuts.add(ch.onkeyuparrow, this.uid, function (event) {
            var value;

            if (that._selected === null) {

                that._selected = that._suggestionsQuantity -1;
                value = that._suggestions[that._selected];

            } else if (that._selected <= 0) {

                that._selected = null;
                value = that._currentQuery;

            } else {
                // dafault
                that._selected -= 1;
                value = that._suggestions[that._selected];
            }

            that._toogleSelection();

            if (!that._options.html) {
                that.el.value = value;
            }

        });

        ch.shortcuts.add(ch.onkeydownarrow, this.uid, function (event) {
            var current,
                value;

            if (that._selected === null) {
                // re init
                that._selected = 0;
                value = that._suggestions[that._selected];

            } else if (that._selected >= that._suggestionsQuantity - 1) {
                // reset to the current query
                that._selected = null;
                value = that._currentQuery;

            } else {
                // dafault
                that._selected += 1;
                value = that._suggestions[that._selected];
            }

            that._toogleSelection(current);

            if (!that._options.html) {
                that.el.value = value;
            }

        });

        var mousedownHandler = function (event) {

            if (event.target.nodeName === 'I' && !that._options.html) {
                ch.util.prevent(event);
                that.el.value = that._suggestions[that._selected];
                that.emit('typing', that.el.value);
                return ;
            }

            if ((event.target.nodeName === 'LI' && event.target.className.indexOf('ch-autoComplete-item') !== -1) || (event.target.parentElement.nodeName === 'LI' && event.target.parentElement.className.indexOf('ch-autoComplete-item') !== -1)) {
                that._setQuery(event);
            }
        };

        var mouseenterHandler = function (event) {
            var $target = $(event.target),
                $item;

            ch.util.prevent(event);

            $item = $target.attr('aria-posinset') ? $target : $target.parents('li[aria-posinset]');

            if ($item[0] !== undefined) {
                that._selected = (parseInt($item.attr('aria-posinset'), 10) - 1);
            } else {
                that._selected = null;
            }

            that._toogleSelection();

        };

        if (window.jQuery !== undefined) {
            that._popover.$container
                .on(MOUSEDOWN, mousedownHandler)
                .on(MOUSEENTER, mouseenterHandler);
        } else if (window.Zepto !== undefined) {
            that._popover.$container
                .on(MOUSEDOWN, function (event) {
                    mouseenterHandler(event);
                    mousedownHandler(event);
                });
        }

        this._popover.on('show', function () { ch.shortcuts.on(that.uid); });

        this._popover.on('hide', function () { ch.shortcuts.off(that.uid); });

        // behavior binding
        this.$el
            .on('focus.' + this.name, function (event) {
                that._originalQuery = that.el.value;

                that.$el.on(ch.onkeyinput, function (event) {
                // when the user writes
                    window.clearTimeout(that._stopTyping);
                    that._stopTyping = window.setTimeout(function () {
                        if (that.el.value !== '') {
                            that.emit('typing', that.el.value);
                        }
                    }, 400);

                });

                that.on('typing', function (currentQuery) {
                    that._currentQuery = currentQuery;
                    that.$el.addClass('ch-autoComplete-loading');
                });

            })
            .on('blur.' + this.name, function (event) {

                that.hide();
                that.$el.off(ch.onkeyinput);

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

        window.clearTimeout(this._stopTyping);

        if (this._selected === null) {
            return this;
        }

        ch.util.prevent(event);

        if (!this._options.html) {
            this.el.value = this._suggestions[this._selected];
        }

        this.emit('select', event);
        this.el.blur();

        return this;
    };

    /**
     * It highlight items adding the 'ch-autoComplete-selected' to the class attribute.
     * @private
     * @function
     * @name ch.AutoComplete#_select
     */

    AutoComplete.prototype._toogleSelection = function () {
        var id = '#' + this.$container[0].id,
            current = (this._selected === null) ? null : (this._selected + 1);

        $(id + ' [aria-posinset].ch-autoComplete-selected').removeClass('ch-autoComplete-selected');
        $(id + ' [aria-posinset="'+ current +'"]').addClass('ch-autoComplete-selected');

        return this;

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
            totalItems = 0,
            $extraItems,
            extraItems = [];

        if (query === '') {
            this.el.blur();
            return this;
        }

        if (suggestions.length === 0) {
            this._popover.hide();
            return this;
        }

        if (!this._popover.isShown()) {
            this._show();
        }

        this._$suggestionsList[0].innerHTML = '';
        this._suggestions = suggestions;
        this.$el.removeClass('ch-autoComplete-loading');

        $extraItems = this.$container.find('.ch-autoComplete-item').removeClass('ch-autoComplete-selected');

        totalItems = ($extraItems.length > 0) ? (totalItems + $extraItems.length - 1) : this._suggestions.length;

        this._suggestions.forEach(function (term, i) {
            if (!that._options.html) {
                term = term.replace(matchedRegExp, '<strong>$1</strong>');
            }
            items.push('<li aria-setsize="' + totalItems + '" aria-posinset="' + (i + 1) + '" class="ch-autoComplete-item">' + term + '<i class="ch-icon-arrow-up" data-js="ch-autoComplete-complete-query"></i></li>');
        });

        $extraItems.each(function (index, e) {
            extraItems.push(e.setAttribute('aria-posinset', (that._suggestions.length + index + 1)));
        });

        this._selected = null;
        this._suggestionsList = items.concat(extraItems);
        this._$suggestionsList[0].innerHTML = items.join('');
        this._suggestionsQuantity = this._suggestionsList.length;

        return this;
    };

    /**
     * Shows component's content.
     * @private
     * @name ch.AutoComplete-_show
     * @function
     * @returns itself
     */
    AutoComplete.prototype._show = function () {
        this._popover.show();
        this.emit('show');
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
