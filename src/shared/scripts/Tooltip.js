(function (ch) {
    'use strict';

    /**
     * Improves the native tooltips.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Tooltip.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointerenter".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointerleave".
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "left".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 10.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '<div class="ch-loading ch-loading-centered"></div>'.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the Tooltip container.
     * @returns {tooltip} Returns a new instance of Tooltip.
     * @example
     * // Create a new Tooltip.
     * var tooltip = new ch.Tooltip(document.querySelector('.trigger'), [options]);
     * @example
     * // Create a new Tooltip using the shorthand way (content as parameter).
     * var tooltip = new ch.Tooltip(document.querySelector('.trigger'), {'content': 'http://ui.ml.com:3040/ajax'});
     */
    function Tooltip(el, options) {

        // TODO: Review what's going on here with options
        /*
        if (options === undefined && el !== undefined && el.nodeType !== undefined) {
            options = el;
            el = undefined;
        }
        */

        options = tiny.extend(tiny.clone(this._defaults), options);

        return new ch.Layer(el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Tooltip.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var tooltip = $(selector).data('tooltip');
     */
    Tooltip.prototype.name = 'tooltip';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Tooltip.prototype
     * @function
     */
    Tooltip.prototype.constructor = Tooltip;

    /**
     * Configuration by default.
     * @memberof! ch.Tooltip.prototype
     * @type {Object}
     * @private
     */
    Tooltip.prototype._defaults = tiny.extend(tiny.clone(ch.Layer.prototype._defaults), {
        '_className': 'ch-tooltip ch-cone'
    });

    ch.factory(Tooltip, ch.Layer.prototype._normalizeOptions);

}(this.ch));
