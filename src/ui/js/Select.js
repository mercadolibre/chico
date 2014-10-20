(function (ch, doc, $) {
	'use strict'

    /**
     * Select is a customizable select
     * @memberof ch
     * @constructor
     * @augments ch.Dropdown
     * @param {(jQuerySelector | ZeptoSelector)} $el A jQuery or Zepto Selector to create an instance of ch.Select.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "button".
     * @param {(jQuerySelector | ZeptoSelector)} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(jQuerySelector | ZeptoSelector | HTMLElement | String)} [options.content] The content to be shown into the Select container.
     * @returns {select} Returns a new instance of Select.
     * @example
     * // Create a new Select.
     * var select = new ch.Select($el, [options]);
     * @example
     * // Create a new Select with jQuery or Zepto.
     * var select = $(selector).select([options]);
     * @example
     * // Create a new Select with disabled effects.
     * var select = $(selector).select({
     *     'fx': 'none'
     * });
     * @example
     * // Create a new Select using the shorthand way (content as parameter).
     * var select = $(selector).select('http://ui.ml.com:3040/ajax');
     */
	function Select ($el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init($el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Dropdown is created.
             * @memberof! ch.Dropdown.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Dropdown#ready
         * @example
         * // Subscribe to "ready" event.
         * dropdown.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);

    }  

    // Inheritance
    var parent = ch.util.inherits(Select, ch.Dropdown),
        pointerenter = ch.onpointerenter + '.select';


    function format(str, format) {
        var i = 0,
            total = format.length,
            formatedOptionn;

        for ( i; i < total; i+=1 ) {
            str = str.replace(format[i].regex, format[i].replace);
        }
        
        return str;
     }



    /**
     * The name of the component.
     * @type {String}
     */
    Select.prototype.name = 'select';
    
    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Select.prototype
     * @function
     */
    Select.prototype.construct = Select;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Select.prototype._defaults = $.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-dropdown ch-box-lite ch-select',
        '_ariaRole': 'combobox',
        'fx': 'none',
        'shownby': 'pointertap',
        'hiddenby': 'pointers',
        'offsetY': -1,
        'skin': true,
        'format': false,
        'shortcuts': false
    });

    /**
     * Initialize a new instance of Select and merge custom options with defaults options.
     * @memberof! ch.Select.prototype
     * @function
     * @private
     * @returns {Select}
     */
    Select.prototype._init = function ($el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            options = options || this._defaults,
            /**
             * Creo lo que voy a usar como trigger con mi option:selected
             * Agrego formato en el caso de que exista en la config
             */
            $wrapper = (function () {
                var wrapper = doc.createElement('div'),
                    $selectedOption = $el.find('option:selected'),
                    trigger = doc.createElement('div');
                trigger.innerHTML = options.format ? format($selectedOption[0].innerText, options.format) : $selectedOption[0].innerText;
                trigger.setAttribute('data-value', $selectedOption.attr('value'));

                wrapper.setAttribute('class', 'ch-select-wrapper');
                wrapper.appendChild(trigger);

                return $(wrapper);

            }()),

            /**
             * Agrego lo que voy a usar de content, lo necesito para instanciar un dropdown
             */
            $list = $('<ul class="ch-hide">');

        $wrapper.append($list);
        $wrapper.insertAfter($el);

        // Call to its parent init method
        parent._init.call(this, $wrapper.find('div'), options);
        
        // Overwrites _$navigation of parent
        this._$navigation = (function () {
            var $item;
                
                $el.find('option').each(function (i, e){
                    $item = $('<li>');

                    $item.attr('data-value', e.value);
                    e.getAttribute('disabled') !== null ? $item.attr('data-disabled', 'disabled') : null;
                    e.getAttribute('selected') !== null ? $item.attr('id', 'ch-' + that.name + that.uid + '-selected') : null;

                    $item.html(options.format ? format(e.innerText, options.format) : e.innerText);
                    
                    $list.append($item);
                });

            return $list.find('li');
        }());

        if ($el.attr('disabled')) {

            this.disable();
        }

        // Input hidden save selected option
        this._$input = $('<input type="hidden" value="' + $el.find('option:selected').val() + '" name="' + $el.attr('name') + '">');
        
        this._$input.insertBefore(that.$trigger);

        // Disable and Hide native select
        $el.attr('disabled', 'disabled').addClass('ch-hide').removeAttr('name');

        // Update index of selected item 
        this._selected = $list.find('li[id$="-selected"]').index();

        this.$trigger.removeClass('ch-dropdown-trigger-skin').addClass('ch-select-trigger-skin');
        
        // Item selected by mouseover
        $.each(this._$navigation, function (i, e) {
            $(e).on(pointerenter, function () {
                // Reset last selected
                that._$navigation.removeAttr('id');
                that._$navigation[that._selected = i].setAttribute('id', 'ch-' + that.name + that.uid + '-selected');
            });
        });

        // Add own functionality 
        this.on('show', function () {
            // Bind for li
            $(this.$container).on('click', 'li', function(event){
                event.stopPropagation();

                if (!this.getAttribute('data-disabled')) {
                    // Show selected option as trigger
                    that.$trigger[0].innerHTML = this.innerHTML;
                    // Update value of selected option
                    that._$input[0].setAttribute('value', this.getAttribute('data-value'));
                    that.hide();
                }
            })

            // Save lastSelected
            that.lastSelected = that._selected;
            $(doc).off('click.select');
        })

        this.on('hide', function () {
            $(this.$container).off('click');
        })

        this._navigationShortcuts();

    };

    /**
     * Highlights the current option when navigates by keyboard.
     * @function
     * @private
     */
    Select.prototype._highlightOption = function (key) {

        if(this.lastSelected !== undefined && this._selected === -1) {
           this._selected = this.lastSelected;
        }

        parent._highlightOption.call(this, key);

    };

    /**
     * Add handlers to manage the keyboard on Dropdown navigation.
     * @function
     * @private
     */
    Select.prototype._navigationShortcuts = function () {
    	/**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */

        var that = this;

        parent._navigationShortcuts.call(this)

        ch.shortcuts.add(ch.onkeyenter, this.uid, function (event){
            
            if(that.lastSelected !== undefined && that._selected === -1) {
               that._selected = that.lastSelected;
            }
            var selectedOption = that._$navigation[that._selected];

            if (!selectedOption.getAttribute('data-disabled')) {
                that.$trigger[0].innerHTML = selectedOption.innerHTML;
                that._$input.val(selectedOption.value);
                that.hide();
            }
        });

       	this.once('destroy', function () {
            ch.shortcuts.remove(ch.onkeyenter, that.uid);
        });

        return this;
    };

    /**
     * Enables a Select instance.
     * @memberof! ch.Select.prototype
     * @function
     * @returns {select}
     * @example
     * // Enable a select
     * select.enable();
     */
    Select.prototype.enable = function () {

        this.$trigger.removeAttr('data-disabled');
        this._$input.removeAttr('disabled');

        parent.enable.call(this);

        return this;
    };

    /**
     * Disables a Select instance.
     * @memberof! ch.Select.prototype
     * @function
     * @returns {select}
     * @example
     * // Disable a select
     * select.disable();
     */
    
    Select.prototype.disable = function () {
        
        this.$trigger.attr('data-disabled', 'disabled');
        this._$input.attr('disabled', 'disabled');

        parent.disable.call(this);

        return this;
    };

    /**
     * Destroys a Select instance.
     * @memberof! ch.Select.prototype
     * @function
     * @returns {select}
     * @example
     * // Destroy a select
     * select.destroy();
     * // Empty the select reference
     * select = undefined;
     */
    Select.prototype.destroy = function () {

        parent.destroy.call(this);

        return;
    };

    ch.factory(Select);

}(this.ch, this.document, this.$));