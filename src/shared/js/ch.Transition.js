(function (window, $, ch) {
    'use strict';

    if (ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Transition lets you give feedback to the users when their have to wait for an action.
     * @name Transition
     * @class Transition
     * @interface
     * @augments ch.Floats
     * @requires ch.Modal
     * @memberOf ch
     * @param {Object} [conf] Object with configuration properties.
     * @param {String} [conf.content] Sets content by: static content, DOM selector or URL. By default, the content is the href attribute value  or form's action attribute.
     * @param {Number || String} [conf.width] Sets width property of the component's layout. By default, the width is "500px".
     * @param {Number || String} [conf.height] Sets height property of the component's layout. By default, the height is elastic.
     * @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
     * @param {Boolean} [conf.cache] Enable or disable the content cache. By default, the cache is enable.
     * @param {String} [conf.closable] Sets the way (true, "button" or false) the Transition close. By default, the transition close true.
     * @returns itself
     * @factorized
     * @see ch.Tooltip
     * @see ch.Layer
     * @see ch.Zoom
     * @see ch.Modal
     * @see ch.Floats
     * @exampleDescription Create a transition.
     * @example
     * var widget = $("a.example").transition();
     * @exampleDescription Create a transition with configuration.
     * @example
     * var widget = $("a.example").transition({
     *     "content": "Some content here!",
     *     "width": "500px",
     *     "height": 350,
     *     "cache": false,
     *     "fx": false
     * });
     */
    function Transition($el, options) {

        if (options === undefined && $el !== undefined && !ch.util.is$($el)) {
            options = $el;
            $el = undefined;
        }

        options = $.extend(ch.util.clone(this._defaults), options);

        options.content = $('<div class="ch-loading-big"></div><p>' + options.content + '</p>');

        return new ch.Modal($el, options);
    }

    Transition.prototype._defaults = $.extend(ch.util.clone(ch.Modal.prototype._defaults), {
        '_className': 'ch-transition ch-box-lite',
        'ariaRole': 'alert',
        'hiddenby': 'none',
        'content': 'Please wait...'
    });

    Transition.prototype.name = 'transition';
    Transition.prototype.constructor = Transition;

    /**
     * Factory
     */
    ch.factory(Transition, ch.Modal.prototype._normalizeOptions);

}(this, this.ch.$, this.ch));