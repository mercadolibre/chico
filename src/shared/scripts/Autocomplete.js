(function (window, ch) {
    'use strict';


    function highlightSuggestion(target) {
        var posinset;

        Array.prototype.forEach.call(this._suggestionsList.childNodes, function(e) {
            if(e.contains(target)){
                posinset = parseInt(target.getAttribute('aria-posinset'), 10) - 1;
            }
        });

        this._highlighted = (typeof posinset === 'number') ? posinset : null;

        this._toogleHighlighted();

        return this;
    }

    var specialKeyCodeMap = {
        9: 'tab',
        27: 'esc',
        37: 'left',
        39: 'right',
        13: 'enter',
        38: 'up',
        40: 'down'
    };

    /**
     * Autocomplete Component shows a list of suggestions for a HTMLInputElement.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Popover
     * @param {HTMLElement} [el] A HTMLElement to create an instance of ch.Autocomplete.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.loadingClass] Default: "ch-autocomplete-loading".
     * @param {String} [options.highlightedClass] Default: "ch-autocomplete-highlighted".
     * @param {String} [options.itemClass] Default: "ch-autocomplete-item".
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization. Default: "ch-box-lite ch-autocomplete".
     * @param {Number} [options.keystrokesTime] Default: 150.
     * @param {Boolean} [options.html] Default: false.
     * @param {String} [options.side] The side option where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "left".
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horitontally.
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically.
     * @param {String} [options.positioned] The positioned option specifies the type of positioning used. You must use: "absolute" or "fixed". Default: "absolute".
     * @param {(Boolean | String)} [options.wrapper] Wrap the reference element and place the container into it instead of body. When value is a string it will be applied as additional wrapper class. Default: false.
     *
     * @returns {autocomplete}
     * @example
     * // Create a new AutoComplete.
     * var autocomplete = new AutoComplete([el], [options]);
     * @example
     * // Create a new AutoComplete with configuration.
     * var autocomplete = new AutoComplete('.my-autocomplete', {
     *  'loadingClass': 'custom-loading',
     *  'highlightedClass': 'custom-highlighted',
     *  'itemClass': 'custom-item',
     *  'addClass': 'carousel-cities',
     *  'keystrokesTime': 600,
     *  'html': true,
     *  'side': 'center',
     *  'align': 'center',
     *  'offsetX': 0,
     *  'offsetY': 0,
     *  'positioned': 'fixed'
     * });
     */
    function Autocomplete(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Autocomplete is created.
             * @memberof! ch.Autocomplete.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Autocomplete#ready
         * @example
         * // Subscribe to "ready" event.
         * autocomplete.on('ready',function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);

        return this;
    }

    // Inheritance
    tiny.inherits(Autocomplete, ch.Component);

    var parent = Autocomplete.super_.prototype,
        // there is no mouseenter to highlight the item, so it happens when the user do mousedown
        highlightEvent = (tiny.support.touch) ? ch.onpointerdown : 'mouseover';

    /**
     * The name of the component.
     * @type {String}
     */
    Autocomplete.prototype.name = 'autocomplete';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Autocomplete.prototype
     * @function
     */
    Autocomplete.prototype.constructor = Autocomplete;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Autocomplete.prototype._defaults = {
        'loadingClass': 'ch-autocomplete-loading',
        'highlightedClass': 'ch-autocomplete-highlighted',
        'itemClass': 'ch-autocomplete-item',
        'addClass': 'ch-box-lite ch-autocomplete',
        'side': 'bottom',
        'align': 'left',
        'html': false,
        '_hiddenby': 'none',
        'keystrokesTime': 150,
        '_itemTemplate': '<li class="{{itemClass}}"{{suggestedData}}>{{term}}<i class="ch-icon-arrow-up" data-js="ch-autocomplete-complete-query"></i></li>',
        'wrapper': false
    };

    /**
     * Initialize a new instance of Autocomplete and merge custom options with defaults options.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._init = function (el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        // Call to its parent init method
        parent._init.call(this, el, options);

        // creates the basic item template for this instance
        this._options._itemTemplate = this._options._itemTemplate.replace('{{itemClass}}', this._options.itemClass);

        if (this._options.html) {
            // remove the suggested data space when html is configured
            this._options._itemTemplate = this._options._itemTemplate.replace('{{suggestedData}}', '');
        }

        // The component who shows and manage the suggestions.
        this._popover = new ch.Popover({
            'reference': this._el,
            'content': this._suggestionsList,
            'side': this._options.side,
            'align': this._options.align,
            'addClass': this._options.addClass,
            'hiddenby': this._options._hiddenby,
            'width': this._el.getBoundingClientRect().width + 'px',
            'fx': this._options.fx,
            'wrapper': this._options.wrapper
        });

        /**
         * The autocomplete container.
         * @type {HTMLDivElement}
         * @example
         * // Gets the autocomplete container to append or prepend content.
         * autocomplete.container.appendChild(document.createElement('div'));
         */
        this.container = this._popover.container;

        this.container.setAttribute('aria-hidden', 'true');

        /**
         * The autocomplete suggestion list.
         * @type {HTMLUListElement}
         * @private
         */
        this._suggestionsList = document.createElement('ul');
        tiny.addClass(this._suggestionsList, 'ch-autocomplete-list');

        this.container.appendChild(this._suggestionsList);

        /**
         * Selects the items
         * @memberof! ch.Autocomplete.prototype
         * @function
         * @private
         * @returns {autocomplete}
         */

        this._highlightSuggestion = function (event) {
            var target = event.target || event.srcElement,
                item = (target.nodeName === 'LI') ? target : (target.parentNode.nodeName === 'LI') ? target.parentNode : null;

            if (item !== null) {
                highlightSuggestion.call(that, item);
            }

        };

        tiny.on(this.container, highlightEvent, this._highlightSuggestion);


        tiny.on(this.container, ch.onpointertap, function itemEvents(event) {
            var target = event.target || event.srcElement;

            // completes the value, it is a shortcut to avoid write the complete word
            if (target.nodeName === 'I' && !that._options.html) {
                event.preventDefault();
                that._el.value = that._suggestions[that._highlighted];
                that.emit('type', that._el.value);
                return;
            }

            if ((target.nodeName === 'LI' && target.className.indexOf(that._options.itemClass) !== -1) || (target.parentElement.nodeName === 'LI' && target.parentElement.className.indexOf(that._options.itemClass) !== -1)) {
                that._selectSuggestion();
            }
        });

        /**
         * The autocomplete trigger.
         * @type {HTMLElement}
         */
        this.trigger = this._el;

        this.trigger.setAttribute('aria-autocomplete', 'list');
        this.trigger.setAttribute('aria-haspopup', 'true');
        this.trigger.setAttribute('aria-owns', this.container.getAttribute('id'));
        this.trigger.setAttribute('autocomplete', 'off');

        tiny.on(this.trigger, 'focus', function turnon() { that._turn('on'); });
        tiny.on(this.trigger, 'blur', function turnoff() {that._turn('off'); });

        // Turn on when the input element is already has focus
        if (this._el === document.activeElement && !this._enabled) {
            this._turn('on');
        }

        // The number of the selected item or null when no selected item is.
        this._highlighted = null;

        // Collection of suggestions to be shown.
        this._suggestions = [];

        // Used to show when the user cancel the suggestions
        this._originalQuery = this._currentQuery = this._el.value;

        if (this._configureShortcuts !== undefined) {
            this._configureShortcuts();
        }

        return this;
    };

    /**
     * Turns on the ability off listen the keystrokes
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._turn = function (turn) {
        var that = this;

        if (!this._enabled) {
            return this;
        }


        function turnOn() {
            that._currentQuery = that._el.value.trim();

            // when the user writes
            window.clearTimeout(that._stopTyping);

            that._stopTyping = window.setTimeout(function () {

                tiny.addClass(that.trigger, that._options.loadingClass);
                /**
                 * Event emitted when the user is typing.
                 * @event ch.Autocomplete#type
                 * @example
                 * // Subscribe to "type" event with ajax call
                 * autocomplete.on('type', function (userInput) {
                 *      $.ajax({
                 *          'url': '/countries?q=' + userInput,
                 *          'dataType': 'json',
                 *          'success': function (response) {
                 *              autocomplete.suggest(response);
                 *          }
                 *      });
                 * });
                 * @example
                 * // Subscribe to "type" event with jsonp
                 * autocomplete.on('type', function (userInput) {
                 *       $.ajax({
                 *           'url': '/countries?q='+ userInput +'&callback=parseResults',
                 *           'dataType': 'jsonp',
                 *           'cache': false,
                 *           'global': true,
                 *           'context': window,
                 *           'jsonp': 'parseResults',
                 *           'crossDomain': true
                 *       });
                 * });
                 */
                that.emit('type', that._currentQuery);
            }, that._options.keystrokesTime);
        }

        function turnOnFallback(e) {
            if (specialKeyCodeMap[e.which || e.keyCode]) {
                return;
            }
            // When keydown is fired that.trigger still has an old value
            setTimeout(turnOn, 1);
        }

        this._originalQuery = this._el.value;

        // IE8 don't support the input event at all
        // IE9 is the only browser that doesn't fire the input event when characters are removed
        var ua = navigator.userAgent;
        var MSIE = (/(msie|trident)/i).test(ua) ?
            ua.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;

        if (turn === 'on') {
            if (!MSIE || MSIE > 9) {
                tiny.on(this.trigger, ch.onkeyinput, turnOn);
            } else {
                'keydown cut paste'.split(' ').forEach(function(evtName) {
                    tiny.on(that.trigger, evtName, turnOnFallback);
                });
            }
        } else if (turn === 'off') {
            this.hide();
            if (!MSIE || MSIE > 9) {
                tiny.off(this.trigger, ch.onkeyinput, turnOn);
            } else {
                'keydown cut paste'.split(' ').forEach(function(evtName) {
                    tiny.off(that.trigger, evtName, turnOnFallback);
                });
            }
        }

        return this;

    };

    /**
     * It sets to the HTMLInputElement the selected query and it emits a 'select' event.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._selectSuggestion = function () {

        window.clearTimeout(this._stopTyping);

        if (this._highlighted === null) {
            return this;
        }

        if (!this._options.html) {
            this._el.value = this._suggestions[this._highlighted];
        }

        this._el.blur();

        /**
         * Event emitted when a suggestion is selected.
         * @event ch.Autocomplete#select
         * @example
         * // Subscribe to "select" event.
         * autocomplete.on('select', function () {
         *     // Some code here!
         * });
         */
        this.emit('select');

        return this;
    };

    /**
     * It highlights the item adding the "ch-autocomplete-highlighted" class name or the class name that you configured as "highlightedClass" option.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._toogleHighlighted = function () {
        // null is when is not a selected item but,
        // increments 1 _highlighted because aria-posinset starts in 1 instead 0 as the collection that stores the data
        var current = (this._highlighted === null) ? null : (this._highlighted + 1),
            currentItem = this.container.querySelector('[aria-posinset="' + current + '"]'),
            selectedItem = this.container.querySelector('[aria-posinset].' + this._options.highlightedClass);

        if (selectedItem !== null) {
            // background the highlighted item
            tiny.removeClass(selectedItem, this._options.highlightedClass);
        }

        if (currentItem !== null) {
            // highlight the selected item
            tiny.addClass(currentItem, this._options.highlightedClass);
        }

        return this;
    };

    /**
     * Add suggestions to be shown.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @returns {autocomplete}
     * @example
     * // The suggest method needs an Array of strings to work with default configuration
     * autocomplete.suggest(['Aruba','Armenia','Argentina']);
     * @example
     * // To work with html configuration, it needs an Array of strings. Each string must to be as you wish you watch it
     * autocomplete.suggest([
     *  '<strong>Ar</strong>uba <i class="flag-aruba"></i>',
     *  '<strong>Ar</strong>menia <i class="flag-armenia"></i>',
     *  '<strong>Ar</strong>gentina <i class="flag-argentina"></i>'
     * ]);
     */
    Autocomplete.prototype.suggest = function (suggestions) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            items = [],
            matchedRegExp = new RegExp('(' + this._currentQuery.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1') + ')', 'ig'),
            totalItems = 0,
            itemDOMCollection,
            itemTemplate = this._options._itemTemplate,
            suggestedItem,
            term,
            suggestionsLength = suggestions.length,
            el,
            itemSelected = this.container.querySelector('.' + this._options.highlightedClass);

        // hide the loading feedback
        tiny.removeClass(this.trigger, that._options.loadingClass);

        // hides the suggestions list
        if (suggestionsLength === 0) {
            this._popover.hide();

            return this;
        }

        // shows the suggestions list when the is closed and the element is withs focus
        if (!this._popover.isShown() && window.document.activeElement === this._el) {
            this._popover.show();
        }

        // remove the class from the extra added items
        if (itemSelected !== null) {
            tiny.removeClass(itemSelected, this._options.highlightedClass);
        }

        // add each suggested item to the suggestion list
        for (suggestedItem = 0; suggestedItem < suggestionsLength; suggestedItem += 1) {
            // get the term to be replaced
            term = suggestions[suggestedItem];

            // for the html configured component doesn't highlight the term matched it must be done by the user
            if (!that._options.html) {
                term = term.replace(matchedRegExp, '<strong>$1</strong>');
                itemTemplate = this._options._itemTemplate.replace('{{suggestedData}}', ' data-suggested="' + suggestions[suggestedItem] + '"');
            }

            items.push(itemTemplate.replace('{{term}}', term));
        }

        this._suggestionsList.innerHTML = items.join('');

        itemDOMCollection = this.container.querySelectorAll('.' + this._options.itemClass);

        // with this we set the aria-setsize value that counts the total
        totalItems = itemDOMCollection.length;

        // Reset suggestions collection.
        this._suggestions.length = 0;

        for (suggestedItem = 0; suggestedItem < totalItems; suggestedItem += 1) {
            el = itemDOMCollection[suggestedItem];

            // add the data to the suggestions collection
            that._suggestions.push(el.getAttribute('data-suggested'));

            el.setAttribute('aria-posinset', that._suggestions.length);
            el.setAttribute('aria-setsize', totalItems);
        }

        this._highlighted = null;

        this._suggestionsQuantity = this._suggestions.length;

        return this;
    };

    /**
     * Hides component's container.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @returns {autocomplete}
     * @example
     * // Hides the autocomplete.
     * autocomplete.hide();
     */
    Autocomplete.prototype.hide = function () {

        if (!this._enabled) {
            return this;
        }

        this._popover.hide();

        /**
         * Event emitted when the Autocomplete container is hidden.
         * @event ch.Autocomplete#hide
         * @example
         * // Subscribe to "hide" event.
         * autocomplete.on('hide', function () {
         *  // Some code here!
         * });
         */
        this.emit('hide');

        return this;
    };

    /**
     * Returns a Boolean if the component's core behavior is shown. That means it will return 'true' if the component is on and it will return false otherwise.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Execute a function if the component is shown.
     * if (autocomplete.isShown()) {
     *     fn();
     * }
     */
    Autocomplete.prototype.isShown = function () {
        return this._popover.isShown();
    };

    Autocomplete.prototype.disable = function () {
        if (this.isShown()) {
            this.hide();
            this._el.blur();
        }

        parent.disable.call(this);

        return this;
    };

    /**
     * Destroys an Autocomplete instance.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @example
     * // Destroying an instance of Autocomplete.
     * autocomplete.destroy();
     */
    Autocomplete.prototype.destroy = function () {

        tiny.off(this.container, highlightEvent, this._highlightSuggestion);

        this.trigger.removeAttribute('autocomplete');
        this.trigger.removeAttribute('aria-autocomplete');
        this.trigger.removeAttribute('aria-haspopup');
        this.trigger.removeAttribute('aria-owns');

        this._popover.destroy();

        parent.destroy.call(this);

        return;
    };

    ch.factory(Autocomplete);

}(this, this.ch));
