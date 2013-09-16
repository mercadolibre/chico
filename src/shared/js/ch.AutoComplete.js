(function (window, $, ch) {
    'use strict';

    /**
     * AutoComplete widget shows a list of suggestions for a HTMLInputElement.
     * @memberof ch
     * @constructor
     * @augments ch.Widget
     * @param {Object} [conf] Object with configuration properties.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: left, right, top, bottom or center (default).
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: left, right, top, bottom or center (default).
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horitontally. Its value by default is 0.
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically. Its value by default is 0.
     * @param {String} [options.positioned] The positioned option specifies the type of positioning used. Its value can be: absolute or fixed (default).
     * @returns {autocomplete}
     * @example
     * // Create a new autoComplete with configuration.
     * var autocomplete = $el.autoComplete();
     */
    function AutoComplete($el, options) {

        /**
        * Reference to a internal component instance, saves all the information and configuration properties.
        * @type {Object}
        * @private
        */
        var that = this;

        this._init($el, options);

        /**
         * Event emitted when the widget is ready to use.
         * @event ch.AutoComplete#ready
         * @example
         * // Subscribe to "ready" event.
         * autocomplete.on('ready',function () {
         *    // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);

        return this;

    }

    // Inheritance
    var document = window.document,
        $document = $(document),
        parent = ch.util.inherits(AutoComplete, ch.Widget);

    /**
     * The name of the widget.
     * @type {String}
     */
    AutoComplete.prototype.name = 'autoComplete';

    /**
     * Returns a reference to the Constructor function that created the instance's prototype.
     * @memberof! ch.AutoComplete.prototype
     * @function
     */
    AutoComplete.prototype.constructor = AutoComplete;

    /**
     * Configuration by default.
     * @memberof! ch.AutoComplete.prototype
     * @type {Object}
     * @private
     */
    AutoComplete.prototype._defaults = {
        'loadingClass': 'ch-autoComplete-loading',
        'side': 'bottom',
        'align': 'left',
        'keystrokesTime': 1000,
        'hiddenby': 'none',
        'html': false
    };

    /**
     * Initialize a new instance of AutoComplete and merge custom options with defaults options.
     * @memberof! ch.AutoComplete.prototype
     * @function
     * @returns {autoComplete}
     */

    AutoComplete.prototype._init = function ($el, options) {
        var that = this,
            ESC = ch.onkeyesc + '.' + this.name,
            UP_ARROW = ch.onkeyuparrow + '.' + this.name,
            DOWN_ARROW = ch.onkeydownarrow + '.' + this.name,
            ENTER = ch.onkeyenter + '.' + this.name,
            BACKSPACE = ch.onkeybackspace + '.' + this.name,
            MOUSEDOWN = ch.onpointertap + '.' + this.name,
            MOUSEDOWN = 'mousedown' + '.' + this.name,
            MOUSEENTER = 'mouseover' + '.' + this.name;

        parent._init.call(this, $el, options);

        this.$trigger = this._$el;

        this._$suggestionsList = $('<ul class="ch-autoComplete-list"></ul>');

        /**
         * The component who shows the suggestions.
         * @private
         * @type {Object}
         */
        this._popover = $.popover({
            'reference': this.$trigger,
            'content': this._$suggestionsList,
            'side': this._options.side,
            'align': this._options.align,
            'addClass': 'ch-box-lite ch-autoComplete',
            'hiddenby': this._options.hiddenby,
            'width': (this._el.getBoundingClientRect().width - 22) + 'px',
            'fx': this._options.fx
        });

        this.$container = this._popover.$container.attr('aria-hidden', 'true');

        // The number of the selected item.
        this._selected = null;

        // Collection of suggestions to be shown.
        this._suggestions = [];

        // the user can set an array with suggestions in the configuration object
        if (this._options.suggestions !== undefined && this._options.suggestions.length > 0) {
            this.suggest(this._options.suggestions);
        }

        // To use then to show when the user cancel the suggestions
        this._originalQuery = this._currentQuery = this._el.value;

        ch.shortcuts.add(ch.onkeybackspace, this.uid, function () {
            // hides and clear the list
            if (that._el.value.length <= 1) {
                that._$suggestionsList[0].innerHTML = '';
                that._popover.hide();
            }
        });

        ch.shortcuts.add(ch.onkeyenter, this.uid, function (event) {
            that._setQuery(event);
        });

        ch.shortcuts.add(ch.onkeyesc, this.uid, function () {
            that.hide();
            that._el.value = that._originalQuery;
        });

        ch.shortcuts.add(ch.onkeyuparrow, this.uid, function () {
            var value;

            // change the selected value & stores the future HTMLInputElement value
            if (that._selected === null) {
                that._selected = that._suggestionsQuantity -1;
                value = that._suggestions[that._selected];
            } else if (that._selected <= 0) {
                that._selected = null;
                value = that._currentQuery;
            } else {
                that._selected -= 1;
                value = that._suggestions[that._selected];
            }

            that._toogleSelection();

            if (!that._options.html) {
                that._el.value = value;
            }
        });

        ch.shortcuts.add(ch.onkeydownarrow, this.uid, function () {
            var value;

            // change the selected value & stores the future HTMLInputElement value
            if (that._selected === null) {
                that._selected = 0;
                value = that._suggestions[that._selected];
            } else if (that._selected >= that._suggestionsQuantity - 1) {
                that._selected = null;
                value = that._currentQuery;
            } else {
                that._selected += 1;
                value = that._suggestions[that._selected];
            }

            that._toogleSelection();

            if (!that._options.html) {
                that._el.value = value;
            }
        });

        var mousedownHandler = function (event) {

            if (event.target.nodeName === 'I' && !that._options.html) {
                ch.util.prevent(event);
                that._el.value = that._suggestions[that._selected];
                that.emit('typing', that._el.value);
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

        this.on('disable', function () {

            if (that.isShown()) {
                that.hide();
                that._el.blur();
            }

        });

        this.on('typing', function (currentQuery) {
            if (that._enabled) {
                that._currentQuery = currentQuery;
                that.$trigger.addClass(that._options.loadingClass);
            }
        });

        // behavior binding
        this.$trigger
            .attr({
                'aria-autocomplete': 'list',
                'aria-haspopup': 'true',
                'aria-owns': this.$container[0].id,
                'autocomplete': 'off'
            })
            .on('focus.' + this.name, function (event) {
                if (that._enabled) {
                    that._originalQuery = that._el.value;

                    that.$trigger.on(ch.onkeyinput, function (event) {
                    // when the user writes
                        window.clearTimeout(that._stopTyping);
                        that._stopTyping = window.setTimeout(function () {
                                that.emit('typing', that._el.value);
                        }, 400);

                    });
                }

            })
            .on('blur.' + this.name, function (event) {
                if (that._enabled) {
                    that.hide();
                    that.$trigger.off(ch.onkeyinput);
                }
            });

        return this;
    };

    /**
     * It sets to the input the selected query. It emits a 'select' event.
     * @memberof! ch.AutoComplete.prototype
     * @function
     * @private
     */
    AutoComplete.prototype._setQuery = function (event) {

        window.clearTimeout(this._stopTyping);

        if (this._selected === null) {
            return this;
        }

        ch.util.prevent(event);

        if (!this._options.html) {
            this._el.value = this._suggestions[this._selected];
        }

        this.emit('select', event);
        this._el.blur();

        return this;
    };

    /**
     * It highlight items adding the 'ch-autoComplete-selected' to the class attribute.
     * @memberof! ch.AutoComplete.prototype
     * @function
     * @private
     */

    AutoComplete.prototype._toogleSelection = function () {
        var id = '#' + this.$container[0].id,
            current = (this._selected === null) ? null : (this._selected + 1);

        $(id + ' [aria-posinset].ch-autoComplete-selected').removeClass('ch-autoComplete-selected');
        $(id + ' [aria-posinset="'+ current +'"]').addClass('ch-autoComplete-selected');

        return this;

    }

    /**
     * Shows component's content.
     * @memberof! ch.AutoComplete.prototype
     * @function
     * @private
     * @returns itself
     */
    AutoComplete.prototype._show = function () {
        this._popover.show();
        this.emit('show');
        return this;
    };

    /**
     * Add suggestions to be shown.
     * @memberof! ch.AutoComplete.prototype
     * @public
     * @function
     * @returns itself
     */
    AutoComplete.prototype.suggest = function (suggestions) {

        var that = this,
            items = [],
            query = this._el.value.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1"),
            matchedRegExp = new RegExp('(' + query + ')', 'ig'),
            totalItems = 0,
            $extraItems,
            extraItems = [];

        this.$trigger.removeClass(that._options.loadingClass);

        if (suggestions.length === 0 || query === '') {
            this._popover.hide();
            return this;
        }

        if (!this._popover.isShown() && document.activeElement === this._el) {
            this._show();
        }

        this._$suggestionsList[0].innerHTML = '';
        this._suggestions = suggestions;

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
     * Hides component's content.
     * @memberof! ch.AutoComplete.prototype
     * @public
     * @function
     * @returns itself
     */
    AutoComplete.prototype.hide = function () {
        this.emit('hide');
        this._popover.hide();
        return this;
    };

    /**
     * Hides component's content.
     * @memberof! ch.AutoComplete.prototype
     * @public
     * @function
     * @returns {Boolean}
     */
    AutoComplete.prototype.isShown = function () {
        return this._popover.isShown();
    };

    /**
     * Destroys an AutoComplete instance.
     * @public
     * @function
     */
    AutoComplete.prototype.destroy = function () {

        this._popover.destroy();

        ch.shortcuts.off(this.uid);

        this.$trigger
            .off('.autoComplete')
            .removeAttr('autocomplete')
            .removeAttr('aria-autocomplete')
            .removeAttr('aria-haspopup')
            .removeAttr('aria-owns');

        parent.destroy.call(this);
    };

    ch.factory(AutoComplete);

}(this, this.ch.$, this.ch));
