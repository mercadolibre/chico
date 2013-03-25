(function (window, ch) {
    'use strict';

    if (window.ch === undefined) {
        throw new window.Error('Expected ch namespace defined.');
    }

    /**
     * Accordion lets you organize the content like folds.
     * @memberOf
     * @constructor
     * @interface
     * @augments ch.Menu
     * @requires ch.Expandable
     * @see ch.Widget
     * @see ch.Menu
     * @see ch.Expandable
     * @param {Object} [options] Object with configuration properties.
     * @param {Number} [options.selected] Selects a child that will be open when component was loaded.
     * @param {Boolean} [options.fx] Enable or disable UI effects. By default, the effects are disable.
     * @returns itself
     * @exampleDescription Create a new Accordion.
     * @example
     * var widget = $('.example').accordion();
     * @exampleDescription Create a new Accordion with configuration.
     * @example
     * var widget = $('.example').accordion({
     *     'selected': 2,
     *     'fx': true
     * });
     */
    function Accordion($el, options) {
        options = options || {};
        options.accordion = true;
        options.fx = (options.fx !== undefined) ? options.fx : 'slideDown';
        options.classes = options.classes || 'ch-accordion';

        return new ch.Menu($el, options);
    }

    /**
     * The name of the widget. All instances are saved into a 'map', grouped by its name. You can reach for any or all of the components from a specific name with 'ch.instances'.
     * @public
     * @type {String}
     */
    Accordion.prototype.name = 'accordion';

    /**
     * Returns a reference to the Constructor function that created the instance's prototype.
     * @public
     * @function
     */
    Accordion.prototype.constructor = Accordion;

    /**
     * Factory
     */
    ch.factory(Accordion, ch.Menu.prototype._normalizeOptions);

}(this, this.ch));