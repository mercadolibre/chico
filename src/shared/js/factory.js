    /**
     * Method in change of expose a friendly interface of the Chico constructors.
     * @memberof ch
     * @param {Object} Klass Direct reference to the constructor from where the $-plugin will be created.
     * @link http://docs.jquery.com/Plugins/Authoring | Authoring
     */
    ch.factory = function (Klass, fn) {
        /**
         * Identification of the constructor, in lowercases.
         * @type {String}
         */
        var name = Klass.prototype.name;

        /**
         * The class constructor exposed directly into the "ch" namespace.
         * @exampleDescription Creating a widget instance by specifying a query selector and a configuration object.
         * @example
         * ch.Widget($('#example'), {
         *     'key': 'value'
         * });
         */
        // Uses the function.name property (non-standard) on the newest browsers OR
        // uppercases the first letter from the identification name of the constructor
        ch[(name.charAt(0).toUpperCase() + name.substr(1))] = Klass;

        /**
         * The class constructor exposed into the "$" namespace.
         * @ignore
         * @exampleDescription Creating a widget instance by specifying a query selector and a configuration object.
         * @example
         * $.widget($('#example'), {
         *     'key': 'value'
         * });
         * @exampleDescription Creating a widget instance by specifying only a query selector. The default options of each widget will be used.
         * @example
         * $.widget($('#example')});
         * @exampleDescription Creating a widget instance by specifying only a cofiguration object. It only works on compatible widgets, when those doesn't depends on a element to be created.
         * @example
         * $.widget({
         *     'key': 'value'
         * });
         * @exampleDescription Creating a widget instance by no specifying parameters. It only works on compatible widgets, when those doesn't depends on a element to be created. The default options of each widget will be used.
         * @example
         * $.widget();
         */
        $[name] = function ($el, options) {
            // Create a new instance of the constructor and return it
            return new Klass($el, options);
        };

        /**
         * The class constructor exposed as a "$" plugin.
         */
        $.fn[name] = function (options) {

            // Collection with each instanced widget
            var widgets = [];

            // Normalize options
            options = (fn !== undefined) ? fn.apply(this, arguments) : options;

            // Analize every match of the main query selector
            $.each(this, function () {
                // Get into the "$" scope
                var $el = $(this),
                    // Try to get the "data" reference to this widget related to the element
                    data = $el.data(name);

                // When this widget isn't related to the element via data, create a new instance and save
                if (data === undefined) {
                    // Save the reference to this instance into the element data
                    data = new Klass($el, options);
                    $el.data(name, data);

                } else {

                    if (data.emit !== undefined) {
                        data.emit('exists', options);
                    }
                }

                // Add the widget reference to the final collection
                widgets.push(data);

            });

            // Return the instance/instances of widgets
            return (widgets.length > 1) ? widgets : widgets[0];
        };
    };